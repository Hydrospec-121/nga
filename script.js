// Protocol 020 for Wise Ayan. Birthday surprise is concealed until all stages are cleared.
const GIFT_CODE = "CQGYX-C3FRW-FRXTW-WFTYK-J947Z";
const $ = id => document.getElementById(id);

// Desktop-only enforcement: detect mobile devices & small viewports
function checkDeviceCompatibility() {
  const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
  const coarsePointer = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const smallViewport = window.innerWidth <= 768;
  document.body.classList.toggle("is-mobile", Boolean(uaMobile || coarsePointer || smallViewport));
}
checkDeviceCompatibility();
window.addEventListener("resize", checkDeviceCompatibility);

// Full-screen segment navigation controller with slow, sleek transitions
const segments = Array.from(document.querySelectorAll(".screen-segment"));
const slidesTrack = $("slidesTrack");
let currentSegment = 0;
let isTransitioning = false;

function goToSegment(index) {
  const target = Math.max(0, Math.min(segments.length - 1, index));
  if (target === currentSegment && slidesTrack.style.transform) return;
  isTransitioning = true;
  currentSegment = target;
  slidesTrack.style.transform = `translateY(-${currentSegment * 100}vh)`;
  segments.forEach((seg, i) => seg.classList.toggle("active", i === currentSegment));
  setTimeout(() => { isTransitioning = false; }, 1050);
}

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (segments[0]) segments[0].classList.add("active");
  });
});

window.addEventListener("wheel", event => {
  if (document.body.classList.contains("is-mobile")) return;
  event.preventDefault();
  if (isTransitioning || Math.abs(event.deltaY) < 16) return;
  if (event.deltaY > 0 && currentSegment < segments.length - 1) {
    goToSegment(currentSegment + 1);
  } else if (event.deltaY < 0 && currentSegment > 0) {
    goToSegment(currentSegment - 1);
  }
}, { passive: false });

window.addEventListener("keydown", event => {
  if (document.body.classList.contains("is-mobile") || isTransitioning) return;
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    if (currentSegment < segments.length - 1) goToSegment(currentSegment + 1);
  } else if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    if (currentSegment > 0) goToSegment(currentSegment - 1);
  }
});

document.querySelectorAll("[data-goto]").forEach(trigger => {
  trigger.addEventListener("click", event => {
    event.preventDefault();
    const target = Number(trigger.getAttribute("data-goto"));
    if (!Number.isNaN(target)) goToSegment(target);
  });
});

// ============================================================================
// Web Audio API Sound Engine: Loud Blast, Kazoo Fanfare & Happy Birthday Music
// ============================================================================
let audioCtx = null;
let musicMasterGain = null;
let musicMuted = false;
let musicLoopTimer = null;

function ensureAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function makeDistortionCurve(amount = 60) {
  const n = 44100;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function playCreeperHitSound(hitNum) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Impact thump + short fuse hiss
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(160 + hitNum * 45, now);
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.16);
  gain.gain.setValueAtTime(0.45, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);

  // Hiss noise
  const bufSize = Math.floor(ctx.sampleRate * 0.14);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2600 + hitNum * 300;
  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(0.22, now);
  nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  noise.connect(filter).connect(nGain).connect(ctx.destination);
  noise.start(now);
}

