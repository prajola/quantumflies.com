/**
 * Every sub-page, as data.
 *
 * A page is { path, title, eyebrow, lede, blocks }. The router maps path →
 * this record, and lib/blocks.tsx decides how each block is drawn. Adding a
 * page means adding an entry here and nothing else.
 *
 * ── WHAT IS REAL AND WHAT IS NOT ─────────────────────────────────────────
 * The product story (gate, envelope, Claw, Clue) is coherent and follows from
 * the homepage, but it was written from a name and a one-line positioning
 * statement, not from a spec. Treat it as a strong draft to correct.
 *
 * Three kinds of thing are deliberately NOT invented, because they are
 * verifiable and a wrong answer is worse than an absent one:
 *
 *   · certifications — no ISO 26262 / IEC 61508 / SOC 2 claims anywhere
 *   · dated releases — the changelog does not list versions that never shipped
 *   · job openings   — careers says there are none rather than inventing them
 *
 * Numbers that are targets carry `unverified: true` and render a visible
 * `est.` marker. Grep for it before this goes public.
 */

import type { Block } from "@/lib/blocks";

export type PageDef = {
  path: string;
  /** Browser title, minus the site suffix. */
  title: string;
  eyebrow: string;
  heading: string;
  lede: string;
  blocks: Block[];
};

const CTA_NOTE =
  "QuantumFlies is pre-general-availability. We are working with a small number of fleet operators and robot makers, and the fastest way in is to tell us what your machines do.";

/* ═══ Platform ═══════════════════════════════════════════════════════ */

const platform: PageDef = {
  path: "/platform",
  title: "Platform",
  eyebrow: "Platform",
  heading: "One decision, taken in the control path, on every actuation.",
  lede:
    "The platform is four parts that share one record: an envelope that says what is allowed, a gate that decides, an enforcement point that holds the actuator, and a forensic log that proves what happened.",
  blocks: [
    {
      kind: "cards",
      title: "The four parts",
      items: [
        { name: "Envelopes", body: "The certified statement of what a machine may do — geometry, torque, velocity, separation, ODD. Versioned and signed.", href: "/platform/envelopes" },
        { name: "Action Gate", body: "Returns allow, clamp or refuse inside a fixed latency budget. A decision that misses its budget is a refusal.", href: "/#action-gate" },
        { name: "QuantumClaw", body: "The enforcement point. Runs in its own context so refusing a command never depends on the health of what is being refused.", href: "/quantumclaw" },
        { name: "QuantumClue", body: "The forensic record. Deterministic replay of any decision, months later, from the inputs it actually saw.", href: "/quantumclue" },
      ],
    },
    {
      kind: "points",
      title: "What it is not",
      lede:
        "Being clear about the boundary is most of the value — a layer that quietly grows into a planner stops being independent of one.",
      items: [
        "Not a planner. We do not generate trajectories, and we have no opinion about how yours are produced.",
        "Not a perception stack. We consume state; we do not compete for the sensor budget.",
        "Not a replacement for functional safety hardware. An e-stop is still an e-stop, and Claw sits alongside it rather than in place of it.",
        "Not a cloud dependency. The decision happens on the machine; the network carries envelopes and evidence, never the verdict.",
      ],
    },
    {
      kind: "steps",
      title: "Adopting it",
      items: [
        { tag: "Shadow", body: "Claw runs alongside the existing control path and records what it would have decided, changing nothing. This is where the envelope gets calibrated against reality." },
        { tag: "Clamp", body: "Soft bounds are enforced. Commands are projected back inside the envelope; hard refusals still only log." },
        { tag: "Enforce", body: "Full authority. Hard bounds hold the actuator, and every actuation carries a signed verdict." },
      ],
    },
    { kind: "note", body: CTA_NOTE },
  ],
};

