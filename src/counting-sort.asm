; Sorts in place, smallest first, the array at HL, B bytes long (1 to 255).
; The array stays within one 256-byte page: INC E never carries into D.
; counts must hold zeros on entry, and holds zeros again on exit.
counting_sort:
 ex de,hl       ; DE: the array
 push de
 ld hl,counts
.count:
 ld a,(de)
 ld l,a
 inc (hl)       ; one more copy of this byte
 inc e
 djnz .count
 pop de         ; DE: back to the first byte
 ld l,b         ; L: #00, as DJNZ leaves B at zero
.scan:          ; L runs over the 256 counts
 ld a,(hl)
 or a
 jr z,.next
 ld b,a         ; B: the copies of this byte to write
 ld (hl),0      ; the count goes back to zero for the next call
 ld a,l
.copy:
 ld (de),a
 inc e
 djnz .copy
.next:
 inc l
 jr nz,.scan
 ret

 align 256
counts:         ; one count for each byte value: L indexes it alone
 defs 256
