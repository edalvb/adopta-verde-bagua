import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../components/Navbar";

export const metadata = {
  title: "Equipo | Adopta Verde Bagua",
  description:
    "Conoce al equipo detrás del proyecto del Colegio Técnico Industrial de Bagua y mira el pitch del emprendimiento.",
};

export default function EquipoPage() {
  return (
    <div className="min-h-screen font-inter">
      <Navbar />

      {/* Hero */}
      <section className="relative flex items-center justify-center pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100" />
        <div className="glass-card max-w-3xl mx-auto text-center p-6 sm:p-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-green-800 mb-4">
            Quiénes desarrollaron esta página 👩‍💻👨‍💻
          </h1>
          <p className="text-green-700 text-base sm:text-lg leading-relaxed">
            Este sitio fue desarrollado con cariño por estudiantes del
            <span className="font-semibold"> Colegio Técnico Industrial de Bagua</span>.
            Su sueño es impulsar un Bagua más verde y saludable a través del
            vivero municipal y la adopción responsable de plantas.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Foto del equipo */}
          <div className="glass-card overflow-hidden">
            <Image
              src="/assets/images/team.jpg"
              alt="Equipo del Colegio Técnico Industrial de Bagua"
              width={1600}
              height={1066}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Mensaje inspirador */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-green-800 mb-4">
              Emprendimiento con propósito
            </h2>
            <p className="text-green-700 mb-4">
              Este proyecto no es solo una web; es una propuesta real para
              conectar a nuestra comunidad con la naturaleza, fomentar el
              cuidado de áreas verdes y promover educación ambiental desde las
              aulas. Cada adopción es un paso hacia una ciudad más sostenible.
            </p>
            <ul className="list-disc pl-5 text-green-700 space-y-2 mb-6">
              <li>Desarrollado con Next.js y Tailwind CSS.</li>
              <li>Enfoque en accesibilidad, diseño claro y rendimiento.</li>
              <li>Integración con WhatsApp para facilitar la adopción.</li>
            </ul>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-800 font-poppins font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                Ir al inicio
              </Link>
              <Link
                href="/adoption"
                className="px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-poppins font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                Adoptar una planta
              </Link>
            </div>
          </div>
        </div>

        {/* Pitch en video */}
        <section className="mt-8 lg:mt-10">
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-poppins font-semibold text-green-800 mb-4">
              Pitch del proyecto 🎥
            </h3>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/20">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="/assets/images/team.jpg"
              >
                <source src="/assets/video/pitch.mp4" type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
            <p className="text-green-700 mt-4">
              Gracias por considerar este emprendimiento. Con su apoyo, los
              estudiantes del Colegio Técnico Industrial de Bagua podrán llevar
              este sueño a más personas y rincones de la ciudad.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
