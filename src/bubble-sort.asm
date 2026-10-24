bubble_sort:
 dec b          ; B: the pairs to compare in each pass
 ret z
 ld c,b         ; C: the passes left, one for each pair
.pass:
 push bc
 push hl
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
 jr .end
.drop:
 ld e,a         ; the bubble stops, and the next byte becomes the bubble
 djnz .pair
.end:
 pop hl
 pop bc
 dec c
 jr nz,.pass
 ret
