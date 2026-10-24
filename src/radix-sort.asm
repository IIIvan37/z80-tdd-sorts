; Sorts in place, smallest first, the B 16-bit keys at HL (1 to 255), little-endian.
; DE: a buffer of 2B bytes, apart from the array. Its contents on exit are free.
; Each pass is a stable counting sort on one byte of the keys.
radix_sort:
 push hl        ; the array
 push bc        ; B: the key count
 push de        ; the buffer
 ex de,hl       ; DE: the array
 ld hl,counts
 xor a
.clear:
 ld (hl),a
 inc l
 jr nz,.clear
.count:         ; L: back at #00
 ld a,(de)
 ld l,a
 inc (hl)       ; one more key with this low byte
 inc de
 inc de
 djnz .count
 pop de         ; DE: the buffer, the slot of the first key
 push de
 ld l,b         ; L: #00, as DJNZ leaves B at zero
.sums:          ; each count becomes the slot of the first key with its byte
 ld c,(hl)      ; BC: the count, as B is zero
 ld (hl),e
 inc h
 ld (hl),d
 dec h
 ex de,hl
 add hl,bc      ; two bytes for each key
 add hl,bc
 ex de,hl
 inc l
 jr nz,.sums
 pop de         ; DE: the buffer
 pop bc
 pop hl         ; HL: the array
 push hl
 push de
 ld c,b
 ld b,0
 sla c
 rl b           ; BC: 2B, the bytes to move
 push bc
.move:          ; LDI counts BC down: JP PE loops until the last byte
 ld a,(hl)      ; A: the low byte, the digit of this pass
 push hl
 ld l,a
 ld h,counts >> 8
 ld e,(hl)
 inc h
 ld d,(hl)      ; DE: the slot of this key
 pop hl
 ldi
 ldi
 push hl
 ld l,a
 ld h,counts >> 8 ; LD, not DEC H: the P/V flag of LDI must live until JP PE
 ld (hl),e      ; the next key with this digit goes in the next slot
 ld h,slots_hi >> 8
 ld (hl),d
 pop hl
 jp pe,.move
 pop bc         ; BC: 2B
 pop hl         ; HL: the buffer
 pop de         ; DE: the array
 ldir           ; the sorted keys go back to the array
 ret

 align 256
counts:         ; for each byte value: its count, then the low byte of its next slot
 defs 256
slots_hi:       ; for each byte value: the high byte of its next slot, one page above
 defs 256
