// Image proxy endpoint to safely load remote images from arbitrary sources.
// Usage with next/image:
// <Image src={`/api/image?url=${encodeURIComponent(remoteUrl)}`} width={...} height={...} alt="..." />
//
// Safeguards:
// - Only http/https protocols
// - Block localhost, private IP ranges, and IPv6 literals
// - Enforce max size (via Content-Length or buffered read)
// - Require image/* content-type
// - Cache headers for CDN/browser

export const runtime = "edge"; // Use Web Streams API and fast cold starts

const MAX_BYTES = 5 * 1024 * 1024; // 5MB hard limit
const REQUEST_TIMEOUT_MS = 8000; // 8s network timeout

function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  // Obvious local/dev hostnames
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal")
  )
    return true;

  // Block IPv6 literals (conservative)
  if (h === "::1" || h.includes(":") || h.startsWith("[")) return true;

  // Block private/reserved IPv4 ranges
  const ipv4Match = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    // 10.0.0.0/8
    if (a === 10) return true;
    // 127.0.0.0/8
    if (a === 127) return true;
    // 0.0.0.0/8
    if (a === 0) return true;
    // 169.254.0.0/16
    if (a === 169 && b === 254) return true;
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16
    if (a === 192 && b === 168) return true;
    // 100.64.0.0/10 (CGNAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
  }
  return false;
}

function parseAndValidateUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (isBlockedHostname(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

function pickImageContentType(remoteContentType: string | null): string | null {
  if (!remoteContentType) return null;
  const ct = remoteContentType.split(";")[0].trim().toLowerCase();
  if (!ct.startsWith("image/")) return null;
  return ct;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");
  if (!rawUrl) {
    return new Response(JSON.stringify({ error: "Missing 'url' query parameter" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const url = parseAndValidateUrl(rawUrl);
  if (!url) {
    return new Response(JSON.stringify({ error: "Invalid or blocked URL" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let upstream: Response;
  try {
    upstream = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      // Avoid coupling to Next fetch cache; rely on Cache-Control below
      cache: "no-store",
      signal: controller.signal,
      headers: {
        // Basic UA to avoid some CDNs blocking requests
        "user-agent": "adopta-verde-bagua-image-proxy/1.0 (+https://github.com/edalvb/adopta-verde-bagua)",
        accept: "image/avif,image/webp,image/apng,image/*;q=0.8,*/*;q=0.5",
      },
    });
  } catch (e) {
    clearTimeout(timeout);
    return new Response(JSON.stringify({ error: "Upstream fetch failed" }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: "Upstream returned an error", status: upstream.status }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  const contentType = pickImageContentType(upstream.headers.get("content-type"));
  if (!contentType) {
    return new Response(JSON.stringify({ error: "Unsupported content-type" }), {
      status: 415,
      headers: { "content-type": "application/json" },
    });
  }

  const lenHeader = upstream.headers.get("content-length");
  if (lenHeader) {
    const len = Number(lenHeader);
    if (!Number.isNaN(len) && len > MAX_BYTES) {
      return new Response(JSON.stringify({ error: "Image too large" }), {
        status: 413,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // If content-length is unknown, buffer up to MAX_BYTES to enforce the limit.
  if (!lenHeader) {
    const reader = upstream.body?.getReader();
    if (!reader) {
      return new Response(JSON.stringify({ error: "No upstream body" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > MAX_BYTES) {
          try {
            await reader.cancel();
          } catch {}
          return new Response(JSON.stringify({ error: "Image too large" }), {
            status: 413,
            headers: { "content-type": "application/json" },
          });
        }
        chunks.push(value);
      }
    }
    const body = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      body.set(c, offset);
      offset += c.byteLength;
    }
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": contentType,
        "content-length": String(total),
        // CDN/browser caching
        "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  }

  // Known content-length and within limit: stream through.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": contentType,
      // CDN/browser caching
      "cache-control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
