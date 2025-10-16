<template>
	<Transition
		name="receipt-form-transition" 
		:duration="1000" 
		mode="out-in"
		appear
		:key="transitionKey"
	>
		<div class="receipt-form">
			<div class="wrap">
				<div class="content">
				<label for="input--hash">{{ $t('general.transaction_id') }}</label>
				<MultilineInput
					:text="hashModel" 
					id="input--hash" 
					:placeholder="$t('forms.enter_transaction_id')"
					:disabled="true"
					@update="updateHash"
				/>
				<p class="-error" v-if="hashError" v-html="hashError" />

				<label for="input--address">{{ $t('forms.recipient_address') }}</label>
				<MultilineInput
					:text="addressModel" 
					id="input--address" 
					:placeholder="$t('forms.enter_recipient_address')"
					:disabled="true"
					@update="updateAddress"
				/>
				<p class="-error" v-if="addressError" v-html="addressError" />

				<label for="input--key">{{ $t('forms.secret_transaction_key') }} <a href="https://getmonero.org/resources/user-guides/prove-payment.html" target="_blank" v-html="infoIcon" /></label>
				<MultilineInput
					:text="viewKeyModel" 
					id="input--key" 
					:placeholder="$t('forms.enter_transaction_secret_key')"
					:disabled="true"
					@update="updateViewkey"
				/>
				<p class="-error" v-if="viewKeyError" v-html="viewKeyError" />

				<div class="options">
					<button
						@click="getReceipt"
						class="button --big --filled"
						disabled
					>{{ $t('forms.get_receipt') }}</button>
					<div :class="loaderClass" v-html="loadIcon" />
				</div>

				<p class="-api-error" v-if="outputs && outputs.status == 'error'">{{ $t('forms.errors.title') }}<br/><span>{{ outputs.message }}</span></p>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  hash: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  viewkey: {
    type: String,
    default: ''
  },
  outputs: {
    type: Object,
    default: null
  }
})

// Composables
const router = useRouter()
const { t } = useI18n()

// Reactive data
const id = 'receipt-form'
const hashModel = ref(props.hash || '')
const addressModel = ref(props.address || '')
const viewKeyModel = ref(props.viewkey || '')
const infoIcon = icons.infoInCircleFilled
const hashError = ref(null)
const addressError = ref(null)
const viewKeyError = ref(null)
const isLoading = ref(false)
const loadIcon = icons.gear // Using gear as placeholder for loader
const transitionKey = ref(0)

// Computed
const loaderClass = computed(() => {
  const c = ['loader']

  if (isLoading.value) {
    c.push('-active')
  }

  return c.join(' ')
})

// Methods
const getReceipt = () => {
  const hash = hashModel.value
  const address = addressModel.value
  const viewkey = viewKeyModel.value

  validateHash()
  validateAddress()
  validateViewKey()

  if (!hashError.value && !addressError.value && !viewKeyError.value) {
    // Push to the route
    const url = `/receipt/${hash}/${address}/${viewkey}`
    router.push(url)
  }
}

const validateHash = () => {
  let result = null

  if (hashModel.value.length == 0) {
    result = t('forms.errors.transaction_id')
  }

  hashError.value = result
}

const validateAddress = () => {
  let result = null

  if (addressModel.value.length == 0) {
    result = t('forms.errors.monero_address')
  }

  addressError.value = result
}

const validateViewKey = () => {
  let result = null

  if (viewKeyModel.value.length == 0) {
    result = t('forms.errors.view_key')
  }

  viewKeyError.value = result
}

const onLoadStart = () => {
  isLoading.value = true
}

const onLoadEnd = () => {
  isLoading.value = false
}

const updateHash = (text) => {
  hashModel.value = text
}

const updateAddress = (text) => {
  addressModel.value = text
}

const updateViewkey = (text) => {
  viewKeyModel.value = text
}

// Lifecycle hooks
onMounted(() => {
  events.listen('api-outputs-start', onLoadStart, id)
  events.listen('api-outputs-end', onLoadEnd, id)

  transitionKey.value += 1
})

