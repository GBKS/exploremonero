<template>
  <li :class="classObject">
    <div class="arrow" v-html="icons.arrowRight" />
    <div class="wrap">
      <div class="content">
        <div class="info" @click.prevent="toggle">
          <ol>
            <li>
              <p><b>{{ $t('general.block', null, 1) }}</b><br/>{{ formattedHeight }}</p>
            </li>
            <li>
              <p @click="toggleTime" :title="hoverTime">
                <b>{{ $t('general.created') }}</b><br/>{{ formattedTime }}
              </p>
            </li>
            <li>
              <div class="row" :title="$t('blocks.block_size_graph_info')">
                <p>
                  <b>{{ $t('general.size') }}:</b> {{ size }} KB
                </p>
                <div class="bar">
                  <div class="indicator" :style="sizeStyle" />
                  <div class="median" :style="medianStyle" />
                </div>
              </div>
              <div class="row">
                <p>
                  <b>{{ $t('general.transaction', null, transactionCount) }}:</b> {{ transactionCount }}
                </p>
                <ol>
                  <li
                    v-for="n in transactionCount"
                    :key="n"
                    :style="transactionStyle"
                  />
                </ol>
              </div>
            </li>
          </ol>
          <div class="icon" v-html="icons.down" v-if="false && !hideExpand" />
          <div class="link" v-if="!hideLink">
            <NuxtLink
				:to="'/block/' + height" 
				v-html="icons.link"
				aria-label="View block details"
			/>
          </div>
        </div>

        <TransactionList
          v-if="expanded && regularTransactions.length > 0"
          :show-background="true"
          :title="$t('general.transaction', null, regularTransactions.length)"
          :transactions="regularTransactions"
        />

        <TransactionList
          v-if="expanded"
          :show-background="true"
          :title="$t('general.mining_transactions')"
          :transactions="miningTransactions"
        />
      </div>
    </div>
  </li>
</template>

<script setup>
import { DateTime } from 'luxon'

// Props
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  maxTransactions: {
    type: Number,
    default: 0
  },
  maxSize: {
    type: Number,
    default: 600000
  },
  medianSize: {
    type: Number,
    default: 0
  },
  startExpanded: {
    type: Boolean,
    default: false
  },
  hideLink: {
    type: Boolean,
    default: false
  },
  hideExpand: {
    type: Boolean,
    default: false
  }
})

// Reactive state
const expanded = ref(props.startExpanded)
const timeToggled = ref(false)
const transactions = ref(null)
const blockDetails = ref(null)

// Static values
const id = 'block-list-item'
const uniqueId = 'block-list-item_' + props.block.hash
const log = false
let loadingTransactions = false

// Computed properties
const classObject = computed(() => {
  const classes = ['block-list-item']

  if (expanded.value) {
    classes.push('--expanded')
  }

  return classes.join(' ')
})

const hash = computed(() => {
  if(props.block.block_header) {
	return props.block.block_header.hash;
  } else {
	return props.block.hash
  }
})

const height = computed(() => {
  if(props.block.block_header) {
	return props.block.block_header.height;
  } else {
	return props.block.height
  }
})

const formattedHeight = computed(() => {
  return accounting.formatNumber(height.value, 0)
})

const formattedTime = computed(() => {
  let timestamp;
  if(props.block.block_header) {
	timestamp = parseInt(props.block.block_header.timestamp);
  } else {
	timestamp = parseInt(props.block.timestamp);
  }

  if (timeToggled.value) {
    return DateTime.fromSeconds(timestamp).toFormat('HH:mm:ss')
  }
  return DateTime.fromSeconds(timestamp).toRelative()
})

const hoverTime = computed(() => {
  let timestamp;
  if(props.block.block_header) {
	timestamp = props.block.block_header.timestamp;
  } else {
	timestamp = props.block.timestamp;
  }

  return DateTime.fromSeconds(parseInt(timestamp)).toFormat('yyyy-MM-dd HH:mm:ss')
})

const size = computed(() => {
  let size;
  if(props.block.block_header) {
	size = props.block.block_header.block_size;
  } else {
	size = props.block.block_size;
  }

  return Math.round(size / 1000 * 100) / 100
})

const sizeStyle = computed(() => {
  const percentage = Math.min(100, (props.block.block_size / props.maxSize) * 100)
  return {
    width: percentage + '%'
  }
})

