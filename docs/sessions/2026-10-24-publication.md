# Session — 2026-10-24 — publication

- **Branche :** `docs/article-intro-fr` (PR #2), `docs/madram-link` (PR #3), `docs/posts-move-to-blog` (PR #4), puis `docs/session-publication`
- **Objet :** écrire l'article d'introduction en français et en anglais, puis le publier sur un blog.

## Fait

- Tags `intro/01-red` à `intro/11-green` posés et poussés. Chacun revérifié dans un worktree : les `-red` échouent, les autres passent.
- Article d'introduction en français, puis en anglais (PR #2) :
  - mise en place de z80-tdd dans un projet, puis six parties qui suivent les tags ;
  - style de https://sikorama.fr/, revu d'après trois articles lus avec extraits : « on » et « nous », titres par sujet, conclusion et liens ;
  - coûts en NOPs vérifiés dans la table de Madram ; messages d'échec recopiés des vraies exécutions.
- Lien vers la table de Madram (PR #3).
- Dépôt passé public : aucun objet ne contient le nom du compte de travail ; les 17 liens des articles répondent 200 sans compte.
- Les articles vivent maintenant dans le dépôt `IIIvan37/blog` seulement (PR #4) : `articles/` a quitté ce dépôt.
- Côté `blog` (dépôt à part, PR #1 à #5 de ce dépôt) : Astro 7, routes `/fr/` et `/en/`, coloration Z80 par la grammaire de mborik,
  redirection de `/` selon la langue, flux RSS par langue, page 404. Site relié à Netlify par l'utilisateur.

## Non fait / reste

- Le tri qui suit l'introduction n'est pas choisi.
- Le blog n'a pas de fiche `session-report`.

## Décisions

- Les articles vivent dans `blog`, pas ici : option A de l'utilisateur, une correction = une PR. Voir [README.md](../../README.md).
- Pas d'anecdote inventée dans un article : l'ouverture part d'un fait que l'utilisateur donne.
- Style des articles et pièges Netlify : notes `z80-tdd-sorts` et `blog` du coffre.

## Gate

- `pnpm typecheck` sur `main` → vert.
- `pnpm test` à `intro/11-green` → vert, 6 tests sur 6.
- Vigies : 11 commits de `intro`, 11 tags ; tags locaux = tags distants.

## État pour reprendre

- **Prochaine action :** choisir le tri qui suit l'introduction, puis écrire sa liste de tests avant sa branche.
- **Arbre :** propre après le commit de ce rapport · `docs/session-publication` poussée, PR ouverte vers `main`.
- **Pièges :**
  - Ne jamais réécrire `intro` ni ses tags : l'article publié les cite.
  - Un nouvel article se rédige dans `blog` (`src/content/posts/<lang>/<slug>.md`), pas dans ce dépôt.
  - `gh` a un autre compte comme compte actif : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande `gh`.
