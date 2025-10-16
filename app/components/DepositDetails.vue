<template>
  <div :class="classObject">
    <template v-if="data && matchingOutput && transaction">
      <Transition name="deposit-details-transition" :duration="1000" appear>
        <div class="wrap">
          <div class="content">
            <ol class="--two-columns">
              <li>
                <h5>{{ $t('general.amount_received') }}</h5>
                <p>{{ amount }}</p>
              </li>
              <li>
                <confirmation-progress
                  v-if="transaction"
                  :confirmations="transaction.data.confirmations"
                  :is-mining-reward="isMiningReward"
                />
              </li>
              <li>
                <h5 @click="toggleTime">{{ $t('general.time') }}</h5>
                <p><NuxtLink :to="blockLink">{{ time }}</NuxtLink></p>
              </li>
              <li>
                <h5>{{ $t('general.fee', null, 1) }}</h5>
                <p>{{ fee }}</p>
              </li>
            </ol>
            <ol>
              <li>
                <h5>{{ $t('forms.recipient_address') }}</h5>
                <p>{{ address }}</p>
              </li>
              <li>
                <h5>{{ $t('general.transaction_id') }}</h5>
                <p>
                  <NuxtLink :to="'/transaction/' + transaction.data.tx_hash">{{ hash }}</NuxtLink>
                </p>
              </li>
              <li>
                <h5>{{ $t('general.payment_id') }}</h5>
                <p>{{ paymentId }}</p>
              </li>
            </ol>
            <div class="data">
              <h4>
                <a href="#" @click.prevent="toggle">{{ $t('general.details') }}<span v-html="arrow" /></a>
              </h4>
              <ol v-if="expanded">
                <li>
                  <b>{{ $t('general.block', null, 1) }}:</b> <NuxtLink :to="blockLink">{{ blockHeight }}</NuxtLink>
                </li>
                <li>
                  <b>{{ $t('general.secret_view_key') }}:</b> {{ data.data.viewkey }}
                </li>
                <li>
                  <b><a href="https://getmonero.org/resources/moneropedia/stealthaddress.html" target="_blank">{{ $t('general.stealth_address') }}</a>:</b> {{ matchingOutput.output_pubkey }}
                </li>
              </ol>
            </div>
            <div class="options">
              <p><a href="#" class="button --medium" @click.prevent="clear">{{ $t('deposit.result.check_another_deposit') }}</a></p>
            </div>
          </div>
        </div>
      </Transition>
    </template>
    <template v-if="data && !matchingOutput && transaction">
      <div class="wrap">
        <div class="content">
          <p v-html="$t('forms.errors.no_matching_output')" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'

// Props
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  viewkey: {
    type: String,
    required: true
  }
})

// Composables
const store = useMoneroStore()
const router = useRouter()
const { t } = useI18n()

// Reactive data
const id = ref('deposit-details')
const log = ref(false)
const infoIcon = ref(icons.infoInCircleFilled)
const expanded = ref(false)
const arrow = ref(icons.down)
const timeToggled = ref(false)

// Computed properties
const transaction = computed(() => store.transaction)

const classObject = computed(() => {
  const c = ['deposit-details']

  if (expanded.value) {
    c.push('--expanded')
  }

  return c.join(' ')
})

const paymentId = computed(() => {
  let result = t('general.not_provided')

  if (transaction.value && transaction.value.data) {
    const data = transaction.value.data

    if (data.paymentId && data.paymentId.length > 0) {
      result = data.paymentId
    } else if (data.paymentId8 && data.paymentId8.length > 0) {
      result = data.paymentId8
    }
  }

  return result
})

const matchingOutput = computed(() => {
  let result = null

  const outputs = props.data.data.outputs
  if (outputs) {
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i]
      if (output.match) {
        result = output
        break
      }
    }
  }

  return result
})

const amount = computed(() => {
  let result = '-'

  if (matchingOutput.value) {
    result = Math.round(matchingOutput.value.amount / 1000000000000 * 1000) / 1000 + ' XMR'
  }

  return result
})

const isMiningReward = computed(() => {
  return transaction.value && transaction.value.coinbase === true
})

const time = computed(() => {
  let result = transaction.value.data.timestamp

  if (timeToggled.value) {
    result = formatDateAbsolute(result)
  } else {
    result = formatDate(result)
  }

  return result
})

const blockLink = computed(() => {
  return `/block/${transaction.value.data.block_height}`
})

const blockHeight = computed(() => {
  const result = transaction.value.data.block_height
  return accounting.formatNumber(result, 0)
})

const fee = computed(() => {
  const rounder = 1000
  let result = Math.round(transaction.value.data.tx_fee / 1000000000000 * rounder) / rounder

  if (result == 0) {
    result = '-'
  } else {
    result += ' XMR'
  }

  return result
})

// Methods
const clear = () => {
  router.push('/deposit')
}

const formatDate = (time) => {
  const timestamp = Math.round(parseInt(time) * 1000)
  const date = new Date(timestamp)
  const dt = DateTime.fromJSDate(date)
  return dt.toRelative()
}

const formatDateAbsolute = (time) => {
  const timestamp = Math.round(parseInt(time) * 1000)
  const date = new Date(timestamp)
  const dt = DateTime.fromJSDate(date)
  return dt.toFormat('MMMM d yyyy, h:mm:ss a z')
}

