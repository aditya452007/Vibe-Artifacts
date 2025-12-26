---
title: "DSPy Paradigm"
description: "From Prompt Engineering to Declarative Programming."
order: 9
icon: "Code"
---

# DSPy Paradigm

**DSPy** (Declarative Self-improving Python) represents the next evolution of prompt engineering. It moves away from manual string manipulation ("prompt hacking") to a programming-first approach.

## The Philosophy

In traditional prompting, you tweak string templates manually. In DSPy, you define:
1.  **Signatures**: What the input/output looks like.
2.  **Modules**: The logic (e.g., ChainOfThought, ReAct).
3.  **Teleprompters**: Optimizers that automatically find the best prompts and examples.

## Code vs. Prompts

**Manual Prompt:**
```python
prompt = f"Translate {text} to French. Be polite."
```

**DSPy Signature:**
```python
class Translation(dspy.Signature):
    """Translate text to target language with specific tone."""
    text = dspy.InputField()
    target_language = dspy.InputField()
    tone = dspy.InputField()
    translation = dspy.OutputField()
```

## Compilation

The killer feature of DSPy is **compilation**. You can "compile" your program. DSPy will run your pipeline against a validation set and *automatically* rewrite the prompts and select the best few-shot examples to maximize your metric (e.g., accuracy).

## Why Switch?

*   **Portability**: A DSPy program optimized for GPT-4 can be re-compiled for Llama-3 without rewriting code.
*   **Systematic Optimization**: It replaces trial-and-error with gradient descent-like optimization for prompts.

> **Key Insight**: Prompt Engineering is becoming a compile-time optimization step, not a runtime art form.
