<template>
	<Transition
		name="skeleton-loader-transition" 
		:duration="1000" 
		appear
		:key="transitionKey"
	>
		<div
			class="skeleton-loader"
			:style="styleObject"
		>
			<div
				v-for="n in count"
				:key="n"
				:style="lineStyleObject"
			><div /></div>
		</div>
	</Transition>
</template>

<script setup>
const props = defineProps({
  count: {
	type: Number,
	default: 10
  },
  height: {
	type: Number,
	default: 70
  },
  gap: {
	type: Number,
	default: 15
  }
})

const transitionKey = ref(0)

const styleObject = computed(() => {
	return {
		gap: `${props.gap}px`
	}
})

const lineStyleObject = computed(() => {
	return {
		height: `${props.height}px`
	}
})

// Lifecycle hooks
onMounted(() => {
  transitionKey.value += 1
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.skeleton-loader {
	display: flex;
	flex-direction: column;
	gap: 15px;

	> * {
		> div {
			width: 100%;
			height: 100%;
			border-radius: 5px;
			background: linear-gradient(90deg, rgba(var(--front), 0.05) 0%, rgba(var(--front), 0.015) 100%);
			animation: skeleton-glow 2.5s infinite;
		}

		&:nth-child(1) > div { animation-delay: 100ms; }
		&:nth-child(2) > div { animation-delay: 200ms; }
		&:nth-child(3) > div { animation-delay: 300ms; }
		&:nth-child(4) > div { animation-delay: 400ms; }
		&:nth-child(5) > div { animation-delay: 500ms; }
		&:nth-child(6) > div { animation-delay: 600ms; }
	}

	&.skeleton-loader-transition-enter-active,
	&.skeleton-loader-transition-leave-active {
		> * {
			transition: opacity 500ms animations.$ease;

			&:nth-child(1) { transition-delay: 50ms; }
			&:nth-child(2) { transition-delay: 100ms; }
			&:nth-child(3) { transition-delay: 150ms; }
			&:nth-child(4) { transition-delay: 200ms; }
			&:nth-child(5) { transition-delay: 250ms; }
		}
	}

	&.skeleton-loader-transition-enter-from {
		> * {
			opacity: 0;
		}
	}

	&.skeleton-loader-transition-enter-to {
		> * {
			opacity: 1;
		}
	}
}

@keyframes skeleton-glow {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
	100% {
		opacity: 1;
	}
}

</style>