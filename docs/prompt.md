# Prompt (útil para pegar en ChatGPT / Copilot / ticket de GitHub / README)

Eres un desarrollador **senior full-stack**. Implementa una aplicación web en **Next.js (TypeScript)** cuya finalidad es presentar el *Vivero Municipal de Bagua* y permitir que ciudadanos **adopten una planta** con un formulario que **envíe la información al WhatsApp** del encargado del vivero y, opcionalmente, la persista (si se requiere) en **Supabase**. La arquitectura debe ser **Hexagonal (Ports & Adapters)** y seguir principios de **Clean Code / SOLID**. Si **solo es necesario Supabase**, debe usarse como backend (Postgres + Auth + Edge Functions), y no introducir servicios innecesarios.

## Objetivo funcional

1. Página pública que muestre información del vivero, listado de plantas disponibles y cómo adoptar.
2. Formulario de “Adopta una planta” que recolecte datos del ciudadano y motivo de adopción.
3. Al enviar:

   * **Mínimo viable:** abrir WhatsApp en el dispositivo del usuario con un mensaje pre-llenado hacia el teléfono del encargado (cliente → wa.me).
   * **Robusto (opcional):** enviar el mensaje desde el servidor a través de WhatsApp Business API (o proveedor como Twilio), y almacenar el registro en Supabase.
4. Guardar registros en Supabase solo si se requiere (analítica / historial / seguimiento).
5. Protección contra spam (honeypot / reCAPTCHA opcional).
6. Internacionalización: texto principal en español (es\_PE).

## Requisitos no funcionales

* TypeScript estricto (no `any`), ESLint + Prettier.
* Accesibilidad (WCAG básico), SEO (meta tags).
* Variables de entorno robustas (no exponer claves).
* Implementación clara de puertos/adapters para que el dominio no dependa de Next.js o Supabase.

## Arquitectura (Hexagonal) — mapping práctico

* **Domain (core)**: entidades (`Plant`, `Adoption`), reglas de negocio (validaciones, políticas de adopción), casos de uso (`RequestAdoption`, `ListPlants`).
* **Application (ports/interfaces)**: `AdoptionRepository`, `PlantRepository`, `WhatsAppNotifier`, `EventPublisher`.
* **Infrastructure (adapters)**:

  * `SupabaseAdoptionRepository` (opcional) — implementa persistencia en Postgres.
  * `WaMeWhatsAppAdapter` — genera `https://wa.me/<phone>?text=<encoded>` (cliente).
  * `WhatsAppBusinessAdapter` — llama a WhatsApp Business API / Twilio (servidor) (opcional).
  * Next.js API route / Edge Function que actúa como adapter: recibe petición del frontend, valida y orquesta caso de uso.
* **Presentation (UI)**: Next.js (app router o pages), componentes React, formularios con `react-hook-form` + `zod` para validación.

## Modelo de datos (Supabase / Postgres) — SQL de ejemplo

```sql
-- plants: catálogo de plantas del vivero
create table plants (
  id uuid primary key default gen_random_uuid(),
  common_name text not null,
  scientific_name text,
  description text,
  image_url text,
  available boolean default true,
  created_at timestamptz default now()
);

-- adoptions: registros de solicitudes de adopción
create table adoptions (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references plants(id),
  adopter_name text not null,
  phone text not null,
  address text,
  city text,
  reason text,
  consent boolean not null default true, -- checkbox de privacidad
  status text not null default 'requested', -- requested|contacted|completed|cancelled
  metadata jsonb,
  created_at timestamptz default now()
);

-- settings: teléfono del encargado (opcional)
create table settings (
  key text primary key,
  value text
);
```

## API / Endpoints (ejemplos)

* `GET /api/plants` — lista plantas (puede usar cache).
* `POST /api/adopt` — recibe el formulario (server-side validation zod).

  * Flow (cliente mínimo): servidor devuelve `waMeUrl` preencoded para que cliente abra `window.location = waMeUrl`.
  * Flow (robusto): servidor usa `WhatsAppBusinessAdapter` para enviar mensaje al encargado y responde con success/failure.
* `GET /api/admin/adoptions` — listado protegido para seguimiento (opcional).

## Formulario — campos recomendados y validaciones

* `plantId` (required)
* `adopter_name` (required, min 2)
* `phone` (required, internacional o local)
* `address` (optional)
* `city` (optional)
* `reason` (required, min 10 chars)
* `consent` (required, checkbox: "Acepto que mis datos sean compartidos con el vivero para gestión de la adopción.")

## Plantilla de mensaje WhatsApp (ejemplo, pre-llenado)

```
Adopción de planta - Vivero Municipal Bagua
Nombre: {adopter_name}
Teléfono: {phone}
Planta: {plant_common_name} ({plant_id})
Dirección: {address}
Ciudad: {city}
Motivo: {reason}
Fecha: {created_at}
```

