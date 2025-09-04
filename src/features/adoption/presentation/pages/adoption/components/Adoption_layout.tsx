"use client";
import { useAdoption } from "../Adoption_context";
import { useAdoptionState } from "../adoption_states";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adoptionSchema } from "../Adoption_controller";
import Image from "next/image";
import { toProxied } from "@/lib/imageProxy";
import { Navbar } from "@/app/components/Navbar";

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

  return (
    <div className="min-h-screen font-inter py-8">
      {/* Header Navigation */}
      <Navbar showBackButton={true} />

      <div className="max-w-4xl mx-auto px-4 pt-20">
        {/* Title Section */}
        <div className="glass-card p-8 mb-8 text-center">
          <h1 className="text-4xl font-poppins font-bold text-green-800 mb-4">
            Adopta una planta 🌱
          </h1>
          <p className="text-green-700 text-lg">
            Completa el formulario para adoptar tu planta favorita y contribuir a un Bagua más verde
          </p>
        </div>

        {isLoading && (
          <div className="glass-card p-6 text-center mb-6">
            <p className="text-green-600">Cargando plantas disponibles...</p>
          </div>
        )}
        
        {error && (
          <div className="glass-card p-6 text-center mb-6 border-red-200">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-poppins font-semibold text-green-800 mb-6">
              Información de adopción
            </h2>
            
            <form className="space-y-6" onSubmit={onSubmit} noValidate>
              <div>
                <label className="block mb-2 font-medium text-green-800">
                  Selecciona tu planta
                </label>
                <select
                  className="glass-input w-full p-3 text-green-800 placeholder-green-600"
                  {...register("plantId")}
                  onChange={(e) => {
                    const id = e.target.value;
                    const p = plants.find((x) => x.id === id);
                    setValue("plantCommonName", p?.commonName ?? "");
                  }}
                >
                  <option value="">Elige una planta de la lista</option>
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.commonName}
                    </option>
                  ))}
                </select>
                {errors.plantId && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50/50 p-2 rounded">
                    Por favor selecciona una planta
                  </p>
                )}
              </div>
              
              <input type="hidden" {...register("plantCommonName")} />

              <div>
                <label className="block mb-2 font-medium text-green-800">
                  Tu nombre completo
                </label>
                <input 
                  className="glass-input w-full p-3 text-green-800 placeholder-green-600" 
                  placeholder="Ingresa tu nombre"
                  {...register("adopterName")} 
                />
                {errors.adopterName && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50/50 p-2 rounded">
                    El nombre es requerido
                  </p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-green-800">
                  Número de teléfono
                </label>
                <input 
                  className="glass-input w-full p-3 text-green-800 placeholder-green-600" 
                  placeholder="Ej: +51 987 654 321"
                  {...register("phone")} 
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50/50 p-2 rounded">
                    Ingresa un número de teléfono válido
                  </p>
                )}
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-green-800">
                  Dirección (opcional)
                </label>
                <input 
                  className="glass-input w-full p-3 text-green-800 placeholder-green-600" 
                  placeholder="Tu dirección en Bagua"
                  {...register("address")} 
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-green-800">
                  Ciudad (opcional)
                </label>
                <input 
                  className="glass-input w-full p-3 text-green-800 placeholder-green-600" 
                  placeholder="Bagua"
                  {...register("city")} 
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-green-800">
                  ¿Por qué quieres adoptar esta planta?
                </label>
                <textarea 
                  className="glass-input w-full p-3 text-green-800 placeholder-green-600" 
                  rows={4} 
                  placeholder="Cuéntanos tu motivación (mínimo 10 caracteres)"
                  {...register("reason")} 
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50/50 p-2 rounded">
                    Explica tu motivo (mínimo 10 caracteres)
                  </p>
                )}
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  {...register("consent")} 
                />
                <span className="text-sm text-green-800 leading-relaxed">
                  Acepto que mis datos sean compartidos con el vivero municipal para la gestión de la adopción. 
                  Estos datos serán tratados conforme a la Ley de Protección de Datos Personales.
                </span>
              </div>
              {errors.consent && (
                <p className="text-sm text-red-600 bg-red-50/50 p-2 rounded">
                  Debes aceptar el consentimiento para continuar
                </p>
              )}

              <button 
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-poppins font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2" 
                type="submit"
              >
                <span>📱</span>
                Enviar solicitud por WhatsApp
              </button>
            </form>
          </div>

          {/* Vista previa de la planta seleccionada */}
          <div className="space-y-6">
            {selected ? (
              <div className="glass-card p-8">
                <h3 className="text-2xl font-poppins font-semibold text-green-800 mb-6">
                  Tu planta seleccionada
                </h3>
                
                <div className="space-y-4">
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl border-4 border-white/30">
                    {selected.imageUrl ? (
                      <Image
                        src={toProxied(selected.imageUrl)}
                        alt={selected.commonName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-green-600 bg-green-50/50">
                        <span className="text-6xl">🌿</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-2xl font-poppins font-bold text-green-800 mb-2">
                      {selected.commonName}
                    </h4>
                    {selected.scientificName && (
                      <p className="text-green-600 italic mb-4 text-lg">
                        {selected.scientificName}
                      </p>
                    )}
                    {selected.description && (
                      <p className="text-green-700 leading-relaxed">
                        {selected.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-poppins font-semibold text-green-800 mb-2">
                  Selecciona una planta
                </h3>
                <p className="text-green-600">
                  Elige tu planta favorita del formulario para ver más detalles aquí
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
