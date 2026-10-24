; Returns in A the smallest byte of the array at HL, B bytes long (1 to 255).
find_min:
 ld a,(hl)
 dec b
 ret z
.loop:
 inc hl
 cp (hl)
 jr c,.next     ; A is below this byte
 ld a,(hl)
.next:
 djnz .loop
 ret
