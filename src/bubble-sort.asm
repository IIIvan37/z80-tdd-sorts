; Sorts in place, smallest first, the array at HL, B bytes long (1 to 255).
; The array stays within one 256-byte page: INC L never carries into H.
; Knuth's Algorithm B (TAOCP 5.2.2): a pass stops at the last swap of the pass before.
bubble_sort:
 dec b          ; B: the pairs to compare in this pass
 ret z
.pass:
 push hl
 ld d,l         ; D: L at the left byte of the last swap; with no swap, L at the first byte
 ld e,(hl)      ; E: the bubble, the largest byte so far
.pair:
 inc l
 ld a,(hl)
 cp e
 jr nc,.drop    ; the next byte is not below the bubble
 ld (hl),e      ; swap them: the bubble moves one place right
 dec l
 ld (hl),a
 ld d,l
 inc l
 djnz .pair
 jr .end
.drop:
 ld e,a         ; the bubble stops, and the next byte becomes the bubble
 djnz .pair
.end:
 pop hl
 ld a,d
 sub l          ; the pairs before the last swap: the bytes after its left byte are in place
 ret z
 ld b,a
 jr .pass
