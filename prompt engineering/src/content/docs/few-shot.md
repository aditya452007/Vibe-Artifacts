---
title: "Few-Shot Logic"
description: "In-context learning through pattern demonstration."
order: 3
icon: "Code"
---

# Few-Shot Logic

When zero-shot fails, **Few-Shot Prompting** (In-Context Learning) is the next logical escalation. It involves providing a few demonstrations of the task (input -> output) before asking for the actual inference.

## The Format

Standard Few-Shot prompts follow a pattern:
1.  Instruction
2.  Example 1 (Input -> Output)
3.  Example 2 (Input -> Output)
4.  Target Input ->

## Why It Works

Few-shot prompting doesn't update the model's weights. Instead, it temporarily steers the model's attention mechanism to copy the **pattern** and **style** of the provided examples.

### Example: Custom Entity Extraction

**Prompt:**
```text
Extract colors and link them to objects in JSON format.

Input: The sky was azure and the grass was emerald.
Output: {"sky": "azure", "grass": "emerald"}

Input: His eyes were coal black, staring at the ruby rose.
Output: {"eyes": "coal black", "rose": "ruby"}

Input: The golden sun set over the purple mountains.
Output:
```

**Completion:**
```json
{"sun": "golden", "mountains": "purple"}
```

## Advanced Few-Shot
*   **Chain-of-Thought Few-Shot**: Include the *reasoning* in your examples, not just the answer.
*   **Diversity**: Ensure your examples cover different edge cases to prevent the model from overfitting to one specific format.
