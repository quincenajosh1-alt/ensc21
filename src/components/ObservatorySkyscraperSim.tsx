import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Gauge,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Waves,
} from 'lucide-react';
import {
  SKYSCRAPER_CONSTANTS,
  evaluateFreeResponse,
  solveSkyscraperResponse,
  type DampingRegime,
} from '../utils/skyscraperPhysics';

interface ObservatorySkyscraperSimProps {
  onOpenLesson: (sectionId: string) => void;
}

const CHART_W = 640;
const CHART_H = 260;
const PAD_L = 56;
const PAD_R = 18;
const PAD_T = 20;
const PAD_B = 42;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;
const X_MAX = SKYSCRAPER_CONSTANTS.durationS;
const Y_LIMIT = 0.55;

function toSvgX(t: number): number {
  return PAD_L + (t / X_MAX) * PLOT_W;
}

function toSvgY(x: number): number {
  const clamped = Math.max(-Y_LIMIT, Math.min(Y_LIMIT, x));
  return PAD_T + ((Y_LIMIT - clamped) / (2 * Y_LIMIT)) * PLOT_H;
}

function getRegimeVisuals(regime: DampingRegime) {
  switch (regime) {
    case 'undamped':
      return {
        stroke: '#FBBF24',
        badgeText: 'text-[#FDE68A]',
        badgeBg: 'bg-[#F59E0B]/15 border-[#F59E0B]/35',
        Icon: Waves,
      };
    case 'underdamped':
      return {
        stroke: '#5EEAD4',
        badgeText: 'text-[#99F6E4]',
        badgeBg: 'bg-[#14B8A6]/15 border-[#5EEAD4]/35',
        Icon: Activity,
      };
    case 'critically-damped':
      return {
        stroke: '#4ADE80',
        badgeText: 'text-[#86EFAC]',
        badgeBg: 'bg-[#22C55E]/15 border-[#4ADE80]/45',
        Icon: CheckCircle2,
      };
    case 'overdamped':
      return {
        stroke: '#A7F3D0',
        badgeText: 'text-[#D1FAE5]',
        badgeBg: 'bg-[#10B981]/15 border-[#6EE7B7]/35',
        Icon: Gauge,
      };
  }
}

