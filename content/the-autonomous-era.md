---
title: The Autonomous Era
date: 2026-02-20
abstract: >-
  We keep saying "autonomous" without saying what it means. Here is the
  definition I am working from, the three things standing in the way, and the
  reliability target that follows from taking it seriously.
tags: [autonomy, agents, healthcare]
---

We've been talking about this for quite a while — we keep saying "autonomous, autonomous, autonomous" — but what do we mean by autonomous, and how does it even work?

The best thing that happened over the past three years was the launch of **ClawdBot (OpenClaw)**. Not because it's a nicer chatbot, or a more intelligent one, but because it worked **autonomously** — stitching over fifty tools, libraries, and platforms into one system. It made it feel magical.

The ClawdBot can go and read my Twitter, save my tone of voice into a simple markdown file, and schedule a post autonomously. It doesn't stop there — it can do this all over again, every time, every day.

> This is what we mean by autonomous: an agent that sits on the doctor's EHR, keeps a pulse and checks every few hours for any changes, then autonomously takes the next best action, the next best decision, without any human interaction.

## The hard truth

Before talking about how we have to move to building autonomous agents as fast as we can, I want to acknowledge the **top three challenges** in the company today:

1. **Integration speed and quality** — blocking revenue growth.
2. **Audio capture stability** — inherited tech debt in Copilot.
3. **Database and platform issues** — the scalability ceiling in Firebase.

We're making progress. But for the next `4–6` weeks, we're taking this seriously. One hundred percent.

## Revolution, meaning enterprise-ready

In order for us to move to the next phase, we're going to hyper-focus for the next four to six weeks on integration, and on moving the platform from where it is to where it has to be.

```figure Reliability target, expressed as permitted annual downtime.
                availability    downtime / year
today                99.95%     ≈ 4 h 23 min
target             99.9999%     ≈ 32 s
```

That is a `500×` reduction in tolerated failure.[^nines] This will be our **highest priority in the company.**

In the next `6–8` weeks, we need to push as hard as we can — not just to look like a larger enterprise company such as Athena or Cerner, `$20` billion of technology that still breaks on clinicians every month, but to build a **revolutionary platform that clinicians can rely on completely.**

Yes, I mean it. **One hundred percent uptime and stability.**

Building an enterprise is very hard. Not because you need to get things right, but because you need multiple backups for everything — and on top of all that, you need the infrastructure to support it.

[^nines]: Called "quadruple nines" internally; strictly it's six nines. The label matters less than the arithmetic: every additional nine is a ten-fold cut in the failure budget, and the last two are paid for in architecture, not effort.

## The autonomous position

> "If you guys can do this for healthcare, this can truly disrupt the entire healthcare industry."
>
> *— Chief of Staff, after watching our intelligence layer run*

We're extremely lucky to be in this position today as a healthcare AI player. We're in the **best position** because we don't have the huge number of customers that would make us too slow to move — and we're not too small either. We have customers who will literally try anything we tell them.

This is the best time to build a `$20` billion company: the ClawdBot for healthcare.

Our focus over the next few weeks will be on defining the **core functions that all our agents perform**, and on getting the team aligned on how agents safely collaborate and work autonomously for our customers.

It's not going to be easy, but it'll be **hella fun.**
