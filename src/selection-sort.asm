; Sorts in place, smallest first, the array at HL, B bytes long (1 to 255).
; The array stays within one 256-byte page, as find_min requires.
selection_sort:
 dec b          ; one pass for each byte but the last
 ret z
.loop:
 push bc
 push hl
 inc b          ; find_min scans the bytes not yet sorted: B + 1
 call find_min
 pop hl
 pop bc
 ld c,(hl)      ; swap the smallest byte with the first unsorted one
 ld (hl),a
 ld a,c
 ld (de),a
 inc l
 djnz .loop
 ret
