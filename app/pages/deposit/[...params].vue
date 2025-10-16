<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="title"
          :description="description"
        />

        <div class="outputs" v-if="outputs && outputs.data && hasMatchingOutputs">
          <DepositDetails
            :key="hash"
            :data="outputs"
            :hash="hash"
            :address="address"
            :viewkey="viewkey"
            @clear="reset"
          />
        </div>

        <DepositForm
          v-else
          :hash="hash"
          :address="address"
          :viewkey="viewkey"
          :outputs="outputs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

// Composables
const route = useRoute()
const { t } = useI18n()
const store = useMoneroStore()

// Reactive state
const hash = ref(route.params.hash)
const address = ref(route.params.address)
const viewkey = ref(route.params.viewkey)

// Computed properties
const outputs = computed(() => store.outputs)

const classObject = computed(() => {
  return ['page', 'deposit-page'].join(' ')
})

const hasMatchingOutputs = computed(() => {
  if (outputs.value && outputs.value.data && outputs.value.data.outputs) {
    const outputsData = outputs.value.data.outputs
    return outputsData.some(output => output.match)
  }
  return false
})

const title = computed(() => {
  let result = t('deposit.form.title')

  if (outputs.value && outputs.value.data && hasMatchingOutputs.value) {
    result = t('deposit.result.title')
  }

  return result
})

const description = computed(() => {
  let result = t('deposit.form.text')

  if (outputs.value && outputs.value.data && hasMatchingOutputs.value) {
    result = t('deposit.result.text')
  }

  return result
})

// Watchers
watch(route, (newRoute) => {
  const newHash = newRoute.params.hash
  const newAddress = newRoute.params.address
  const newViewkey = newRoute.params.viewkey

  if (newHash != hash.value || newAddress != address.value || newViewkey != viewkey.value) {
    hash.value = newHash
    address.value = newAddress
    viewkey.value = newViewkey

    if (newHash && newAddress && newViewkey) {
      loadData()
    } else {
      reset()
    }
  }
})

// Methods
const reset = () => {
  store.updateOutputs(null)
}

const loadData = () => {
  // Use txprove=0 for deposit verification (different from receipt)
  api.outputs(hash.value, address.value, viewkey.value, 0)
}

// Lifecycle hooks
onMounted(() => {
  document.title = t('deposit.page_title') + ' | Explore Monero'

  if (hash.value && address.value && viewkey.value) {
    loadData()
  }
})

onUnmounted(() => {
  store.updateOutputs(null)
})
</script>

<style lang="scss" scoped>

.deposit-page {
  min-height: 400px;

  .wrap {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .content {
    margin-bottom: 40px;
  }

  .outputs {
    margin-top: 40px;
  }
}

</style>
