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
Budgets : trié et égaux 33n − 26, inversé 6n² + 22n − 21 NOPs. La branche et ses 15 tags sont poussés et figés.
Sur l'entrée inversée, la sélection devient plus rapide que l'insertion à partir de n = 27.
Les articles, en français et en anglais, vivent dans le dépôt `IIIvan37/blog` : ce dépôt-ci ne garde que le code.

## Prochaine action

Écrire l'article FR et EN du tri par insertion dans le dépôt `blog` (comparaison avec la sélection, 15 tags, quatre versions).

## Questions ouvertes

- pnpm 10 écrit le lockfile sans integrity quand son store contient déjà z80-tdd. pnpm 11.9 corrige ce bug.
  Faut-il mettre `packageManager` à pnpm 11, ou publier z80-tdd sur npm ? La publication annule l'ADR 0009 de z80-tdd.

## Articles

- **intro** : branche `intro`, dernier tag `intro/11-green` · FR et EN dans `blog`, `tdd-cpc-find-min` · en ligne.
- **selection** : branche `selection`, dernier tag `selection/10-guard` · FR et EN dans `blog`, `tdd-cpc-selection-sort`.
- **insertion** : branche `insertion`, dernier tag `insertion/15-guard` · pas encore d'article. Le tri à bulles vient après.

## Historique

- 2026-10-24 · **intro-steps** : dépôt créé, 11 étapes TDD de `find_min` taguées, convention des tags avec `guard`.
- 2026-10-24 · **publication** : article FR et EN, dépôt public, articles déplacés dans `blog` (Astro sur Netlify).
- 2026-10-24 · **selection** : lockfile corrigé (PR #6), tri par sélection en 10 étapes, article FR et EN avec la complexité.
- 2026-10-24 · **insertion** : grilling Q1 à Q13, tri par insertion en 15 étapes, quatre versions mesurées, guards prouvés par mutants (PR #8).
- 2026-10-24 · **insertion-push** : deux commentaires corrigés avant le push, `insertion` poussée (PR #9), sélection mesurée sur trois entrées.
