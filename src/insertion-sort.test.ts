import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its array: free RAM, away from the Program at #4000.
const ARRAY = 0x8000;

describe("insertion_sort", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // Runs insertion_sort on `bytes`, written at ARRAY.
  function insertionSort(bytes: number[]) {
    return program.run("insertion_sort", {
      registers: { hl: ARRAY, b: bytes.length },
      memory: [{ at: ARRAY, bytes }],
    });
  }

  it("leaves a one-byte array as it is", () => {
    expect(insertionSort([0x42])).toLeaveMemoryUnchanged();
  });

  it("swaps two bytes in the wrong order", () => {
    expect(insertionSort([0x42, 0x17]).memory(ARRAY, 2)).toEqual([0x17, 0x42]);
  });

  it("moves the last byte to the front of a sorted run", () => {
    expect(insertionSort([0x17, 0x30, 0x42, 0x05]).memory(ARRAY, 4)).toEqual([
      0x05, 0x17, 0x30, 0x42,
    ]);
  });
});
