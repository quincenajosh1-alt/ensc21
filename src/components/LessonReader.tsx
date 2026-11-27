import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import {
  CHAPTERS,
  findObjectInScene,
  findSceneById,
  findSectionById,
  getAllSectionsFlat,
} from '../data/odeData';
import { formatMathText } from '../utils/formatMathText';

interface LessonReaderProps {
  sectionId: string;
  returnSceneTitle: string;
  returnObjectName?: string;
  onReturnToExplore: () => void;
  onOpenLesson: (sectionId: string) => void;
  onOpenSceneObject: (sceneId: string, objectId: string) => void;
}

export function LessonReader({
  sectionId,
  returnSceneTitle,
  returnObjectName,
  onReturnToExplore,
  onOpenLesson,
  onOpenSceneObject,
}: LessonReaderProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [sectionId]);

  const section = findSectionById(sectionId);
  const all = getAllSectionsFlat();
  const idx = all.findIndex((s) => s.id === sectionId);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  if (!section) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        <p className="text-base text-[#95ACA0]">Lesson not found.</p>
        <button
          type="button"
          onClick={onReturnToExplore}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4ADE80] text-[#050C09] text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Explore
        </button>
      </div>
    );
  }

  const chapter = CHAPTERS.find((c) => c.number === section.chapterNumber);
  const parentGroup = section.parentGroupId
    ? findSectionById(section.parentGroupId)
    : undefined;
  const childSubsections = section.isGroupParent
    ? all.filter((s) => s.parentGroupId === section.id)
    : [];

  const featuredScene = section.featuredSceneId
    ? findSceneById(section.featuredSceneId)
    : undefined;
  const featuredObject =
    section.featuredSceneId && section.featuredObjectId
      ? findObjectInScene(section.featuredSceneId, section.featuredObjectId)
      : undefined;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-8 space-y-6 scene-transition">
      {/* Return to Explore preserving active scene & object */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReturnToExplore}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#4ADE80]/40 bg-[#0A2016] text-[#4ADE80] hover:bg-[#4ADE80] hover:text-[#050C09] text-sm font-medium transition-colors cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            Return to Explore
            {returnObjectName ? ` · ${returnObjectName}` : ` · ${returnSceneTitle}`}
          </span>
        </button>

        {chapter && (
          <span className="text-xs font-medium text-[#95ACA0]">
            Chapter {chapter.number} · {chapter.title}
          </span>
        )}
      </div>

      {/* Lesson Article */}
      <article className="rounded-xl border border-[#5EEAD4]/20 bg-[#07160F]/92 p-6 sm:p-8 space-y-6">
        <header className="space-y-2 pb-5 border-b border-[#5EEAD4]/15">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#4ADE80]">
            <span className="font-semibold">{section.number}</span>
            {parentGroup && (
              <>
                <span className="text-[#95ACA0]" aria-hidden="true">
                  ·
                </span>
                <button
                  type="button"
                  onClick={() => onOpenLesson(parentGroup.id)}
                  className="text-[#95ACA0] hover:text-[#4ADE80] hover:underline cursor-pointer"
                >
                  {parentGroup.number} {parentGroup.title}
                </button>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#F2F5F0] tracking-tight">
            {section.title}
          </h1>
        </header>

        {/* Key Equation */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-semibold tracking-wide text-[#95ACA0]">
            Canonical Equation
          </h2>
          <div className="rounded-lg border border-[#5EEAD4]/20 bg-[#050C09]/80 px-4 py-3.5 font-mono-tabular text-sm sm:text-base font-medium text-[#4ADE80] overflow-x-auto">
            {formatMathText(section.keyEquation)}
          </div>
        </div>

        {/* Visual Slide Plate right after Canonical Equation */}
        <figure className="w-full rounded-lg border border-[#5EEAD4]/20 bg-[#040A07] overflow-hidden">
          <div className="relative aspect-[1376/768] w-full bg-[#040A07]">
            {!imageError ? (
              <img
                src={section.imagePath}
                alt={section.imageAlt}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#07160F] to-[#0A2016] text-xs text-[#95ACA0]">
                {section.number} · {section.title}
              </div>
            )}
          </div>
          <figcaption className="px-3.5 py-2 border-t border-[#5EEAD4]/15 bg-[#050C09]/95 text-xs font-medium text-[#95ACA0]">
            {section.imageCaption}
          </figcaption>
        </figure>

        {/* The Concept Behind */}
        <section aria-labelledby="lesson-concept" className="space-y-2">
          <h2 id="lesson-concept" className="font-display text-lg font-semibold text-[#F2F5F0]">
            The Concept Behind
          </h2>
          <p className="text-[15px] sm:text-base text-[#E6ECE8] leading-relaxed">
            {formatMathText(section.conceptExplanation)}
          </p>
        </section>

        {/* Key Steps */}
        <section aria-labelledby="lesson-steps" className="space-y-2.5">
          <h2 id="lesson-steps" className="font-display text-lg font-semibold text-[#F2F5F0]">
            Key Analytical Steps
          </h2>
          <ul className="space-y-2">
            {section.methodHighlights.map((item, i) => (
              <li key={item} className="flex items-start gap-3 text-sm sm:text-[15px] text-[#DCE6DF]">
                <span className="font-mono-tabular text-xs font-semibold text-[#050C09] bg-[#4ADE80] rounded-md w-5 h-5 inline-flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{formatMathText(item)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Subsections if Grouped Section */}
        {childSubsections.length > 0 && (
          <section aria-labelledby="lesson-subs" className="space-y-2.5">
            <h2 id="lesson-subs" className="font-display text-lg font-semibold text-[#F2F5F0]">
              Included Subsections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {childSubsections.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onOpenLesson(sub.id)}
                  className="text-left rounded-lg border border-[#5EEAD4]/20 bg-[#050C09]/60 hover:border-[#4ADE80] p-4 transition-colors cursor-pointer space-y-1"
                >
                  <div className="font-mono-tabular text-xs font-semibold text-[#4ADE80]">
                    {sub.number}
                  </div>
                  <div className="text-sm font-semibold text-[#F2F5F0]">{sub.title}</div>
                  <p className="text-xs text-[#95ACA0] line-clamp-2">
                    {formatMathText(sub.realLifeApplication)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Real-Life Application */}
        <section
          aria-labelledby="lesson-app"
          className="rounded-lg border border-[#4ADE80]/25 bg-[#0A2016]/75 p-4 sm:p-5 space-y-1.5"
        >
          <h2 id="lesson-app" className="text-xs font-semibold tracking-wide text-[#4ADE80]">
            Real-Life Application
          </h2>
          <p className="text-sm sm:text-[15px] text-[#F2F5F0] leading-relaxed">
            {formatMathText(section.realLifeApplication)}
          </p>
        </section>

        {/* Direct Field-Guide Scene Connection */}
        {featuredScene && featuredObject && (
          <div className="pt-4 border-t border-[#5EEAD4]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-[#95ACA0]">Featured Observatory Specimen</div>
              <div className="text-sm font-semibold text-[#F2F5F0]">
                {featuredScene.title}: {featuredObject.name}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenSceneObject(featuredScene.id, featuredObject.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4ADE80] hover:bg-[#86EFAC] text-[#050C09] text-sm font-semibold transition-colors cursor-pointer min-h-[42px]"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Inspect in {featuredScene.shortTitle}</span>
            </button>
          </div>
        )}
      </article>

      {/* Previous / Next Section */}
      <nav aria-label="Lesson navigation" className="flex flex-col sm:flex-row justify-between gap-3">
        {prev ? (
          <button
            type="button"
            onClick={() => onOpenLesson(prev.id)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-[#5EEAD4]/20 bg-[#07160F]/80 hover:border-[#4ADE80] text-left transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#4ADE80] shrink-0" aria-hidden="true" />
            <div>
              <div className="text-[11px] font-mono-tabular text-[#95ACA0]">
                Previous · {prev.number}
              </div>
              <div className="text-sm font-medium text-[#F2F5F0]">{prev.title}</div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {next && (
          <button
            type="button"
            onClick={() => onOpenLesson(next.id)}
            className="flex items-center justify-between sm:justify-end gap-2.5 px-4 py-3 rounded-lg border border-[#5EEAD4]/20 bg-[#07160F]/80 hover:border-[#4ADE80] text-right transition-colors cursor-pointer"
          >
            <div>
              <div className="text-[11px] font-mono-tabular text-[#95ACA0]">
                Next · {next.number}
              </div>
              <div className="text-sm font-medium text-[#F2F5F0]">{next.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#4ADE80] shrink-0" aria-hidden="true" />
          </button>
        )}
      </nav>
    </div>
  );
}
