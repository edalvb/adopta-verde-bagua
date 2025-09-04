import { Adoption, Plant } from "../domain/models";

export interface PlantRepository {
  list(): Promise<Plant[]>;
}

export interface AdoptionRepository {
  save(adoption: Adoption): Promise<Adoption>;
}

export interface WhatsAppNotifier {
  notifyManager(message: string): Promise<void>;
}
