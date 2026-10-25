# Session — 2026-10-24 — texte-strcmp

- **Branche :** `docs/strcmp-post` dans `blog` (PR blog #13 ouverte) · `docs/session-texte-strcmp` ici (ce rapport, sur la PR #18)
- **Objet :** écrire l'article FR et EN de `strcmp` dans `blog` (`tdd-cpc-strcmp`), depuis les tags `strcmp/*`.

## Fait

- Article FR et EN `tdd-cpc-strcmp`, environ 3 000 mots chacun, date `2026-10-24T23:30:00Z`, tags `[z80, cpc, tdd, sorting]`.
  - Format à bit 7 final, contrat comme `CP`, helpers `bytesOf` / `runStrcmp` / `compare`, Run parti de Z = 1 et C = 1.
  - Étapes `01-red` à `15-guard`. `13-green` montre `or #7f` / `add a,a`, `14-refactor` la version E avec `sub e`.
  - k défini comme les lettres égales sur 7 bits avant la lettre qui décide : "A" et "AB" en ont une.
  - Compte à la main : 14 NOPs par lettre égale, `.differ` 12 ou 14 NOPs. Totaux 14k + 20, 14k + 8, 14k + 4 (avant : 14k + 22, 14k + 14).
  - Section « Deux pistes écartées » : `inc e` / `inc l` (12 NOPs par lettre, pas de franchissement de page), déroulement par 2.
- Sorties relancées dans un worktree jetable à chaque tag : les six rouges et les trois mutants.
  - Mutant `11-guard` (`ld c,a` / `xor c`) : 3 échecs, BC = `#12C2`. La paire "A", "A" passe (pas de `.differ`).
  - Mutant 1 de `15-guard` (`.differ` de `13-green`) : 7 échecs. Mutant 2 (`bit 7,(hl)`) : 8 échecs, dont 3204 contre 2804.
- Revue `mattpocock-skills:code-review` (Standards et Spec). Corrections dans le commit blog `c84cfb1` :
  1. Le guard de BC n'a pas « une paire par chemin » : deux paires sortent par le même `ret nz`. Texte : « une par cas du format ».
  2. Le bit 7 final vaut pour les tables de noms du firmware (RSX), pas pour toutes ses chaînes.
  3. Code de `07-red` introduit par « : », titre « Deux pistes écartées », phrase sur le mutant 1 clarifiée, une virgule.
- `pnpm build` du blog vert, deux pages `tdd-cpc-strcmp`. Push de `docs/strcmp-post` après le contrôle des attributions, PR blog #13.

## Non fait / reste

- Fusion de la PR blog #13, par Ivan.
- Points de revue laissés tels quels : la phrase « S1 est à `#8000`, S2 à `#8100` » reste après le paragraphe sur Z et C.
  Le bug de `13-green` touche aussi "\0\0" contre "\0" (réponse `=`) : l'article ne le dit pas, et reste juste.
- Le README du blog liste encore seulement l'article `find-min` dans son tableau des articles (repris des rapports précédents).
- Article suivant : tri par insertion de pointeurs vers des chaînes, avec `strcmp`. Grilling du design à faire.

## Décisions

- Slug `tdd-cpc-strcmp`, date 23:30Z juste après le radix (23:00Z) : choix de session, signalé à Ivan.

## Gate

- `pnpm typecheck` (sur `docs/session-texte-strcmp`, code de `main`) → vert
- Aucune branche d'article touchée : `strcmp` reste à `strcmp/15-guard`, lue seulement.
- `pnpm build` du blog sur `docs/strcmp-post` → vert
- Vigies : chaque commit de `main..strcmp` porte un tag · tags `strcmp/*` locaux = distants

## État pour reprendre

- **Prochaine action :** faire fusionner la PR blog #13, puis lancer le grilling du tri par insertion de pointeurs vers des chaînes.
- **Arbre :** propre · `blog` : `docs/strcmp-post` poussée, PR #13 ouverte · ce rapport sur `docs/session-texte-strcmp`.
- **Pièges :** les PR de rapport #17, #18 et celle de ce rapport sont empilées. Fusionner dans l'ordre, et passer chaque base à `main`.
