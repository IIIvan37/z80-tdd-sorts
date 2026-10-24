; Returns in A the smallest byte of the array at HL, B bytes long (1 to 255).
find_min:
 ld a,(hl)
 ret