**wa.me link example** (cliente):

```
https://wa.me/595XXXXXXXX?text=URL_ENCODED(Mensaje_de_arriba)
```

Use `encodeURIComponent` sobre el texto.

## Integración WhatsApp — opciones y recomendaciones

1. **Solución mínima / sin backend**: generar `wa.me` con mensaje pre-llenado y redirigir al usuario. Ventaja: sin necesidad de clave API, instantáneo. Limitación: requiere que el usuario abra WhatsApp y envíe manualmente; no guarda registro automáticamente.
2. **Solución con persistencia + notificación cliente**: `POST /api/adopt` guarda en Supabase (service\_role key en server) y devuelve `wa.me` para que usuario envíe. Así quedan registros.
3. **Solución robusta (servidor → WhatsApp)**: usar WhatsApp Business API o un proveedor (Twilio). Implementar `WhatsAppBusinessAdapter` que llame al proveedor cuando se cree una adopción (via Edge Function o Next.js server route). **Nota**: esto requiere cuenta empresarial y credenciales; puede incurrir en costos.

## Puertos / Interfaces TypeScript (ejemplo)

```ts
// domain/ports.ts
export interface AdoptionRepository {
  save(adoption: Adoption): Promise<Adoption>;
  findById(id: string): Promise<Adoption | null>;
}
export interface WhatsAppNotifier {
  notifyManager(message: string): Promise<void>;
}
```

Implementar adapters separados y registrarlos en la composición raíz (composition root).

## Seguridad y privacidad

* Guardar sólo datos necesarios y marcar el consentimiento.
* En Supabase: usar RLS (si se expone), o mantener claves de servicio sólo en servidor.
* En texto del WhatsApp, evitar enviar datos sensibles innecesarios.
* Logs mínimos, retención definida (ej.: 1 año).

## Variables de entorno sugeridas

```
NEXT_PUBLIC_MANAGER_PHONE=595XXXXXXXX   # si se usa wa.me en cliente
SUPABASE_URL=
SUPABASE_ANON_KEY=          # sólo cliente si es necesario
SUPABASE_SERVICE_ROLE_KEY=  # sólo en server
WHATSAPP_API_URL=           # opcional
WHATSAPP_API_TOKEN=         # opcional (server only)
```

## Criterios de aceptación (mínimos)

1. Usuario puede ver plantas y completar formulario.
2. Validaciones activas y mensajes amigables.
3. Al enviar, si se opta por la solución mínima, se abre WhatsApp con el texto pre-llenado al número del encargado.
4. Si se habilita persistencia, el registro queda almacenado en `adoptions` en Supabase.
5. Código organizado en capas (domain, application, infra, presentation).
6. Tests unitarios para la lógica de creación de adopción y generación de mensaje WhatsApp.

## Entregables

* Repo Git con históricos y branch `main` estable.
* README con instrucciones de setup (env vars, ``npm`), migraciones SQL.
* Scripts de despliegue (Vercel / Supabase).
* Documentación breve sobre cómo cambiar el número del encargado (settings table o variable de entorno).

---

# Bloque final listo para copiar (prompt compacto para la IA o desarrollador)

```
Eres un desarrollador senior. Construye una app Next.js (TypeScript) para el Vivero Municipal de Bagua que permita listar plantas y "adoptar una planta" mediante un formulario. Aplica Arquitectura Hexagonal y Clean Code. Requisitos clave:
- UI en Next.js (App Router o Pages) con React + react-hook-form + zod.
- Dominio independiente (entidades: Plant, Adoption) y puertos: AdoptionRepository, WhatsAppNotifier.
- Infra: usar Supabase (Postgres) SOLO si es necesario para persistencia; de lo contrario no añadir backend extra.
- Implementar dos flujos para el envío a WhatsApp:
  1) Mínimo: cliente genera `https://wa.me/<managerPhone>?text=<encoded message>` y abre WhatsApp.
  2) Opcional: servidor (Next.js API / Supabase Edge Function) envía con WhatsApp Business API/Twilio.
- Guardar en Supabase `adoptions` si se requiere historial. Incluir consentimiento del usuario.
- Seguridad: variables de entorno para claves, RLS si se expone, no exponer `service_role` al cliente.
- Tests unitarios (domain), e2e (adopción).
- Entregables: repo con README, migraciones SQL, scripts de deploy, pruebas automatizadas.

Incluye: SQL para tables `plants`, `adoptions`, template de mensaje WhatsApp, variables de entorno y criterios de aceptación. Implementa adapters concretos: `SupabaseAdoptionRepository`, `WaMeWhatsAppAdapter`, y `WhatsAppBusinessAdapter` (opcional). Mantén el dominio puro y separado de Next.js.

Prioriza una solución que funcione sin costos extra (wa.me) y documenta los pasos para migrar a envío servidor si el municipio adquiere WhatsApp Business API.
```