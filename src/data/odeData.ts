export interface VariableDefinition {
  symbol: string;
  meaning: string;
  units: string;
}

export interface SceneObject {
  id: string;
  sceneId: string;
  name: string;
  shortLabel: string;
  hotspotX: number;
  hotspotY: number;
  curiosityQuestion: string;
  physicalBehavior: string;
  simplifiedEquation: string;
  variables: VariableDefinition[];
  modelingAssumption: string;
  sectionId: string;
  sectionLabel: string;
  hasInteractiveDemo?: boolean;
}

export interface MoreToDiscoverLink {
  sectionId: string;
  sectionNumber: string;
  title: string;
  teaser: string;
}

export interface SceneDefinition {
  id: string;
  title: string;
  shortTitle: string;
  environmentTag: string;
  lightingCaption: string;
  imagePath: string;
  imageAlt: string;
  objects: SceneObject[];
  moreToDiscover: MoreToDiscoverLink[];
}

export interface ChapterSection {
  id: string;
  number: string;
  title: string;
  chapterNumber: number;
  isGroupParent?: boolean;
  parentGroupId?: string;
  imagePath: string;
  imageAlt: string;
  imageCaption: string;
  conceptExplanation: string;
  keyEquation: string;
  methodHighlights: string[];
  realLifeApplication: string;
  featuredObjectId?: string;
  featuredSceneId?: string;
}

export interface Chapter {
  number: number;
  title: string;
  overview: string;
  sections: ChapterSection[];
}

