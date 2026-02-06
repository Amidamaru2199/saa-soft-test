<script setup lang="ts">
import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import { Plus } from '@element-plus/icons-vue'
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
    <el-container class="container">
      <el-main>
        <div class="header">
          <h1 class="title">Учетные записи</h1>
          <el-button type="primary" :icon="Plus" circle @click="addAccount" size="large" />
        </div>

        <el-alert type="info" :closable="false" class="help-alert" show-icon>
          <template #title>
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
          </template>
        </el-alert>

        <el-card shadow="never" class="accounts-card">
          <div class="field-labels">
            <div class="field-label">Метки</div>
            <div class="field-label">Тип записи</div>
            <div class="field-label">Логин</div>
            <div class="field-label">Пароль</div>
            <div class="field-label-action"></div>
          </div>

          <el-empty v-if="accounts.length === 0"
            description="Нет учетных записей. Нажмите кнопку '+' чтобы добавить новую." />

          <div v-else class="accounts-list">
            <AccountForm v-for="account in accounts" :key="account.id" :account="account" />
          </div>
        </el-card>
      </el-main>
    </el-container>
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
  background-color: #f5f7fa;
  color: #303133;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
  padding: 20px;
}
</style>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.help-alert {
  margin-bottom: 20px;
}

.accounts-card {
  border-radius: 8px;
}

.field-labels {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #909399;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-label-action {
  width: 40px;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .header {
    margin-bottom: 16px;
  }

  .title {
    font-size: 24px;
  }

  .field-labels {
    display: none;
  }
}
</style>
