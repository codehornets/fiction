<script lang="ts" setup>
import type { FactorRouter, FactorUser, User } from '@factor/api'
import { useService, vue } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const formError = vue.ref('')
const user = vue.computed<Partial<User>>(
  () => factorUser.activeUser.value || {},
)
const form = vue.ref<Partial<User>>(user.value)

const sending = vue.ref(false)
const sent = vue.ref(false)

async function updateUser(): Promise<void> {
  const fields = { ...form.value }
  const r = await factorUser.requests.ManageUser.projectRequest({
    _action: 'update',
    fields,
  })

  if (r.status !== 'success')
    formError.value = r.message ?? ''
}

async function send(): Promise<void> {
  sending.value = true
  await updateUser()
  sending.value = false
  sent.value = true
}

vue.watch(
  () => factorUser.activeUser.value,
  (v) => {
    if (v)
      form.value = v
  },
)
</script>

<template>
  <div>
    <div class="max-w-lg space-y-6">
      <ElInput
        v-model="form.fullName"
        input="InputText"
        label="Full Name"
        placeholder="Enter your full name"
        required
      />
      <ElInput
        v-model="form.username"
        input="InputUsername"
        label="Username"
        sub-label="Must be unique. Used in profile URL."
        placeholder="username123"
        table="factor_user"
        column="username"
        required
      />

      <ElInput
        v-model="form.email"
        input="InputEmail"
        label="Email Address"
        placeholder="email@example.com"
        disabled
      >
        <template #after>
          <div class="mt-4">
            <ElButton
              btn="default"
              size="sm"
              :to="
                factorRouter.link(
                  'settings',
                  { itemId: `changeCredential` },
                  { mode: 'email' },
                ).value
              "
            >
              Change Email &rarr;
            </ElButton>
          </div>
        </template>
      </ElInput>
      <ElInput label="Password">
        <ElButton
          btn="default"
          size="sm"
          :to="
            factorRouter.link(
              'settings',
              { itemId: `changeCredential` },
              { mode: 'password' },
            ).value
          "
        >
          Change Password &rarr;
        </ElButton>
      </ElInput>
      <ElInput
        v-model="form.phoneNumber"
        input="InputPhone"
        label="Phone Number"
        sub-label="Used for SMS notifications"
        placeholder="+1 555 555 5555"
      />
      <div>
        <ElButton
          btn="primary"
          :loading="sending"
          @click="send()"
        >
          Save Changes
        </ElButton>
      </div>
    </div>
  </div>
</template>
