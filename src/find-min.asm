; Returns in A the smallest byte of the array at HL, B bytes long (1 to 255).
find_min:
 ld a,(hl)
 dec b
 ret z
 inc hl
 cp (hl)
 ret c          ; A is below the second byte
 ld a,(hl)
 ret
