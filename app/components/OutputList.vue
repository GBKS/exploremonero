<template>
  <div :class="classObject">
    <Transition name="output-list-transition" :duration="1000" appear>
      <div class="wrap">
        <div class="content">
          <button
            @click="toggle"
			aria-label="Toggle inputs"
			:aria-expanded="expanded"
		>{{ title }}<span v-html="arrow" /></button>
          <ol v-if="expanded">
            <OutputListItem
              v-for="(item, index) in outputs"
              :key="index"
              :output="item"
              :is-mining-reward="isMiningReward"
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
  outputs: {
    type: Array,
    default: () => []
  },
  isMiningReward: {
    type: Boolean,
    default: false
  }
})

// Composables
const { t } = useI18n()

// Reactive data
const expanded = ref(false)
const arrow = ref(icons.down)

// Computed properties
const classObject = computed(() => {
  const c = ['output-list']

  if (expanded.value) {
    c.push('--expanded')
  }

  return c.join(' ')
})

const title = computed(() => {
  let result = t('transaction.no_outputs')

  if (props.outputs && props.outputs.length > 0) {
    result = t('transaction.outputs', { count: props.outputs.length }, props.outputs.length)
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

.output-list {
	> .wrap {
		padding-top: 20px;

		> .content {
			> button {
				font-size: 12px;
				font-weight: 900;
				text-transform: uppercase;
				color: rgba(var(--front), 1);
				cursor: pointer;
				transition: all 150ms animations.$ease;

				&:hover {
					color: var(--blue);
				}

				span {
					margin-left: 5px;

					:deep(svg) {
						width: 14px;
						height: 14px;
						vertical-align: middle;
						transform: translateY(-2px);
						fill: var(--blue);
						stroke: var(--blue);
						transition: all 250ms animations.$ease;
					}
				}
			}
		}
	}

	&.--expanded {
		> .wrap {
			> .content {
				> button {
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

</style>