const envelopes: PageDef = {
  path: "/platform/envelopes",
  title: "Envelopes",
  eyebrow: "Platform",
  heading: "An envelope is the safety case, in a form a machine can check.",
  lede:
    "Most safety cases are documents. A document cannot refuse a command. An envelope is the same argument written so that it is executable at the actuation boundary, versioned like code, and readable by someone who did not write it.",
  blocks: [
    {
      kind: "specs",
      title: "What an envelope constrains",
      rows: [
        { k: "Geometry", v: "Geofences, keep-out volumes, cell boundaries, reach limits" },
        { k: "Kinematics", v: "Velocity, acceleration, jerk and joint-space limits" },
        { k: "Force", v: "Torque and payload ceilings, contact-force limits near people" },
        { k: "Separation", v: "Minimum distance to tracked humans, scaled by closing speed" },
        { k: "ODD", v: "The operating design domain — conditions under which the above are valid at all" },
      ],
    },
    {
      kind: "points",
      title: "Properties that make it useful",
      items: [
        "Versioned. Every verdict records the envelope version it was judged against, so a decision stays explicable after the envelope moves on.",
        "Signed by you. We enforce envelopes; we do not author them. The signing key is the customer's.",
        "Parameterised, not forked. A narrower aisle at one site is a value, not a second copy of the safety case that then drifts.",
        "Testable. An envelope change is replayed against recorded fleet trajectories before it reaches a machine.",
      ],
    },
    {
      kind: "code",
      title: "Shape of a definition",
      lede:
        "Illustrative rather than final — the schema is still moving, and this is here to show that an envelope is a reviewable artefact, not a binary blob.",
      code: `envelope: warehouse-amr
version: 12
signed_by: ops@example.com

separation:
  human_min_distance_m: 1.2
  scale_with_closing_speed: true

kinematics:
  max_velocity_mps: 1.8
  max_accel_mps2: 0.9

geometry:
  keep_out:
    - name: dock-approach
      polygon: [[12.0, 4.2], [18.5, 4.2], [18.5, 9.0], [12.0, 9.0]]

odd:
  requires:
    - floor_wet: false
    - localisation_confidence_min: 0.92`,
    },
    { kind: "note", body: "On losing ODD validity: an envelope whose preconditions no longer hold does not degrade quietly. It refuses, because a bound that was only ever valid on a dry floor is not a bound on a wet one." },
  ],
};

const architecture: PageDef = {
  path: "/architecture",
  title: "Architecture",
  eyebrow: "Platform",
  heading: "Independent by construction, not by promise.",
  lede:
    "Independence that depends on us behaving well is not independence. These are structural properties: they hold whether or not we are trustworthy, and they are the reason a third party can be worth more than a first-party guardrail.",
  blocks: [
    {
      kind: "specs",
      title: "Structural properties",
      rows: [
        { k: "On the machine", v: "The decision runs in the control path. No network round trip stands between intent and enforcement." },
        { k: "Zero inbound", v: "The on-machine runtime opens no ports. It polls for signed envelope updates and never accepts a pushed command." },
        { k: "Signed both ways", v: "Envelopes are signed by the operator. Verdicts are signed by Claw. Neither side can rewrite the other's history." },
        { k: "Fail-closed", v: "Loss of gate, stale evidence or a missed deadline all hold the actuator rather than passing the command." },
        { k: "Above any stack", v: "It bounds a planner rather than replacing one, so it works over an in-house stack or a full-stack vendor platform alike." },
      ],
    },
    {
      kind: "table",
      title: "Where each part runs",
      cols: ["Component", "Location", "Reachable from network"],
      rows: [
        ["QuantumClaw", "On the machine, in the control path", "No — polls only"],
        ["Action Gate", "On the machine, with Claw", "No"],
        ["Envelope registry", "Operator's infrastructure or ours", "Yes, read-only to the machine"],
        ["QuantumClue store", "Operator's infrastructure or ours", "Write-only from the machine"],
      ],
    },
    {
      kind: "points",
      title: "The trust argument",
      lede:
        "Robotics safety is being absorbed into full-stack physical-AI platforms. That is exactly why a layer outside all of them has a job.",
      items: [
        "The party that builds the autonomy cannot be the party that certifies it and still call the certificate independent.",
        "A signature is only worth the independence of whoever holds the key. Ours signs verdicts; yours signs envelopes.",
        "Evidence that only its author can interpret is not evidence. Clue exports a record an insurer or regulator can read without us.",
        "A safety case that leaves when you change autonomy vendor was never yours.",
      ],
    },
  ],
};

/* ═══ Products ═══════════════════════════════════════════════════════ */

