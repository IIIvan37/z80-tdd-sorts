insertion_sort:
 dec b
 ret z
 inc l
 ld a,(hl)      ; the key: the byte to insert
 dec l
 cp (hl)
 ret nc         ; the key is not below the byte before it
 ld c,(hl)      ; move that byte one place right, and the key into its place
 ld (hl),a
 inc l
 ld (hl),c
 ret