onUnmounted(() => {
  events.clearListener(id)
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.receipt-form {
	> .wrap {
		> .content {
			label {
				display: block;
				font-weight: 700;
				font-size: 14px;

				a {
					display: inline-block;
					margin-left: 5px;

					:deep(svg) {
						width: 16px;
						height: 16px;
						vertical-align: middle;
						opacity: 0.2;
						transition: all 250ms animations.$ease;
						transform: translateY(-1px);
						fill: var(--frontHex);
						stroke: var(--frontHex);
					}

					&:hover {
						:deep(svg) {
							fill: var(--blue);
							stroke: var(--blue);
							opacity: 1;
						}
					}
				}
			}

			input,
			.multiline-input {
				display: block;
				box-sizing: border-box;
				width: 100%;
				margin-top: 5px;
				padding: 0 10px;
				font-size: 18px;
				border-radius: 3px;
				background-color: rgba(var(--back), 1);
				border: 1px solid rgba(var(--front), 0.2);
				border-color: rgba(var(--front), 0.2);
				transition: all 150ms animations.$ease;
				color: var(--frontHex);
				background-color: transparent;

				&:not(.--disabled) {
					&:hover {
						border-color: rgba(var(--blueRGB), 0.5);
					}

					&:focus,
					&.--active {
						border-color: rgba(var(--blueRGB), 0.75);
					}
				}

				&.--disabled {
					cursor: default;
				}

				& + label {
					margin-top: 20px;
				}
			}

			input {
				height: 40px;
				line-height: 40px;

				&::placeholder {
					color: rgba(var(--front), 0.2);
				}
			}

			.multiline-input {
				padding-top: 6px;
				padding-bottom: 6px;
				line-height: 27px;
				font-family: variables.$fonts !important;
				font-size: 18px !important;
			}

			p.-error {
				margin-top: 5px;
				color: var(--purple);

				& + label {
					margin-top: 20px;
				}
			}

			p.-api-error {
				margin-top: 25px;
				font-size: 16px;

				span {
					font-style: italic;
					color: rgba(var(--front), 0.75);
				}
			}

			.options {
				margin-top: 20px;

				button {

				}

				.loader {
					display: inline-block;
					opacity: 0;
					margin-left: 10px;
					width: 32px;
					height: 32px;
					line-height: 32px;
					text-align: center;
					transform-origin: center center;

					svg {
						width: 20px;
						height: 20px;
						vertical-align: middle;
						fill: var(--purple);
						stroke: var(--purple);
						transform: translateY(-1px);
					}

					&.-active {
						opacity: 1;
						animation: loaderSpin 1000ms infinite linear;
					}
				}
			}
		}
	}

	&.receipt-form-transition-enter-active,
	&.receipt-form-transition-leave-active {
		> .wrap {
			> .content {
				label {
					transition: all 400ms animations.$easeOutCubic !important;

					&:nth-child(1) { transition-delay: 50ms !important; };
					&:nth-child(3) { transition-delay: 100ms !important; };
					&:nth-child(5) { transition-delay: 150ms !important; };
				}

				input,
				.multiline-input {
					transition: all 400ms animations.$easeOutCubic !important;

					&:nth-child(2) { transition-delay: 75ms !important; }
					&:nth-child(4) { transition-delay: 125ms !important; }
					&:nth-child(6) { transition-delay: 175ms !important; }
				}

				.options {
					transition: all 400ms animations.$easeOutCubic !important;
					transition-delay: 200ms !important;
				}
			}
		}
	}

	&.receipt-form-transition-enter-from {
		> .wrap {
			> .content {
				label {
					transform: translateY(20px) scale(1.1);
					opacity: 0;
				}

				input,
				.multiline-input {
					transform: translateY(30px) scale(1.1);
					opacity: 0;
				}

				.options {
					transform: translateY(30px) scale(1.1);
					opacity: 0;
				}
			}
		}
	}

	&.receipt-form-transition-enter-to {
		> .wrap {
			> .content {
				label {
					transform: translateY(0);
					opacity: 1;
				}

				input,
				.multiline-input {
					transform: translateY(0);
					opacity: 1;
				}

				.options {
					transform: translateY(0);
					opacity: 1;
				}
			}
		}
	}

	@keyframes loaderSpin {
		0% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(179deg);
		}

		100% {
			transform: rotate(359deg);
		}
	}
}

</style>