const claw: PageDef = {
  path: "/quantumclaw",
  title: "QuantumClaw",
  eyebrow: "Products",
  heading: "The enforcement point, inside the control path.",
  lede:
    "A veto that runs as a library inside the system it is meant to veto is not a veto. QuantumClaw executes in its own context, with its own watchdog and its own clock, so refusing a command never depends on the health of the thing being refused.",
  blocks: [
    {
      kind: "points",
      title: "How it holds",
      items: [
        "Sits between the planner's output and the actuator driver, not beside it. There is no path around it.",
        "Fail-closed: loss of gate, stale evidence or a missed deadline all hold the actuator.",
        "Its own watchdog and power domain, so a hung planner cannot also hang the veto.",
        "Opens no inbound ports. It polls for signed envelope updates and never accepts a pushed command.",
        "Every verdict it enforces is signed before the actuation happens, not logged after it.",
      ],
    },
    {
      kind: "specs",
      title: "Characteristics",
      rows: [
        { k: "Decision to enforcement", v: "6 ms p99", unverified: true },
        { k: "Default posture", v: "Fail-closed" },
        { k: "Execution context", v: "Independent of the planner" },
        { k: "Inbound network", v: "None" },
        { k: "Envelope updates", v: "Polled, signed, staged" },
      ],
    },
    {
      kind: "table",
      title: "Failure modes, and what each one does",
      lede: "The useful question about a safety component is not what it does when things work.",
      cols: ["Failure", "Behaviour"],
      rows: [
        ["Planner hangs", "No commands arrive; the actuator holds at its last bounded state."],
        ["Gate misses its deadline", "Treated as a refusal. A late decision is not a decision."],
        ["Evidence goes stale", "Refuse. A bound computed from an old world state is not a bound."],
        ["Envelope fails signature check", "Rejected; the previously trusted envelope stays in force."],
        ["Claw itself faults", "Watchdog drops the actuation enable line. Nothing moves."],
      ],
    },
    { kind: "note", body: "Claw does not replace functional-safety hardware. An e-stop remains an e-stop; Claw sits alongside it and constrains the far larger space of commands that are not emergencies but are still outside the envelope." },
  ],
};

const clue: PageDef = {
  path: "/quantumclue",
  title: "QuantumClue",
  eyebrow: "Products",
  heading: "Reconstruct any decision, down to its inputs.",
  lede:
    "QuantumClue is the forensic half. Every verdict is deterministically reproducible — same inputs, same envelope version, same answer — which turns an incident review from a negotiation between interested parties into a replay.",
  blocks: [
    {
      kind: "points",
      title: "What it guarantees",
      items: [
        "Append-only, written at the moment of decision rather than reconstructed from telemetry afterwards.",
        "Signed chain from sensor frame through verdict to actuation, with no gap a party can dispute.",
        "Deterministic replay: run the exact decision again months later and get the same verdict, or the record is invalid.",
        "Exports a safety case an insurer, regulator or customer can read without our help.",
      ],
    },
    {
      kind: "steps",
      title: "An incident review, in order",
      items: [
        { tag: "Locate", body: "Find the actuation by time, machine, or the verdict that preceded it. Every record is addressable." },
        { tag: "Replay", body: "Re-run the decision against the envelope version in force at the time, not the current one." },
        { tag: "Diff", body: "Compare what the envelope allowed with what the machine did. If those disagree, the fault is ours and the record proves it." },
        { tag: "Export", body: "Produce a signed account of the sequence that stands up outside the room it was written in." },
      ],
    },
    {
      kind: "specs",
      title: "Characteristics",
      rows: [
        { k: "Record", v: "Append-only" },
        { k: "Replay", v: "Deterministic" },
        { k: "Chain", v: "Sensor → verdict → actuation" },
        { k: "Retention", v: "Operator-defined, minimum bounded by envelope version lifetime" },
        { k: "Export", v: "Signed, human-readable safety case" },
      ],
    },
  ],
};

/* ═══ Solutions ══════════════════════════════════════════════════════ */

type Vertical = { slug: string; name: string; blurb: string; heading: string; lede: string; bounds: Row_[]; risks: string[] };
type Row_ = { k: string; v: string };