const medianStyle = computed(() => {
  const percentage = (props.medianSize / props.maxSize) * 100
  return {
    left: percentage + '%'
  }
})

const transactionCount = computed(() => {
  if(props.block.block_header) {
	return props.block.block_header.num_txes;
  } else {
	return props.block.num_txes;
  }
})

const transactionStyle = computed(() => {
  const percentage = Math.min(100, (transactionCount.value / props.maxTransactions) * 100)
  return {
    opacity: percentage / 100
  }
})

const regularTransactions = computed(() => {
  if (!transactions.value) return []
  return transactions.value.txs.filter(tx => tx.as_json.vin.length > 0)
})

const miningTransactions = computed(() => {
  if (!transactions.value) return []
  return transactions.value.txs.filter(tx => tx.as_json.vin.length === 0)
})

// Methods
const toggle = () => {
  if (!props.hideExpand) {
    expanded.value = !expanded.value
  }

  console.log('Toggle expanded:', expanded.value, transactions.value, loadingTransactions)

  if(expanded.value && transactions.value === null && !loadingTransactions) {
	loadBlock()
  }
}

const toggleTime = () => {
  timeToggled.value = !timeToggled.value
}

// Load block data
const loadBlock = () => {
  events.listen('api-block-end', onBlockEnd, id)
  events.listen('api-block-error', onBlockError, id)

  api.block(hash.value)
}

const onBlockEnd = (result) => {
  blockDetails.value = result

  events.unlisten('api-block-end', onBlockEnd, id)
  events.unlisten('api-block-error', onBlockError, id)

  console.log('Block loaded:', result)

  loadTransactions()
}

const onBlockError = () => {
  events.unlisten('api-block-end', onBlockEnd, id)
  events.unlisten('api-block-error', onBlockError, id)
}

// Load transaction data
const loadTransactions = () => {
  loadingTransactions = true

  console.log('Loading transactions for block:', props.block)
  
  events.listen('api-transactions-end', onTransactionsEnd, id)
  events.listen('api-transactions-error', onTransactionsError, id)

  api.transactions(blockDetails.value.tx_hashes)
}

const onTransactionsEnd = (result) => {
  loadingTransactions = false

  events.unlisten('api-transactions-end', onTransactionsEnd, id)
  events.unlisten('api-transactions-error', onTransactionsError, id)

  transactions.value = result

  console.log('Transactions loaded:', result)
}

