<template>
  <div :class="classObject">
    <Transition name="site-header-transition" :duration="1000" appear>
      <div class="wrap">
        <div class="content">
          <p>
            <NuxtLink to="/"><span v-html="logo" title="Monero Explorer home" /><i>Explore</i>Monero</NuxtLink>
            <button
				@click.prevent="toggleTheme"
				v-html="themeIcon"
				:title="themeTitle"
				:aria-selected="store.themeToggled"
			/>
          </p>
          <SearchBox
            :searchInput="searchInput"
          />
          <LanguageSelector />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const props = defineProps(['searchInput']);

const store = useMoneroStore()
const route = useRoute()
const id = 'site-header';
let size = route.path != '/' ? 'small' : 'big';
let themeToggled = store.themetoggled;
const logo = icons.monero;

watch(() => route.path, (newPath) => {
  updateSize();
});

const classObject = computed(() => {
  const c = ['site-header'];

  if(store.themeToggled) {
    c.push('--theme-toggled');
  }

  c.push('--size-'+size);

  return c.join(' ');
})

const themeIcon = computed(() => {
  return store.themetoggled ? icons.moon : icons.sun;
})

const themeTitle = computed(() => {
  return store.themetoggled ? 'Bask under the moonlight' : 'Let the sunshine in';
})

onBeforeMount(() => {
    events.listen('change-theme', onChangeThemeEvent, id);

    if(store.themetoggled) {
      document.documentElement.classList.add('theme--dark');
    } else {
      document.documentElement.classList.remove('theme--light');
    }
})

onBeforeUnmount(() => {
  events.clearListener(id);
})

function toggleTheme() {
    themeToggled = !themeToggled;

    store.themetoggled = themeToggled;

    if(themeToggled) {
        document.documentElement.classList.add('theme--light');
    } else {
        document.documentElement.classList.remove('theme--light');
    }
}

function onChangeThemeEvent(data) {
  const active = data.type == 'light';

  if(themeToggled != active) {
    toggleTheme();
  }
}

function updateSize() {
  let newSize = 'big';

  if(route.path != '/') {
      newSize = 'small';
  }

  size = newSize;
}

</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.site-header {
	> .wrap {
		> .content {
			@include mixins.clearfix;

			> p {
				font-weight: 900;
				line-height: 1;

				a {
					&:first-child {
						color: var(--moneroOrange);

						span {
							display: inline-block;
							position: relative;
							margin-right: 15px;
							width: 40px;
							height: 40px;
							border-radius: 100px;
							line-height: 0;
							vertical-align: middle;
							transform: translateY(-2px);
							transition: all 250ms animations.$ease;

							&:before {
								display: block;
								content: '';
								background-color: white;
								position: absolute;
								top: 1px;
								left: 1px;
								width: 38px;
								height: 38px;
								border-radius: 100px;
							}

							:deep(svg) {
								position: relative;
								transition: all 250ms animations.$ease;
							}
						}

						i {
							padding-right: 3px;
							font-weight: 300;
							font-style: normal;
							color: rgba(var(--front), 1);
						}

						&:hover {
							span {
								svg {
									// transform: scale(1.1);
								}
							}
						}
					}
				}

				button {
					:deep(svg) {
						vertical-align: top;
						width: 18px;
						height: 18px;
						fill: var(--yellow);
						stroke: var(--yellow);
					}
				}
			}
		}
	}

	&.--theme-toggled {
		> .wrap {
			> .content {
				> p {
					button {
						:deep(svg) {
							fill: var(--blue);
							stroke: var(--blue);
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-down) {
		> .wrap {
			> .content {
				position: relative;
				padding-top: 25px;

				> p {
					font-size: 28px;

					a {
						&:first-child {
							span {
								margin-right: 10px;
								width: 35px;
								height: 35px;

								&:before {

								}

								:deep(svg) {
									width: 35px;
									height: 35px;
								}
							}

							i {

							}
						}
					}
				}

				.language-selector {
					position: absolute;
					top: 21px;
					right: 0;
				}
			}
		}
	}

	@include mixins.media-query(large) {
		> .wrap {
			> .content {
				padding-top: 40px;

				> p {
					float: left;
					font-size: 36px;

					a {
						&:first-child {
							span {
								:deep(svg) {
									width: 40px;
									height: 40px;
								}
							}
						}
					}
				}

				.language-selector {
					float: right;
					margin-top: -3px;
					margin-right: 5px;
				}

				.search-box {
					float: right;
					margin-top: -3px;
				}
			}
		}
	}
}

.site-header-transition-enter-active,
.site-header-transition-leave-active {
	p {
		transition: all 400ms animations.$easeOutCubic;
		transition-delay: 50ms;
	}

	.search-box {
		transition: all 400ms animations.$easeOutCubic;
		transition-delay: 300ms;

		input {
			&::placeholder {
				transition: all 500ms animations.$easeOutCubic;
				transition-delay: 400ms;
			}
		}
	}

	.language-selector {
		transition: all 400ms animations.$easeOutCubic;
		transition-delay: 250ms;
	}
}

.site-header-transition-enter {
	p {
		transform: translateY(-50px);
		opacity: 0;
	}

	.search-box {
		transform: translateY(-50px);
		opacity: 0;

		input {
			&::placeholder {
				color: rgba(white, 0);
			}
		}
	}

	.language-selector {
		transform: translateY(-50px);
		opacity: 0;
	}
}

.site-header-transition-enter-to {
	p {
		transform: translateY(0);
		opacity: 1;
	}

	.search-box {
		transform: translateY(0);
		opacity: 1;

		input {
			&::placeholder {
				color: rgba(white, 0.3);
			}
		}
	}

	.language-selector {
		transform: translateY(0);
		opacity: 1;
	}
}

</style>
