import { beforeAll, describe, expect, it } from "vitest";
import { loadProgram, type MemoryRange, type Program, runMatchers } from "z80-tdd";

expect.extend(runMatchers);

// Where each test writes its keys, and the buffer radix_sort works in:
// free RAM, away from the Program at #4000, and 512 bytes apart.
const ARRAY = 0x8000;
const BUFFER = 0x8200;

describe("radix_sort", () => {
  let program: Program;

  beforeAll(async () => {
    program = await loadProgram();
  });

  // Runs radix_sort on the 16-bit `keys`, written little-endian at ARRAY.
  function radixSort(keys: number[]) {
    const bytes = keys.flatMap((key) => [key & 0xff, key >> 8]);

    return program.run("radix_sort", {
      registers: { hl: ARRAY, b: keys.length, de: BUFFER },
      memory: [{ at: ARRAY, bytes }],
    });
  }

  // Reads back the `count` 16-bit keys at ARRAY after a Run.
  function keysAfter(run: ReturnType<typeof radixSort>, count: number) {
    const bytes = run.memory(ARRAY, 2 * count);

    return Array.from({ length: count }, (_, i) => bytes[2 * i] | (bytes[2 * i + 1] << 8));
  }

  // The Memory changes of a Run that lie in none of the `ranges`: toChangeOnly takes one range.
  function changesOutside(run: ReturnType<typeof radixSort>, ranges: MemoryRange[]) {
    return run.memoryChanges.filter(({ address }) =>
      ranges.every((range) => ((address - range.address) & 0xffff) >= range.length),
    );
  }

  it("leaves a one-key array as it is", () => {
    expect(keysAfter(radixSort([0x1234]), 1)).toEqual([0x1234]);
  });

  it("sorts two keys by their low byte", () => {
    expect(keysAfter(radixSort([0x0142, 0x0117]), 2)).toEqual([0x0117, 0x0142]);
  });

  it("sorts two keys by their high byte", () => {
    expect(keysAfter(radixSort([0x0201, 0x0102]), 2)).toEqual([0x0102, 0x0201]);
  });

  it("sorts #FFFF and #0000, the two ends of the keys", () => {
    expect(keysAfter(radixSort([0xffff, 0x0000]), 2)).toEqual([0x0000, 0xffff]);
  });

  // Out of its stack, which no test sees, radix_sort may write only these four ranges.
  it("changes only the array, the buffer and its two tables", () => {
    const keys = [0x0142, 0xffff, 0x0117, 0x0000, 0x0142];
    const run = radixSort(keys);

    expect(
      changesOutside(run, [
        { address: ARRAY, length: 2 * keys.length },
        { address: BUFFER, length: 2 * keys.length },
        program.range("counts", 256),
        program.range("slots_hi", 256),
      ]),
    ).toEqual([]);
  });
});