const onTransactionsError = () => {
  loadingTransactions = false

  events.unlisten('api-transactions-end', onTransactionsEnd, id)
  events.unlisten('api-transactions-error', onTransactionsError, id)
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.block-list-item {
	border-radius: 10px;
	border-top-left-radius: 3px;
	border-bottom-right-radius: 3px;
	border: 1px solid rgba(var(--front), 0.1);
	border-color: rgba(var(--front), 0.1);
	transition: border 250ms animations.$ease;
	position: relative;

	> .arrow {
		position: absolute;
		top: 22px;
		left: -60px;
		opacity: 0;
		transition: all 250ms animations.$ease;
		transform: translateX(-20px);

		:deep(svg) {
			fill: var(--purple);
			stroke: var(--purple);
			width: 40px;
			height: 40px;
		}
	}

	> .wrap {
		> .content {
			.info {
				position: relative;
				@include mixins.clearfix;

				> ol {
					> li {
						&:nth-child(1),
						&:nth-child(2) {
							p {
								color: rgba(var(--front), 1);
								font-size: 24px;
								line-height: 22px;
								letter-spacing: -0.05rem;

								b {
									color: rgba(var(--front), 0.5);
									font-size: 14px;
									font-weight: 400;
								}
							}
						}

						&:nth-child(1) {
							p {
								font-weight: 600;
							}
						}

						&:nth-child(2) {
							p {
								font-weight: 300;
							}
						}

						&:nth-child(3) {
							.row {
								@include mixins.clearfix;

								p {
									float: left;
									width: 50%;
									color: rgba(var(--front), 0.75);
									font-size: 14px;
									line-height: 18px;

									b {
										color: rgba(var(--front), 0.5);
										font-size: 14px;
										font-weight: 400;
									}
								}

								.bar {
									float: left;
									width: 50%;
									background-color: rgba(var(--front), 0.1);
									height: 4px;
									border-radius: 100px;
									transform: translateY(7px);
									position: relative;

									.indicator {
										background-color: var(--blue);
										height: 100%;
										border-radius: 100px;
									}

									.median {
										position: absolute;
										top: 0;
										width: 2px;
										background-color: rgba(var(--front), 0.35);
										height: 100%;
										// border-radius: 1px;
										transform: translateX(-1px);
									}
								}

								ol {
									@include mixins.clearfix;
									float: left;
									width: 50%;
									transform: translateY(5px);
									display: flex;
									flex-wrap: wrap;
									gap: 2px;

									li {
										float: left;
										box-sizing: border-box;
										background-color: var(--purple);
										aspect-ratio: 1;
										border-radius: 2px;
										width: calc(4% - 2px);
									}
								}

								& + .row {
									margin-top: 5px;
								}
							}
						}
					}
				}

				.icon {
					position: absolute;
					right: 15px;
					top: 50%;
					transform: translateY(-50%);
					border: 1px solid rgba(var(--front), 0.2);
					border-radius: 100px;
					width: 30px;
					height: 30px;
					line-height: 30px;
					text-align: center;
					opacity: 0;
					transition: all 250ms animations.$ease;
					transform: translateY(25px) scale(0.5);

					:deep(svg) {
						vertical-align: middle;
						width: 14px;
						height: 14px;
						fill: #bbbbbb;
						stroke: #bbbbbb;
					}
				}

				.link {
					position: absolute;

					a {
						display: block;
						width: 30px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						transition: all 250ms animations.$ease;

						:deep(svg) {
							vertical-align: middle;
							width: 18px;
							height: 18px;
							color: rgba(var(--front), 1);
						}
					}
				}

				&:hover {
					border-color: rgba(var(--front), 0.5);
					cursor: pointer;

					.link {
						a {
							opacity: 0.2;

							&:hover {
								opacity: 1;
							}
						}
					}
				}
			}
		}
	}

	&:hover {
		border-color: rgba(var(--yellowRGB), 1);
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				padding-top: 10px;
				// padding-bottom: 15px;

				.info {
					padding-bottom: 15px;

					> ol {
						> li {
							padding: 15px 15px 0 15px;

							&:nth-child(1),
							&:nth-child(2) {
								float: left;
								width: 50%;
								padding-top: 0;
							}

							&:nth-child(3) {
								float: left;
								width: 100%;
								padding-top: 15px;

								.row {
									p {
										width: 40%;
									}

									.bar {
										width: 60%;
									}

									ol {
										width: 60%;
									}
								}
							}
						}
					}

					.link {
						right: 5px;
						top: -5px;
						opacity: 0.2;
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		> .wrap {
			> .content {
				.info {
					> ol {
						> li {
							float: left;
							padding: 15px 0 22px 25px;

							&:nth-child(1),
							&:nth-child(2) {
								width: calc(30% - 15px);
							}

							&:nth-child(3) {
								width: calc(40% - 15px);
								padding-top: 25px;
							}
						}
					}

					.link {
						right: 5px;
						top: 5px;

						a {
							opacity: 0;
						}
					}
				}
			}
		}
	}

	&.--expanded {
		border-color: rgba(var(--blueRGB), 0.25);
		box-shadow: 0 50px 150px -50px rgba(var(--blueRGB), 0.1);

		> .arrow {
			opacity: 1;
			transform: translateX(0px);
		}

		.info {
			p {
				&:first-child {
					border-bottom-left-radius: 0;
				}
			}

			.icon {
				transform: translateY(-50%) rotate(180deg);
			}
		}
	}

	&.--start-expanded {
		> .wrap {
			> .content {
				.info {
					&:hover {
						cursor: default;
					}
				}
			}
		}
	}

	& + .block-list-item {
		margin-top: 15px;
	}
}

.block-list-item-transition-enter-active,
.block-list-item-transition-leave-active {
	transition: all 400ms animations.$easeOutCubic;
	transform-origin: center center;
}

.block-list-item-transition-enter {
	opacity: 0;
	transform: translateY(-20px);
}

.block-list-item-transition-enter-to {
	opacity: 1;
	transform: translateX(0px);
}

.block-list-item-transition-leave {
	opacity: 1;
	transform: translateX(0px);
}

.block-list-item-transition-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

// Move

.block-list-item-transition-move {
	transition: all 400ms animations.$ease;
}

</style>