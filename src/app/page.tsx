import Image from "next/image";
import { InMemoryPlantRepository } from "@/features/adoption/infra/memoryRepositories";
import { toProxied } from "@/lib/imageProxy";
import { Navbar } from "./components/Navbar";

export default async function Home() {
  const repo = new InMemoryPlantRepository();
  const plants = await repo.list();

  return (
    <div className="min-h-screen font-inter">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100"></div>
        <div className="glass-card max-w-2xl mx-auto text-center p-8 relative z-10">
          <h2 className="text-4xl font-poppins font-bold text-green-800 mb-4">
            Adopta una planta, regala vida a Bagua 🌱
          </h2>
          <p className="text-lg text-green-700 mb-8 leading-relaxed">
            Contribuye a una ciudad más verde adoptando una planta de nuestro vivero municipal. 
            Cada adopción ayuda a embellecer nuestros espacios públicos.
          </p>
          <a
            href="/adoption"
            className="inline-block px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-green-800 font-poppins font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Adopta ahora
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <section id="plantas" className="mb-16">
          <div className="glass-card p-8 mb-8">
            <h2 className="text-3xl font-poppins font-bold text-green-800 mb-4 text-center">
              Plantas Disponibles
            </h2>
            <p className="text-green-700 text-center max-w-2xl mx-auto">
              Descubre nuestra colección de plantas nativas y ornamentales, 
              perfectas para embellecer tu hogar y nuestra ciudad.
            </p>
          </div>

          {plants.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-green-600">No hay plantas disponibles por ahora.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {plants.map((p) => (
                <div key={p.id} className="glass-card p-6 hover:scale-105 transition-transform duration-300">
                  <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-full border-4 border-white/30">
                    {p.imageUrl ? (
                      <Image
                        src={toProxied(p.imageUrl)}
                        alt={p.commonName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-green-600 bg-green-50/50">
                        <span className="text-4xl">🌿</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-poppins font-semibold text-green-800 mb-1">
                      {p.commonName}
                    </h3>
                    {p.scientificName && (
                      <p className="text-sm text-green-600 italic mb-4">
                        {p.scientificName}
                      </p>
                    )}
                    <a
                      href="/adoption"
                      className="inline-block px-6 py-2 bg-white/20 text-green-800 font-medium border border-white/30 rounded-xl backdrop-blur-md hover:bg-white/30 transition-all duration-300"
                    >
                      Adoptar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-card mx-4 mb-4 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <span className="font-poppins font-semibold text-green-800">
                Vivero Municipal de Bagua
              </span>
            </div>
            <div className="flex items-center gap-6 text-green-700">
              <a href="#contacto" className="hover:text-green-500 transition-colors">
                Contacto
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
