<template>
    <Transition
		name="transaction-list-transition" 
		:duration="1000" 
		appear
		:key="transitionKey"
	>
		<div :class="classObject">
			<div class="wrap">
				<div class="content">
					<h4 v-if="title && title.length > 0">{{ title }}</h4>
					<TransitionGroup
						duration="1000" 
						name="transaction-list-item-transition"
						tag="ol" 
					>
						<TransactionListItem
							v-for="item in transactions"
							:key="item.tx_hash || item.id_hash"
							:transaction="item"
						/>
					</TransitionGroup>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  transactions: {
    type: Array,
    default: () => []
  },
  showBackground: {
    type: Boolean,
    default: false
  }
})

const transitionKey = ref(0)

const classObject = computed(() => {
  const classes = ['transaction-list']

  if (props.showBackground) {
    classes.push('--show-background')
  }

  return classes.join(' ')
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

.transaction-list {
	> .wrap {
		> .content {
			h4 {
				font-size: 12px;
				font-weight: 900;
				text-transform: uppercase;
				color: rgba(var(--front), 1);
			}
		}
	}

	&.--show-background {
		background-color: rgba(var(--front), 0.015);
		border-top: 1px solid rgba(var(--front), 0.05);
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;

		> .wrap {
			padding-top: 15px;

			> .content {
				h4 {
					margin-left: 20px;
				}

				> ol {
					.transaction-list-item {
						padding-left: 20px;
						padding-right: 20px;
					}
				}
			}
		}
	}

	&.transaction-list-transition-enter-active,
	&.transaction-list-transition-leave-active {
		> .wrap {
			> .content {
				ol {
					li {
						transition: all 300ms animations.$easeOutCubic;
						transform-origin: center center;

						&:nth-child(1) { transition-delay: 50ms; }
						&:nth-child(2) { transition-delay: 85ms; }
						&:nth-child(3) { transition-delay: 120ms; }
						&:nth-child(4) { transition-delay: 155ms; }
						&:nth-child(5) { transition-delay: 190ms; }
						&:nth-child(6) { transition-delay: 225ms; }
						&:nth-child(7) { transition-delay: 260ms; }
						&:nth-child(8) { transition-delay: 295ms; }
						&:nth-child(9) { transition-delay: 330ms; }
						&:nth-child(10) { transition-delay: 365ms; }
						&:nth-child(11) { transition-delay: 400ms; }
						&:nth-child(12) { transition-delay: 435ms; }
						&:nth-child(13) { transition-delay: 470ms; }
						&:nth-child(14) { transition-delay: 405ms; }
						&:nth-child(15) { transition-delay: 440ms; }
						&:nth-child(16) { transition-delay: 475ms; }
						&:nth-child(17) { transition-delay: 510ms; }
						&:nth-child(18) { transition-delay: 545ms; }
						&:nth-child(19) { transition-delay: 580ms; }
						&:nth-child(20) { transition-delay: 615ms; }
					}
				}
			}
		}
	}

	&.transaction-list-transition-enter-from {
		> .wrap {
			> .content {
				ol {
					li {
						opacity: 0;
						transform: translateY(70px) scale(1.15);
					}
				}
			}
		}
	}

	&.--show-background {
		&.transaction-list-transition-enter-from {
			> .wrap {
				> .content {
					ol {
						li {
							transform: translateX(30px);
						}
					}
				}
			}
		}
	}

	&.transaction-list-transition-enter-to {
		> .wrap {
			> .content {
				ol {
					li {
						opacity: 1;
						transform: translateX(0px);
					}
				}
			}
		}
	}
}

</style>