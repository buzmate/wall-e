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

# Install and run IPFS for the assets

To create the NFTs we need an IPFS instance running on our pc, starting from there: https://docs.ipfs.io/how-to/command-line-quick-start/

After you've installed your instance run the daemon with:

```
ipfs daemon
```

Put all the assets inside the folder `./assets/example`, using the same order, the merger script will link file n.0 with nft n.0.

# Configure and upload to IPFS using Pinata service

Let's use now the IPFS cli to upload entire folder:

```
ipfs add nfts/example -r
```

At the end of the process you will see the IPFS hash of the folder, in this case:

```
added QmPrxFUFBjdc5QGbJ3Ys41dnEx82Fboc1MVRJGto8rSCqj example
```

Now let's go to [Pinata](https://www.pinata.cloud/) service and obtain a secret access key. 
To create an access key first go [here](https://app.pinata.cloud/keys) and then follow the process to add a New Key.

When you've that key connect your browser to the local IPFS service: http://127.0.0.1:5001/webui, navigate to to "Settings" and add a "Pinning Service", choose Pinata and enter the key.

It's time to upload all files to Pinata with:

```
ipfs pin remote add --service=Pinata QmPrxFUFBjdc5QGbJ3Ys41dnEx82Fboc1MVRJGto8rSCqj
```

# Create the NFTs

Now it's all ready to create the 

Run the script now: 

```
npm run merge example
```

At the end you will see something like the folder we've leaved for example: `nfts/example`.