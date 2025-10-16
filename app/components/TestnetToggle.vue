
<template>
    <a :class="classObject" @click.prevent="toggleTestnet">
        <span>{{ $t('general.testnet') }}</span>
    </a>
</template>

<script setup>
const store = useMoneroStore()

const classObject = computed(() => {
    const classes = ['testnet-toggle']

    if (store.testnet) {
        classes.push('-active')
    }

    return classes.join(' ')
})

const toggleTestnet = () => {
    store.updateTestnet(!store.testnet)
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.testnet-toggle {
	display: block;
	cursor: pointer;

	span {
		display: block;
		position: relative;
		padding-right: 50px;
		line-height: 26px;
		font-weight: 700;
		color: rgba(var(--front), 0.5);;

		&:before,
		&:after {
			position: absolute;
			top: 0;
			right: 0;
			display: block;
			content: '';
			border-radius: 100px;
			transition: all 250ms animations.$ease;
		}

		&:before {
			background-color: rgba(var(--front), 0.2);
			width: 40px;
			height: 24px;
		}

		&:after {
			right: 2px;
			// background-color: rgba(var(--front), 0.25);
			background-color: rgba(var(--back), 1);
			background-color: white;
			width: 20px;
			height: 20px;
			transform: translate(0, 2px);
			box-shadow: 0 5px 15px -4px rgba(black, 0.5);
		}
	}

	&.-active {
		span {
			&:before {
				background-color: var(--blue);
			}

			&:after {
				transform: translate(-15px, 2px);
			}
		}
	}

	@include mixins.media-query(small) {

	}

	@include mixins.media-query(medium-up) {
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}
}

</style>
