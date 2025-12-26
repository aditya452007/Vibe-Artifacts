---
title: "Chain of Thought"
description: "Unlocking complex reasoning capabilities through sequential logic."
order: 4
icon: "Cpu"
---

# Chain of Thought (CoT)

Standard LLMs are optimized for pattern matching and "fast" thinking (System 1). However, they often struggle with tasks requiring logical, sequential reasoning (System 2). **Chain of Thought** (CoT) is a prompting technique that forces the model to generate intermediate reasoning steps before arriving at a final answer.

## The Dual Process Theory
Based on the work of psychologist Daniel Kahneman, humans have two modes of thought:
- **System 1:** Fast, instinctive, and emotional.
- **System 2:** Slower, more deliberative, and logical.

CoT effectively shifts the AI from System 1 "guessing" to System 2 "computation."

## 1. Zero-Shot CoT

The simplest implementation is **Zero-Shot CoT**. By appending a specific trigger phrase to your prompt, you activate the model's latent reasoning capabilities without providing any examples.

> **"Let's think step by step."**

### Why It Works
When an AI generates text, each word is predicted based on the previous words. Without CoT, the AI must jump straight to the answer. With CoT, the "working space" is moved into the context window. The AI's own intermediate logic becomes part of the prompt for the next step, significantly reducing the likelihood of compounding errors.

---

### Examples: Seeing the Difference

#### The Math Challenge
**The Basic Prompt:**
> "I have 12 markers. I lose 3, then buy 2 packs that have 6 markers each. How many do I have?"

**The Enhanced Prompt:**
> "I have 12 markers. I lose 3, then buy 2 packs that have 6 markers each. How many do I have? **Let's think step by step.**"
*   **The AI's Improved Response:**
    1. **Initial state:** 12 markers.
    2. **Subtraction:** Lose 3 markers ($12 - 3 = 9$).
    3. **Multiplication:** 2 packs of 6 markers ($2 \times 6 = 12$).
    4. **Addition:** Current markers + new markers ($9 + 12 = 21$).
    5. **Final Answer:** 21.

#### The Family Riddle
**The Basic Prompt:**
> "John has 4 brothers. Each brother has 1 sister. How many sisters does John have?"

**The Enhanced Prompt:**
> "John has 4 brothers. Each brother has 1 sister. How many sisters does John have? **Let's think step by step.**"
*   **The AI's Improved Response:**
    1. There are 5 boys in total (John + his 4 brothers).
    2. If every brother has the same sister, that means there is only 1 girl in the family.
    3. John is part of that same family.
    4. Therefore, John only has one sister.
    5. **Final Answer:** 1.