function playExtremeBlastAndKazoo() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Overdriven master bus for maximum loud blast impact
  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(120);
  shaper.oversample = "4x";
  const masterBlast = ctx.createGain();
  masterBlast.gain.setValueAtTime(1.0, now);
  shaper.connect(masterBlast).connect(ctx.destination);

  // 1. Massive Sub-Bass Detonation Drop
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = "sawtooth";
  subOsc.frequency.setValueAtTime(190, now);
  subOsc.frequency.exponentialRampToValueAtTime(22, now + 1.15);
  subGain.gain.setValueAtTime(1.4, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  subOsc.connect(subGain).connect(shaper);
  subOsc.start(now);
  subOsc.stop(now + 1.25);

  // 2. Shockwave Punch Transient
  const punchOsc = ctx.createOscillator();
  const punchGain = ctx.createGain();
  punchOsc.type = "square";
  punchOsc.frequency.setValueAtTime(420, now);
  punchOsc.frequency.exponentialRampToValueAtTime(28, now + 0.25);
  punchGain.gain.setValueAtTime(1.3, now);
  punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
  punchOsc.connect(punchGain).connect(shaper);
  punchOsc.start(now);
  punchOsc.stop(now + 0.28);

  // 3. Full-Spectrum White/Pink Explosion Roar
  const dur = 1.65;
  const bufSize = Math.floor(ctx.sampleRate * dur);
  const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const output = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    const env = Math.pow(1 - i / bufSize, 1.35);
    output[i] = (Math.random() * 2 - 1) * env;
  }
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuf;

  const boomFilter = ctx.createBiquadFilter();
  boomFilter.type = "lowpass";
  boomFilter.frequency.setValueAtTime(5200, now);
  boomFilter.frequency.exponentialRampToValueAtTime(140, now + dur);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(1.6, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + dur);

  whiteNoise.connect(boomFilter).connect(noiseGain).connect(shaper);
  whiteNoise.start(now);

  // 4. Hilarious Buzzing Party Kazoo Fanfare right after the blast peak!
  function playKazooNote(startTime, freq, endFreq, duration) {
    const t0 = now + startTime;
    const carrier = ctx.createOscillator();
    const buzzMod = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const vibrato = ctx.createOscillator();
    const vibGain = ctx.createGain();

    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(freq, t0);
    if (endFreq && endFreq !== freq) {
      carrier.frequency.linearRampToValueAtTime(endFreq, t0 + duration * 0.65);
    }

    // Kazoo membrane buzz modulation
    buzzMod.type = "square";
    buzzMod.frequency.setValueAtTime(freq * 2, t0);
    buzzGain.gain.setValueAtTime(140, t0);
    buzzMod.connect(buzzGain).connect(carrier.frequency);

    // Party horn wobble
    vibrato.frequency.value = 9.5;
    vibGain.gain.value = 11;
    vibrato.connect(vibGain).connect(carrier.frequency);

    // Nasal kazoo formant filters
    const formant1 = ctx.createBiquadFilter();
    formant1.type = "bandpass";
    formant1.frequency.value = 780;
    formant1.Q.value = 3.2;

    const formant2 = ctx.createBiquadFilter();
    formant2.type = "peaking";
    formant2.frequency.value = 1850;
    formant2.gain.value = 14;
    formant2.Q.value = 2.5;

    const kShaper = ctx.createWaveShaper();
    kShaper.curve = makeDistortionCurve(45);

    const kGain = ctx.createGain();
    kGain.gain.setValueAtTime(0.001, t0);
    kGain.gain.linearRampToValueAtTime(0.65, t0 + 0.03);
    kGain.gain.setValueAtTime(0.65, t0 + duration - 0.05);
    kGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    carrier.connect(formant1).connect(formant2).connect(kShaper).connect(kGain).connect(ctx.destination);
    carrier.start(t0);
    buzzMod.start(t0);
    vibrato.start(t0);
    carrier.stop(t0 + duration + 0.02);
    buzzMod.stop(t0 + duration + 0.02);
    vibrato.stop(t0 + duration + 0.02);
  }

  // Party Kazoo Fanfare: "Ta-da-da-DAAAA! Phweeeet!"
  playKazooNote(0.28, 392.00, 392.00, 0.14); // G4
  playKazooNote(0.44, 523.25, 523.25, 0.14); // C5
  playKazooNote(0.60, 659.25, 659.25, 0.14); // E5
  playKazooNote(0.76, 783.99, 880.00, 0.42); // G5 -> A5 party slide
  playKazooNote(1.22, 659.25, 659.25, 0.15); // E5
  playKazooNote(1.40, 783.99, 1046.50, 0.65); // G5 -> C6 big kazoo blast!
}

