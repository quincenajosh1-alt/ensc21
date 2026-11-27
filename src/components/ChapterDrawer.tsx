import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Compass, Search, X } from 'lucide-react';
import { CHAPTERS, SCENES, type ChapterSection } from '../data/odeData';
import { formatMathText } from '../utils/formatMathText';

interface ChapterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLesson: (sectionId: string) => void;
  onSelectSceneObject: (sceneId: string, objectId: string) => void;
}

export function ChapterDrawer({
  isOpen,
  onClose,
  onOpenLesson,
  onSelectSceneObject,
}: ChapterDrawerProps) {
  const [query, setQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState<'all' | number>('all');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const objectNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of SCENES) {
      for (const o of s.objects) {
        map.set(o.id, o.name);
      }
    }
    return map;
  }, []);

  const filteredChapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHAPTERS.filter((ch) => (chapterFilter === 'all' ? true : ch.number === chapterFilter))
      .map((ch) => ({
        ...ch,
        sections: ch.sections.filter((sec) => {
          if (!q) return true;
          return (
            sec.number.toLowerCase().includes(q) ||
            sec.title.toLowerCase().includes(q) ||
            sec.conceptExplanation.toLowerCase().includes(q) ||
            sec.realLifeApplication.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((ch) => ch.sections.length > 0);
  }, [query, chapterFilter]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#020604]/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl h-full bg-[#06130D] border-l border-[#5EEAD4]/25 flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#5EEAD4]/15 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#95ACA0]">Observatory Syllabus</p>
            <h2
              id="chapter-drawer-title"
              className="font-display text-xl font-semibold text-[#F2F5F0]"
            >
              Chapter Index
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Chapter Index"
            className="w-10 h-10 rounded-lg border border-[#5EEAD4]/20 bg-[#0A2016] text-[#F2F5F0] hover:border-[#4ADE80] inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Chapter Filter */}
        <div className="px-5 py-3.5 border-b border-[#5EEAD4]/15 space-y-3 bg-[#050C09]/60">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#95ACA0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections, catenary, Laplace, vibrations..."
              aria-label="Search Chapter Index"
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-[#0A2016] border border-[#5EEAD4]/25 text-[#F2F5F0] placeholder:text-[#95ACA0]/70 focus:outline-none focus:border-[#4ADE80]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by chapter">
            {(['all', 1, 2, 3, 4] as const).map((tab) => {
              const active = chapterFilter === tab;
              return (
                <button
                  key={String(tab)}
                  type="button"
                  onClick={() => setChapterFilter(tab)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer min-h-[32px] ${
                    active
                      ? 'bg-[#4ADE80] text-[#050C09]'
                      : 'bg-[#0A2016] text-[#95ACA0] hover:text-[#F2F5F0] border border-[#5EEAD4]/15'
                  }`}
                >
                  {tab === 'all' ? 'All Chapters' : `Chapter ${tab}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Sections List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {filteredChapters.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-medium text-[#F2F5F0]">No matching sections</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setChapterFilter('all');
                }}
                className="text-xs text-[#4ADE80] hover:underline cursor-pointer"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            filteredChapters.map((ch) => (
              <div key={ch.number} className="space-y-2.5">
                <div className="sticky top-0 bg-[#06130D]/95 py-1 border-b border-[#5EEAD4]/15">
                  <div className="text-[11px] font-mono-tabular text-[#4ADE80]">
                    Chapter {ch.number}
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#F2F5F0]">
                    {ch.title}
                  </h3>
                </div>

                <ul className="space-y-1.5">
                  {ch.sections.map((sec: ChapterSection) => {
                    const isSub = Boolean(sec.parentGroupId);
                    const featuredName = sec.featuredObjectId
                      ? objectNames.get(sec.featuredObjectId)
                      : undefined;
                    return (
                      <li
                        key={sec.id}
                        className={`rounded-lg border border-[#5EEAD4]/12 bg-[#0A2016]/55 hover:border-[#4ADE80]/60 transition-colors p-3 ${
                          isSub ? 'ml-5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenLesson(sec.id);
                            }}
                            className="text-left flex-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4ADE80] rounded-sm"
                          >
                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="font-mono-tabular text-xs font-semibold text-[#4ADE80]">
                                {sec.number}
                              </span>
                              <span className="text-sm font-medium text-[#F2F5F0]">
                                {sec.title}
                              </span>
                            </div>
                            <p className="text-xs text-[#95ACA0] mt-1 line-clamp-2">
                              {formatMathText(sec.realLifeApplication)}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenLesson(sec.id);
                            }}
                            aria-label={`Open ${sec.number} ${sec.title}`}
                            className="w-8 h-8 rounded-md text-[#4ADE80] hover:bg-[#4ADE80]/15 inline-flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>

                        {featuredName && sec.featuredSceneId && sec.featuredObjectId && (
                          <div className="mt-2 pt-2 border-t border-[#5EEAD4]/10">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectSceneObject(sec.featuredSceneId!, sec.featuredObjectId!);
                              }}
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5EEAD4] hover:underline cursor-pointer"
                            >
                              <Compass className="w-3 h-3" aria-hidden="true" />
                              <span>Inspect in Scene: {featuredName}</span>
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
