# Session — 2026-10-24 — radix-start

- **Branche :** `radix` (code), `docs/session-radix-grilling` (ce rapport, PR #15 ouverte)
- **Objet :** faire confirmer la synthèse du design du radix, puis ouvrir la branche `radix` et écrire les premières étapes TDD.

## Fait

- Synthèse du design du radix donnée à l'utilisateur, confirmée par lui (« oui »).
- Branche `radix` créée depuis `main` (`a9e81b5`), sans suivi distant.
- `radix/01-red` (`484ae06`) : `src/radix-sort.test.ts`, test « leaves a one-key array as it is » sur la clé `#1234`.
  Échec attendu : `The Program has no label "radix_sort"`.
- `radix/02-green` (`7dda5f3`) : `src/radix-sort.asm` avec `radix_sort: ret`, `include` dans `src/main.asm`. 1 test vert.
- Rapport ajouté à la PR #15, toujours ouverte, pour garder un seul STATUS en cours de revue.

## Non fait / reste

- `radix/03-red` : tri de deux clés par l'octet faible, proposé, pas encore accepté par l'utilisateur.
- Branche `radix` et ses tags non poussés.
- PR #15 de ce dépôt à fusionner par l'utilisateur.
- Repris des rapports précédents : PR blog #11 (tags) et sa question Q3(1), `toLocaleDateString` et le fuseau,
  tableau « Post | Code » du README du blog, citation de Knuth de l'article du tri à bulles.

## Décisions

- Test 1 du radix : il relit la clé par `memory(ARRAY, 2)`, pas par `toLeaveMemoryUnchanged` comme le test 1 du comptage.
  Raison : le vrai `radix_sort` écrit dans le buffer, `counts` et `slots_hi`, même pour une clé. Le test 6 (`toChangeOnly`) borne ces écritures.
- Mémoire des tests : `ARRAY = #8000`, `BUFFER = #8200`, 512 octets d'écart, la place de 255 clés.
  Aides `radixSort` (écrit les clés en little-endian) et `keysAfter` (relit les clés de 16 bits).
- Proposition pour `03-red`, en attente : `[0x0142, 0x0117]` → `[0x0117, 0x0142]`. L'octet fort vaut `#01`, pas `#00`,
  pour qu'un tri des seuls octets faibles ne passe pas par hasard.
- Vigie en écart, reprise en attente : les tags `radix/01-red` et `radix/02-green` sont locaux, pas sur `origin`.
  La convention pousse la branche à la fin, puis la fige.

## Gate

- `pnpm typecheck` (sur `docs/session-radix-grilling`, même code que `main`) → vert.
- `pnpm test` à `radix/02-green` → vert, 1 test.
- Vigies : chaque commit de `radix` porte son tag (`01-red`, `02-green`). Tags distants : aucun `radix/*` (voir « Décisions »).

## État pour reprendre

- **Prochaine action :** faire accepter le test `radix/03-red` (deux clés, octet faible), puis l'écrire sur `radix`.
- **Arbre :** propre · `radix` locale à `radix/02-green` · ce rapport sur `docs/session-radix-grilling` (PR #15 ouverte).
- **Pièges :**
  - Coûts cités au tour 4 (effacement environ 5 NOPs par case, `push` moins de la moitié) : à vérifier avec `z80-cpc-timing`.
  - La stabilité de la passe 1 ne se voit pas sur le résultat : aucun test ne la vise.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
  - Tous les rapports datent du 2026-10-24 : prendre `git log -- docs/sessions` pour l'ordre.
