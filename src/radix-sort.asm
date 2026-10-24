; Sorts in place, smallest first, the B 16-bit keys at HL (1 to 255), little-endian.
; DE: a buffer of 2B bytes, apart from the array. Its contents on exit are free.
; Each pass is a stable counting sort on one byte of the keys:
; the low byte from the array to the buffer, then the high byte back to the array.
radix_sort:
 push de        ; the buffer, the source of pass 2
 push bc
 push hl        ; the array, the destination of pass 2

; Pass 1, on the low byte.
 push hl        ; the source
 push bc        ; B: the key count
 push de        ; the destination
 ex de,hl       ; DE: the source
 ld hl,counts
 xor a
.clear1:
 ld (hl),a
 inc l
 jr nz,.clear1
.count1:        ; L: back at #00
 ld a,(de)
 ld l,a
 inc (hl)       ; one more key with this byte
 inc de
 inc de
 djnz .count1
 pop de         ; DE: the destination, the slot of the first key
 ld l,b         ; L: #00, as DJNZ leaves B at zero
.sums1:         ; each count becomes the slot of the first key with its byte
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
 jr nz,.sums1
 pop bc
 pop hl         ; HL: the source
 ld c,b
 ld b,0
 sla c
 rl b           ; BC: 2B, the bytes to move
.move1:         ; LDI counts BC down: JP PE loops until the last byte
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
 jp pe,.move1

; Pass 2, on the high byte.
 pop de         ; DE: the array, the destination
 pop bc         ; B: the key count
 pop hl         ; HL: the buffer, the source
 push hl
 push bc
 push de
 ex de,hl       ; DE: the source
 ld hl,counts
 xor a
.clear2:
 ld (hl),a
 inc l
 jr nz,.clear2
 inc de         ; DE: the high byte of the first key
.count2:        ; L: back at #00
 ld a,(de)
 ld l,a
 inc (hl)       ; one more key with this byte
 inc de
 inc de
 djnz .count2
 pop de         ; DE: the destination, the slot of the first key
 ld l,b         ; L: #00, as DJNZ leaves B at zero
.sums2:         ; each count becomes the slot of the first key with its byte
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
 jr nz,.sums2
 pop bc
 pop hl         ; HL: the source
 ld c,b
 ld b,0
 sla c
 rl b           ; BC: 2B, the bytes to move
.move2:         ; LDI counts BC down: JP PE loops until the last byte
 inc hl
 ld a,(hl)      ; A: the high byte, the digit of this pass
 dec hl
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
 jp pe,.move2
 ret

 align 256
counts:         ; for each byte value: its count, then the low byte of its next slot
 defs 256
slots_hi:       ; for each byte value: the high byte of its next slot, one page above
 defs 256
