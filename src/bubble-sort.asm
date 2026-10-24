bubble_sort:
 dec b
 ret z
 ld e,(hl)      ; E: the bubble, the left byte of the pair
 inc l
 ld a,(hl)
 cp e
 ret nc         ; the two bytes are already in order
 ld (hl),e      ; swap them
 dec l
 ld (hl),a
 ret
