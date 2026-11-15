// Boutons « Copier » et « Copier et ouvrir Antigravity » (data-ouvrir="antigravity://").
// Le texte copié est celui de l'élément juste avant le bouton.
// data-allow : après la copie, l'animation « 2 · Yes, and always allow in this conversation » s'affiche dessous.
const bande = document.getElementById("bande");
let minuteurBande = null;
const tpl = document.getElementById("tpl-allow");

// L'animation garde sa taille (720 × 330) et se réduit sur les petits écrans
function ajuster(cadre) {
  const scene = cadre.querySelector(".scene-allow");
  const k = Math.min(1, cadre.clientWidth / 722);
  scene.style.transform = `scale(${k})`;
  cadre.style.height = 332 * k + "px";
}

function montrerAllow(b) {
  const zone = b.closest(".phrase").nextElementSibling;
  if (!tpl || !zone || !zone.classList.contains("allow-zone")) return;
  if (!zone.firstElementChild) {
    zone.appendChild(tpl.content.cloneNode(true));
    const cadre = zone.querySelector(".cadre-allow");
    new ResizeObserver(() => ajuster(cadre)).observe(cadre);
  }
  zone.hidden = false;
  ajuster(zone.querySelector(".cadre-allow"));
  zone.querySelectorAll("*").forEach((el) => el.getAnimations().forEach((a) => { a.currentTime = 0; }));
}

document.querySelectorAll("button.copier").forEach((b) => b.addEventListener("click", async () => {
  const c = b.previousElementSibling, texte = b.textContent;
  try { await navigator.clipboard.writeText(c.textContent); }
  catch { const r = document.createRange(); r.selectNodeContents(c); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand("copy"); }
  b.textContent = "✅ Copié";
  setTimeout(() => { b.textContent = texte; }, 2500);

  // Le bandeau jaune « Colle le message dans Antigravity » : 10 secondes
  if (bande) {
    bande.hidden = false;
    clearTimeout(minuteurBande);
    minuteurBande = setTimeout(() => { bande.hidden = true; }, 10000);
  }
  if (b.hasAttribute("data-allow")) montrerAllow(b);

  if (!b.dataset.ouvrir) return;
  const retour = b.closest(".phrase").nextElementSibling;
  let ouvert = false;
  const parti = () => { ouvert = true; };
  window.addEventListener("blur", parti, { once: true });
  setTimeout(() => { location.href = b.dataset.ouvrir; }, 300);
  setTimeout(() => {
    window.removeEventListener("blur", parti);
    if (!ouvert && document.hasFocus() && retour && retour.classList.contains("retour-ouvrir")) {
      retour.hidden = false;
      retour.innerHTML = "⚠️ Antigravity ne s'est pas ouvert ? Ouvre-le toi-même : le message est déjà copié.";
    }
  }, 2500);
}));
if (bande) bande.querySelector(".bande-x").addEventListener("click", () => { bande.hidden = true; clearTimeout(minuteurBande); });
