; Compares the strings at HL (S1) and DE (S2), as CP would compare S1 with S2:
; Z if they are equal, C if S1 comes first. Each letter takes 7 bits, and bit 7
; marks the last letter of a string, as in the CPC firmware. A string comes
; before a longer string that starts with it. A, HL and DE change, BC does not.
strcmp:
 ex de,hl       ; DE: S1, HL: S2
.loop:
 ld a,(de)
 cp (hl)
 ret nz         ; the first different byte decides
 inc de
 inc hl
 rla            ; C: bit 7, set on the last letter of both strings
 jr nc,.loop
 cp a           ; Z, NC: equal
 ret
