<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccountsStore, parseLabelsToTags } from '@/stores/accounts'
import type { Account, AccountFormData, RecordType, ValidationErrors } from '@/types/account'

const props = defineProps<{
  account: Account
}>()

const store = useAccountsStore()

// Form data
const formData = ref<AccountFormData>({
  id: props.account.id,
  labelsInput: props.account.labels.map((tag) => tag.text).join('; '),
  recordType: props.account.recordType,
  login: props.account.login,
  password: props.account.password || '',
})

// Validation errors
const errors = ref<ValidationErrors>({
  login: false,
  password: false,
})

// Computed
const showPassword = computed(() => formData.value.recordType === 'local')

// Watch record type changes to handle password field
watch(
  () => formData.value.recordType,
  (newType) => {
    if (newType === 'ldap') {
      formData.value.password = ''
      errors.value.password = false
    }
  }
)

// Validation functions
function validateLogin(): boolean {
  const isValid = formData.value.login.trim().length > 0 && formData.value.login.length <= 100
  errors.value.login = !isValid
  return isValid
}

function validatePassword(): boolean {
  if (formData.value.recordType === 'ldap') {
    errors.value.password = false
    return true
  }
  const isValid = formData.value.password.trim().length > 0 && formData.value.password.length <= 100
  errors.value.password = !isValid
  return isValid
}

function validateAll(): boolean {
  const isLoginValid = validateLogin()
  const isPasswordValid = validatePassword()
  return isLoginValid && isPasswordValid
}

// Event handlers
function handleLabelsBlur() {
  if (formData.value.labelsInput.length > 50) {
    formData.value.labelsInput = formData.value.labelsInput.substring(0, 50)
  }
  saveAccount()
}

function handleLoginBlur() {
  if (validateAll()) {
    saveAccount()
  }
}

function handlePasswordBlur() {
  if (validateAll()) {
    saveAccount()
  }
}

function handleRecordTypeChange() {
  if (validateAll()) {
    saveAccount()
  }
}

function saveAccount() {
  if (!validateAll()) {
    return
  }

  const updatedAccount: Account = {
    id: formData.value.id,
    labels: parseLabelsToTags(formData.value.labelsInput),
    recordType: formData.value.recordType,
    login: formData.value.login.trim(),
    password: formData.value.recordType === 'ldap' ? null : formData.value.password.trim(),
  }

  store.updateAccount(props.account.id, updatedAccount)
}

function handleDelete() {
  store.removeAccount(props.account.id)
}
</script>

<template>
  <div class="account-row">
    <div class="account-field">
      <input
        v-model="formData.labelsInput"
        type="text"
        placeholder="Метка"
        maxlength="50"
        class="input-field"
        @blur="handleLabelsBlur"
      />
    </div>

    <div class="account-field">
      <select
        v-model="formData.recordType"
        class="select-field"
        @change="handleRecordTypeChange"
      >
        <option value="local">Локальная</option>
        <option value="ldap">LDAP</option>
      </select>
    </div>

    <div class="account-field">
      <input
        v-model="formData.login"
        type="text"
        placeholder="Логин"
        maxlength="100"
        :class="['input-field', { error: errors.login }]"
        @blur="handleLoginBlur"
      />
    </div>

    <div class="account-field password-field">
      <input
        v-if="showPassword"
        v-model="formData.password"
        type="password"
        placeholder="Пароль"
        maxlength="100"
        :class="['input-field', { error: errors.password }]"
        @blur="handlePasswordBlur"
      />
      <div v-else class="password-placeholder"></div>
    </div>

    <button class="delete-button" @click="handleDelete" title="Удалить">
      <svg
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
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.account-field {
  min-height: 40px;
}

.input-field,
.select-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  background-color: white;
}

.input-field:focus,
.select-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.input-field.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select-field {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 35px;
}

.password-field {
  position: relative;
}

.password-placeholder {
  width: 100%;
  height: 40px;
}

.delete-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

@media (max-width: 768px) {
  .account-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .delete-button {
    width: 100%;
    justify-self: stretch;
  }
}
</style>