function playVaultPartSound(stepIndex) {
  const ctx = ensureAudio();
  if (!ctx || musicMuted) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  const baseFreq = 320 + stepIndex * 70;
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.12);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

function startHappyBirthdayMusic() {
  const ctx = ensureAudio();
  if (!ctx) return;
  if (!musicMasterGain) {
    musicMasterGain = ctx.createGain();
    musicMasterGain.gain.value = 0.34;
    musicMasterGain.connect(ctx.destination);
  }

  // "Happy Birthday to You" melody + bass notes (beats at 135 BPM)
  const beat = 60 / 135;
  const melody = [
    // Happy birthday to you
    { f: 392.00, b: 196.00, d: 0.75 }, { f: 392.00, b: 0, d: 0.25 },
    { f: 440.00, b: 261.63, d: 1.0 },  { f: 392.00, b: 196.00, d: 1.0 },
    { f: 523.25, b: 261.63, d: 1.0 },  { f: 493.88, b: 246.94, d: 2.0 },
    // Happy birthday to you
    { f: 392.00, b: 196.00, d: 0.75 }, { f: 392.00, b: 0, d: 0.25 },
    { f: 440.00, b: 246.94, d: 1.0 },  { f: 392.00, b: 196.00, d: 1.0 },
    { f: 587.33, b: 293.66, d: 1.0 },  { f: 523.25, b: 261.63, d: 2.0 },
    // Happy birthday dear Ayan
    { f: 392.00, b: 196.00, d: 0.75 }, { f: 392.00, b: 0, d: 0.25 },
    { f: 783.99, b: 261.63, d: 1.0 },  { f: 659.25, b: 329.63, d: 1.0 },
    { f: 523.25, b: 261.63, d: 1.0 },  { f: 493.88, b: 246.94, d: 1.0 },
    { f: 440.00, b: 220.00, d: 1.5 },
    // Happy birthday to you!
    { f: 698.46, b: 349.23, d: 0.75 }, { f: 698.46, b: 0, d: 0.25 },
    { f: 659.25, b: 261.63, d: 1.0 },  { f: 523.25, b: 329.63, d: 1.0 },
    { f: 587.33, b: 293.66, d: 1.0 },  { f: 523.25, b: 261.63, d: 2.5 }
  ];

  function scheduleLoop() {
    if (!audioCtx) return;
    let cursor = audioCtx.currentTime + 0.08;
    for (const note of melody) {
      const dur = note.d * beat;
      // Lead synth (bright festive square/triangle blend)
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(note.f, cursor);
      g.gain.setValueAtTime(0.001, cursor);
      g.gain.linearRampToValueAtTime(0.28, cursor + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, cursor + dur * 0.92);
      osc.connect(g).connect(musicMasterGain);
      osc.start(cursor);
      osc.stop(cursor + dur);

      // Warm bass accompaniment
      if (note.b > 0) {
        const bOsc = audioCtx.createOscillator();
        const bGain = audioCtx.createGain();
        bOsc.type = "triangle";
        bOsc.frequency.setValueAtTime(note.b, cursor);
        bGain.gain.setValueAtTime(0.32, cursor);
        bGain.gain.exponentialRampToValueAtTime(0.001, cursor + dur * 0.95);
        bOsc.connect(bGain).connect(musicMasterGain);
        bOsc.start(cursor);
        bOsc.stop(cursor + dur);
      }
      cursor += dur;
    }
    const totalMs = (cursor - audioCtx.currentTime) * 1000;
    musicLoopTimer = setTimeout(scheduleLoop, totalMs);
  }
  scheduleLoop();
}

const musicToggleBtn = $("musicToggleButton");
if (musicToggleBtn) {
  musicToggleBtn.addEventListener("click", () => {
    musicMuted = !musicMuted;
    if (musicMasterGain && audioCtx) {
      musicMasterGain.gain.setValueAtTime(musicMuted ? 0 : 0.34, audioCtx.currentTime);
    }
    musicToggleBtn.textContent = musicMuted ? "🔇 MUSIC: MUTED" : "🔊 MUSIC: ON";
  });
}

