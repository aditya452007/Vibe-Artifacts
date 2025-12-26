---
title: "Meta-Prompting"
description: "Using AI to architect AI systems: Prompt Generators, Reflexion, and Self-Critique."
order: 8
icon: "Cpu"
---

# Meta-Prompting

Meta-Prompting transforms the LLM from a worker into an **architect**. Instead of writing the prompt yourself, you ask the LLM to write, critique, or optimize the prompt for a specific task.

## The Loop

1.  **Draft**: You give a high-level intent.
2.  **Generate**: The "Meta-LLM" writes a detailed system prompt.
3.  **Test**: You run the prompt on a test case.
4.  **Refine**: You ask the Meta-LLM to improve the prompt based on the failure.

## The "Prompt Generator" System Prompt

Use this prompt to turn any LLM into a Prompt Engineering expert:

```text
You are an expert Prompt Engineer. Your goal is to optimize prompts for GPT-4.
I will give you a simple task description. You will output a comprehensive System Prompt.

The System Prompt must include:
1.  **Persona**: A specific expert role.
2.  **Context**: Constraints and background.
3.  **Steps**: A Chain-of-Thought process.
4.  **Format**: Exact output structure (JSON/Markdown).
5.  **Examples**: 3-shot Few-Shot examples relevant to the task.

Task: [Insert User's Simple Idea]
```

## Reflexion (Self-Correction)

A powerful meta-technique is asking the model to critique its own output *before* finalizing it. This mimics the human process of drafting and editing.

**The Prompt Pattern:**
```text
Question: [Hard Math Problem]

Draft Answer: [Model generates draft]

Critique: Check the draft for logic errors or missing steps. Be harsh.

Final Answer: Rewrite the draft based on the critique.
```

## Use Cases

### 1. System Prompt Generation
Creating the `system` message for a new chatbot. Often, users don't know how to describe the persona they want. The Meta-Prompt extracts it.

### 2. Synthetic Data Generation
Using an LLM to generate training data for another LLM.
*   *Prompt*: "Generate 50 diverse examples of customer support emails involving billing disputes."
*   *Meta-step*: "Review these 50 examples. Discard any that are too similar or unrealistic. Generate replacements."

> **Key Insight**: The best prompt engineers are often the models themselves. They know their own latent space and token probability distributions better than any human can.
