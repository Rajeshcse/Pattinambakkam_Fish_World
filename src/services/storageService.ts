/**
 * Storage Service
 *
 * Provides abstraction layer over browser storage (localStorage/sessionStorage)
 * Benefits:
 * - Single source of truth for storage operations
 * - Easy to swap storage implementation (localStorage → sessionStorage → IndexedDB)
 * - Type-safe storage operations
 * - Centralized error handling
 * - Easy to mock for testing
 */

import { User } from '@/types';

export enum StorageKey {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
  USER = 'user',
  TOKEN = 'token', // Legacy key for backward compatibility
}

interface IStorageService {
  get(key: StorageKey): string | null;
  set(key: StorageKey, value: string): void;
  remove(key: StorageKey): void;
  clear(): void;
  getObject<T>(key: StorageKey): T | null;
  setObject<T>(key: StorageKey, value: T): void;
}

class StorageService implements IStorageService {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  /**
   * Get a string value from storage
   */
  get(key: StorageKey): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`StorageService.get error for key "${key}":`, error);
      }
      return null;
    }
  }

  /**
   * Set a string value in storage
   */
  set(key: StorageKey, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`StorageService.set error for key "${key}":`, error);
      }
      // Handle quota exceeded or other storage errors
      throw error;
    }
  }

  /**
   * Remove a key from storage
   */
  remove(key: StorageKey): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`StorageService.remove error for key "${key}":`, error);
      }
    }
  }

  /**
   * Clear all storage
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('StorageService.clear error:', error);
      }
    }
  }

  /**
   * Get a parsed object from storage
   */
  getObject<T>(key: StorageKey): T | null {
    const value = this.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`StorageService.getObject parse error for key "${key}":`, error);
      }
      return null;
    }
  }

  /**
   * Set an object in storage (automatically stringified)
   */
  setObject<T>(key: StorageKey, value: T): void {
    try {
      const stringified = JSON.stringify(value);
      this.set(key, stringified);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`StorageService.setObject stringify error for key "${key}":`, error);
      }
      throw error;
    }
  }

  // Convenience methods for auth data
  getAccessToken(): string | null {
    return this.get(StorageKey.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    this.set(StorageKey.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.get(StorageKey.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.set(StorageKey.REFRESH_TOKEN, token);
  }

  getUser(): User | null {
    return this.getObject<User>(StorageKey.USER);
  }

  setUser(user: User): void {
    this.setObject(StorageKey.USER, user);
  }

  setAuthData(accessToken: string, refreshToken: string, user: User): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setUser(user);
  }

  clearAuthData(): void {
    this.remove(StorageKey.ACCESS_TOKEN);
    this.remove(StorageKey.REFRESH_TOKEN);
    this.remove(StorageKey.USER);
    this.remove(StorageKey.TOKEN); // Legacy cleanup
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export class for testing (allows mocking)
export default StorageService;
