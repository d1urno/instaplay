<template>
  <div class="fixed flex justify-center w-screen h-screen grid-cols-12 md:grid c-feed">
    <!-- Contact form modal -->
    <transition name="fade" @after-enter="contactModal.showForm = true">
      <div
        v-if="contactModal.show"
        class="fixed z-30 grid w-full h-full bg-red-400 grid-rows-12"
        @click.self="
          () => {
            contactModal.show = false
            contactModal.showForm = false
          }
        "
      >
        <transition name="scale">
          <div
            v-if="contactModal.showForm"
            class="w-full max-w-xl row-span-6 mx-auto my-auto text-xl bg-white bg-yellow-300 rounded-lg shadow-md"
          >
            <contact-form
              @click.self.stop=""
              @send="
                () => {
                  contactModal.show = false
                  contactModal.showForm = false
                }
              "
            />
          </div>
        </transition>
      </div>
    </transition>
    <!-- Tag selection modal (mobile) -->
    <transition name="fade">
      <div
        v-if="hashTagModal && hashTags"
        class="fixed z-20 grid w-full h-full grid-cols-12 bg-red-400"
        @click.self="hashTagModal = false"
      >
        <div class="h-48 col-span-10 col-start-2 py-1 my-auto text-xl bg-white rounded-lg shadow-md">
          <n-link
            :to="'/'"
            :class="{
              'pointer-events-none': !$route.params.label
            }"
            class="relative p-2 text-gray-700 c-link"
            @click.native="
              () => {
                hashTagModal = false
                setPlayIndex(-1)
              }
            "
            >all</n-link
          >
          <n-link
            v-for="hashtag in getActiveHashTags"
            :key="hashtag._id"
            :class="{
              'pointer-events-none': hashtag.label.slice(1) === $route.params.label
            }"
            class="relative p-2 text-gray-700 c-link"
            :to="'/' + hashtag.label.slice(1)"
            @click.native="
              () => {
                hashTagModal = false
                setPlayIndex(-1)
              }
            "
          >
            {{ hashtag.label }}
          </n-link>
        </div>
      </div>
    </transition>
    <div class="absolute inset-0 col-span-3 px-5 pt-5 pb-10 mx-auto md:h-full md:px-0 md:static">
      <div class="flex flex-col max-w-md mx-auto md:h-full">
        <h1 class="relative z-30 mb-5 text-2xl font-bold text-center lg:text-3xl text-clay">
          Instaplay
        </h1>
        <div class="flex flex-1 md:flex-col">
          <div class="flex-col justify-center flex-1 hidden w-full md:flex md:mb-10">
            <div v-if="hashTags" class="z-10 flex flex-wrap justify-center flex-none overflow-y-auto rounded-lg">
              <n-link
                :to="'/'"
                :class="{
                  'pointer-events-none': !$route.params.label
                }"
                class="flex-none p-2 px-3 text-center text-gray-200 transition-colors duration-500 xl:text-lg hover:text-white c-link"
                @click.native="
                  () => {
                    hashTagModal = false
                    setPlayIndex(-1)
                    hashTagPreview = ''
                    hashTagIndexPreview = ''
                  }
                "
                @mouseover.native="
                  () => {
                    hashTagPreview = 'all'
                    hashTagIndexPreview = ' '
                  }
                "
                @mouseout.native="
                  () => {
                    hashTagPreview = ''
                    hashTagIndexPreview = ''
                  }
                "
              >
                all
              </n-link>
              <n-link
                v-for="hashtag in getActiveHashTags"
                :key="hashtag.id"
                :to="'/' + hashtag.label.slice(1)"
                :class="{
                  'pointer-events-none': hashtag.label.slice(1) === $route.params.label
                }"
                class="flex-none p-2 px-3 text-center text-gray-200 transition-colors duration-500 xl:text-xl hover:text-white c-link"
                @click.native="
                  () => {
                    hashTagModal = false
                    setPlayIndex(-1)
                    hashTagPreview = ''
                    hashTagIndexPreview = ''
                  }
                "
                @mouseover.native="
                  () => {
                    hashTagPreview = hashtag.label
                    hashTagIndexPreview = hashtag.posts.data.length.toString()
                  }
                "
                @mouseout.native="
                  () => {
                    hashTagPreview = ''
                    hashTagIndexPreview = ''
                  }
                "
                >{{ hashtag.label }}
              </n-link>
            </div>
          </div>
          <div class="flex">
            <button
              class="relative z-30 w-12 h-12 ml-auto rounded-full md:mb-3 button--green focus:outline-none focus:shadow-outline"
              @click="playHandler"
            >
              <img
                v-if="isPlaying"
                class="w-6 h-6 mx-auto fill-current focus:outline-none hover:text-white"
                svg-inline
                src="~/assets/icons/pause.svg"
                alt=""
              />
              <img
                v-else
                class="w-6 h-6 mx-auto fill-current focus:outline-none hover:text-white"
                svg-inline
                src="~/assets/icons/play.svg"
                alt=""
              />
            </button>
            <span class="w-3"></span>
            <button
              class="z-30 w-12 h-12 mr-auto rounded-full md:mb-10 button--green focus:outline-none focus:shadow-outline"
              @click="audioHandler"
            >
              <img
                v-if="isMuted"
                class="w-8 h-8 mx-auto fill-current focus:outline-none hover:text-white"
                svg-inline
                src="~/assets/icons/unmuted.svg"
                alt=""
              />
              <img
                v-else
                class="w-8 h-8 mx-auto fill-current focus:outline-none hover:text-white"
                svg-inline
                src="~/assets/icons/muted.svg"
                alt=""
              />
            </button>
          </div>
          <span class="w-5 md:hidden"></span>
          <button
            class="z-30 w-32 mx-auto my-auto rounded-lg md:hidden md:mb-3 button--green focus:outline-none focus:shadow-outline c-link"
            @click="hashTagModal = !hashTagModal"
          >
            Hashtags
          </button>
          <span class="w-5 md:hidden"></span>
          <n-link
            to="/manager"
            class="bottom-0 z-30 w-32 mx-auto my-auto text-center rounded-lg button--green focus:outline-none focus:shadow-outline c-link"
          >
            Manager
          </n-link>
        </div>
      </div>
    </div>
    <div class="col-span-6 overflow-y-hidden c-main">
      <n-child
        :key="$route.params.label"
        ref="child"
        :hash-tag-preview="hashTagPreview"
        :hash-tag-index-preview="hashTagIndexPreview"
      ></n-child>
    </div>
    <div
      class="absolute inset-0 hidden max-h-full col-span-3 px-5 mx-auto overflow-y-auto md:block md:h-full md:px-0 md:static"
    >
      <div class="flex flex-col justify-center max-w-md px-5 mx-auto text-sm text-gray-200 md:h-full">
        <p class="pt-5">
          If you are watching this, chances are you are one of my friends &#x1F49A;
          <br />
          <span class="italic">Instaplay</span> is just an experimental project in its birth phase that emerged in these
          quarantine times. Please help me test it out by using it, creating your own playlists, and sharing them with
          your loved ones. Also, if you have any idea or suggestion that you want to discuss with me, drop me a
          <span class="inline-block font-bold text-white cursor-pointer" @click="contactModal.show = true">message</span
          >.
          <br />
          <br />
          Some ideas could be: <br />
        </p>
        <ul class="list-disc">
          <li class="my-1 ml-5">User/Group accounts with private collections</li>
          <li class="my-1 ml-5">Expose playlists to everyone</li>
          <li class="my-1 ml-5">Reorder videos by drag and drop</li>
          <li class="my-1 ml-5">Custom text message alongside videos</li>
          <li class="my-1 ml-5">Presentation mode</li>
          <li class="my-1 ml-5">Support for image posts, with play duration</li>
        </ul>
        <br />
        <p class="pb-5">
          Again, this is an ongoing project, will see how far it goes ;) Thank you!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ContactForm from '~/components/ContactForm'
