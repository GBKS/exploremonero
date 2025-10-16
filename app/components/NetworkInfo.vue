<template>
    <Transition
		name="network-info-transition" 
		:duration="1000" 
		appear
		:key="transitionKey"
	>
		<div class="network-info">
			<div class="wrap">
				<div class="content">
					<ol>
						<li>
							<h3>{{ $t('general.difficulty') }}</h3>
							<p>{{ difficulty }}</p>
						</li>
						<li v-if="hashrate">
							<h3>{{ $t('general.hash_rate') }}</h3>
							<p>{{ hashrate }} H/s</p>
						</li>
						<li v-if="fees">
							<h3>{{ $t('general.fees_per_kb') }}</h3>
							<p>{{ fees }} XMR</p>
						</li>
						<li>
							<h3>{{ $t('general.transactions_total') }}</h3>
							<p>{{ transactionCount }}</p>
						</li>
						<li>
							<h3>{{ $t('general.transactions_queued') }}</h3>
							<p>{{ transactionQueue }}</p>
						</li>
						<li>
							<h3>{{ $t('general.median_block_size') }}</h3>
							<p>{{ blocksize }} Bytes</p>
						</li>
						<li>
							<h3>{{ $t('general.block_height') }}</h3>
							<p>{{ blockheight }}</p>
						</li>
					</ol>
				</div>
			</div>
		</div>
    </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  networkinfo: {
    type: Object,
    required: true
  }
})

const transitionKey = ref(0)

const difficulty = computed(() => {
  return accounting.formatNumber(parseFloat(props.networkinfo.difficulty), 0)
})

const transactionCount = computed(() => {
  return accounting.formatNumber(parseFloat(props.networkinfo.tx_count), 0)
})

const transactionQueue = computed(() => {
  return accounting.formatNumber(parseFloat(props.networkinfo.tx_pool_size), 0)
})

const hashrate = computed(() => {
  return props.networkinfo.hash_rate ? accounting.formatNumber(parseFloat(props.networkinfo.hash_rate), 0) : null
})

const fees = computed(() => {
	if(props.networkinfo.fee_per_kb) {
		const result = parseFloat(props.networkinfo.fee_per_kb / 1000000000000)
		return Math.round(result * 100000000) / 100000000
	} else {
		return null
	}
})

const blocksize = computed(() => {
  return accounting.formatNumber(parseFloat(props.networkinfo.block_size_median), 0)
})

const blockheight = computed(() => {
  const height = props.networkinfo.height
  return height ? accounting.formatNumber(height, 0) : ''
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

.network-info {
	> .wrap {
		> .content {
			ol {
				@include mixins.clearfix;
				
				li {
					@include mixins.clearfix;
					margin-top: 30px;

					h3 {
						color: rgba(var(--front), 0.5);
						font-size: 12px;
						font-weight: 700;
						text-transform: uppercase;
					}

					p {
						color: rgba(var(--front), 1);
						font-size: 22px;
						font-weight: 300;
					}
				}
			}
		}
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				ol {
					li {
						float: left;
						width: 50%;

						&:nth-child(2n+1) {
							padding-right: 5px;
						}

						&:nth-child(2n) {
							padding-left: 5px;
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		> .wrap {
			> .content {
				ol {
					li {
						float: left;
						width: 25%;
					}
				}
			}
		}
	}

	&.network-info-transition-enter-active,
	&.network-info-transition-leave-active {
		> .wrap {
			> .content {
				ol {
					li {
						h3 {
							transition: all 400ms animations.$easeOutCubic;
						}

						p {
							transition: all 400ms animations.$easeOutCubic;
						}

						&:nth-child(0) {
							h3 { transition-delay: 50ms; }
							p { transition-delay: 75ms; }
						}

						&:nth-child(1) {
							h3 { transition-delay: 100ms; }
							p { transition-delay: 125ms; }
						}

						&:nth-child(2) {
							h3 { transition-delay: 150ms; }
							p { transition-delay: 175ms; }
						}

						&:nth-child(3) {
							h3 { transition-delay: 200ms; }
							p { transition-delay: 225ms; }
						}

						&:nth-child(4) {
							h3 { transition-delay: 250ms; }
							p { transition-delay: 275ms; }
						}

						&:nth-child(5) {
							h3 { transition-delay: 300ms; }
							p { transition-delay: 325ms; }
						}

						&:nth-child(6) {
							h3 { transition-delay: 350ms; }
							p { transition-delay: 375ms; }
						}

						&:nth-child(7) {
							h3 { transition-delay: 400ms; }
							p { transition-delay: 425ms; }
						}
					}
				}
			}
		}
	}

	&.network-info-transition-enter-from {
		> .wrap {
			> .content {
				ol {
					li {
						h3 {
							opacity: 0;
							// transform: translateY(70px) scale(1.15);
							transform: translateX(30px);
						}

						p {
							opacity: 0;
							// transform: translateY(70px) scale(1.15);
							transform: translate(30px);
						}
					}
				}
			}
		}
	}

	&.network-info-transition-enter-to {
			> .wrap {
			> .content {
				ol {
					li {
						h3 {
							opacity: 1;
							transform: translateX(0px);
						}

						p {
							opacity: 1;
							transform: translateX(0px);
						}
					}
				}
			}
		}
	}
}

</style>