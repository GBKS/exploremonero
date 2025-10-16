<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="title"
          :description="description"
        >
          <RefreshTimer
            ref="timer"
            :duration="60"
            :loading="isLoading"
            @update="loadTransaction"
          />
        </PageHeader>
        <TransactionDetails
          v-if="transaction"
          :key="transactionHash"
          :transaction="transaction"
        />
        <InputList
          v-if="transaction && !isMiningReward"
          :is-mining-reward="isMiningReward"
          :inputs="transaction.as_json.vin"
        />
        <OutputList
          v-if="transaction"
          :is-mining-reward="isMiningReward"
          :outputs="transaction.as_json.vout"
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

// Template refs
const timer = ref(null)

// Reactive state
const id = 'TransactionPage'
const transactionHash = ref(null)
const transaction = ref(null)
const isLoading = ref(false)

// Computed properties
const classObject = computed(() => {
  return ['page', 'transaction-page'].join(' ')
})

const isMiningReward = computed(() => {
  let result = false

  if (transaction.value && transaction.value.data) {
    result = transaction.value.data.xmr_outputs > 0
  }

  return result
})

const title = computed(() => {
  let result = ''

  if (isMiningReward.value) {
    result = t('general.mining_reward_transaction')
  } else {
    const currentTransactionHash = route.params.hash
    result = t('general.transaction', null, 1) + ' ' + currentTransactionHash.substr(0, 4) + '...' + currentTransactionHash.substr(currentTransactionHash.length - 4, 4)
  }

  return result
})

const description = computed(() => {
  return t('transaction.text')
})

// Methods
const loadTransaction = () => {
  const currentTransactionHash = route.params.hash

  transactionHash.value = currentTransactionHash

  if (timer.value) {
    timer.value.reset()
  }

  api.transactions([currentTransactionHash])
}

const onLoadStart = () => {
  isLoading.value = true
}

const onLoadEnd = (result) => {
  isLoading.value = false

  console.log('Transaction loaded', result)

  for(const tx of result.txs) {
    if (tx.tx_hash === transactionHash.value) {
      transaction.value = tx
      break
    }
  }

  if (timer.value) {
    timer.value.start()
  }
}

// Watchers
watch(() => route.params.hash, (newTransactionHash) => {
  if (newTransactionHash != transactionHash.value) {
    transactionHash.value = newTransactionHash
    loadTransaction()
  }
})

// Lifecycle hooks
onBeforeMount(() => {
  events.listen('api-transactions-start', onLoadStart, id)
  events.listen('api-transactions-end', onLoadEnd, id)

  const currentTransactionHash = route.params.hash

  if (currentTransactionHash && currentTransactionHash.length > 0) {
    document.title = t('general.transaction', null, 1) + ' | Explore Monero'
    loadTransaction()
  }
})

onBeforeUnmount(() => {
  faviconUpdater.reset()
  events.clearListener(id)
})

onUnmounted(() => {
  store.updateTransaction(null)
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.transaction-page {
	.timer {
		p {
			display: inline-block;
			margin-right: 10px;
		}

		.timer-bar-wrap {
			display: inline-block;
			vertical-align: middle;
			width: 100px;
			height: 4px;
			background-color: rgba(var(--front), 0.1);
			border-radius: 100px;

			.timer-bar {
				height: 100%;
				background-color: var(--blue);
				border-radius: 100px;
				transition: all 1000ms animations.$ease;
			}
		}
	}

	.transaction-details {
		& + .input-list,
		& + .output-list {
			border-top: 1px solid rgba(var(--front), 0.2);
			margin-top: 80px;
		}
	}

	@include mixins.media-query(medium-up) {
		.timer {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}
	}
}
</style>
