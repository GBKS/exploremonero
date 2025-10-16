<template>
  <div :class="classObject" :title="title" @click="toggleConfirmations">
    <h5>{{ confirmationsText }}</h5>
    <p>{{ confirmationsTitle }}</p>
    <div 
      v-if="isComplete"
      class="check"  
      v-html="checkIcon"
    />
    <div 
      v-else
      class="graph" 
    >
      <canvas ref="graph" width="100" height="100" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  confirmations: {
    type: Number,
    default: 0
  },
  isMiningReward: {
    type: Boolean,
    default: false
  }
})

// Composables
const { t } = useI18n()

// Template refs
const graph = ref(null)

// Reactive data
const checkIcon = icons.checkInCircleFilled
const confirmationsToggled = ref(false)

// Computed properties
const confirmationsNeeded = computed(() => {
  return props.isMiningReward ? 60 : 10
})

const isComplete = computed(() => {
  return props.confirmations >= confirmationsNeeded.value
})

const classObject = computed(() => {
  const c = ['confirmation-progress']

  if (props.confirmations >= confirmationsNeeded.value) {
    c.push('--complete')
  } else {
    c.push('--loading')
  }

  return c.join(' ')
})

const title = computed(() => {
  return t('transaction.confirmations_needed', { count: confirmationsNeeded.value })
})

const timeLeft = computed(() => {
  let result = ''
  const confirmationsLeft = confirmationsNeeded.value - props.confirmations
  
  if (confirmationsLeft > 0) {
    const minutes = confirmationsLeft * 2
    result = '~' + minutes + ' min left'
  }

  return result
})

const confirmationsTitle = computed(() => {
  let result = t('general.confirmation', null, 2)
  const count = props.confirmations

  if (count >= confirmationsNeeded.value) {
    result = t('transaction.status.done')
  } else if (count == 0) {
    result = t('transaction.status.queued')
  } else {
    result = t('transaction.status.sending')
  }

  return result
})

const confirmationsText = computed(() => {
  let result = ''

  if (confirmationsToggled.value && !isComplete.value) {
    result = timeLeft.value
  } else {
    const count = props.confirmations || 0
    result = accounting.formatNumber(count, 0)

    // Mobile formatting for large numbers
    if (window.innerWidth < 768 && count > 1000) {
      result = Math.round(count / 1000) + 'K'
    }

    result += ' ' + t('general.confirmation', null, count)
  }

  return result
})

// Methods
const updateConfirmationGraph = () => {
  const canvas = graph.value

  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')
  context.clearRect(0, 0, 100, 100)

  const progress = Math.min(1, props.confirmations / confirmationsNeeded.value)
  const startAngle = -90 / 180 * Math.PI
  const angle = progress * 360 - 90
  const lineWidth = 16
  const radius = 50 - lineWidth / 2

  context.lineCap = 'round'
  context.lineWidth = lineWidth

  // Draw background
  context.strokeStyle = '#000000'
  context.globalAlpha = 0.1
  context.beginPath()
  context.arc(50, 50, radius, 0, 2 * Math.PI)
  context.stroke()

  // Draw progress
  if (isComplete.value) {
    context.strokeStyle = '#03B96C'
  } else {
    context.strokeStyle = '#3380FF'
  }
  context.globalAlpha = 1

  context.beginPath()
  context.arc(50, 50, radius, startAngle, angle / 180 * Math.PI)
  context.stroke()

  faviconUpdater.progress(progress)
}

const toggleConfirmations = () => {
  confirmationsToggled.value = !confirmationsToggled.value
}

// Watchers
watch(() => props.confirmations, () => {
  if (isComplete.value) {
    faviconUpdater.progress(1)
  } else {
    updateConfirmationGraph()
  }
})

// Lifecycle
onMounted(() => {
  if (isComplete.value) {
    faviconUpdater.progress(1)
  } else {
    updateConfirmationGraph()
  }
})
</script>

<style lang="scss" scoped>

.confirmation-progress {
	position: relative;
	padding-left: 45px;

	.check {
		position: absolute;
		left: 0;
		top: 6px;

		:deep(svg) {
			width: 35px;
			height: 35px;
			vertical-align: middle;
			fill: var(--green);
			stroke: var(--green);
		}
	}

	.graph {
		position: absolute;
		left: 0;
		top: 6px;

		canvas {
			width: 35px;
			height: 35px;
		}
	}

	&.--complete {
		
	}

	&.--loading {
		cursor: pointer;
	}
}

</style>