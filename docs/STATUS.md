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
Les branches `intro`, `selection`, `insertion` et `bubble` sont poussées avec leurs tags, et figées.
Les articles d'`intro`, de `selection` et d'`insertion`, en français et en anglais, sont en ligne dans le dépôt `IIIvan37/blog`.
L'article du tri à bulles, FR et EN, est écrit et revu : PR blog #9. Il clôt la série des trois tris simples.

## Prochaine action

Relire et fusionner la PR blog #9 (article du tri à bulles), puis les PR de rapport de `z80-tdd-sorts`.

## Questions ouvertes

- pnpm 10 écrit le lockfile sans integrity quand son store contient déjà z80-tdd. pnpm 11.9 corrige ce bug.
  Faut-il mettre `packageManager` à pnpm 11, ou publier z80-tdd sur npm ? La publication annule l'ADR 0009 de z80-tdd.
- Style des articles, trois points laissés à l'utilisateur : nombre de questions rhétoriques, titres imagés, ouverture sur l'article précédent.
- Quel article après les trois tris simples ? L'article du tri à bulles ne promet rien.

## Articles

- **intro** : branche `intro`, dernier tag `intro/11-green` · FR et EN dans `blog`, `tdd-cpc-find-min` · en ligne.
- **selection** : branche `selection`, dernier tag `selection/10-guard` · FR et EN dans `blog`, `tdd-cpc-selection-sort` · en ligne.
- **insertion** : branche `insertion`, dernier tag `insertion/15-guard` · FR et EN dans `blog`, `tdd-cpc-insertion-sort` (PR blog #8) · en ligne.
- **bubble** : branche `bubble`, dernier tag `bubble/13-guard` · FR et EN dans `blog`, `tdd-cpc-bubble-sort` (PR blog #9) · pas encore en ligne.

## Historique

- 2026-10-24 · **intro-steps** : dépôt créé, 11 étapes TDD de `find_min` taguées, convention des tags avec `guard`.
- 2026-10-24 · **publication** : article FR et EN, dépôt public, articles déplacés dans `blog` (Astro sur Netlify).
- 2026-10-24 · **selection** : lockfile corrigé (PR #6), tri par sélection en 10 étapes, article FR et EN avec la complexité.
- 2026-10-24 · **insertion** : grilling Q1 à Q13, tri par insertion en 15 étapes, quatre versions mesurées, guards prouvés par mutants (PR #8).
- 2026-10-24 · **insertion-push** : deux commentaires corrigés avant le push, `insertion` poussée, sélection mesurée sur trois entrées.
- 2026-10-24 · **texte-insertion** : article FR et EN du tri par insertion (PR blog #8), revue code-review, rapport livré par la PR #9.
- 2026-10-24 · **bubble** : grilling Q1 à Q9, dix variantes mesurées, tri à bulles en 13 étapes, guards prouvés par mutants (PR #10).
- 2026-10-24 · **texte-bubble** : article FR et EN du tri à bulles (PR blog #9), mesures refaites, revue code-review.
