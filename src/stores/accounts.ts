import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Account, LabelTag } from '@/types/account'

const STORAGE_KEY = 'accounts'

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

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])

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

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
    } catch (error) {
      console.error('Failed to save accounts to storage:', error)
    }
  }

  watch(
    accounts,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  function addAccount(account: Account) {
    accounts.value.push(account)
  }

  function updateAccount(id: string, updatedAccount: Partial<Account>) {
    const index = accounts.value.findIndex((acc) => acc.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], ...updatedAccount }
    }
  }

  function removeAccount(id: string) {
    accounts.value = accounts.value.filter((acc) => acc.id !== id)
  }

  loadFromStorage()

  return {
    accounts,
    addAccount,
    updateAccount,
    removeAccount,
  }
})
