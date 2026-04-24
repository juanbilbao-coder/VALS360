import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import desainLogo from '../../logodesain.png';

export default function SiteFooter() {
  return (
    <footer className="bg-void pt-24 pb-8 px-8 lg:px-16 border-t border-border-subtle relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none flex items-center justify-center w-full h-full overflow-hidden">
        <div className="flex items-center gap-8 scale-[3] md:scale-[5] lg:scale-[8]">
          <div className="w-20 h-20 rounded-[50%] border-[2px] border-primary flex items-center justify-center">
            <span className="font-serif text-primary text-4xl leading-none mt-2">V</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-primary text-5xl tracking-widest">VALS</span>
            <span className="font-sans text-primary text-xl tracking-[0.2em] font-light">360</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Secciones</h4>
            <ul className="space-y-4">
              <li><a href="#recorrido" className="text-secondary hover:text-primary transition-colors text-sm">Recorrer el proyecto</a></li>
              <li><a href="#unidades" className="text-secondary hover:text-primary transition-colors text-sm">Explorar unidades</a></li>
              <li><a href="#contenido" className="text-secondary hover:text-primary transition-colors text-sm">Contenido visual</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Conectar</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Presentación</h4>
            <p className="text-secondary text-sm mb-4">Solicitá la presentación completa del showroom:</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email..."
                className="bg-bg-overlay border border-border-subtle text-primary px-4 py-3 text-sm focus:outline-none focus:border-primary/30 w-full"
              />
              <button className="bg-primary text-inverse px-6 py-3 text-sm font-bold hover:bg-accent transition-colors">
                Enviar
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Ubicación</h4>
            <ul className="space-y-2">
              <li className="text-secondary text-sm">Sarmiento esq Libertad</li>
              <li className="text-secondary text-sm">Río Tercero, Córdoba</li>
              <li className="text-secondary text-sm">Argentina</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-xs">© 2026 VALS 360. Presentación inmobiliaria digital.</p>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <a
              href="https://grupodesain.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-secondary hover:text-primary transition-colors"
              aria-label="Grupo Desain"
            >
              <span className="text-[10px] uppercase tracking-[0.24em]">Desarrolla</span>
              <img
                src={desainLogo}
                alt="Grupo Desain"
                className="h-8 w-auto object-contain opacity-80"
              />
            </a>

            <div className="flex gap-6">
              <a href="#" className="text-secondary hover:text-primary transition-colors text-xs">Privacidad</a>
              <a href="#" className="text-secondary hover:text-primary transition-colors text-xs">Aviso Legal</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
