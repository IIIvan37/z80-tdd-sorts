# Session — 2026-10-24 — texte-bubble

- **Branche :** `docs/bubble-sort-post` du dépôt `blog` (PR blog #9), puis `docs/session-texte-bubble` ici
- **Objet :** écrire l'article FR et EN du tri à bulles, d'après les tags `bubble/*` et le rapport `bubble`.

## Fait

- Article FR et EN dans `blog`, slug `tdd-cpc-bubble-sort`, date `2026-10-24T20:00:00Z`, commit `723dede`, PR blog #9 ouverte.
  - Plan de l'article sur l'insertion : `01` à `08`, guard `09`, budget `10-red`, borne de Knuth en `11-green`, dix variantes, guards `12` et `13`.
  - Fin : les trois tris face à face, formules et n = 255. Citation de Knuth (TAOCP vol. 3, §5.2.2), écrite de mémoire.
- Mesures refaites dans un worktree du scratchpad, supprimé ensuite :
  - messages d'échec des tags `01`, `03`, `05`, `07`, `10` : ceux cités dans l'article ;
  - drapeau 3e reconstruit : `08-green` + `ld d,0` en début de passe, `ld d,1` après `ld (hl),a`, `dec d` / `ret nz` après `pop bc`.
    Il donne 38, 206, 3 074 NOPs, soit 12n + 14 ;
  - variantes 1e, 2e, 3e, 2+3e et 4e mesurées sur trié, égaux, inversé : les formules du rapport `bubble` sont justes ;
  - les quatre mutants des guards donnent les nombres du rapport ; borne décalée à n = 255 : 557 932 contre 555 626 ;
  - croisements sur l'entrée inversée : bulles < insertion jusqu'à 3 octets, égalité à 4 (163), bulles < sélection jusqu'à 7 (478 contre 485).
- Correction du rapport `bubble` : sans E, Knuth gagne de 2 à 4 octets inversés, pas seulement à 2 octets. E gagne à chaque variante dès n = 6.
- Revue `mattpocock-skills:code-review` du blog depuis `origin/main` :
  - standards : aucune violation du README du blog. Les blocs de code FR et EN sont identiques.
  - spec : rien ne manque. Chaque bloc correspond à son tag. Les comptes et les ratios sont justes.
  - corrigé : « environ 40 % », et les formules sont tirées des mesures, pas « données » par z80-tdd.

## Non fait / reste

- Fusion de la PR blog #9, et des PR #9, #10 et de ce rapport dans `z80-tdd-sorts`.
- Le tableau « Post | Code » du README du blog liste seulement `tdd-cpc-find-min` : les trois tris y manquent.
- Vérifier la citation de Knuth dans le livre.

## Décisions

- L'article ne promet pas d'article suivant : rien n'est décidé après les trois tris.
- « NOP limit » reste en anglais dans l'article FR : c'est le terme du `GLOSSARY.md` de z80-tdd.

## Gate

- `pnpm typecheck` (branche `docs/session-bubble`, code de `main`) → vert.
- `pnpm test` : aucune branche d'article touchée. À `bubble/13-guard`, seuls les mutants ont tourné, avec les échecs attendus.
- Vigies : 13 tags `bubble/*`, locaux = distants, `origin/bubble` = `bubble/13-guard`.
- Blog : `pnpm build` → vert, pages `/fr/tdd-cpc-bubble-sort/` et `/en/tdd-cpc-bubble-sort/` produites.

## État pour reprendre

- **Prochaine action :** Ivan relit et fusionne la PR blog #9, puis les PR de rapport de `z80-tdd-sorts`.
- **Arbre :** propre · `blog` sur `docs/bubble-sort-post`, poussée · ici, ce rapport sur `docs/session-texte-bubble`, issue de `docs/session-bubble` (PR #10).
- **Pièges :**
  - Ne réécrire aucune branche d'article : leurs tags sont publiés.
  - `~/.gitconfig` garde `ivan.duchaufforu@gmail.com` : commiter avec `git -c user.email=ivan.duchauffour@gmail.com`, aussi dans `blog`.
  - `gh` : passer `GH_TOKEN=$(gh auth token --user IIIvan37)` à chaque commande.
  - Vitest masque `console.log` : une mesure hors test écrit dans un fichier.
