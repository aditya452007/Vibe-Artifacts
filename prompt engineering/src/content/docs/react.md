---
title: "ReAct Framework"
description: "Reasoning and Acting - Connecting LLMs to tools."
order: 5
icon: "Terminal"
---

# ReAct Framework

**ReAct** (Reason+Act) is the foundation of modern Autonomous Agents. It solves a critical limitation of static LLMs: hallucinations and lack of access to real-time data.

## The Loop

ReAct combines **Chain of Thought** reasoning with **Action Execution**.

1.  **Thought**: The model reasons about what it needs to do.
2.  **Action**: The model decides to use a specific tool (e.g., `google_search`, `calculate`).
3.  **Observation**: The tool executes and returns real data to the model.
4.  **Repeat**: The model processes the observation and continues until the task is done.

## The Prompt Structure

A typical ReAct prompt looks like this:

```text
Question: What is the elevation range for the area that the eastern sector of the Colorado orogeny extends into?

Thought 1: I need to search for Colorado orogeny, find the area that the eastern sector extends into, and then find the elevation range of the area.
Action 1: Search[Colorado orogeny]
Observation 1: The Colorado orogeny was an episode of mountain building (an orogeny) in Colorado and surrounding areas.

Thought 2: It does not mention the eastern sector. So I need to look up eastern sector.
...
```

## Why ReAct Matters
Without ReAct, an LLM is a brain in a jar. With ReAct, it is an agent with hands. It enables accurate fact-checking and complex multi-step workflows.
