<template>
  <div :class="classObject">
    <div class="wrap">
      <div class="content">
        <input 
          ref="input"
          type="search" 
          v-model="searchModel"
          :placeholder="$t('general.search_placeholder')"
          autocomplete="off"
          autocorrect="off"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @keyup="onChangeSearchInput"
        />
        <button
          v-if="searchModel.length > 0"
          @click.prevent="clearSearch" 
		  aria-label="Clear search"
          v-html="closeIcon" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMoneroStore } from '~/stores/monero.js'

// Props
const props = defineProps({
  searchInput: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:searchInput'])

// Composables
const router = useRouter()
const store = useMoneroStore()

// Template refs
const input = ref(null)

// Reactive state
const searchModel = ref(props.searchInput || '')
const searchHasFocus = ref(false)

// Static values
const closeIcon = icons.close

// Computed properties
const searchResults = computed(() => store.searchresults)

const classObject = computed(() => {
  const classes = ['search-box']

  if (searchHasFocus.value) {
    classes.push('--active')
  }

  return classes.join(' ')
})

const searchAction = computed(() => {
  return '/search/' + searchModel.value
})

// Watchers
watch(searchResults, (value) => {

  if (value && value.status === 'success') {
    let url

    switch (value.data.title) {
      case 'block':
        url = '/block/' + value.data.block_height
        break
      case 'transaction':
        url = '/transaction/' + value.data.tx_hash
        break
    }

    if (url) {
      router.push(url)
    }
  } else {
    router.push('/search?q=' + encodeURIComponent(searchModel.value))
  }
})

// Methods
const onChangeSearchInput = (event) => {
  if (event.key === 'Enter') {
    api.search(searchModel.value)
  }
}

const onInputFocus = () => {
  searchHasFocus.value = true
}

const onInputBlur = () => {
  searchHasFocus.value = false
}

const clearSearch = () => {
  searchModel.value = ''
  emit('update:searchInput', '')
  
  input.value.focus()
  
  setTimeout(() => {
    // Additional cleanup if needed
  }, 50)
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.search-box {
	> .wrap {
		> .content {
			position: relative;
			border-radius: 100px;
			border: 1px solid rgba(var(--front), 0.2);
			border-color: rgba(var(--front), 0.2);
			transition: all 250ms animations.$ease;
			// box-shadow: 0 15px 30px -10px rgba(var(--front), 0.15);
			// color: rgba(var(--front), 0.15);

			input {
				display: block;
				background-color: transparent;
				border-radius: 100px;
				color: rgba(var(--front), 1);
				transition: all 250ms animations.$ease;
				border-width: 0;
				// box-shadow: 0 15px 30px -10px rgba(var(--front-r), var(--front-g), var(--front-b), 0.15);

				&::placeholder {
					color: rgba(var(--front), 1);
					opacity: 0.25;
					text-align: center;
				}
			}

			&:hover {
				border-color: rgba(var(--blueRGB), 0.5);
			}

			button {
				display: block;
				position: absolute;
				top: 50%;
				right: 7px;
				transform: translateY(-50%);
				border: 1px solid rgba(var(--front), 0.1);
				border-color: rgba(var(--front), 0.1);
				border-radius: 100px;
				width: 30px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				transition: all 150ms animations.$ease;

				:deep(svg) {
					vertical-align: middle;
					width: 10px;
					height: 10px;
					fill: rgba(var(--front), 1);
					stroke: rgba(var(--front), 1);
					transform: translateY(-2px);
					transition: all 150ms animations.$ease;
				}

				&:hover {
					border-color: var(--blue);

					:deep(svg) {
						fill: var(--blue);
						stroke: var(--blue);
					}
				}
			}
		}
	}

	&.--active {
		> .wrap {
			> .content {
				border-color: rgba(var(--blueRGB), 0.5);
				box-shadow: 0 15px 30px -10px;
				color: rgba(var(--front), 0.15);

				input {
					// box-shadow: 0 15px 30px -10px rgba(var(--front-r), var(--front-g), var(--front-b), 0.15);
				}
			}
		}
	}

	@include mixins.media-query(medium-down) {
		> .wrap {
			> .content {
				margin-top: 20px;

				input {
					font-size: 20px;
					line-height: 36px;
					height: 36px;
					padding: 0 15px 0 15px;
					width: 100%;
					box-sizing: border-box;
				}


			}
		}
	}

	@include mixins.media-query(large) {
		> .wrap {
			> .content {
				input {
					width: 400px;
					font-size: 20px;
					height: 37px;
					padding: 0 20px 3px 20px;
				}
			}
		}
	}
}

</style>