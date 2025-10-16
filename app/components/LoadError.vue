<template>
  <div class="load-error" :class="'load-error--' + layout">
    <div class="load-error-message">
      Loading error - please try again later
    </div>
  </div>
</template>

<script setup>
defineProps({
  layout: {
    type: String,
    default: 'center'
  }
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.load-error {
	> .wrap {
		border: 2px solid var(--blue);
		border-radius: 5px;
		padding: 25px;

		> .content {
			p {
				text-align: center;
				font-size: 16px;
				font-weight: 500;
				color: var(--blue);
			}
		}
	}

	&.--top {
		> .wrap {
			margin-top: 20px;
			background-color: var(--blue);
			padding: 10px;

			> .content {
				p {
					color: white;
				}
			}
		}
	}
}


.load-error-transition-enter-active,
.load-error-transition-leave-active {
	transition: all 400ms animations.$easeOutCubic;
}

.load-error-transition-enter-from {
	opacity: 0;
	transform: translateY(30px) scale(0.95);
}

.load-error-transition-enter-to {
	opacity: 1;
	transform: translateY(0px);
}

</style>