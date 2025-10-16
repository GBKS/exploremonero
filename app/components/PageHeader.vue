<template>
  <div class="page-header">
    <Transition
		name="page-header-transition" 
		:duration="1000" 
		appear 
		:key="transitionKey"
	>
      <div class="wrap">
        <div class="content">
          <h1 v-html="title" />
          <p v-html="description" />
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  }
})

const transitionKey = ref(0)

// Lifecycle hooks
onMounted(() => {
  transitionKey.value += 1
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.page-header {
	padding-top: 20px;
	padding-bottom: 20px;

	> .wrap {
		> .content {
			position: relative;

			h1 {
				max-width: 500px;
				color: rgba(var(--front), 0.9);
				font-size: 36px;
				line-height: 1.2;
				font-weight: 300;
			}

			> p {
				max-width: 500px;
				color: rgba(var(--front), 0.5);
				font-size: 14px;
				line-height: 1.4;
				font-weight: 500;

				:deep(a) {
					color: var(--frontHex);

					&:hover {
						color: var(--blue);
					}
				}
			}
		}
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				h1 {
					font-size: 27px;
				}
			}
		}
	}

	.page-header-transition-enter-active,
	.page-header-transition-leave-active {
		> .content {
			h1 {
				transition: all 400ms animations.$easeOutCubic;
				transition-delay: 50ms;
			}

			> p {
				transition: all 400ms animations.$easeOutCubic;
				transition-delay: 100ms;
			}
		}
	}

	.page-header-transition-enter-from {
		> .content {
			h1 {
				transform: translateY(20px) scale(1.1);
				opacity: 0;
			}

			p {
				transform: translateY(30px) scale(1.1);
				opacity: 0;
			}
		}
	}

	.page-header-transition-enter-to {
		> .content {
			h1 {
				transform: translateY(0);
				opacity: 1;
			}

			p {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}

	.page-header-transition-leave-from {
		> .content {
			h1 {
				transform: translateY(0);
				opacity: 1;
			}

			p {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}

	.page-header-transition-leave-to {
		> .content {
			h1 {
				transform: translateY(10px);
				opacity: 0;
			}

			p {
				transform: translateY(10px);
				opacity: 0;
			}
		}
	}
}

</style>