# Session — 2026-10-25 — texte-strsort

- **Branche :** `docs/string-sort-post` dans `blog` (locale, commit `a97a3bd`, non poussée) · `docs/session-texte-strsort` ici (ce rapport, issue de `docs/session-strsort-tags-push`)
- **Objet :** écrire l'article FR et EN du tri de pointeurs vers des chaînes (`tdd-cpc-string-sort`), depuis les tags `strsort/*`.

## Fait

- Reprise : le STATUS de `main` datait du radix. Le dernier STATUS est sur `docs/session-strsort-tags-push` (PR #17 à #23 empilées, ouvertes).
- Article FR et EN `tdd-cpc-string-sort`, date `2026-10-25T12:00:00Z`, tags `[z80, cpc, tdd, sorting]`, environ 3 100 mots de prose chacun
  (2 100 pour `strcmp` et l'insertion). Blocs de code copiés du FR vers l'EN par script : les 30 blocs sont identiques.
  - Sections : contrat et stabilité, étapes `01-red` à `13-guard`, tableau des 8 variantes, `14-guard`, compte à la main, budgets `15` à `17`, `18-refactor`.
  - Le bloc de code de `18-refactor` est retiré : la prose le décrit.
- Sorties relancées dans un worktree jetable, aux tags actuels (`rerun.py`, sorties dans `out/` du scratchpad de cette session) :
  1. Les cinq rouges (`01`, `03`, `05`, `07`, `11`) : messages cités tels quels. `11-red` : `#8000 #00 -> #12`.
  2. Mutant de `09-guard` (`jr z` vers le décalage) : seul ce test échoue, `[ 4, 144, +0, 144 ]`.
  3. Mutants `inc l` / `inc e` : `10-guard` en attrape 8 sur 9 (le chargement de la clé survit), `13-guard` les 9 (`#7FFF #00 -> #04`).
  4. `14-guard` et `15-guard` contre « IY, copie » : 1 et 7 échecs. `16-guard` contre « pile, 2 `LDD` » : 6 échecs. `17-guard` contre un `nop` : 9 échecs,
     dont les 3 tests des chaînes égales de `strcmp`. L'article le dit.
  5. `18-refactor` → 48 tests verts (28 du tri, 20 de `strcmp`).
- Coûts du compte à la main vérifiés dans la table de Madram (skill `z80-cpc-timing`) : passe fixe 38, comparaison 29 + c, arrêt 32 + c,
  décalage 59 + c (58 + c si la clé va en tête). Les trois formules des guards en découlent.
- Limite par défaut d'un Run : 1 000 000 NOPs (`node_modules/z80-tdd/dist/configuration-file.js:43`). Cas le plus long : 1 557 154 NOPs.
- Variantes de la mesure récupérées du scratchpad d'une session passée (worktree `strsort-measure` encore présent), copiées dans `measure-old/`.
- `pnpm build` du blog vert, deux pages `tdd-cpc-string-sort`. Commit `a97a3bd` sur `docs/string-sort-post`, sans attribution.
- Revue `mattpocock-skills:code-review` lancée (Standards et Spec, deux agents en fond) : résultats non reçus avant ce rapport.

## Non fait / reste

- Lire les résultats de la revue, corriger l'article, refaire `pnpm build`.
- Push de `docs/string-sort-post` après le contrôle des attributions, puis PR blog.
- Question à Ivan : la conclusion n'annonce aucun article suivant. Annoncer la paire (clé, index) triée par comptage stable (option 3 du plan) ?
- Questions reprises du rapport `strsort-tags-push`, sans réponse : supprimer la branche locale `strsort-backup-17` ? corriger la section
  « Reprendre » du skill `session-report` (elle donne déjà `git log -1 --diff-filter=A`) ?

## Décisions

- Date de l'article `2026-10-25T12:00:00Z` et titre « trier des pointeurs vers des chaînes » : choix de session, à valider par Ivan.
- Le tableau des 8 variantes entre dans l'article (tour 4 du grilling, note du coffre `z80-tdd-sorts-tris`).
- Milliers écrits avec une espace en anglais aussi, comme dans les articles anglais de la série.

## Gate

- `pnpm typecheck` sur `docs/session-texte-strsort` (aucun fichier hors `docs/` ne diffère de `main`) → vert
- `pnpm test` à `strsort/18-refactor` → vert, 48 tests
- Vigies : chaque commit de `strcmp/15-guard..strsort` porte un tag `strsort/*` · 18 tags locaux, 18 tags distants

## État pour reprendre

- **Prochaine action :** lire la revue de l'article `tdd-cpc-string-sort` (relancer `mattpocock-skills:code-review` sur `blog`, depuis `origin/main`), puis corriger.
- **Arbre :** `blog` sur `docs/string-sort-post`, propre, non poussée · `z80-tdd-sorts` sur `strsort`, figée · PR #17 à #23 ouvertes, empilées ;
  ce rapport s'empile sur #23.
- **Pièges :**
  - Les agents de revue tournaient au moment du rapport. Après `/clear`, leurs résultats sont perdus : relancer la revue.
  - Deux worktrees jetables dans le scratchpad de cette session (`wt` détaché, `wt-docs` pour ce rapport). Le worktree `strsort-measure`
    d'une session passée existe encore. `git worktree prune` après leur suppression.
  - `rasm -v` affiche v3.0.8 sur ce Mac, le README demande v3.3.1. Les tests passent. Écart non traité.
