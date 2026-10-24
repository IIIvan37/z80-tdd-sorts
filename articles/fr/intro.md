# TDD sur CPC : trouver le plus petit octet d'un tableau

Écrire le test avant le code, en assembleur Z80, sur un Amstrad CPC. Ça paraît exotique, mais c'est exactement ce que je vous propose ici, avec une Routine toute bête : trouver le plus petit octet d'un tableau. C'est aussi le cœur du tri par sélection, qui viendra dans un prochain article.

Le principe du TDD tient en trois temps :

- **rouge** : on écrit un test, qui échoue ;
- **vert** : on écrit le moins de code possible pour qu'il passe ;
- **refactor** : on nettoie, sans casser un seul test.

Les tests tournent sous Vitest, avec [z80-tdd](https://github.com/IIIvan37/z80-tdd) : il assemble le source avec RASM, exécute la Routine sur un Z80 émulé, puis vérifie les registres, la mémoire et la durée en NOPs. Chaque étape de cet article est un commit du dépôt [z80-tdd-sorts](https://github.com/IIIvan37/z80-tdd-sorts), avec un tag à son nom : `git checkout intro/01-red`, puis `pnpm test`, et vous voyez ce que je vois.

Le contrat, d'abord : HL pointe sur le tableau, B contient sa longueur (de 1 à 255), et la Routine rend le plus petit octet dans A.

## Mise en place

Il vous faut Node.js 24 ou plus, pnpm, et [RASM](https://github.com/EdouardBERGE/rasm/releases) v3.3.1 dans le PATH. z80-tdd n'est pas sur npm : il s'installe depuis le tarball de sa release GitHub, à côté de Vitest.

```sh
pnpm add -D https://github.com/IIIvan37/z80-tdd/releases/download/v0.1.0/z80-tdd-0.1.0.tgz vitest
```

À la racine du projet, `z80-tdd.config.ts` dit quel source assembler :

```ts
import { defineConfig } from "z80-tdd";

export default defineConfig({ source: "src/main.asm" });
```

Ce source est le vrai programme du projet, celui que vous assemblez d'habitude. Ici, il place le code en `#4000` et inclut la Routine à tester :

```z80
 org #4000
 include "find-min.asm"
```

Reste le fichier de test, `src/find-min.test.ts`. `loadProgram()` lance RASM une fois pour tout le fichier, puis charge le programme à ses vraies adresses dans 64 Ko de mémoire. Chaque `program.run` repart d'une copie neuve, donc un test ne déteint pas sur le suivant.

```ts
import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers); // toHaveRegisters, toLeaveMemoryUnchanged…

describe("find_min", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // les tests viennent ici
});
```

`pnpm vitest run` lance le tout. Une Routine qui ne revient jamais ne bloque pas les tests : au-delà d'un million de NOPs, z80-tdd arrête la Routine et affiche les dernières instructions exécutées.

## Étape 1 : un seul octet

Le premier test est le plus simple possible : un tableau d'un octet ([intro/01-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/01-red)).

```ts
const ARRAY = 0x8000;

it("returns the only byte of a one-byte array", () => {
  const run = program.run("find_min", {
    registers: { hl: ARRAY, b: 1 },
    memory: [{ at: ARRAY, bytes: [0x42] }],
  });

  expect(run).toHaveRegisters({ a: 0x42 });
});
```

Le test écrit l'octet en `#8000`, place HL et B, lance la Routine, et regarde A. Évidemment, il échoue :

```text
Error: The Program has no label "find_min"
```

Rouge, et pour la bonne raison : la Routine n'existe pas. Le moins de code possible pour passer au vert ([intro/02-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/02-green)) :

```z80
find_min:
 ld a,(hl)
 ret
```

Oui, c'est de la triche. Mais le test passe, et c'est tout ce qu'on lui demande.

## Étape 2 : deux octets

Pour démasquer la triche, il faut un test qui la met en défaut : deux octets, le plus petit en second ([intro/03-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/03-red)).

```ts
expect(run).toHaveRegisters({ a: 0x17 }); // avec bytes: [0x42, 0x17] et b: 2
```

```text
Error: Registers differ:
  A  expected #17, received #42
```

`toHaveRegisters` affiche les registres en hexadécimal, à la mode CPC : on lit l'échec d'un coup d'œil. Passons au vert, toujours sans boucle ([intro/04-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/04-green)) :

```z80
find_min:
 ld a,(hl)
 dec b
 ret z
 inc hl
 cp (hl)
 ret c          ; A is below the second byte
 ld a,(hl)
 ret
```

`cp (hl)` calcule A − (HL) sans garder le résultat : la retenue est mise si A est plus petit. Une seule comparaison suffit pour deux octets. Pas plus.

## Étape 3 : la boucle

Cinq octets, le plus petit au milieu ([intro/05-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/05-red)) :

```ts
expect(run).toHaveRegisters({ a: 0x05 }); // avec bytes: [0x42, 0x30, 0x05, 0x17, 0x99]
```

```text
  A  expected #05, received #30
```

Cette fois, la boucle s'impose ([intro/06-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/06-green)) :

```z80
find_min:
 ld a,(hl)
 dec b
 ret z
.loop:
 inc hl
 cp (hl)
 jr c,.next     ; A is below this byte
 ld a,(hl)
.next:
 djnz .loop
 ret
```

## Étape 4 : le refactor

Le code va bien, mais les tests se répètent : trois fois le même appel à `program.run`, à la longueur près. Le refactor s'applique aussi aux tests ([intro/07-refactor](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/07-refactor)) :

```ts
function findMin(bytes: number[]) {
  return program.run("find_min", {
    registers: { hl: ARRAY, b: bytes.length },
    memory: [{ at: ARRAY, bytes }],
  });
}

it("returns the smallest byte wherever it is", () => {
  expect(findMin([0x42, 0x30, 0x05, 0x17, 0x99])).toHaveRegisters({ a: 0x05 });
});
```

B vient maintenant de la longueur du tableau : un test ne peut plus se tromper de longueur. Tous les tests restent verts.

## Étape 5 : deux tests de garde

Les deux tests suivants passent dès leur écriture. En TDD, un test qui passe d'emblée est suspect : rien ne prouve qu'il sait échouer. Je les tague donc `guard`, et je vérifie qu'ils attrapent une version cassée de la Routine.

Le premier vérifie la comparaison sans signe ([intro/08-guard](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/08-guard)) :

```ts
it("compares the bytes as unsigned numbers: #F0 is above #10", () => {
  expect(findMin([0x10, 0xf0])).toHaveRegisters({ a: 0x10 });
});
```

L'erreur classique, c'est de tester le signe du résultat avec `jp m,.next` au lieu de la retenue. Avec cette version, `#10 − #F0` donne `#20`, positif, et la Routine garde `#F0` :

```text
  A  expected #10, received #F0
```

Le second vérifie que la Routine ne touche pas au tableau ([intro/09-guard](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/09-guard)) :

```ts
it("leaves the array as it found it", () => {
  expect(findMin([0x42, 0x30, 0x05, 0x17, 0x99])).toLeaveMemoryUnchanged();
});
```

Un `ld (hl),a` égaré après `.next`, et le test donne l'adresse de chaque octet écrasé :

```text
Error: Memory changed:
  #8003  #17 -> #05
  #8004  #99 -> #05
```

## Étape 6 : un budget en NOPs

Sur CPC, une Routine juste ne suffit pas : il faut qu'elle tienne dans le temps. z80-tdd compte la durée de chaque instruction en NOPs, d'après la table de Madram / Overlanders (*Perfectly accurate Z80 flags and CPC timing*, 64NOPS). Un test peut donc fixer un budget ([intro/10-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/10-red)) :

```ts
it("finds the smallest of 16 bytes in 172 NOPs at most", () => {
  // Falling bytes make every turn of the loop take its slower path.
  const falling = Array.from({ length: 16 }, (_, i) => 0xff - i);

  expect(findMin(falling).nops).toBeLessThanOrEqual(172);
});
```

```text
AssertionError: expected 187 to be less than or equal to 172
```

Le compte se refait à la main. L'entrée coûte 5 NOPs : `ld a,(hl)` 2, `dec b` 1, `ret z` 2 quand il ne sort pas. Un tour où le minimum change coûte 12 NOPs : `inc hl` 2, `cp (hl)` 2, `jr c` 2 quand il ne saute pas, `ld a,(hl)` 2, `djnz` 4. Quinze tours, moins 1 NOP pour le dernier `djnz`, plus 3 pour le `ret` : 5 + 179 + 3 = 187.

Pour gagner 15 NOPs, un grand classique ([intro/11-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/11-green)) :

```z80
; Returns in A the smallest byte of the array at HL, B bytes long (1 to 255).
; The array stays within one 256-byte page: the loop moves HL with INC L.
find_min:
 ld a,(hl)
 dec b
 ret z
.loop:
 inc l
 cp (hl)
 jr c,.next     ; A is below this byte
 ld a,(hl)
.next:
 djnz .loop
 ret
```

`inc l` coûte 1 NOP, `inc hl` en coûte 2 : 1 NOP de gagné par tour, 172 au total. Le prix à payer est écrit dans le contrat : le tableau ne doit pas franchir une frontière de page. Les six tests restent verts, budget compris.
