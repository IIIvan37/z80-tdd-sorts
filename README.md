# z80-tdd-sorts

Sorting algorithms in Z80 assembly for the Amstrad CPC, written test-first with [z80-tdd](https://github.com/IIIvan37/z80-tdd). Each algorithm is the subject of a blog post, in French and in English, that follows its tests one step at a time. The posts live on the blog, not in this repository: this repository holds their code.

## How the repository is organised

- `main` holds the empty CPC project: the configuration, `src/main.asm` and the dependencies.
- Each post has its own branch, which starts from `main`. The first one is `intro`, an introduction to TDD with a Routine that finds the smallest byte of an array.
- Each commit of a branch is one step of the TDD cycle, and a tag names it: `<branch>/<NN>-red`, `<branch>/<NN>-green`, `<branch>/<NN>-refactor` or `<branch>/<NN>-guard`.
  - **red**: a new test, which fails.
  - **green**: the least code that makes every test pass.
  - **refactor**: a cleaner version of the code, with every test still passing.
  - **guard**: a new test that passes at once. The post shows the broken version of the Routine that it catches.
- Once its tags are pushed, a branch never changes: the tags a post cites stay where they are.

## Following a post

You need Node.js 24 or later, pnpm, and [RASM](https://github.com/EdouardBERGE/rasm/releases) v3.3.1 on the PATH.

```sh
git clone https://github.com/IIIvan37/z80-tdd-sorts.git
cd z80-tdd-sorts
pnpm install
git checkout intro/01-red
pnpm test
```

Check out the next tag of the post to see the next step. A `red` tag has a failing test on purpose.

## Licence

MIT: see [LICENSE](LICENSE).
