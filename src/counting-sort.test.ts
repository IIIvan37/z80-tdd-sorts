import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its array: free RAM, away from the Program at #4000.
const ARRAY = 0x8000;

describe("counting_sort", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // Runs counting_sort on `bytes`, written at ARRAY.
  function countingSort(bytes: number[]) {
    return program.run("counting_sort", {
      registers: { hl: ARRAY, b: bytes.length },
      memory: [{ at: ARRAY, bytes }],
    });
  }

  it("leaves a one-byte array as it is", () => {
    expect(countingSort([0x42])).toLeaveMemoryUnchanged();
  });

  it("swaps two bytes in the wrong order", () => {
    expect(countingSort([0x42, 0x17]).memory(ARRAY, 2)).toEqual([0x17, 0x42]);
  });

  it("keeps every copy of a repeated byte", () => {
    expect(countingSort([0x42, 0x17, 0x42, 0x17]).memory(ARRAY, 4)).toEqual([
      0x17, 0x17, 0x42, 0x42,
    ]);
  });

  it("sorts five bytes in any order", () => {
    expect(countingSort([0x42, 0x30, 0x05, 0x17, 0x99]).memory(ARRAY, 5)).toEqual([
      0x05, 0x17, 0x30, 0x42, 0x99,
    ]);
  });

  // #00 and #FF sit in the first and last counts: the scan must read all 256.
  it("sorts #FF and #00, the two ends of the counts", () => {
    expect(countingSort([0xff, 0x42, 0x00]).memory(ARRAY, 3)).toEqual([0x00, 0x42, 0xff]);
  });

  // A count of 2 or more must also go back to zero: the next call counts on top of it.
  it("changes only the array, even with repeated bytes", () => {
    expect(countingSort([0x42, 0x17, 0x42, 0x17])).toChangeOnly({ address: ARRAY, length: 4 });
  });
});