export const SCENES: SceneDefinition[] = [
  {
    id: 'modern-city',
    title: 'A Modern City',
    shortTitle: 'Modern City',
    environmentTag: 'Civil & Structural Systems',
    lightingCaption: 'Illuminated office windows and backlit municipal water basin',
    imagePath: '/src/assets/images/obs_modern_city_1795110686304.jpg',
    imageAlt:
      'Nocturnal observatory illustration of a modern city cross-section showing an illuminated glass skyscraper in wind streamlines and a lit cylindrical water-treatment mixing tank.',
    objects: [
      {
        id: 'skyscraper',
        sceneId: 'modern-city',
        name: 'Skyscraper',
        shortLabel: 'Skyscraper',
        hotspotX: 79,
        hotspotY: 48,
        curiosityQuestion: 'Why does the building keep swaying after the gust ends?',
        physicalBehavior:
          'Even after wind pressure vanishes, stored elastic strain energy in the steel frame accelerates the upper floors back toward center, overshooting equilibrium until structural and hydraulic damping bleed the kinetic energy away.',
        simplifiedEquation: 'm x″(t) + c x′(t) + k x(t) = 0',
        variables: [
          { symbol: 'x(t)', meaning: 'Lateral top-floor displacement from centerline', units: 'm' },
          { symbol: 'm', meaning: 'Effective modal mass of the tower assembly', units: 't (10³ kg)' },
          { symbol: 'c', meaning: 'Equivalent viscous damping coefficient', units: 'kN·s/m' },
          { symbol: 'k', meaning: 'Lateral structural flexural stiffness', units: 'kN/m' },
        ],
        modelingAssumption:
          'Linear lumped-parameter sway: small lateral deflections remain elastic (Hooke’s law), and energy dissipation acts like a linear viscous dashpot proportional to velocity x′(t).',
        sectionId: '3.5.2',
        sectionLabel: 'Lesson 3.5.2 Mechanical Vibrations',
        hasInteractiveDemo: true,
      },
      {
        id: 'water-treatment-tank',
        sceneId: 'modern-city',
        name: 'Water-Treatment Tank',
        shortLabel: 'Water-Treatment Tank',
        hotspotX: 27,
        hotspotY: 47,
        curiosityQuestion: 'How long does it take for cleaner water to flush out a tank?',
        physicalBehavior:
          'Fresh incoming flow continuously dilutes the solute inside the basin while mixed water exits at the bottom pipe, causing concentration to decay exponentially rather than clearing in one tank volume.',
        simplifiedEquation: 'dA/dt = r_in · c_in − r_out · (A(t) / V(t))',
        variables: [
          { symbol: 'A(t)', meaning: 'Mass of dissolved substance inside the tank', units: 'kg' },
          { symbol: 'r_in, r_out', meaning: 'Volumetric inflow and outflow rates', units: 'm³/min' },
          { symbol: 'c_in', meaning: 'Concentration of incoming water stream', units: 'kg/m³' },
          { symbol: 'V(t)', meaning: 'Instantaneous fluid volume in the tank', units: 'm³' },
        ],
        modelingAssumption:
          'Instantaneous uniform mixing: the rotating impeller homogenizes incoming water immediately, so outgoing concentration equals the basin average A(t)/V(t).',
        sectionId: '2.4',
        sectionLabel: 'Lesson 2.4 Mixing Phenomena',
      },
    ],
    moreToDiscover: [
      {
        sectionId: '2.8',
        sectionNumber: 'Lesson 2.8',
        title: 'The Catenary (Hanging Cables)',
        teaser: 'Why overhead power lines and bridge cables curve into a hyperbolic cosine.',
      },
      {
        sectionId: '3.6',
        sectionNumber: 'Lesson 3.6',
        title: 'Forced Vibrations & Resonance',
        teaser: 'What happens when periodic vortex shedding matches a tower’s natural frequency.',
      },
    ],
  },
  {
    id: 'inside-smartphone',
    title: 'Inside a Smartphone',
    shortTitle: 'Smartphone',
    environmentTag: 'Microelectronics',
    lightingCaption: 'Layered capacitive glass grid over illuminated copper traces',
    imagePath: '/src/assets/images/obs_inside_smartphone_1795110688108.jpg',
    imageAlt:
      'Nocturnal observatory exploded view of a smartphone showing a glowing capacitive touchscreen grid over copper micro-circuitry and surface-mount resistors and capacitors.',
    objects: [
      {
        id: 'touchscreen',
        sceneId: 'inside-smartphone',
        name: 'Smartphone Touchscreen',
        shortLabel: 'Touchscreen',
        hotspotX: 49,
        hotspotY: 28,
        curiosityQuestion: 'What changes when capacitance increases?',
        physicalBehavior:
          'When your finger approaches an electrode intersection, local capacitance C rises. Because the RC time constant τ = RC lengthens, node voltage charges and decays more slowly, creating a timing shift the controller reads as a touch.',
        simplifiedEquation: 'R (dq/dt) + (1 / C) q(t) = E(t)',
        variables: [
          { symbol: 'q(t)', meaning: 'Electric charge stored on the sensing node', units: 'C (coulombs)' },
          { symbol: 'R', meaning: 'Effective electrode and trace resistance', units: 'Ω (ohms)' },
          { symbol: 'C', meaning: 'Mutual + finger-coupled node capacitance', units: 'F (farads)' },
          { symbol: 'E(t)', meaning: 'Applied scan pulse excitation voltage', units: 'V (volts)' },
        ],
        modelingAssumption:
          'Lumped RC element model: trace inductance and electromagnetic propagation delays are negligible across millimeter-scale display paths during each scan cycle.',
        sectionId: '2.7',
        sectionLabel: 'Lesson 2.7 Electric Circuits',
      },
    ],
    moreToDiscover: [
      {
        sectionId: '4.2',
        sectionNumber: 'Lesson 4.2',
        title: 'Inverse Laplace Transforms & Partial Fractions',
        teaser: 'Recovering exact millisecond voltage step transients from s-domain circuit poles.',
      },
      {
        sectionId: '2.2',
        sectionNumber: 'Lesson 2.2',
        title: 'Newton’s Law of Cooling & Heating',
        teaser: 'How processor heat decays toward chassis ambient temperature after heavy compute.',
      },
    ],
  },
  {
    id: 'hospital-room',
    title: 'A Hospital Room',
    shortTitle: 'Hospital Room',
    environmentTag: 'Biomedical Systems',
    lightingCaption: 'Soft bedside monitor glow and backlit intravenous infusion bag',
    imagePath: '/src/assets/images/obs_hospital_room_1795110687149.jpg',
    imageAlt:
      'Nocturnal observatory illustration of a quiet hospital room illuminated by a glowing IV drip bag on a stand and soft emerald bedside monitor light.',
    objects: [
      {
        id: 'iv-drip',
        sceneId: 'hospital-room',
        name: 'IV Drip',
        shortLabel: 'IV Drip',
        hotspotX: 26,
        hotspotY: 35,
        curiosityQuestion: 'Why does the concentration level off during a constant infusion?',
        physicalBehavior:
          'As medication enters at steady rate r, bloodstream levels climb, which increases metabolic elimination ky. Eventually clearance matches infusion (ky = r), holding plasma drug concentration on a safe plateau.',
        simplifiedEquation: 'dy/dt + k y(t) = r',
        variables: [
          { symbol: 'y(t)', meaning: 'Mass of medication circulating in blood plasma', units: 'mg' },
          { symbol: 'r', meaning: 'Constant intravenous infusion delivery rate', units: 'mg/hr' },
          { symbol: 'k', meaning: 'First-order metabolic / renal clearance constant', units: 'hr⁻¹' },
          { symbol: 't', meaning: 'Elapsed infusion duration', units: 'hr' },
        ],
        modelingAssumption:
          'Single-compartment first-order kinetics: medication mixes rapidly throughout blood volume and organs clear it proportionally to current amount y(t).',
        sectionId: '1.5',
        sectionLabel: 'Lesson 1.5 Linear First-Order ODE',
      },
    ],
    moreToDiscover: [
      {
        sectionId: '1.3',
        sectionNumber: 'Lesson 1.3',
        title: 'Direction Fields & Equilibrium Solutions',
        teaser: 'See visually why every starting dose converges to the steady-state equilibrium y* = r/k.',
      },
      {
        sectionId: '2.1',
        sectionNumber: 'Lesson 2.1',
        title: 'Exponential Growth & Radioactive Decay',
        teaser: 'How biological half-life determines washout speed once the IV clamp closes.',
      },
    ],
  },
  {
    id: 'space-aviation',
    title: 'Space & Aviation',
    shortTitle: 'Space & Aviation',
    environmentTag: 'Aerospace Flight Dynamics',
    lightingCaption: 'Dark planetary horizon with luminous aerodynamic streamlines',
    imagePath: '/src/assets/images/obs_space_aviation_1795110687421.jpg',
    imageAlt:
      'Nocturnal observatory illustration of a twin-engine research aircraft flying above a dark Earth horizon surrounded by glowing pale mint aerodynamic gust streamlines.',
    objects: [
      {
        id: 'aircraft',
        sceneId: 'space-aviation',
        name: 'Aircraft',
        shortLabel: 'Aircraft',
        hotspotX: 45,
        hotspotY: 37,
        curiosityQuestion: 'How does an aircraft respond after a sudden gust?',
        physicalBehavior:
          'A sharp updraft alters angle of attack almost instantaneously, creating a step or pulse forcing term. Transforming the pitch ODE into the s-domain lets aerospace engineers combine initial trim conditions and discontinuous gust inputs algebraically.',
        simplifiedEquation:
          'L{θ″ + a₁ θ′ + a₀ θ} = s²Θ(s) − sθ(0) − θ′(0) + a₁(sΘ(s) − θ(0)) + a₀Θ(s) = G(s)',
        variables: [
          { symbol: 'θ(t)', meaning: 'Pitch angle perturbation from trimmed level flight', units: 'rad' },
          { symbol: 'Θ(s)', meaning: 'Laplace transform L{θ(t)} in frequency variable s', units: 'rad·s' },
          { symbol: 'a₁, a₀', meaning: 'Aerodynamic pitch damping and static stability terms', units: 's⁻¹, s⁻²' },
          { symbol: 'G(s)', meaning: 'Laplace-transformed atmospheric gust forcing', units: 'rad/s' },
        ],
        modelingAssumption:
          'Linearized small-perturbation aerodynamics around steady cruise trim: lift and restoring pitching moments vary linearly with small angle deviations during the gust.',
        sectionId: '4.5-4.6',
        sectionLabel: 'Lesson 4.5–4.6 Solving ODEs with Laplace Transforms',
      },
    ],
    moreToDiscover: [
      {
        sectionId: '4.7',
        sectionNumber: 'Lesson 4.7',
        title: 'Impulse Functions (Dirac Delta) & Convolution',
        teaser: 'Predicting structural load factors from instantaneous wind-shear spikes.',
      },
      {
        sectionId: '2.5',
        sectionNumber: 'Lesson 2.5',
        title: 'Motion with Air Resistance (Drag Models)',
        teaser: 'How aerodynamic drag shapes terminal glide and reentry deceleration.',
      },
    ],
  },
];

