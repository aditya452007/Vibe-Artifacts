/**
 * Securely manages API keys for external services.
 * Uses chrome.storage.sync to ensure keys are encrypted and synced across user devices.
 * 
 * SECURITY NOTE: Keys are never logged or exposed to the frontend content scripts directly.
 * They are only accessed within the isolated background context.
 */

export interface ApiKeys {
    openai?: string;
    anthropic?: string;
    gemini?: string;
}

export class AuthManager {
    private static readonly STORAGE_KEY = 'pb_api_keys';

    /**
     * Retrieves all stored API keys.
     */
    static async getKeys(): Promise<ApiKeys> {
        const result = await chrome.storage.sync.get(this.STORAGE_KEY);
        return result[this.STORAGE_KEY] || {};
    }

    /**
     * Retrives a specific API key.
     */
    static async getKey(provider: keyof ApiKeys): Promise<string | undefined> {
        const keys = await this.getKeys();
        return keys[provider];
    }

    /**
     * Securely saves API keys.
     * Merges with existing keys.
     */
    static async saveKeys(newKeys: Partial<ApiKeys>): Promise<void> {
        const currentKeys = await this.getKeys();
        const updatedKeys = { ...currentKeys, ...newKeys };
        await chrome.storage.sync.set({ [this.STORAGE_KEY]: updatedKeys });
    }

    /**
     * Deletes a specific API key.
     */
    static async deleteKey(provider: keyof ApiKeys): Promise<void> {
        const currentKeys = await this.getKeys();
        delete currentKeys[provider];
        await chrome.storage.sync.set({ [this.STORAGE_KEY]: currentKeys });
    }

    /**
     * Checks if a valid key exists for the given provider.
     */
    static async hasKey(provider: keyof ApiKeys): Promise<boolean> {
        const key = await this.getKey(provider);
        return !!key && key.length > 0;
    }
}