const VERTICALS: Vertical[] = [
  {
    slug: "humanoids",
    name: "Humanoids & legged",
    blurb: "Whole-body torque and footstep bounds when the machine is working near people.",
    heading: "A machine with a centre of mass above your head.",
    lede:
      "Legged platforms fail differently from wheeled ones: the failure is a fall, the mass is high, and the people are close. The envelope has to constrain whole-body dynamics, not just the end effector.",
    bounds: [
      { k: "Contact force", v: "Ceilings by body region, scaled by approach speed" },
      { k: "Footstep placement", v: "Keep-out volumes for the swing foot, not only the torso" },
      { k: "Capture region", v: "Commands that leave no recoverable stance are refused" },
      { k: "Separation", v: "Minimum distance to tracked humans, widened while the gait is unstable" },
    ],
    risks: [
      "A planner that is confident about a step it cannot recover from.",
      "Payload changes that silently invalidate the balance model the envelope assumed.",
      "Crowds, where separation is not a distance but a distribution.",
    ],
  },
  {
    slug: "amr",
    name: "Warehouse AMRs",
    blurb: "Aisle geofences, human proximity envelopes and dock approach speeds across mixed traffic.",
    heading: "Mixed traffic is the hard part, not navigation.",
    lede:
      "An AMR in an empty aisle is a solved problem. An AMR in an aisle with a pallet truck, a picker on foot and a blind corner is where the envelope earns its place.",
    bounds: [
      { k: "Aisle geofence", v: "Per-aisle speed and keep-out, parameterised per site" },
      { k: "Blind corners", v: "Speed capped by the distance at which the vehicle can stop within sensor range" },
      { k: "Dock approach", v: "Hard velocity ceiling inside the dock volume regardless of task priority" },
      { k: "Human proximity", v: "Separation scaled by closing speed, not a fixed radius" },
    ],
    risks: [
      "Throughput pressure quietly widening the envelope one parameter at a time.",
      "Localisation confidence dropping without the speed limit following it down.",
      "A fleet certified in one warehouse deployed into another with a different floor.",
    ],
  },
  {
    slug: "arms",
    name: "Industrial arms",
    blurb: "Cell boundaries, payload limits and tool-change interlocks that hold under a new policy.",
    heading: "The cell boundary has to survive the policy update.",
    lede:
      "Industrial arms have had safety envelopes for decades. What is new is that the thing commanding them is now a learned policy that can be retrained on a Tuesday.",
    bounds: [
      { k: "Cell geometry", v: "Keep-out volumes in joint space as well as Cartesian space" },
      { k: "Payload", v: "Torque ceilings that follow the tool actually attached, not the one configured" },
      { k: "Tool change", v: "Interlocks that hold through the transition, when the model is least certain" },
      { k: "Speed & separation", v: "Reduced-speed regimes when a human enters the monitored zone" },
    ],
    risks: [
      "A policy update that generalises badly to a fixture it has not seen.",
      "Configured payload drifting away from actual payload.",
      "Envelope parameters copied between cells that are not actually identical.",
    ],
  },
  {
    slug: "aerial",
    name: "Agriculture & drones",
    blurb: "Geofence, altitude and airspace bounds, with separation from ground crew.",
    heading: "Outdoors, the envelope includes the weather.",
    lede:
      "Field robotics loses the two things indoor autonomy relies on: a stable environment and a known population. The ODD does most of the work here.",
    bounds: [
      { k: "Geofence", v: "Field and airspace boundaries with altitude ceilings and floors" },
      { k: "Ground crew", v: "Separation from tracked people, widened in low visibility" },
      { k: "ODD", v: "Wind, visibility and GNSS quality as preconditions rather than warnings" },
      { k: "Return behaviour", v: "Bounded return paths that stay inside the envelope when a link is lost" },
    ],
    risks: [
      "Conditions moving outside the ODD mid-task, with no one deciding to stop.",
      "GNSS degradation treated as a nuisance rather than as a bound.",
      "Seasonal changes to a field that the certified envelope predates.",
    ],
  },
  {
    slug: "yard",
    name: "Yard, port & logistics",
    blurb: "Low-speed autonomy around fixed infrastructure, trailers and people on foot.",
    heading: "Low speed, high mass, people on foot.",
    lede:
      "Yard autonomy is slow, which makes it feel safe and is exactly why the envelope matters: the kinetic energy is enormous and the humans are unprotected and unpredictable.",
    bounds: [
      { k: "Site geofence", v: "Lane, apron and pedestrian-route separation as hard geometry" },
      { k: "Mass-aware limits", v: "Velocity ceilings that follow the loaded mass, not the nominal one" },
      { k: "Coupling", v: "Interlocks around trailer coupling and uncoupling states" },
      { k: "Pedestrian zones", v: "Hard stop volumes around marked walkways" },
    ],
    risks: [
      "Speed limits set for an empty tractor applied to a loaded one.",
      "Mixed manual and autonomous traffic with no shared model of right of way.",
      "Weather closing sensor range without closing the operating envelope.",
    ],
  },
];

