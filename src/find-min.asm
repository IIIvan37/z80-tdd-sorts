; Returns in A the smallest byte of the array at HL, B bytes long (1 to 255).
; The array stays within one 256-byte page: the loop moves HL with INC L.
find_min:
 ld a,(hl)
 dec b
 ret z
.loop:
 inc l
 cp (hl)
 jr c,.next     ; A is below this byte
 ld a,(hl)
.next:
 djnz .loop
 ret
