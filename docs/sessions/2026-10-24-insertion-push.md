# Session — 2026-10-24 — insertion-push

- **Branche :** `docs/session-insertion-push`
- **Objet :** trancher les deux commentaires de `insertion`, pousser la branche, mesurer `selection_sort` pour l'article.

## Fait

- Commits `09` à `15` de `insertion` réécrits, tags `09` à `15` déplacés, avant tout push. Les tags `01` à `08` ne bougent pas.
  - Test `09` : le commentaire vaut pour `DEC L` et `DEC HL`. La mémoire neuve de z80-tdd est à `#00` partout
    (`node_modules/z80-tdd/dist/program.js:8`). Avec `LDD`, `#7FFF` vaut aussi `#00` : `ARRAY + 1` reste utile.
  - Asm : le commentaire du compteur passe sur `inc d` (`10-green`), puis sur `inc c` (`11-refactor`).
  - Le nouveau sommet `2abaeb5` diffère de l'ancien par ces deux commentaires seulement.
- `insertion` et ses 15 tags poussés sur `origin`. La branche est figée.
- Rapport `2026-10-24-insertion.md` mis à l'état final, après une revue `code-review` (standards et spec). PR #8 fusionnée.
- `selection_sort` mesuré à `selection/10-guard`, n = 1 à 255, formules exactes sur tout l'intervalle :

  | Entrée | sélection | insertion |
  |---|---|---|
  | triée | 5n² + 36n − 36 | 33n − 26 |
  | égaux | 6n² + 35n − 36 | 33n − 26 |
  | inversée | ⌊11n²/2⌋ + 36n − 36 | 6n² + 22n − 21 |

  - Sur l'entrée inversée, l'insertion gagne jusqu'à n = 26 (4 607 contre 4 618). La sélection gagne dès n = 27 (4 945 contre 4 947).
    À n = 255 : sélection 366 781, insertion 395 739.
  - Cause : l'insertion paie 12 NOPs par octet décalé (`cp`, `jr`, `ldd`, `jp pe`). La sélection écrit un échange par passe.

## Non fait / reste

- Article FR et EN dans `blog` : comparaison sélection et insertion sur les trois entrées, les 15 tags, les quatre versions mesurées.
- Tri à bulles : sa branche et ses tags, après l'article insertion.

## Décisions

- Les deux commentaires : réécrits à leur commit d'origine, pas expliqués dans l'article (choix de l'utilisateur).
  La convention des tags est dans le [README](../../README.md).

## Gate

- `pnpm typecheck` sur `main` → vert.
- `pnpm test` à `insertion/15-guard` → vert, 15 tests sur 15.
- Vigies : chaque commit de `main..insertion` porte son tag. Tags locaux = tags distants (15, mêmes hashes).

## État pour reprendre

- **Prochaine action :** écrire l'article FR et EN du tri par insertion dans le dépôt `blog`.
- **Arbre :** propre · `insertion` poussée et figée · `docs/session-insertion-push` porte ce rapport et le STATUS.
- **Pièges :**
  - Ne réécrire ni `intro`, ni `selection`, ni `insertion` : leurs tags sont publiés.
  - Le guard `14` (≤) n'attrape pas seul sa version cassée : `13` l'attrape aussi (le `jr z` coûte 2 NOPs). L'article doit le dire.
  - Les quatre versions mesurées et leurs formules sont dans le rapport `2026-10-24-insertion.md`.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