const solutionsIndex: PageDef = {
  path: "/solutions",
  title: "Solutions",
  eyebrow: "Solutions",
  heading: "Wherever a model can move something heavy.",
  lede:
    "The envelope changes shape per domain. The gate, the enforcement point and the record do not — which is the point of having a layer rather than a product per vertical.",
  blocks: [
    {
      kind: "cards",
      items: VERTICALS.map((v) => ({
        name: v.name,
        body: v.blurb,
        href: `/solutions/${v.slug}`,
      })),
    },
    { kind: "note", body: "If your domain is not listed, the question we will ask is what the machine can do to a person who is not paying attention. That answer is the envelope." },
  ],
};

const verticalPages: PageDef[] = VERTICALS.map((v) => ({
  path: `/solutions/${v.slug}`,
  title: v.name,
  eyebrow: "Solutions",
  heading: v.heading,
  lede: v.lede,
  blocks: [
    { kind: "specs", title: "What the envelope bounds", rows: v.bounds },
    { kind: "points", title: "What tends to go wrong", items: v.risks },
    {
      kind: "cards",
      title: "The rest of the platform",
      items: [
        { name: "Envelopes", body: "How a bound is defined, versioned and signed.", href: "/platform/envelopes" },
        { name: "QuantumClaw", body: "Where the verdict is enforced.", href: "/quantumclaw" },
        { name: "QuantumClue", body: "How a decision is reconstructed afterwards.", href: "/quantumclue" },
      ],
    },
  ],
}));

/* ═══ Developers ═════════════════════════════════════════════════════ */

const developers: PageDef = {
  path: "/developers",
  title: "Documentation",
  eyebrow: "Developers",
  heading: "Integrate at the actuation boundary.",
  lede:
    "The integration is deliberately small: you hand Claw the command you are about to execute and the state you computed it from, and it hands back a verdict. Everything else is envelope authoring and evidence.",
  blocks: [
    {
      kind: "steps",
      title: "Integration, end to end",
      items: [
        { tag: "Place", body: "Put Claw between your planner's output and your actuator driver. If there is a path that bypasses it, the integration is not finished." },
        { tag: "Submit", body: "Pass the intended command plus the state it was derived from. State matters: a bound computed from stale input is not a bound." },
        { tag: "Honour", body: "Apply the verdict. Allow passes through, clamp substitutes the returned trajectory, refuse holds." },
        { tag: "Shadow first", body: "Run in shadow mode until the refusal rate reflects reality rather than a mis-calibrated envelope." },
      ],
    },
    {
      kind: "code",
      title: "The shape of the call",
      lede: "Illustrative. The interface is pre-release and will change.",
      code: `from quantumflies import Claw

claw = Claw(envelope="warehouse-amr")

verdict = claw.submit(
    command=planned_trajectory,
    state=world_state,          # what the plan was derived from
)

if verdict.allow:
    drive.execute(planned_trajectory)
elif verdict.clamp:
    drive.execute(verdict.trajectory)   # projected back inside the envelope
else:
    drive.hold()
    incidents.escalate(verdict.reason, verdict.evidence_id)`,
    },
    {
      kind: "points",
      title: "Rules the integration has to keep",
      items: [
        "Never cache a verdict. A verdict is about one command and one world state.",
        "Never treat a timeout as an allow. A decision that misses its deadline is a refusal.",
        "Always pass the state you actually planned from, not the freshest state available.",
        "Do not implement your own retry around a refusal. Escalate it — that is what refusal means.",
      ],
    },
  ],
};

