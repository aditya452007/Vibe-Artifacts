---
title: "Agentic Workflows"
description: "Designing autonomous systems: Memory, Planning, and Multi-Agent Patterns."
order: 10
icon: "Users"
---

# Agentic Workflows

An **Agent** is an LLM wrapper that has:
1.  **Profile**: Identity and role.
2.  **Memory**: Persisting state over time.
3.  **Planning**: Ability to break goals into steps.
4.  **Tools**: Hands to interact with the world (APIs).

## Memory Architectures

A raw LLM has no memory. It resets after every API call. Agents need state.

### 1. Short-Term Memory
*   **Context Window**: The immediate conversation history.
*   **Technique**: Sliding window (keep last N messages) or Summarization (summarize old messages to save tokens).

### 2. Long-Term Memory
*   **Vector Database (RAG)**: Storing past experiences as embeddings.
*   **Retrieval**: When a user asks a question, the agent queries its memory: "Have I solved a similar problem before?"

### 3. Episodic vs. Semantic
*   *Episodic*: "I remember user Bob asked about apples yesterday."
*   *Semantic*: "I know that apples are red."

## Planning Systems

How does an agent solve "Build a website"?

### 1. Task Decomposition
Breaking a high-level goal into sub-goals.
*   *Prompt*: "Steps: 1. Write HTML. 2. Write CSS. 3. Write JS."

### 2. Self-Reflection
Checking if the plan is working.
*   *Loop*: Execute Step 1 -> Check Result -> If Fail, New Plan -> If Success, Step 2.

## Multi-Agent Patterns

Research (e.g., ChatDev, MetaGPT) shows that multi-agent systems often outperform single "God-mode" agents.

### 1. Sequential Handoffs
A linear assembly line.
*   **Researcher** (Scrapes web) -> **Writer** (Drafts content) -> **Editor** (Fixes tone).
*   *Pros*: Easy to debug.
*   *Cons*: Fragile if one step fails.

### 2. Hierarchical (Manager-Worker)
A "Boss" agent breaks down the task and assigns it to "Worker" agents.
*   **Manager**: "We need a report."
*   **Worker A**: "I'll get the data."
*   **Worker B**: "I'll make the charts."
*   **Manager**: "Combine these into a PDF."

### 3. Joint Collaboration (Debate)
Two agents with opposing personas debate an answer.
*   **Agent A (Optimist)**: "This stock will go up because X."
*   **Agent B (Pessimist)**: "But risk Y is too high."
*   **Judge**: Synthesizes the debate into a final decision.
*   *Benefit*: Reduces hallucination and groupthink.

> **Key Insight**: We are moving from "Chatting with AI" to "Managing a Team of AI Agents". The prompt engineer is becoming the **AI Product Manager**, defining the roles and communication protocols of the squad.
