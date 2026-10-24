# Session — 2026-10-24 — texte-radix

- **Branche :** `docs/radix-sort-post` dans `blog` (PR blog #12, fusionnée), `docs/session-texte-radix` ici (ce rapport)
- **Objet :** écrire l'article FR et EN du radix dans `blog` (`tdd-cpc-radix-sort`), depuis les tags `radix/*`.

## Fait

- Article FR et EN `tdd-cpc-radix-sort`, environ 3 500 mots chacun : principe LSD, comptage stable, étapes `01-red` à `10-guard`,
  compte à la main, comparaison du radix et du comptage en texte, sans graphique.
- Sorties relancées dans un worktree jetable : les trois étapes rouges et les mutants des guards 08, 09 et 10, chacun à son tag.
  - Mutant 08 : `.sums` s'arrête à L = `#FF`. La clé `#FFFF` part à `#0001` (vérifié par `memoryChanges`).
  - Mutant 09 : le nombre de clés dans une variable `.keys` du Program, à `#4013` (16403).
  - Mutant 10 : le code de `06-green` passe le budget à n = 2 (13 648 ≤ 13 650), tombe à 16 et 255.
- Coûts vérifiés avec la table de Madram : 61 NOPs par clé et par passe (comptage 14, déplacement 47), effacement 1 535,
  sommes 5 119 et reste 32 par passe, 34 autour des deux appels. Total 122n + 13 406.
- Le refactor `07-refactor` et `06-green` coûtent autant à 3 clés : +1 NOP par clé en passe 1, −3 en passe 2, +6 en fixe.
- Revue `code-review` sur deux axes : aucune violation. Deux corrections appliquées (commit `0ca5ad9`) :
  la passe 2 lue à l'envers casse le test des octets faibles seul, et « les deux tables du tri » au lieu de « ses deux tables ».
- PR blog #12 ouverte, puis fusionnée par l'utilisateur.

## Non fait / reste

- PR blog #11 (tags) ouverte, avec sa question Q3(1) : tags sur la ligne de la date, ou sur une ligne à part.
- Repris des rapports précédents : `toLocaleDateString` et le fuseau, tableau « Post | Code » du README du blog,
  citation de Knuth de l'article du tri à bulles.
- Le prochain article de la série n'est pas choisi.

## Décisions

- L'article porte `tags: [z80, cpc, tdd, sorting]` alors que la PR #11 n'est pas fusionnée : le schéma de `main` ignore le champ,
  et celui de la PR #11 l'exige. Le build passe avant et après la fusion.
- Ivan garde les quatre questions rhétoriques de l'article (style de la série, note du coffre `z80-tdd-sorts`).
- La phrase du mutant de stabilité est réduite au test des octets faibles : une passe 2 lue à l'envers, juste par ailleurs,
  trie quand même `[#0201, #0102]`. Le rapport `radix-steps` dit que le mutant de cette session cassait les deux tests.

## Gate

- `pnpm typecheck` sur `docs/session-texte-radix` (même code que `main`) → vert.
- Aucune branche d'article touchée : `radix` reste à `radix/10-guard`, lue seulement.
- `pnpm build` du blog sur `docs/radix-sort-post` → vert, deux pages `tdd-cpc-radix-sort`.
- Vigies : les 10 tags `radix/*` locaux égalent les tags distants.

## État pour reprendre

- **Prochaine action :** trancher la question Q3(1) de la PR blog #11 (tags), puis fusionner cette PR.
- **Arbre :** propre · `blog` : `docs/radix-sort-post` fusionnée · ce rapport sur `docs/session-texte-radix`.
- **Pièges :**
  - Une fois la PR #11 fusionnée, chaque nouvel article doit porter `tags` : le schéma exige au moins un tag.
  - Tous les rapports datent du 2026-10-24 : prendre `git log -- docs/sessions` pour l'ordre.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