const api: PageDef = {
  path: "/developers/api",
  title: "API reference",
  eyebrow: "Developers",
  heading: "API reference.",
  lede:
    "Pre-release. The surface below is the intended shape rather than a stable contract, and it is published early so integrators can argue with it while it is still cheap to change.",
  blocks: [
    {
      kind: "table",
      title: "On-machine interface",
      lede: "Local to the machine. Not reachable from the network.",
      cols: ["Call", "Returns", "Notes"],
      rows: [
        ["submit(command, state)", "Verdict", "The hot path. Must complete inside the configured budget or it is a refusal."],
        ["envelope()", "EnvelopeInfo", "Which envelope and version is currently in force."],
        ["health()", "Health", "Watchdog state, gate reachability, evidence-queue depth."],
      ],
    },
    {
      kind: "table",
      title: "Control-plane interface",
      lede: "Operator infrastructure. The machine reads from it and never accepts pushes.",
      cols: ["Endpoint", "Method", "Purpose"],
      rows: [
        ["/envelopes", "GET", "List envelopes and versions available to a machine class."],
        ["/envelopes/{id}/versions", "POST", "Publish a new signed envelope version."],
        ["/rollouts", "POST", "Stage a version to a cohort with a rollback condition."],
        ["/evidence/{id}", "GET", "Fetch a signed decision record for replay."],
        ["/replay", "POST", "Re-run a recorded decision against a stated envelope version."],
      ],
    },
    {
      kind: "specs",
      title: "Verdict fields",
      rows: [
        { k: "outcome", v: "allow · clamp · refuse" },
        { k: "trajectory", v: "Present on clamp — the projected, in-envelope command" },
        { k: "reason", v: "Which bound was engaged, and by how much" },
        { k: "envelope_version", v: "The version the decision was judged against" },
        { k: "evidence_id", v: "Address of the record in QuantumClue" },
        { k: "signature", v: "Signed by Claw before the actuation, not after" },
      ],
    },
  ],
};

const sdks: PageDef = {
  path: "/developers/sdks",
  title: "SDKs",
  eyebrow: "Developers",
  heading: "SDKs.",
  lede:
    "Thin bindings over the on-machine interface. They exist to make the integration boring; none of them contain safety logic, because logic in an SDK is logic outside the enforcement boundary.",
  blocks: [
    {
      kind: "table",
      title: "Availability",
      lede: "Pre-release. Access comes with an early-access engagement rather than a public package index.",
      cols: ["Language", "Target", "State"],
      rows: [
        ["C++", "Real-time control paths", "Reference integration"],
        ["Rust", "Real-time control paths", "Reference integration"],
        ["Python", "Research, shadow-mode evaluation, replay tooling", "Reference integration"],
        ["ROS 2", "Node wrapping the on-machine interface", "In design"],
      ],
    },
    {
      kind: "points",
      title: "Deliberate constraints",
      items: [
        "No safety logic in the SDK. It marshals a call and returns a verdict; the decision happens behind the enforcement boundary.",
        "No client-side caching of verdicts, and no way to enable it.",
        "No async fire-and-forget submit. If you did not wait for the verdict, you do not have one.",
        "Timeouts surface as refusals, never as errors an integrator might catch and ignore.",
      ],
    },
  ],
};

const changelog: PageDef = {
  path: "/developers/changelog",
  title: "Changelog",
  eyebrow: "Developers",
  heading: "Changelog.",
  lede:
    "The public changelog begins at general availability. Before then, interface changes go directly to early-access integrators, because a changelog for software nobody outside the programme can install is theatre.",
  blocks: [
    {
      kind: "points",
      title: "What will be recorded here",
      items: [
        "Every change to the on-machine interface, with the migration required.",
        "Every change to envelope schema, with the version at which old definitions stop validating.",
        "Every change to the verdict record format, because it is the thing that has to stay readable for years.",
        "Security advisories, with the affected versions named.",
      ],
    },
    { kind: "note", body: "Envelope schema changes are the ones to watch: a record has to remain replayable long after the schema that produced it has been superseded, so old versions are supported for the lifetime of the evidence, not the lifetime of the release." },
  ],
};

/* ═══ Company ════════════════════════════════════════════════════════ */

const company: PageDef = {
  path: "/company",
  title: "About",
  eyebrow: "Company",
  heading: "Someone has to be the second signature.",
  lede:
    "QuantumFlies exists because physical AI shipped before its assurance model did, and because the party building the autonomy cannot also be the party certifying it and still call that certificate independent.",
  blocks: [
    {
      kind: "prose",
      title: "The position",
      paras: [
        "Robotics safety is being pulled into full-stack physical-AI platforms — one vendor supplying the compute, the models, the simulation and the guardrails. That consolidation is good for capability and bad for assurance, because it removes the last party in the chain with no stake in the answer.",
        "We do not build planners. We have no autonomy stack to protect and no benchmark to win. That absence is the product: it is what lets a verdict we sign mean something to an insurer, a regulator, or a customer's safety team.",
        "The bet is that as machines take on more physical authority, the scarce thing stops being capability and becomes credible evidence of restraint.",
      ],
    },
    {
      kind: "points",
      title: "How we work",
      items: [
        "We publish what we do not do as clearly as what we do. A boundary that is vague is a boundary that grows.",
        "We do not claim certifications we do not hold, and we mark unverified figures as estimates rather than letting them harden into claims.",
        "Envelopes are signed by the operator, not by us. We enforce a customer's safety case; we do not author it on their behalf.",
        "Evidence is exportable by design. A customer who leaves takes their record with them.",
      ],
    },
    { kind: "note", body: CTA_NOTE },
  ],
};

