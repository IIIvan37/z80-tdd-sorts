; Sorts in place, smallest first, the array at HL, B bytes long (1 to 255).
; The array stays within one 256-byte page: INC E keeps D on the page of H.
insertion_sort:
 dec b          ; one pass for each byte but the first
 ret z
 ld c,0
.next:
 inc c          ; C: the bytes of the sorted run
 push bc
 ld d,h         ; DE: the next byte to insert, then the hole it leaves
 ld e,l
 inc e
 push de        ; the next pass starts from there
 ld a,(de)      ; the key: the byte to insert
 ld b,0         ; BC: the bytes the key can still move past
.shift:
 cp (hl)        ; HL: the byte before the hole
 jr nc,.place   ; the key is not below this byte
 ldd            ; move this byte into the hole; P/V: BC is not 0
 jp pe,.shift
.place:
 ld (de),a
 pop hl         ; HL: the last byte of the sorted run
 pop bc
 djnz .next
 ret
