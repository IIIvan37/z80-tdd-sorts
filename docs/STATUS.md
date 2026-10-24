# STATUS

> Instantané du présent, réécrit par `/session-report`. Le détail est dans
> les rapports datés : [docs/sessions/](sessions/).

## Où on en est

Le dépôt porte un projet CPC vide sur `main`, testé avec z80-tdd 0.1.0 (tarball de sa release).
L'article d'introduction au TDD a ses 11 étapes sur la branche `intro`, taguées et poussées : `find_min`, deux guards, un budget en NOPs.
La branche `intro` est figée : l'article cite ses tags `intro/01-red` à `intro/11-green`.
L'article d'introduction existe en français et en anglais (`articles/fr/intro.md`, `articles/en/intro.md`), relu et validé.
La convention des branches et des tags est dans le [README](../README.md).

## Prochaine action

Choisir le tri qui suit l'introduction, puis écrire sa liste de tests avant sa branche.

## Questions ouvertes

- Quel tri suit l'introduction ? Le tri par sélection réutilise `find_min`.
- Quand rendre le dépôt public ? Les liens des articles vers les tags ne marchent qu'à ce moment-là.

## Articles

- **intro** : branche `intro`, dernier tag `intro/11-green` · FR : écrit, validé · EN : écrit · aucun des deux n'est publié.

## Historique

- 2026-10-24 · **intro-steps** : dépôt créé, 11 étapes TDD de `find_min` taguées, convention des tags avec `guard` ; article d'introduction en FR et en EN.
