# Session — 2026-10-25 — strsort-steps

- **Branche :** `strsort` (code, locale, non poussée) · `docs/session-strsort-steps` (ce rapport, issue de `docs/session-strsort-grilling`)
- **Objet :** écrire les étapes TDD du tri de pointeurs vers des chaînes, du premier vert jusqu'aux bornes du tableau.

## Fait

- Reprise : une autre session (`z80-tdd-sorts-5c`) avait écrit `02-green` (`f9ca359`) et `03-red` (`5abfd57`). Ivan a choisi de continuer ici.
- Étapes `04-green` à `13-guard` sur `strsort`, un commit et un tag par étape, chacune validée par Ivan :
  1. `04-green` (`01ccaae`) : `strcmp` appelée avec HL = clé, DE = case 0, puis échange des deux pointeurs si C.
  2. `05-red` (`a245e78`), `06-green` (`cafb3b9`) : insertion du dernier pointeur, sans borne au début du tableau.
  3. `07-red` (`e82e7d9`), `08-green` (`cdc7b36`) : une passe par pointeur, début de passe sur la pile. Premier vert avec la boucle.
  4. `09-guard` (`68d6ea7`) : stabilité, deux `MODE` lus par adresse. Mutant `jr z,.move` avant `jr nc,.place` : seul ce guard échoue.
  5. `10-guard` (`673b87a`) : `it.each` sur un tableau à #80FC et à #80FD, `MOVER` à #90FE. Helpers à adresses (`startsOf`, `runStringSort`, `sortStrings`).
  6. `11-red` (`1155eab`) : pointeur vers `ZONE` juste avant le tableau, `toChangeOnly`. Helper `textsOf` sorti de `sortStrings`.
  7. `12-green` (`d448a66`) : C compte la suite triée, `push bc` par passe, B = pointeurs que la clé peut passer, `djnz .shift`.
  8. `13-guard` (`808c8f4`) : pointeur vers `AUTO` juste après un tableau à #80FD, `toChangeOnly`.
- Mutants `inc l` / `inc e` à la place de chaque `inc hl` / `inc de` de `string_sort` et de `strcmp` : les 9 sont attrapés à `13-guard`.
  `10-guard` en attrape 8. Le chargement de la clé (`ld e,(hl)` / `inc hl` / `ld d,(hl)`) n'est attrapé que par `13-guard`.
- Mutant « B passes au lieu de B − 1 » contre `13-guard` : les 9 tests de `string_sort` échouent, car #0000 après le tableau pointe vers #00.
- Sonde dans une copie du projet : RASM et z80-tdd prennent en charge `ld e,iyl`, `ld d,iyh`, `ld iyl,n`. Coûts lus : 2, 2 et 3 NOPs.

## Non fait / reste

- Tour 4 du grilling : mesure des plans de registres de la Q9, puis choix d'Ivan (plan, contrat de sortie IX/IY, forme du budget).
- Après le tour 4 : refactor éventuel, guards des budgets, revue code-review et `simplify`, push de `strsort`, article `tdd-cpc-string-sort`.

## Décisions

- Ordre : suite des tests de la Q7 (stabilité, page, bornes) avant la mesure du tour 4. Note du coffre `z80-tdd-sorts-tris`.
- Guard de page sur deux tableaux, #80FC et #80FD : avec un tableau pair, un pas pair → impair ne franchit jamais une page. Même note.
- Guard de fin de tableau sur un tableau à #80FD, pour attraper le mutant du chargement de la clé. Même note.

## Gate

- `pnpm typecheck` sur `main` (worktree) → vert
- `pnpm test` à `strsort/13-guard` → vert, 29 tests (9 de `string_sort`, 20 de `strcmp`)
- Vigies : chaque commit de `strcmp/15-guard..strsort` porte un tag `strsort/*` · aucun tag `strsort/*` distant (branche non poussée)

## État pour reprendre

- **Prochaine action :** attendre le feu vert d'Ivan sur le plan de mesure du tour 4, puis le lancer dans un worktree jetable sur `strsort/13-guard`.
- **Question posée à Ivan, sans réponse :** lancer la mesure ? Plan proposé :
  1. Variantes : pile (actuelle), clé dans IY rendue par `ld l,iyl` / `ld h,iyh`, IX/IY par la pile, opérande d'un `ld hl,nn` modifié,
     décalage par deux `LDD` ou copie de deux octets, croisé avec les plans.
  2. Chaque variante passe les 29 tests, sinon elle sort de la mesure.
  3. NOPs sur les entrées triée, inversée, égale, et à long préfixe commun, plus la taille en octets.
  4. Tableau des coûts à Ivan, qui choisit plan, contrat de sortie et forme du budget. Aucun commit sur `strsort`.
- **Arbre :** `strsort` propre, à `strsort/13-guard`, locale, non poussée · PR #17 à #20 ouvertes, empilées ; ce rapport s'empile sur #20.
- **Pièges :**
  - Tant que `strsort` n'est pas poussée, une correction se fait par reconstruction et nouveau tag.
  - `rasm -v` affiche v3.0.8 sur ce Mac, le README demande v3.3.1. Les tests passent. Écart non traité.
