---
title: "Decentralization Theater"
date: 2026-06-29
description: "Crypto spent a decade performing decentralization to earn a legal status most projects never had, then proved the performance hollow every time a founder's bag settled a vote. A hard look at governance theater, the securities law that made the costume worth wearing, and how far down the question goes."
tags: ["ethereum", "decentralization", "dao governance", "regulation"]
image: "https://cdn.rexkirshner.com/blog/decentralization-theater-banner.webp"
---
<p class="essay-lead">We spent a decade performing decentralization to earn a legal status most of our projects never had. And the question we keep avoiding is a simple one: how much of it was ever real?</p>

## 1. Which Color Lambo

DegenSpartan, on who actually decides:

![A snapshot poll that flips the instant the founder votes, because a handful of wallets hold the power](https://cdn.rexkirshner.com/blog/decentralization-theater-poll.webp)

Be in this industry long enough and eventually someone will send you this tweet. In June of 2026, it is almost certainly pinging around group chats as people try to come to consensus on the ENS fight.

Tl;dr ENS, considered one of the few Ethereum success stories and akin to core infrastructure, is in the middle of a crisis. The founder has delegated roughly half the voting supply to himself in order to move a few hundred million dollars into a foundation he would help run. The community cannot agree whether this is the next era of governance or a hostile takeover.

But this is not a particularly novel story. In fact, it's something we see every day in this industry.

Somewhere right now, a DAO contributor is desperately trying to call on enough token holders to reach quorum in order to deploy a fix to an urgently critical vulnerability. Elsewhere, a protocol co-founder is preparing to drain a treasury by forcing a governance vote using his outsized voting power. In the darker corners, a hacker is looking for the next opportunity to first extract a large number of governance tokens and then use that power to attack a protocol.

We called all of it [decentralized](https://inevitableeth.com/ethereum/decentralization), and we claim it's the differentiating factor between crypto and fintech. We put the word on the landing pages and in the pitch decks and in the first line of the Discord welcome. And one day you stop and ask the question the whole industry seems to be carefully avoiding.

Was any of it real?

<details class="essay-collapse">
<summary>The ENS fight, as it stands<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>The Ethereum Name Service (ENS) maps wallet addresses to human-readable names (similar to how DNS maps IP addresses into domain names and URLs). It is run by the ENS DAO, where holders of the ENS token vote on the treasury and the project's direction. A company called ENS Labs handles core development. By crypto standards it is a real success, and it is widely treated as core infrastructure.</p>
<p>On 19 June 2026, ENS Labs posted a <a href="https://discuss.ens.domains/t/temp-check-next-era-of-ens-dao-empowering-the-ens-foundation/22175">"temp check,"</a> a non-binding straw poll meant to gauge support before any formal vote, titled "Next Era of ENS DAO." It proposed moving the DAO's treasury, grants, and daily operations under an expanded ENS Foundation board, on the argument that running operations through slow, yes-or-no token votes had stopped working. The assets involved are large: roughly an $86.9M endowment, a ~$56.6M operating wallet, and ~$250M in ENS tokens, about $390M in all.</p>
<p>The fight is over how it would pass. Founder Nick Johnson said he would delegate his own sizable ENS holdings to himself and vote it through, which delegates estimated at roughly half the DAO's voting supply. To supporters, that is a founder using votes he legitimately holds to push through a restructuring the project needs. To critics, one person moving a ~$390M treasury into a foundation he would help run is "treasury capture"; delegate Lefteris Karapetsas concluded "there is no DAO anymore," and Security Council member Brantly Millegan argued that a single entity "voting themselves the treasury against the wishes of the rest of the community… is, by all common definitions, a governance attack."</p>
<p>There is a backstop, with a wrinkle. The ENS DAO has a Security Council, a four-of-eight multisig that can cancel a malicious proposal, but its authority expires on 24 July 2026. A renewal is already underway and Johnson supports it. Everyone agrees the Council should exist to stop attacks; what no one can agree on is whether this proposal is one. As of this writing it remains a temp check, and unresolved.</p>
</div>
</details>

## 2. The Poll Was Right

DegenSpartan's poll runs 89 to 11 against the founder, then 96 to 4 with him the moment he weighs in. Nothing was rigged in any technical sense, and yet it is hard to call the result credibly decentralized. Were the voters just following the leader? Does the founder have influence over the whales who voted with him? Is there even enough voting power to vote down the founder?

The vote is (at best) a courtesy; the founder does not need it. He is holding the votes himself, if not directly then through proxies he can count on (or maybe even through anonymous wallets that are secretly under his control). This is alarmingly common: across the major DAOs, less than one percent of holders control about ninety percent of the voting power, and in most of them fewer than ten people hold enough to decide any vote at all.

And it is not only the votes. Michael Egorov, the man behind Curve Finance, held so much of CRV himself that the line between the protocol and the person all but vanished. In 2023, after an exploit knocked the price down, his personal position, roughly $95M borrowed against $140M of CRV, came so close to liquidation that selling his bag to cover it could have dragged Curve down with him. A founder does not need to capture the DAO, because he probably already is the DAO.

On-chain governance sells itself on transparency: every vote is public, anyone can audit it. But the ledger shows you wallets, not the people behind them.

When the European Central Bank went looking, it could not identify roughly a third of the most powerful voters in the DAOs it studied. A vote spread across thousands of addresses might be a real crowd, or it might be five people in a group chat wearing five thousand wallets, and from the outside there is no way to tell. "Decentralized" turns out to be a claim no public ledger can confirm.

The problem is not only this ambiguity, which shades into dishonesty. Decentralized systems also invent failure modes the traditional financial system never had to imagine.

In October 2022, Avraham Eisenberg exploited Mango Markets and then used his ill-gotten voting power to vote himself a bounty. In April 2022, Beanstalk lost $182M in a single block: someone borrowed a billion dollars for 15 seconds, bought a two-thirds supermajority of Beanstalk governance tokens, passed his own proposal, and repaid the loan before the block closed. Every step legal and on-chain and "by the rules." When the vote is the only legitimacy a system has, whoever can afford the vote owns the legitimacy.

DegenSpartan had it exactly right.

Perhaps the most ironic version of this story belongs to Aragon, a protocol built to facilitate governance. It built and sold the software other projects used to run their DAOs, operationalizing on-chain voting it spent years telling everyone to believe in. Then, in a move that T. Boone Pickens would admire, a group of its own token holders realized the treasury was worth more distributed than locked behind the DAO, and moved to vote it into their own hands. The machine doing exactly what it was built to do. Aragon called them a "51% attack," shut them out of their own community, and wound the whole project down rather than let the vote stand.

The company that sold decentralized governance to the rest of us would not live under it for a single afternoon.

<details class="essay-collapse">
<summary>The numbers, and the disasters<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p><strong>How concentrated it actually is</strong></p>
<p>Across major DAOs, <a href="https://www.chainalysis.com/blog/web3-daos-2022/">Chainalysis</a> found that less than 1% of holders hold 90% of the voting power, and that only about one in ten thousand holders owns enough to pass a proposal at all. An <a href="https://arxiv.org/pdf/2302.12125">ETH Zurich study</a> of 21 DAOs sharpened the picture: in 17 of them, fewer than ten participants together controlled a majority of the vote, and for half the Nakamoto coefficient (the number of entities that would have to act together to control the outcome) was three or less. Most of those participants are delegates rather than ordinary holders, so the real electorate is even smaller than the token counts suggest.</p>
<p><strong>Mango Markets: voting to keep the loot</strong></p>
<p>In October 2022, Avraham Eisenberg pumped the price of Mango's own token on a thin oracle, borrowed against the inflated collateral, and drained roughly $110M from the protocol. He then used the MNGO he still controlled to pass a governance proposal that let him keep about $47M as a "bounty" and return the rest, with the DAO agreeing not to pursue charges. He argued in public that it was simply "a highly profitable trading strategy" the code allowed. A jury convicted him in 2024; in 2025 the convictions were vacated on improper venue and the absence of any terms of service to misrepresent, a technicality rather than an exoneration.</p>
<p><strong>Beanstalk: a majority on loan</strong></p>
<p>In April 2022, an attacker took out about a billion dollars in flash loans, used them to buy a two-thirds supermajority of Beanstalk's governance token, passed his own proposal, and repaid the loans, all inside a single transaction. The proposal drained roughly $182M; a companion proposal donated $250k to Ukraine, cover to make the package look benevolent. Beanstalk had no timelock and no flash-loan-resistant snapshot, so the treasury was always one large loan away from whoever wanted it, and the BEAN stablecoin lost its peg almost immediately.</p>
<p><strong>Aragon: the governance company that wouldn't be governed</strong></p>
<p>Aragon's entire business was selling the software other projects used to run their DAOs. In 2023 a group of activist holders, including the fund Arca, noticed the treasury was worth more than every ANT token combined and moved to use Aragon's own governance to claim it, the "risk-free value" play familiar to any 1980s corporate raider. The Aragon Association called them a "coordinated social engineering and 51% attack," restricted the community from its own Discord, and wound the project down, eventually redeeming a treasury of 86,343 ETH rather than let the vote stand.</p>
<p><strong>Curve and Egorov: one wallet, most of the float</strong></p>
<p>Curve's voting power runs on veCRV, much of which a single aggregator, Convex, came to control during the "Curve Wars," so even the votes were never as distributed as they looked. The founder, Michael Egorov, personally held a commanding share of CRV itself. When the July 2023 exploit knocked the price down, he turned out to owe roughly $95.7M against about $141M of CRV spread across five lending markets, a position so large that his own margin call became a threat to Curve's solvency (CoinDesk, August 2023).</p>
</div>
</details>

<details class="essay-collapse">
<summary>Why you can't verify decentralization at all<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>To verify a system is decentralized, you would have to know that its many wallets are many different people. On-chain, you cannot. The ledger shows addresses, not identities, and one person can run ten thousand wallets as easily as one. So a vote spread across thousands of addresses is indistinguishable, from the outside, from a vote that a handful of people split across thousands of addresses they all control.</p>
<p>This is not hypothetical. Running many wallets to look like many people is a whole cottage industry: analysts flagged roughly 148,000 "sybil" addresses in the Arbitrum airdrop alone (about 21.8% of it), and Hop disqualified 10,253 of 43,058 "eligible" wallets as one-person farms. The ECB, studying <a href="https://inevitableeth.com/ethereum/de-fi">DeFi</a> governance with far more resources than you have, still could not identify about a third of the most powerful voters.</p>
<p>This is why "decentralized" is unfalsifiable. You can sometimes prove a system is concentrated, when one labeled address holds everything. You can never prove it is not, because hidden concentration looks exactly like genuine breadth. The word describes something no public ledger can confirm.</p>
</div>
</details>

## 3. What the Word Was For

So why do we all keep saying it? Partly because, in the beginning, we really believed it... and some still do. But also because the word does real legal work.

This all comes down to American securities law, which turns on a single question: are you betting on the efforts of someone else? If a token's value rides on a team building something, the token is an investment contract, a security. And selling a security without registering is illegal.

But securities law was created long before crypto was thinking about this question. So obviously, it never contemplated an autonomous protocol operating on a permissionless public blockchain.

In the words of an SEC official's [2018 speech](https://www.sec.gov/newsroom/speeches-statements/speech-hinman-061418), if the network is "sufficiently decentralized," then there is no team whose efforts you are relying on, and the security quietly dissolves. Decentralization stopped being an aspiration and became a tactic: it converts an illegal security into a legal token.

This isn't a hot take from a dedicated critic. This is the playbook, written down by the people who profit from it. a16z's own [guide](https://a16zcrypto.com/posts/article/progressive-decentralization-crypto-product-management/) said true decentralization could let a token "transmute from a security to a non-security," and named "regulatory compliance" as a reason to pursue it. Their general counsel wrote, [plainly, in 2025](https://a16zcrypto.com/posts/article/defining-decentralization-control/), that "the substantial legal benefit of avoiding securities laws" was exactly why developers had been "reducing elements of control over their projects."

Real decentralization carries a cost the founders never advertise. With no company in the middle, a leaderless DAO can be treated in court as a general partnership, which makes everyone who votes personally liable for what the collective does. A federal court said exactly that about Lido's token holders in 2024, and a regulator won the same point against Ooki DAO a year earlier.

So almost nobody goes that far. Projects wrap themselves in foundations and Wyoming legal entities instead, structures built (in a16z's own words) to shore up the "arguments against the application of securities laws" while changing nothing about how the protocol is run. Uniswap is the clearest case: it refused to turn on a fee it had always controlled, year after year, then switched it on within months of getting a legal wrapper. You do not build a wrapper to become more decentralized; you build it to keep the benefit of the word while staying as centralized as before.

Gabriel Shapiro, crypto's (probably) most famous lawyer, [named all of this in 2019](https://medium.com/coinmonks/size-does-matter-part-1-9f83b130a451). He called it "decentralization theater," done "to keep the regulators off their backs." We have been running his bit for six years.

Which brings up the part we do not like to say, because it complicates the story we've been telling ourselves since at least 2022.

The loudest, most unifying grievance of those years was that the government was unfair, that Gary Gensler's SEC was running a crusade, regulating by enforcement, never giving us a fair shot.

Some of that was true and worth conceding. A federal judge found the SEC committed a "gross abuse of the power entrusted to it by Congress," freezing a company's assets on a story about closed bank accounts that turned out to be false. Clear, unacceptable overreach.

In the end, whether or not Gary Gensler was a good guy wasn't really the question. While we were calling ourselves persecuted, we were also running unregistered exchanges, selling tokens we had carefully shaped to look ownerless, and settling governance votes with a founder's bag.

We paid armies of lawyers to engineer around rules we said were too unclear to follow. You cannot be lost in the fog and expertly navigating it at the same time.

<details class="essay-collapse">
<summary>"Sufficient decentralization," from speech to self-certification<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>It started as a speech. In June 2018, an SEC official said that a <a href="https://www.sec.gov/newsroom/speeches-statements/speech-hinman-061418">"sufficiently decentralized"</a> network's token might not be a security. The talk carried a footnote disclaiming that it was even Commission policy, and years later, in the Ripple case, a court found the documents behind it "do not relate to an agency position, decision, or policy." The entire doctrine rests on one official's personal opinion, said out loud once.</p>
<p>The industry built on it anyway. By 2022 there was a literal how-to: Marc Boiron's <a href="https://variant.fund/articles/sufficient-decentralization/">"Sufficient Decentralization: A Playbook for web3 Builders and Lawyers,"</a> which works backward from the legal test, engineering a project to look decentralized enough to defeat it.</p>
<p>From there it hardened into a number. A "20% control" threshold moved from a 2021 SEC commissioner's proposal into the CLARITY Act (passed by the House in July 2025, not yet law), which lets a project certify to the SEC that its own blockchain is "mature." If the SEC says nothing for 60 days, it is mature by default.</p>
<p>Then, in March 2026, the SEC finally wrote down a definition of "decentralized," and promptly defanged it. The definition is non-binding, and whether a project qualifies is measured against "how the issuer defined or otherwise described decentralization," not any outside standard. You grade your own homework.</p>
<p>And the reason everyone wants the grade is liability. A genuinely leaderless DAO can be treated as a general partnership (Ooki DAO, 2023; Samuels v. Lido DAO, 2024), which is why Cayman foundation formations jumped about 70% in a single year, tracking a court ruling rather than any decentralization milestone.</p>
</div>
</details>

<details class="essay-collapse">
<summary>The enforcement war, and who actually lost it<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>Strip away the rhetoric and most of the Gensler-era cases were about a single thing: running a securities business without registering. Coinbase and Kraken for operating unregistered exchanges and staking programs; Consensys for MetaMask; a Wells notice to Uniswap. Binance was the outlier, with real fraud allegations, and its founder separately pleaded guilty and paid about $4.3 billion.</p>
<p>Almost all of it was <a href="https://www.sec.gov/newsroom/press-releases/2025-47">dropped in 2025</a>, once the administration changed. The dismissals themselves are careful to say the cases were let go "not on any assessment of the merits." A new administration deciding not to pursue a case is not the same as the charges being wrong.</p>
<p>The industry's grievance was real, and the SEC's own people now admit it. Commissioner Hester Peirce <a href="https://www.sec.gov/newsroom/speeches-statements/peirce-statement-coinbase-022725">conceded</a> the agency had left companies to "divine whether the Commission would deem a particular product a security from clues dropped into the Commission's complaints." That is regulation by guesswork, and it was genuinely unfair.</p>
<p>Then there is the one case that actually reached a judge. In Ripple, the court found that the company's institutional sales of XRP were unregistered securities, and the $125 million penalty survived even the crypto-friendly SEC of 2025. When someone neutral looked at the conduct on its merits, the industry lost.</p>
<p>So the campaign was absolute and the reversal was just as absolute, which is reason enough to trust neither. And the most visceral grievance of all, the debanking, regulators leaning on banks to cut crypto companies off, was mostly the work of the FDIC and other banking supervisors, not the SEC. Blaming the SEC for that is how a banking fight got folded into a securities fight to make the persecution story bigger.</p>
</div>
</details>

## 4. All the Way Down

It would be easy to stop here, with the decentralization theater of the app layer, but what about the base layer?

What about Ethereum?

Ethereum's entire value prop, the only justification for tolerating a slow, confusing and expensive computer when AWS is sitting right there, is [credible neutrality](https://inevitableeth.com/concepts/credible-neutrality). And credible neutrality derives directly from decentralization. So if decentralization is mostly theater, what does that imply about Ethereum?

The conversation around Ethereum decentralization always starts with Lido. In order to interrupt Ethereum, you need to control 1/3 of [staked ETH](https://inevitableeth.com/ethereum/pos); in order to take control, you need 2/3. At its peak in 2023, Lido controlled over 32% of staked ETH and today they still hold 20%. But then or now, add in Binance and Coinbase and you have enough ETH to cause serious issues.

Since the beginning, one of the core principles of Ethereum is that it should be easy and cheap enough to become a home staker for everyone... and yet we've never really lived up to that promise. Running a [node](https://inevitableeth.com/ethereum/node) takes considerable technical skill, and the 32 ETH minimum means you need tens of thousands of dollars to participate. And, unfortunately, the share of home stakers is relentlessly shrinking.

The result: The base layer's neutrality rests, right now, on a small number of large operators choosing to behave.

Then look at the software and who controls it. The chain runs on clients written by a handful of teams. On the consensus side a single one of them runs around half the validators, enough that one bug could halt the entire network. In December 2025 we got a preview: a flaw in a much smaller client knocked a quarter of validators offline and the chain came within a few points of being unable to agree on its own history, and it held only because that client was a minority one.

The upgrades that decide what Ethereum even is, meanwhile, are settled by rough consensus among those same client teams and the Ethereum Foundation, with no formal vote anywhere.

There is also the part almost no one sees: how blocks get built. Most of them are now assembled by a small number of specialized "builders" and routed through a few "relays," a private layer sitting between the validators and the chain. For a stretch after the 2022 Tornado Cash sanctions, a majority of that pipeline was quietly filtering out transactions to stay on the right side of US law, which is precisely the censorship the whole machine is supposed to make impossible.

And if Ethereum ever split in a real fight, the question of which chain is the "real" one might not be settled by the validators at all. It could be settled by Tether and Circle. Their [stablecoins](https://inevitableeth.com/ethereum/stablecoins) are the dollars actually moving on-chain, and whichever fork they keep honoring becomes, in practice, the one that counts. The most credibly neutral ledger ever built could still have its winner chosen by one of two private companies.

None of this means Ethereum is captured; in fact, for all of the risks to decentralization and credible neutrality listed above, Ethereum is far and away the most aggressive about addressing these issues. Almost every other chain has 1) a much higher concentration of stake, usually directly controlled by the foundation and the founders 2) a single client, meaning any bug in the software automatically takes the chain down 3) zero attempts to address the centralization risks in MEV's dark forest.

But still, these are not footnotes. They are the questions Ethereum's whole promise rests on, and if enough of them go the wrong way, the credibly neutral [world computer](https://inevitableeth.com/ethereum/world-computer) is just AWS with so much baggage it's basically unusable.

We do not have the answers yet, but we are working on them.

<details class="essay-collapse">
<summary>The base layer, honestly<span class="essay-collapse-hint">Deep dive</span></summary>
<div class="essay-collapse-body">
<p>Staking is the first place to look. Lido, a single staking pool, peaked near 32% of all staked ETH in 2023, brushing the one-third line where one entity can begin to stall the chain. It has drifted to near 20% since, but the telling moment came in 2022, when its own token holders were <a href="https://www.theblock.co/post/155070/lido-community-strongly-against-limiting-its-ethereum-staking-dominance">asked to cap its growth</a> for the network's health and voted no by about 99.8%. Lido's 2025 "Dual Governance," which hands ETH stakers a brake on the token holders, exists precisely because that much concentration poses an existential risk to Ethereum.</p>
<p>Then there are the clients, the software that actually runs the chain. No execution client is dominant today: Geth and Nethermind sit roughly co-equal in the low 40s, down from Geth's old ~85%. But on the consensus side, one client runs about 54% of validators on <a href="https://clientdiversity.org/">most dashboards</a>, past the one-third mark where a bug can stall finality and two-thirds of the way to the 66% line where a bug can split the chain in two.</p>
<p>We found out how thin that margin is in December 2025. A bug in a minority client knocked enough validators offline to drop participation to about 74.7%, only a few points above the two-thirds the chain needs to keep finalizing. It held, but only because the broken client was the minority one. Diversity saved it, that time.</p>
<p>Underneath all of it, upgrades pass by "rough consensus" among a handful of client teams and the Foundation, with no formal vote anywhere. A longtime core developer publicly called that arrangement too centralized in 2025.</p>
<p>None of this means the base layer is captured, and the counterweight is real. In 2016, the minority that rejected the DAO fork simply kept running the old chain as Ethereum Classic, proof that no core team can force an upgrade on people who refuse it. These numbers also drift month to month. Treat them as a temperature check, not a verdict.</p>
</div>
</details>

## 5. Be a Company

So what can we say about decentralization?

Ethereum's decentralization is real. Not finished, not perfect, still drifting and improving, but real. There are people running validators in their closets who have never met and owe each other nothing, and together they keep a ledger no one can quietly rewrite. That is our north star, and it is the part you believed in if you believed in any of this.

It was the right thing to believe in.

But the thing we managed to get backwards for years: it is completely fine to build something centralized on top of it. Good, even. The sin was never the centralization. A company can run a centralized exchange or a centralized rollup, and say so out loud, and that is honest work that makes the whole thing more useful. The issue was the costume: claiming a decentralization you do not have, because the word was worth money, or worth a legal exemption.

The truth is something that rarely makes it into the maximalists' conversation. Ethereum is for everyone. For corporations and governments and ordinary individuals and the genuinely decentralized few, all at once. Some things are better run by a company with a CEO you can fire and a court you can sue, and the base layer [settles](https://inevitableeth.com/concepts/settlement) their transactions just as faithfully as it settles a DAO's. You get its neutrality underneath you whether or not you reproduce it on top.

You can build a perfectly ordinary, perfectly centralized business on a credibly neutral ledger, and the ledger is the part that was always the point.

The demand is simpler, and harder, than "decentralize or die": stop performing. If you are a company, be a company. And if you are building a decentralized application, great! But you need to be able to explain why... and the explanation needs to be better than "well this is just how you build in crypto."

The founder is going to buy the yellow lambo. He always was. It's time to acknowledge that.

And it's time to make decentralization real again.
