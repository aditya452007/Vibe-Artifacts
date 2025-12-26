---
title: "Tree of Thoughts (ToT)"
description: "Non-linear search strategies for high-stakes problem solving."
order: 5
icon: "GitFork"
---

# Tree of Thoughts (ToT)

While **Chain of Thought** is linear (A -> B -> C), **Tree of Thoughts (ToT)** is non-linear. It allows an LLM to explore multiple reasoning paths simultaneously, look ahead, backtrack, and evaluate choices—much like a chess engine (AlphaZero) evaluating moves.

## The Mechanism

ToT treats reasoning as a search problem over a tree structure. Each node is a "thought" (a coherent text sequence).

```mermaid
graph TD
    Root[Problem] --> A1[Path A: Step 1]
    Root --> B1[Path B: Step 1]
    Root --> C1[Path C: Step 1]
    A1 --> A2[Path A: Step 2]
    B1 --> X[Dead End (Pruned)]
    C1 --> C2[Path C: Step 2]
    A2 --> A3[Solution A (Score: 0.8)]
    C2 --> C3[Solution B (Score: 0.9)]
```

## The Four Phases of ToT

### 1. Decomposition
Break the problem into intermediate steps.
*   *Prompt*: "What are the 3 possible next steps to solve this equation?"

### 2. Thought Generation (Generator)
Generate multiple potential next steps (k candidates) for the current state.
*   *Prompt*: "Propose 3 distinct approaches to write the introduction for this essay."

### 3. State Evaluation (Evaluator)
This is the critical differentiator. You ask the model to judge its own options.
*   *Value*: "Rate the potential of this step on a scale of 1-10."
*   *Vote*: "Which of these 3 options is most promising?"
*   *Classification*: "Is this path: Sure / Likely / Impossible?"

### 4. Search Algorithm
*   **BFS (Breadth-First Search)**: Generate steps for all current nodes, evaluate, keep top-k, repeat. Good for creative tasks where "diversity" matters.
*   **DFS (Depth-First Search)**: Follow a path until it hits a "dead end" (low score) or success. If dead end, backtrack. Good for logic puzzles or code generation.

## Implementation Example (Simulated in One Prompt)

You don't need a Python wrapper to get 80% of the benefit. You can prompt a "ToT Simulation".

```text
Imagine three different experts are answering this question.
All experts will write down 1 step of their thinking, then share it with the group.
Then all experts will critique the next step.
If any expert realizes they are wrong, they backtrack to the previous step.
At the end, output the consensus solution.

Problem: [Insert Logic Puzzle]
```

## Detailed Use Case: Code Generation

**Task**: Write a complex Python script.

1.  **Root**: User Request.
2.  **Branch 1**: Use `pandas`.
3.  **Branch 2**: Use `csv` module (no dependencies).
4.  **Evaluator**: "User environment is restricted. `pandas` might not be installed. Branch 2 is safer." -> **Prune Branch 1**.
5.  **Branch 2.1**: Write iterator using `yield`.
6.  **Branch 2.2**: Load all into memory.
7.  **Evaluator**: "File might be huge. `yield` is safer." -> **Prune Branch 2.2**.

## ToT vs. CoT

| Feature | Chain of Thought | Tree of Thoughts |
| :--- | :--- | :--- |
| **Structure** | Linear | Tree / Graph |
| **Backtracking** | No (One shot) | Yes |
| **Cost** | Low (1x tokens) | High (k * depth tokens) |
| **Best For** | Math, Standard Logic | Strategy, Creative Search, Puzzles |

> **Key Insight**: ToT trades significant computational cost for higher success rates on tasks requiring **lookahead** and **planning**. It is the nearest equivalent to "System 2" deliberation.
