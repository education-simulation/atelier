// Boutons « Copier » et « Copier et ouvrir Antigravity » (data-ouvrir="antigravity://").
// Le texte copié est celui de l'élément juste avant le bouton.
document.querySelectorAll("button.copier").forEach((b) => b.addEventListener("click", async () => {
  const c = b.previousElementSibling, texte = b.textContent;
  try { await navigator.clipboard.writeText(c.textContent); }
  catch { const r = document.createRange(); r.selectNodeContents(c); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand("copy"); }
  b.textContent = "✅ Copié";
  setTimeout(() => { b.textContent = texte; }, 2500);
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
