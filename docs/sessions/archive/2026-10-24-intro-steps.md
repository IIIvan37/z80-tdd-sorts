# Session — 2026-10-24 — intro-steps

- **Branche :** `main` (squelette), `intro` (étapes), puis `docs/session-report-setup`
- **Objet :** créer le dépôt des tris et écrire les étapes TDD de l'article d'introduction.

## Fait

- Dépôt privé `IIIvan37/z80-tdd-sorts` : sur `main`, un projet CPC vide.
  - `z80-tdd.config.ts`, `src/main.asm` en `#4000`, licence MIT, README de la convention.
  - z80-tdd 0.1.0 vient du tarball de sa release. Vitest 5 et TypeScript 6 complètent les dépendances.
- Branche `intro`, locale : 11 commits, un par étape, pour `find_min` (le plus petit octet du tableau en HL, de longueur B).
  - 01 à 06 : un octet, deux octets, puis cinq octets ; chaque rouge échoue pour la bonne raison.
  - 07, refactor : les tests passent par une seule fonction `findMin`.
  - 08 et 09, guard : comparaison sans signe (`#10` contre `#F0`), tableau intact. Chacun attrape sa version cassée (`jp m`, `ld (hl),a`).
  - 10 et 11 : budget de 172 NOPs pour 16 octets décroissants (187 au départ), atteint par `inc l` ; le tableau tient dans une page.
- Les tests emploient `toHaveRegisters` : un échec affiche `A  expected #17, received #42`.
- README : type d'étape `guard`, branche figée après la pose des tags.
- Fiche `session-report` du projet ajoutée dans `~/claude-memory`.

## Non fait / reste

- Les 11 tags de `intro` ne sont pas posés, et la branche n'est pas poussée.
- Les articles `articles/fr/` et `articles/en/` ne sont pas commencés.

## Décisions

- Une branche par article, un tag par étape, cycle rouge, vert, refactor, plus `guard` : [README.md](../../../README.md).
- Pas de CI ; dépôt privé au début ; articles en français et en anglais, dans le style de https://sikorama.fr/ ; code en anglais.
- Le budget en NOPs est l'angle CPC de l'introduction : un test fixe la durée, et le code doit la respecter.

## Gate

- `pnpm typecheck` sur `main` → vert.
- `pnpm test` au dernier commit de `intro` → vert, 6 tests sur 6.

## État pour reprendre

- **Prochaine action :** poser les 11 tags `intro/01-red` à `intro/11-green`, puis pousser `intro` et ses tags.
- **Arbre :** propre après le commit de ce rapport · `docs/session-report-setup` poussée, PR ouverte vers `main`.
- **Pièges :**
  - Le script qui a bâti `intro` est dans le scratchpad d'une session : il disparaît. Une fois les tags posés, il ne sert plus.
  - `gh` a un autre compte comme compte actif : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande `gh`.
  - Avant de citer un coût en NOPs dans un article, le vérifier avec la skill `z80-cpc-timing`.
