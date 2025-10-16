
<template>
    <div :class="classObject">
        <button
			@click.prevent="toggle"
			v-html="icons.language"
			aria-label="Select language"
			:aria-pressed="active"
		/>
		<LanguageSelectorList
			:active="active"
			@select="select"
			@close="close"
		/>
    </div>
</template>

<script setup>
const { setLocale } = useI18n()

const store = useMoneroStore()

const active = ref(false)

const classObject = computed(() => {
	const classes = ['language-selector']

	if (!store.themetoggled) {
		classes.push('--theme-dark')
	} else {
		classes.push('--theme-light')
	}

	return classes.join(' ')
})

const toggle = () => {
    active.value = !active.value
}

const close = () => {
    active.value = false
}

const select = (id) => {
    setLocale(id)

    // Update language in store
    store.updateLanguage(id)
    active.value = false
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.language-selector {
	position: relative;

	> button {
		display: block;
		width: 42px;
		height: 42px;
		line-height: 42px;
		text-align: center;
		appearance: none;
		border-width: 0;
		background: none;
		cursor: pointer;

		:deep(svg) {
			width: 25px;
			height: 25px;
			vertical-align: middle;
			transform: translateY(-1px);
			color: rgba(var(--front), 0.25);
			transition: all 250ms animations.$ease;
		}

		&:hover {
			:deep(svg) {
				color: var(--green);
			}
		}
	}
}

</style>