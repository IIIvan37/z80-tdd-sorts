insertion_sort:
 dec b
 ret z
 ld a,l
 add a,b
 ld l,a         ; HL: the last byte
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
 ret
