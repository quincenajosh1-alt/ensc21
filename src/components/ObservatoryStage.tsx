import { useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Sparkles } from 'lucide-react';
import type { SceneDefinition, SceneObject } from '../data/odeData';
import { ObjectDetailPanel } from './ObjectDetailPanel';
import { ObservatorySkyscraperSim } from './ObservatorySkyscraperSim';

interface ObservatoryStageProps {
  scenes: SceneDefinition[];
  activeScene: SceneDefinition;
  selectedObject?: SceneObject;
  onSelectScene: (sceneId: string) => void;
  onSelectObject: (objectId: string | undefined) => void;
  onOpenLesson: (sectionId: string) => void;
  onBackHome: () => void;
}

export function ObservatoryStage({
  scenes,
  activeScene,
  selectedObject,
  onSelectScene,
  onSelectObject,
  onOpenLesson,
  onBackHome,
}: ObservatoryStageProps) {
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});
  const hasError = Boolean(imgErrorMap[activeScene.id]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 lg:pb-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Desktop Left Vertical Scene Selector (4 labeled stops) */}
        <aside
          aria-label="Environments"
          className="hidden lg:flex flex-col w-60 shrink-0 sticky top-20 pt-2"
        >
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 px-3 mb-4 text-xs font-medium text-[#95ACA0] hover:text-[#4ADE80] transition-colors cursor-pointer w-fit focus-visible:outline-2 focus-visible:outline-[#4ADE80] rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Home</span>
          </button>

          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#95ACA0] px-3 mb-3">
            Environments
          </div>

          <nav className="relative flex flex-col gap-1.5">
            {scenes.map((scene, index) => {
              const isActive = scene.id === activeScene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => onSelectScene(scene.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-lg text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4ADE80] ${
                    isActive
                      ? 'bg-[#0A2016] text-[#F2F5F0] border border-[#4ADE80]/45'
                      : 'text-[#95ACA0] hover:text-[#F2F5F0] hover:bg-[#0A2016]/50 border border-transparent'
                  }`}
                >
                  {/* Mint active rail indicator */}
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${
                      isActive
                        ? 'bg-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,0.8)] scale-110'
                        : 'bg-[#95ACA0]/35 group-hover:bg-[#5EEAD4]/70'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono-tabular text-[#95ACA0]">
                      0{index + 1}
                    </div>
                    <div className="font-display text-sm font-semibold truncate">
                      {scene.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Subtle scene lighting caption */}
          <div className="mt-6 px-3 pt-4 border-t border-[#5EEAD4]/15 space-y-1">
            <div className="text-[11px] font-medium text-[#95ACA0]">
              {activeScene.environmentTag}
            </div>
            <p className="text-xs text-[#95ACA0]/85 leading-relaxed">
              {activeScene.lightingCaption}
            </p>
          </div>
        </aside>

        {/* Main Observatory Stage + Detail Panel */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Scene Title Bar (compact so illustration dominates immediately) */}
          <div
            key={activeScene.id}
            className="flex flex-wrap items-baseline justify-between gap-2 scene-transition"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F2F5F0] tracking-tight">
                {activeScene.title}
              </h1>
              <span className="text-xs sm:text-sm text-[#95ACA0]">
                {activeScene.objects.length === 1
                  ? 'Select the glowing marker to inspect the model'
                  : 'Select a glowing marker to inspect its differential model'}
              </span>
            </div>
          </div>

          {/* Scene + Detail Panel Grid */}
          <div
            className={`grid grid-cols-1 gap-6 items-start ${
              selectedObject ? 'lg:grid-cols-12' : 'lg:grid-cols-1'
            }`}
          >
            {/* Active Scene Illustration Stage with Soft Emerald Glow */}
            <div
              className={`relative ${
                selectedObject ? 'lg:col-span-7' : 'lg:col-span-1 max-w-5xl'
              }`}
            >
              {/* Soft emerald ambient glow behind active scene */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-3xl opacity-90 blur-2xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 48%, rgba(74, 222, 128, 0.18), rgba(16, 185, 129, 0.06) 52%, transparent 76%)',
                }}
              />

              {/* Framed Observatory Illustration */}
              <div
                key={`plate-${activeScene.id}`}
                className="relative rounded-2xl border border-[#5EEAD4]/25 bg-[#040A07] overflow-hidden shadow-2xl scene-transition"
              >
                <div className="relative aspect-[4/3] w-full">
                  {!hasError ? (
                    <img
                      src={activeScene.imagePath}
                      alt={activeScene.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setImgErrorMap((prev) => ({ ...prev, [activeScene.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#07160F] to-[#0A2016]">
                      <Compass className="w-10 h-10 text-[#4ADE80] mb-2" aria-hidden="true" />
                      <p className="font-display text-lg font-medium text-[#F2F5F0]">
                        {activeScene.title}
                      </p>
                    </div>
                  )}

                  {/* Clickable Bright Mint Markers (Desktop & Tablet) */}
                  <div className="hidden md:block">
                    {activeScene.objects.map((obj, idx) => {
                      const isSelected = selectedObject?.id === obj.id;
                      const isFirstMarker = idx === 0;
                      return (
                        <button
                          key={obj.id}
                          type="button"
                          onClick={() =>
                            onSelectObject(isSelected ? undefined : obj.id)
                          }
                          aria-pressed={isSelected}
                          aria-label={`Inspect ${obj.name}: ${obj.curiosityQuestion}`}
                          style={{
                            left: `${obj.hotspotX}%`,
                            top: `${obj.hotspotY}%`,
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-transform duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80] ${
                            isSelected
                              ? 'bg-[#4ADE80] text-[#050C09] border-[#4ADE80] scale-105 z-20 shadow-[0_0_18px_rgba(74,222,128,0.5)]'
                              : `bg-[#050C09]/90 text-[#F2F5F0] border-[#4ADE80]/80 hover:border-[#4ADE80] hover:bg-[#0A2016] z-10 ${
                                  isFirstMarker && !selectedObject ? 'marker-soft-pulse' : ''
                                }`
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-2.5 h-2.5 rounded-full ${
                              isSelected ? 'bg-[#050C09]' : 'bg-[#4ADE80]'
                            }`}
                          />
                          <span className="whitespace-nowrap">{obj.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Labeled Object Buttons Directly Below the Illustration */}
              <div className="mt-3 md:hidden space-y-2">
                <p className="text-xs font-medium text-[#95ACA0]">
                  Inspect an object in {activeScene.title}:
                </p>
                <div className="flex flex-col gap-2" role="group" aria-label="Scene objects">
                  {activeScene.objects.map((obj, idx) => {
                    const isSelected = selectedObject?.id === obj.id;
                    return (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => onSelectObject(isSelected ? undefined : obj.id)}
                        aria-pressed={isSelected}
                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium min-h-[46px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#4ADE80] text-[#050C09] border-[#4ADE80]'
                            : `bg-[#07160F]/90 text-[#F2F5F0] border-[#5EEAD4]/25 hover:border-[#4ADE80] ${
                                idx === 0 && !selectedObject ? 'marker-soft-pulse' : ''
                              }`
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`w-2.5 h-2.5 rounded-full ${
                              isSelected ? 'bg-[#050C09]' : 'bg-[#4ADE80]'
                            }`}
                          />
                          <span>{obj.name}</span>
                        </span>
                        <span
                          className={`text-xs font-mono-tabular ${
                            isSelected ? 'text-[#050C09]/80' : 'text-[#95ACA0]'
                          }`}
                        >
                          {obj.sectionLabel.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* "More to discover" related lessons surfaced under the active scene */}
              <div className="mt-5 rounded-xl border border-[#5EEAD4]/15 bg-[#07160F]/75 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#95ACA0]">
                  <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" aria-hidden="true" />
                  <span>More to discover in {activeScene.shortTitle}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeScene.moreToDiscover.map((item) => (
                    <button
                      key={item.sectionId}
                      type="button"
                      onClick={() => onOpenLesson(item.sectionId)}
                      className="group text-left rounded-lg border border-[#5EEAD4]/15 bg-[#050C09]/65 hover:border-[#4ADE80]/60 p-3 transition-colors cursor-pointer flex items-start justify-between gap-2 focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono-tabular font-semibold text-[#4ADE80]">
                          {item.sectionNumber} · {item.title}
                        </div>
                        <p className="text-xs text-[#95ACA0] leading-snug">{item.teaser}</p>
                      </div>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#95ACA0] group-hover:text-[#4ADE80] shrink-0 mt-0.5 transition-colors"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Object Detail Panel (Desktop: beside scene | Mobile: below scene) */}
            {selectedObject && (
              <div className="lg:col-span-5 space-y-6 scene-transition">
                <ObjectDetailPanel
                  object={selectedObject}
                  sceneTitle={activeScene.title}
                  onClose={() => onSelectObject(undefined)}
                  onOpenLesson={onOpenLesson}
                />
              </div>
            )}
          </div>

          {/* Featured Interactive Skyscraper Damping Simulation */}
          {selectedObject?.hasInteractiveDemo && (
            <div className="pt-2 scene-transition">
              <ObservatorySkyscraperSim onOpenLesson={onOpenLesson} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
