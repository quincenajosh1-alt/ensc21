import { useCallback, useEffect, useState } from 'react';
import { BookOpen, Layers, X } from 'lucide-react';
import {
  SCENES,
  findObjectInScene,
  findSceneById,
} from './data/odeData';
import { ContourTexture } from './components/ContourTexture';
import { HomePage } from './components/HomePage';
import { ObservatoryStage } from './components/ObservatoryStage';
import { ChapterDrawer } from './components/ChapterDrawer';
import { LessonReader } from './components/LessonReader';
import { SiteFooter } from './components/SiteFooter';

interface ObservatoryState {
  mode: 'home' | 'explore' | 'lesson';
  sceneId: string;
  objectId?: string;
  lessonId?: string;
}

function readInitialState(): ObservatoryState {
  if (typeof window === 'undefined') {
    return { mode: 'home', sceneId: 'modern-city' };
  }
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw || raw === 'home') {
    return { mode: 'home', sceneId: 'modern-city' };
  }
  const [pathPart, queryPart] = raw.split('?');
  const params = new URLSearchParams(queryPart ?? '');
  const savedScene = params.get('scene');
  const savedObj = params.get('object') ?? undefined;

  if (pathPart.startsWith('lesson/')) {
    const lessonId = decodeURIComponent(pathPart.slice('lesson/'.length));
    const sceneId = savedScene && findSceneById(savedScene) ? savedScene : 'modern-city';
    return { mode: 'lesson', sceneId, objectId: savedObj, lessonId };
  }

  if (pathPart.startsWith('scene/')) {
    const sceneId = decodeURIComponent(pathPart.slice('scene/'.length));
    if (findSceneById(sceneId)) {
      return { mode: 'explore', sceneId, objectId: savedObj };
    }
  }

  return { mode: 'home', sceneId: 'modern-city' };
}

function serializeHash(state: ObservatoryState): string {
  if (state.mode === 'home') {
    return '#home';
  }
  const params = new URLSearchParams();
  if (state.mode === 'lesson' && state.lessonId) {
    params.set('scene', state.sceneId);
    if (state.objectId) params.set('object', state.objectId);
    return `#lesson/${encodeURIComponent(state.lessonId)}?${params.toString()}`;
  }
  if (state.objectId) {
    params.set('object', state.objectId);
    return `#scene/${encodeURIComponent(state.sceneId)}?${params.toString()}`;
  }
  return `#scene/${encodeURIComponent(state.sceneId)}`;
}

