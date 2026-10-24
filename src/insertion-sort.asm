insertion_sort:
 dec b          ; one pass for each byte but the first
 ret z
.next:
 inc l          ; HL: the next byte to insert
 ld e,l         ; the next pass starts from there
 ld a,(hl)      ; the key: the byte to insert
.shift:
 dec l
 cp (hl)
 jr nc,.place   ; the key is not below this byte
 ld c,(hl)      ; move this byte one place right
 inc l
 ld (hl),c
 dec l
 jr .shift
.place:
 inc l
 ld (hl),a
 ld l,e
 djnz .next
 ret
