
<template>
    <li :class="active ? '-active' : ''">
        <button
            @click.prevent="select"
            v-html="data.name"
            :aria-selected="active"
        />
    </li>
</template>

<script setup>
const props = defineProps({
    id: String,
    data: Object,
    active: Boolean
})

const emit = defineEmits(['select'])

const select = () => {
    emit('select', props.id)
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

li {
    button {
        display: block;
        padding-left: 10px;
        padding-right: 10px;
        font-weight: 600;
        font-size: 17px;
        line-height: 32px;
        color: rgba(var(--front), 0.75);
        appearance: none;
        background: none;
        border: 0;
        text-align: left;
        width: 100%;

        span {
            margin-right: 5px;

            svg {
                width: 25px;
                height: 25px;
                vertical-align: middle;
                transform: translateY(-1px);
            }
        }
    }

    &:hover {
        button {
            color: var(--blue);
        }
    }

    &.-active {
        button {
            color: var(--green);
        }
    }

    @include mixins.media-query(small) {
        line-height: 44px;
    }
}

</style>