<template>
  <div class="page blocks-page">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="$t('blocks.intro')"
          :description="$t('blocks.para')"
        >
          <!-- <refresh-timer 
            ref="timer"
            duration="60"
            @update="onTimer"
            :loading="isLoading"
            @start="onStartTimer"
          /> -->
        </PageHeader>
        
        <BlockList 
          :active="!!blocks" 
          :blocks="blocks" 
        />
        
        <Pagination
          v-if="blocks" 
          :data="blocks"
          :loading="isLoading"
          @paginate="paginate"
        />
        
        <LoadError 
          v-if="loadError"
          :text="$t('error.check_back_soon')"
        />

        <SkeletonLoader 
          v-if="!blocks && !loadError"
          :height="70"
          :gap="15"
          :count="5"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoneroStore } from '~/stores/monero.js'

const store = useMoneroStore()

const id = 'BlocksPage'
const page = ref(0)
const perPage = 10
const isLoading = ref(false)
const loadError = ref(false)

const storeBlocks = computed(() => store.blocks)
const networkinfo = computed(() => store.networkinfo)

const blocks = computed(() => {
  const data = storeBlocks.value

  // Sort by blocks by height descending
  if (data) {
    data.sort((a, b) => b.height - a.height)
  }

  return data
})

const paginate = () => {
  page.value += 1
  loadBlocks()
}

const loadBlocks = () => {
  const currentHeight = networkinfo.value?.height

  if(currentHeight) {
    const start = currentHeight - ((page.value + 1) * perPage)

    api.blocks(start, perPage)
  }
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
  document.title = 'Blocks - Explore Monero'

  // Set up event listeners
  events.listen('api-blocks-start', onLoadStart, id)
  events.listen('api-blocks-end', onLoadEnd, id)
  events.listen('api-blocks-error', onLoadError, id)

  // Wait for network info to be loaded
  if (store.networkinfo) {
    loadBlocks()
  } else {
    events.listen('api-networkinfo-end', () => {
      console.log('blocks network info loaded')
      loadBlocks()
    }, id)

    api.networkinfo()
  }
})

onBeforeUnmount(() => {
  events.clearListener(id)
})
</script>