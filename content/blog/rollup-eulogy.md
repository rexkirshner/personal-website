---
title: "A Eulogy for the Rollup-Centric Roadmap"
date: 2026-06-26
description: "Ethereum's five-year rollup-centric roadmap promised the chain would disappear into the background. It delivered the opposite. A eulogy for the roadmap, and a hard look at the vision underneath it."
tags: ["ethereum", "rollups", "layer 2"]
image: "https://cdn.rexkirshner.com/blog/rollup-eulogy-banner.webp"
---
<p class="essay-lead">The rollup roadmap promised that Ethereum would disappear into the background. And yet, here in 2026 the rollup-centric roadmap delivered the opposite: you can't get near Ethereum without being an expert in crypto infrastructure.</p>

## 1. Four Steps to Place One Bet

You are LPing some [stablecoins](https://inevitableeth.com/ethereum/stablecoins) in an Aerodrome pool on Base, and you decide it is time to mess around on Polymarket. You pull the position and swap it back into USDC. You open Bungee to bridge the funds across, and it routes you through a bridge whose name you half-recognize. You know it from somewhere, you just cannot remember whether it is the trustworthy one or the one that keeps getting drained for nine figures. You click it anyway. You refresh the page until the money lands on the other side, send it on to Polymarket, and finally place the bet you decided to make four+ approvals and three protocols ago.

Composable [money legos](https://inevitableeth.com/ethereum/de-fi) were one of the main reasons to build on Ethereum at all: any protocol could plug into any other one natively, no bridge and no babysitting required. What a person actually touches today is the opposite of that.

This is what five years of the rollup-centric roadmap actually delivered. It was bad for crypto-natives, it was unworkable for people new to the industry. Sometime in 2025 everyone eventually came to the same questions: do L2s accrue value to Ethereum or do they siphon it away? Are Solana, BSC and every other fast chain suggesting that we shouldn't be concerned with anything beyond the L1? Why haven't we made any progress on the UX issues we've been talking about since 2021?

Was the rollup-centric roadmap a mistake?

In early 2026, Vitalik Buterin wrote [a piece](https://x.com/VitalikButerin/status/2018711006394843585) that finally addressed the pressure building around these questions. Some cheered, convinced that Ethereum was abandoning a failed vision that had grown necrotic. Others read Vitalik's post like a eulogy. And some just wondered what it meant for a project that was becoming increasingly hard to understand.

But in order to understand the significance of this moment and what it means for the future of Ethereum, you must first understand how we got here.

## 2. The Protocol That Was Built to Vanish

Remember what was promised. It was worth believing in.

The trilemma was the trap. A blockchain could be decentralized, secure, or scalable, and the accepted wisdom said you only ever got to keep two. Scaling a chain meant increasing the cost of running a [node](https://inevitableeth.com/ethereum/node) until [decentralization](https://inevitableeth.com/ethereum/decentralization) became unrealistic.

The rollup-centric roadmap was the way out. Keep the base layer lean enough that a hobbyist can verify the whole chain on cheap hardware at home, and push the heavy [execution](https://inevitableeth.com/ethereum/execution) outward onto rollups.

A rollup runs fast, and can even be run by a single centralized operator, because it never gets the final word. It executes transactions off-chain in bulk, then posts a compressed, provable record of them back to Ethereum, where that record is treated as absolute truth. An operator can run the rollup, but it cannot overrule the record once it settles on the base layer.

Scale by orders of magnitude and surrender none of the decentralization that made the thing worth running.

<details class="essay-collapse">
<summary>How rollups were supposed to beat the trilemma<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>The constraint everything else answers to is the blockchain trilemma: a chain seems able to offer decentralization, security, and scale, but only two of the three at once. The reason is the <a href="https://inevitableeth.com/ethereum/node">node</a>. Every full node stores the whole state and re-executes every transaction, so the network is only as decentralized as the cheapest machine that can keep up. Raise throughput by raising the hardware requirement and you price ordinary people out of verifying, and a chain only professionals can check has quietly given up the thing that made it worth running. <a href="https://inevitableeth.com/ethereum/decentralization">Decentralization</a> is not an aesthetic preference here. It is the entire source of the censorship resistance and <a href="https://inevitableeth.com/concepts/credible-neutrality">credible neutrality</a> that separate a public chain from a database with extra steps.</p>
<p>A rollup is the way around that. It runs its own high-performance chain, executes transactions there, compresses the result, and posts that record back to Ethereum, inheriting Ethereum's security for the part that decides who owns what. A rollup is also supposed to preserve a unilateral exit: if the operators turn malicious, you can still withdraw your assets straight to Ethereum without their cooperation. That exit is the whole game, and it is also the part most rollups have not finished building. Almost all of them still ship with training wheels, a security council of insiders who can override the system, which means the trust-minimized version of the promise is still largely on paper.</p>
<p>Two kinds run in production, and they differ in how they prove they did not cheat. <a href="https://inevitableeth.com/ethereum/optimistic-rollup">Optimistic rollups</a> (Arbitrum, Optimism, Base) assume each batch is honest and leave a challenge window, still around seven days, in which anyone can post a fraud proof and reverse a lie. Those seven days are the cost: withdraw straight back to Ethereum and you wait out the window. <a href="https://inevitableeth.com/ethereum/zk-rollup">ZK rollups</a> (Starknet, zkSync, Scroll, Linea) attach a <a href="https://inevitableeth.com/concepts/zk-proof">validity proof</a> instead, a piece of cryptography that demonstrates the batch executed correctly, so settlement is near-immediate and no waiting period is needed. The catch runs the other way: those proofs are expensive to generate, and making them cheap and fast is exactly the frontier the rest of the roadmap now turns on.</p>
<p>Posting all that compressed data was the next bottleneck, because Ethereum block space is scarce and rollups were buying it at full price. In 2024 Ethereum added blobs (<a href="https://inevitableeth.com/ethereum/proto-danksharding">EIP-4844</a>, "proto-danksharding"): a cheap, temporary data lane with its own fee market, separate from execution, dropped after about eighteen days while a small cryptographic commitment stays on-chain forever so anyone can still prove what the data was. The endgame, <a href="https://inevitableeth.com/ethereum/data">full danksharding</a>, lets each node <a href="https://inevitableeth.com/ethereum/data-availability-sampling">sample</a> a fraction of the blob data instead of downloading all of it, and it is arriving in stages: the Fusaka upgrade in December 2025 shipped PeerDAS, the first version of that sampling. The arc is real and unfinished.</p>
</div>
</details>

But the deepest part of the dream was never the throughput... it was disappearance. Ethereum would fade into the background the way the real infrastructure of the internet did. You do not think about TCP/IP when a page loads, and you have never chosen a DNS resolver to send a message, yet everything you do online rides on both.

The rollup dream was for Ethereum to win the same way: [settlement](https://inevitableeth.com/concepts/settlement) so reliable and so far in the background that you would never know or care how it works. The money legos would be configured deep beneath the surface, producing [validity proofs](https://inevitableeth.com/concepts/zk-proof) that would get sent back to Ethereum. But all the user would see is the assets they own, free to use them however they wanted.

Vitalik Buterin wrote this down in [October 2020](https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698), years before he would be the one to call it into question, and for five years it was the most coherent plan in crypto.

One of the early criticisms was that it was just too complicated and couldn't be built. And that was wrong; much of it shipped. The rollup-centric roadmap officially manifested in the Ethereum protocol in 2024 during the [Dencun upgrade](https://inevitableeth.com/ethereum/proto-danksharding), which gave rollups their own dedicated data lane. The cost of using a rollup fell by roughly an order of magnitude, down to pennies.

The competing pitch, that rollups should buy their data from a separate [data availability](https://inevitableeth.com/ethereum/data) layer, lost outright: the high-value rollups stayed home and posted to Ethereum, and the loudest of the challengers is down around ninety-eight percent from its peak. Real usage moved onto the L2s, exactly as the map drew it.

At the peak, around $50B of TVL sat in Ethereum L2s, put into use in increasingly complex applications while paying increasingly fewer fees.

And yet... even at the peak something felt off. As time went on, the absence of any UX improvement became more and more uncomfortable.

<details class="essay-collapse">
<summary>What shipped, and where the value didn't go<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>The "what worked" column is real and should be counted honestly. Dencun (March 2024) introduced blobs and L2 fees collapsed from dollars to pennies almost overnight. The modular-data-availability challengers, the chains pitching themselves as cheaper places for rollups to dump their data, lost the argument: Ethereum's own blobs were cheap enough that the high-value rollups stayed home and posted to Ethereum, and the loudest of those challengers, Celestia, has its TIA token down roughly 98% from its all-time high. Ethereum still leads the things <a href="https://inevitableeth.com/concepts/settlement">settlement</a> is actually for: around 65% of tokenized real-world assets, around 57% of <a href="https://inevitableeth.com/ethereum/stablecoins">stablecoin</a> value, and the highest total value secured of any chain. The base layer did its job.</p>
<p>The "what didn't" column is the investment story, and it traces back to one mechanism. Since <a href="https://inevitableeth.com/ethereum/eip-1559">EIP-1559</a>, Ethereum burns the base fee of every transaction, and the bet called "ultrasound money" was that heavy use would burn more ETH than the chain issues to its validators, leaving ETH net deflationary. For a stretch after the <a href="https://inevitableeth.com/ethereum/pos">Merge</a> it worked. Then the roadmap succeeded against itself: blobs are deliberately cheap, so once activity moved to L2s and L2s moved to blobs, the fees that used to be burned on mainnet mostly stopped. Cumulative blob fees since Dencun are on the order of $26M, with the base fee pinned near its floor for most of that span, and Fusaka's EIP-7918 had to add a blob fee floor just to stop blobs from burning essentially nothing. So the burn collapsed, issuance now runs ahead of it at roughly 0.2% a year, and ETH supply sits around 950,000 ETH above where it was at the Merge. Ethereum is now inflating, the reverse of what the thesis promised. ETH traded near $1,636 on 25 June 2026, down about 32% on the year and roughly 67% below its ~$4,946 peak of August 2025. The capacity got built; the value it was supposed to capture went to the rollups instead.</p>
</div>
</details>

## 3. When It Stopped Feeling Like One Place

Ethereum built the cheap execution it had promised, and could not make it feel like Ethereum.

A rollup was supposed to be Ethereum scaling itself, the same chain doing more work. What users got was a row of branded mini-L1s, each with its own token, its own bridge, its own everything except the security it quietly rented from the chain underneath. Security that became more and more esoteric over time.

Rollups borrowed Ethereum's credibility at the bottom and presented themselves as somewhere new at the top. The dream was for the chain to disappear, but what happened is that the chain became impossible to ignore. Instead of abstracting Ethereum away, we pushed the plumbing into the foreground of every transaction.

Ethereum scaled. It scaled into something you could no longer recognize as one thing.

None of the hard questions were secret. By 2021 everyone building this could name them:

- bridging
- gas tokens
- composability
- atomic transactions

The standing answer, for five years, was that the experience would get better, that the tooling would catch up, that interop was coming. We said it with real conviction, and we were wrong. There was money to launch a chain and money to attract TVL from mainnet. There was money in bridging and covering the gaps exposed as the rollup-centric roadmap came online.

But there was no money in making Ethereum whole.

Underneath that sat a contradiction with no villain anywhere in it. Ethereum needed its rollups to commoditize, to become interchangeable public infrastructure as plain and uniform as a network protocol. Each rollup, to survive, needed the opposite: to differentiate, to build a moat, to be a company with a product and a token and a reason to be chosen over the chain beside it.

Coinbase built Base into the most successful L2 there is, and the same success pulled it toward its own stack, its own revenue, and what many read as its own eventual L1. They were not betraying the vision. They were responding to the incentive they had been offered. The way everyone who shipped a chain was.

The thing the system needed and the thing the market paid for were opposites, and the gaps continued to grow.

But of all the open questions we held back in 2021, there was one that was almost always deferred until later. A question that everyone understood was existential, with stakes so high that the only reasonable choice was to defer it. Until finally we had to face the ugliest question of them all:

Was any of this accruing any value back to Ethereum?

In 2025, Base earned around $78M in sequencer fees, the money users paid to transact on it, and paid ~$5M to Ethereum. There was more activity than ever, but none of that activity had any meaningful impact on the price of ETH.

And so as we entered 2026, many people in the Ethereum community were anxiously wondering if the rollup-centric roadmap was a mistake. Or, even worse, if the rollup-centric roadmap wasn't a mistake, then where did we go wrong?

<details class="essay-collapse">
<summary>The fragmentation tax, and the scoreboard<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>The fragmentation tax is the sum of the wallet humiliations: bridges you have to trust and can lose funds in, the wrong-gas-token wall, the absence of atomic <a href="https://inevitableeth.com/ethereum/de-fi">composability</a> across rollups (a single transaction cannot read state on chain A and write to chain B), dust stranded because the exit costs more than the balance, and a thicket of competing interop standards that never converged on one. That last item is the quiet killer. Where mainnet had one shared state that every contract could compose against for free, the L2 world has dozens of separate states and a half-finished patchwork of bridges and messaging standards stitched between them, each with its own trust assumptions and its own ways to fail.</p>
<p>Underneath sits the incentive conflict. The network needed rollups to become boring and interchangeable, plain public infrastructure; each rollup's business needed it to be distinct and sticky, a place with a moat. The most successful one made the conflict literal: Base left the shared OP Stack on 18 February 2026 for its own stack, taking more control and 100% of its sequencer revenue, ran a single centralized sequencer the entire time, and kept roughly $78M of 2025 sequencer revenue, all of it to Coinbase. By mid-2026 the "multichain future" had quietly consolidated anyway: Base, Arbitrum, and Optimism together held about 83% of L2 DeFi TVL (21Shares, 24 June 2026), so users absorbed the fragmentation without even getting real variety in return.</p>
<p>The competitive scoreboard tells the same story from the outside. Solana overtook Ethereum on daily DEX volume in May 2026, taking the execution narrative Ethereum thought it owned. It was a volume flippening, not a market-cap one (SOL near $47B against ETH north of $240B), so the believers were right that neutrality still commanded a premium and were also left watching the actual trading move elsewhere. Hyperliquid was starker: it ran roughly 70% of on-chain perpetuals volume and finished Q1 2026 as the single highest-revenue chain in crypto, and it did it on its own purpose-built L1. The most valuable execution of the cycle skipped the rollup model entirely.</p>
</div>
</details>

## 4. The Case for the Prosecution

Maybe the reason Ethereum cannot make a hundred chains feel like one place is the exact reason anyone admired it: it refuses to let anyone be in charge. A single coherent experience needs an authority to impose it, someone empowered to pick the standard and force the others into line, to break a few chains for the good of the whole.

Ethereum's founding commitment is that no such authority exists, and a system built so that no one can seize control may be constitutionally unable to deliver the coordination it sold.

Every chain gets to be sovereign, but the reality of that sovereignty is that nothing fits together.

Or maybe the answer is even more simple: maybe [credible neutrality](https://inevitableeth.com/concepts/credible-neutrality) is not a product that the market is interested in paying for.

Look at what the market rewarded while the believers waited for interop. Solana kept getting faster and more centralized, and in May 2026 it passed Ethereum in daily DEX volume. Hyperliquid built the dominant on-chain exchange and closed the first quarter of 2026 as the single highest-revenue chain in all of crypto, all completely outside of Ethereum. Line them up, Solana and BSC and the rest, and the unwelcome reading goes past any one of them: maybe the rollup detour was the mistake.

The comparison the faithful keep waving off, that a chain tuned only for speed and control drifts toward Solana and eventually toward financial apps running on AWS, might be exactly right. But what is right worth if the market doesn't care?

And the strongest witness for the prosecution is the architect himself. Vitalik, who drew the map, has told you the original vision no longer makes sense. If the author has stopped defending it, what exactly are the rest of us holding?

<details class="essay-collapse">
<summary>The capitulation, in their own words<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>Two documents, two authorships, often blurred together. Keep them straight.</p>
<p>The turn is sharper if you remember where it started. In January 2025, barely a year before the capitulation, Vitalik's own <a href="https://vitalik.eth.limo/general/2025/01/23/l1l2future.html">"Scaling Ethereum L1 and L2s in 2025 and beyond"</a> told everyone to stay the course on rollups, even as it named the core problem in a line that aged badly: <em>"Using Ethereum should feel like using a single ecosystem, not 34 different blockchains."</em> The plan in early 2025 was to fix the seams. The message a year later was that the seams were the wrong thing to have built.</p>
<p>The trigger is <strong>Vitalik's <a href="https://x.com/VitalikButerin/status/2018711006394843585">X thread of 3 February 2026</a></strong> (a thread, not a blog post): <em>"the original vision of L2s and their role in Ethereum no longer makes sense, and we need a new path."</em> He argues we should <em>"stop thinking about L2s as literally being 'branded shards' of Ethereum"</em> and instead see them as <em>"a full spectrum"</em> of chains at <em>"different levels of connection to Ethereum, that each person (or bot) is free to care about or not care about."</em> L2s should <em>"identify a value add other than 'scaling,'"</em> and <em>"if you create a 10,000 TPS EVM where its connection to L1 is mediated by a multisig bridge, then you are not scaling Ethereum."</em> He concedes <em>"L2s' progress to stage 2 (and, secondarily, on interop) has been far slower and more difficult than originally expected,"</em> and floats a native <a href="https://inevitableeth.com/ethereum/taxonomy">ZK-EVM</a> precompile <em>"enshrined in the base layer"</em> that <em>"auto-upgrades along with Ethereum."</em> The blunter line lands two days later, on <strong>Farcaster (5 February 2026)</strong>: <em>"We don't friggin need more copypasta EVM chains, and we definitely don't need even more Layer 1s."</em></p>
<p>The institutional version is the <strong><a href="https://blog.ethereum.org/2026/03/23/l1-l2-ethereum">Ethereum Foundation post of 23 March 2026</a></strong>, by Josh Rudolf, Julian Ma, and Josh Stark (not Vitalik): previously <em>"the primary objective of L2s was to scale Ethereum,"</em> now <em>"the primary objective of L2s is to provide differentiated features, services, customizations, go-to-market strategies, and zones of control, while also offering extra scale."</em> The L1 should <em>"serve as a truly permissionless and maximally resilient global hub for settlement, shared state, liquidity, and DeFi,"</em> the <em>"heart of the onchain economy."</em></p>
<p>It rode in on a concrete L1-scaling pivot, the foundation's answer to its own diagnosis: if the L2s could not be made to feel like one place, scale the base layer itself. Fusaka activated mainnet on 3 December 2025 (<a href="https://inevitableeth.com/ethereum/data-availability-sampling">PeerDAS</a> and blob scaling; EIP-7935 raised the default gas limit to 60M; EIP-7918 added a blob fee floor). A 200M post-Glamsterdam gas-limit floor was set in May 2026; Glamsterdam itself (<a href="https://inevitableeth.com/ethereum/pbs">ePBS</a> plus block-level access lists, the path to 200M gas) is targeted for H2 2026 and entered final devnet around 16 June 2026. On <a href="https://blog.ethereum.org/2026/06/23/ef-structure">23 June 2026</a> the Foundation reorganized, cutting about 54 roles (~20% of staff) and moving to a leaner endowment with roughly a 40% budget cut; Vitalik: <em>"I respect my EF colleagues far too much to pretend that there was not much that is lost."</em></p>
</div>
</details>

## 5. On Probation

His own words reopen something, even if they settle nothing.

In [early February 2026](https://x.com/VitalikButerin/status/2018711006394843585) Vitalik Buterin said the original vision of L2s no longer makes sense and that Ethereum needs a new path. He said to stop treating L2s as branded shards of Ethereum and to start treating them as a full spectrum of systems sitting at different distances from it, each one something a person is free to care about or ignore. He said that an L2 running ten thousand transactions a second behind a multisig bridge is not scaling Ethereum at all.

Two days later, more bluntly, he said the network does not need more copy-pasted EVM chains. In [March](https://blog.ethereum.org/2026/03/23/l1-l2-ethereum) the foundation followed with the same revision in slower, institutional language: the job of an L2 is no longer to scale Ethereum but to differentiate, while the base layer becomes the [settlement](https://inevitableeth.com/concepts/settlement) hub the whole onchain economy answers to.

This doesn't kill the rollup-centric roadmap; what that actually buries is narrow. The thing being lowered into the ground is the generic rebranded EVM chain dressed up as a shard of Ethereum. Scaling Ethereum by attaching a new Ethereum.

It was never the dream, and admitting so out loud is closer to relief than to loss. But a man reframing a vision is not the same as a vision surviving, and I think we deserve a new vision to replace the rollup-centric roadmap.

The reality is that as of June 2026, we do not have a clear vision of the future of Ethereum. Maybe that explains a lot of the malaise that's currently weighing Ethereum down. But we do have hope.

We have a lot of compelling technical ideas that will finally address the cross-chain UX issues. We have increasingly incredible advances in [zero-knowledge cryptography](https://inevitableeth.com/concepts/zk-proof) that are vastly expanding how expressive an L2 can be. We have put a massive amount of effort into scaling the L1 to hopefully make it a viable place for regular blockchain activity again.

We have all the ingredients. Get deep enough in the weeds and you'll build faith that the path forward exists, even if you haven't quite mapped it out yet. But you will see a glimpse of the future. And here's what you will see:

The rollup-centric roadmap is no longer our north star, but it's in our constellation. Ethereum will become the [World Computer](https://inevitableeth.com/ethereum/world-computer), an internet-native, [credibly neutral](https://inevitableeth.com/concepts/credible-neutrality) [property layer](https://inevitableeth.com/ethereum/property-rights) that will evolve into the core infrastructure backing the global (and digital) economy.

But until that vision comes together and until we can inspire our community with the story of Ethereum, we will remain here.

Lost in the dark forest.

<details class="essay-collapse">
<summary>The survivors, and how far they have to go<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>The proponents' chain of reasoning runs in order: prove the base layer fast and cheap, then use that proving to scale the L1 safely, then let rollups inherit the same proving and drop their training wheels, then hand sequencing back to Ethereum so the chains stop being islands. The first link is the one that actually shipped; the rest are real but unfinished.</p>
<p><strong>Real-time proving (shipped, as a capability).</strong> The Foundation declared its target met around 18 December 2025: roughly 99% of mainnet blocks provable in seconds on target hardware, with proving cost down about 45x. It was independently reproduced by Succinct (SP1 Hypercube, 99.7% of blocks under 12 seconds) and ZisK, and <a href="https://ethproofs.org">Ethproofs.org</a> stood up as an EF-backed neutral scoreboard so the claims could be checked rather than trusted. This is the load-bearing "it is real now" evidence, because everything else on the list depends on proving being cheap: an L1 that can prove itself can raise its limits without asking every node to re-execute everything, and rollups that inherit that proving no longer need their own councils.</p>
<p><strong>Based rollups (partially shipped).</strong> Taiko activated preconfirmations on mainnet around August 2025, in a permissioned phase, with the fully decentralized version still gated. The idea is to hand the ordering of transactions back to Ethereum's own validator set instead of a single company server, which removes the centralized-sequencer wart and, just as importantly, lets rollups that share Ethereum's sequencing transact with each other atomically again. Shared sequencing is the most credible path back to the <a href="https://inevitableeth.com/ethereum/de-fi">composability</a> that fragmentation took away.</p>
<p><strong>Native / enshrined rollups (research and early proof-of-concept).</strong> EIP-8079, an <code>EXECUTE</code> precompile drafted on 13 November 2025 by Luca Donno of L2BEAT and Justin Drake of the EF, would let an L2 inherit L1 proving directly and shed its security council, turning "trust the operator for now" into "verified by Ethereum itself." Vitalik said in January 2026 he was <em>"definitely more in favor of native rollups than before."</em> The enshrined <a href="https://inevitableeth.com/ethereum/taxonomy">ZK-EVM</a> precompile that goes with it would auto-upgrade alongside the base layer, so rollups stop drifting away from Ethereum every time it changes. The L1 zkEVM effort underneath all of this pivoted toward provable security, a ≥100-bit target by Glamsterdam, after some of the STARK soundness conjectures it relied on were broken. These are targets, not achievements.</p>
<p><strong>Stage status (the unfinished trust model).</strong> <a href="https://l2beat.com">L2BEAT</a> grades rollups by "stage," from Stage 0 (a security council can still override the chain) to Stage 2 (it effectively cannot). Five years in, no economically dominant L2 is past Stage 1: Arbitrum, Base, OP, Starknet, and Scroll all top out at Stage 1 with security councils, while zkSync Era and Linea are still Stage 0. The first chain to reach Stage 2 was Aztec, a small privacy-focused L2, around 22 to 23 June 2026, with total value secured across all L2s at roughly $39.6B. That is the whole tension in one number: the trust-minimized endgame is real enough that a tiny chain just reached it, and far enough away that none of the chains holding the actual money have. The trust model is still unfinished, which is exactly why a reframing proves nothing and shipping proves everything.</p>
</div>
</details>
