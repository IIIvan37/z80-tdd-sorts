; Returns in A the smallest byte of the array at HL, B bytes long (1 to 255),
; and in DE its address (the last one, if several are equal).
; The array stays within one 256-byte page: the loop moves HL with INC L,
; and D keeps the page of H.
find_min:
 ld d,h
 ld e,l
 ld a,(hl)
 dec b
 ret z
.loop:
 inc l
 cp (hl)
 jr c,.next     ; A is below this byte
 ld a,(hl)
 ld e,l
.next:
 djnz .loop
 ret
