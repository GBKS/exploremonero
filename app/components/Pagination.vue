<template>
  <div :class="classObject">
    <a href="#" @click.prevent="more">
      {{ $t('general.pagination_load_more') }}
    </a>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['paginate']);

// Computed properties
const classObject = computed(() => {
  const classes = ['pagination'];

  if (props.loading) {
    classes.push('--loading');
  }

  return classes.join(' ');
});

// Methods
const more = () => {
  if (!props.loading) {
    emit('paginate');
  }
};
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.pagination {
	text-align: center;
	padding: 30px 0 0 0;

	a {
		display: inline-block;
		color: white;
		border: 1px solid rgba(var(--front), 0.2);
		padding: 0 40px;
		font-size: 16px;
		line-height: 40px;
		border-radius: 10px;
		font-weight: 600;
		color: rgba(var(--front), 0.8);
		transition: all 250ms animations.$ease;

		&:hover {
			color: var(--blue);
			border-color: var(--blue);
		}
	}

	&.--loading {
		cursor: default;

		a {
			opacity: 0.75;
		}
	}
}

</style>