const toggle = () => {
  expanded.value = !expanded.value
}

const toggleTime = () => {
  timeToggled.value = !timeToggled.value
}

// Lifecycle hooks
onBeforeMount(() => {
  if (log.value) {
    console.log(id.value + '.beforeMount', props.data)
  }

  api.transactions([props.data.data.tx_hash])
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.deposit-details {
	> .wrap {
		> .content {
			position: relative;

			> ol {
				@include mixins.clearfix;

				> li {
					// float: left;
					// width: 25%;

					h5 {
						font-size: 14px;
						color: rgba(var(--front), 0.25);
						// opacity: 0.25;

						a {
							display: inline-block;
							margin-left: 5px;

							svg {
								width: 16px;
								height: 16px;
								vertical-align: middle;
								opacity: 0.2;
								transition: all 250ms animations.$ease;
								transform: translateY(-1px);
							}

							&:hover {
								color: var(--blue);

								svg {
									fill: var(--blue);
									stroke: var(--blue);
									opacity: 1;
								}
							}
						}
					}

					p {
						font-size: 18px;
						color: rgba(var(--front), 1);
						opacity: 0.75;
						word-wrap: break-word;

						a {
							color: rgba(var(--front), 1);

							&:hover {
								color: var(--blue);
							}
						}
					}

					&.-confirmations {
						.graph {
							canvas {
								width: 35px;
								height: 35px;
							}
						}
					}
				}
			}

			.options {
				margin-top: 40px;
			}

			.data {
				margin-top: 40px;

				h4 {
					font-size: 12px;
					font-weight: 900;
					text-transform: uppercase;

					cursor: pointer;
					transition: all 150ms animations.$ease;

					a {
						color: rgba(var(--front), 1);

						&:hover {
							color: var(--blue);
						}
					}

					span {
						margin-left: 5px;

						svg {
							width: 14px;
							height: 14px;
							vertical-align: middle;
							transform: translateY(-2px);
							fill: var(--blue);
							stroke: var(--blue);
							transition: all 250ms animations.$ease;
						}
					}

					& + ol {
						margin-top: 10px;
					}
				}

				ol {
					li {
						font-size: 14px;
						line-height: 24px;
						color: rgba(var(--front), 0.5);
						word-wrap: break-word;

						> a {
							color: rgba(var(--front), 0.5);

							&:hover {
								color: var(--blue);
							}
						}

						b {
							color: rgba(var(--front), 1);

							a {
								color: rgba(var(--front), 1);

								&:hover {
									color: var(--blue);
								}
							}
						}
					}
				}
			}
		}
	}

	&.--expanded {
		> .wrap {
			> .content {
				.data {
					> h4 {
						span {
							svg {
								transform: translateY(-2px) rotate(180deg);
							}
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				> ol {
					li {
						& + li {
							margin-top: 20px;
						}

						&:nth-child(2) {
							margin-top: 0;
						}
					}

					&:first-child {
						li {
							float: left;

							&:nth-child(2n) {
								width: 55%;
							}

							&:nth-child(2n+1) {
								width: 45%;
							}

							& + li {
								// margin-top: 0;
							}
						}
					}

					&.--two-columns {
						> li {
							// float: left;
							// width: 50%;
						}
					}

					& + ol {
						margin-top: 20px;
					}
				}

				.data {
					ol {
						li {
							b {
								display: block;
							}

							& + li {
								margin-top: 10px;
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
				> ol {
					li {
						& + li {
							margin-top: 20px;
						}
					}

					&:first-child {
						li {
							& + li {
								margin-top: 0;
							}
						}
					}

					&.--two-columns {
						> li {
							float: left;
							width: 25%;
						}
					}

					& + ol {
						margin-top: 20px;
					}

					// &:nth-child(3) {
					// 	> li {
					// 		& + li {
					// 			margin-top: 20px;
					// 		}
					// 	}
					// }
				}
			}
		}
	}
}

.deposit-details-transition-enter-active,
.deposit-details-transition-leave-active {
	> .content {
		> ol {
			> li {
				transition: all 400ms animations.$easeOutCubic;
			}

			&:nth-child(1) {
				li {
					&:nth-child(1) { transition-delay: 50ms; };
					&:nth-child(2) { transition-delay: 75ms; };
					&:nth-child(3) { transition-delay: 125ms; };
				}
			}

			&:nth-child(2) {
				li {
					&:nth-child(1) { transition-delay: 150ms; };
					&:nth-child(2) { transition-delay: 175ms; };
					&:nth-child(3) { transition-delay: 200ms; };
				}
			}
		}

		.options {
			transition: all 400ms animations.$easeOutCubic;
			transition-delay: 225ms;
		}

		.data {
			transition: all 400ms animations.$easeOutCubic;
			transition-delay: 250ms;
		}
	}
}

.deposit-details-transition-enter-from {
	> .content {
		> ol {
			> li {
				transform: translateY(20px) scale(1.1);
				opacity: 0;
			}
		}

		.options,
		.data {
			transform: translateY(20px) scale(1.1);
			opacity: 0;
		}
	}
}

.deposit-details-transition-enter-to {
	> .content {
		> ol {
			> li {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.options,
		.data {
			transform: translateY(0);
			opacity: 1;
		}
	}
}

</style>
