<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="$t('info.network_info.title')"
          :description="$t('info.network_info.text')"
        >
          <TestnetToggle />
        </PageHeader>

        <template v-if="networkinfo">
          <NetworkInfo :networkinfo="networkinfo" />

          <TransactionGraph
            v-if="dailyTransactionStats && !testnet"
            :data="dailyTransactionStats"
          />

          <PageHeader
            :title="$t('info.about.title')"
            :description="$t('info.about.text')"
          />
          <AboutInfo />
        </template>

        <LoadError
          v-if="networkinfoError"
          :text="$t('error.check_back_soon')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useMoneroStore } from '~/stores/monero.js'

const { t } = useI18n()
const store = useMoneroStore()

const id = 'InfoPage'
const log = false
const networkinfoError = ref(false)

const networkinfo = computed(() => store.networkinfo)
const dailyTransactionStats = computed(() => store.dailyTransactionStats)
const testnet = computed(() => store.testnet)

const classObject = computed(() => {
  return ['page', 'info-page'].join(' ')
})

const onNetworkinfoStart = () => {
  if (log) {
    console.log(id + '.onNetworkinfoStart')
  }
}

const onNetworkinfoEnd = () => {
  networkinfoError.value = false
}

const onNetworkinfoError = () => {
  networkinfoError.value = true
}

// Watch for testnet changes
watch(testnet, () => {
  api.networkinfo()
})

onBeforeMount(() => {
  document.title = t('info.page_title')

  events.listen('api-networkinfo-start', onNetworkinfoStart, id)
  events.listen('api-networkinfo-end', onNetworkinfoEnd, id)
  events.listen('api-networkinfo-error', onNetworkinfoError, id)

  if (!networkinfo.value) {
    api.networkinfo()
  }

  // if (!dailyTransactionStats.value) {
  //   api.dailyTransactionStats();
  // }
})

onBeforeUnmount(() => {
  events.clearListener(id)
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.info-page {
	> .wrap {
		> .content {
			.page-header {

			}

			.network-info {
				& + .page-header {
					margin-top: 30px;
				}
			}
		}
	}
}

.page-header-transition-enter-active,
.page-header-transition-leave-active {
	> .content {
		.about-testnet-toggle {
			transition: all 400ms animations.$easeOutCubic;
		}
	}
}

.page-header-transition-enter-from {
	> .content {
		.about-testnet-toggle {
			opacity: 0;
			transform: translateY(-30%) scale(1.1) !important;
		}
	}
}

.page-header-transition-enter-to {
	> .content {
		.about-testnet-toggle {
			opacity: 1;
			// transform: translateY(0px);
		}
	}
}

.page-header-transition-leave-from {
	> .content {
		.about-testnet-toggle {
			opacity: 1;
		}
	}
}

.page-header-transition-leave-to {
	> .content {
		.about-testnet-toggle {
			opacity: 0;
			transform: translateY(-30%) scale(1.1) !important;
		}
	}
}

</style>
