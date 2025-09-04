"use client";

interface NavbarProps {
  showBackButton?: boolean;
}

export function Navbar({ showBackButton = false }: NavbarProps) {
  return (
    <nav className="glass-card fixed top-4 left-4 right-4 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <a 
              href="/" 
              className="flex items-center gap-2 text-green-800 hover:text-green-600 transition-colors font-medium"
            >
              <span className="text-xl">←</span>
              <span className="hidden sm:inline">Volver</span>
            </a>
          )}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-poppins font-bold text-green-800">
              Vivero Municipal de Bagua
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a 
            href="/" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Inicio
          </a>
          <a 
            href="/#plantas" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Plantas
          </a>
          <a 
            href="/adoption" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Adopta
          </a>
          <a 
            href="#contacto" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Contacto
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-green-800 p-2">
            <span className="text-xl">☰</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
