---
title: "The Age of (Zero) Knowledge"
date: 2023-05-01
description: "Polygon open-sourced the zkEVM and changed everything. Why the most important moment in Ethereum scaling wasn't a launch — it was an invitation to build."
tags: ["ethereum", "zk-rollups", "scaling"]
image: "https://cdn.rexkirshner.com/blog/age-of-zero-knowledge-banner.webp"
---

*Original Appearance: <a href="https://www.thepond.wtf/posts/the-age-of-zero-knowledge" target="_blank" rel="noopener noreferrer">The Pond</a>*

For the last year or so we've been witnessing a particularly desperate scramble to be "the First ZK-Rollup." The first time I can remember noticing it was when Steve Newcomb went on Bankless to describe the implications of the zk-EVM. Since then it's been clear that AT LEAST 3 different teams were racing to deploy first.

From then until now I've only been interested in the concept, not the implementation. During that time I've worked to develop a good understanding of what a ZK-Rollup is and how the technology is being incorporated into the core design of the Ethereum protocol. Suffice to say, I believe that ZK-Rollups will not only scale Ethereum, but will also usher in a new era of distributed computing.

So as the builders raced, I rested easy knowing that we were well on our way to the Ethereum that will change everything: the World Computer. Even as my attention drifted towards other parts of the Ethereum roadmap, the signs were impossible to ignore. For example, at the end of 2022 Vitalik mentioned that the thing that surprised him most was that we are so far ahead of schedule on the zkEVM, we might see a ZK-Rollup before we finish implementing optimistic rollups.

We all knew it was coming, but when I heard "soon" I really heard "soonTM." So I have to admit, I was caught off guard the weekend of March 24th when, not one but TWO, ZK-rollups announced open beta. First, on Friday, zkSync launched zkSync Era for open beta. And then, on Monday March 27th, Polygon opened up the zkEVM for public beta.

## A Moment Worth Celebrating

At this moment we must pause and celebrate the achievement. It's been clear that rollups (and more specifically ZK-rollups) are the key to Ethereum scaling for a while now, so it's easy to let the moment pass without noticing. But the alluring simplicity of the concept of a ZK-rollup covers up its incredibly complicated implementation. There is no easy way to manipulate computation through an elliptic curve. The fact that we are here at all (and in 2023 and not 2025) is an incredible achievement.

And incredibly bullish for Ethereum.

## The Real Announcement

This moment marks the beginning of the ZK-rollup era — a moment that I believe will gain significance with hindsight. But, at least for me, the action that signaled the beginning of this new age was not the launch of public betas. In fact, it wasn't a launch at all.

It was when Polygon made their second announcement, one that often finds itself left out of the Crypto-Twitter mania: the zkEVM (and infrastructure needed to run it) would launch as a fully open sourced project.

Open source is a term that describes a project with publicly available code that anyone can audit, distribute, modify, or use in any way they want. There are many reasons open source has become such an incredibly important method of development, but we'll focus on one: open source facilitates open collaboration.

At the risk of completely derailing this discussion, let us ask "what makes humans different from all other life?" Infinite answers are equally correct, but for me one stands above all others: humans collaborating together can solve (nearly) any problem. The history of mankind is the process of collaborating across larger and larger groups of humans, eventually resulting in the internet. And the internet allows us to express perfect collaboration: "look at what I built; make it better, build it into something bigger, use it to change the world."

And so, on March 27th, Polygon not only invited users and protocols to move over to the zkEVM, they invited every builder interested in crypto, distributed computing and ZK cryptography to build on top of the zkEVM…

To use it to change the world.

## Frax Finance: A Case Study

It's easy to paint with strokes as broad as these, let's look at an example. Many to choose from, so I'll just pick: Frax Finance.

Frax Finance was launched at the end of 2020 and since then it has grown to an incredibly complex protocol; just describing how it works would double the length of this article. Here's the background you need to know: the Frax protocol was born as a stablecoin, but has since grown to include a trading platform (Fraxswap), a lending/borrowing platform (Fraxlend) and an ETH staking platform.

For a while now, we've gotten hints that (eventually) we will see Frax launch a Fraxchain — a rollup for all things Frax. For Frax (in particular), it is incredibly logical to move to an independent chain. Not only are there many configuration and performance modifications Frax might want to make, there's also a compelling economic reason: MEV. Today, when MEV bots extract value, they remove it from the Frax ecosystem. But with Fraxchain, Frax has control where that value accrues; instead of giving it to the MEV bots, maybe it will award it to veFXS stakers. The design space is wide open.

2 months ago, a ZK-Fraxchain was so far out in the distance that it was hard to imagine. But today? Because Polygon open sourced the zkEVM, the zkNode and the zkProver, it will probably take more time to read through the code than it will to redeploy as Fraxchain. Even better, when this hypothetical Fraxchain launches we will already feel comfortable using it… it's just using Polygon's (by then) battle tested code!

## The Dawn of the World Computer

But this isn't really about Polygon's technology or even really about their decision to open source it. Polygon did it first, and they deserve recognition (and will probably reap first-mover advantage), but they are not unique. All of the zkEVM projects I'm aware of plan to open source and support a roadmap of shared sequencers — zkSync's Steve Newcomb explicitly laid out those plans last March.

So while Polygon rings the bell that begins a new chapter, all ZK-rollup teams will build this new future and all users will benefit. Frax is one example but there are countless others. Any protocol that offers vertically integrated financial services (and therefore subjects their users to consider MEV risk) will benefit from this kind of strategy. As will more niche applications, like gaming or scientific applications. And assuming all applications use the same (or compatible) underlying zkEVM technology, all of these app chains will seamlessly integrate, removing any concerns about liquidity or bridging.

The first half of 2023 will always be an important era in the history of Ethereum. Not only did we deliver Shanghai/Capella and complete the change to Proof of Stake, we arrived into a new paradigm of Ethereum scaling.

Welcome to the dawn of the World Computer!
