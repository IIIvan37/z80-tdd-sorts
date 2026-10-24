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

  it("sorts five bytes in any order", () => {
    expect(insertionSort([0x42, 0x30, 0x05, 0x17, 0x99]).memory(ARRAY, 5)).toEqual([
      0x05, 0x17, 0x30, 0x42, 0x99,
    ]);
  });

  it("ignores a larger byte right before the array", () => {
    // Fresh memory holds #00 next to ARRAY. The array starts one byte into the
    // page, after the #FF, so a step back by DEC L or DEC HL reads the #FF.
    const run = program.run("insertion_sort", {
      registers: { hl: ARRAY + 1, b: 5 },
      memory: [{ at: ARRAY, bytes: [0xff, 0x42, 0x30, 0x05, 0x17, 0x99] }],
    });

    expect(run).toChangeOnly({ address: ARRAY + 1, length: 5 });
    expect(run.memory(ARRAY + 1, 5)).toEqual([0x05, 0x17, 0x30, 0x42, 0x99]);
  });

  it("ignores a smaller byte right after the array", () => {
    // Fresh memory already holds #00 there: this test says so out loud.
    const run = program.run("insertion_sort", {
      registers: { hl: ARRAY, b: 5 },
      memory: [{ at: ARRAY, bytes: [0x42, 0x30, 0x05, 0x17, 0x99, 0x00] }],
    });

    expect(run).toChangeOnly({ address: ARRAY, length: 5 });
    expect(run.memory(ARRAY, 5)).toEqual([0x05, 0x17, 0x30, 0x42, 0x99]);
  });

  // Sorted bytes are the fastest input: each key stops at the byte before it.
  it.each([2, 16, 255])("sorts %i sorted bytes in 33n − 26 NOPs at most", (n) => {
    const sorted = Array.from({ length: n }, (_, i) => i);

    expect(insertionSort(sorted).nops).toBeLessThanOrEqual(33 * n - 26);
  });

  // A key never moves past a byte equal to it.
  it.each([2, 16, 255])("sorts %i equal bytes in 33n − 26 NOPs at most", (n) => {
    const equal = Array.from({ length: n }, () => 0x42);

    expect(insertionSort(equal).nops).toBeLessThanOrEqual(33 * n - 26);
  });

  // Reversed bytes are the slowest input: each key moves past the whole sorted run.
  it.each([2, 16, 255])("sorts %i reversed bytes in 6n² + 22n − 21 NOPs at most", (n) => {
    const reversed = Array.from({ length: n }, (_, i) => n - 1 - i);

    expect(insertionSort(reversed).nops).toBeLessThanOrEqual(6 * n * n + 22 * n - 21);
  });
});
