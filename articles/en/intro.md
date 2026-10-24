# TDD on the CPC: finding the smallest byte of an array

TDD is something I practise every day. In assembly, though, the practice is much rarer: we assemble, we run, we look at the screen, and we start again. Can it work on an Amstrad CPC, in Z80? To find out, we are going to write a dead simple Routine, one test at a time: find the smallest byte of an array. It is also the heart of selection sort, which will come in a later post.

TDD comes down to three beats. First red: we write a test, and it fails. Then green: we write the least code that makes it pass. Last, the refactor: we clean up, without breaking a single test.

The tests run under Vitest, with [z80-tdd](https://github.com/IIIvan37/z80-tdd): it assembles the source with RASM, runs the Routine on an emulated Z80, then checks the registers, the memory and the duration in NOPs. Each step of this post is a commit of the [z80-tdd-sorts](https://github.com/IIIvan37/z80-tdd-sorts) repository, with a tag of its own: one `git checkout intro/01-red`, one `pnpm test`, and we see exactly what I see.

The contract first: HL points at the array, B holds its length (1 to 255), and the Routine returns the smallest byte in A.

## Setting up

We need Node.js 24 or later, pnpm, and [RASM](https://github.com/EdouardBERGE/rasm/releases) v3.3.1 on the PATH. z80-tdd is not on npm: it installs from the tarball of its GitHub release, next to Vitest.

```sh
pnpm add -D https://github.com/IIIvan37/z80-tdd/releases/download/v0.1.0/z80-tdd-0.1.0.tgz vitest
```

At the root of the project, `z80-tdd.config.ts` says which source to assemble:

```ts
import { defineConfig } from "z80-tdd";

export default defineConfig({ source: "src/main.asm" });
```

That source is the project's real program, the one we assemble every day. Here it puts the code at `#4000` and includes the Routine under test:

```z80
 org #4000
 include "find-min.asm"
```

That leaves the test file, `src/find-min.test.ts`. `loadProgram()` runs RASM once for the whole file, then loads the program at its real addresses in 64 KB of memory. Each `program.run` starts from a fresh copy, so one test never leaks into the next.

```ts
import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers); // toHaveRegisters, toLeaveMemoryUnchanged…

describe("find_min", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // the tests go here
});
```

`pnpm vitest run` runs the lot. A Routine that never returns does not hang the tests: past one million NOPs, z80-tdd stops the Routine and prints the last instructions it executed.

## One byte, and already a cheat

The first test is as simple as it gets: a one-byte array ([intro/01-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/01-red)).

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

The test writes the byte at `#8000`, sets HL and B, runs the Routine, and looks at A. Of course, it fails:

```text
Error: The Program has no label "find_min"
```

Red, and for the right reason: the Routine does not exist. The least code that turns it green ([intro/02-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/02-green)):

```z80
find_min:
 ld a,(hl)
 ret
```

Yes, that is cheating. But the test passes, and that is all we ask of it.

## Two bytes to expose the cheat

To expose the cheat, we need a test it fails: two bytes, the smaller one second ([intro/03-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/03-red)).

```ts
expect(run).toHaveRegisters({ a: 0x17 }); // with bytes: [0x42, 0x17] and b: 2
```

```text
Error: Registers differ:
  A  expected #17, received #42
```

`toHaveRegisters` prints the registers in hexadecimal, CPC style: we read the failure at a glance. On to green, still without a loop ([intro/04-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/04-green)):

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

`cp (hl)` computes A − (HL) and throws the result away: the carry is set if A is the smaller one. One comparison is enough for two bytes. No more!

## The loop wins

Five bytes, the smallest in the middle ([intro/05-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/05-red)):

```ts
expect(run).toHaveRegisters({ a: 0x05 }); // with bytes: [0x42, 0x30, 0x05, 0x17, 0x99]
```

```text
  A  expected #05, received #30
```

This time there is no way around it ([intro/06-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/06-green)):

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

## Tests get refactored too

The code is fine, but the tests repeat themselves: three times the same call to `program.run`, give or take the length. Refactoring applies to tests too ([intro/07-refactor](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/07-refactor)):

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

B now comes from the length of the array: a test can no longer get the length wrong. Every test stays green.

## The lying sign, and the overwritten byte

The next two tests pass as soon as they are written. In TDD, a test that passes at once is suspicious: who says it can fail at all? So I tag them `guard`, and I check that each one catches a broken version of the Routine.

The first one checks the unsigned comparison ([intro/08-guard](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/08-guard)):

```ts
it("compares the bytes as unsigned numbers: #F0 is above #10", () => {
  expect(findMin([0x10, 0xf0])).toHaveRegisters({ a: 0x10 });
});
```

The classic mistake is to test the sign of the result with `jp m,.next` instead of the carry. With that version, `#10 − #F0` gives `#20`, positive, and the Routine keeps `#F0`. Bingo:

```text
  A  expected #10, received #F0
```

The second one checks that the Routine leaves the array alone ([intro/09-guard](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/09-guard)):

```ts
it("leaves the array as it found it", () => {
  expect(findMin([0x42, 0x30, 0x05, 0x17, 0x99])).toLeaveMemoryUnchanged();
});
```

One stray `ld (hl),a` after `.next`, and the test gives the address of every byte it overwrote:

```text
Error: Memory changed:
  #8003  #17 -> #05
  #8004  #99 -> #05
```

## A NOP budget

On the CPC, a correct Routine is not enough: it has to fit in time. z80-tdd counts the duration of each instruction in NOPs, from the table by Madram / Overlanders. So a test can set a budget ([intro/10-red](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/10-red)):

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

The count can be redone by hand. The entry costs 5 NOPs: `ld a,(hl)` 2, `dec b` 1, `ret z` 2 when it does not return. A turn where the minimum changes costs 12 NOPs: `inc hl` 2, `cp (hl)` 2, `jr c` 2 when it does not jump, `ld a,(hl)` 2, `djnz` 4. Fifteen turns, minus 1 NOP for the last `djnz`, plus 3 for the `ret`: 5 + 179 + 3 = 187.

To win 15 NOPs, nothing could be simpler: it is a great classic ([intro/11-green](https://github.com/IIIvan37/z80-tdd-sorts/tree/intro/11-green)):

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

`inc l` costs 1 NOP, `inc hl` costs 2: 1 NOP saved per turn, 172 in all. The price is written in the contract: the array must not cross a page boundary. All six tests stay green, budget included.

## Conclusion

Eleven steps for a Routine of nine instructions may look like a lot. But every test stays in the repository: if a future optimisation breaks the unsigned comparison, or blows the budget, we will know at once, with the faulty address or register. Selection sort can start from this Routine.

## Links

- [z80-tdd](https://github.com/IIIvan37/z80-tdd), the test tool, and its [0.1.0 release](https://github.com/IIIvan37/z80-tdd/releases/tag/v0.1.0)
- [z80-tdd-sorts](https://github.com/IIIvan37/z80-tdd-sorts), the repository of this post (branch `intro`)
- [RASM](https://github.com/EdouardBERGE/rasm), the assembler
- *Perfectly accurate Z80 flags and CPC timing*, Madram / Overlanders (64NOPS), the table of durations in NOPs
