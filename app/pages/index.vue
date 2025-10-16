<template>
  <div class="page home-page">
    <div class="wrap">
      <div class="content">
        <PageHeader
          :title="$t('home.intro')"
          :description="$t('home.para')"
        />
        <Transition
			name="home-nav-transition"
			:duration="2000"
			appear
			:key="transitionKey"
		>
          <nav>
            <h2>{{ $t('home.verify_a_transaction') }}</h2>
            <NuxtLink to="/receipt" class="--primary">
              <span>{{ $t('home.i_sent_monero') }}</span>
            </NuxtLink>
            <NuxtLink to="/deposit" class="--primary">
              <span>{{ $t('home.i_received_monero') }}</span>
            </NuxtLink>
            <h2>{{ $t('home.explore_the_network') }}</h2>
            <NuxtLink to="/blocks">
              <span>{{ $t('home.view_new_blocks') }}</span>
            </NuxtLink>
            <NuxtLink to="/queue">
              <span>{{ $t('home.view_transaction_queue') }}</span>
            </NuxtLink>
            <NuxtLink to="/info">
              <span>{{ $t('home.network_info_and_about') }}</span>
            </NuxtLink>
          </nav>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoneroStore } from '~/stores/monero.js'

const page = ref(0)
const transitionKey = ref(0)

const store = useMoneroStore()
const storeTransactions = computed(() => store.transactions)

onBeforeMount(() => {
  document.title = 'Explore Monero'

  const storedTransactions = storeTransactions.value
  if (!storedTransactions) {
    // Use the api from composables (auto-imported by Nuxt)
    // api.transactions(page.value)
  }
})

// Lifecycle hooks
onMounted(() => {
  transitionKey.value += 1
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.home-page {
	padding-left: 15px;
	padding-right: 15px;

	> .wrap {
		max-width: 450px;
		margin-left: auto;
		margin-right: auto;

		> .content {
			nav {
				// margin-top: 10px;
				display: block;

				a {
					display: block;
					font-size: 16px;
					font-weight: 600;
					line-height: 50px;
					border: 1px solid rgba(var(--front), 0.2);
					border-color: rgba(var(--front), 0.2);
					border-radius: 5px;
					text-align: center;
					box-shadow: 0 10px 30px -10px;
					color: rgba(var(--front), 0.05);
					transition: all 150ms animations.$ease;

					span {
						color: rgba(var(--front), 0.9);
						transition: all 150ms animations.$ease;
					}

					&.--primary {
						box-shadow: 0 10px 30px -10px;
						color: rgba(var(--front), 0.25);
						background-color: var(--purple);
						border-width: 0;

						span {
							color: white;
						}
					}

					&:hover {
						border-color: var(--blue);

						span {
							color: var(--blue);
						}

						&.--primary {
							background-color: var(--blue);

							span {
								color: white;
							}
						}
					}

					& + a {
						margin-top: 15px;
					}

					& + h2 {
						margin-top: 40px;
					}
				}

				h2 {
					margin-top: 20px;
					font-size: 20px;
					color: var(--frontHex);

					& + a {
						margin-top: 15px;
					}
				}

				&.home-nav-transition-enter-active,
				&.home-nav-transition-leave-active {
					a,
					h2 {
						transition: all 400ms animations.$easeOutCubic !important;

						&:nth-child(1) { transition-delay: 50ms !important; }
						&:nth-child(2) { transition-delay: 100ms !important; }
						&:nth-child(3) { transition-delay: 150ms !important; }
						&:nth-child(4) { transition-delay: 200ms !important; }
						&:nth-child(5) { transition-delay: 250ms !important; }
						&:nth-child(6) { transition-delay: 300ms !important; }
						&:nth-child(7) { transition-delay: 350ms !important; }
						&:nth-child(8) { transition-delay: 400ms !important; }
					}

					h2 {
						transition-delay: 250ms !important;
					}
				}

				&.home-nav-transition-enter-from {
					a,
					h2 {
						transform: translateY(70px) scale(1.15);
						opacity: 0;
					}
				}

				&.home-nav-transition-enter-to {
					a,
					h2 {
						transform: translateY(0);
						opacity: 1;
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-down) {
		margin-top: -40px;
	}
}

</style>
