# Session — 2026-10-24 — insertion

- **Branche :** `insertion` (branche d'article, locale), puis `docs/session-insertion`
- **Objet :** écrire le tri par insertion en TDD, après validation de sa liste de tests.

## Fait

- Ancienne branche `insertion` supprimée à la demande de l'utilisateur, avec son worktree `../z80-tdd-sorts-insertion` (un stub et un test non commités).
- Plan tranché par un grilling (Q1 à Q13) : branche issue de `main`, même interface que `selection_sort`, décalages, borne de la boucle
  interne forcée par un test rouge, trois budgets exacts (trié, égaux, inversé), n = 2, 16, 255.
- Branche `insertion` : `insertion/01-red` à `insertion/15-guard`, 15 commits, un tag chacun, en local seulement.
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
  - standards : aucun standard documenté cassé ; commits, tags et commentaires de l'asm conformes à `selection` ;
  - spec : rien ne manque, pas de hors-périmètre ; interface vérifiée à B = 255, tableau à `#8000` et à `#8001`, octet gardé de chaque côté ;
    budgets recomptés et mesurés, égaux à 33n − 26 et 6n² + 22n − 21 ;
  - à trancher : le commentaire du test `09` nomme `DEC L`, absent du code depuis `11-refactor` ; le commentaire de `ld c,0` (« C: the bytes
    of the sorted run ») est juste seulement après `inc c` ; pour n = 1, le code coûte 5 NOPs et 33n − 26 donne 7 (aucun test ne couvre ce cas).

## Non fait / reste

- Trancher le commentaire périmé du test `09` : le réécrire au `09-red` et rejouer les commits (les tags `09` à `15` bougent),
  ou le garder, car il décrit le code de ce moment, et l'expliquer dans l'article. Même question pour le commentaire de `ld c,0`.
- Pousser `insertion` et ses 15 tags, puis la figer.
- Mesurer `selection_sort` sur les entrées triée et inversée, dans un worktree sur `selection/10-guard`, pour le tableau de l'article.
- Article FR et EN dans `blog` : comparaison sélection et insertion sur les trois entrées, les 15 tags, les quatre versions.

## Décisions

- Q1 à Q13 du grilling : la liste et ses raisons sont dans « Fait ». Le README couvre déjà la convention des tags.
- Q3 puis choix final : décalage par `LDD` en `11-refactor` (choix de l'utilisateur, après les mesures). « L'implémentation Sedgewick »
  de l'utilisateur est la version par échanges de la 4e édition.
- Vigie en écart : les tags `insertion/*` sont locaux (0 sur le dépôt distant). Le push attend la revue.

## Gate

- `pnpm typecheck` sur `main` → vert.
- `pnpm test` à `insertion/15-guard` → vert, 15 tests sur 15.
- Tests à chaque tag (worktree du scratchpad) : les 5 `red` échouent sur leur nouveau test, les 10 autres tags passent.
- Vigies : 15 commits, 15 tags ; tags locaux ≠ tags distants (push en attente).
- Revue code-review : 0 violation de standard, 0 écart de spec ; 2 commentaires à trancher.

## État pour reprendre

- **Prochaine action :** demander à l'utilisateur s'il faut corriger les deux commentaires (test `09`, `ld c,0`) avant de pousser `insertion`.
- **Arbre :** propre · `insertion` locale, non poussée · `docs/session-insertion` porte ce rapport et le STATUS.
- **Pièges :**
  - Ne pas réécrire `intro` ni `selection`. `insertion` peut encore changer tant que ses tags ne sont pas poussés : après, plus jamais.
  - Le guard `14` (≤) n'attrape pas seul sa version cassée : `13` l'attrape aussi (le `jr z` coûte 2 NOPs). L'article doit le dire.
  - Réponse attendue de l'utilisateur : la question des deux commentaires, ci-dessus.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
