# STATUS

> Instantané du présent, réécrit par `/session-report`. Le détail est dans
> les rapports datés : [docs/sessions/](sessions/).

## Où on en est

Le dépôt porte un projet CPC vide sur `main`, testé avec z80-tdd 0.1.0 (tarball de sa release). Il est public depuis le 2026-10-24.
Chaque article a sa branche figée, avec un tag par étape TDD. La convention est dans le [README](../README.md).
Les tags `intro/*` gardent l'ancien lockfile : le README donne `--no-lockfile`.
Le tri par sélection est livré : branche `selection`, 10 étapes. Pire cas mesuré : octets égaux, 6n² + 35n − 36 NOPs.
Mesures hors tests : triée 5n² + 36n − 36, inversée ⌊11n²/2⌋ + 36n − 36 NOPs.
Le tri par insertion est livré : branche `insertion`, 15 étapes, décalage par `LDD` en `11-refactor`.
Budgets : trié et égaux 33n − 26, inversé 6n² + 22n − 21 NOPs.
Le tri à bulles est livré : branche `bubble`, 13 étapes, algorithme B de Knuth avec la bulle portée dans E.
Budgets : trié et égaux 12n + 6, inversé 8,5n² + 11,5n − 19 NOPs. Le rapport `bubble` garde les mesures de dix variantes.
Le tri par comptage est livré : branche `counting`, 13 étapes, table `counts` à zéro en entrée et en sortie.
Budgets : égaux (pire cas) 20n + 2 572, triée et inversée 19n + 2 573 NOPs. Le rapport `counting` garde les mesures des variantes.
Le radix sort est livré : branche `radix`, 10 étapes, clés de 16 bits, LSD en base 256, deux passes, buffer en DE.
Le refactor `07-refactor` appelle deux fois une passe `.pass`, avec les clés en big-endian dans le buffer.
Budget : 122n + 13 406 NOPs pour toute entrée, car aucun branchement ne dépend des clés.
Les branches `intro`, `selection`, `insertion`, `bubble`, `counting` et `radix` sont poussées avec leurs tags, et figées.
Les articles d'`intro`, des trois tris simples, du comptage et du radix, en français et en anglais, sont en ligne dans le dépôt `IIIvan37/blog`.
L'article du comptage porte un graphique SVG des quatre tris sur l'entrée inversée, écrit par `blog/scripts/sort-chart.mjs`.
Les articles du blog portent des tags (`z80`, `cpc`, `tdd`, `sorting`), avec une page par tag, livrés par la PR blog #11.
Les tags sont dans la ligne de la date. Le schéma du blog exige au moins un tag par article.
La série continue sur des références vers des données fixes : `strcmp`, puis un tri de pointeurs vers des chaînes.
`strcmp` est écrite en local : branche `strcmp`, 14 étapes taguées, non poussée. Chaînes à bit 7 final, sortie comme `CP`.
Budget : 14k + 22 NOPs, k = lettres égales sur 7 bits avant la lettre qui décide. Revue code-review et `simplify` faites.

## Prochaine action

Faire choisir Ivan : `.differ` avec E (14k + 20 NOPs) dans `13-green` par reconstruction, ou en étape refactor.

## Questions ouvertes

- pnpm 10 écrit le lockfile sans integrity quand son store contient déjà z80-tdd. pnpm 11.9 corrige ce bug.
  Faut-il mettre `packageManager` à pnpm 11, ou publier z80-tdd sur npm ? La publication annule l'ADR 0009 de z80-tdd.

## Articles

- **intro** : branche `intro`, dernier tag `intro/11-green` · FR et EN dans `blog`, `tdd-cpc-find-min` · en ligne.
- **selection** : branche `selection`, dernier tag `selection/10-guard` · FR et EN dans `blog`, `tdd-cpc-selection-sort` · en ligne.
- **insertion** : branche `insertion`, dernier tag `insertion/15-guard` · FR et EN dans `blog`, `tdd-cpc-insertion-sort` (PR blog #8) · en ligne.
- **bubble** : branche `bubble`, dernier tag `bubble/13-guard` · FR et EN dans `blog`, `tdd-cpc-bubble-sort` (PR blog #9) · en ligne.
- **counting** : branche `counting`, dernier tag `counting/13-guard` · FR et EN dans `blog`, `tdd-cpc-counting-sort` (PR blog #10) · en ligne.
- **radix** : branche `radix`, dernier tag `radix/10-guard` · FR et EN dans `blog`, `tdd-cpc-radix-sort` (PR blog #12) · en ligne.
- **strcmp** : branche `strcmp` (locale), dernier tag `strcmp/14-guard` · article non écrit.

## Historique

- 2026-10-24 · **intro-steps** : dépôt créé, 11 étapes TDD de `find_min` taguées, convention des tags avec `guard`.
- 2026-10-24 · **publication** : article FR et EN, dépôt public, articles déplacés dans `blog` (Astro sur Netlify).
- 2026-10-24 · **selection** : lockfile corrigé (PR #6), tri par sélection en 10 étapes, article FR et EN avec la complexité.
- 2026-10-24 · **insertion** : grilling Q1 à Q13, tri par insertion en 15 étapes, quatre versions mesurées, guards prouvés par mutants (PR #8).
- 2026-10-24 · **insertion-push** : deux commentaires corrigés avant le push, `insertion` poussée, sélection mesurée sur trois entrées.
- 2026-10-24 · **texte-insertion** : article FR et EN du tri par insertion (PR blog #8), revue code-review, rapport livré par la PR #9.
- 2026-10-24 · **bubble** : grilling Q1 à Q9, dix variantes mesurées, tri à bulles en 13 étapes, guards prouvés par mutants (PR #10).
- 2026-10-24 · **texte-bubble** : article FR et EN du tri à bulles (PR blog #9), mesures refaites, revue code-review.
- 2026-10-24 · **counting** : PR #9 à #12 fusionnées, grilling Q1 à Q13, tri par comptage en 13 étapes, guards prouvés par mutants.
- 2026-10-24 · **texte-counting** : article FR et EN du comptage avec graphique SVG, mutants relancés, sans mention de Roudoudou.
- 2026-10-24 · **texte-counting-push** : revue code-review, trois corrections, article du comptage publié (PR blog #10).
- 2026-10-24 · **tags** : grilling des tags Q1 à Q6, `feat/tags` dans `blog`, code-review et simplify, PR blog #11, radix en pause.
- 2026-10-24 · **radix-grilling, radix-start** : design du radix accepté en 4 tours, branche `radix` ouverte, étapes `01` et `02`.
- 2026-10-24 · **radix-steps** : étapes `03-red` à `10-guard`, refactor par clés inversées, guards prouvés par mutants, `radix` poussée (PR #15).
- 2026-10-24 · **texte-radix** : article FR et EN du radix (PR blog #12), mutants relancés, coûts vérifiés, revue code-review.
- 2026-10-24 · **tags-merge** : Q3(1) tranchée (tags dans la ligne de la date), merge testé par un build, PR blog #11 fusionnée.
- 2026-10-24 · **strcmp** : série des chaînes choisie, `strcmp` en 14 étapes locales, code-review et 3 corrections, `simplify`.
