<template>
  <div 
    ref="canvas"
    :contenteditable="true"
    :class="classObject" 
    :placeholder="placeholder || ''"
    @input="update"
    @focus="focus"
    @blur="blur"
    @paste="paste"
  />
</template>

<script setup>
// Props
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update'])

// Reactive data
const canvas = ref(null)
const focused = ref(false)

// Computed
const classObject = computed(() => {
  const c = ['multiline-input']

  if (focused.value) {
    c.push('--active')
  }

  if (props.disabled) {
    c.push('--disabled')
  }

  return c.join(' ')
})

// Methods
const update = (event) => {
  emit('update', event.target.innerText)
}

const focus = () => {
  focused.value = true
}

const blur = () => {
  focused.value = false
}

const paste = (event) => {
  event.preventDefault()

  // get text representation of clipboard
  const text = event.clipboardData.getData("text/plain")

  canvas.value.innerText = text
  emit('update', text)
}

// Lifecycle
onMounted(() => {
  canvas.value.innerText = props.text
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.multiline-input {
	&:empty:before {
		color: rgba(var(--front), 0.2);
	}
}

</style>