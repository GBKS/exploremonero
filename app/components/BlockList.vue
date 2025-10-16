<template>
    <Transition
		name="block-list-transition" 
		:duration="1000" 
		appear
		:key="transitionKey"
	>
		<div class="block-list" v-if="active">
			<div class="wrap">
				<div class="content">
					<TransitionGroup 
						duration="1000" 
						name="block-list-item-transition"
						tag="ol" 
					>
						<BlockListItem
							v-for="item in blocks"
							:key="item.height"
							:block="item"
							:max-transactions="maxTransactions"
							:max-size="maxSize"
							:median-size="medianSize"
						/>
					</TransitionGroup>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { useMoneroStore } from '~/stores/monero.js'

const props = defineProps({
  blocks: {
    type: Array,
    default: () => []
  },
  active: {
	type: Boolean,
	default: false
  }
})

const store = useMoneroStore()
const networkinfo = computed(() => store.networkinfo)
const transitionKey = ref(0)

const maxTransactions = computed(() => {
  let max = 0

  console.log('maxTransactions', props.blocks)
  
  for (const block of props.blocks) {
    if (block.num_txes) {
      max = Math.max(max, block.num_txes)
    }
  }

  return max
})

const maxSize = computed(() => {
  let result = 600000

  if (networkinfo.value && networkinfo.value.data) {
    result = networkinfo.value.data.block_size_limit
  }

  return result
})

const medianSize = computed(() => {
  let result = 0

  if (networkinfo.value && networkinfo.value.data) {
    result = networkinfo.value.data.block_size_median
  }

  return result
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

.block-list {
	> .wrap {
		// padding: 20px;

		> .content {
			> h2 {
				color: var(--yellow);
				text-transform: uppercase;
				font-weight: 900;
				font-size: 14px;
			}

			> ol {
				margin-top: 10px;
			}
		}
	}

	&.block-list-transition-enter-active,
	&.block-list-transition-leave-active {
		> .wrap {
			> .content {
				> h2 {
					transition: all 400ms animations.$easeOutCubic;
					transition-delay: 50ms;
				}

				> ol {
					> :deep(li) {
						transition: all 400ms animations.$easeOutCubic;

						&:nth-child(1) { transition-delay: 75ms; }
						&:nth-child(2) { transition-delay: 100ms; }
						&:nth-child(3) { transition-delay: 125ms; }
						&:nth-child(4) { transition-delay: 150ms; }
						&:nth-child(5) { transition-delay: 175ms; }
						&:nth-child(6) { transition-delay: 200ms; }
						&:nth-child(7) { transition-delay: 225ms; }
						&:nth-child(8) { transition-delay: 250ms; }
						&:nth-child(9) { transition-delay: 275ms; }
						&:nth-child(10) { transition-delay: 300ms; }

						> .wrap {
							> .content {
								.info {
									> ol {
										> li {
											&:nth-child(3) {
												.row {
													.bar {
														.indicator {
															transition: all 500ms animations.$easeOutCubic;
															transition-delay: 400ms;
															transform-origin: left center;
														}
													}

													ol {
														li {
															transition: all 500ms animations.$easeOutCubic;

															&:nth-child(1) { transition-delay: 400ms; }
															&:nth-child(2) { transition-delay: 425ms; }
															&:nth-child(3) { transition-delay: 450ms; }
															&:nth-child(4) { transition-delay: 475ms; }
															&:nth-child(5) { transition-delay: 500ms; }
															&:nth-child(6) { transition-delay: 525ms; }
															&:nth-child(7) { transition-delay: 550ms; }
															&:nth-child(8) { transition-delay: 575ms; }
															&:nth-child(9) { transition-delay: 600ms; }
															&:nth-child(10) { transition-delay: 625ms; }
															&:nth-child(11) { transition-delay: 650ms; }
															&:nth-child(12) { transition-delay: 675ms; }
															&:nth-child(13) { transition-delay: 700ms; }
															&:nth-child(14) { transition-delay: 725ms; }
															&:nth-child(15) { transition-delay: 750ms; }
															&:nth-child(16) { transition-delay: 775ms; }
															&:nth-child(17) { transition-delay: 800ms; }
															&:nth-child(18) { transition-delay: 825ms; }
															&:nth-child(19) { transition-delay: 850ms; }
															&:nth-child(20) { transition-delay: 875ms; }
															&:nth-child(21) { transition-delay: 900ms; }
															&:nth-child(22) { transition-delay: 925ms; }
															&:nth-child(23) { transition-delay: 950ms; }
															&:nth-child(24) { transition-delay: 975ms; }
															&:nth-child(25) { transition-delay: 1000ms; }
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	&.block-list-transition-enter-from {
		> .wrap {
			> .content {
				> h2 {
					transform: translateY(-50px);
				}

				> ol {
					> :deep(li) {
						opacity: 0;
						transform: translateY(70px) scale(1.15);

						> .wrap {
							> .content {
								.info {
									> ol {
										> li {
											&:nth-child(3) {
												.row {
													.bar {
														.indicator {
															transform: scaleX(0.1);
														}
													}

													ol {
														li {
															opacity: 0;
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	&.block-list-transition-enter-to {
		> .wrap {
			> .content {
				> h2 {
					transform: translateY(0);
				}

				> ol {
					> :deep(li) {
						opacity: 1;
						transform: translateY(0px) scale(1);

						> .wrap {
							> .content {
								.info {
									> ol {
										> li {
											&:nth-child(3) {
												.row {
													.bar {
														.indicator {
															transform: scaleX(1);
														}
													}

													ol {
														li {
															opacity: 1;
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

</style>