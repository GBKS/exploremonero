
<template>
  <li :class="classObject" :style="styleObject" @click="activate">
    <div class="bar-wrap">
      <div class="bar" :style="barStyle" />
    </div>
    <p>{{ formattedCount }}<br/>{{ formattedDate }}</p>
  </li>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  maxCount: {
    type: Number,
    required: true
  },
  barCount: {
    type: Number,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  activeIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['activate'])

// Computed
const showDate = computed(() => {
  const mod = (props.barCount - props.index) % 5 - 1
  return mod === 0
})

const classObject = computed(() => {
  const c = []

  if (showDate.value) {
    c.push('-show-date')
  }

  if (props.index > (props.barCount / 3) * 2) {
    c.push('-right')
  } else if (props.index > props.barCount / 3) {
    c.push('-center')
  } else {
    c.push('-left')
  }

  if (props.index + 1 === props.barCount) {
    c.push('-today')
  }

  if (props.index === props.activeIndex) {
    c.push('-active')
  }

  return c.join(' ')
})

const styleObject = computed(() => {
  return {
    width: Math.floor(10000 / props.barCount) / 100 + '%'
  }
})

const barStyle = computed(() => {
  return {
    height: (props.data.count / props.maxCount) * 100 + '%'
  }
})

const formattedCount = computed(() => {
  let result = parseInt(props.data.count)

  if (result > 1000000000) {
    result = Math.round(result / 10000000) / 100 + 'B'
  } else if (result > 1000000) {
    result = Math.round(result / 10000) / 100 + 'M'
  } else if (result > 1000) {
    result = Math.round(result / 10) / 100 + 'K'
  }

  return result
})

const formattedDate = computed(() => {
  const d = new Date(props.data.date)
  let result = (d.getMonth() + 1) + '/' + d.getDate()

  const today = new Date()
  if (today.toDateString() === d.toDateString()) {
    result = 'Today'
  }

  return result
})

// Methods
const activate = () => {
  emit('activate', props.index)
}
</script>