export const CHAPTERS: Chapter[] = [
  {
    number: 1,
    title: 'First-Order Differential Equations',
    overview:
      'Foundational classification, initial-value existence, qualitative slope fields, and exact analytical solution methods for first-order ODEs.',
    sections: [
      {
        id: '1.1',
        number: 'Lesson 1.1',
        title: 'Definitions, Terminology & Modeling',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_rocket_ivp_1795568951486.jpg',
        imageAlt: 'Sounding rocket ascending along an arc above a dark forest observatory.',
        imageCaption: 'Conservation laws and instantaneous rate telemetry along a launch profile',
        conceptExplanation:
          'An ordinary differential equation (ODE) relates an unknown function y(t) of a single independent variable t to one or more of its derivatives. Its order is the highest derivative present, and linearity means y and all derivatives appear only to the first power without multiplying one another.',
        keyEquation: 'F(t, y, y′, …, y⁽ⁿ⁾) = 0',
        methodHighlights: [
          'Distinguish ordinary vs. partial differential equations by counting independent variables.',
          'Identify order (1st, 2nd, nth) and classify equations as linear or nonlinear.',
          'Verify candidate explicit or implicit solutions by direct differentiation.',
        ],
        realLifeApplication:
          'Translating physical conservation laws, such as Newton’s second law or chemical mass balance, into mathematical rate statements before solving. In industrial heat exchangers or chemical reactors, sensors measure instantaneous rates of change (heat flux or flow rate), and writing the ODE lets engineers connect those rates to future temperature or concentration without guessing.',
      },
      {
        id: '1.2',
        number: 'Lesson 1.2',
        title: 'Initial-Value Problems',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_rocket_ivp_1795568951486.jpg',
        imageAlt: 'Sounding rocket ascending along a glowing parabolic flight trajectory.',
        imageCaption: 'Initial launch conditions lock the ODE onto one unique trajectory',
        conceptExplanation:
          'A differential equation generates an infinite family of solution curves. Pairing the ODE with an initial condition y(t₀) = y₀ selects the unique trajectory passing through that starting physical state.',
        keyEquation: 'dy/dt = f(t, y),   y(t₀) = y₀',
        methodHighlights: [
          'Apply continuity checks on f(t, y) and ∂f/∂y for local existence and uniqueness.',
          'Determine integration constants from measured initial states.',
          'Identify the interval of validity where solutions stay continuous.',
        ],
        realLifeApplication:
          'Predicting the exact flight trajectory of a sounding rocket once launch altitude and burnout velocity are specified at t = t₀. Because the same thrust-and-gravity differential equation describes every possible launch, plugging in the onboard IMU’s initial position and speed locks the solver onto the one real trajectory the rocket will follow.',
      },
      {
        id: '1.3',
        number: 'Lesson 1.3',
        title: 'Direction Fields & Equilibrium Solutions',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_slope_field_1795568951474.jpg',
        imageAlt: 'Luminous mint tangent field vectors converging onto a horizontal equilibrium line.',
        imageCaption: 'Slope field vectors guiding nearby trajectories toward steady equilibrium',
        conceptExplanation:
          'Plotting short tangent segments of slope f(t, y) across the (t, y)-plane reveals qualitative solution flow without integrating. Autonomous equations dy/dt = f(y) exhibit constant equilibrium solutions wherever f(y*) = 0.',
        keyEquation: 'dy/dt = f(y) = 0  ⇒  y(t) ≡ y*',
        methodHighlights: [
          'Sketch isoclines where slope f(t, y) = c stays constant.',
          'Classify equilibria on a phase line as asymptotically stable, unstable, or semi-stable.',
          'Verify why steady-state levels act as horizontal asymptotes for nearby trajectories.',
        ],
        realLifeApplication:
          'Visualizing why bloodstream drug levels during an IV infusion converge asymptotically toward steady equilibrium y* = r/k. Looking at the slope field shows that when concentration is below y*, delivery outpaces organ clearance so slopes point upward, whereas an accidental overdose above y* creates negative slopes that naturally settle back to the same equilibrium.',
      },
      {
        id: '1.4',
        number: 'Lesson 1.4',
        title: 'Separable Equations',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_slope_field_1795568951474.jpg',
        imageAlt: 'Smooth integral flow curves generated by separating variables across a slope field.',
        imageCaption: 'Integral curve families solved by separating independent and dependent variables',
        conceptExplanation:
          'A first-order ODE is separable when it factors into a function of t times a function of y. Separating variables and integrating both sides converts the differential relation into an algebraic equation.',
        keyEquation: 'dy/dt = g(t) h(y)  ⇒  ∫ (1 / h(y)) dy = ∫ g(t) dt + C',
        methodHighlights: [
          'Check for singular constant solutions where h(y) = 0 prior to dividing.',
          'Integrate each variable independently and solve for C using y(t₀) = y₀.',
          'Isolate y(t) explicitly where invertible.',
        ],
        realLifeApplication:
          'Radiocarbon dating decay curves and pressure-driven drainage from industrial vessels. In an archaeological lab, measuring the remaining ratio of carbon-14 lets scientists integrate the separable decay rate backward in time; in chemical plants, separating fluid height from time predicts exactly when a holding tank will empty.',
      },
      {
        id: '1.5',
        number: 'Lesson 1.5',
        title: 'Linear First-Order ODE',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_iv_drip_scaled_1795569263119.jpg',
        imageAlt: 'Dimly lit hospital suite with a glowing IV infusion bag and bedside monitor.',
        imageCaption: 'Constant IV infusion balancing linear metabolic clearance in the bloodstream',
        conceptExplanation:
          'Every linear first-order ODE in standard form y′ + P(t)y = Q(t) becomes directly integrable when multiplied by the integrating factor μ(t) = exp(∫ P(t) dt), collapsing the left side into d/dt[μ(t)y].',
        keyEquation: 'dy/dt + P(t)y = Q(t),   μ(t) = e^(∫ P(t) dt)',
        methodHighlights: [
          'Normalize the coefficient of dy/dt to 1 before identifying P(t) and Q(t).',
          'Multiply every term by μ(t) so the left side forms the derivative of μ(t)y.',
          'Integrate and divide by μ(t), keeping the constant of integration inside the division.',
        ],
        realLifeApplication:
          'Hospital IV drip pharmacokinetics: an infusion pump feeds medication into the vein at a constant rate r while the kidneys and liver filter the blood in proportion to current drug mass (k·y). Solving the linear ODE with an integrating factor proves why concentration climbs smoothly and levels off at the therapeutic plateau r/k instead of rising indefinitely.',
        featuredObjectId: 'iv-drip',
        featuredSceneId: 'hospital-room',
      },
      {
        id: '1.6',
        number: 'Lesson 1.6',
        title: 'Exact Equations & Integrating Factors',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_slope_field_1795568951474.jpg',
        imageAlt: 'Contour curves tracing level sets of an exact scalar potential field.',
        imageCaption: 'Level-curve contours traced when mixed partial derivatives match',
        conceptExplanation:
          'Differential form M(t, y) dt + N(t, y) dy = 0 is exact when ∂M/∂y = ∂N/∂t, meaning (M, N) is the gradient of a scalar potential Φ(t, y). Solutions trace level contours Φ(t, y) = C.',
        keyEquation: 'M(t, y) dt + N(t, y) dy = 0,   ∂M/∂y = ∂N/∂t',
        methodHighlights: [
          'Check mixed partials ∂M/∂y and ∂N/∂t for exactness.',
          'Integrate M with respect to t and match ∂Φ/∂y = N to recover the remaining term.',
          'Construct single-variable integrating factors μ(t) or μ(y) when non-exact.',
        ],
        realLifeApplication:
          'Mapping equipotential streamlines in incompressible potential flow and conservative thermodynamic state paths. Because total differential changes along a closed loop sum to zero when ∂M/∂y = ∂N/∂t, engineers can compute pressure contours around turbine blades or wing airfoils from a single scalar potential Φ(x, y) without tracking path history.',
      },
      {
        id: '1.7',
        number: 'Lesson 1.7',
        title: 'Substitutions (Bernoulli & Homogeneous Equations)',
        chapterNumber: 1,
        imagePath: '/src/assets/images/lesson_aircraft_scaled_1795569263450.jpg',
        imageAlt: 'Research aircraft flying through glowing aerodynamic streamlines above a dark horizon.',
        imageCaption: 'Linearizing nonlinear quadratic fluid drag with variable substitution',
        conceptExplanation:
          'Structured nonlinear ODEs can often be linearized or separated via a dependent-variable substitution. Bernoulli equations y′ + P(t)y = Q(t)yⁿ reduce to linear first-order ODEs under u = y^(1−n).',
        keyEquation: 'dy/dt + P(t)y = Q(t)yⁿ  (u = y¹⁻ⁿ)',
        methodHighlights: [
          'Apply v = y/t for homogeneous equations dy/dt = F(y/t).',
          'Transform Bernoulli equations into Lesson 1.5 linear equations via u = y^(1−n).',
          'Back-substitute to recover physical state variables.',
        ],
        realLifeApplication:
          'Solving nonlinear logistic-harvesting equations and turbulent quadratic fluid drag. In subsea ROV thrusters and wind turbines, hydrodynamic drag grows with speed squared (v²); substituting variables turns that nonlinear braking law into a solvable linear rate equation so control computers can predict stopping distance.',
      },
    ],
  },
  {
    number: 2,
    title: 'Modeling with First-Order ODEs',
    overview:
      'Translating physical conservation laws (mass, thermal energy, fluid volume, electric charge, and cable tension) into first-order differential models.',
    sections: [
      {
        id: '2.1',
        number: 'Lesson 2.1',
        title: 'Exponential Growth & Radioactive Decay',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_iv_drip_scaled_1795569263119.jpg',
        imageAlt: 'Hospital room illuminated by backlit IV infusion fluid and vital-signs monitor.',
        imageCaption: 'Exponential drug washout and medical imaging isotope half-life decay',
        conceptExplanation:
          'Whenever the rate of change of a quantity is proportional to its current amount, dy/dt = ky produces pure exponential growth (k > 0) or decay (k < 0), characterized by a constant half-life or doubling time.',
        keyEquation: 'dN/dt = −λ N  ⇒  N(t) = N₀ e^(−λt)',
        methodHighlights: [
          'Compute half-life directly from t₁/₂ = ln(2) / λ.',
          'Calibrate λ from two empirical measurements taken at different times.',
          'Recognize resource ceilings where exponential growth transitions to logistic saturation.',
        ],
        realLifeApplication:
          'Predicting post-infusion drug washout once an IV drip stops, and scheduling medical imaging radioisotopes. PET scanners rely on short-lived tracers like Fluorine-18 whose decay constant λ is fixed by nuclear physics; hospital pharmacies use N(t) = N₀ e^(−λt) to prepare an initial dose strong enough to arrive at the scanner at the exact target activity.',
      },
      {
        id: '2.2',
        number: 'Lesson 2.2',
        title: 'Newton’s Law of Cooling & Heating',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_bioreactor_scaled_1795569264427.jpg',
        imageAlt: 'Cutaway thermal vessel with copper cooling coil and glowing emerald heat streamlines.',
        imageCaption: 'Heat transfer across a vessel coil proportional to temperature difference',
        conceptExplanation:
          'An object’s temperature T(t) changes at a rate proportional to the temperature difference between the object and its ambient environment T_env(t).',
        keyEquation: 'dT/dt = −k (T(t) − T_env)',
        methodHighlights: [
          'Solve directly by separation when ambient temperature T_env is constant.',
          'Use Lesson 1.5 integrating factors when ambient temperature varies over time.',
          'Extract thermal time constant τ = 1/k from sensor readings.',
        ],
        realLifeApplication:
          'Smartphone SoC thermal dissipation modeling, battery pack cooling, and industrial metal quenching. When a processor runs a heavy workload and then idles, heat flows across the vapor chamber to the aluminum frame in proportion to T(t) − T_env; firmware uses that exponential cooling curve to predict when thermal throttling can safely lift.',
      },
      {
        id: '2.3',
        number: 'Lesson 2.3',
        title: 'Population Dynamics & Logistic Models',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_bioreactor_scaled_1795569264427.jpg',
        imageAlt: 'Laboratory bioreactor chamber with rising bubbles and controlled fluid circulation.',
        imageCaption: 'Bioreactor culture growth tapering smoothly toward carrying capacity K',
        conceptExplanation:
          'Real populations and diffusion processes face carrying capacity K. Adding self-limiting feedback yields the logistic ODE, producing a bounded S-curve.',
        keyEquation: 'dP/dt = r P (1 − P / K)',
        methodHighlights: [
          'Analyze unstable equilibrium P = 0 and stable equilibrium P = K.',
          'Identify maximum growth rate at the inflection point P = K/2.',
          'Separate with partial fractions to find the closed-form sigmoid.',
        ],
        realLifeApplication:
          'Bioreactor fermentation yield forecasting and ecological resource management. Inside a pharmaceutical bioreactor, yeast or cell cultures multiply rapidly at first until nutrient depletion and waste buildup cap growth at carrying capacity K; operators harvest near the inflection point P = K/2 where production velocity dP/dt peaks.',
      },
      {
        id: '2.4',
        number: 'Lesson 2.4',
        title: 'Mixing Phenomena',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_city_scaled_1795569260884.jpg',
        imageAlt: 'Cutaway municipal water-treatment mixing tank beside an illuminated urban tower.',
        imageCaption: 'Continuous impeller dilution inside a municipal water-treatment basin',
        conceptExplanation:
          'Compartmental mass balance sets dA/dt equal to incoming solute mass rate minus outgoing solute mass rate. Even with constant volume, continuous dilution causes contaminant concentration to decay exponentially rather than clearing in a single volume pass.',
        keyEquation: 'dA/dt = r_in · c_in − r_out · (A(t) / V(t))',
        methodHighlights: [
          'Track tank volume V(t) = V₀ + (r_in − r_out)t when inflow and outflow differ.',
          'Rewrite as a Lesson 1.5 linear ODE A′ + [r_out / V(t)]A = r_in · c_in.',
          'Calculate exact flush duration required to reach safe potable thresholds.',
        ],
        realLifeApplication:
          'Municipal water-treatment tanks: a motorized impeller continuously blends incoming clean water with residual chemical or contaminant inside the basin while treated water exits through the lower outflow pipe. Because clean water dilutes the mixture continuously, solving dA/dt = r_in · c_in − r_out · (A(t)/V(t)) tells plant operators the exact flush time needed to bring outflow concentrations below safe drinking thresholds.',
        featuredObjectId: 'water-treatment-tank',
        featuredSceneId: 'modern-city',
      },
      {
        id: '2.5',
        number: 'Lesson 2.5',
        title: 'Motion with Air Resistance (Drag Models)',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_aircraft_scaled_1795569263450.jpg',
        imageAlt: 'Twin-engine research aircraft gliding through glowing atmospheric drag streamlines.',
        imageCaption: 'Aerodynamic drag opposing motion until reaching terminal velocity',
        conceptExplanation:
          'Expressing Newton’s second law in terms of velocity v(t) converts falling and flight deceleration with aerodynamic drag into a first-order ODE, revealing terminal velocity where drag equals gravity.',
        keyEquation: 'm (dv/dt) = m g − b v  (linear)   or   m g − c v²  (quadratic)',
        methodHighlights: [
          'Solve dv/dt = 0 to find terminal velocity before integrating.',
          'Match linear drag to viscous regimes and quadratic drag to high-speed flight.',
          'Integrate v(t) to recover altitude or range s(t).',
        ],
        realLifeApplication:
          'Aircraft glide-descent aerodynamics, recovery parachutes, and particle settling. As a descending capsule deploys its canopy, quadratic air resistance rises rapidly until upward drag matches weight (dv/dt = 0), locking the capsule onto a safe terminal descent speed determined directly by canopy area and air density.',
      },
      {
        id: '2.6',
        number: 'Lesson 2.6',
        title: 'Torricelli’s Law & Draining Tanks',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_city_scaled_1795569260884.jpg',
        imageAlt: 'Municipal cylindrical holding tank with inflow and bottom drainage pipe.',
        imageCaption: 'Gravity-driven outflow speed proportional to square root of fluid depth',
        conceptExplanation:
          'Fluid exiting an orifice at depth h moves at speed √(2gh). Equating tank volume loss A(h)·dh/dt to outflow produces a separable ODE for fluid height h(t).',
        keyEquation: 'A(h) (dh/dt) = −c_d a √(2 g h)',
        methodHighlights: [
          'Express cross-sectional area A(h) from cylindrical, conical, or spherical tank geometry.',
          'Apply contraction coefficient c_d for real orifice geometry.',
          'Integrate from h(0) = H to h(T) = 0 to compute emptying time.',
        ],
        realLifeApplication:
          'Stormwater detention basin sizing and gravity-fed emergency cooling tanks. Gravity pushes water through the bottom drain valve at speed √(2gh), so flow slows down as head height h drops; integrating Torricelli’s separable equation lets civil engineers size outlet pipes so flood basins drain completely before the next storm.',
      },
      {
        id: '2.7',
        number: 'Lesson 2.7',
        title: 'Electric Circuits',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_circuit_scaled_1795569262919.jpg',
        imageAlt: 'Exploded smartphone view showing glowing capacitive grid over micro-circuitry.',
        imageCaption: 'Touchscreen capacitive sensor nodes charging through microscopic RC paths',
        conceptExplanation:
          'Applying Kirchhoff’s Voltage Law to a single loop with resistance R and capacitance C (or inductance L) produces a first-order linear ODE where the product RC sets the exponential charging and discharging timescale.',
        keyEquation: 'R (dq/dt) + (1/C) q(t) = E(t)   |   L (di/dt) + R i(t) = E(t)',
        methodHighlights: [
          'Identify time constant τ = RC (or L/R) governing transient speed.',
          'Observe how increasing capacitance C lengthens τ = RC and slows voltage rise.',
          'Separate natural transient decay from steady-state forced response.',
        ],
        realLifeApplication:
          'Smartphone capacitive touchscreens: an invisible grid of row and column electrodes forms tiny capacitors beneath the glass. When your finger touches the screen, your body adds extra capacitance C to the nearest intersection, increasing the RC time constant τ = RC; the touch controller sends rapid scan pulses and measures the slower exponential voltage rise to pinpoint your finger’s exact coordinates.',
        featuredObjectId: 'touchscreen',
        featuredSceneId: 'inside-smartphone',
      },
      {
        id: '2.8',
        number: 'Lesson 2.8',
        title: 'The Catenary (Hanging Cables)',
        chapterNumber: 2,
        imagePath: '/src/assets/images/lesson_draining_catenary_1795568953468.jpg',
        imageAlt: 'Illuminated suspension bridge cables and hanging power lines curving across a dark bay.',
        imageCaption: 'Hanging bridge cables and power lines settling into hyperbolic cosine curves',
        conceptExplanation:
          'Balancing horizontal tension T₀ and vertical cable weight along an arc length element yields y″ = (w/T₀)√(1 + (y′)²). Substituting p = dy/dx reduces this to a separable first-order ODE whose solution is the hyperbolic cosine curve.',
        keyEquation: 'dy′/dx = (w / T₀) √(1 + (y′)²)  ⇒  y(x) = (T₀ / w) cosh(w x / T₀)',
        methodHighlights: [
          'Reduce the second-order equilibrium equation by setting p = dy/dx.',
          'Separate variables with dp / √(1 + p²) = (w/T₀) dx to obtain p = sinh(wx/T₀).',
          'Integrate once more to derive the exact catenary profile rather than a parabola.',
        ],
        realLifeApplication:
          'Urban electrical transmission lines, suspension bridge main cables prior to deck loading, and arched civic vaults. Each segment of a power line supports only the weight of cable hanging below it while pulling horizontally at constant tension T₀, so the cable naturally settles into a cosh curve, which grid engineers use to calculate pole sag and winter ice clearance.',
      },
    ],
  },
  {
    number: 3,
    title: 'Higher-Order Linear Differential Equations',
    overview:
      'Linear solution spaces, characteristic polynomials, forced oscillations, and structural vibration engineering.',
    sections: [
      {
        id: '3.1',
        number: 'Lesson 3.1',
        title: 'Theory of Linear Equations & Superposition',
        chapterNumber: 3,
        imagePath: '/src/assets/images/lesson_spring_resonance_1795568952372.jpg',
        imageAlt: 'Spring-mass oscillator beside glowing multi-frequency harmonic waveforms.',
        imageCaption: 'Superposing independent linear vibration modes into composite motion',
        conceptExplanation:
          'An nth-order homogeneous linear ODE possesses an n-dimensional solution space spanned by n linearly independent functions whose Wronskian determinant is nonzero.',
        keyEquation: 'y_h(t) = c₁ y₁(t) + c₂ y₂(t),   W(y₁, y₂) ≠ 0',
        methodHighlights: [
          'Combine homogeneous solutions via the Superposition Principle.',
          'Test linear independence using the Wronskian W(y₁, y₂).',
          'Construct general nonhomogeneous solutions as y = y_h + y_p.',
        ],
        realLifeApplication:
          'Decomposing complex structural sway into independent natural vibration modes. Because tall buildings and aircraft wings obey linear elasticity for small bends, engineers solve for individual fundamental and harmonic mode shapes separately and superpose them to predict total motion under arbitrary gusts.',
      },
      {
        id: '3.2',
        number: 'Lesson 3.2',
        title: 'Reduction of Order',
        chapterNumber: 3,
        imagePath: '/src/assets/images/lesson_aircraft_scaled_1795569263450.jpg',
        imageAlt: 'Swept aerospace wings flexing subtly inside high-altitude aerodynamic flow.',
        imageCaption: 'Constructing a second independent bending mode from one known profile',
        conceptExplanation:
          'Knowing one nontrivial solution y₁(t) allows y₂(t) = u(t)y₁(t) to reduce a second-order homogeneous linear ODE to a first-order equation in u′.',
        keyEquation: 'y₂(t) = y₁(t) ∫ [ e^(−∫ P(t) dt) / y₁(t)² ] dt',
        methodHighlights: [
          'Convert to monic form y″ + P(t)y′ + Q(t)y = 0.',
          'Substitute y₂ = u(t)y₁(t) or apply the reduction integral directly.',
          'Recover the t·e^(rt) term when characteristic roots repeat.',
        ],
        realLifeApplication:
          'Finding secondary bending mode shapes in tapered aerospace wings and variable-section columns. Unlike uniform beams, tapered spars have stiffness that varies along the span, so once sensors or boundary solutions identify the primary deflection profile y₁(t), reduction of order constructs the second independent mode needed to satisfy launch-pad clamp conditions.',
      },
      {
        id: '3.3',
        number: 'Lesson 3.3',
        title: 'Homogeneous Linear Equations with Constant Coefficients',
        chapterNumber: 3,
        imagePath: '/src/assets/images/lesson_circuit_scaled_1795569262919.jpg',
        imageAlt: 'Illuminated surface-mount resistors, capacitors, and copper traces inside a device.',
        imageCaption: 'Characteristic polynomial roots determining ringing vs. clean circuit settling',
        conceptExplanation:
          'The exponential trial y = e^(rt) maps ay″ + by′ + cy = 0 onto the quadratic characteristic equation ar² + br + c = 0, linking root geometry directly to exponential, repeated-root, or oscillatory motion.',
        keyEquation: 'a r² + b r + c = 0  ⇒  r = (−b ± √(b² − 4ac)) / (2a)',
        methodHighlights: [
          'Distinct real roots (Δ > 0): c₁e^(r₁t) + c₂e^(r₂t).',
          'Repeated root (Δ = 0): (c₁ + c₂t)e^(rt).',
          'Complex conjugate roots (α ± βi): e^(αt)(c₁cos βt + c₂sin βt).',
        ],
        realLifeApplication:
          'Predicting natural ringing vs. exponential settling in RLC circuits and mechanical linkages. In high-speed digital buses and power regulators, parasitic inductance L and capacitance C form a second-order characteristic equation; choosing series damping resistance R shifts the roots from complex (ringing overshoot) to real (clean step settling).',
      },
      {
        id: '3.4',
        number: 'Lesson 3.4',
        title: 'Undetermined Coefficients & Variation of Parameters',
        chapterNumber: 3,
        imagePath: '/src/assets/images/lesson_draining_catenary_1795568953468.jpg',
        imageAlt: 'Long-span suspension bridge illuminated at night over calm dark water.',
        imageCaption: 'Predicting steady-state bridge deck response under periodic traffic loads',
        conceptExplanation:
          'To solve L[y] = g(t), undetermined coefficients constructs a particular solution matching polynomial, exponential, and sinusoidal forcing, while variation of parameters handles general continuous inputs.',
        keyEquation: 'y(t) = y_h(t) + y_p(t)',
        methodHighlights: [
          'Multiply trial y_p terms by tˢ whenever g(t) duplicates a homogeneous mode.',
          'Apply linearity to handle sums of forcing inputs.',
          'Use variation of parameters for non-elementary forcing functions.',
        ],
        realLifeApplication:
          'Evaluating steady-state highway bridge deflection under periodic traffic excitation. As rhythmic convoy axle loads cross a span at frequency ω, the particular solution y_p reveals the exact oscillating amplitude the deck will sustain once initial transient bouncing fades.',
      },
      {
        id: '3.5',
        number: 'Lesson 3.5.1–3.5.2',
        title: 'Applications of Second-Order Linear ODEs',
        chapterNumber: 3,
        isGroupParent: true,
        imagePath: '/src/assets/images/lesson_spring_resonance_1795568952372.jpg',
        imageAlt: 'Precision helical spring, suspended proof mass, and hydraulic damper schematic.',
        imageCaption: 'Coupled spring restoring stiffness and hydraulic damping in mechanical systems',
        conceptExplanation:
          'Second-order constant-coefficient ODEs unify inertia, restoring stiffness, and energy dissipation. Together, Lesson 3.5.1 and 3.5.2 build the spring-mass foundation and extend it to damped mechanical vibrations.',
        keyEquation: 'm x″ + c x′ + k x = F(t)',
        methodHighlights: [
          'Lesson 3.5.1 formulates free undamped and damped spring-mass equations around static equilibrium.',
          'Lesson 3.5.2 classifies underdamped, critically damped, and overdamped vibration regimes via ζ = c / (2√(mk)).',
          'Relate characteristic root location directly to overshoot and settling speed.',
        ],
        realLifeApplication:
          'Vehicle suspension tuning, seismic base isolators, and wind-damped skyscrapers. Coil springs store impact energy while hydraulic shock absorbers convert motion into heat proportional to velocity; together they turn jarring bumps or wind gusts into controlled second-order damped trajectories.',
      },
      {
        id: '3.5.1',
        number: 'Lesson 3.5.1',
        title: 'Free & Damped Spring-Mass Systems',
        chapterNumber: 3,
        parentGroupId: '3.5',
        imagePath: '/src/assets/images/lesson_spring_resonance_1795568952372.jpg',
        imageAlt: 'Spring-mass-damper assembly paired with oscillatory response waveforms.',
        imageCaption: 'Inertial proof mass oscillating around static spring equilibrium',
        conceptExplanation:
          'Measuring displacement x(t) from the stretched static equilibrium position cancels constant gravity from Newton’s second law, yielding m x″ + c x′ + k x = 0.',
        keyEquation: 'm x″ + c x′ + k x = 0,   ωₙ = √(k/m)',
        methodHighlights: [
          'Use equilibrium offset δ_st = mg/k to isolate pure dynamic displacement.',
          'Rewrite c₁cos(ωt) + c₂sin(ωt) in amplitude-phase form R cos(ωt − φ).',
          'Determine natural period Tₙ = 2π / ωₙ from mass and stiffness.',
        ],
        realLifeApplication:
          'Calibrating inertial accelerometers, seismometers, and vibration-isolated lab tables. Inside a MEMS accelerometer, a microscopic silicon proof mass suspended on etched springs deflects relative to the chip frame when your phone accelerates, allowing capacitance plates to read force directly from the spring-mass balance.',
      },
      {
        id: '3.5.2',
        number: 'Lesson 3.5.2',
        title: 'Mechanical Vibrations',
        chapterNumber: 3,
        parentGroupId: '3.5',
        imagePath: '/src/assets/images/lesson_city_scaled_1795569260884.jpg',
        imageAlt: 'Tall illuminated glass skyscraper surrounded by aerodynamic wind streamlines.',
        imageCaption: 'Skyscraper lateral wind sway governed by underdamped, critical, and overdamped regimes',
        conceptExplanation:
          'The discriminant c² − 4mk divides damped motion into three regimes. Increasing damping past critical damping (ζ = 1, c_crit = 2√(mk)) introduces a slow decaying real root that makes the system return to equilibrium MORE slowly than critical damping.',
        keyEquation: 'ζ = c / (2√(mk)),   c_crit = 2√(mk)',
        methodHighlights: [
          'Underdamped (ζ < 1): complex roots produce decaying oscillations across zero.',
          'Critically damped (ζ = 1): repeated root r = −ωₙ delivers the fastest non-oscillatory return.',
          'Overdamped (ζ > 1): dominant slow root r₁ = ωₙ(−ζ + √(ζ² − 1)) delays return to rest.',
        ],
        realLifeApplication:
          'Skyscraper wind-sway dampers: when a wind gust bends a tower and releases, structural steel acts like a stiff spring while hydraulic or tuned-mass dampers bleed kinetic energy away. Engineers tune damping near critical damping (ζ = c / c_crit ≈ 0.3–1.0) rather than maximizing c blindly, because pushing into the overdamped regime slows the tower’s return to vertical.',
        featuredObjectId: 'skyscraper',
        featuredSceneId: 'modern-city',
      },
      {
        id: '3.6',
        number: 'Lesson 3.6',
        title: 'Forced Vibrations & Resonance',
        chapterNumber: 3,
        imagePath: '/src/assets/images/lesson_spring_resonance_1795568952372.jpg',
        imageAlt: 'Resonant harmonic wave peaks alongside a mechanical spring-damper unit.',
        imageCaption: 'Amplitude magnification when driving frequency approaches natural frequency',
        conceptExplanation:
          'Sinusoidal forcing near natural frequency ωₙ produces beats in lightly damped systems and unbounded t sin(ωₙt) growth in pure undamped resonance.',
        keyEquation: 'm x″ + c x′ + k x = F₀ cos(ωt)',
        methodHighlights: [
          'Compute steady-state magnification factor as a function of frequency ratio ω/ωₙ.',
          'Separate transient homogeneous decay from steady-state periodic sway.',
          'Design detuned structural frequencies to avoid vortex-shedding resonance.',
        ],
        realLifeApplication:
          'Preventing wind-induced bridge flutter and balancing high-speed rotating machinery. Whenever an unbalanced rotor spins near a shaft’s natural frequency ωₙ, resonance amplifies small vibrations dramatically; adding bearing damping or shifting shaft stiffness keeps operating RPM safely away from the resonant peak.',
      },
      {
        id: '3.7',
        number: 'Lesson 3.7',
        title: 'Cauchy–Euler Equations',
        chapterNumber: 3,
        imagePath: '/src/assets/images/lesson_pressure_vessel_1795568953434.jpg',
        imageAlt: 'Cutaway cylindrical submarine pressure vessel with glowing concentric hoop-stress rings.',
        imageCaption: 'Radial hoop-stress distribution across thick-walled cylindrical shells',
        conceptExplanation:
          'Scale-invariant equations a t² y″ + b t y′ + c y = 0 simplify via y = t^r to algebraic auxiliary equations with polynomial, logarithmic, or log-periodic solutions.',
        keyEquation: 'a t² y″ + b t y′ + c y = 0  ⇒  a r(r − 1) + b r + c = 0',
        methodHighlights: [
          'Use ln(t) multipliers for repeated auxiliary roots.',
          'Convert complex roots into t^α [c₁cos(β ln t) + c₂sin(β ln t)].',
          'Ensure interval positivity t > 0 around the regular singular point t = 0.',
        ],
        realLifeApplication:
          'Radial stress gradients in thick-walled cylindrical pressure vessels. Inside submarine hulls and hydraulic accumulators, hoop stress scales with radial distance r via r²u″ + ru′ − u = 0; solving this Cauchy–Euler equation gives the exact wall thickness needed to prevent internal bursting.',
      },
    ],
  },
  {
    number: 4,
    title: 'The Laplace Transform',
    overview:
      'Transforming differential equations with discontinuous inputs and initial conditions into algebraic s-domain equations.',
    sections: [
      {
        id: '4.1',
        number: 'Lesson 4.1',
        title: 'Definition & Existence of the Laplace Transform',
        chapterNumber: 4,
        imagePath: '/src/assets/images/lesson_laplace_waves_1795568953702.jpg',
        imageAlt: 'Decaying time-domain wave transforming into frequency-domain resonant peaks.',
        imageCaption: 'Transforming continuous time transients into algebraic s-domain functions',
        conceptExplanation:
          'The Laplace transform converts a piecewise-continuous time function f(t) of exponential order on [0, ∞) into an s-domain function F(s) via an improper exponential integral.',
        keyEquation: 'L{f(t)} = F(s) = ∫₀^∞ e^(−st) f(t) dt',
        methodHighlights: [
          'Confirm piecewise continuity and exponential growth bound |f(t)| ≤ M e^(ct).',
          'Apply linearity to transform linear combinations term by term.',
          'Tabulate elementary transforms for tⁿ, e^(at), cos(ωt), and sin(ωt).',
        ],
        realLifeApplication:
          'Converting sensor impulse measurements into frequency-domain transfer models. Flight-test and robotics engineers feed step or chirp commands into an actuator and Laplace-transform the recorded output to extract the system’s poles and stability margins.',
      },
      {
        id: '4.2',
        number: 'Lesson 4.2',
        title: 'Inverse Laplace Transforms & Partial Fractions',
        chapterNumber: 4,
        imagePath: '/src/assets/images/lesson_circuit_scaled_1795569262919.jpg',
        imageAlt: 'Smartphone layered capacitive grid and micro-circuitry traces.',
        imageCaption: 'Inverting s-domain RC circuit impedances back into time-domain voltage steps',
        conceptExplanation:
          'Inverting an s-domain response Y(s) back to time y(t) relies on partial fraction decomposition and completing the square so every rational term matches a known transform pair.',
        keyEquation: 'Y(s) = P(s)/Q(s)  ⇒  y(t) = L⁻¹{Y(s)}',
        methodHighlights: [
          'Decompose denominators into linear, repeated linear, and irreducible quadratic factors.',
          'Complete the square in s² + as + b to isolate damped cosine and sine forms.',
          'Read pole locations directly to anticipate exponential decay rates.',
        ],
        realLifeApplication:
          'Recovering exact RC touchscreen step-response curves from s-domain circuit impedances. Because capacitors act simply as 1/(sC) algebraic impedances in the Laplace domain, circuit designers solve for node voltage V(s) with Ohm’s law and use partial fractions to recover the exact microsecond charging curve v(t).',
      },
      {
        id: '4.3',
        number: 'Lesson 4.3',
        title: 'Shifting Theorems (First & Second Translation)',
        chapterNumber: 4,
        imagePath: '/src/assets/images/lesson_laplace_waves_1795568953702.jpg',
        imageAlt: 'Observatory telemetry dishes and s-domain frequency shift peaks.',
        imageCaption: 'Time-delay attenuation and exponential frequency shifts in control telemetry',
        conceptExplanation:
          'Exponential modulation e^(at)f(t) shifts the s-domain variable to s − a, while delaying a signal in time by a multiplies its Laplace transform by e^(−as).',
        keyEquation: 'L{e^(at) f(t)} = F(s − a)   |   L{f(t − a) u(t − a)} = e^(−as) F(s)',
        methodHighlights: [
          'Pair First Shifting with completed-square quadratics for damped oscillations.',
          'Use Second Shifting to handle time-delayed switch-on events.',
          'Align (t − a) arguments carefully before applying L⁻¹.',
        ],
        realLifeApplication:
          'Modeling signal propagation delays and phased digital clock transitions. In networked control loops and industrial chemical pipelines, fluid or data takes a fixed travel time a before reaching the sensor; the e^(−as) shifting factor captures that pure delay cleanly inside the controller’s algebraic model.',
      },
      {
        id: '4.4',
        number: 'Lesson 4.4',
        title: 'Unit Step Functions & Piecewise Inputs',
        chapterNumber: 4,
        imagePath: '/src/assets/images/lesson_pwm_impulse_1795568955014.jpg',
        imageAlt: 'Luminous mint square-wave step pulses entering a converter and hydraulic actuator.',
        imageCaption: 'Square-wave switching pulses modeled cleanly via Heaviside step windows',
        conceptExplanation:
          'The Heaviside step function u(t − a) switches from 0 to 1 at t = a, packing piecewise forcing functions into a single algebraic expression.',
        keyEquation: 'f(t) = g₁(t) + [g₂(t) − g₁(t)] u(t − a)',
        methodHighlights: [
          'Encode finite pulses using window differences u(t − a) − u(t − b).',
          'Transform discontinuous forcing in one pass without stitching boundary intervals.',
          'Verify causal zero response prior to t = a.',
        ],
        realLifeApplication:
          'Pulse-width modulated power electronics and staged hydraulic valve actuation. Switching DC-DC buck converters snap MOSFET transistors on and off thousands of times per second; writing those square-wave voltage pulses with unit step functions u(t − a) lets engineers compute output ripple analytically.',
      },
      {
        id: '4.5-4.6',
        number: 'Lesson 4.5–4.6',
        title: 'Solving ODEs with Laplace Transforms',
        chapterNumber: 4,
        imagePath: '/src/assets/images/lesson_aircraft_scaled_1795569263450.jpg',
        imageAlt: 'Research aircraft flying through luminous gust wave streamlines above Earth horizon.',
        imageCaption: 'Solving aircraft pitch stabilization algebraically across a sudden wind gust',
        conceptExplanation:
          'Using derivative transforms L{y′} = sY(s) − y(0) and L{y″} = s²Y(s) − sy(0) − y′(0), transforming an ODE embeds initial conditions automatically into an algebraic equation for Y(s), allowing sudden step or gust inputs to be solved in one unified pipeline.',
        keyEquation: 'L{y″} = s²Y(s) − sy(0) − y′(0),   Y(s) = [G(s) + IC(s)] / (as² + bs + c)',
        methodHighlights: [
          'Transform every derivative while inserting initial conditions y(0) and y′(0) immediately.',
          'Isolate Y(s) algebraically as transfer function times input plus initial-state terms.',
          'Invert Y(s) via Lesson 4.2 partial fractions and Lesson 4.3 shifting to recover the full time response.',
        ],
        realLifeApplication:
          'Aircraft gust response: when a cruising jet hits a sudden vertical updraft, the wing’s angle of attack jumps abruptly and creates a pitching moment. Autopilot flight-control laws transform the linearized pitch ODE into the s-domain so initial trim states and discontinuous gust profiles combine into one algebraic transfer expression for Θ(s), predicting how fast aerodynamic and elevator damping stabilize the nose.',
        featuredObjectId: 'aircraft',
        featuredSceneId: 'space-aviation',
      },
      {
        id: '4.7',
        number: 'Lesson 4.7',
        title: 'Impulse Functions (Dirac Delta) & Convolution',
        chapterNumber: 4,
        imagePath: '/src/assets/images/lesson_pwm_impulse_1795568955014.jpg',
        imageAlt: 'Sharp Dirac delta shock spike entering an aerospace hydraulic landing strut.',
        imageCaption: 'Instantaneous shock impulse absorbed by a hydraulic landing-gear damper',
        conceptExplanation:
          'The Dirac delta δ(t − t₀) models an instantaneous unit impulse at t = t₀ with L{δ(t − t₀)} = e^(−t₀s), while convolution (f * g)(t) converts s-domain products into time-domain superposition integrals.',
        keyEquation: 'L{δ(t − t₀)} = e^(−t₀s)   |   L{(f * g)(t)} = F(s) G(s)',
        methodHighlights: [
          'Compute impulse response h(t) = L⁻¹{1 / P(s)}.',
          'Predict response to arbitrary turbulence profiles via convolution h * g.',
          'Explain instantaneous jumps in velocity while displacement stays continuous.',
        ],
        realLifeApplication:
          'Aerospace wind-shear spike loading, lightning transients, and shock-absorber impact design. When landing gear touches down on a runway, a massive force acts over milliseconds; modeling that impact as a Dirac delta impulse δ(t − t₀) gives the instantaneous jump in strut velocity and peak shock compression directly via convolution.',
      },
    ],
  },
];

export function getAllSectionsFlat(): ChapterSection[] {
  return CHAPTERS.flatMap((ch) => ch.sections);
}

export function findSectionById(sectionId: string): ChapterSection | undefined {
  return getAllSectionsFlat().find((s) => s.id === sectionId);
}

export function findSceneById(sceneId: string): SceneDefinition | undefined {
  return SCENES.find((s) => s.id === sceneId);
}

export function findObjectInScene(
  sceneId: string,
  objectId?: string
): SceneObject | undefined {
  const scene = findSceneById(sceneId);
  if (!scene || !objectId) return undefined;
  return scene.objects.find((o) => o.id === objectId);
}
