import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its array: free RAM, away from the Program at #4000.
const ARRAY = 0x8000;

describe("bubble_sort", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // Runs bubble_sort on `bytes`, written at ARRAY.
  function bubbleSort(bytes: number[]) {
    return program.run("bubble_sort", {
      registers: { hl: ARRAY, b: bytes.length },
      memory: [{ at: ARRAY, bytes }],
    });
  }

  it("leaves a one-byte array as it is", () => {
    expect(bubbleSort([0x42])).toLeaveMemoryUnchanged();
  });
});
