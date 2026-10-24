# STATUS

> Instantané du présent, réécrit par `/session-report`. Le détail est dans
> les rapports datés : [docs/sessions/](sessions/).

## Où on en est

Le dépôt porte un projet CPC vide sur `main`, testé avec z80-tdd 0.1.0 (tarball de sa release). Il est public depuis le 2026-10-24.
L'introduction au TDD a ses 11 étapes sur la branche `intro`, taguées `intro/01-red` à `intro/11-green` : `find_min`, deux guards, un budget en NOPs.
La branche `intro` est figée : l'article publié cite ses tags.
L'article, en français et en anglais, vit dans le dépôt `IIIvan37/blog` (slug `tdd-cpc-find-min`) : ce dépôt-ci ne garde que le code.
La convention des branches et des tags est dans le [README](../README.md).
Le lockfile de `main` a l'integrity du tarball de z80-tdd : pnpm ≥ 10.34.1 refuse un tarball sans integrity. Les tags `intro/*` gardent l'ancien lockfile : le README donne `pnpm install --no-lockfile`.

## Prochaine action

Ajouter la note `--no-lockfile` aux deux articles de l'introduction, dans `blog`. Puis créer la branche `selection` depuis `intro/11-green`, et cherry-pick le commit qui corrige le lockfile. Ce premier commit n'a pas de tag.

## Questions ouvertes

- pnpm 10 écrit le lockfile sans integrity quand son store contient déjà z80-tdd. pnpm 11.9 corrige ce bug (PR pnpm #12491). Faut-il mettre `packageManager` à pnpm 11, ou publier z80-tdd sur npm ? La publication annule l'ADR 0009 de z80-tdd.

## Articles

- **intro** : branche `intro`, dernier tag `intro/11-green` · FR et EN dans `blog`, `tdd-cpc-find-min` · site relié à Netlify.

## Historique

- 2026-10-24 · **intro-steps** : dépôt créé, 11 étapes TDD de `find_min` taguées, convention des tags avec `guard`.
- 2026-10-24 · **publication** : article FR et EN, dépôt public, articles déplacés dans `blog` (Astro sur Netlify).
