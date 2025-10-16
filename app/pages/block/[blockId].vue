<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="$t('block.intro')"
          :description="$t('block.para')"
        />
        <ol>
          <BlockListItem
            v-if="block"
            :max-transactions="25"
            :start-expanded="true"
            :hide-link="true"
            :block="block"
            :max-size="maxSize"
            :median-size="medianSize"
          />
        </ol>

        <LoadError
          v-if="loadError"
          :text="$t('error.check_back_soon')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const store = useMoneroStore()

const id = 'BlockPage'
const blockId = ref(null)
const loadError = ref(false)

const block = ref(null)
const networkinfo = computed(() => store.networkinfo)

const classObject = computed(() => {
  return ['page', 'block-page'].join(' ')
})

const maxSize = computed(() => {
  let result = 600000

  if (networkinfo.value) {
    result = networkinfo.value.block_size_limit
  }

  return result
})

const medianSize = computed(() => {
  let result = 0

  if (networkinfo.value) {
    result = networkinfo.value.block_size_median
  }

  return result
})

// Load block data
const loadBlock = () => {
  const routeBlockId = route.params.blockId

  blockId.value = routeBlockId
  api.block(routeBlockId)
}

const onBlockEnd = (result) => {
  loadError.value = false

  block.value = result

  console.log('Block loaded:', result)
}

const onBlockError = () => {
  loadError.value = true
}

// Watch for route changes
watch(route, (value) => {
  if (value.params.blockId != blockId.value) {
    blockId.value = value.params.blockId
    loadBlock()
  }
})

onBeforeMount(() => {
  const routeBlockId = route.params.blockId

  events.listen('api-block-end', onBlockEnd, id)
  events.listen('api-block-error', onBlockError, id)

  if (routeBlockId && routeBlockId.length > 0) {
    document.title = t('general.block', null, 1) + ' ' + routeBlockId + ' | Explore Monero'
    loadBlock()
  }
})

onBeforeUnmount(() => {
  events.clearListener(id)
})

onUnmounted(() => {
  store.updateBlock(null)
})
</script>

<style lang="scss" scoped>

.block-page {
  min-height: 400px;

  .wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .content {
    margin-bottom: 40px;
  }

  .block-details + .transaction-list {
    margin-top: 60px;
    border-top: 1px solid rgba(var(--front), 0.1);
    padding-top: 40px;
  }
}

</style>
