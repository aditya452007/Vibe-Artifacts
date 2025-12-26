---
title: "DSPy Paradigm"
description: "From Prompt Engineering to Declarative Programming. Modules, Signatures, and Optimizers."
order: 9
icon: "Code"
---

# DSPy Paradigm

**DSPy** (Declarative Self-improving Python) represents the next evolution of prompt engineering. It moves away from manual string manipulation ("prompt hacking") to a **programming-first approach**.

## The Philosophy

In traditional prompting, you tweak string templates manually.
*   `prompt = "Please summarize this: " + text`

In DSPy, you define the **logic** (Modules) and the **interface** (Signatures), and you let an **Optimizer** (Teleprompter) figure out the actual prompt strings.

## Core Concepts

### 1. Signatures (Interface)
Defines *what* the model does, not *how*.
```python
class EmotionClassifier(dspy.Signature):
    """Classify the emotion of a sentence."""
    sentence = dspy.InputField()
    sentiment = dspy.OutputField(desc="Positive, Negative, or Neutral")
```

### 2. Modules (Logic)
Defines the architectural flow.
*   `dspy.Predict`: Basic zero-shot.
*   `dspy.ChainOfThought`: Adds "Let's think step by step".
*   `dspy.ReAct`: Adds tool use loop.

```python
# Use the signature with CoT logic
classify = dspy.ChainOfThought(EmotionClassifier)
response = classify(sentence="I hate this.")
```

### 3. Teleprompters (Optimizers)
This is the magic. A Teleprompter takes your program, a training set (inputs + correct outputs), and a metric (accuracy).
It runs the program, and *automatically*:
*   Generates the best Few-Shot examples.
*   Rewrites the instructions to maximize the metric.
*   Selects the best reasoning traces (BootstrapFewShot).

## The Optimization Loop

1.  **BootstrapFewShot**:
    *   It runs your `ChainOfThought` module on your training data.
    *   It looks at the ones that got the *correct* answer.
    *   It saves the reasoning trace (Thought -> Answer) of those correct ones.
    *   It uses those traces as the Few-Shot examples for future calls.

## Why Switch?

*   **Portability**: A DSPy program optimized for GPT-4 can be re-compiled for Llama-3 without rewriting code. The optimizer will just find different examples that work better for Llama-3.
*   **Systematic Optimization**: It replaces trial-and-error with gradient descent-like optimization for prompts.

> **Key Insight**: Prompt Engineering is becoming a compile-time optimization step. You write the code (DSPy), and the compiler writes the prompt.
