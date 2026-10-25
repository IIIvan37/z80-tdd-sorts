import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its pointers and its strings: free RAM, away from the
// Program at #4000.
const ARRAY = 0x8000;
const STRINGS = 0x9000;

// The bytes of `text`: one per letter, bit 7 set on the last one, as the CPC firmware writes them.
function bytesOf(text: string) {
  return Array.from(text, (letter, i) => letter.charCodeAt(0) | (i === text.length - 1 ? 0x80 : 0));
}

describe("string_sort", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // Runs string_sort on pointers to `texts`. The strings follow one another
  // from STRINGS, and the array holds a little-endian pointer to each one.
  function runStringSort(texts: string[]) {
    const strings = texts.map(bytesOf);
    const pointers: number[] = [];
    let at = STRINGS;
    for (const bytes of strings) {
      pointers.push(at & 0xff, at >> 8);
      at += bytes.length;
    }

    return program.run("string_sort", {
      registers: { hl: ARRAY, b: texts.length },
      memory: [
        { at: ARRAY, bytes: pointers },
        { at: STRINGS, bytes: strings.flat() },
      ],
    });
  }

  it("leaves a one-pointer array as it is", () => {
    expect(runStringSort(["MODE"])).toLeaveMemoryUnchanged();
  });
});
