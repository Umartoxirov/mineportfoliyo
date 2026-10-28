"use strict";
document.documentElement.classList.add("js");

/* ===== SOZLAMALAR: shu yerdan o‘zgartiring ===== */
const EMAIL = ""; // Masalan: "umar@example.com". Bo‘sh bo‘lsa, "qo‘shilmagan" deb ko‘rsatiladi.
const LOYIHALAR = [
  { nom: "Phone Store", tavsif: "Telefonlar sotuvchi mobilga moslashgan onlayn do‘kon sahifasi.", texno: ["HTML", "CSS", "JavaScript"], havola: "https://6ae226686c5353b6ac4939e3--phonesstored.netlify.app/" },
  { nom: "Shaxsiy blog", tavsif: "Maqolalar va yozuvlar uchun sodda, tez va qulay blog dizayni.", texno: ["HTML", "CSS"], havola: "" },
  { nom: "Vazifalar ro‘yxati", tavsif: "Vazifa qo‘shish, belgilash va o‘chirish imkonini beruvchi kichik ilova.", texno: ["HTML", "CSS", "JavaScript"], havola: "" }
]; // havola: "https://sizning-saytingiz.uz" — to‘ldirsangiz tugma shu manzilni yangi tabda ochadi.
/* ================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inPreview = window.self !== window.top;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.id);
  toast.id = setTimeout(() => t.classList.remove("show"), 2600);
}

/* Loyiha kartochkalari */
$("#projects").innerHTML = LOYIHALAR.map((p, i) => `
  <article class="card proj reveal">
    <div class="shot"><div class="tb"><i></i><i></i><i></i></div>
      <div class="pv v${i % 3}"><u class="a"></u><u></u><u></u><u></u><u></u><u></u></div></div>
    <div class="pbody">
      <h3>${p.nom}</h3><p>${p.tavsif}</p>
      <div class="tech">${p.texno.map(t => `<span>${t}</span>`).join("")}</div>
      <a class="btn ghost" href="${p.havola || "#loyihalar"}" ${p.havola ? 'target="_blank" rel="noopener noreferrer"' : 'data-yoq="1"'}>Saytni ko‘rish</a>
    </div>
  </article>`).join("");

document.addEventListener("click", e => {
  const a = e.target.closest("[data-yoq]");
  if (a) { e.preventDefault(); toast("Bu loyiha havolasi hali qo‘shilmagan."); }
});

/* Email */
const eb = $("#emailBox");
if (EMAIL) { const a = document.createElement("a"); a.href = "mailto:" + EMAIL; a.textContent = EMAIL; eb.appendChild(a); }
else eb.textContent = "hali qo‘shilmagan";

/* Telegram username nusxalash */
$("#copyBtn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText("@umarweb_uz"); toast("Nusxalandi: @umarweb_uz"); }
  catch { toast("Nusxalab bo‘lmadi. Username: @umarweb_uz"); }
});

/* Mavzu */
const root = document.documentElement;
try { const s = localStorage.getItem("mavzu"); if (s) root.dataset.theme = s; } catch { }
$("#themeBtn").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("mavzu", root.dataset.theme); } catch { }
});

/* Mobil menyu */
const burger = $("#burger"), nav = $("#nav");
const setMenu = o => { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("#nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* Scroll animatsiyalari */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(el); });

/* Faol navigatsiya */
const links = $$("#nav a");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.dataset.s === e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => spy.observe(s));

/* Tepaga qaytish */
const toTopBtn = $("#toTop");
addEventListener("scroll", () => toTopBtn.classList.toggle("show", scrollY > 500), { passive: true });
toTopBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* Responsive test (iframe haqiqiy kenglikda ochiladi) */
const SIZES = [["Telefon", 320], ["Telefon", 375], ["Telefon", 425], ["Planshet", 768], ["Noutbuk", 1024], ["Kompyuter", 1440]];
if (inPreview) {
  $("#testBtn").remove(); $("#rt").remove();
} else {
  const rt = $("#rt"), frame = $("#rtFrame"), stage = $("#rtStage"), info = $("#rtInfo"), box = $("#rtSizes");
  box.innerHTML = SIZES.map(([n, w]) => `<button class="btn-sm" type="button" data-w="${w}">${n}: ${w}px</button>`).join("");
  let cur = 375;
  const fit = () => {
    const h = stage.clientHeight - 32, avail = stage.clientWidth - 32;
    const k = Math.min(1, avail / cur);
    frame.style.width = cur + "px";
    frame.style.height = h / k + "px";
    frame.style.transform = `scale(${k})`;
    frame.style.marginBottom = -(h / k * (1 - k)) + "px";
    frame.style.marginRight = -(cur * (1 - k)) + "px";
    info.textContent = `Kenglik: ${cur}px` + (k < 1 ? ` (ekranga sig‘ishi uchun ${Math.round(k * 100)}% ko‘rsatilmoqda)` : "");
  };
  const pick = w => { cur = w; $$("button", box).forEach(b => b.classList.toggle("on", +b.dataset.w === w)); fit(); };
  box.addEventListener("click", e => { const b = e.target.closest("[data-w]"); if (b) pick(+b.dataset.w); });
  $("#testBtn").addEventListener("click", () => {
    rt.hidden = false; document.body.style.overflow = "hidden";
    if (!frame.src) frame.src = location.href.split("#")[0];
    pick(cur);
  });
  const close = () => { rt.hidden = true; document.body.style.overflow = ""; };
  $("#rtClose").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !rt.hidden) close(); });
  addEventListener("resize", () => { if (!rt.hidden) fit(); });
}
