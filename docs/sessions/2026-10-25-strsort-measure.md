# Session — 2026-10-25 — strsort-measure

- **Branche :** `strsort` (code, locale, non poussée) · `docs/session-strsort-measure` (ce rapport, issue de `docs/session-strsort-steps`)
- **Objet :** mesurer les plans de registres du tri de pointeurs, faire le tour 4 du grilling, puis écrire les guards qu'il fixe.

## Fait

- Mesure de 8 variantes dans un worktree jetable à `strsort/13-guard`. Aucun commit sur `strsort` pendant la mesure.
  NOPs pour n = 32 ; k = 0 sauf « préfixe » (ordre inversé, préfixe commun de 16 lettres) :

  | Variante | Octets | Triée | Inversée | Égales | Préfixe | Par décalage | Par passe |
  |---|---|---|---|---|---|---|---|
  | pile, copie (`13-guard`) | 51 | 2 797 | 40 338 | 4 037 | 151 442 | 79 | 90 |
  | pile, 2 `LDD` | 52 | 2 797 | 41 826 | 4 037 | 152 930 | 82 | 90 |
  | IY, copie | 61 | 2 952 | 39 098 | 4 192 | 150 202 | 76 | 95 |
  | IY, 2 `LDD` | 60 | 2 952 | 37 114 | 4 192 | 148 218 | 72 | 95 |
  | IY, 2 `LDD`, IY sur la pile | 64 | 2 961 | 37 123 | 4 201 | 148 227 | 72 | 95 |
  | IY, 2 `LDD`, entrée `strcmp.loop` | 59 | 2 890 | 36 122 | 4 130 | 147 226 | 70 | 93 |
  | code modifié (`ld hl,nn`), copie | 58 | 2 983 | 37 734 | 4 223 | 148 838 | 73 | 96 |
  | code modifié (`ld hl,nn`), 2 `LDD` | 57 | 2 983 | 35 750 | 4 223 | 146 854 | 69 | 96 |

  Les deux variantes à code modifié échouent aux deux tests `toChangeOnly`, car elles écrivent dans le Program.
  Les 6 autres passent les 29 tests. `ld l,iyl` n'existe pas : la clé passe par `ld e,iyl` / `ld d,iyh`, puis `ex de,hl`.
- Modèle de coût exact de `13-guard` : 7 + 37(n − 1) + Σ décalages (59 + c) + Σ arrêts (33 + c), c = coût de `strcmp`. n = 1 sort du modèle.
- Tour 4 du grilling (Q1 à Q7), accepté par Ivan. Note du coffre `z80-tdd-sorts-tris`.
- Étapes sur `strsort`, chacune validée par Ivan, chaque budget à sa borne exacte (un mutant à +1 NOP échoue) :
  1. `14-guard` (`a12fb1a`) : IX et IY ne changent pas ; commentaire de contrat en tête de `string-sort.asm`. Mutant : IY, copie.
  2. `15-guard` (`d4b3c8c`) : triée, (n − 1)(90 + 14k) + 7, helper `withPrefix(n, k)`. Mutant : IY, copie.
  3. `16-guard` (`389acd9`) : inversée, n(n − 1)/2 · (79 + 14k) + 37(n − 1) + 7, `nopLimit: 2_000_000`.
     `runStringSort` prend `options: Pick<RunOptions, "registers" | "nopLimit">`. Mutant : pile, 2 `LDD`.
  4. `17-guard` (`f1aa0ea`) : égales, (n − 1)(74 + 14L) + 7. Mutant : `nop` avant le `ret` des chaînes égales de `strcmp`.
- Revue code-review de `strcmp/15-guard..strsort` :
  - Spec : aucun défaut. Les 18 Runs de budget tombent exactement sur leurs formules.
  - Standards : aucune violation dure. Sept remarques, listées dans « État pour reprendre ».

## Non fait / reste

- Corriger les remarques de la revue (choix d'Ivan attendu), puis `simplify`, push de `strsort` et de ses tags, article `tdd-cpc-string-sort`.

## Décisions

- Tour 4 : la version de `13-guard` reste, sans refactor ; contrat de sortie ; budgets exacts en n et k (ou L). Note du coffre `z80-tdd-sorts-tris`.
- Mutant de `17-guard` : `nop` au lieu du `or a` de la Q5, car `or a` change Z et donc le résultat de `strcmp`.

## Gate

- `pnpm typecheck` sur `main` (worktree) → vert
- `pnpm test` à `strsort/17-guard` → vert, 48 tests
- Vigies : chaque commit de `strcmp/15-guard..strsort` porte un tag `strsort/*` · aucun tag `strsort/*` distant (branche non poussée)

## État pour reprendre

- **Prochaine action :** obtenir la réponse d'Ivan à la question ci-dessous, puis corriger les remarques de la revue.
- **Question posée à Ivan, sans réponse :** reconstruire `strsort` depuis `11-red` pour les remarques 1 à 4 (tags déplacés),
  puis passer `simplify` sur les remarques 5 à 7 dans un commit de fin ? L'autre option est un seul commit `refactor` après `17-guard`.
  Remarques Standards :
  1. `13-guard`, commentaire faux : « string_sort must not write past the page there either ». Le tri écrit au-delà de la page ;
     le défaut attrapé est un `inc l` qui revient au début de la page.
  2. `11-red`, commentaire confus sur #0000 en mémoire vierge et `ZONE` ; « which points to ZONE » a deux lectures.
  3. `ex de,hl` de `string-sort.asm` sans commentaire. Proposition : « HL: the key (S1), DE: this string (S2) ».
  4. C sert de registre de travail dans `.shift` (`ld c,(hl)`) : le commentaire « C: the pointers of the sorted run » ne le dit pas.
  5. Ligne 198 du test à 130 caractères ; maximum des fichiers voisins : 108.
  6. Les deux tests « ignores… » recopient `runStringSort` ; encodage des pointeurs écrit 3 fois ; `(texts, array, strings)` positionnels.
  7. `withPrefix` au milieu des tests ; en-tête « AF, BC… » contre « A, HL and DE change » dans `strcmp`.
- **Arbre :** `strsort` propre, à `strsort/17-guard`, locale, non poussée · PR #17 à #21 ouvertes, empilées ; ce rapport s'empile sur #21.
- **Pièges :**
  - Tant que `strsort` n'est pas poussée, une correction se fait par reconstruction et nouveau tag.
  - Les scripts de mesure (`gen.py`, `measure.test.ts`, `run.sh`) sont dans le scratchpad de la session, qui peut disparaître.
    Le tableau ci-dessus garde les résultats.
  - `rasm -v` affiche v3.0.8 sur ce Mac, le README demande v3.3.1. Les tests passent. Écart non traité.
