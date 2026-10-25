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

  // Where each of `texts` starts: the strings follow one another from `strings`.
  function startsOf(texts: string[], strings: number) {
    let at = strings;
    return texts.map((text) => {
      const start = at;
      at += text.length;
      return start;
    });
  }

  // Runs string_sort on pointers to `texts`. The array at `array` holds a
  // little-endian pointer to each string.
  function runStringSort(texts: string[], array = ARRAY, strings = STRINGS) {
    return program.run("string_sort", {
      registers: { hl: array, b: texts.length },
      memory: [
        { at: array, bytes: startsOf(texts, strings).flatMap((at) => [at & 0xff, at >> 8]) },
        { at: strings, bytes: texts.flatMap(bytesOf) },
      ],
    });
  }

  // The texts that the little-endian pointers in `bytes` point to, in their
  // order. Each of `texts` starts where startsOf puts it.
  function textsOf(bytes: readonly number[], texts: string[], strings: number) {
    const starts = startsOf(texts, strings);
    return Array.from(
      { length: bytes.length / 2 },
      (_, i) => texts[starts.indexOf(bytes[2 * i] | (bytes[2 * i + 1] << 8))],
    );
  }

  // Runs string_sort on pointers to `texts`, and returns the texts in the order
  // of the pointers the array holds after the run.
  function sortStrings(texts: string[], array = ARRAY, strings = STRINGS) {
    const bytes = runStringSort(texts, array, strings).memory(array, 2 * texts.length);
    return textsOf(bytes, texts, strings);
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

  it("sorts five pointers in any order", () => {
    expect(sortStrings(["MOVE", "MERGE", "MOVER", "MEMORY", "MODE"])).toEqual([
      "MEMORY",
      "MERGE",
      "MODE",
      "MOVE",
      "MOVER",
    ]);
  });

  // The two strings are equal: only their addresses, #9000 then #9004, tell them apart.
  it("keeps two pointers to equal strings in their order", () => {
    expect(runStringSort(["MODE", "MODE"]).memory(ARRAY, 4)).toEqual([0x00, 0x90, 0x04, 0x90]);
  });

  // The array runs into the next page: from #80FC, the page ends between two
  // pointers, and from #80FD, inside one. MOVER also runs into the next page,
  // from #90FE. MOVER is the key against MODE, then MOVE is the key against
  // MOVER: each comparison reads past the end of the page, in one string and
  // then the other.
  it.each(["80FC", "80FD"])("sorts pointers and strings that cross a page, from #%s", (array) => {
    expect(sortStrings(["MODE", "MOVER", "MOVE", "MEMORY", "MERGE"], parseInt(array, 16), 0x90fa)).toEqual([
      "MEMORY",
      "MERGE",
      "MODE",
      "MOVE",
      "MOVER",
    ]);
  });

  it("ignores a pointer to a larger string right before the array", () => {
    // The pointer right before the array, at ARRAY, points to ZONE, which comes
    // after every string of the array: a shift past the first pointer would move
    // it. Fresh memory would hold #0000 there, a pointer to #00, which comes before
    // every string: no key would move past it.
    const texts = ["ZONE", "MOVE", "MERGE", "MOVER", "MEMORY", "MODE"];
    const run = program.run("string_sort", {
      registers: { hl: ARRAY + 2, b: 5 },
      memory: [
        { at: ARRAY, bytes: startsOf(texts, STRINGS).flatMap((at) => [at & 0xff, at >> 8]) },
        { at: STRINGS, bytes: texts.flatMap(bytesOf) },
      ],
    });

    expect(run).toChangeOnly({ address: ARRAY + 2, length: 10 });
    expect(textsOf(run.memory(ARRAY + 2, 10), texts, STRINGS)).toEqual([
      "MEMORY",
      "MERGE",
      "MODE",
      "MOVE",
      "MOVER",
    ]);
  });
});
