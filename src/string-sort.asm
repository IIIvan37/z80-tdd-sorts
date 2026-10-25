string_sort:
 dec b
 ret z
 push hl
 ld e,(hl)
 inc hl
 ld d,(hl)      ; DE: the string of the first pointer
 inc hl
 ld a,(hl)
 inc hl
 ld h,(hl)
 ld l,a         ; HL: the key, the string of the second pointer
 call strcmp
 pop hl
 ret nc         ; the key does not come before the first string
 ld e,(hl)      ; swap the two pointers
 inc hl
 ld d,(hl)
 inc hl
 ld c,(hl)
 ld (hl),e
 inc hl
 ld a,(hl)
 ld (hl),d
 dec hl
 dec hl
 ld (hl),a
 dec hl
 ld (hl),c
 ret
