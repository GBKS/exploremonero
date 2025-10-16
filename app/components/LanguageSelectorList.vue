<template>
    <transition name="language-selector-list-transition" :duration="1000" appear>
        <div
            v-if="active"
            :class="classObject"
            @click="clickCanvas"
        >
            <div class="wrap">
                <div class="content">
                    <ol>
                        <LanguageSelectorListItem
                            v-for="(item, id) in locales"
                            :id="item.code"
                            :key="item.code"
                            :data="item"
                            :active="item.code == locale"
                            @select="select"
                        />
                    </ol>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
const { locale, locales } = useI18n()

const props = defineProps({
    active: Boolean
})

// Emits
const emit = defineEmits(['select', 'close'])

// Store
const store = useMoneroStore()

const classObject = computed(() => {
	const classes = ['language-selector-list']

	if (!store.themetoggled) {
		classes.push('theme--dark')
	} else {
		classes.push('theme--light')
	}

	return classes.join(' ')
})

const select = (id) => {
    emit('select', id)
}

const clickCanvas = (event) => {
    const target = event.target
    if (config.isMobile && target.classList.contains('wrap')) {
        emit('close')
    }
}
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.language-selector-list {
    z-index: 100;

    > .wrap {
        > .content {
            ol {
                display: flex;
                flex-direction: column;

                :deep(li) {
                    & + li {
                        border-top: 1px solid rgba(var(--front), 0.1);
                    }
                }
            }
        }
    }

	@include mixins.media-query(small) {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(var(--back), 0.9);

        > .wrap {
            position: relative;
            height: 100%;

            > .content {
                position: absolute;
                top: 50%;
                left: 20px;
                right: 20px;
                background-color: rgba(var(--back), 1);
                border-radius: 5px;
                box-shadow: 0 20px 70px -15px rgba(var(--front), 0.1);
                color: rgba(var(--front), 0.1);
                transform: translateY(-50%);
                border: 1px solid rgba(var(--front), 0.15);
            }
        }
	}

	@include mixins.media-query(medium-up) {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 150px;
        background-color: rgba(var(--back), 1);
        border-radius: 5px;
        box-shadow: 0 20px 70px -15px rgba(var(--front), 0.1);
        color: rgba(var(--front), 0.1);
        border: 1px solid rgba(var(--front), 0.15);
	}

	&.theme--light {
		@include mixins.media-query(small) {
            background-color: rgba(var(--front), 0.5);
		}

		@include mixins.media-query(medium-up) {
            > .wrap {
                > .content {
                    border-width: 0;
                }
            }
		}

		&.language-selector-list-transition-enter-from {
			@include mixins.media-query(small) {
				background-color: rgba(var(--front), 0) !important;
			}
		}

		&.language-selector-list-transition-enter-to {
			@include mixins.media-query(small) {
				background-color: rgba(var(--front), 0.5) !important;
			}
		}
		
		&.language-selector-list-transition-leave-from {
			@include mixins.media-query(small) {
				background-color: rgba(var(--front), 0.5) !important;
			}
		}

		&.language-selector-list-transition-leave-to {
			@include mixins.media-query(small) {
				background-color: rgba(var(--front), 0) !important;
			}
		}
	}
}



.language-selector-list-transition-enter-active,
.language-selector-list-transition-leave-active {
	@include mixins.media-query(small) {
		transition: all 400ms animations.$easeOutCubic;
		transition-delay: 50ms;

		> .wrap {
			> .content {
				transition: all 400ms animations.$easeOutCubic;
				transition-delay: 50ms;
			}
		}
	}

	@include mixins.media-query(medium-up) {
		transition: all 400ms animations.$easeOutCubic;
		transition-delay: 50ms;
	}

    > .wrap {
        > .content {
            ol {
                :deep(li) {
                    transition: all 400ms animations.$easeOutCubic;

                    &:nth-child(1) { transition-delay: 50ms; }
                    &:nth-child(2) { transition-delay: 100ms; }
                    &:nth-child(3) { transition-delay: 150ms; }
                    &:nth-child(4) { transition-delay: 200ms; }
                    &:nth-child(5) { transition-delay: 250ms; }
                    &:nth-child(6) { transition-delay: 300ms; }
                    &:nth-child(7) { transition-delay: 350ms; }
                    &:nth-child(8) { transition-delay: 400ms; }
                    &:nth-child(9) { transition-delay: 450ms; }
                    &:nth-child(10) { transition-delay: 500ms; }
                }
            }
        }
    }

    &.language-selector-list-transition-enter-from {
        @include mixins.media-query(small) {
            background-color: rgba(var(--back), 0) !important;

            > .wrap {
                > .content {
                    transform: translateY(-25%) !important;
                    opacity: 0;
                }
            }
        }

        @include mixins.media-query(medium-up) {
            transform: translate(-50%, 35px) !important;
            opacity: 0;
        }

        > .wrap {
            > .content {
                ol {
                    :deep(li) {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                }
            }
        }
    }

    &.language-selector-list-transition-enter-to {
        @include mixins.media-query(small) {
            background-color: rgba(var(--back), 0.9) !important;

            > .wrap {
                > .content {
                    transform: translateY(-50%) !important;
                    opacity: 1;
                }
            }
        }

        @include mixins.media-query(medium-up) {
            transform: translate(-50%, 0) !important;
            opacity: 1;
        }

        > .wrap {
            > .content {
                ol {
                    :deep(li) {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            }
        }
    }

    &.language-selector-list-transition-leave-from {
        @include mixins.media-query(small) {
            background-color: rgba(var(--back), 0.9) !important;

            > .wrap {
                > .content {
                    transform: translateY(-50%) !important;
                    opacity: 1;
                }
            }
        }

        @include mixins.media-query(medium-up) {
            transform: translate(-50%, 0) !important;
            opacity: 1;
        }
    }

    &.language-selector-list-transition-leave-to {
        @include mixins.media-query(small) {
            background-color: rgba(var(--back), 0) !important;

            > .wrap {
                > .content {
                    transform: translateY(-25%) !important;
                    opacity: 0;
                }
            }
        }

        @include mixins.media-query(medium-up) {
            transform: translate(-50%, 35px) !important;
            opacity: 0;
        }
    }
}

</style>