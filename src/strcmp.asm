; Compares the strings at HL (S1) and DE (S2), as CP would compare S1 with S2:
; Z if they are equal, C if S1 comes first. Each letter takes 7 bits, and bit 7
; marks the last letter of a string, as in the CPC firmware. A string comes
; before a longer string that starts with it. A, HL and DE change, BC does not.
strcmp:
 ex de,hl       ; DE: S1, HL: S2
.loop:
 ld a,(de)
 cp (hl)
 jr nz,.differ
 inc de
 inc hl
 rla            ; C: bit 7, set on the last letter of both strings
 jr nc,.loop
 cp a           ; Z, NC: equal
 ret
.differ:
 ld e,a         ; E: the byte of S1
 xor (hl)
 and #80        ; A: #80 if only one string ends on this letter, else #00
 xor e          ; A: the byte of S1, with the bit 7 of S2
 cp (hl)
 ret nz         ; the letters differ: they decide
 sub e          ; the same letter, but only one string ends on it. A: the byte
                ; of S2 minus the byte of S1, never zero, and C if S1 ends: the
                ; shorter string comes first
 ret
