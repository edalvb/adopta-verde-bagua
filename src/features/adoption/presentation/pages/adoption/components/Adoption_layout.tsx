"use client";
import { useAdoption } from "../Adoption_context";
import { useAdoptionState } from "../adoption_states";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adoptionSchema } from "../Adoption_controller";
import Image from "next/image";

type FormData = {
  plantId: string;
  plantCommonName: string;
  adopterName: string;
  phone: string;
  address?: string;
  city?: string;
  reason: string;
  consent: boolean;
};

export function AdoptionLayout() {
  const { controller } = useAdoption();
  const { plants, isLoading, error } = useAdoptionState((s) => s);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(adoptionSchema) });

  const onSubmit = handleSubmit(async (data: FormData) => {
    await controller.submit(data);
  });

  const plantId = watch("plantId");
  const selected = plants.find((p) => p.id === plantId);

  const toProxied = (src: string | null | undefined) => {
    if (!src) return src ?? "";
    if (/^https?:\/\//i.test(src)) {
      return `/api/image?url=${encodeURIComponent(src)}`;
    }
    return src;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Adopta una planta</h1>
      {isLoading && <p>Cargando plantas…</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label className="block mb-1">Planta</label>
          <select
            className="w-full border rounded p-2"
            {...register("plantId")}
            onChange={(e) => {
              const id = e.target.value;
              const p = plants.find((x) => x.id === id);
              setValue("plantCommonName", p?.commonName ?? "");
            }}
          >
            <option value="">Seleccione una planta</option>
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.commonName}
              </option>
            ))}
          </select>
          {errors.plantId && <p className="text-sm text-red-600">Seleccione una planta</p>}
        </div>
        <input type="hidden" {...register("plantCommonName")} />

        <div>
          <label className="block mb-1">Nombre</label>
          <input className="w-full border rounded p-2" {...register("adopterName")} />
          {errors.adopterName && <p className="text-sm text-red-600">Ingrese su nombre</p>}
        </div>
        <div>
          <label className="block mb-1">Teléfono</label>
          <input className="w-full border rounded p-2" {...register("phone")} />
          {errors.phone && <p className="text-sm text-red-600">Ingrese un teléfono válido</p>}
        </div>
        <div>
          <label className="block mb-1">Dirección</label>
          <input className="w-full border rounded p-2" {...register("address")} />
        </div>
        <div>
          <label className="block mb-1">Ciudad</label>
          <input className="w-full border rounded p-2" {...register("city")} />
        </div>
        <div>
          <label className="block mb-1">Motivo de adopción</label>
          <textarea className="w-full border rounded p-2" rows={4} {...register("reason")} />
          {errors.reason && <p className="text-sm text-red-600">Explique su motivo (mín. 10 caracteres)</p>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("consent")} />
          <span>Acepto que mis datos sean compartidos con el vivero para gestión de la adopción.</span>
        </div>
        {errors.consent && <p className="text-sm text-red-600">Debe aceptar el consentimiento</p>}

        <button className="px-4 py-2 rounded bg-black text-white" type="submit">
          Enviar por WhatsApp
        </button>
      </form>
      {selected && (
        <div className="border rounded p-4">
          <h2 className="font-medium">Seleccionada: {selected.commonName}</h2>
          {selected.scientificName && <p className="text-sm text-gray-600">{selected.scientificName}</p>}
          {selected.description && <p className="mt-2 text-sm">{selected.description}</p>}
          {selected.imageUrl && (
            <div className="relative w-full mt-3 aspect-[4/3] overflow-hidden rounded border border-black/10">
              <Image
                src={toProxied(selected.imageUrl)}
                alt={selected.commonName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
