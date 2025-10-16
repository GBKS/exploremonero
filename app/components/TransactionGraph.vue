
<template>
  <div :class="classObject">
    <Transition name="about-transaction-graph-transition" :duration="1000" appear>
      <div class="wrap">
        <div class="content">
          <TransactionGraphNav 
            :options="options" 
            :activeOption="activeOption" 
            @select="navigate"
          />
          <ol>
            <TransactionGraphBar
              v-for="(item, index) in bars"
              :key="item.date"
              :data="item"
              :maxCount="maxCount"
              :barCount="barCount"
              :index="index"
              :activeIndex="activeBarIndex"
              @activate="activateBar"
            />
          </ol>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// Get current instance to access $t
const { proxy } = getCurrentInstance()

// Data
const activeOption = ref('transactions')
const activeBarIndex = ref(null)

// Computed
const options = computed(() => [
  {
    id: 'transactions',
    name: proxy.$t('general.transaction', null, 10)
  },
  {
    id: 'hashrate',  
    name: proxy.$t('general.hash_rate')
  }
])

const classObject = computed(() => {
  const c = ['about-transaction-graph']

  if (activeBarIndex.value) {
    c.push('-has-active-bar')
  }

  return c.join(' ')
})

const bars = computed(() => {
  const result = []
  const items = props.data[activeOption.value]

  for (const i in items) {
    result.push({
      date: i, 
      count: items[i]
    })
  }

  result.reverse()

  // if(result.length > 7) {
  //     result = result.splice(result.length - 7);
  // }

  return result
})

const barCount = computed(() => {
  const items = props.data[activeOption.value]
  const keys = Object.keys(items)
  return keys.length
})

const maxCount = computed(() => {
  let result = 0
  const items = props.data[activeOption.value]

  for (const i in items) {
    result = Math.max(result, items[i])
  }

  return result
})

// Methods
const navigate = (id) => {
  activeOption.value = id
}

const activateBar = (index) => {
  activeBarIndex.value = index
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.about-transaction-graph {
	margin-top: 30px;

	> .wrap {
		> .content {
			:deep(nav) {
				a {
					display: inline-block;
					text-transform: uppercase;
					font-size: 12px;
					font-weight: 700;
					color: rgba(var(--front), 0.5);

					&.-active,
					&:hover {
						color: var(--blue);
					}

					& + a {
						margin-left: 10px;
					}
				}
			}

			:deep(ol) {
				margin-top: 30px;
				@include mixins.clearfix;
				
				li {
					float: left;

					.bar-wrap {
						height: 100px;
						width: 6px;
						background-color: rgba(var(--front), 0.05);
						border-radius: 20px;
						position: relative;
						margin-left: auto;
						margin-right: auto;
						overflow: hidden;

						.bar {
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							background-color: var(--yellow);
							transition: all 500ms animations.$ease;
						}
					}

					p {
						margin-top: 5px;
						text-align: center;
						opacity: 0;
						transition: all 250ms animations.$ease;
					}
				}
			}
		}
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				:deep(ol) {		
					width: 100%;
					padding-bottom: 60px;
					overflow: hidden;

					li {
						position: relative;

						p {
							position: absolute;
							top: 100%;
							opacity: 0;
						}

						&.-left {
							p {
								left: 0;
								transform: translateX(0);
							}
						}

						&.-center {
							p {
								left: 50%;
								transform: translateX(-50%);
							}
						}

						&.-right {
							p {
								right: 0;
							}
						}

						&.-today,
						&.-active {
							p {
								opacity: 1;
							}
						}

						&.-active {
							.bar-wrap {
								.bar {
									background-color: var(--blue);
								}
							}

							p {
								color: var(--blue);
							}
						}
					}
				}
			}
		}

		&.-has-active-bar {
			> .wrap {
				> .content {
					:deep(ol) {
						li {
							&.-today { 
								p {
									opacity: 0;
								}

								&.-active {
									p {
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

	@include mixins.media-query(medium-up) {
		> .wrap {
			> .content {
				:deep(ol) {					
					li {
						.bar-wrap {
							width: 12px;
						}

						p {

						}

						&.-show-date,
						&:hover {
							p {
								opacity: 1;
							}
						}

						&:hover {
							.bar-wrap {
								.bar {
									background-color: var(--blue);
								}
							}

							p {
								color: var(--blue);
							}
						}
					}
				}
			}
		}
	}
}

.about-transaction-graph-transition-enter-active,
.about-transaction-graph-transition-leave-active {
	> .content {
		:deep(nav) {
			a {
				transition: all 400ms animations.$easeOutCubic;
				transition-delay: 50ms;
			}
		}

		:deep(ol) {
			li {
				transition: all 400ms animations.$easeOutCubic;
				transition-delay: 100ms;
			}
		}
	}
}

.about-transaction-graph-transition-enter-from {
	> .content {
		:deep(nav) {
			a {
				transform: translateY(20px) scale(1.1);
				opacity: 0;
			}
		}

		:deep(ol) {
			li {
				transform: translateY(30px) scale(1.1);
				opacity: 0;
			}
		}
	}
}

.about-transaction-graph-transition-enter-to {
	> .content {
		:deep(nav) {
			a {
				transform: translateY(0);
				opacity: 1;
			}
		}

		:deep(ol) {
			li {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
}

.about-transaction-graph-transition-leave-from {
	> .content {
		:deep(nav) {
			a {
				transform: translateY(0);
				opacity: 1;
			}
		}

		:deep(ol) {
			li {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
}

.about-transaction-graph-transition-leave-to {
	> .content {
		:deep(nav) {
			a {
				transform: translateY(10px);
				opacity: 0;
			}
		}

		:deep(ol) {
			li {
				transform: translateY(10px);
				opacity: 0;
			}
		}
	}
}

</style>