; Compares the strings at HL (S1) and DE (S2), as CP would compare S1 with S2:
; Z if they are equal, C if S1 comes first. Each letter takes 7 bits, and bit 7
; marks the last letter of a string, as in the CPC firmware. A string comes
; before a longer string that starts with it. A, HL and DE change, BC does not.
strcmp:
 ld a,(hl)
 ex de,hl
 cp (hl)
 ret
