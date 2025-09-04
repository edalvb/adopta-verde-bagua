import { Adoption, Plant } from "../domain/models";
import { AdoptionRepository, PlantRepository } from "../application/ports";

const seedPlants: Plant[] = [
  {
    id: "1",
    commonName: "Molle",
    scientificName: "Schinus molle",
    description: "Árbol nativo, resistente a sequía",
    imageUrl: "/next.svg",
    available: true,
  },
  {
    id: "2",
    commonName: "Cedro",
    scientificName: "Cedrela odorata",
    description: "Árbol de sombra, crecimiento medio",
    imageUrl: "/next.svg",
    available: true,
  },
];

export class InMemoryPlantRepository implements PlantRepository {
  async list(): Promise<Plant[]> {
    return seedPlants;
  }
}

export class NoopAdoptionRepository implements AdoptionRepository {
  async save(adoption: Adoption): Promise<Adoption> {
    const createdAt = new Date().toISOString();
    return { ...adoption, id: crypto.randomUUID(), createdAt };
  }
}