// ============================================================================
// Puzzles & Creeper Mini-Game (No Birthday Spoilers Until Cleared)
// ============================================================================
const puzzles = [
  { title: "THE CREEPER TEST", label: "ENCRYPTED CLUE / 001", clue: "I have no face, but I hiss.<br>I have no hands, but I explode.<br>Get too close and your build is gone.<br><b>What am I?</b>", placeholder: "TYPE YOUR ANSWER", hint: "Hint: green, blocky, and extremely explosive.", check: v => clean(v) === "creeper", success: "Correct. Primary encryption layer bypassed." },
  { title: "THE FRIEND CHECK", label: "IDENTITY VERIFICATION / 002", clue: "Who will never learn pattern?<br><b>Enter the name. Capital and small letters do not matter.</b>", placeholder: "WHO IS IT?", hint: "Hint: the answer is one of your friends.", check: v => clean(v) === "rafsan", success: "Rafsan verified. Secondary security lock disengaged." },
  { title: "FINAL BRAIN CELL", label: "FINAL CHECK / 003", clue: "The more you take, the more you leave behind.<br><b>What are they?</b>", placeholder: "ONE LAST ANSWER", hint: "Hint: you make them whenever you walk.", check: v => ["footsteps", "steps"].includes(clean(v)), success: "All passkeys verified. Initializing final defense override..." }
];
function clean(v) { return v.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, ""); }
let stage = 0, finished = false, hits = 0, moveTimer = null;
const TOTAL_HITS = 5;
const form = $("answerForm"), answer = $("answer"), feedback = $("feedback");
document.querySelectorAll(".countdown-box").forEach(el => el.remove());
const card = document.querySelector(".objective-card");
const bigNumber = card.querySelector(".big-number");
const stageList = document.createElement("div");
stageList.className = "mission-list";
stageList.innerHTML = '<div class="mission-item current"><span>01</span> THE CREEPER TEST <b>●</b></div><div class="mission-item"><span>02</span> THE FRIEND CHECK <b>●</b></div><div class="mission-item"><span>03</span> FINAL BRAIN CELL <b>●</b></div><div class="mission-item"><span>04</span> CORE OVERRIDE <b>●</b></div>';
card.appendChild(stageList);
const heading = card.querySelector("h3");
const description = card.querySelector("p");
const command = document.querySelector(".terminal-line");
const clueBox = document.querySelector(".clue-box");
const clueLabel = document.querySelector(".clue-label");
const clueText = document.querySelector(".clue-box p");
const inputLabel = form.querySelector("label");
const submit = form.querySelector("button[type=submit]");

function animateStageSwap(el) {
  if (!el) return;
  el.classList.remove("stage-fade");
  void el.offsetWidth;
  el.classList.add("stage-fade");
}

function render() {
  const p = puzzles[stage];
  if (bigNumber) bigNumber.innerHTML = `0${stage + 1}<span>/04</span>`;
  heading.textContent = p.title;
  description.textContent = `Stage ${stage + 1} of 4. Solve the clue to continue.`;
  command.innerHTML = `<span class="prompt">root@hydrospec:~$</span> ${["decrypt clue --subject=wise-ayan", "query operator_database --mode=truth", "run final_check --clearance=level-09"][stage]}`;
  clueLabel.textContent = p.label;
  clueText.innerHTML = p.clue;
  answer.placeholder = p.placeholder;
  inputLabel.textContent = stage === 1 ? "ENTER THE NAME" : "ENTER YOUR ANSWER";
  feedback.textContent = p.hint;
  feedback.className = "feedback";
  answer.value = ""; answer.disabled = false; submit.disabled = false; submit.textContent = "SUBMIT ↗";
  stageList.querySelectorAll(".mission-item").forEach((item, i) => {
    item.classList.toggle("current", i === stage);
    item.classList.toggle("complete", i < stage);
  });
  const label = document.querySelector(".terminal-bar span:last-child");
  if (label) label.textContent = `STAGE 0${stage + 1}/04`;
  if (stage > 0) {
    animateStageSwap(clueBox);
    animateStageSwap(form);
  }
}

