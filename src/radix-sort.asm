; Sorts in place, smallest first, the B 16-bit keys at HL (1 to 255), little-endian.
; DE: a buffer of 2B bytes, apart from the array. Its contents on exit are free.
radix_sort:
 push de        ; the buffer
 push bc
 push hl        ; the array
 call .pass     ; the low byte, from the array to the buffer
 pop de         ; DE: the array
 pop bc         ; B: the key count
 pop hl         ; HL: the buffer
 call .pass     ; the high byte, from the buffer back to the array
 ret

; A stable counting sort of the B keys at HL into DE, on the first byte of each key.
; Each key goes out with its two bytes swapped: the buffer holds the keys big-endian,
; so the second pass reads the high byte first, and swaps the keys back.
.pass:
 push hl        ; the source
 push bc        ; B: the key count
 push de        ; the destination
 ex de,hl       ; DE: the source
 ld hl,counts
 xor a
.clear:
 ld (hl),a
 inc l
 jr nz,.clear
.count:         ; L: back at #00
 ld a,(de)
 ld l,a
 inc (hl)       ; one more key with this byte
 inc de
 inc de
 djnz .count
 pop de         ; DE: the destination, the slot of the first key
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
 pop bc
 pop hl         ; HL: the source
 ld c,b
 ld b,0         ; BC: the key count
.move:          ; LDI counts BC down: JP PE loops until the last key
 ld a,(hl)      ; A: the first byte, the digit of this pass
 push hl
 ld l,a
 ld h,counts >> 8
 ld e,(hl)
 inc h
 ld d,(hl)      ; DE: the slot of this key
 pop hl
 inc hl
 ldi            ; the second byte goes first
 ld (de),a      ; then the digit
 inc de
 push hl
 ld l,a
 ld h,counts >> 8 ; LD, not DEC H: the P/V flag of LDI must live until JP PE
 ld (hl),e      ; the next key with this digit goes in the next slot
 ld h,slots_hi >> 8
 ld (hl),d
 pop hl
 jp pe,.move
 ret

 align 256
counts:         ; for each byte value: its count, then the low byte of its next slot
 defs 256
slots_hi:       ; for each byte value: the high byte of its next slot, one page above
 defs 256
