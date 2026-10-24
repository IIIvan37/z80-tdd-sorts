# Session — 2026-10-24 — radix-grilling

- **Branche :** `docs/session-radix-grilling`
- **Objet :** reprendre le grilling du radix sort au tour 1 et le mener jusqu'à un frontier vide.

## Fait

- Reprise depuis le STATUS. PR blog #11 vérifiée sur GitHub : `OPEN`, pas fusionnée. `origin/main` du blog s'arrête au merge de la PR #10.
  La PR fusionnée est la #14 de ce dépôt (rapport `session-tags`).
- Le rapport `tags` donnait le tour 1 du radix sans réponse. La note du coffre le donnait accepté. L'utilisateur confirme : accepté.
- Grilling du radix, tours 2 à 4, toutes les questions acceptées telles que proposées (voir « Décisions »).
- Synthèse du design donnée à l'utilisateur. Sa confirmation finale n'est pas encore venue.

## Non fait / reste

- Confirmation de la synthèse du design par l'utilisateur, puis branche `radix` et test 1.
- PR blog #11 (tags) à fusionner par l'utilisateur. Sa question Q3(1) reste sans réponse : tags sur la ligne de la date, ou sur une ligne à part ?
- Repris du rapport `tags`, toujours ouverts : `toLocaleDateString` et le fuseau (`timeZone: "UTC"`), tableau « Post | Code » du README du blog,
  citation de Knuth de l'article du tri à bulles.

## Décisions

Tour 1 (rappel) : clés de 16 bits sans signe, little-endian, LSD en base 256, deux passes, `counts` effacée au début de chaque passe,
branche `radix` issue de `main`, `src/radix-sort.asm`, `radix_sort`, tags `radix/NN-…`, code du comptage non repris.

- **Tour 2, contrat.** Q1 : B = nombre de clés, de 1 à 255. Q2 : DE = buffer de 2n octets donné par l'appelant, sans recouvrement, contenu libre.
  Q3 : tables dans le Program, chacune alignée par `align 256`, registres non conservés.
- **Tour 3, code.** Q1 : deux pages, `counts` (compteurs de 8 bits, puis octet faible des positions) et `slots_hi` (octet fort), `inc h` / `dec h`.
  Q2 : lecture vers l'avant, sommes de préfixes en adresses absolues de départ, avance de 2 par clé.
  Q3 : premier vert à deux copies de la boucle, puis refactor vers une passe interne `.pass` appelée deux fois.
  Q4 : tests dans cet ordre : une clé, octet faible, octet fort, stabilité de la passe 2 (`#0102, #0101`), bouts `#0000` et `#FFFF`,
  `toChangeOnly` (tableau, buffer, `counts`, `slots_hi`), budgets. Les tests 5 et 6 deviennent des `guard` s'ils sont verts d'emblée.
- **Tour 4, budgets et article.** Q1 : une formule an + b, pire entrée parmi égales, triées et inversées, à n = 2, 16 et 255.
  Q2 : budgets en `guard`, chacun avec son mutant plus lent. Q3 : effacement de `counts` par une boucle simple, sans `push` ni `DI`.
  La version par `push` va dans le rapport comme variante mesurée. Q4 : pas de radix sur le graphique des quatre tris d'octets.
  L'article compare en texte le radix et le comptage, par clé et par octet.
- Raison de Q4 du tour 4 : le graphique compare des tris d'octets, le radix trie des clés de 16 bits.
- Décisions reportées dans la note du coffre `z80-tdd-sorts`.

## Gate

- `pnpm typecheck` (sur `main`) → vert.
- `pnpm test` : aucune branche d'article touchée, non lancé.
- Vigies : aucune branche d'article touchée.

## État pour reprendre

- **Prochaine action :** faire confirmer la synthèse du design du radix, puis créer `radix` depuis `main` et écrire le test 1 (une clé).
- **Arbre :** propre · ce rapport sur `docs/session-radix-grilling`, issue de `main`.
- **Pièges :**
  - Coûts cités au tour 4 (boucle d'effacement environ 5 NOPs par case, `push` moins de la moitié) : à vérifier avec `z80-cpc-timing`.
  - Supposé sans question, d'après la convention : `radix` poussée puis figée sans PR, article dans une session à part,
    slug `tdd-cpc-radix-sort`, tags `z80`, `cpc`, `tdd` et `sorting`.
  - La stabilité de la passe 1 ne se voit pas sur le résultat : aucun test ne la vise.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
  - Tous les rapports datent du 2026-10-24 : prendre `git log -- docs/sessions` pour l'ordre.
