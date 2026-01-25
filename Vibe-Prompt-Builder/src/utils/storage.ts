/// <reference types="chrome" />
export interface Prompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    groupId?: string;
    isFavorite?: boolean;
    createdAt: number;
    modifiedAt: number;
}

export interface PromptGroup {
    id: string;
    name: string;
    color?: string;
    parentId?: string;
}

export const storage = {
    getPrompts: async (): Promise<Prompt[]> => {
        return new Promise((resolve) => {
            chrome.storage.local.get(['prompts'], (result) => {
                resolve(result.prompts || []);
            });
        });
    },

    savePrompt: async (prompt: Prompt): Promise<void> => {
        const prompts = await storage.getPrompts();
        const index = prompts.findIndex(p => p.id === prompt.id);

        if (index >= 0) {
            prompts[index] = prompt;
        } else {
            prompts.push(prompt);
        }

        return new Promise((resolve) => {
            chrome.storage.local.set({ prompts }, resolve);
        });
    },

    deletePrompt: async (id: string): Promise<void> => {
        const prompts = await storage.getPrompts();
        const newPrompts = prompts.filter(p => p.id !== id);
        return new Promise((resolve) => {
            chrome.storage.local.set({ prompts: newPrompts }, resolve);
        });
    },

    saveGroup: async (group: PromptGroup): Promise<void> => {
        const groups = await storage.getGroups();
        const index = groups.findIndex(g => g.id === group.id);

        if (index >= 0) {
            groups[index] = group;
        } else {
            groups.push(group);
        }

        return new Promise((resolve) => {
            chrome.storage.local.set({ groups }, resolve);
        });
    },

    deleteGroup: async (id: string): Promise<void> => {
        const groups = await storage.getGroups();
        const newGroups = groups.filter(g => g.id !== id);
        return new Promise((resolve) => {
            chrome.storage.local.set({ groups: newGroups }, resolve);
        });
    },

    getGroups: async (): Promise<PromptGroup[]> => {
        return new Promise((resolve) => {
            chrome.storage.local.get(['groups'], (result) => {
                resolve(result.groups || []);
            });
        });
    }
};
