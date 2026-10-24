bubble_sort:
 dec b          ; B: the pairs to compare
 ret z
 ld e,(hl)      ; E: the bubble, the largest byte so far
.pair:
 inc l
 ld a,(hl)
 cp e
 jr nc,.drop    ; the next byte is not below the bubble
 ld (hl),e      ; swap them: the bubble moves one place right
 dec l
 ld (hl),a
 inc l
 djnz .pair
 ret
.drop:
 ld e,a         ; the bubble stops, and the next byte becomes the bubble
 djnz .pair
 ret
