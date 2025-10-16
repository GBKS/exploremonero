<template>
  <li :class="classObject">
    <NuxtLink class="wrap" :to="'/transaction/' + hash">
      <div class="content">
        <ol>
          <li>
            <h5>
              {{ $t('general.transaction_id') }}
              <span v-if="false" @click="copyHash">Copy</span>
            </h5>
            <p @click="toggleHash">{{ hash }}</p>
          </li>
          <li v-if="!hashExpanded">
            <template v-if="isMiningReward">
              <h5>{{ $t('general.mining_reward') }}</h5>
              <p>{{ outputs }}</p>
            </template>
            <template v-else>
              <h5>{{ $t('general.fee', null, 1) }}</h5>
              <p>{{ fee }}</p>
            </template>
          </li>
          <li v-if="false">
            <h5>{{ $t('general.size_in_kb') }}</h5>
            <p>{{ size }}</p>
          </li>
          <li v-if="hasPaymentId">
            <h5>{{ $t('general.payment_id') }}</h5>
            <p>{{ paymentId }}</p>
          </li>
        </ol>
        <div v-if="false" class="link">
          <NuxtLink :to="'/transaction/' + hash" v-html="icons.arrowRight" />
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const hashExpanded = ref(false)

const classObject = computed(() => {
  const classes = ['transaction-list-item']

  if (hashExpanded.value) {
    classes.push('--hash-expanded')
  }

  if (hasPaymentId.value) {
    classes.push('--has-payment-id')
  }

  return classes.join(' ')
})

const hasPaymentId = computed(() => {
  return (props.transaction.payment_id && props.transaction.payment_id.length > 0) || 
         (props.transaction.payment_id8 && props.transaction.payment_id8.length > 0)
})

const isMiningReward = computed(() => {
  return props.transaction.xmr_outputs > 0
})

const hash = computed(() => {
  let result
  if(props.transaction.tx_hash) {
	result = props.transaction.tx_hash
  } else {
	result = props.transaction.id_hash
  }
  return result
})

const paymentId = computed(() => {
  let result = props.transaction.payment_id

  if (!result || result.length === 0) {
    result = props.transaction.payment_id8
  }

  if (result && result.length > 8) {
    result = result.substr(0, 4) + '...' + result.substr(result.length - 4, 4)
  }

  return result
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

const fee = computed(() => {
  let fee
  if(props.transaction.as_json) {
	fee = props.transaction.as_json.rct_signatures.txnFee
  } else {
	fee = props.transaction.fee
  }

  const rounder = 1000000
  let result = Math.round(fee / 1000000000000 * rounder) / rounder

  if (result == 0) {
    result = '-'
  } else {
    result += ' XMR'
  }

  return result
})

const toggleHash = () => {
  // hashExpanded.value = !hashExpanded.value;
}

const copyHash = () => {
  // Modern clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(props.transaction.tx_hash)
  } else {
    // Fallback for older browsers
    const element = document.createElement('textarea')
    element.value = props.transaction.tx_hash
    document.body.appendChild(element)
    element.select()
    document.execCommand('copy')
    document.body.removeChild(element)
  }
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.transaction-list-item {
	padding: 10px 0;

	> .wrap {
		> .content {
			position: relative;

			> ol {
				@include mixins.clearfix;

				> li {
					// float: left;

					// &:first-child { width: 72%; }
					// &:nth-child(2) { width: 14%; }
					// &:nth-child(3) { width: 14%; }

					h5 {
						font-size: 14px;
						color: rgba(var(--front), 0.25);

						span {
							color: rgba(var(--front), 0.25);
							opacity: 0;

							&:hover {
								color: rgba(var(--front), 1);
							}
						}
					}

					p {
						font-size: 18px;
						color: rgba(var(--front), 1);
						opacity: 0.75;
						word-wrap: break-word;
					}

					&:hover {
						h5 {
							span {
								opacity: 1;
							}
						}
					}
				}
			}

			.link {
				position: absolute;
				right: 5px;
				top: 5px;

				a {
					display: block;
					width: 30px;
					height: 30px;
					line-height: 30px;
					text-align: center;
					opacity: 0;
					transition: all 250ms animations.$ease;

					svg {
						vertical-align: middle;
						width: 18px;
						height: 18px;
						fill: rgba(var(--front), 1);
						stroke: rgba(var(--front), 1);
					}
				}
			}
		}
	}

	&.--hash-expanded {
		> .wrap {
			> .content {
				> ol {
					> li {
						width: 100%;
					}
				}
			}
		}
	}

	&:hover {
		> .wrap {
			> .content {
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

	& + .transaction-list-item {
		border-top: 1px solid rgba(var(--front), 0.05);
		// margin-top: 10px;
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				> ol {
					> li {
						
						& + li {
							margin-top: 10px;
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
					> li {
						float: left;

						&:first-child { width: 71%; }
						&:nth-child(2) { width: 15%; }
						&:nth-child(3) { width: 14%; }
					}
				}
			}
		}
	}
}

.transaction-list-item-transition-enter-active,
.transaction-list-item-transition-leave-active {
	transition: all 400ms animations.$easeOutCubic;
	transform-origin: center center;
}

.transaction-list-item-transition-enter-from {
	opacity: 0;
	transform: translate3d(30px, 0, 0);
}

.transaction-list-item-transition-enter-to {
	opacity: 1;
	transform: translate3d(0px, 0, 0);
}

.transaction-list-item-transition-leave-from {
	opacity: 1;
	transform: translate3d(0px, 0, 0);
}

.transaction-list-item-transition-leave-to {
	opacity: 0;
	transform: translate3d(-30px, 0, 0);
}

// Move

.transaction-list-item-transition-move {
	transition: all 400ms animations.$ease;
}

</style>