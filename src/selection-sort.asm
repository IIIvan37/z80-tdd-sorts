selection_sort:
 dec b
 ret z
 ld a,(hl)
 inc l
 cp (hl)
 ret c          ; the two bytes are already in order
 ld b,(hl)
 ld (hl),a
 dec l
 ld (hl),b
 ret
