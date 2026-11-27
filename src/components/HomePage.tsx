import { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { SceneDefinition } from '../data/odeData';

interface HomePageProps {
  scenes: SceneDefinition[];
  onSelectScene: (sceneId: string) => void;
  onOpenChapterIndex: () => void;
}

export function HomePage({
  scenes,
  onSelectScene,
  onOpenChapterIndex,
}: HomePageProps) {
  const [heroError, setHeroError] = useState(false);

  const leftScenes = scenes.slice(0, 2);
  const rightScenes = scenes.slice(2, 4);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Upper Bar: quiet field-guide label on left, Chapter Index on upper right */}
      <header className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        <div className="text-xs sm:text-sm font-medium text-[#95ACA0] whitespace-nowrap truncate">
          Mathematical Methods in Engineering
        </div>

        <button
          type="button"
          onClick={onOpenChapterIndex}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4ADE80]/45 bg-[#07160F]/90 text-[#F2F5F0] hover:border-[#4ADE80] hover:text-[#4ADE80] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]"
        >
          <BookOpen className="w-4 h-4 text-[#4ADE80]" aria-hidden="true" />
          <span>Chapter Index</span>
        </button>
      </header>

      {/* Landscape Hero Section with Big Left-Aligned Title & Real-Life Importance */}
      <section aria-label="Introduction" className="relative w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] rounded-xl overflow-hidden border border-[#5EEAD4]/20 bg-[#050C09] flex items-center">
            {!heroError ? (
              <img
                src="/src/assets/images/homepage_observatory_landscape_1795625033865.jpg"
                alt="Panoramic nocturnal landscape featuring a modern skyline, suspension bridge, high-altitude research aircraft, and hillside observatory dome under a starry sky."
                referrerPolicy="no-referrer"
                onError={() => setHeroError(true)}
                className="absolute inset-0 w-full h-full object-cover object-[75%_center] md:object-center"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-[#050C09] via-[#07160F] to-[#0A2016]"
              />
            )}

            {/* Directional Editorial Scrims for Left-Side Legibility & Seamless Top/Bottom Blend */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050C09] via-[#050C09]/80 to-[#050C09]/15"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050C09]/70 via-transparent to-[#050C09]/85"
            />

            {/* Left-Aligned Title & Importance of DEs */}
            <div className="relative z-10 w-full px-6 sm:px-10 lg:px-14 py-12 sm:py-16">
              <div className="max-w-xl space-y-5">
                <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.03em] leading-[1.03] text-[#F2F5F0] text-balance">
                  DEs in the Wild
                </h1>

                <p className="text-sm sm:text-base lg:text-[17px] text-[#DCE6DF] leading-relaxed max-w-lg">
                  Every system that moves, cools, mixes, or carries a signal obeys a rate
                  law before it obeys a formula. Differential equations turn those
                  instantaneous changes into reliable designs, from damping wind sway in
                  skyscrapers to regulating medication in the bloodstream.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environments Split Index below the Landscape Picture: 1 & 2 Left, 3 & 4 Right */}
      <section
        aria-labelledby="home-environments-heading"
        className="flex-1 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-10"
      >
        <div className="flex items-baseline justify-between gap-4 pb-3">
          <h2
            id="home-environments-heading"
            className="text-xs font-semibold tracking-wide text-[#95ACA0]"
          >
            Environments
          </h2>
          <span className="text-xs text-[#95ACA0]">
            Select an environment to inspect
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 border-t border-[#5EEAD4]/20">
          {/* Left Side: Environments 1 and 2 */}
          <div className="flex flex-col">
            {leftScenes.map((scene, idx) => (
              <EnvironmentRow
                key={scene.id}
                indexNumber={`0${idx + 1}`}
                scene={scene}
                onSelect={() => onSelectScene(scene.id)}
              />
            ))}
          </div>

          {/* Right Side: Environments 3 and 4 */}
          <div className="flex flex-col">
            {rightScenes.map((scene, idx) => (
              <EnvironmentRow
                key={scene.id}
                indexNumber={`0${idx + 3}`}
                scene={scene}
                onSelect={() => onSelectScene(scene.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

interface EnvironmentRowProps {
  indexNumber: string;
  scene: SceneDefinition;
  onSelect: () => void;
}

function EnvironmentRow({ indexNumber, scene, onSelect }: EnvironmentRowProps) {
  const objectNames = scene.objects.map((o) => o.name).join(', ');

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full flex items-center justify-between gap-4 py-4 px-2 border-b border-[#5EEAD4]/15 hover:bg-[#0A2016]/45 transition-colors text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
    >
      <div className="flex items-baseline gap-4 min-w-0">
        <span className="font-mono-tabular text-xs font-semibold text-[#4ADE80] shrink-0">
          {indexNumber}
        </span>
        <div className="min-w-0 space-y-0.5">
          <div className="font-display text-lg sm:text-xl font-semibold text-[#F2F5F0] group-hover:text-[#4ADE80] transition-colors truncate">
            {scene.title}
          </div>
          <div className="text-xs text-[#95ACA0] truncate">
            {scene.environmentTag} · {objectNames}
          </div>
        </div>
      </div>

      <ArrowRight
        className="w-4 h-4 text-[#95ACA0] group-hover:text-[#4ADE80] group-hover:translate-x-1 transition-all shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}