import ALL_HASHTAGS from '~/apollo/queries/ALL_HASHTAGS'

export default {
  components: { ContactForm },
  transition: 'fade',
  data() {
    return {
      hashTagModal: false,
      hashTagPreview: '',
      hashTagIndexPreview: '',
      hashTags: null,
      contactModal: {
        show: false,
        showForm: false
      }
    }
  },
  computed: {
    ...mapGetters({
      playIndex: 'playIndex',
      isPlaying: 'isPlaying',
      isMuted: 'isMuted',
      playPosition: 'playPosition'
    }),
    getActiveHashTags() {
      return this.hashTags.filter((value) => {
        return value.posts.data.length
      })
    }
  },
  apollo: {
    hashTags: {
      query: ALL_HASHTAGS,
      update: (data) => data.allHashtags.data
    }
  },
  mounted() {
    this.setPlayIndex(-1)
    document.onkeydown = this.keyDownHandler
    this.$once('hook:beforeDestroy', () => {
      document.onkeydown = null
    })
  },
  methods: {
    ...mapActions({
      setPlaying: 'setPlaying',
      setMuted: 'setMuted',
      setPlayIndex: 'setPlayIndex',
      setPlayIntent: 'setPlayIntent',
      setPlayPosition: 'setPlayPosition'
    }),
    playHandler() {
      this.isPlaying ? this.setPlaying(false) : this.setPlayIntent(true)
    },
    audioHandler() {
      this.setMuted(!this.isMuted)
    },
    keyDownHandler(e) {
      if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
        e.preventDefault()
        this.$refs.child.playNextHandler()
      } else if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
        e.preventDefault()
        this.$refs.child.playPrevHandler()
      } else if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault()
        this.setPlayPosition(this.playPosition - 1)
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault()
        this.setPlayPosition(this.playPosition + 1)
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        this.playHandler()
      } else if (e.key === 'm' || e.code === 'KeyM') {
        e.preventDefault()
        this.audioHandler()
      }
    }
  }
}
</script>
<style scoped>
.c-main {
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}
.c-main::-webkit-scrollbar {
  width: 0 !important;
}
</style>
