import { InMemoryPlantRepository, NoopAdoptionRepository } from "../../../infra/memoryRepositories";
import { Adoption } from "../../../domain/models";

export class AdoptionStore {
  private plantsRepo = new InMemoryPlantRepository();
  private adoptionsRepo = new NoopAdoptionRepository();

  async listPlants() {
    return this.plantsRepo.list();
  }

  async saveAdoption(a: Adoption) {
    return this.adoptionsRepo.save(a);
  }
}