export function ObservatorySkyscraperSim({ onOpenLesson }: ObservatorySkyscraperSimProps) {
  const [damping, setDamping] = useState<number>(80);
  const [prediction, setPrediction] = useState<'faster' | 'not-always' | null>(null);
  const [hasMovedSlider, setHasMovedSlider] = useState<boolean>(false);
  const [showCriticalRef, setShowCriticalRef] = useState<boolean>(true);
  const [inspectTime, setInspectTime] = useState<number | null>(null);
  const [simTime, setSimTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  const result = useMemo(() => solveSkyscraperResponse(damping), [damping]);
  const visuals = getRegimeVisuals(result.regime);
  const RegimeIcon = visuals.Icon;

  // Continuous playback loop syncing animated building and moving graph marker
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
      return;
    }
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setIsPlaying(false);
      return;
    }

    const step = (ts: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = ts;
      const dt = (ts - lastFrameRef.current) / 1000;
      lastFrameRef.current = ts;

      setSimTime((prev) => {
        const next = prev + dt;
        if (next >= X_MAX) {
          return 0; // loop smoothly so students keep observing the sway behavior
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const activePathD = useMemo(
    () =>
      result.points
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(p.t).toFixed(2)} ${toSvgY(p.x).toFixed(2)}`)
        .join(' '),
    [result.points]
  );

  const criticalPathD = useMemo(
    () =>
      result.criticalReferencePoints
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(p.t).toFixed(2)} ${toSvgY(p.x).toFixed(2)}`)
        .join(' '),
    [result.criticalReferencePoints]
  );

  const activeTime = inspectTime ?? simTime;
  const activeDisplacement = useMemo(
    () => evaluateFreeResponse(activeTime, damping),
    [activeTime, damping]
  );

  // Horizontal top-floor sway in SVG pixels for the animated illuminated tower
  const swayPx = (activeDisplacement / SKYSCRAPER_CONSTANTS.initialDisplacementM) * 28;

  const handleDampingChange = (val: number) => {
    setDamping(val);
    setHasMovedSlider(true);
    setInspectTime(null);
    setSimTime(0);
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsPlaying(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CHART_W / rect.width;
    const svgX = (e.clientX - rect.left) * scaleX;
    const tRaw = ((svgX - PAD_L) / PLOT_W) * X_MAX;
    if (tRaw >= 0 && tRaw <= X_MAX) {
      setInspectTime(Number(tRaw.toFixed(2)));
    }
  };

  const criticalPct =
    ((result.criticalDampingKNSPerM - SKYSCRAPER_CONSTANTS.minDamping) /
      (SKYSCRAPER_CONSTANTS.maxDamping - SKYSCRAPER_CONSTANTS.minDamping)) *
    100;

  const xTicks = [0, 2, 4, 6, 8, 10, 12];
  const yTicks = [-0.5, -0.25, 0, 0.25, 0.5];

  return (
    <section
      aria-labelledby="skyscraper-lab-title"
      className="rounded-xl border border-[#5EEAD4]/20 bg-[#07160F]/90 backdrop-blur-md p-5 sm:p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#5EEAD4]/15">
        <div>
          <p className="text-xs font-medium text-[#95ACA0]">
            Featured Simulation · Lesson 3.5.2 Mechanical Vibrations
          </p>
          <h3
            id="skyscraper-lab-title"
            className="font-display text-xl sm:text-2xl font-semibold text-[#F2F5F0] tracking-tight mt-0.5"
          >
            Free-Response Damping Lab
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium ${visuals.badgeBg} ${visuals.badgeText}`}
          >
            <RegimeIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{result.regimeLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenLesson('3.5.2')}
            className="text-xs font-medium text-[#4ADE80] hover:text-[#86EFAC] hover:underline cursor-pointer whitespace-nowrap"
          >
            Read Lesson 3.5.2 →
          </button>
        </div>
      </div>

      {/* Prediction Prompt before adjusting damping */}
      <div className="rounded-lg border border-[#4ADE80]/25 bg-[#0A2016]/85 p-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#F2F5F0]">
              Predict before you slide: Will more damping always make the building return to its
              starting position faster?
            </p>
            <p className="text-xs text-[#95ACA0]">
              Lock in a prediction, then test damping values below and past critical damping (
              <span className="font-mono-tabular text-[#F2F5F0]">400 kN·s/m</span>).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPrediction('faster')}
            aria-pressed={prediction === 'faster'}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
              prediction === 'faster'
                ? 'bg-[#4ADE80] text-[#050C09] border-[#4ADE80]'
                : 'bg-[#050C09]/70 text-[#F2F5F0] border-[#5EEAD4]/25 hover:border-[#4ADE80]'
            }`}
          >
            Yes, higher damping always returns faster
          </button>
          <button
            type="button"
            onClick={() => setPrediction('not-always')}
            aria-pressed={prediction === 'not-always'}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
              prediction === 'not-always'
                ? 'bg-[#4ADE80] text-[#050C09] border-[#4ADE80]'
                : 'bg-[#050C09]/70 text-[#F2F5F0] border-[#5EEAD4]/25 hover:border-[#4ADE80]'
            }`}
          >
            No, too much damping can slow the return
          </button>
        </div>

        {(prediction !== null || hasMovedSlider) && (
          <div className="pt-2 border-t border-[#5EEAD4]/15 text-xs text-[#D1FAE5] leading-relaxed">
            {prediction === 'faster' && (
              <span>
                <strong className="text-[#4ADE80]">Compare with the graph:</strong> Drag above{' '}
                <span className="font-mono-tabular">400 kN·s/m</span> (overdamped) and compare it to
                the dashed critical-damping curve: excessive damping actually resists motion and
                slows the return!
              </span>
            )}
            {prediction === 'not-always' && (
              <span>
                <strong className="text-[#4ADE80]">Good intuition. Verify it on the graph:</strong>{' '}
                At <span className="font-mono-tabular">c = 400 kN·s/m</span> (critical damping,{' '}
                <span className="font-mono-tabular">ζ = 1.00</span>), the tower returns fastest
                without overshoot; pushing higher into overdamping creates a sluggish slow root.
              </span>
            )}
            {prediction === null && hasMovedSlider && (
              <span>
                Compare your active curve at{' '}
                <span className="font-mono-tabular">c = {damping} kN·s/m</span> against the dashed
                critical-damping line (<span className="font-mono-tabular">400 kN·s/m</span>) to see
                why more damping beyond critical slows the return.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Damping Slider with Marked Critical Damping Threshold */}
      <div className="rounded-lg border border-[#5EEAD4]/15 bg-[#050C09]/60 p-4 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="obs-damping-slider" className="text-sm font-medium text-[#F2F5F0]">
            Viscous Damping Coefficient <span className="font-mono-tabular text-[#95ACA0]">c</span>
          </label>
          <div className="flex items-center gap-3 font-mono-tabular text-sm">
            <span className="text-[#4ADE80] font-semibold">{damping} kN·s/m</span>
            <span className="text-xs text-[#95ACA0]">ζ = {result.dampingRatio.toFixed(2)}</span>
          </div>
        </div>

        {/* Slider + Critical Tick Marker */}
        <div className="relative pt-1 pb-6">
          <input
            id="obs-damping-slider"
            type="range"
            min={SKYSCRAPER_CONSTANTS.minDamping}
            max={SKYSCRAPER_CONSTANTS.maxDamping}
            step={SKYSCRAPER_CONSTANTS.stepDamping}
            value={damping}
            onChange={(e) => handleDampingChange(Number(e.target.value))}
            className="obs-slider"
          />
          {/* Critical damping marker right on slider scale */}
          <div
            style={{ left: `${criticalPct}%` }}
            className="absolute top-6 -translate-x-1/2 flex flex-col items-center"
          >
            <span className="w-0.5 h-2.5 bg-[#4ADE80]" aria-hidden="true" />
            <button
              type="button"
              onClick={() => handleDampingChange(result.criticalDampingKNSPerM)}
              className="text-[11px] font-mono-tabular text-[#4ADE80] hover:underline whitespace-nowrap cursor-pointer mt-0.5"
            >
              Critical ({result.criticalDampingKNSPerM})
            </button>
          </div>
          <div className="flex justify-between text-[11px] font-mono-tabular text-[#95ACA0] mt-2">
            <span>0 (Undamped)</span>
            <span>800 (Overdamped)</span>
          </div>
        </div>

        {/* Quick Regime Presets + Fixed Constants */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#5EEAD4]/10">
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Undamped (0)', val: 0 },
              { label: 'Underdamped (80)', val: 80 },
              { label: 'Critical (400)', val: 400 },
              { label: 'Overdamped (680)', val: 680 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleDampingChange(p.val)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer min-h-[34px] ${
                  damping === p.val
                    ? 'bg-[#4ADE80] text-[#050C09] border-[#4ADE80]'
                    : 'bg-[#0A2016] text-[#F2F5F0] border-[#5EEAD4]/20 hover:border-[#4ADE80]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono-tabular text-[#95ACA0]">
            Fixed: m = {result.massTonnes} t · k = {result.stiffnessKNPerM} kN/m · x(0) = +
            {result.initialDisplacementM.toFixed(2)} m
          </div>
        </div>
      </div>

      {/* Synchronized Building Animation + Displacement-vs-Time Graph */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* Illuminated Swaying Skyscraper Animation */}
        <div className="xl:col-span-4 rounded-lg border border-[#5EEAD4]/15 bg-[#050C09]/80 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#95ACA0] mb-2">
            <span>Live Tower Sway</span>
            <span className="font-mono-tabular text-[#F2F5F0]">
              x = {activeDisplacement >= 0 ? '+' : ''}
              {activeDisplacement.toFixed(3)} m
            </span>
          </div>

          <svg
            viewBox="0 0 220 210"
            className="w-full h-44 mx-auto"
            role="img"
            aria-label={`Animated skyscraper swaying to displacement ${activeDisplacement.toFixed(
              3
            )} meters at t = ${activeTime.toFixed(1)} seconds`}
          >
            {/* Subtle night emerald halo */}
            <defs>
              <radialGradient id="towerGlow" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#050C09" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="220" height="210" fill="url(#towerGlow)" />

            {/* Ground & Equilibrium Axis */}
            <line x1="24" y1="190" x2="196" y2="190" stroke="#95ACA0" strokeWidth="1.5" />
            <line
              x1="110"
              y1="14"
              x2="110"
              y2="190"
              stroke="#5EEAD4"
              strokeOpacity="0.28"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Bending Tower Silhouette */}
            <path
              d={`M 86 190 Q ${86 + swayPx * 0.35} 110 ${86 + swayPx} 34 L ${
                134 + swayPx
              } 34 Q ${134 + swayPx * 0.35} 110 134 190 Z`}
              fill="#0D291C"
              stroke={visuals.stroke}
              strokeWidth="2"
            />

            {/* Spire */}
            <line
              x1={110 + swayPx}
              y1="34"
              x2={110 + swayPx * 1.06}
              y2="16"
              stroke={visuals.stroke}
              strokeWidth="2"
            />
            <circle cx={110 + swayPx * 1.06} cy="16" r="2.5" fill="#4ADE80" />

            {/* Illuminated Floor Windows bending with the tower */}
            {[0.18, 0.3, 0.42, 0.54, 0.66, 0.78, 0.9].map((frac, rowIdx) => {
              const y = 190 - frac * 156;
              const shift = swayPx * (frac * frac);
              return (
                <g key={frac}>
                  {[-12, -3, 6].map((wx, colIdx) => (
                    <rect
                      key={wx}
                      x={110 + wx + shift}
                      y={y}
                      width="6"
                      height="5"
                      rx="0.5"
                      fill={(rowIdx + colIdx) % 3 === 0 ? '#5EEAD4' : '#FDE68A'}
                      fillOpacity={(rowIdx + colIdx) % 2 === 0 ? 0.85 : 0.45}
                    />
                  ))}
                </g>
              );
            })}
          </svg>

          {/* Playback Controls */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#5EEAD4]/15">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setInspectTime(null);
                  setIsPlaying((p) => !p);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#4ADE80] text-[#050C09] text-xs font-semibold hover:bg-[#86EFAC] transition-colors cursor-pointer min-h-[34px]"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setInspectTime(null);
                  setSimTime(0);
                }}
                aria-label="Reset sway simulation"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#5EEAD4]/25 bg-[#0A2016] text-[#F2F5F0] text-xs font-medium hover:border-[#4ADE80] transition-colors cursor-pointer min-h-[34px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
            <span className="font-mono-tabular text-xs text-[#95ACA0]">
              t = {activeTime.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Labeled Displacement vs Time Graph */}
        <div className="xl:col-span-8 rounded-lg border border-[#5EEAD4]/15 bg-[#050C09]/80 p-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-[#F2F5F0]">
              Displacement <span className="font-mono-tabular">x(t)</span> vs. Time{' '}
              <span className="font-mono-tabular">t</span>
            </span>
            <label className="inline-flex items-center gap-2 text-xs text-[#95ACA0] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showCriticalRef}
                onChange={(e) => setShowCriticalRef(e.target.checked)}
                className="accent-[#4ADE80] w-3.5 h-3.5"
              />
              <span>Show critical ref (c = 400)</span>
            </label>
          </div>

          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full h-auto select-none touch-pan-y"
            role="img"
            aria-label={`Displacement versus time graph showing ${result.regimeLabel} motion for c = ${damping}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setInspectTime(null)}
          >
            {/* Horizontal grid & Y ticks */}
            {yTicks.map((yVal) => {
              const py = toSvgY(yVal);
              const isZero = yVal === 0;
              return (
                <g key={yVal}>
                  <line
                    x1={PAD_L}
                    y1={py}
                    x2={CHART_W - PAD_R}
                    y2={py}
                    stroke={isZero ? '#95ACA0' : '#5EEAD4'}
                    strokeOpacity={isZero ? 0.55 : 0.12}
                    strokeWidth={isZero ? 1.25 : 1}
                    strokeDasharray={isZero ? undefined : '3 3'}
                  />
                  <text
                    x={PAD_L - 8}
                    y={py + 3.5}
                    textAnchor="end"
                    className="fill-[#95ACA0] text-[10px]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {yVal > 0 ? `+${yVal.toFixed(2)}` : yVal.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid & X ticks */}
            {xTicks.map((tVal) => {
              const px = toSvgX(tVal);
              return (
                <g key={tVal}>
                  <line
                    x1={px}
                    y1={PAD_T}
                    x2={px}
                    y2={CHART_H - PAD_B}
                    stroke={tVal === 0 ? '#95ACA0' : '#5EEAD4'}
                    strokeOpacity={tVal === 0 ? 0.55 : 0.12}
                    strokeWidth={tVal === 0 ? 1.25 : 1}
                    strokeDasharray={tVal === 0 ? undefined : '3 3'}
                  />
                  <text
                    x={px}
                    y={CHART_H - PAD_B + 15}
                    textAnchor="middle"
                    className="fill-[#95ACA0] text-[10px]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {tVal}s
                  </text>
                </g>
              );
            })}

            {/* Axis Labels */}
            <text
              x={PAD_L + PLOT_W / 2}
              y={CHART_H - 7}
              textAnchor="middle"
              className="fill-[#F2F5F0] text-[11px] font-medium"
            >
              Time t (seconds)
            </text>
            <text
              x={14}
              y={PAD_T + PLOT_H / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${PAD_T + PLOT_H / 2})`}
              className="fill-[#F2F5F0] text-[11px] font-medium"
            >
              Displacement x(t) (m)
            </text>

            {/* Critical damping reference dashed curve */}
            {showCriticalRef && result.regime !== 'critically-damped' && (
              <path
                d={criticalPathD}
                fill="none"
                stroke="#4ADE80"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                strokeOpacity={0.55}
              />
            )}

            {/* Active response curve */}
            <path
              d={activePathD}
              fill="none"
              stroke={visuals.stroke}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Synchronized live time marker */}
            <line
              x1={toSvgX(activeTime)}
              y1={PAD_T}
              x2={toSvgX(activeTime)}
              y2={CHART_H - PAD_B}
              stroke="#F2F5F0"
              strokeOpacity={0.35}
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <circle
              cx={toSvgX(activeTime)}
              cy={toSvgY(activeDisplacement)}
              r={5}
              fill={visuals.stroke}
              stroke="#050C09"
              strokeWidth={2}
            />
          </svg>

          {/* Closed-form equation & roots */}
          <div className="mt-3 pt-3 border-t border-[#5EEAD4]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="font-mono-tabular text-[#D1FAE5] truncate">
              {result.closedFormEquation}
            </div>
            <div className="font-mono-tabular text-[#95ACA0] shrink-0">
              {result.settlingTime2PctS === null
                ? 'Settling: Never (c = 0)'
                : `2% Settle: ${result.settlingTime2PctS.toFixed(2)} s`}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