const resources: PageDef = {
  path: "/resources",
  title: "Resources",
  eyebrow: "Company",
  heading: "Resources.",
  lede:
    "Writing on runtime assurance for physical AI — what an envelope is, why independence is structural rather than contractual, and what a safety case has to contain to be worth anything after an incident.",
  blocks: [
    {
      kind: "cards",
      title: "Start here",
      items: [
        { name: "The architecture", body: "Where the decision runs, what is signed by whom, and which properties are structural.", href: "/architecture" },
        { name: "Envelopes", body: "How a safety case becomes something a machine can check at the actuation boundary.", href: "/platform/envelopes" },
        { name: "Integrating", body: "What the integration asks of a control path, and the rules it has to keep.", href: "/developers" },
      ],
    },
    { kind: "note", body: "A written library — technical notes, incident-reconstruction walkthroughs and envelope patterns per domain — is being prepared alongside general availability. Until then the pages above are the substantive material." },
  ],
};

const careers: PageDef = {
  path: "/company/careers",
  title: "Careers",
  eyebrow: "Company",
  heading: "Careers.",
  lede:
    "There are no open roles posted right now. That is a statement of fact rather than a soft close — a careers page listing positions that do not exist wastes the time of exactly the people worth hearing from.",
  blocks: [
    {
      kind: "points",
      title: "What we will be hiring for",
      items: [
        "Real-time systems engineers who have shipped something with a watchdog on it.",
        "Safety engineers who have written a safety case that survived an external audit.",
        "Robotics engineers who have integrated at the actuation boundary and know where the bodies are buried.",
        "Anyone who has run an incident review where the evidence was inadequate and had to say so.",
      ],
    },
    { kind: "note", body: "If that describes you, write to us anyway. Speculative approaches from people who have done this work are read properly." },
  ],
};

const contact: PageDef = {
  path: "/company/contact",
  title: "Contact",
  eyebrow: "Company",
  heading: "Contact.",
  lede: "Tell us what your machines do and what they are capable of doing to someone who is not paying attention. That conversation is more useful than a demo.",
  blocks: [
    {
      kind: "specs",
      title: "Where to write",
      rows: [
        { k: "Early access", v: "hello@quantumflies.com" },
        { k: "Security & disclosure", v: "security@quantumflies.com" },
        { k: "Press", v: "press@quantumflies.com" },
      ],
    },
    { kind: "note", body: "Addresses are placeholders until the domain's mail is configured — replace them in src/pagedata.ts before this page is public." },
  ],
};

const earlyAccess: PageDef = {
  path: "/early-access",
  title: "Get early access",
  eyebrow: "Early access",
  heading: "Get early access.",
  lede:
    "We are working with a small number of fleet operators and robot makers ahead of general availability. Engagements start in shadow mode, where Claw records what it would have decided and changes nothing.",
  blocks: [
    {
      kind: "steps",
      title: "How an engagement runs",
      items: [
        { tag: "Scope", body: "One machine class, one site. We work out what the envelope has to bound before anything is installed." },
        { tag: "Shadow", body: "Claw runs alongside the control path and decides nothing. This is where the envelope meets reality and usually loses the first round." },
        { tag: "Clamp", body: "Soft bounds begin to enforce. Hard refusals still only log." },
        { tag: "Enforce", body: "Full authority, with evidence flowing to Clue from the first actuation." },
      ],
    },
    {
      kind: "points",
      title: "What we will ask you for",
      items: [
        "What the machine is physically capable of doing to a person.",
        "Where the actuation boundary actually is in your control path.",
        "Recorded trajectories, so an envelope can be tested before it is trusted.",
        "Who signs off on safety today, and what they need in order to sign off on this.",
      ],
    },
    { kind: "note", body: "Write to hello@quantumflies.com. There is no form here on purpose: the first exchange is worth more as a description of your machines than as five fields." },
  ],
};

