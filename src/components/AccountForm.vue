<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAccountsStore, parseLabelsToTags } from '@/stores/accounts'
import { Delete, CircleClose } from '@element-plus/icons-vue'
import type { Account, AccountFormData, ValidationErrors } from '@/types/account'

const props = defineProps<{
  account: Account
}>()

const store = useAccountsStore()

const formData = ref<AccountFormData>({
  id: props.account.id,
  labelsInput: props.account.labels.map((tag) => tag.text).join('; '),
  recordType: props.account.recordType,
  login: props.account.login,
  password: props.account.password || '',
})

const errors = ref<ValidationErrors>({
  login: false,
  password: false,
})

const showPassword = computed(() => formData.value.recordType === 'local')

watch(
  () => formData.value.recordType,
  (newType) => {
    if (newType === 'ldap') {
      formData.value.password = ''
      errors.value.password = false
    }
  }
)

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
      <el-input
        v-model="formData.labelsInput"
        placeholder="Метка"
        maxlength="50"
        show-word-limit
        @blur="handleLabelsBlur"
      />
    </div>

    <div class="account-field">
      <el-select
        v-model="formData.recordType"
        placeholder="Выберите тип"
        @change="handleRecordTypeChange"
      >
        <el-option label="Локальная" value="local" />
        <el-option label="LDAP" value="ldap" />
      </el-select>
    </div>

    <div class="account-field">
      <el-input
        v-model="formData.login"
        placeholder="Логин"
        maxlength="100"
        :class="{ 'is-error': errors.login }"
        @blur="handleLoginBlur"
      >
        <template v-if="errors.login" #suffix>
          <el-icon color="#f56c6c">
            <circle-close />
          </el-icon>
        </template>
      </el-input>
    </div>

    <div class="account-field password-field">
      <el-input
        v-if="showPassword"
        v-model="formData.password"
        type="password"
        placeholder="Пароль"
        maxlength="100"
        show-password
        :class="{ 'is-error': errors.password }"
        @blur="handlePasswordBlur"
      >
        <template v-if="errors.password" #suffix>
          <el-icon color="#f56c6c">
            <circle-close />
          </el-icon>
        </template>
      </el-input>
      <div v-else class="password-placeholder"></div>
    </div>

    <div class="account-field">
      <el-button
        type="danger"
        :icon="Delete"
        circle
        @click="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
}

.account-field {
  min-height: 32px;
}

.account-field :deep(.el-input),
.account-field :deep(.el-select) {
  width: 100%;
}

.account-field :deep(.el-input.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.account-field :deep(.el-input.is-error .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.account-field :deep(.el-input.is-error .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.password-field {
  position: relative;
}

.password-placeholder {
  width: 100%;
  height: 32px;
}

@media (max-width: 768px) {
  .account-row {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px;
  }
}
</style>
