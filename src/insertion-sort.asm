insertion_sort:
 dec b          ; one pass for each byte but the first
 ret z
 ld d,0
.next:
 inc d          ; D: the bytes of the sorted run
 inc l          ; HL: the next byte to insert
 push hl        ; the next pass starts from there
 ld e,d         ; E: the bytes the key can still move past
 ld a,(hl)      ; the key: the byte to insert
.shift:
 dec l
 cp (hl)
 jr nc,.place   ; the key is not below this byte
 ld c,(hl)      ; move this byte one place right
 inc l
 ld (hl),c
 dec l
 dec e
 jr nz,.shift
 dec l          ; the key goes first: .place steps back onto the first byte
.place:
 inc l
 ld (hl),a
 pop hl
 djnz .next
 ret
