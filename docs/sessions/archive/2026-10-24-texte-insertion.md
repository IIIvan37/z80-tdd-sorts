# Session — 2026-10-24 — texte-insertion

- **Branche :** `docs/insertion-sort-post` dans `blog`, puis `docs/session-insertion-push` ici
- **Objet :** écrire l'article FR et EN du tri par insertion dans le dépôt `blog`.

## Fait

- Article `tdd-cpc-insertion-sort` en français et en anglais, dans `blog` : PR blog #8 fusionnée, article en ligne.
  - Il suit les 15 tags `insertion/*`. Il compare quatre versions (compteur E, sentinelle, échanges, `LDD`) et oppose sélection et insertion.
  - Plan : principe, étapes 01 à 10, « Le mur avant le tableau » (piège de `#8000`), quatre versions, guards 12 à 15, duel, conclusion, liens.
- Mutants relancés dans un worktree à `insertion/15-guard` (supprimé ensuite). Faits nouveaux, cités par l'article :
  - la sentinelle échoue aussi au guard 15 (1 991 > 1 867 à n = 16) ;
  - la version en ≤ prend 428 124 NOPs sur 255 octets égaux ;
  - sans `dec b`, avec `#FF` après le tableau, la version cassée passe les 4 tests de tri (test de vérification).
- Revue `code-review` (spec et standards) du diff de `blog`. `simplify` sauté : docs seules.
  - Spec : un constat corrigé. À `09-red`, c'est la clé `#30` qui pousse le `#FF`, pas `#05`.
  - Standards : 0 écart à une règle écrite. Deux sorties du guard 15 étiquetées, « measurements » en anglais.

## Non fait / reste

- Tri à bulles : sa branche et ses tags, puis son article.
- Trois points de style laissés à l'utilisateur : quatre questions rhétoriques (ses notes en prévoient une),
  titres imagés (« La dernière carte », « Le mur avant le tableau »), ouverture sur l'article précédent et pas sur un fait vécu.
- Le tableau des articles du `README` de `blog` ne liste que `tdd-cpc-find-min`. Changement à proposer à part.

## Décisions

- La raison du choix de `LDD` écrite dans l'article (« elle gagne le pire cas ») est une formulation de l'agent, montrée à l'utilisateur, non contestée.
- En anglais, les grands nombres prennent une espace (`395 739`), comme l'article anglais sur la sélection.

## Gate

- `pnpm typecheck` (branche `docs/session-insertion-push`, même code que `main`) → vert.
- `pnpm test` à `insertion/15-guard` (worktree) → vert, 15 tests sur 15.
- `pnpm build` dans `blog` → vert.
- Vigies : chaque commit de `main..insertion` porte son tag. Tags locaux = tags distants (15, mêmes hashes).

## État pour reprendre

- **Prochaine action :** pousser `docs/session-insertion-push` (ce rapport et le STATUS) pour mettre à jour la PR #9 : accord de l'utilisateur attendu.
- **Arbre :** ce rapport et le STATUS commités sur `docs/session-insertion-push`, pas poussés · PR #9 ouverte.
- **Pièges :**
  - Ne réécrire ni `intro`, ni `selection`, ni `insertion` : leurs tags sont publiés.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
  - Sous zsh, `$t:s` est un modificateur : écrire `${t}:src/…` dans un `git show`.
