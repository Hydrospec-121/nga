// Birthday Protocol for Wise Ayan. Static client-side code is visible to visitors.
const GIFT_CODE = "CQGYX-C3FRW-FRXTW-WFTYK-J947Z";
const $ = id => document.getElementById(id);
const puzzles = [
  { title: "THE CREEPER TEST", label: "ENCRYPTED CLUE / 001", clue: "I have no face, but I hiss.<br>I have no hands, but I explode.<br>Get too close and your build is gone.<br><b>What am I?</b>", placeholder: "TYPE YOUR ANSWER", hint: "Hint: green, blocky, and extremely explosive.", check: v => clean(v) === "creeper", success: "Correct. You have at least one brain cell online." },
  { title: "THE FRIEND CHECK", label: "FRIEND GROUP DATA / 002", clue: "Who will never learn pattern?<br><b>Enter the name. Capital and small letters do not matter.</b>", placeholder: "WHO IS IT?", hint: "Hint: the answer is one of your friends.", check: v => clean(v) === "rafsan", success: "Rafsan has officially been documented. Friendship database updated." },
  { title: "FINAL BRAIN CELL", label: "FINAL CHECK / 003", clue: "The more you take, the more you leave behind.<br><b>What are they?</b>", placeholder: "ONE LAST ANSWER", hint: "Hint: you make them whenever you walk.", check: v => ["footsteps", "steps"].includes(clean(v)), success: "All puzzles cleared. Initiating birthday loot sequence..." }
];
function clean(v) { return v.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, ""); }
let stage = 0, finished = false;
const form = $("answerForm"), answer = $("answer"), feedback = $("feedback");
// Countdown is intentionally removed. Add a compact stage tracker inside the mission card.
document.querySelectorAll(".countdown-box").forEach(el => el.remove());
const card = document.querySelector(".objective-card");
const stageList = document.createElement("div");
stageList.className = "mission-list";
stageList.innerHTML = '<div class="mission-item current"><span>01</span> THE CREEPER TEST <b>●</b></div><div class="mission-item"><span>02</span> THE FRIEND CHECK <b>●</b></div><div class="mission-item"><span>03</span> FINAL BRAIN CELL <b>●</b></div>';
card.appendChild(stageList);
const heading = card.querySelector("h3");
const description = card.querySelector("p");
const command = document.querySelector(".terminal-line");
const clueLabel = document.querySelector(".clue-label");
const clueText = document.querySelector(".clue-box p");
const inputLabel = form.querySelector("label");
const submit = form.querySelector("button[type=submit]");
function render() {
  const p = puzzles[stage];
  heading.textContent = p.title;
  description.textContent = `Puzzle ${stage + 1} of ${puzzles.length}. Solve it to continue.`;
  command.innerHTML = `<span class="prompt">root@birthday:~$</span> ${["decrypt clue --recipient=wise-ayan", "query friendship_database --mode=truth", "run final_check --difficulty=easy"][stage]}`;
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
  if (label) label.textContent = `PUZZLE 0${stage + 1}/03`;
}
function reveal() {
  finished = true;
  $("lootIcon").textContent = "✦";
  $("lootStatus").textContent = "REWARD VAULT / ACCESS GRANTED";
  $("lootTitle").textContent = "LOOT ACQUIRED.";
  $("lootDescription").textContent = "Happy birthday, Ayan. You survived all three puzzles. Your gift code is ready.";
  $("codeArea").classList.remove("hidden");
  $("redeemCode").textContent = GIFT_CODE;
  $("progressFill").style.width = "100%"; $("progressText").textContent = "100%";
  stageList.querySelectorAll(".mission-item").forEach(item => { item.classList.remove("current"); item.classList.add("complete"); });
  const label = document.querySelector(".terminal-bar span:last-child");
  if (label) label.textContent = "ACCESS GRANTED";
  heading.textContent = "ALL MISSIONS COMPLETE";
  description.textContent = "Every puzzle solved. Birthday loot successfully unlocked.";
  feedback.textContent = "ACCESS GRANTED. The loot is yours, player.";
  feedback.className = "feedback success";
  $("lootPanel").scrollIntoView({ behavior: "smooth", block: "center" });
}
form.addEventListener("submit", event => {
  event.preventDefault(); if (finished) return;
  const p = puzzles[stage];
  if (!p.check(answer.value)) {
    feedback.textContent = stage === 1 ? "ACCESS DENIED. Capital letters do not matter, but the name must be right." : "ACCESS DENIED. Try again, player. Read the clue carefully.";
    feedback.className = "feedback error"; return;
  }
  feedback.textContent = p.success; feedback.className = "feedback success";
  answer.disabled = true; submit.disabled = true; submit.textContent = "CLEARED ✓";
  const percent = Math.round(((stage + 1) / puzzles.length) * 100);
  $("progressFill").style.width = `${percent}%`; $("progressText").textContent = `${percent}%`;
  stageList.querySelectorAll(".mission-item")[stage].classList.add("complete");
  if (stage < puzzles.length - 1) { stage++; setTimeout(render, 1000); } else { setTimeout(reveal, 700); }
});
$("copyButton").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(GIFT_CODE); $("copyFeedback").textContent = "COPIED. GO CLAIM YOUR GIFT."; }
  catch { const range = document.createRange(); range.selectNodeContents($("redeemCode")); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); $("copyFeedback").textContent = "SELECTED. COPY THE CODE MANUALLY."; }
});
function clock() { $("clock").textContent = new Date().toLocaleTimeString([], { hour12: false }); }
clock(); setInterval(clock, 1000); render();
