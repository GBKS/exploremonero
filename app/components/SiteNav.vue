<template>
  <div :class="classObject">
    <transition name="site-nav-transition" :duration="1000" appear>
      <div class="wrap">
        <div class="content">
          <nav>
            <NuxtLink to="/receipt">{{ $t('nav.receipts') }}</NuxtLink>
            <NuxtLink to="/deposit">{{ $t('nav.deposits') }}</NuxtLink>
            <NuxtLink to="/blocks">{{ $t('nav.blocks') }}</NuxtLink>
            <NuxtLink to="/queue">{{ $t('nav.queue') }}</NuxtLink>
            <NuxtLink to="/info">{{ $t('nav.info') }}</NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const classObject = computed(() => {
  const c = ['site-nav'];

  if(route.path === '/') {
    c.push('--size-big');
  } else  {
    c.push('--size-small');
  }

  return c.join(' ');
})

</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.site-nav {
	transition: all 350ms animations.$ease;
	
	> .wrap {
		> .content {
			nav {
				a {
					display: inline-block;
					color: rgba(var(--front), 0.35);
					text-transform: uppercase;
					font-weight: 900;
					font-size: 14px;
					position: relative;
					transition: all 250ms animations.$ease;

					&:before {
						display: block;
						content: '';
						background-color: rgba(var(--front), 0.35);
						left: 0;
						width: 100%;
						bottom: -5px;
						height: 2px;
						border-radius: 10px;
						position: absolute;
						opacity: 0;
						transition: all 250ms animations.$ease;
						transform: translateY(10px);
					}

					&.router-link-active,
					&.router-link-exact-active,
					&:hover {
						color: var(--yellow);
						opacity: 1;

						&:before {
							opacity: 1;
							background-color: var(--yellow);
							transform: translateY(0px);
						}
					}

					&:hover {
						&:before {

						}
					}
				}
			}
		}
	}

	&.--size-big {
		opacity: 0;
		transform: translateY(-30px);
		pointer-events: none;
	}

	@include mixins.media-query(small) {
		padding-top: 15px;
		padding-bottom: 15px;

		> .wrap {
			> .content {
				nav {
					text-align: center;
					
					a {
						& + a {
							margin-left: 8px;
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		padding-top: 20px;
		padding-bottom: 20px;

		> .wrap {
			> .content {
				nav {
					a {
						& + a {
							margin-left: 20px;
						}
					}
				}
			}
		}
	}
}

.site-nav-transition-enter-active,
.site-nav-transition-leave-active {
	> .content {
		nav {
			a {
				transition: all 400ms animations.$easeOutCubic;

				&:nth-child(1) { transition-delay: 50ms; }
				&:nth-child(2) { transition-delay: 80ms; }
				&:nth-child(3) { transition-delay: 110ms; }
				&:nth-child(4) { transition-delay: 140ms; }
				&:nth-child(5) { transition-delay: 170ms; }
			}
		}
	}
}

.site-nav-transition-enter-from {
	> .content {
		nav {
			a {
				transform: translateY(20px);
				opacity: 0;
			}
		}
	}
}

.site-nav-transition-enter-to {
	> .content {
		nav {
			a {
				transform: translateY(0);
				opacity: 1;
			}
		}
	}
}

</style>