import Image from "next/image";
import { InMemoryPlantRepository } from "@/features/adoption/infra/memoryRepositories";

export default async function Home() {
  const repo = new InMemoryPlantRepository();
  const plants = await repo.list();

  const toProxied = (src: string | null | undefined) => {
    if (!src) return src ?? "";
    // Si es una URL http/https, pásala por el proxy interno.
    if (/^https?:\/\//i.test(src)) {
      return `/api/image?url=${encodeURIComponent(src)}`;
    }
    // Para rutas locales (/public) u otros esquemas, dejar igual.
    return src;
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-5xl">
        <h1 className="text-3xl font-semibold">Vivero Municipal de Bagua</h1>
        <p className="text-gray-700">Adopta una planta y contribuye a una ciudad más verde.</p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="/adoption"
          >
            Adopta una planta
          </a>
        </div>

        <section className="w-full mt-4">
          <h2 className="sr-only">Plantas disponibles</h2>
          {plants.length === 0 ? (
            <p className="text-gray-500">No hay plantas disponibles por ahora.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {plants.map((p) => (
                <li key={p.id} className="">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-black/10 dark:border-white/15 bg-gray-50">
          {p.imageUrl ? (
                      <Image
            src={toProxied(p.imageUrl)}
                        alt={p.commonName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium leading-tight">{p.commonName}</h3>
                    {p.scientificName && (
                      <p className="text-xs text-gray-500 italic">{p.scientificName}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
