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

  it("returns the second byte when it is the smaller one", () => {
    const run = program.run("find_min", {
      registers: { hl: ARRAY, b: 2 },
      memory: [{ at: ARRAY, bytes: [0x42, 0x17] }],
    });

    expect(run).toHaveRegisters({ a: 0x17 });
  });

  it("returns the smallest byte wherever it is", () => {
    const run = program.run("find_min", {
      registers: { hl: ARRAY, b: 5 },
      memory: [{ at: ARRAY, bytes: [0x42, 0x30, 0x05, 0x17, 0x99] }],
    });

    expect(run).toHaveRegisters({ a: 0x05 });
  });
});
