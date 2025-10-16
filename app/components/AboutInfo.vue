<template>
	<Transition
		name="about-info-transition" 
		:duration="1000" 
		appear
		:key="transitionKey"
	>
		<div class="about-info">
			<div class="wrap">
				<div class="content">
					<ol>
						<li>
							<h3>{{ $t('info.project_info.title') }}</h3>
							<p v-html="$t('info.project_info.text')" />
						</li>
						<li>
							<h3>{{ $t('info.data.title') }}</h3>
							<p v-html="$t('info.data.text')" />
						</li>
						<li>
							<h3><a href="https://github.com/GBKS/exploremonero-i18n" target="_blank">{{ $t('info.contributors.title') }}</a></h3>
							<p>
								<a href="https://github.com/0x76703131" target="_blank">0x76703131</a>, 
								<a href="https://github.com/42ndTowel" target="_blank">42ndTowel</a>, 
								<a href="https://github.com/Equim-chan" target="_blank">Equim</a>, 
								<a href="https://github.com/einsteinsfool" target="_blank">einsteinsfool</a>,
								<a href="https://github.com/Gelesztaa" target="_blank">Gelesztaa</a>,
								<a href="https://github.com/Luuk2016" target="_blank">LKenselaar</a>,
								<a href="https://github.com/hoxsec" target="_blank">HOXSEC</a>,
								<a href="https://github.com/orientaru" target="_blank">orientaru</a>.
							</p>
						</li>
						<li>
							<h3>{{ $t('info.donation.title') }}</h3>
							<p class="-address">43Yfjr3vygyWwK1voeB4HaMkUGQBSVqCb2tRaRWPbSsKho1yjtmm7PPbVY1N722n7LeV82YHfWfsTBTVpTp63H8J8UXSTzd</p>
						</li>
					</ol>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
const transitionKey = ref(0)

// Lifecycle hooks
onMounted(() => {
  transitionKey.value += 1
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.about-info {
	> .wrap {
		> .content {
			ol {
				@include mixins.clearfix;
				
				li {
					@include mixins.clearfix;

					h3 {
						color: rgba(var(--front), 0.5);
						font-size: 12px;
						font-weight: 700;
						text-transform: uppercase;

						a {
							color: var(--blue);
						}
					}

					p {
						color: rgba(var(--front), 1);
						font-size: 22px;
						font-weight: 300;

						&.-address {
							margin-top: 3px;
							word-wrap: break-word;
							font-size: 14px;
							font-weight: 400;
						}

						:deep(a) {
							color: var(--blue);
						}

						& + p {
							margin-top: 10px;
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				ol {
					li {
						& + li {
							margin-top: 30px;
						}
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		> .wrap {
			> .content {
				ol {
					li {
						margin-top: 30px;

						& + li {

						}
					}
				}
			}
		}
	}

	&.about-info-transition-enter-active,
	&.about-info-transition-leave-active {
		> .wrap {
			> .content {
				ol {
					li {
						h3 {
							transition: all 400ms animations.$easeOutCubic;
						}

						p {
							transition: all 400ms animations.$easeOutCubic;
						}

						&:nth-child(0) {
							h3 { transition-delay: 50ms; }
							p { transition-delay: 75ms; }
						}

						&:nth-child(1) {
							h3 { transition-delay: 100ms; }
							p { transition-delay: 125ms; }
						}

						&:nth-child(2) {
							h3 { transition-delay: 150ms; }
							p { transition-delay: 175ms; }
						}

						&:nth-child(3) {
							h3 { transition-delay: 200ms; }
							p { transition-delay: 225ms; }
						}

						&:nth-child(4) {
							h3 { transition-delay: 250ms; }
							p { transition-delay: 275ms; }
						}

						&:nth-child(5) {
							h3 { transition-delay: 300ms; }
							p { transition-delay: 325ms; }
						}

						&:nth-child(6) {
							h3 { transition-delay: 350ms; }
							p { transition-delay: 375ms; }
						}

						&:nth-child(7) {
							h3 { transition-delay: 400ms; }
							p { transition-delay: 425ms; }
						}

						&:nth-child(8) {
							h3 { transition-delay: 450ms; }
							p { transition-delay: 475ms; }
						}
					}
				}
			}
		}
	}

	&.about-info-transition-enter-from {
		> .wrap {
			> .content {
				ol {
					li {
						h3 {
							opacity: 0;
							// transform: translateY(70px) scale(1.15);
							transform: translateX(30px);
						}

						p {
							opacity: 0;
							// transform: translateY(70px) scale(1.15);
							transform: translate(30px);
						}
					}
				}
			}
		}
	}

	&.about-info-transition-enter-to {
		> .wrap {
			> .content {
				ol {
					li {
						h3 {
							opacity: 1;
							transform: translateX(0px);
						}

						p {
							opacity: 1;
							transform: translateX(0px);
						}
					}
				}
			}
		}
	}
}

</style>