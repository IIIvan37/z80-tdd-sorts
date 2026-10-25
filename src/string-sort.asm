string_sort:
 dec b          ; one pass for each pointer but the first
 ret z
 ld c,0
.next:
 inc c          ; C: the pointers of the sorted run
 inc hl
 inc hl         ; HL: the next pointer to insert
 push bc
 push hl        ; the next pass starts from there
 ld b,c         ; B: the pointers the key can still move past
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
 ld c,(hl)      ; C is free: the count is on the stack
 inc hl
 inc hl
 ld (hl),c
 inc hl
 ld (hl),a
 dec hl
 dec hl
 dec hl         ; HL: the new hole
 djnz .shift    ; at 0, the hole is the first pointer: the key goes first
.place:
 ld (hl),e
 inc hl
 ld (hl),d
 pop hl
 pop bc
 djnz .next
 ret
