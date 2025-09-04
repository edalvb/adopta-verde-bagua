export type Plant = {
  id: string;
  commonName: string;
  scientificName?: string;
  description?: string;
  imageUrl?: string;
  available: boolean;
};

export type Adoption = {
  id?: string;
  plantId: string;
  plantCommonName: string;
  adopterName: string;
  phone: string;
  address?: string;
  city?: string;
  reason: string;
  consent: boolean;
  createdAt?: string;
};

export const buildWhatsAppMessage = (a: Adoption) => {
  const date = a.createdAt ?? new Date().toISOString();
  const lines = [
    "Adopción de planta - Vivero Municipal Bagua",
    `Nombre: ${a.adopterName}`,
    `Teléfono: ${a.phone}`,
    `Planta: ${a.plantCommonName} (${a.plantId})`,
    `Dirección: ${a.address ?? ""}`,
    `Ciudad: ${a.city ?? ""}`,
    `Motivo: ${a.reason}`,
    `Fecha: ${date}`,
  ];
  return lines.join("\n");
};
