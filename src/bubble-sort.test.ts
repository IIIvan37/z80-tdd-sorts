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

  it("swaps two bytes in the wrong order", () => {
    expect(bubbleSort([0x42, 0x17]).memory(ARRAY, 2)).toEqual([0x17, 0x42]);
  });

  it("moves the first byte to the end of a sorted run", () => {
    expect(bubbleSort([0x42, 0x05, 0x17, 0x30]).memory(ARRAY, 4)).toEqual([
      0x05, 0x17, 0x30, 0x42,
    ]);
  });

  it("sorts five bytes in any order", () => {
    expect(bubbleSort([0x42, 0x30, 0x05, 0x17, 0x99]).memory(ARRAY, 5)).toEqual([
      0x05, 0x17, 0x30, 0x42, 0x99,
    ]);
  });

  it("ignores a smaller byte right after the array", () => {
    // Fresh memory already holds #00 there: this test says so out loud.
    const run = program.run("bubble_sort", {
      registers: { hl: ARRAY, b: 5 },
      memory: [{ at: ARRAY, bytes: [0x42, 0x30, 0x05, 0x17, 0x99, 0x00] }],
    });

    expect(run).toChangeOnly({ address: ARRAY, length: 5 });
    expect(run.memory(ARRAY, 5)).toEqual([0x05, 0x17, 0x30, 0x42, 0x99]);
  });

  // Sorted bytes are the fastest input: one pass finds no swap, and the sort stops.
  it.each([2, 16, 255])("sorts %i sorted bytes in 12n + 6 NOPs at most", (n) => {
    const sorted = Array.from({ length: n }, (_, i) => i);

    expect(bubbleSort(sorted).nops).toBeLessThanOrEqual(12 * n + 6);
  });

  // A bubble never moves past a byte equal to it.
  it.each([2, 16, 255])("sorts %i equal bytes in 12n + 6 NOPs at most", (n) => {
    const equal = Array.from({ length: n }, () => 0x42);

    expect(bubbleSort(equal).nops).toBeLessThanOrEqual(12 * n + 6);
  });

  // Reversed bytes are the slowest input: every pair swaps, each pass stops a byte earlier.
  it.each([2, 16, 255])("sorts %i reversed bytes in 8.5n² + 11.5n − 19 NOPs at most", (n) => {
    const reversed = Array.from({ length: n }, (_, i) => n - 1 - i);

    expect(bubbleSort(reversed).nops).toBeLessThanOrEqual(8.5 * n * n + 11.5 * n - 19);
  });
});
