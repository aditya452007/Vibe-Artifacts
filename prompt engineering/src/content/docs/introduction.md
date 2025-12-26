---
title: "The Paradigm"
description: "An introduction to the art and science of Prompt Engineering."
order: 1
icon: "Book"
---

# The Paradigm Shift

Prompt Engineering is not merely about writing text inputs; it is the discipline of **designing cognitive architectures** using natural language as programming code.

In the pre-LLM era, we wrote logic in strict syntax (Python, C++). In the neural era, we write logic in *semantics*.

> "The hottest new programming language is English." — Andrej Karpathy

## Creating the Persona

The most effective prompts start by defining the model's identity. This sets the **latent space**—the region of the neural network the model should operate within.

```markdown
SYSTEM: You are an expert AI researcher with 20 years of experience in Natural Language Processing.
USER: Explain transformer attention mechanisms.
```

## The Core Components

An optimized prompt typically contains four key elements:
1.  **Instruction**: The specific task you want the model to perform.
2.  **Context**: Background information or external data.
3.  **Input Data**: The input you want to process.
4.  **Output Indicator**: The format you want the response in (e.g., JSON, Table).
