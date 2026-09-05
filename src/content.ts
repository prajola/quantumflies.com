/**
 * Every word on the homepage.
 *
 * Separated from the components on purpose: the positioning here is new and
 * will be rewritten several times before it is right, and that should not
 * mean touching JSX. Change a string, the page changes.
 *
 * ── WHAT IS ASSUMED, AND SHOULD BE CHECKED ───────────────────────────────
 * QuantumClaw and QuantumClue were given as names without definitions, so
 * they are written here as the natural division of a trust layer:
 *
 *   Claw  enforcement — the veto that sits in the control path
 *   Clue  evidence    — the forensic record that proves what was decided
 *
 * Every figure below (6 ms, 2.4M scenarios, 99.999%) is a PLACEHOLDER chosen
 * to be plausible for this class of system. None of them are measured. They
 * are marked with `unverified: true` where they appear as headline claims so
 * they are easy to find and replace before this is public.
 */

export const NAV = [
  { label: "Platform", href: "/platform" },
  { label: "QuantumClaw", href: "/quantumclaw" },
  { label: "Solutions", href: "/solutions" },
  { label: "Developers", href: "/developers" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
];

export const CTA_LABEL = "Get early access";

export const HERO = {
  eyebrow: "Independent · Runtime · Vendor-neutral",
  titleLead: "The",
  titleAccent: "independent",
  titleRest: "trust and runtime decision layer for autonomous machines.",
  lede:
    "QuantumFlies sits between what an autonomous system intends to do and what its actuators are allowed to do. Every command is bounded against a certified envelope, decided in the control path, and signed — so a machine's behaviour can be proven to an outsider, not just asserted by its vendor.",
  primary: "Get early access",
  secondary: "Read the architecture",
  metrics: [
    { value: "6 ms", label: "Decision to enforcement, p99", unverified: true },
    { value: "100%", label: "Actuations signed" },
    { value: "0", label: "Unbounded commands" },
  ],
  cardTitle: "Action Gate",
  cardBody:
    "Bounds every trajectory to a certified operating envelope, and refuses the command that would leave it.",
  cardTags: ["Geofence", "Kinematics", "E-stop"],
  /** Faint vocabulary drifting behind the copy. */
  drift: [
    "GEOFENCE", "TORQUE", "LIDAR", "E-STOP", "ODD",
    "ENVELOPE", "ATTEST", "KINEMATICS", "LATENCY", "FAULT",
  ],
};

export const PROBLEM = {
  eyebrow: "01 — The problem",
  title: "The vendor that builds the autonomy also grades it.",
  lede:
    "Physical AI shipped before its assurance model did. The stack that plans the motion is the same stack that certifies the motion was safe, and there is no second signature anywhere in the loop.",
  items: [
    {
      title: "Self-certification",
      body: "The planner proposes the trajectory and the planner's own guardrails approve it. A confident wrong answer has nothing structural standing between it and an actuator.",
    },
    {
      title: "Logs, not evidence",
      body: "After an incident there is telemetry to interpret, not a signed chain from sensor frame to actuation. Reconstruction becomes an argument between parties who both have an interest in the answer.",
    },
    {
      title: "Assurance lags the model",
      body: "A policy update ships in an afternoon. The safety case behind it takes a quarter. In the gap, the deployed behaviour is not the certified behaviour.",
    },
    {
      title: "Fleet drift",
      body: "Behaviour certified on one site degrades on the next — different floor, different light, different people — and nothing notices until something is already broken.",
    },
  ],
};

export const HOW = {
  eyebrow: "02 — How it works",
  title: "Five stages, on every single actuation.",
  lede:
    "The same path runs whether the machine is lifting a pallet or standing still. There is no fast path that skips the gate.",
  steps: [
    {
      tag: "Observe",
      title: "Capture at the actuation boundary",
      body: "Sensor state, kinematic state and the commanded trajectory are read where the command leaves the planner — not upstream, where it can still change.",
    },
    {
      tag: "Bound",
      title: "Test against a certified envelope",
      body: "Geometry, torque, velocity, separation distance and operating design domain. The envelope is versioned, signed, and readable by someone who did not write it.",
    },
    {
      tag: "Decide",
      title: "Allow, clamp or refuse",
      body: "The Action Gate returns one of three verdicts inside a fixed latency budget. A decision that misses its budget is a refusal, not a delay.",
    },
    {
      tag: "Enforce",
      title: "Apply the verdict in the control path",
      body: "QuantumClaw holds the actuation until the verdict exists. Fail-closed by construction: if the gate is unreachable, nothing moves.",
    },
    {
      tag: "Record",
      title: "Write the decision down",
      body: "Inputs, envelope version, verdict and signature go to an append-only record that QuantumClue can replay deterministically, months later.",
    },
  ],
};

export const CLAW = {
  eyebrow: "03 — QuantumClaw",
  title: "The enforcement point, inside the control path.",
  lede:
    "A veto that runs as a library inside the system it is meant to veto is not a veto. QuantumClaw executes in its own context, with its own watchdog and its own clock, so refusing a command never depends on the health of the thing being refused.",
  points: [
    "Sits between the planner's output and the actuator driver, not beside it.",
    "Fail-closed: loss of gate, stale evidence or a missed deadline all hold the actuator.",
    "Its own watchdog and power domain, so a hung planner cannot also hang the veto.",
    "Opens no inbound ports. It polls for signed envelope updates and never accepts a pushed command.",
  ],
  specs: [
    { k: "Decision to enforcement", v: "6 ms p99", unverified: true },
    { k: "Default posture", v: "Fail-closed" },
    { k: "Execution context", v: "Independent of planner" },
    { k: "Inbound network", v: "None" },
  ],
};

export const GATE = {
  eyebrow: "04 — Action Gate",
  title: "Every actuation gets a verdict and a reason.",
  lede:
    "Three outcomes, not two. The middle one is the reason the system stays switched on: a gate that can only allow or refuse gets disabled within a week, because refusing a nearly-safe command stops the line and someone has a quota to hit.",
  verdicts: [
    {
      key: "allow",
      name: "Allow",
      body: "Inside the envelope. The command passes through untouched and the decision is signed.",
    },
    {
      key: "clamp",
      name: "Clamp",
      body: "Outside a soft bound. The command is projected onto the nearest trajectory that is inside the envelope, and the machine keeps working.",
    },
    {
      key: "refuse",
      name: "Refuse",
      body: "Outside a hard bound, or the evidence behind it is stale. The actuator holds and the incident escalates with its full argument attached.",
    },
  ],
  note:
    "Every verdict carries the envelope version it was judged against, so a decision made today is still explicable after the envelope has moved on.",
};

export const SOLUTIONS = {
  eyebrow: "05 — Solutions",
  title: "Wherever a model can move something heavy.",
  lede:
    "The envelope changes shape per domain. The gate, the enforcement point and the record do not.",
  items: [
    { name: "Humanoids & legged", body: "Whole-body torque and footstep bounds when the machine is working near people." },
    { name: "Warehouse AMRs", body: "Aisle geofences, human proximity envelopes and dock approach speeds across mixed traffic." },
    { name: "Industrial arms", body: "Cell boundaries, payload limits and tool-change interlocks that hold under a new policy." },
    { name: "Agriculture & drones", body: "Geofence, altitude and airspace bounds, with separation from ground crew." },
    { name: "Yard, port & logistics", body: "Low-speed autonomy around fixed infrastructure, trailers and people on foot." },
  ],
};

export const SIMULATION = {
  eyebrow: "06 — Simulation",
  title: "Certify the envelope before it meets a machine.",
  lede:
    "Envelopes are code, so they can be tested like code. Replay a fleet's recorded trajectories against a proposed envelope and see exactly which actuations would have changed — before a single robot runs it.",
  points: [
    { k: "Scenario replay", v: "2.4M scenarios overnight", unverified: true },
    { k: "Envelope diff", v: "Every change compared against fleet history" },
    { k: "Regression gate", v: "A change that would have allowed a past incident fails the build" },
  ],
  note:
    "This is the part that makes the safety case a living artefact rather than a PDF: it is regenerated on every envelope change, from real trajectories.",
};

export const CLUE = {
  eyebrow: "07 — QuantumClue",
  title: "Reconstruct any decision, down to its inputs.",
  lede:
    "QuantumClue is the forensic half. Every verdict is deterministically reproducible — same inputs, same envelope version, same answer — which turns an incident review from a negotiation into a replay.",
  points: [
    "Append-only record, written at the moment of decision rather than reconstructed after it.",
    "Signed chain from sensor frame through verdict to actuation, with no gap a party can dispute.",
    "Deterministic replay: run the exact decision again, months later, and get the same verdict.",
    "Exports a safety case an insurer, a regulator or a customer can read without your help.",
  ],
  specs: [
    { k: "Record", v: "Append-only" },
    { k: "Replay", v: "Deterministic" },
    { k: "Chain", v: "Sensor → verdict → actuation" },
    { k: "Export", v: "Readable safety case" },
  ],
};

export const FLEET = {
  eyebrow: "08 — Fleet",
  title: "One policy, many sites, no quiet drift.",
  lede:
    "Envelopes are versioned and rolled out like software, because that is what they are.",
  items: [
    { name: "Staged rollout", body: "A new envelope reaches one machine, then one site, then the fleet — with automatic rollback the moment refusal rates move outside their band." },
    { name: "Per-site parameters", body: "One policy, parameterised per site. A narrower aisle in Rotterdam is a value, not a fork of the safety case." },
    { name: "Drift detection", body: "Live behaviour is compared continuously against the certified envelope, so degradation surfaces as a signal rather than as an incident." },
  ],
};

export const ARCHITECTURE = {
  eyebrow: "09 — Architecture",
  title: "Independent by construction, not by promise.",
  lede:
    "Independence that depends on us behaving is not independence. These are structural properties — they hold whether or not we are trustworthy.",
  layers: [
    { name: "Autonomy stack", body: "Perception, planning, policy. Any vendor. We do not compete here.", muted: true },
    { name: "QuantumFlies", body: "Action Gate decides. QuantumClaw enforces. QuantumClue records.", accent: true },
    { name: "Actuators", body: "Motors, drives, hydraulics — reached only through the gate.", muted: true },
  ],
  points: [
    { k: "On the machine", v: "The decision runs in the control path. No network round trip stands between intent and enforcement." },
    { k: "Zero inbound", v: "The on-machine runtime opens no ports. It polls for signed envelope updates and never accepts a pushed command." },
    { k: "Signed both ways", v: "Envelopes are signed by you. Decisions are signed by Claw. Neither side can rewrite the other's history." },
    { k: "Above any stack", v: "It bounds a planner rather than replacing one, so it works over an in-house stack or a full-stack vendor platform alike." },
  ],
};

export const WHY = {
  eyebrow: "10 — Why QuantumFlies",
  title: "Independence is the product.",
  lede:
    "Robotics safety is being absorbed into full-stack physical-AI platforms, which is exactly why a layer that is not part of any of them has a job. The value is not the check. It is who is signing it.",
  items: [
    {
      title: "We do not build the autonomy",
      body: "No planner of our own means no incentive to pass our own homework — the one property a full-stack vendor structurally cannot offer.",
    },
    {
      title: "Portable across stacks",
      body: "One safety case that survives a change of supplier. The envelope is yours; it does not leave with the vendor that wrote the planner.",
    },
    {
      title: "Readable by outsiders",
      body: "Insurers, regulators and your customers can read the evidence directly, which is what turns a safety claim into a commercial asset.",
    },
    {
      title: "Runtime, not review",
      body: "Assurance that holds at three in the morning on a live floor, rather than a document describing how things were last quarter.",
    },
  ],
};

export const CTA = {
  title: "Machines are already moving. Decide who signs for them.",
  lede:
    "We are working with a small number of fleet operators and robot makers ahead of general availability.",
  primary: "Get early access",
  secondary: "Read the architecture",
};

/**
 * Footer.
 *
 * Columns mirror the primary nav so the two never disagree about what the
 * site contains — a footer that lists sections the nav does not is the first
 * sign the IA has drifted.
 *
 * ── TWO DELIBERATE OMISSIONS ─────────────────────────────────────────────
 * 1. No certification badges. ISO 26262 / IEC 61508 / SOC 2 marks are the
 *    obvious thing to put in a safety company's footer and the worst thing
 *    to invent: they are verifiable claims about audits that either happened
 *    or did not. Add them when they are true, with the certificate number.
 * 2. No newsletter capture. The CTA directly above already asks for early
 *    access; a second capture 200px below competes with it and wins nothing.
 */
export const FOOTER = {
  tagline:
    "The independent trust and runtime decision layer for autonomous machines.",
  columns: [
    {
      title: "Platform",
      links: [
        { label: "Overview", href: "/platform" },
        { label: "Action Gate", href: "/#action-gate" },
        { label: "Envelopes", href: "/platform/envelopes" },
        { label: "Architecture", href: "/#architecture" },
      ],
    },
    {
      title: "Products",
      links: [
        { label: "QuantumClaw", href: "/quantumclaw" },
        { label: "QuantumClue", href: "/quantumclue" },
        { label: "Simulation", href: "/#simulation" },
        { label: "Fleet", href: "/#fleet" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Humanoids & legged", href: "/solutions/humanoids" },
        { label: "Warehouse AMRs", href: "/solutions/amr" },
        { label: "Industrial arms", href: "/solutions/arms" },
        { label: "Agriculture & drones", href: "/solutions/aerial" },
        { label: "Yard, port & logistics", href: "/solutions/yard" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "Documentation", href: "/developers" },
        { label: "API reference", href: "/developers/api" },
        { label: "SDKs", href: "/developers/sdks" },
        { label: "Changelog", href: "/developers/changelog" },
        { label: "Status", href: "https://status.quantumflies.com" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/company" },
        { label: "Resources", href: "/resources" },
        { label: "Careers", href: "/company/careers" },
        { label: "Contact", href: "/company/contact" },
      ],
    },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Responsible disclosure", href: "/security/disclosure" },
  ],
  company: "QuantumFlies Ltd.",
};
