import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its array: free RAM, away from the Program at #4000.
const ARRAY = 0x8000;

describe("find_min", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  it("returns the only byte of a one-byte array", () => {
    const run = program.run("find_min", {
      registers: { hl: ARRAY, b: 1 },
      memory: [{ at: ARRAY, bytes: [0x42] }],
    });

    expect(run).toHaveRegisters({ a: 0x42 });
  });
});
