"use client";
import { z } from "zod";
import { buildWhatsAppMessage } from "../../../domain/models";
import { useAdoptionState } from "./adoption_states";
import { AdoptionStore } from "./Adoption_store";
import { WaMeWhatsAppAdapter } from "../../../infra/waMeAdapter";
import { env } from "../../../../../lib/env";

export const adoptionSchema = z.object({
  plantId: z.string().min(1),
  plantCommonName: z.string().min(1),
  adopterName: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  reason: z.string().min(10),
  consent: z.boolean().refine((v: boolean) => v === true),
});

type FormData = z.infer<typeof adoptionSchema>;

export class AdoptionController {
  private static _instance: AdoptionController | null = null;
  static get instance() {
    if (!this._instance) this._instance = new AdoptionController();
    return this._instance;
  }

  private store: AdoptionStore | null = null;

  initialize(store: AdoptionStore) {
    this.store = store;
  }

  async loadPlants() {
    useAdoptionState.getState().setIsLoading(true);
    try {
      if (!this.store) return;
      const plants = await this.store.listPlants();
      useAdoptionState.getState().setPlants(plants);
  } catch {
      useAdoptionState.getState().setError("No se pudo cargar las plantas");
    } finally {
      useAdoptionState.getState().setIsLoading(false);
    }
  }

  async submit(data: FormData) {
    const parsed = adoptionSchema.parse(data);
  if (!env.managerPhone) throw new Error("Falta configurar NEXT_PUBLIC_MANAGER_PHONE");
    const message = buildWhatsAppMessage({
      plantId: parsed.plantId,
      plantCommonName: parsed.plantCommonName,
      adopterName: parsed.adopterName,
      phone: parsed.phone,
      address: parsed.address || undefined,
      city: parsed.city || undefined,
      reason: parsed.reason,
      consent: parsed.consent,
    });

    const notifier = new WaMeWhatsAppAdapter(env.managerPhone);
    await notifier.notifyManager(message);
  }
}
