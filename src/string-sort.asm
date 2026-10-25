string_sort:
 dec b          ; one pass for each pointer but the first
 ret z
.next:
 inc hl
 inc hl         ; HL: the next pointer to insert
 push hl        ; the next pass starts from there
 ld e,(hl)
 inc hl
 ld d,(hl)      ; DE: the key, the string to insert
 dec hl
.shift:
 push hl        ; the hole
 dec hl
 ld a,(hl)
 dec hl
 ld l,(hl)
 ld h,a         ; HL: the string of the pointer before the hole
 ex de,hl       ; HL: the key (S1), DE: that string (S2)
 push hl        ; the key
 call strcmp
 pop de
 pop hl
 jr nc,.place   ; the key does not come before this string
 dec hl         ; move the pointer before the hole into the hole
 ld a,(hl)
 dec hl
 ld c,(hl)
 inc hl
 inc hl
 ld (hl),c
 inc hl
 ld (hl),a
 dec hl
 dec hl
 dec hl         ; HL: the new hole
 jr .shift
.place:
 ld (hl),e
 inc hl
 ld (hl),d
 pop hl
 djnz .next
 ret
