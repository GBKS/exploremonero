<template>
  <div :class="classObject">
    <Transition name="mixin-list-transition" :duration="1000" appear>
      <div class="wrap">
        <div class="content">
          <div class="header">
            <h4>
              <button
				aria-label="Toggle ring members"
				:aria-expanded="expanded"
			  	@click.prevent="toggle"
			>{{ title }}<span v-html="arrow" /></button>
            </h4>
            <a href="https://getmonero.org/resources/moneropedia/ringsignatures.html" target="_blank" v-html="infoIcon" />
          </div>
          <ol v-if="expanded">
            <MixinListItem
              v-for="(item, index) in mixins"
              :key="index"
              :mixin="item"
            />
          </ol>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  mixins: {
    type: Array,
    default: () => []
  },
  showBackground: {
    type: Boolean,
    default: false
  }
})

// Composables
const { t } = useI18n()

// Reactive state
const expanded = ref(false)

// Static values (these don't need to be reactive)
const infoIcon = icons.infoInCircleFilled
const arrow = icons.down

// Computed properties
const classObject = computed(() => {
  const c = ['mixin-list']

  if (props.showBackground) {
    c.push('--show-background')
  }

  if (expanded.value) {
    c.push('--expanded')
  }

  return c.join(' ')
})

const title = computed(() => {
  let result = t('transaction.no_ring_members')

  if (props.mixins && props.mixins.length > 0) {
    result = t('transaction.ring_member', { count: props.mixins.length }, props.mixins.length)
  }

  return result
})

// Methods
const toggle = () => {
  expanded.value = !expanded.value
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.mixin-list {
	> .wrap {
		> .content {
			.header {
				h4 {
					display: inline-block;
					color: rgba(var(--front), 1);

					button {
						font-size: 12px;
						font-weight: 900;
						text-transform: uppercase;
						color: rgba(var(--front), 1);
						transition: all 250ms animations.$ease;

						&:hover {
							color: var(--yellow);
						}

						span {
							margin-left: 5px;

							:deep(svg) {
								width: 14px;
								height: 14px;
								vertical-align: middle;
								transform: translateY(-2px);
								fill: var(--yellow);
								stroke: var(--yellow);
								transition: all 250ms animations.$ease;
							}
						}
					}
				}

				> a {
					display: inline-block;
					margin-left: 5px;
          			color: rgba(var(--front), 0.5);

					:deep(svg) {
						width: 16px;
						height: 16px;
						vertical-align: middle;
						opacity: 0.2;
						transition: all 250ms animations.$ease;
						transform: translateY(-1px);
            			opacity: 1;
					}

					&:hover {
						:deep(svg) {
							color: var(--blue);
							opacity: 1;
						}
					}
				}
			}
		}
	}

	&.--show-background {
		background-color: rgba(var(--front), 0.015);
		border: 1px solid rgba(var(--front), 0.05);
		border-radius: 5px;

		> .wrap {
			padding-top: 20px;
			padding-bottom: 20px;

			> .content {
				h4 {
					margin-left: 20px;
				}

				> ol {
					:deep(.mixin-list-item) {
						padding-left: 20px;
						padding-right: 20px;
					}
				}
			}
		}

		&.--expanded {
			> .wrap {
				padding-bottom: 0;

				> .content {
					h4 {
						a {
							span {
								:deep(svg) {
									transform: translateY(-2px) rotate(180deg);
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
