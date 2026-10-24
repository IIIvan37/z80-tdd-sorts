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

  // Runs find_min on `bytes`, written at ARRAY.
  function findMin(bytes: number[]) {
    return program.run("find_min", {
      registers: { hl: ARRAY, b: bytes.length },
      memory: [{ at: ARRAY, bytes }],
    });
  }

  it("returns the only byte of a one-byte array", () => {
    expect(findMin([0x42])).toHaveRegisters({ a: 0x42 });
  });

  it("returns the second byte when it is the smaller one", () => {
    expect(findMin([0x42, 0x17])).toHaveRegisters({ a: 0x17 });
  });

  it("returns the smallest byte wherever it is", () => {
    expect(findMin([0x42, 0x30, 0x05, 0x17, 0x99])).toHaveRegisters({ a: 0x05 });
  });

  it("returns in DE the address of the smallest byte", () => {
    expect(findMin([0x42, 0x30, 0x05, 0x17, 0x99])).toHaveRegisters({ de: ARRAY + 2 });
  });

  it("compares the bytes as unsigned numbers: #F0 is above #10", () => {
    expect(findMin([0x10, 0xf0])).toHaveRegisters({ a: 0x10 });
  });

  it("leaves the array as it found it", () => {
    expect(findMin([0x42, 0x30, 0x05, 0x17, 0x99])).toLeaveMemoryUnchanged();
  });

  it("finds the smallest of 16 bytes in 189 NOPs at most", () => {
    // Falling bytes make every turn of the loop take its slower path.
    const falling = Array.from({ length: 16 }, (_, i) => 0xff - i);

    // The address in DE costs 2 NOPs at entry and 1 NOP for each new minimum.
    expect(findMin(falling).nops).toBeLessThanOrEqual(189);
  });
});
