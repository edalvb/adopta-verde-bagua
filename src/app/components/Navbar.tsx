"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  showBackButton?: boolean;
}

export function Navbar({ showBackButton = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Cerrar menú cuando se hace clic fuera o se presiona Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);
  return (
    <nav className="glass-card fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          {showBackButton && (
            <Link 
              href="/" 
              className="flex items-center gap-1 sm:gap-2 text-green-800 hover:text-green-600 transition-colors font-medium text-sm sm:text-base"
            >
              <span className="text-lg sm:text-xl">←</span>
              <span className="hidden sm:inline">Volver</span>
            </Link>
          )}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-2xl">🌱</span>
            <h1 className="text-sm sm:text-lg lg:text-xl font-poppins font-bold text-green-800">
              <span className="hidden sm:inline">Vivero Municipal de Bagua</span>
              <span className="sm:hidden">Vivero Bagua</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm lg:text-base">
          <Link 
            href="/" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Inicio
          </Link>
          <Link 
            href="/#plantas" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
            scroll={false}
          >
            Plantas
          </Link>
          <Link 
            href="/adoption" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Adopta
          </Link>
          <Link 
            href="/equipo" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Equipo
          </Link>
          <a 
            href="#contacto" 
            className="text-green-800 hover:text-green-600 font-medium transition-colors"
          >
            Contacto
          </a>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            className="text-green-800 p-1 sm:p-2 hover:text-green-600 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú"
          >
            <span className="text-lg sm:text-xl">
              {isMobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-white/20 mobile-menu-enter">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-green-800 hover:text-green-600 hover:bg-white/10 font-medium transition-all duration-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <span>🏠</span>
              <span>Inicio</span>
            </Link>
            <Link 
              href="/#plantas" 
              className="text-green-800 hover:text-green-600 hover:bg-white/10 font-medium transition-all duration-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              onClick={closeMobileMenu}
              scroll={false}
            >
              <span>🌿</span>
              <span>Plantas</span>
            </Link>
            <Link 
              href="/adoption" 
              className="text-green-800 hover:text-green-600 hover:bg-white/10 font-medium transition-all duration-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <span>🤝</span>
              <span>Adopta</span>
            </Link>
            <Link 
              href="/equipo" 
              className="text-green-800 hover:text-green-600 hover:bg-white/10 font-medium transition-all duration-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <span>👥</span>
              <span>Equipo</span>
            </Link>
            <a 
              href="#contacto" 
              className="text-green-800 hover:text-green-600 hover:bg-white/10 font-medium transition-all duration-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
              onClick={closeMobileMenu}
            >
              <span>📞</span>
              <span>Contacto</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
