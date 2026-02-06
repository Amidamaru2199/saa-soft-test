<script setup lang="ts">
import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AccountForm from '@/components/AccountForm.vue'
import type { Account } from '@/types/account'

const store = useAccountsStore()

const accounts = computed(() => store.accounts)

function addAccount() {
  const newAccount: Account = {
    id: `account-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    labels: [],
    recordType: 'local',
    login: '',
    password: '',
  }
  store.addAccount(newAccount)
}
</script>

<template>
  <div id="app">
    <div class="container">
      <div class="header">
        <h1 class="title">Учетные записи</h1>
        <button class="add-button" @click="addAccount" title="Добавить учетную запись">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div class="help-text">
        <svg
          class="help-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
      </div>

      <div class="accounts-section">
        <div class="field-labels">
          <div class="field-label">Метки</div>
          <div class="field-label">Тип записи</div>
          <div class="field-label">Логин</div>
          <div class="field-label">Пароль</div>
          <div class="field-label-action"></div>
        </div>

        <div v-if="accounts.length === 0" class="empty-state">
          <p>Нет учетных записей. Нажмите кнопку "+" чтобы добавить новую.</p>
        </div>

        <div v-else class="accounts-list">
          <AccountForm v-for="account in accounts" :key="account.id" :account="account" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  background-color: #f9fafb;
  color: #111827;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
  padding: 40px 20px;
}
</style>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
}

.add-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #d0d5dd;
  border-radius: 10px;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.add-button:active {
  transform: scale(0.95);
}

.help-text {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #eff6ff;
  border-radius: 10px;
  margin-bottom: 32px;
  font-size: 14px;
  color: #1e40af;
}

.help-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.accounts-section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.field-labels {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-label-action {
  width: 40px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;
}

.empty-state p {
  font-size: 16px;
}

.accounts-list {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .header {
    margin-bottom: 20px;
  }

  .title {
    font-size: 24px;
  }

  .add-button {
    width: 44px;
    height: 44px;
  }

  .field-labels {
    display: none;
  }

  .accounts-section {
    padding: 16px;
  }
}
</style>
