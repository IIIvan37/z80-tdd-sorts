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

  // Where each of `texts` starts: the strings follow one another from STRINGS.
  function startsOf(texts: string[]) {
    let at = STRINGS;
    return texts.map((text) => {
      const start = at;
      at += text.length;
      return start;
    });
  }

  // Runs string_sort on pointers to `texts`. The array holds a little-endian
  // pointer to each string.
  function runStringSort(texts: string[]) {
    return program.run("string_sort", {
      registers: { hl: ARRAY, b: texts.length },
      memory: [
        { at: ARRAY, bytes: startsOf(texts).flatMap((at) => [at & 0xff, at >> 8]) },
        { at: STRINGS, bytes: texts.flatMap(bytesOf) },
      ],
    });
  }

  // Runs string_sort on pointers to `texts`, and returns the texts in the order
  // of the pointers the array holds after the run.
  function sortStrings(texts: string[]) {
    const starts = startsOf(texts);
    const bytes = runStringSort(texts).memory(ARRAY, 2 * texts.length);
    return texts.map((_, i) => texts[starts.indexOf(bytes[2 * i] | (bytes[2 * i + 1] << 8))]);
  }

  it("leaves a one-pointer array as it is", () => {
    expect(runStringSort(["MODE"])).toLeaveMemoryUnchanged();
  });

  it("swaps two pointers in the wrong order", () => {
    expect(sortStrings(["MOVE", "MODE"])).toEqual(["MODE", "MOVE"]);
  });

  it("moves the last pointer to the front of a sorted run", () => {
    expect(sortStrings(["MERGE", "MODE", "MOVE", "MEMORY"])).toEqual([
      "MEMORY",
      "MERGE",
      "MODE",
      "MOVE",
    ]);
  });
});
