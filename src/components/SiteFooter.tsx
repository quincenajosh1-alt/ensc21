import { useState } from 'react';

interface SiteFooterProps {
  clearBottomDock?: boolean;
}

export function SiteFooter({ clearBottomDock = false }: SiteFooterProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <footer
      className={`relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-4 ${
        clearBottomDock ? 'pb-20 lg:pb-8' : 'pb-8'
      }`}
    >
      <div
        className={`border-t border-[#5EEAD4]/15 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          clearBottomDock ? 'lg:pr-44' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#4ADE80]/45 bg-[#050C09] shrink-0">
            {!avatarError ? (
              <img
                src="/assets/aistudio/IMG_0239_0d718059.jpg"
                alt="Josh Michael Quincena"
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="w-full h-full object-cover object-[50%_22%]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-[#4ADE80]">
                JQ
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="text-[11px] font-semibold tracking-wide text-[#95ACA0]">
              Built by
            </div>
            <div className="font-display text-sm font-semibold text-[#F2F5F0] leading-tight whitespace-nowrap">
              Josh Michael Quincena
            </div>
            <div className="text-xs text-[#95ACA0] leading-tight whitespace-nowrap">
              BS Chemical Engineering
            </div>
            <div className="font-mono-tabular text-[11px] text-[#4ADE80] leading-tight whitespace-nowrap">
              2025-11806
            </div>
          </div>
        </div>

        <div className="text-xs text-[#95ACA0]">
          Chapters 1 to 4 · Interactive Observatory & Syllabus
        </div>
      </div>
    </footer>
  );
}