function moveCreeper() {
  const target = $("creeperTarget");
  if (!target) return;
  const x = 16 + Math.random() * 68;
  const y = 22 + Math.random() * 56;
  target.style.left = `${x}%`;
  target.style.top = `${y}%`;
}

function startMinigame() {
  if (bigNumber) bigNumber.innerHTML = `04<span>/04</span>`;
  heading.textContent = "CORE OVERRIDE";
  description.textContent = "Stage 4 of 4. Neutralize the rogue Creeper to unseal the chamber!";
  command.innerHTML = `<span class="prompt">root@hydrospec:~$</span> ./core_override.sh --purge-entity`;
  clueLabel.textContent = "FINAL SECURITY LAYER // MINI-GAME";
  clueText.innerHTML = "A rogue Creeper has breached the security core!<br><b>Click the moving Creeper 5 times to purge the lock and declassify the vault.</b>";
  form.classList.add("hidden");
  const area = $("minigameArea");
  area.classList.remove("hidden");
  animateStageSwap(clueBox);
  animateStageSwap(area);
  stageList.querySelectorAll(".mission-item").forEach((item, i) => {
    item.classList.toggle("current", i === 3);
    item.classList.toggle("complete", i < 3);
  });
  const label = document.querySelector(".terminal-bar span:last-child");
  if (label) label.textContent = "OVERRIDE 04/04";
  moveCreeper();
  moveTimer = setInterval(moveCreeper, 900);
}

