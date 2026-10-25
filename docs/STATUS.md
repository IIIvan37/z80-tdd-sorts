# STATUS

> Instantané du présent, réécrit par `/session-report`. Le détail est dans
> les rapports datés : [docs/sessions/](sessions/).

## Où on en est

Le dépôt porte un projet CPC vide sur `main`, testé avec z80-tdd 0.1.0 (tarball de sa release). Il est public depuis le 2026-10-24.
Chaque article a sa branche figée, avec un tag par étape TDD. La convention est dans le [README](../README.md).
Les tags `intro/*` gardent l'ancien lockfile : le README donne `--no-lockfile`.
Le tri par sélection est livré : branche `selection`, 10 étapes. Pire cas mesuré : octets égaux, 6n² + 35n − 36 NOPs.
Le tri par insertion est livré : branche `insertion`, 15 étapes, décalage par `LDD` en `11-refactor`.
Budgets : trié et égaux 33n − 26, inversé 6n² + 22n − 21 NOPs.
Le tri à bulles est livré : branche `bubble`, 13 étapes, algorithme B de Knuth avec la bulle portée dans E.
Budgets : trié et égaux 12n + 6, inversé 8,5n² + 11,5n − 19 NOPs. Le rapport `bubble` garde les mesures de dix variantes.
Le tri par comptage est livré : branche `counting`, 13 étapes, table `counts` à zéro en entrée et en sortie.
Budgets : égaux (pire cas) 20n + 2 572, triée et inversée 19n + 2 573 NOPs. Le rapport `counting` garde les mesures des variantes.
Le radix sort est livré : branche `radix`, 10 étapes, clés de 16 bits, LSD en base 256, deux passes, buffer en DE.
Le refactor `07-refactor` appelle deux fois une passe `.pass`, avec les clés en big-endian dans le buffer.
Budget : 122n + 13 406 NOPs pour toute entrée, car aucun branchement ne dépend des clés.
Les branches `intro`, `selection`, `insertion`, `bubble`, `counting`, `radix`, `strcmp` et `strsort` sont poussées avec leurs tags, et figées.
Les articles d'`intro`, des trois tris simples, du comptage et du radix, en français et en anglais, sont en ligne dans le dépôt `IIIvan37/blog`.
L'article du comptage porte un graphique SVG des quatre tris sur l'entrée inversée, écrit par `blog/scripts/sort-chart.mjs`.
Les articles portent des tags (`z80`, `cpc`, `tdd`, `sorting`) dans la ligne de la date, une page par tag, au moins un par article (PR blog #11).
La série continue sur des références vers des données fixes : `strcmp`, puis un tri de pointeurs vers des chaînes.
`strcmp` est livrée : branche `strcmp`, 15 étapes, chaînes à bit 7 final, sortie comme `CP`. Revue code-review et `simplify` faites.
`14-refactor` garde l'octet de S1 dans E. k = lettres égales sur 7 bits avant la lettre qui décide.
Budgets exacts : lettres différentes 14k + 20, une chaîne finit 14k + 8, chaînes égales 14k + 4 NOPs.
Le tri par insertion de pointeurs vers des chaînes est livré (design : note du coffre `z80-tdd-sorts-tris`).
Sa branche `strsort`, issue de `strcmp/15-guard`, va de `01-red` à `18-refactor` : boucle, stabilité, page, bornes, budgets, helpers.
Code : clé et trou sur la pile pendant `call strcmp`, C compte la suite triée, B borne les décalages par `djnz`. IX et IY ne changent pas.
Le tour 4 a gardé ce code après la mesure de 8 variantes : le tableau est dans le rapport `strsort-measure`.
Budgets exacts : triée (n − 1)(90 + 14k) + 7, inversée (n − 1)(n(79 + 14k)/2 + 37) + 7, égales (n − 1)(74 + 14L) + 7 NOPs.
L'article FR et EN `tdd-cpc-string-sort` est livré par la PR blog #14, revues corrigées. Il garde six variantes sur huit dans son tableau.
Sa conclusion annonce l'article suivant : paires (clé, index) triées par une passe de comptage stable (option 3 du plan).

## Prochaine action

Cadrer l'article suivant par un grilling : paires (clé, index) triées par une passe de comptage stable.

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
- **strcmp** : branche `strcmp`, dernier tag `strcmp/15-guard` · FR et EN dans `blog`, `tdd-cpc-strcmp` (PR blog #13) · en ligne.
- **strsort** : branche `strsort`, dernier tag `strsort/18-refactor` · FR et EN dans `blog`, `tdd-cpc-string-sort` (PR blog #14) · en ligne.

## Historique

- 2026-10-24 · **intro-steps, publication** : dépôt créé, 11 étapes de `find_min`, tags avec `guard`, article, dépôt public, `blog` sur Netlify.
- 2026-10-24 · **selection** : lockfile corrigé (PR #6), tri par sélection en 10 étapes, article FR et EN avec la complexité.
- 2026-10-24 · **insertion, -push, texte-insertion** : grilling Q1 à Q13, 15 étapes, guards prouvés par mutants, article (PR blog #8).
- 2026-10-24 · **bubble, texte-bubble** : grilling Q1 à Q9, dix variantes mesurées, 13 étapes, guards par mutants, article (PR blog #9).
- 2026-10-24 · **counting, texte-counting, -push** : PR #9 à #12, grilling Q1 à Q13, 13 étapes, guards par mutants, article avec SVG (PR blog #10).
- 2026-10-24 · **radix-grilling, -start, -steps, texte-radix** : design en 4 tours, 10 étapes, guards par mutants (PR #15), article (PR blog #12).
- 2026-10-24 · **tags, tags-merge** : grilling des tags Q1 à Q6, code-review et simplify, tags dans la ligne de la date, PR blog #11 fusionnée.
- 2026-10-24 · **strcmp, -push, texte-strcmp** : 15 étapes, version E en `14-refactor`, bornes exactes, revues, article (PR blog #13).
- 2026-10-25 · **strsort-grilling, -steps, -measure, -tags-push** : design en 4 tours, 8 variantes mesurées, 18 étapes, revue, `strsort` poussée.
- 2026-10-25 · **texte-strsort, -push** : article FR et EN du tri de pointeurs, mutants relancés, revue corrigée, PR blog #14.
