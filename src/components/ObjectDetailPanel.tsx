import { ArrowRight, BookOpen, X } from 'lucide-react';
import type { SceneObject } from '../data/odeData';
import { formatMathText } from '../utils/formatMathText';

interface ObjectDetailPanelProps {
  object: SceneObject;
  sceneTitle: string;
  onClose: () => void;
  onOpenLesson: (sectionId: string) => void;
}

export function ObjectDetailPanel({
  object,
  sceneTitle,
  onClose,
  onOpenLesson,
}: ObjectDetailPanelProps) {
  return (
    <aside
      aria-labelledby="detail-panel-question"
      className="rounded-xl border border-[#5EEAD4]/20 bg-[#07160F]/90 backdrop-blur-md p-5 sm:p-6 space-y-5"
    >
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#5EEAD4]/15">
        <div>
          <div className="text-xs font-medium text-[#95ACA0]">
            {sceneTitle} · {object.name}
          </div>
          <h2
            id="detail-panel-question"
            className="font-display text-xl sm:text-2xl font-semibold text-[#F2F5F0] tracking-tight mt-1 leading-snug"
          >
            {object.curiosityQuestion}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${object.name} details`}
          className="w-9 h-9 rounded-lg border border-[#5EEAD4]/20 bg-[#050C09]/60 text-[#95ACA0] hover:text-[#F2F5F0] hover:border-[#4ADE80] inline-flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Physical Behavior */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold tracking-wide text-[#95ACA0]">
          Physical Behavior
        </h3>
        <p className="text-sm sm:text-[15px] text-[#F2F5F0] leading-relaxed">
          {formatMathText(object.physicalBehavior)}
        </p>
      </div>

      {/* Simplified Equation */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold tracking-wide text-[#95ACA0]">
          Simplified Differential Equation
        </h3>
        <div className="rounded-lg border border-[#5EEAD4]/20 bg-[#050C09]/80 px-4 py-3 font-mono-tabular text-sm font-medium text-[#4ADE80] overflow-x-auto">
          {formatMathText(object.simplifiedEquation)}
        </div>
      </div>

      {/* Defined Variables */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold tracking-wide text-[#95ACA0]">
          Defined Variables
        </h3>
        <div className="rounded-lg border border-[#5EEAD4]/15 overflow-hidden bg-[#050C09]/50">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-[#0A2016]/80 text-[11px] text-[#95ACA0] border-b border-[#5EEAD4]/15">
              <tr>
                <th className="py-2 px-3 font-medium">Symbol</th>
                <th className="py-2 px-3 font-medium">Meaning</th>
                <th className="py-2 px-3 font-medium">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5EEAD4]/10">
              {object.variables.map((v) => (
                <tr key={v.symbol}>
                  <td className="py-2 px-3 font-mono-tabular font-semibold text-[#5EEAD4] whitespace-nowrap">
                    {formatMathText(v.symbol)}
                  </td>
                  <td className="py-2 px-3 text-[#F2F5F0]">{formatMathText(v.meaning)}</td>
                  <td className="py-2 px-3 font-mono-tabular text-xs text-[#95ACA0] whitespace-nowrap">
                    {v.units}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Modeling Assumption */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold tracking-wide text-[#95ACA0]">
          Main Modeling Assumption
        </h3>
        <p className="text-sm text-[#DCE6DF] leading-relaxed">
          {formatMathText(object.modelingAssumption)}
        </p>
      </div>

      {/* Full Lesson Link */}
      <div className="pt-3 border-t border-[#5EEAD4]/15">
        <button
          type="button"
          onClick={() => onOpenLesson(object.sectionId)}
          className="w-full inline-flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#4ADE80] hover:bg-[#86EFAC] text-[#050C09] text-sm font-semibold transition-colors cursor-pointer min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]"
        >
          <span className="inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Open {object.sectionLabel}</span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
