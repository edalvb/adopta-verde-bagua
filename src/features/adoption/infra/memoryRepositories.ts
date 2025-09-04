import { Adoption, Plant } from "../domain/models";
import { AdoptionRepository, PlantRepository } from "../application/ports";

const seedPlants: Plant[] = [
  {
    id: "1",
    commonName: "Molle",
    scientificName: "Schinus molle",
    description: "Árbol nativo, resistente a sequía",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=origxorig:format=jpg/path/s618c5397d9ab18bd/image/i2fa585b94a61ad5f/version/1437696415/image.jpg",
    available: true,
  },
  {
    id: "2",
    commonName: "Cedro",
    scientificName: "Cedrela odorata",
    description: "Árbol de sombra, crecimiento medio",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cedrorosaaclimacao.jpg/250px-Cedrorosaaclimacao.jpg",
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
