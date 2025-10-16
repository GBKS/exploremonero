<template>
  <li :class="classObject">
    <div class="wrap">
      <div class="content">
        <div class="info">
          <p v-if="isMiningReward">{{ $t('general.amount') }}<br/><b>{{ input.amount }} XMR</b></p>
          <p>{{ $t('general.key_image') }}<br/><b>{{ input.key.k_image }}</b></p>
        </div>

        <MixinList
          :mixins="input.key.key_offsets"
          :show-background="true"
        />
      </div>
    </div>
  </li>
</template>

<script setup>
// Props
const props = defineProps({
  input: {
    type: Object,
    required: true
  },
  isMiningReward: {
    type: Boolean,
    default: false
  }
})

// Computed properties
const classObject = computed(() => {
  const c = ['input-list-item']

  if (props.isMiningReward) {
    c.push('-mining-reward')
  }

  return c.join(' ')
})
</script>

<style lang="scss" scoped>

@use '@/assets/css/variables.scss' as variables;
@use '@/assets/css/mixins.scss' as mixins;
@use '@/assets/css/animations.scss' as animations;

.input-list-item {
	padding: 10px 0;

	> .wrap {
		> .content {
			> .info {
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
						}
					}
				}
			}

			.mixin-list {
				margin-top: 10px;
			}
		}
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
		&.-mining-reward {
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
}

</style>