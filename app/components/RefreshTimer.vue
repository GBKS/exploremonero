
<template>
    <button
		:class="classObject" 
		aria-label="Toggle auto refresh"
		:aria-selected="active"
		@click="onClick"
	>
        <Transition name="refresh-timer-transition" :duration="1000" appear>
            <div class="wrap">
                <div class="content">
                    <p>{{ title }}</p>
                    <div class="timer-bar-wrap">
                        <div class="timer-bar" :style="timerBarStyle" />
                    </div>
                </div>
            </div>
        </Transition>
    </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Define props
const props = defineProps({
    duration: {
        type: Number,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})

// Define emits
const emit = defineEmits(['update'])

// Use i18n
const { t } = useI18n()

// Reactive data
const refreshTimer = ref(null)
const time = ref(props.duration)
const active = ref(false)

// Computed properties
const classObject = computed(() => {
    const c = ['refresh-timer']
    return c.join(' ')
})

const timerBarStyle = computed(() => {
    return {
        width: Math.round((1 - time.value / 60) * 100) + '%'
    }
})

const title = computed(() => {
    let result = t('general.auto_refresh')

    if (props.loading) {
        result = t('general.loading')
    } else if (!active.value) {
        result = t('general.paused')
    }

    return result
})

const hoverTitle = computed(() => {
    let result = t('general.click_to_start')

    if (active.value) {
        result = time.value + " "
        result += t('general.second', null, time.value)
    }

    return result
})

// Methods
const startTimer = () => {
    active.value = true
    clearTimeout(refreshTimer.value)
    refreshTimer.value = setTimeout(updateTimer, 1000)
}

const stopTimer = () => {
    active.value = false
    time.value = props.duration
    clearTimeout(refreshTimer.value)
}

const updateTimer = () => {
    time.value--

    if (time.value <= 0) {
        refresh()
    } else {
        startTimer()
    }
}

const reset = () => {
    time.value = props.duration
}

const refresh = () => {
    time.value = props.duration
    stopTimer()
    emit('update')
}

const onClick = () => {
    if (active.value) {
        refresh()
    } else {
        start()
    }
}

const start = () => {
    if (!active.value) {
        startTimer()
    }
}

const stop = () => {
    if (active.value) {
        stopTimer()
    }
}

defineExpose({
    start,
    stop,
    reset
});

// Lifecycle hooks
onMounted(() => {
    startTimer()
})

onBeforeUnmount(() => {
    clearTimeout(refreshTimer.value)
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.refresh-timer {
	> .wrap {
		> .content {
			cursor: pointer;
			
			p {
				display: inline-block;
				margin-right: 10px;
				transition: all 150ms animations.$ease;
				color: rgba(var(--front), 0.5);
			}

			.timer-bar-wrap {
				display: inline-block;
				vertical-align: middle;
				width: 100px;
				height: 4px;
				background-color: rgba(var(--front), 0.1);
				border-radius: 100px;

				.timer-bar {
					height: 100%;
					background-color: var(--blue);
					border-radius: 100px;
					transition: all 1000ms animations.$ease;
				}
			}

			&:hover {
				p {
					color: var(--purple);
				}

				.timer-bar-wrap {
					.timer-bar {
						background-color: var(--purple);
					}
				}
			}
		}
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				p {
					font-size: 14px;
				}

				.timer-bar-wrap {
					.timer-bar {

					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);

		> .wrap {
			> .content {
				p {

				}

				.timer-bar-wrap {
					.timer-bar {

					}
				}
			}
		}
	}
}

.refresh-timer-transition-enter-active,
.refresh-timer-transition-leave-active {
	> .content {
		p {
			transition: all 400ms animations.$easeOutCubic !important;
			transition-delay: 50ms;
		}

		.timer-bar-wrap {
			transition: all 400ms animations.$easeOutCubic;
			transition-delay: 100ms;
		}
	}
}

.refresh-timer-transition-enter {
	> .content {
		p {
			transform: translateY(30px) scale(1.1);
			opacity: 0;
		}

		.timer-bar-wrap {
			transform: translateY(20px) scale(1.1);
			opacity: 0;
		}
	}
}

.refresh-timer-transition-enter-to {
	> .content {
		p {
			transform: translateY(0);
			opacity: 1;
		}

		.timer-bar-wrap {
			transform: translateY(0);
			opacity: 1;
		}
	}
}

.refresh-timer-transition-leave {

}

.refresh-timer-transition-leave-to {

}

</style>