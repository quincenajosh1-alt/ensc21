export type DampingRegime =
  | 'undamped'
  | 'underdamped'
  | 'critically-damped'
  | 'overdamped';

export interface TimePoint {
  t: number;
  x: number;
}

export interface SkyscraperSimulationResult {
  /** Fixed structural parameters */
  massTonnes: number; // m in tonnes (10^3 kg)
  stiffnessKNPerM: number; // k in kN/m (10^3 N/m)
  initialDisplacementM: number; // x(0) in meters
  initialVelocityMPS: number; // x'(0) in m/s
  /** Slider input */
  dampingKNSPerM: number; // c in kN*s/m
  /** Derived quantities */
  criticalDampingKNSPerM: number; // c_crit = 2*sqrt(m*k)
  dampingRatio: number; // zeta = c / c_crit
  naturalFrequencyRadS: number; // omega_n = sqrt(k/m)
  dampedFrequencyRadS: number | null; // omega_d for underdamped
  naturalPeriodS: number; // 2*pi / omega_n
  regime: DampingRegime;
  regimeLabel: string;
  regimeDescription: string;
  rootsSummary: string;
  closedFormEquation: string;
  settlingTime2PctS: number | null;
  points: TimePoint[];
  criticalReferencePoints: TimePoint[];
}

export const SKYSCRAPER_CONSTANTS = {
  massTonnes: 100, // 100,000 kg (effective modal mass)
  stiffnessKNPerM: 400, // 400,000 N/m
  initialDisplacementM: 0.5, // 0.50 m gust deflection
  initialVelocityMPS: 0, // released from peak deflection
  durationS: 12, // 0 to 12 seconds
  sampleCount: 240,
  minDamping: 0,
  maxDamping: 800,
  stepDamping: 5,
} as const;

export function evaluateFreeResponse(
  t: number,
  cKNSPerM: number,
  mTonnes = SKYSCRAPER_CONSTANTS.massTonnes,
  kKNPerM = SKYSCRAPER_CONSTANTS.stiffnessKNPerM,
  x0 = SKYSCRAPER_CONSTANTS.initialDisplacementM,
  v0 = SKYSCRAPER_CONSTANTS.initialVelocityMPS
): number {
  const omegaN = Math.sqrt(kKNPerM / mTonnes);
  const cCrit = 2 * Math.sqrt(mTonnes * kKNPerM);
  const zeta = cKNSPerM / cCrit;

  if (cKNSPerM <= 1e-6) {
    return x0 * Math.cos(omegaN * t) + (v0 / omegaN) * Math.sin(omegaN * t);
  }

  if (Math.abs(zeta - 1) < 1e-4) {
    const r = -omegaN;
    return Math.exp(r * t) * (x0 + (v0 - r * x0) * t);
  }

  if (zeta < 1) {
    const alpha = cKNSPerM / (2 * mTonnes);
    const omegaD = omegaN * Math.sqrt(1 - zeta * zeta);
    return (
      Math.exp(-alpha * t) *
      (x0 * Math.cos(omegaD * t) + ((v0 + alpha * x0) / omegaD) * Math.sin(omegaD * t))
    );
  }

  // Overdamped: zeta > 1
  const discSqrt = Math.sqrt(zeta * zeta - 1);
  const r1 = omegaN * (-zeta + discSqrt);
  const r2 = omegaN * (-zeta - discSqrt);
  const c1 = (v0 - r2 * x0) / (r1 - r2);
  const c2 = (r1 * x0 - v0) / (r1 - r2);
  return c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
}

