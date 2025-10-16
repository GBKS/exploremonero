
<template>
  <nav class="about-transaction-nav">
    <a
      v-for="(item, index) in options"
      :key="item.id"
      href="#"
      :class="item.id == activeOption ? '-active' : null"
      @click.prevent="select(item.id)"
    >
      {{ item.name }}
    </a>
  </nav>
</template>

<script setup>
// Props
const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  activeOption: {
    type: [String, Number],
    required: true
  }
})

// Emits
const emit = defineEmits(['select'])

// Methods
const select = (id) => {
  emit('select', id)
}
</script>