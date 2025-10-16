<template>
  <li class="mixin-list-item">
    <div class="wrap">
      <div class="content">
        <p v-if="false">
          <NuxtLink :to="blockLink"><span>{{ $t('general.block', null, 1) }}</span><br/><b>{{ blockHeight }}</b></NuxtLink>
        </p>
        <p>
          <span>{{ $t('general.key_offset') }}</span><br/><b>{{ mixin }}</b>
        </p>
      </div>
    </div>
  </li>
</template>

<script setup>
// Props
const props = defineProps({
  mixin: {
    type: Object,
    required: true
  }
})

// Computed properties
const blockLink = computed(() => {
  return `/block/${props.mixin.block_no}`
})

const blockHeight = computed(() => {
  return accounting.formatNumber(props.mixin.block_no, 0)
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.mixin-list-item {
	padding: 10px 0;

	> .wrap {
		> .content {
			@include mixins.clearfix;

			p {
				font-size: 14px;
				color: rgba(var(--front), 0.5);

				span {
					font-size: 12px;
					text-transform: uppercase;
					opacity: 0.6;
					font-weight: 600;
				}

				b {
					font-weight: 400;
					word-wrap: break-word;
					font-size: 18px;
					color: rgba(var(--front), 0.75);
				}

				a {
					color: rgba(var(--front), 1);

					&:hover {
						color: var(--yellow);

						b {
							color: var(--yellow);
						}
					}
				}
			}
		}
	}

	& + .mixin-list-item {
		border-top: 1px solid rgba(var(--front), 0.1);
	}

	@include mixins.media-query(small) {
		> .wrap {
			> .content {
				p {
					& + p {
						margin-top: 15px;
					}
				}
			}
		}
	}

	@include mixins.media-query(medium-up) {
		> .wrap {
			> .content {
				p {
					float: left;
					
					&:nth-child(1) {
						width: 20%;
					}

					&:nth-child(2) {
						width: 80%;
					}
				}
			}
		}
	}
}

</style>