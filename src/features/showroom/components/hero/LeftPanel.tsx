import React from 'react';
import { ArrowUpRight, MapPinned, Eye } from 'lucide-react';

type LeftPanelProps = {
  heroSlides: string[];
  heroSlide: number;
  onOpenRenderModal: (index: number) => void;
  isImmersiveProjectMode?: boolean;
  onOpenProjectAssistant?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenCategoryView?: (category: 'departamentos' | 'penthouse' | 'locales-oficinas' | 'amenities') => void;
};

const mapUrl =
  'https://www.google.com/maps/search/?api=1&query=Sarmiento+esquina+Libertad+Rio+Tercero+Cordoba+Argentina';

const dataRows = [
  { label: 'Ubicación', value: 'Sarmiento esq. Libertad', type: 'map' as const },
  { label: 'Departamentos', value: '1 y 2 dormitorios', type: 'view' as const, viewKey: 'departamentos' as const },
  { label: 'Penthouse', value: '2 unidades', type: 'view' as const, viewKey: 'penthouse' as const },
  { label: 'Locales y oficinas', value: '3 locales · 4 oficinas', type: 'view' as const, viewKey: 'locales-oficinas' as const },
  { label: 'Amenities', value: 'Gym · Quincho · Coworking', type: 'view' as const, viewKey: 'amenities' as const }
];

export default function LeftPanel({
  heroSlides,
  heroSlide,
  onOpenRenderModal,
  isImmersiveProjectMode = false,
  onOpenProjectAssistant,
  onOpenWhatsApp,
  onOpenCategoryView
}: LeftPanelProps) {
  const hasSlides = heroSlides.length > 0;
  const safeHeroSlide = hasSlides ? Math.min(heroSlide, heroSlides.length - 1) : 0;

  return (
    <aside
      className={`showroom-left-panel w-full lg:w-[32%] bg-ink flex flex-col relative z-10 border-b lg:border-b-0 lg:border-r border-border-subtle ${isImmersiveProjectMode ? 'showroom-left-panel--immersive' : ''
        }`}
    >
      <div className="p-6 xl:p-8 border-b border-border-subtle bg-ink/95 backdrop-blur">
        <button
          type="button"
          className="block w-full text-left"
          onClick={() => hasSlides && onOpenRenderModal(safeHeroSlide)}
          aria-label="Ver renders en pantalla completa"
        >
          <div className="overflow-hidden rounded-[20px] bg-white/[0.04] aspect-[16/10]">
            {hasSlides ? (
              <div className="hero-carousel h-full w-full">
                {heroSlides.map((src, index) => (
                  <img
                    key={`${src}-${index}`}
                    src={src}
                    alt={`Render VALS 360 ${index + 1}`}
                    className={`hero-carousel__img h-full w-full object-cover ${index === safeHeroSlide ? 'is-active' : ''
                      }`}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm text-secondary">
                Sin renders disponibles
              </div>
            )}
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-7 xl:px-8 xl:py-8">
          <div className="space-y-8 xl:space-y-9">
            <header className="space-y-5">
              <div className="space-y-3">
                <img
                  src="/logo2.png"
                  alt="VALS 360"
                  className="block h-auto w-[80%] max-w-[320px]"
                />

                <p className="text-[11px] xl:text-[12px] uppercase tracking-[0.28em] text-secondary/80">
                  Río Tercero · Córdoba · Argentina
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="max-w-[19ch] font-serif text-[29px] xl:text-[32px] leading-[1.06] tracking-[-0.02em] text-primary">
                  Modernidad, estilo y calidad de vida.
                </h2>

                <p className="max-w-[42ch] text-[15px] xl:text-[16px] leading-[1.72] text-secondary">
                  Un exclusivo desarrollo de viviendas, locales comerciales y oficinas sobre una
                  esquina estratégica de Río Tercero.
                </p>
              </div>
            </header>

            <section className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => onOpenProjectAssistant?.()}
                  className="w-full rounded-[14px] border border-primary/20 px-5 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
                      Explorar el proyecto
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-[12px] uppercase tracking-[0.18em] text-secondary/75">
                      Consultá disponibilidad, avance de obra y más
                    </p>
                    <p className="max-w-[34ch] text-[12px] leading-[1.6] text-secondary/70">
                      Hablá con nuestra IA y consultá todo lo que quieras saber sobre VALS 360.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenWhatsApp?.()}
                  className="w-full rounded-[14px] border border-primary/20 px-5 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
                      Hablar con un asesor
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>

                  <p className="mt-2 max-w-[34ch] text-[12px] leading-[1.6] text-secondary/70">
                    Contactate por WhatsApp con el equipo comercial para consultas de venta.
                  </p>
                </button>
              </div>
            </section>

            <section className="border-t border-border-subtle pt-6 space-y-4">
              <div className="grid grid-cols-1 gap-y-4">
                {dataRows.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[120px_1fr_auto] gap-x-4 items-start"
                  >
                    <p className="pt-[3px] text-[11px] uppercase tracking-[0.22em] text-secondary/65">
                      {item.label}
                    </p>

                    <p className="text-[13px] leading-[1.6] text-secondary">
                      {item.value}
                    </p>

                    {item.type === 'map' ? (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Abrir ubicación en Google Maps"
                        className="justify-self-end inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/10 text-secondary/75 transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                      >
                        <MapPinned className="h-4 w-4" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenCategoryView?.(item.viewKey)}
                        aria-label={`Ver ${item.label.toLowerCase()}`}
                        className="justify-self-end inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/10 text-secondary/75 transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