export default function App() {
  const [state, setState] = useState<ObservatoryState>(() => readInitialState());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileScenesOpen, setIsMobileScenesOpen] = useState(false);

  const commitState = useCallback((next: ObservatoryState) => {
    setState(next);
    const nextHash = serializeHash(next);
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setState(readInitialState());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activeScene = findSceneById(state.sceneId) ?? SCENES[0];
  const selectedObject = findObjectInScene(activeScene.id, state.objectId);

  const handleGoHome = () => {
    setIsDrawerOpen(false);
    setIsMobileScenesOpen(false);
    commitState({
      mode: 'home',
      sceneId: activeScene.id,
      objectId: undefined,
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSelectScene = (sceneId: string) => {
    setIsMobileScenesOpen(false);
    commitState({
      mode: 'explore',
      sceneId,
      objectId: undefined,
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSelectObject = (objectId: string | undefined) => {
    commitState({
      mode: 'explore',
      sceneId: activeScene.id,
      objectId,
    });
  };

  const handleOpenLesson = (sectionId: string) => {
    setIsDrawerOpen(false);
    setIsMobileScenesOpen(false);
    commitState({
      mode: 'lesson',
      sceneId: activeScene.id,
      objectId: state.objectId,
      lessonId: sectionId,
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleReturnToExplore = () => {
    commitState({
      mode: 'explore',
      sceneId: activeScene.id,
      objectId: state.objectId,
    });
  };

  const handleSelectSceneObjectFromDrawer = (sceneId: string, objectId: string) => {
    setIsDrawerOpen(false);
    commitState({
      mode: 'explore',
      sceneId,
      objectId,
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="relative min-h-screen flex flex-col text-[#F2F5F0]">
      <ContourTexture />

      {state.mode === 'home' ? (
        <main className="relative z-10 flex-1">
          <HomePage
            scenes={SCENES}
            onSelectScene={handleSelectScene}
            onOpenChapterIndex={() => setIsDrawerOpen(true)}
          />
        </main>
      ) : (
        <>
          {/* Compact Observatory Header */}
          <header className="relative z-20 border-b border-[#5EEAD4]/15 bg-[#050C09]/80 backdrop-blur-md">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleGoHome}
                className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#F2F5F0] hover:text-[#4ADE80] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4ADE80] rounded-sm"
              >
                DEs in the Wild
              </button>

              <div className="text-xs text-[#95ACA0] truncate">
                {state.mode === 'explore' ? (
                  <span>
                    Observatory · <span className="text-[#F2F5F0]">{activeScene.title}</span>
                  </span>
                ) : (
                  <span>
                    Lesson Reader · <span className="text-[#F2F5F0]">Chapter Syllabus</span>
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10 flex-1">
            {state.mode === 'explore' ? (
              <ObservatoryStage
                scenes={SCENES}
                activeScene={activeScene}
                selectedObject={selectedObject}
                onSelectScene={handleSelectScene}
                onSelectObject={handleSelectObject}
                onOpenLesson={handleOpenLesson}
                onBackHome={handleGoHome}
              />
            ) : (
              <LessonReader
                sectionId={state.lessonId ?? '1.5'}
                returnSceneTitle={activeScene.title}
                returnObjectName={selectedObject?.name}
                onReturnToExplore={handleReturnToExplore}
                onOpenLesson={handleOpenLesson}
                onOpenSceneObject={handleSelectSceneObjectFromDrawer}
              />
            )}
          </main>

          {/* Desktop Persistent Lower-Right Chapter Index Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="hidden lg:inline-flex fixed bottom-6 right-6 z-30 items-center gap-2.5 px-4 py-3 rounded-xl border border-[#4ADE80]/45 bg-[#07160F]/95 backdrop-blur-md text-[#F2F5F0] hover:border-[#4ADE80] hover:text-[#4ADE80] shadow-[0_8px_30px_rgba(0,0,0,0.55)] text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]"
          >
            <BookOpen className="w-4 h-4 text-[#4ADE80]" aria-hidden="true" />
            <span>Chapter Index</span>
          </button>

          {/* Mobile Compact Bottom Dock (Scenes + Chapters) */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#5EEAD4]/20 bg-[#050C09]/95 backdrop-blur-md px-4 py-2">
            <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setIsMobileScenesOpen((prev) => !prev)}
                aria-expanded={isMobileScenesOpen}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold border transition-colors min-h-[42px] cursor-pointer ${
                  isMobileScenesOpen || state.mode === 'explore'
                    ? 'bg-[#0A2016] text-[#4ADE80] border-[#4ADE80]/45'
                    : 'bg-[#07160F] text-[#F2F5F0] border-[#5EEAD4]/20'
                }`}
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Scenes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileScenesOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold border bg-[#07160F] text-[#F2F5F0] border-[#5EEAD4]/25 hover:border-[#4ADE80] transition-colors min-h-[42px] cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#4ADE80]" aria-hidden="true" />
                <span>Chapters</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Built by Footer across every page */}
      <SiteFooter clearBottomDock={state.mode !== 'home'} />

      {/* Mobile Scene Picker Sheet */}
      {isMobileScenesOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex items-end bg-[#020604]/70 backdrop-blur-sm pb-16"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileScenesOpen(false);
          }}
        >
          <div className="w-full bg-[#06130D] border-t border-[#5EEAD4]/25 rounded-t-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-[#F2F5F0]">
                Switch Environment
              </span>
              <button
                type="button"
                onClick={() => setIsMobileScenesOpen(false)}
                aria-label="Close scenes menu"
                className="w-8 h-8 rounded-lg border border-[#5EEAD4]/20 text-[#95ACA0] inline-flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SCENES.map((scene, idx) => {
                const isActive = scene.id === activeScene.id;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => handleSelectScene(scene.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left min-h-[46px] ${
                      isActive
                        ? 'bg-[#0A2016] border-[#4ADE80] text-[#F2F5F0]'
                        : 'bg-[#050C09]/60 border-[#5EEAD4]/15 text-[#95ACA0]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive ? 'bg-[#4ADE80]' : 'bg-[#95ACA0]/40'
                        }`}
                      />
                      <span className="font-display text-sm font-semibold">{scene.title}</span>
                    </span>
                    <span className="text-xs font-mono-tabular">0{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Searchable Chapter Index Drawer */}
      <ChapterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenLesson={handleOpenLesson}
        onSelectSceneObject={handleSelectSceneObjectFromDrawer}
      />
    </div>
  );
}
