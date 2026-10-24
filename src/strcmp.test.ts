import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its two strings: free RAM, away from the Program at #4000.
const STRING_A = 0x8000;
const STRING_B = 0x8100;

// The bytes of `text`: one per letter, bit 7 set on the last one, as the CPC firmware writes them.
function bytesOf(text: string) {
  return Array.from(text, (letter, i) => letter.charCodeAt(0) | (i === text.length - 1 ? 0x80 : 0));
}

describe("strcmp", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // Runs strcmp on `a` and `b`. The Run starts with Z and C both set, which no
  // CP leaves.
  function runStrcmp(a: string, b: string) {
    return program.run("strcmp", {
      registers: { hl: STRING_A, de: STRING_B },
      flags: { z: true, c: true },
      memory: [
        { at: STRING_A, bytes: bytesOf(a) },
        { at: STRING_B, bytes: bytesOf(b) },
      ],
    });
  }

  // Reads the answer of strcmp in the flags, as after CP: a Routine that keeps
  // the flags as they are gives "unchanged", never a valid answer.
  function compare(a: string, b: string) {
    const { z, c } = runStrcmp(a, b).flags;

    if (z && c) return "unchanged";
    if (z) return "=";
    return c ? "<" : ">";
  }

  it("finds two equal one-letter strings equal", () => {
    expect(compare("A", "A")).toBe("=");
  });

  it("orders two one-letter strings by their letter", () => {
    expect(compare("A", "B")).toBe("<");
    expect(compare("B", "A")).toBe(">");
  });

  it("orders two strings by their first different letter", () => {
    expect(compare("AB", "AC")).toBe("<");
    expect(compare("AC", "AB")).toBe(">");
  });

  // "A" is #C1 and "AB" is #41 #C2: the first bytes differ by bit 7 alone.
  it("puts a string before a longer string that starts with it", () => {
    expect(compare("A", "AB")).toBe("<");
    expect(compare("AB", "A")).toBe(">");
  });

  // "A" is #C1 and "BC" is #42 #C3: bit 7 of #C1 must not make "A" larger than "B".
  it("compares the last letter of a string without its end mark", () => {
    expect(compare("A", "BC")).toBe("<");
    expect(compare("BC", "A")).toBe(">");
  });
});