export function solveSkyscraperResponse(cKNSPerM: number): SkyscraperSimulationResult {
  const {
    massTonnes: m,
    stiffnessKNPerM: k,
    initialDisplacementM: x0,
    initialVelocityMPS: v0,
    durationS,
    sampleCount,
  } = SKYSCRAPER_CONSTANTS;

  const omegaN = Math.sqrt(k / m);
  const naturalPeriodS = (2 * Math.PI) / omegaN;
  const criticalDampingKNSPerM = 2 * Math.sqrt(m * k);
  const zeta = cKNSPerM / criticalDampingKNSPerM;

  let regime: DampingRegime;
  let regimeLabel: string;
  let regimeDescription: string;
  let rootsSummary: string;
  let closedFormEquation: string;
  let dampedFrequencyRadS: number | null = null;
  let settlingTime2PctS: number | null = null;

  if (cKNSPerM <= 1e-6) {
    regime = 'undamped';
    regimeLabel = 'Undamped Harmonic';
    regimeDescription =
      'Zero energy dissipation: the tower oscillates indefinitely at its natural frequency without decay.';
    rootsSummary = `r₁,₂ = ±${omegaN.toFixed(2)}i s⁻¹`;
    closedFormEquation = `x(t) = ${x0.toFixed(2)} cos(${omegaN.toFixed(2)}t)`;
    settlingTime2PctS = null;
  } else if (Math.abs(zeta - 1) < 1e-4) {
    regime = 'critically-damped';
    regimeLabel = 'Critically Damped';
    regimeDescription =
      'Repeated real root (c² − 4mk = 0): fastest return to equilibrium with zero overshoot.';
    const r = -omegaN;
    rootsSummary = `r₁ = r₂ = ${r.toFixed(2)} s⁻¹ (repeated)`;
    closedFormEquation = `x(t) = (${x0.toFixed(2)} + ${(v0 - r * x0).toFixed(2)}t) e^(${r.toFixed(2)}t)`;
    settlingTime2PctS = findSettlingTime(cKNSPerM);
  } else if (zeta < 1) {
    regime = 'underdamped';
    regimeLabel = 'Underdamped Oscillatory';
    regimeDescription =
      'Complex conjugate roots (c² − 4mk < 0): the tower swings past zero and decays exponentially.';
    const alpha = cKNSPerM / (2 * m);
    const omegaD = omegaN * Math.sqrt(1 - zeta * zeta);
    dampedFrequencyRadS = omegaD;
    const bCoeff = (v0 + alpha * x0) / omegaD;
    rootsSummary = `r₁,₂ = −${alpha.toFixed(2)} ± ${omegaD.toFixed(2)}i s⁻¹`;
    closedFormEquation = `x(t) = e^(−${alpha.toFixed(2)}t) [${x0.toFixed(2)} cos(${omegaD.toFixed(2)}t) + ${bCoeff.toFixed(2)} sin(${omegaD.toFixed(2)}t)]`;
    settlingTime2PctS = findSettlingTime(cKNSPerM);
  } else {
    regime = 'overdamped';
    regimeLabel = 'Overdamped Aperiodic';
    regimeDescription =
      'Two distinct negative real roots (c² − 4mk > 0): heavy damping prevents oscillation, slowing return.';
    const discSqrt = Math.sqrt(zeta * zeta - 1);
    const r1 = omegaN * (-zeta + discSqrt);
    const r2 = omegaN * (-zeta - discSqrt);
    const c1 = (v0 - r2 * x0) / (r1 - r2);
    const c2 = (r1 * x0 - v0) / (r1 - r2);
    rootsSummary = `r₁ = ${r1.toFixed(2)} s⁻¹, r₂ = ${r2.toFixed(2)} s⁻¹`;
    const signC2 = c2 >= 0 ? '+' : '−';
    closedFormEquation = `x(t) = ${c1.toFixed(3)}e^(${r1.toFixed(2)}t) ${signC2} ${Math.abs(c2).toFixed(3)}e^(${r2.toFixed(2)}t)`;
    settlingTime2PctS = findSettlingTime(cKNSPerM);
  }

  const points: TimePoint[] = [];
  const criticalReferencePoints: TimePoint[] = [];
  for (let i = 0; i <= sampleCount; i++) {
    const t = (i / sampleCount) * durationS;
    points.push({
      t,
      x: evaluateFreeResponse(t, cKNSPerM, m, k, x0, v0),
    });
    criticalReferencePoints.push({
      t,
      x: evaluateFreeResponse(t, criticalDampingKNSPerM, m, k, x0, v0),
    });
  }

  return {
    massTonnes: m,
    stiffnessKNPerM: k,
    initialDisplacementM: x0,
    initialVelocityMPS: v0,
    dampingKNSPerM: cKNSPerM,
    criticalDampingKNSPerM,
    dampingRatio: zeta,
    naturalFrequencyRadS: omegaN,
    dampedFrequencyRadS,
    naturalPeriodS,
    regime,
    regimeLabel,
    regimeDescription,
    rootsSummary,
    closedFormEquation,
    settlingTime2PctS,
    points,
    criticalReferencePoints,
  };
}

function findSettlingTime(cKNSPerM: number): number | null {
  const threshold = 0.02 * Math.abs(SKYSCRAPER_CONSTANTS.initialDisplacementM);
  const maxScan = 30;
  const dt = 0.05;
  let lastAbove = 0;
  for (let t = 0; t <= maxScan; t += dt) {
    const val = Math.abs(evaluateFreeResponse(t, cKNSPerM));
    if (val > threshold) {
      lastAbove = t;
    }
  }
  return lastAbove >= maxScan - dt ? null : Number((lastAbove + dt).toFixed(2));
}
