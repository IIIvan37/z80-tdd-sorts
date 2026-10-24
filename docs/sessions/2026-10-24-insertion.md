# Session — 2026-10-24 — insertion

- **Branche :** `insertion` (branche d'article), puis `docs/session-insertion`
- **Objet :** écrire le tri par insertion en TDD, après validation de sa liste de tests.

## Fait

- Ancienne branche `insertion` supprimée à la demande de l'utilisateur, avec son worktree `../z80-tdd-sorts-insertion` (un stub et un test non commités).
- Plan tranché par un grilling (Q1 à Q13) : branche issue de `main`, même interface que `selection_sort`, décalages, borne de la boucle
  interne forcée par un test rouge, trois budgets exacts (trié, égaux, inversé), n = 2, 16, 255.
- Branche `insertion` : `insertion/01-red` à `insertion/15-guard`, 15 commits, un tag chacun.
  - `09-red` : le tableau commence à `ARRAY + 1`, avec `#FF` à `ARRAY`. À `#8000`, `DEC L` lit `#80FF` (`#00` en mémoire neuve) et le code
    sans borne passait. Un probe l'a prouvé.
  - `10-green` : compteur E, position de la clé sur la pile. `11-refactor` : décalage par `LDD`, BC sert de borne (`jp pe`).
  - Budgets du code final, mesurés par z80-tdd et vérifiés à la main (tables Madram / 64NOPS) : trié et égaux 33n − 26, inversé 6n² + 22n − 21.
- Quatre versions mesurées (NOPs), pour l'article :

  | Version | trié, égaux | inversé |
  |---|---|---|
  | compteur E (`10-green`) | 25n − 18 | 7,5n² + 11,5n − 12 |
  | sentinelle (*Algorithms in C*, Program 6.3) | 37n − 26 (n ≥ 3) | 7n² + 13n − 9 (n ≥ 3) |
  | échanges (*Algorithms* 4e éd.) | 22n − 15 | 8,5n² + 6,5n − 8 |
  | `LDD` (`11-refactor`, retenue) | 33n − 26 | 6n² + 22n − 21 |

- Versions cassées lancées en mutant contre chaque guard :
  - `12` : B passes au lieu de B − 1. Les tests plus anciens échouent aussi, grâce au `#00` de la mémoire neuve.
  - `13` : la sentinelle. Seul ce guard échoue.
  - `14` : un ≤ (`jr z` avant `jr nc`). Il fait aussi échouer `13`, car le `jr z` coûte 2 NOPs par comparaison : l'article doit le dire.
  - `15` : les échanges et le compteur E. Seul ce guard échoue (n = 2 reste sous le plafond).
- Revue `mattpocock-skills:code-review` de `main..insertion` (standards et spec, la liste du grilling comme spec) :
  - standards : aucun standard documenté cassé. Commits, tags et commentaires de l'asm sont conformes à `selection`.
  - spec : rien ne manque, pas de hors-périmètre. Interface vérifiée à B = 255, tableau à `#8000` et à `#8001`, octet gardé de chaque côté.
    Budgets recomptés et mesurés, égaux à 33n − 26 et 6n² + 22n − 21.
  - deux commentaires à trancher : celui du test `09` nomme `DEC L`, absent du code depuis `11-refactor`. Celui de `ld c,0`
    (« C: the bytes of the sorted run ») est juste seulement après `inc c`. Pour n = 1, le code coûte 5 NOPs et 33n − 26 donne 7.
    Aucun test ne couvre ce cas.
- Commits `09` à `15` réécrits avant le push, tags `09` à `15` déplacés. Les tags `01` à `08` ne bougent pas.
  - Test `09`, au commit `09-red` : le commentaire vaut pour `DEC L` et `DEC HL`. La mémoire neuve de z80-tdd est à `#00` partout
    (`Uint8Array(0x10000)`, `node_modules/z80-tdd/dist/program.js:8`). Avec `LDD`, `#7FFF` vaut donc aussi `#00`, et `ARRAY + 1` reste utile.
  - Asm, au commit `10-green` : le commentaire du compteur passe de `ld d,0` à `inc d`, puis de `ld c,0` à `inc c` en `11-refactor`.
  - Le nouveau sommet diffère de l'ancien par ces deux commentaires seulement.
- `insertion` et ses 15 tags poussés sur `origin`, puis figés.

## Non fait / reste

- Mesurer `selection_sort` sur les entrées triée et inversée, dans un worktree sur `selection/10-guard`, pour le tableau de l'article.
- Article FR et EN dans `blog` : comparaison sélection et insertion sur les trois entrées, les 15 tags, les quatre versions.

## Décisions

- Q1 à Q13 du grilling : la liste est dans « Fait ». Le [README](../../README.md) couvre la convention des tags.
- Q3 puis choix final : décalage par `LDD` en `11-refactor` (choix de l'utilisateur, après les mesures). « L'implémentation Sedgewick »
  de l'utilisateur est la version par échanges de la 4e édition.
- Les deux commentaires : réécrits à leur commit d'origine (choix de l'utilisateur). La branche n'était pas encore poussée.

## Gate

- `pnpm typecheck` sur `main` → vert.
- Tests à chaque tag `01` à `08` (worktree du scratchpad) : les 4 `red` échouent sur leur nouveau test, les 4 `green` passent.
- Tests à chaque commit réécrit `09` à `15` : `09-red` échoue (1 test sur 5), les 6 autres passent, 15 tests sur 15 à `15-guard`.
- Vigies : 15 commits, 15 tags. Tags locaux = tags distants (15), `origin/insertion` = `insertion/15-guard`.
- Revue code-review : 0 violation de standard, 0 écart de spec. Les 2 commentaires sont tranchés.

## État pour reprendre

- **Prochaine action :** mesurer `selection_sort` sur les entrées triée et inversée (worktree sur `selection/10-guard`).
- **Arbre :** propre · `insertion` poussée et figée · `docs/session-insertion` porte ce rapport et le STATUS.
- **Pièges :**
  - Ne pas réécrire `intro`, `selection` ni `insertion` : leurs tags sont publiés.
  - Le guard `14` (≤) n'attrape pas seul sa version cassée : `13` l'attrape aussi (le `jr z` coûte 2 NOPs). L'article doit le dire.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