function launchBoomParticles(originX, originY, fullBoom) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const colors = ["#d7ff3f", "#f5f5f0", "#a6cc00", "#ffd451", "#ff655b"];
  const count = fullBoom ? 180 : 22;
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = fullBoom ? (5 + Math.random() * 18) : (2 + Math.random() * 7);
    const burstX = fullBoom && i > 100 ? Math.random() * window.innerWidth : originX;
    const burstY = fullBoom && i > 100 ? Math.random() * window.innerHeight * 0.75 : originY;
    particles.push({
      x: burstX,
      y: burstY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (fullBoom ? Math.random() * 4.5 : 1),
      size: fullBoom ? (6 + Math.random() * 10) : (4 + Math.random() * 5),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: fullBoom ? (0.009 + Math.random() * 0.011) : (0.04 + Math.random() * 0.03),
      rot: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.25
    });
  }
  let ringRadius = 10, ringAlpha = fullBoom ? 1 : 0;
  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (ringAlpha > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(originX, originY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(215, 255, 63, ${ringAlpha})`;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();
      ringRadius += 28;
      ringAlpha -= 0.04;
    }
    let alive = false;
    for (const p of particles) {
      if (p.alpha <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.vx *= 0.985;
      p.rot += p.vRot;
      p.alpha -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
    if (alive || ringAlpha > 0) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

function decryptCodeAnimation(targetEl, finalCode) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let step = 0;
  const maxSteps = 22;
  const timer = setInterval(() => {
    step++;
    if (step >= maxSteps) {
      targetEl.textContent = finalCode;
      clearInterval(timer);
      return;
    }
    const revealedCount = Math.floor((step / maxSteps) * finalCode.length);
    let out = "";
    for (let i = 0; i < finalCode.length; i++) {
      if (finalCode[i] === "-") out += "-";
      else if (i < revealedCount) out += finalCode[i];
      else out += chars[Math.floor(Math.random() * chars.length)];
    }
    targetEl.textContent = out;
  }, 45);
}

function buildVaultPartByPart() {
  // Hide prelock placeholder and show the vault builder blueprint
  const prelock = $("vaultPrelock");
  if (prelock) prelock.classList.add("hidden");

  const lootPanel = $("lootPanel");
  lootPanel.classList.remove("hidden");

  $("vaultSectionIndex").textContent = "02 / SURPRISE REWARD";
  $("vaultSectionHeading").innerHTML = 'THE BIRTHDAY VAULT<span class="lime">.</span>';
  $("vaultSectionSub").textContent = "Surprise protocol active! Constructing your birthday vault part by part...";

  const buildStatus = $("vaultBuildStatus");
  const steps = [
    {
      delay: 400,
      status: "ASSEMBLING VAULT // 15% — STRUCTURAL FRAME LOCKED",
      action: () => lootPanel.classList.add("frame-built")
    },
    {
      delay: 1050,
      status: "ASSEMBLING VAULT // 32% — SECURITY CORE MATERIALIZED",
      action: () => $("vaultPartIcon").classList.add("built")
    },
    {
      delay: 1650,
      status: "ASSEMBLING VAULT // 48% — BIRTHDAY EDITION STAMPED",
      action: () => $("vaultPartStamp").classList.add("built")
    },
    {
      delay: 2250,
      status: "ASSEMBLING VAULT // 65% — GREETING MODULE ONLINE",
      action: () => {
        $("lootStatus").classList.add("built");
        $("lootTitle").classList.add("built");
        $("lootDescription").classList.add("built");
      }
    },
    {
      delay: 2900,
      status: "ASSEMBLING VAULT // 80% — HYDROSPEC BANNER ENGAGED",
      action: () => $("vaultPartBanner").classList.add("built")
    },
    {
      delay: 3550,
      status: "ASSEMBLING VAULT // 94% — DECRYPTING REDEEM KEY",
      action: () => {
        $("vaultPartCode").classList.add("built");
        decryptCodeAnimation($("redeemCode"), GIFT_CODE);
      }
    },
    {
      delay: 4300,
      status: "VAULT ASSEMBLY COMPLETE // 100% — HAPPY BIRTHDAY AYAN!",
      action: () => {
        $("vaultPartActions").classList.add("built");
        // Also declassify Segment 04 (Final Communique)
        $("outroHeading").innerHTML = 'FINAL COMMUNIQUE<span class="lime">.</span>';
        $("outroSub").textContent = "Birthday broadcast logged for Wise Ayan.";
        $("outroIcon").textContent = "!";
        $("outroLabel").textContent = "A MESSAGE FROM YOUR FRIEND // ENAN AKA HYDROSPEC";
        $("outroTitle").textContent = "HAPPY BIRTHDAY, AYAN.";
        $("outroMessage").textContent = "May your worlds be big, your builds survive creepers, and your next year be legendary. Enjoy the gift, bro.";
        $("outroHeart").classList.remove("hidden");
        const btn = $("outroPrimaryBtn");
        if (btn) {
          btn.setAttribute("data-goto", "0");
          btn.innerHTML = "BACK TO TOP <span>↑</span>";
        }
        $("footerLeft").innerHTML = "DESIGNED WITH <b>CHAOS</b> BY ENAN AKA HYDROSPEC";
        $("footerRight").innerHTML = "HYDROSPEC // BIRTHDAY PROTOCOL <b>v2.0 FULLSCREEN</b>";
      }
    }
  ];

  steps.forEach((step, idx) => {
    setTimeout(() => {
      if (buildStatus) buildStatus.textContent = step.status;
      playVaultPartSound(idx);
      step.action();
    }, step.delay);
  });
}

function triggerBigSurpriseBoom() {
  document.title = "HAPPY BIRTHDAY AYAN // HYDROSPEC";

  // 1. Trigger heavy screen shake + loud blast & kazoo fanfare
  document.body.classList.add("blast-shake");
  setTimeout(() => document.body.classList.remove("blast-shake"), 750);
  playExtremeBlastAndKazoo();

  // 2. Start Happy Birthday music in the background right after the kazoo fanfare
  setTimeout(startHappyBirthdayMusic, 1950);

  // 3. Full-screen particle explosion + flashing surprise banner
  launchBoomParticles(window.innerWidth / 2, window.innerHeight / 2, true);
  const overlay = document.createElement("div");
  overlay.className = "boom-overlay";
  overlay.innerHTML = '<div class="boom-banner"><h2>SURPRISE! HAPPY BIRTHDAY AYAN</h2><p>WISHED BY <span>ENAN</span> AKA <span>HYDROSPEC</span></p></div>';
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.style.transition = "opacity .6s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 600);
  }, 2600);

  // 4. Update mission card & transition to Segment 03 to build the vault part by part
  finished = true;
  $("progressFill").style.width = "100%";
  $("progressText").textContent = "100%";
  stageList.querySelectorAll(".mission-item").forEach(item => {
    item.classList.remove("current");
    item.classList.add("complete");
  });
  const label = document.querySelector(".terminal-bar span:last-child");
  if (label) label.textContent = "SURPRISE UNLOCKED";
  heading.textContent = "SURPRISE UNLOCKED!";
  description.textContent = "Happy Birthday, Ayan! Constructing your birthday vault now...";

  setTimeout(() => {
    goToSegment(2);
    buildVaultPartByPart();
  }, 1500);
}

$("creeperTarget").addEventListener("click", event => {
  if (finished) return;
  hits++;
  $("hitCounter").textContent = `${hits} / ${TOTAL_HITS}`;
  const rect = event.currentTarget.getBoundingClientRect();
  launchBoomParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, false);
  const percent = 75 + Math.round((hits / TOTAL_HITS) * 25);
  $("progressFill").style.width = `${percent}%`;
  $("progressText").textContent = `${percent}%`;
  const msg = $("minigameFeedback");
  if (hits < TOTAL_HITS) {
    playCreeperHitSound(hits);
    msg.textContent = ["DIRECT HIT! KEEP STRIKING!", "ENTITY IS HISSING... SSSSSS!", "CRITICAL DAMAGE! 2 HITS LEFT!", "CORE OVERLOADING! 1 FINAL HIT!"][hits - 1];
    msg.className = "feedback success";
    moveCreeper();
  } else {
    clearInterval(moveTimer);
    event.currentTarget.classList.add("hidden");
    msg.textContent = "SURPRISE! HAPPY BIRTHDAY AYAN — WISHED BY ENAN AKA HYDROSPEC!";
    msg.className = "feedback success";
    triggerBigSurpriseBoom();
  }
});

form.addEventListener("submit", event => {
  event.preventDefault(); if (finished) return;
  ensureAudio();
  const p = puzzles[stage];
  if (!p.check(answer.value)) {
    feedback.textContent = stage === 1 ? "ACCESS DENIED. Capital letters do not matter, but the name must be right." : "ACCESS DENIED. Try again, operator. Read the clue carefully.";
    feedback.className = "feedback error"; return;
  }
  feedback.textContent = p.success; feedback.className = "feedback success";
  answer.disabled = true; submit.disabled = true; submit.textContent = "CLEARED ✓";
  const percent = Math.round(((stage + 1) / 4) * 100);
  $("progressFill").style.width = `${percent}%`; $("progressText").textContent = `${percent}%`;
  stageList.querySelectorAll(".mission-item")[stage].classList.add("complete");
  if (stage < puzzles.length - 1) { stage++; setTimeout(render, 1000); } else { setTimeout(startMinigame, 950); }
});

$("copyButton").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(GIFT_CODE); $("copyFeedback").textContent = "COPIED. GO CLAIM YOUR GIFT."; }
  catch { const range = document.createRange(); range.selectNodeContents($("redeemCode")); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); $("copyFeedback").textContent = "SELECTED. COPY THE CODE MANUALLY."; }
});

function clock() {
  const el = $("clock");
  if (el) el.textContent = new Date().toLocaleTimeString([], { hour12: false });
}
clock(); setInterval(clock, 1000); render();
