# Dice Roll Traits Factory

This is a trait generator for NFTS, this can be useful if you want to create a randomized selection of unique traits.
This was heavily inspired by D&D (nerd alert here), so the idea is to generate traits by launching rolls.

# How to use it

First, generate an "instruction" file, which is the base of our generation process. Take the example here:

```
GENERATE:10000
# SAY-TRAIT
d20>10|SAY:WOO
d20>04|SAY:BAA
```

This will: 
- Generate 10000 traits
- `#` is classic "comment" character, so it will do nothing
- `d20>10|SAY:WOO`, this means that:
    - Send a d20 (it can be replaced with d-n)
    - If result is higher than 10 trait is accepted
    - Trait will be `SAY` with value `WOO`
- `d20>04|SAY:BAA`, this means that, if first launch fails, if result is higher than 5 trait is accepted.

As we imagined, traits with few possibilities of being accepted should be on top or on bottom of the instructions. This because if first launch is very high, can be accepted as trait "rare" but if all launch fails the last one can be even more rare.

A deeper example can be found in `instructions/example`.

# Install dependencies

To use this repo we need `NodeJS` and `YARN` so, first download the repository, then:

```
yarn
```

# Generate traits

To generate your traits just run:

```
npm run generate example
```

This will generate the traits for the `instructions/example` file.

# Extract stats

To test how the process generated the stats just run:

```
npm run stats example
```

This will produce a result like this: 

```
NUMERIC RESULT:
{
  strength: { weak: 4492, strong: 3657, ultra: 982, normal: 869 },
  intelligence: { normal: 3003, genious: 2472, stupid: 3744, idiot: 781 }
}
--
STATISTIC RESULT:
| strength | 
weak: 44.92%
strong: 36.57%
ultra: 9.82%
normal: 8.69%
--
| intelligence | 
normal: 30.03%
genious: 24.72%
stupid: 37.44%
idiot: 7.81%
--
```

# Use the traits

Well....insert them in your metadata and..enjoy!