/* ═══ Legal ══════════════════════════════════════════════════════════ */

const LEGAL_STUB =
  "This page is a placeholder. The text below describes the intended position but has not been through legal review, and it must be replaced with reviewed copy before this site is public.";

const privacy: PageDef = {
  path: "/privacy",
  title: "Privacy",
  eyebrow: "Legal",
  heading: "Privacy.",
  lede: LEGAL_STUB,
  blocks: [
    {
      kind: "prose",
      title: "Intended position",
      paras: [
        "Decision records are the operator's data. QuantumFlies processes them to provide the service and does not use them to train models or build cross-customer products.",
        "Evidence can be held in the operator's own infrastructure. Where it is held in ours, it is exportable in full and deletable on request, subject to the retention the operator has themselves configured for their safety case.",
        "Machines generate records about their surroundings, which can include people. Where a record contains personal data, the operator is the controller and QuantumFlies is a processor acting on their instructions.",
      ],
    },
  ],
};

const terms: PageDef = {
  path: "/terms",
  title: "Terms",
  eyebrow: "Legal",
  heading: "Terms.",
  lede: LEGAL_STUB,
  blocks: [
    {
      kind: "prose",
      title: "Intended position",
      paras: [
        "QuantumFlies provides a runtime decision layer. It does not make the operator's machines safe on its own, and it does not transfer responsibility for a machine's behaviour away from whoever operates it.",
        "Envelopes are authored and signed by the operator. QuantumFlies enforces the envelope it is given; it does not warrant that a given envelope is adequate for a given deployment.",
        "During early access the interface is pre-release and will change. Breaking changes are communicated directly rather than only through a changelog.",
      ],
    },
  ],
};

const security: PageDef = {
  path: "/security",
  title: "Security",
  eyebrow: "Legal",
  heading: "Security.",
  lede:
    "The security properties that matter here are the same ones that make the layer independent, so they are described in full on the architecture page rather than summarised loosely on this one.",
  blocks: [
    {
      kind: "points",
      title: "Properties",
      items: [
        "The on-machine runtime opens no inbound ports and accepts no pushed commands.",
        "Envelopes are signed by the operator and verified on the machine before they take effect.",
        "Verdicts are signed by Claw before the actuation they authorise, not written afterwards.",
        "A failed signature check leaves the previously trusted envelope in force rather than falling back to permissive behaviour.",
      ],
    },
    {
      kind: "cards",
      items: [
        { name: "Architecture", body: "Where each component runs and what is reachable from the network.", href: "/architecture" },
        { name: "Responsible disclosure", body: "How to report a vulnerability.", href: "/security/disclosure" },
      ],
    },
    { kind: "note", body: "No certification claims appear on this site. When QuantumFlies holds an audited certification, it will be stated here with the scope and certificate number, and not before." },
  ],
};

const disclosure: PageDef = {
  path: "/security/disclosure",
  title: "Responsible disclosure",
  eyebrow: "Legal",
  heading: "Responsible disclosure.",
  lede:
    "If you have found a vulnerability, we want to hear about it before anyone else does, and we will not threaten you for telling us.",
  blocks: [
    {
      kind: "points",
      title: "How to report",
      items: [
        "Write to security@quantumflies.com with enough detail to reproduce the issue.",
        "Give us a reasonable period to remediate before publishing. We will tell you honestly how long we need and why.",
        "Do not access, modify or exfiltrate data belonging to anyone else while investigating.",
        "Never test against a live machine that can move. Report the theory and we will reproduce it on a bench.",
      ],
    },
    { kind: "note", body: "That last point is not boilerplate. This is a safety layer for machines with physical authority, and a proof-of-concept against a production robot can injure someone who never agreed to be part of your test." },
  ],
};

/* ═══ Registry ═══════════════════════════════════════════════════════ */

export const PAGES: PageDef[] = [
  platform, envelopes, architecture,
  claw, clue,
  solutionsIndex, ...verticalPages,
  developers, api, sdks, changelog,
  company, resources, careers, contact,
  earlyAccess,
  privacy, terms, security, disclosure,
];

export const PAGE_BY_PATH = new Map(PAGES.map((p) => [p.path, p]));
