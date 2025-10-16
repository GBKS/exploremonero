<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="$t('transactions.intro')"
          :description="$t('transactions.para')"
        />

        <BlockList
          v-if="blocks"
          :transactions="blocks"
        />

        <LoadError
          v-if="loadError"
          :text="$t('error.check_back_soon')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoneroStore } from '~/stores/monero.js'

const store = useMoneroStore()

const id = 'TransactionsPage'
const log = false
const loadError = ref(false)

const transactions = computed(() => store.transactions)

const classObject = computed(() => {
  return ['page', 'transactions-page'].join(' ')
})

const blocks = computed(() => {
  if (transactions.value && transactions.value.data) {
    return transactions.value
  }

  return null
})

const onTransactionsStart = () => {
  if (log) {
    console.log(id + '.onTransactionsStart')
  }
}

const onTransactionsEnd = () => {
  loadError.value = false
}

const onTransactionsError = () => {
  loadError.value = true
}

onBeforeMount(() => {
  document.title = 'Recent Transactions - Explore Monero'

  events.listen('api-transactions-start', onTransactionsStart, id)
  events.listen('api-transactions-end', onTransactionsEnd, id)
  events.listen('api-transactions-error', onTransactionsError, id)

  api.transactions()
})

onBeforeUnmount(() => {
  events.clearListener(id)
})

onUnmounted(() => {
  store.clearTransactions()
})
</script>
