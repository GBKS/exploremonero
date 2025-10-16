<template>
  <div class="page mempool-page">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="$t('mempool.title')"
          :description="$t('mempool.text')"
        >
          <!-- <refresh-timer 
            ref="timer"
            duration="60"
            :loading="isLoading"
            @update="loadMempool"
          /> -->
        </PageHeader>

        <TransactionList
          :active="mempool && mempool.transactions"
          :transactions="mempool?.transactions"
        />

        <LoadError
          v-if="loadError"
          :text="$t('error.check_back_soon')"
        />
        
        <div v-if="!mempool && !loadError" class="loading">
          <p>{{ $t('general.loading') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useMoneroStore } from '~/stores/monero.js'

const { t } = useI18n()
const store = useMoneroStore()

const id = 'MempoolPage'
const isLoading = ref(false)
const loadError = ref(false)

const mempool = computed(() => store.mempool)

const loadMempool = async () => {
  api.mempool()
}

const onLoadStart = () => {
  isLoading.value = true
  loadError.value = false
}

const onLoadEnd = () => {
  isLoading.value = false
  loadError.value = false

  // if (timerRef.value) {
  //   timerRef.value.start();
  // }
}

const onLoadError = () => {
  isLoading.value = false
  loadError.value = true
}

onBeforeMount(() => {
  document.title = t('mempool.page_title') + ' - Explore Monero'

  events.listen('api-mempool-start', onLoadStart, id)
  events.listen('api-mempool-end', onLoadEnd, id)
  events.listen('api-mempool-error', onLoadError, id)

  loadMempool()
})

onBeforeUnmount(() => {
  events.clearListener(id)
})
</script>