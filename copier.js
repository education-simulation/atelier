// Boutons « Copier » et « Copier et ouvrir Antigravity » (data-ouvrir="antigravity://").
// Le texte copié est celui de l'élément juste avant le bouton.
// data-allow : après la copie, l'animation « 2 · Yes, and always allow in this conversation » s'affiche dessous.
const bande = document.getElementById("bande");
let minuteurBande = null;
let enAttente = null;   // le bouton dont l'animation attend la fin du bandeau
function finBande() {
  if (bande) bande.hidden = true;
  if (enAttente) { montrerAllow(enAttente); enAttente = null; }
}
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
  zone.scrollIntoView({ behavior: "smooth", block: "nearest" });
  zone.querySelectorAll("*").forEach((el) => el.getAnimations().forEach((a) => { a.currentTime = 0; }));
}

document.querySelectorAll("button.copier").forEach((b) => b.addEventListener("click", async () => {
  const c = b.previousElementSibling;
  if (!b.dataset.texte) b.dataset.texte = b.textContent;
  // D'abord ce qu'on voit (bandeau 10 s, animation), puis la copie
  // Puis, quand le bandeau disparaît (10 s, ou fermé à la main), l'animation « Allow write access »
  enAttente = b.hasAttribute("data-allow") ? b : null;
  if (bande) {
    bande.hidden = false;
    clearTimeout(minuteurBande);
    minuteurBande = setTimeout(finBande, 10000);
  } else finBande();
  b.textContent = "✅ Copié";
  setTimeout(() => { b.textContent = b.dataset.texte; }, 2500);
  const copieManuelle = () => { const r = document.createRange(); r.selectNodeContents(c); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand("copy"); getSelection().removeAllRanges(); };
  try { await Promise.race([navigator.clipboard.writeText(c.textContent), new Promise((_, non) => setTimeout(non, 1500))]); }
  catch { copieManuelle(); }

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
if (bande) bande.querySelector(".bande-x").addEventListener("click", () => { clearTimeout(minuteurBande); finBande(); });
