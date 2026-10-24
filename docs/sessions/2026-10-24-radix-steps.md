# Session — 2026-10-24 — radix-steps

- **Branche :** `radix` (code, poussée et figée), `docs/session-radix-grilling` (ce rapport, PR #15 ouverte)
- **Objet :** écrire les étapes TDD du radix, de `radix/03-red` au dernier budget, puis pousser la branche.

## Fait

- `radix/03-red` à `radix/10-guard` écrits et tagués, 8 tests verts à `10-guard`. La branche `radix` et ses 10 tags sont poussés sur `origin`.
  - `03-red` / `04-green` : octet faible, une passe vers le buffer, puis recopie par `LDIR`.
  - `05-red` / `06-green` : octet fort, deuxième copie de la passe, plus de `LDIR`.
  - `07-refactor` : une routine `.pass` appelée deux fois, clés en big-endian dans le buffer.
  - `08-guard` : `#FFFF` et `#0000`. Mutant : `.sums` s'arrête avant `#FF`, la clé `#FFFF` disparaît.
  - `09-guard` : écritures limitées au tableau, au buffer, à `counts` et à `slots_hi` (aide `changesOutside`).
    Mutant : le nombre de clés gardé dans une variable du Program (`#4013`).
  - `10-guard` : budget 122n + 13 406 NOPs sur clés égales, triées et inversées, à n = 2, 16 et 255. Mutant : le code de `06-green`.
- Chaque mutant de guard lancé : il casse son test seul, et aucun autre.
- Avant `07-refactor`, contrôle jetable sur 50 tableaux au hasard (1 à 255 clés) : vert, fichier supprimé.
- Mesures : `radix_sort` coûte 122n + 13 406 NOPs pour toute entrée, au hasard comprise. `06-green` coûte 124n + 13 400 NOPs.
- Note du coffre `z80-tdd-sorts` : décisions par tri déplacées dans `z80-tdd-sorts-tris` (note principale : 5,6 Ko).

## Non fait / reste

- Article FR et EN du radix dans `blog`, slug `tdd-cpc-radix-sort`, dans une session à part.
- PR #15 de ce dépôt à fusionner par l'utilisateur.
- Repris des rapports précédents : PR blog #11 (tags) et sa question Q3(1), `toLocaleDateString` et le fuseau,
  tableau « Post | Code » du README du blog, citation de Knuth de l'article du tri à bulles.

## Décisions

- Refactor `.pass` par clés inversées dans le buffer, choisi après grilling. Options écartées : code auto-modifié, macro RASM.
- Test de stabilité de la passe 2 retiré : le test 2 (`[#0142, #0117]`, même octet fort) la vérifie déjà depuis `06-green`.
  Le mutant qui lit la passe 2 à l'envers casse les deux tests. L'article explique ce changement de rôle du test 2.
- `toChangeOnly` de z80-tdd 0.1.0 prend une seule plage : le test filtre `run.memoryChanges` sur quatre plages.
- Budget unique : aucun branchement ne dépend des clés. Il remplace la « pire entrée » du tour 4.
- Le pourquoi de ces choix est dans la note du coffre `z80-tdd-sorts-tris` (pas d'ADR dans ce dépôt).

## Gate

- `pnpm typecheck` (sur `docs/session-radix-grilling`, même code que `main`) → vert.
- `pnpm test` à `radix/10-guard` → vert, 8 tests.
- Vigies : chaque commit de `radix` porte son tag (`01-red` à `10-guard`). Les 10 tags locaux égalent les tags distants.

## État pour reprendre

- **Prochaine action :** écrire l'article FR et EN du radix dans `blog` (`tdd-cpc-radix-sort`), depuis les tags `radix/*`.
- **Arbre :** propre · `radix` poussée et figée · ce rapport sur `docs/session-radix-grilling` (PR #15 ouverte).
- **Pièges :**
  - L'article compare en texte le radix et le comptage. Il ne met pas le radix sur le graphique des tris d'octets.
  - Avant de publier une décomposition du coût (effacement, sommes, par clé), la vérifier avec `z80-cpc-timing`.
  - Le message du guard `09` donne l'adresse en décimal (16403), pas en hexadécimal CPC.
  - Vitest 5 cache `console.log` : une mesure jetable écrit dans un fichier du scratchpad.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
  - Tous les rapports datent du 2026-10-24 : prendre `git log -- docs/sessions` pour l'ordre.
