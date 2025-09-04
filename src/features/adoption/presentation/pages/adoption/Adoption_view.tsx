"use client";
import { useEffect, useState } from "react";
import { AdoptionController } from "./Adoption_controller";
import { AdoptionStore } from "./Adoption_store";
import { AdoptionProvider } from "./Adoption_context";
import { AdoptionLayout } from "./components/Adoption_layout";

export default function AdoptionView() {
  const [controller] = useState(() => AdoptionController.instance);
  const [store] = useState(() => new AdoptionStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    controller.initialize(store);
    controller.loadPlants().finally(() => setReady(true));
  }, [controller, store]);

  if (!ready) return <div className="p-8">Cargando…</div>;

  return (
    <AdoptionProvider value={{ controller, store }}>
      <AdoptionLayout />
    </AdoptionProvider>
  );
}
