<template>
  <div :class="classObject">
    <Transition name="transaction-details-transition" :duration="1000" appear>
      <div class="wrap">
        <div class="content">
          <ol>
            <li class="--short -confirmations">
              <ConfirmationProgress
                :confirmations="transaction.confirmations"
                :is-mining-reward="isMiningReward"
              />
            </li>
            <li>
              <template v-if="isMiningReward">
                <h5>{{ $t('general.mining_reward') }}</h5>
                <p>{{ outputs }}</p>
              </template>
              <template v-else>
                <h5>{{ $t('general.fee', null, 1) }}</h5>
                <p>{{ fee }}</p>
              </template>
            </li>
            <li>
              <h5>{{ $t('general.block', null, 1) }}</h5>
              <p v-if="transaction.block_height > 0">
                <NuxtLink :to="blockLink">{{ blockHeight }}</NuxtLink>
              </p>
              <p v-else>{{ $t('transaction.no_block_assigned') }}</p>
            </li>
            <li>
              <h5>{{ $t('general.time') }}</h5>
              <p>{{ blockTime }}</p>
            </li>
          </ol>
          <ol>
            <li>
              <h5>{{ $t('general.transaction_id') }}</h5>
              <p>{{ hash }}</p>
            </li>
            <li v-if="!isMiningReward && transaction.payment_id && transaction.payment_id.length > 0">
              <h5>{{ $t('general.payment_id') }}</h5>
              <p>{{ transaction.payment_id }}</p>
            </li>
            <li v-if="!isMiningReward && transaction.payment_id8 && transaction.payment_id8.length > 0">
              <h5>{{ $t('general.payment_id_8') }}</h5>
              <p>{{ transaction.payment_id8 }}</p>
            </li>
          </ol>

          <div class="options">
            <NuxtLink
              class="button --big --filled"
              :to="receiptLink"
            >{{ $t('transaction.get_send_receipt') }}</NuxtLink>
            <NuxtLink
              class="button --big --filled"
              :to="depositLink"
            >{{ $t('transaction.verify_deposit') }}</NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

// Composables
const { t } = useI18n()

// Reactive data
const id = ref('transaction-details')
const log = ref(false)

// Computed properties
const classObject = computed(() => {
  return ['transaction-details']
})

const isMiningReward = computed(() => {
  return props.transaction.xmr_outputs > 0
})

const receiptLink = computed(() => {
  return `/receipt/${props.transaction.tx_hash}`
})

const depositLink = computed(() => {
  return `/deposit/${props.transaction.tx_hash}`
})

const blockLink = computed(() => {
  return `/block/${props.transaction.block_height}`
})

const hash = computed(() => {
  return props.transaction.tx_hash
})

const blockHeight = computed(() => {
  if (props.transaction.block_height > 0) {
    return accounting.formatNumber(props.transaction.block_height, 0)
  } else {
    return t('transaction.no_block_assigned')
  }
})

const outputs = computed(() => {
  let result = accounting.formatNumber(props.transaction.xmr_outputs / 1000000000000, 2)
  
  if (result == 0) {
    result = '-'
  } else {
    result += ' XMR'
  }
  
  return result
})

const size = computed(() => {
  return accounting.formatNumber(props.transaction.tx_size / 1000, 2)
})

const blockTime = computed(() => {
  const timestamp = props.transaction.block_timestamp * 1000
  return new Date(timestamp).toLocaleString()
})

const fee = computed(() => {
  if (log.value) {
    console.log(id.value + '.fee', props.transaction.tx_fee / 1000000000000)
  }

  const fee = props.transaction.as_json.rct_signatures.txnFee

  const rounder = 1000000
  let result = Math.round(fee / 1000000000000 * rounder) / rounder

  if (result == 0) {
    result = '-'
  } else {
    result += ' XMR'
  }

  return result
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.transaction-details {
	> .wrap {
		> .content {
			position: relative;

			.options {
				margin-top: 40px;

				a {
					& + a {
						margin-left: 20px;
					}
				}
			}

			> ol {
				> li {
					margin-top: 15px;
					width: 100%;

					:deep(h5) {
						font-size: 14px;
						color: rgba(var(--front), 1);
						opacity: 0.5;
					}

					:deep(p) {
						font-size: 18px;
						color: rgba(var(--front), 1);
						opacity: 0.75;
						word-wrap: break-word;

						a {
							transition: all 150ms animations.$ease;
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

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				position: relative;

				> ol {
					&:first-of-type {
						@include mixins.clearfix;

						> li {
							float: left;
							width: 50%;
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		> .wrap {
			> .content {
				position: relative;

				> ol {
					&:first-of-type {
						@include mixins.clearfix;

						> li {
							float: left;
							width: 25%;
						}
					}
				}
			}
		}
	}
}

.transaction-details-transition-enter-active,
.transaction-details-transition-leave-active {
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
					&:nth-child(4) { transition-delay: 150ms; };
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
			a {
				transition: all 400ms animations.$easeOutCubic;
				transition-delay: 225ms;
			}
		}
	}
}

.transaction-details-transition-enter-from {
	> .content {
		> ol {
			> li {
				transform: translateY(20px) scale(1.1);
				opacity: 0;
			}
		}

		.options {
			a {
				transform: translateY(20px) scale(1.05);
				opacity: 0;
			}
		}
	}
}

.transaction-details-transition-enter-to {
	> .content {
		> ol {
			> li {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.options {
			a {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
}

</style>