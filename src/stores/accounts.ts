import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account, LabelTag } from '@/types/account'

const STORAGE_KEY = 'accounts'

// Helper functions to parse labels
export function parseLabelsToTags(labelsInput: string): LabelTag[] {
  if (!labelsInput.trim()) {
    return []
  }
  return labelsInput
    .split(';')
    .map((text) => text.trim())
    .filter((text) => text.length > 0)
    .map((text) => ({ text }))
}

export function parseTagsToString(labels: LabelTag[]): string {
  return labels.map((tag) => tag.text).join('; ')
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

  // Load accounts from localStorage on initialization
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        accounts.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load accounts from storage:', error)
    }
  }

  // Save accounts to localStorage
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
    } catch (error) {
      console.error('Failed to save accounts to storage:', error)
    }
  }

  // Watch for changes and save to localStorage
  watch(
    accounts,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // Add a new account
  function addAccount(account: Account) {
    accounts.value.push(account)
  }

  // Update an existing account
  function updateAccount(id: string, updatedAccount: Partial<Account>) {
    const index = accounts.value.findIndex((acc) => acc.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updatedAccount }
    }
  }

  // Remove an account
  function removeAccount(id: string) {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  // Get account by ID
  function getAccountById(id: string): Account | undefined {
    return accounts.value.find((acc) => acc.id === id)
  }

  // Initialize store
  loadFromStorage()

  return {
    accounts,
    addAccount,
    updateAccount,
    removeAccount,
    getAccountById,
  }
})
