"use client";
import { createContext, useContext } from "react";
import { AdoptionController } from "./Adoption_controller";
import { AdoptionStore } from "./Adoption_store";

type AdoptionCtx = {
  controller: AdoptionController;
  store: AdoptionStore;
};

const Ctx = createContext<AdoptionCtx | null>(null);

export const AdoptionProvider = Ctx.Provider;

export const useAdoption = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Adoption context missing");
  return ctx;
};
