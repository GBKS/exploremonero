<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="title"
          :description="description"
        />
        
        <div v-if="searchResults && searchResults.status === 'fail'" class="search-results">
          <div class="no-results">
            <h3>{{ $t('search.no_results') }}</h3>
            <p>{{ $t('search.search_help') }}</p>
          </div>
        </div>
        
        <div v-if="isLoading" class="search-loading">
          <p>{{ $t('search.searching') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMoneroStore } from '~/stores/monero.js'

const props = defineProps({
  query: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const { t } = useI18n()
const store = useMoneroStore()

const id = 'SearchPage'
const isLoading = ref(false)

const searchResults = computed(() => store.searchresults)

const classObject = computed(() => {
  return ['page', 'search-page'].join(' ')
})

const title = computed(() => {
  if (searchResults.value) {
    if (searchResults.value.status === 'fail') {
      const query = route.query.q
      return t('search.no_results_for', { query })
    } else if (searchResults.value.status === 'success') {
      return t('search.results_found')
    }
  }

  const query = route.query.q
  if (query) {
    return t('search.searching_for', { query })
  }

  return t('search.title')
})

const description = computed(() => {
  return t('search.description')
})

const onSearchStart = () => {
  isLoading.value = true
}

const onSearchEnd = () => {
  isLoading.value = false
}

const onSearchError = () => {
  isLoading.value = false
}

// Watch for route changes
watch(route, (value) => {
  // Handle route changes for new searches
  const query = value.query.q
  if (query && query.length > 0) {
    api.search(query)
  }
})

onBeforeMount(() => {
  document.title = 'Search - Explore Monero'

  // Set up event listeners
  events.listen('api-search-start', onSearchStart, id)
  events.listen('api-search-end', onSearchEnd, id)
  events.listen('api-search-error', onSearchError, id)

  if (!searchResults.value && route.query) {
    const query = route.query.q

    if (query && query.length > 0) {
      api.search(query)
    }
  }
})

onBeforeUnmount(() => {
  events.clearListener(id)
})
</script>