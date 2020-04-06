<template>
  <div v-touch:swipe="swipeHandler">
    <post-item
      v-for="(post, index) in recentPosts"
      :key="post._id"
      :index="index"
      :code="post.code"
      :video="post.video"
      :poster="post.poster"
      class="relative z-10 w-full"
      @ended="endedHandler(index)"
    ></post-item>
    <div
      v-if="recentPosts[playIndex]"
      class="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center w-full h-20 mb-5 md:flex-row"
    >
      <div class="z-20 flex flex-col justify-center">
        <h1
          :class="{ 'scale-125': hashTagPreview }"
          class="mb-2 text-3xl font-bold leading-none text-center text-white duration-500 transform md:mb-1 sm:text-4xl text-shadow"
        >
          {{ hashTagPreview ? hashTagPreview : ' ' }}
        </h1>
        <span v-if="hashTagIndexPreview" class="mx-auto -mb-5 text-base text-center text-white text-shadow">
          {{ hashTagIndexPreview ? hashTagIndexPreview + ' posts' : playIndex + 1 + '/' + recentPosts.length }}
        </span>
      </div>
      <transition name="scale-in">
        <div v-show="!hashTagIndexPreview" :class="{ hidden: hashTagIndexPreview }" class="-ml-10 z-20">
          <div class="inset-y-0 flex items-center md:absolute -mb-2">
            <client-only>
              <radial-progress-bar
                class="mx-auto"
                :stroke-width="4"
                :inner-stroke-color="'rgba(44,62,80,0)'"
                :diameter="recentPosts.length > 99 ? 60 : 52"
                :start-color="'#ffffff'"
                :stop-color="'rgba(255,255,255,0.51)'"
                :completed-steps="progress"
                :total-steps="100"
                :animate-speed="500"
              >
                <p class="mb-px text-xs text-white text-shadow">
                  {{ playIndex + 1 + '/' + recentPosts.length }}
                </p>
              </radial-progress-bar>
            </client-only>
            <div class="ml-1 text-xl">
              <span class="relative z-20 block text-white cursor-pointer" @click="playPrevHandler">↑</span>
              <span class="relative z-20 block text-white cursor-pointer" @click="playNextHandler">↓</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ALL_POSTS from '~/apollo/queries/ALL_POSTS'
import UPDATE_POST from '~/apollo/mutations/UPDATE_POST'
import PostItem from '~/components/PostItem'
import RadialProgressBar from '~/components/RadialProgressBar'

export default {
  components: { PostItem, RadialProgressBar },
  props: {
    hashTagPreview: {
      type: String,
      default: ''
    },
    hashTagIndexPreview: {
      type: String,
      default: ''
    }
  },
  async asyncData({ app }) {
    const client = app.apolloProvider.defaultClient
    return await client
      .query({
        query: ALL_POSTS
      })
      .then(({ data }) => {
        const promises = []
        for (let i = 0; i < data.allPosts.data.length; i++) {
          const post = data.allPosts.data[i]
          promises.push(
            app.$axios.get(post.video).catch(async () => {
              return await app.$axios.$get(`https://www.instagram.com/p/${post.code}/?__a=1`).then(async (res) => {
                const id = post._id
                const data2 = {
                  code: post.code,
                  type: post.type,
                  video: res.graphql.shortcode_media.video_url,
                  poster: res.graphql.shortcode_media.display_url
                }

                return await client
                  .mutate({
                    mutation: UPDATE_POST,
                    variables: { id, data: data2 }
                  })
                  .then((data3) => {
                    data.allPosts.data[i].poster = data3.data.updatePost.poster
                    data.allPosts.data[i].video = data3.data.updatePost.video
                  })
              })
            })
          )
        }

        return Promise.all(promises).then(() => {
          return { posts: data.allPosts.data }
        })
      })
  },
  transition: 'fade',
  data() {
    return {
      posts: null,
      tolerancePause: false
    }
  },
  computed: {
    ...mapGetters({ playIndex: 'playIndex', progress: 'progress' }),
    recentPosts() {
      return this.posts.slice(0).reverse()
    }
  },
  apollo: {
    postsUpdate: {
      query: ALL_POSTS,
      manual: true,
      prefetch: false,
      result(res) {
        this.posts = res.data.allPosts.data
      }
    }
  },
  mounted() {
    this.$apollo.queries.postsUpdate.setOptions({
      fetchPolicy: 'cache-and-network',
      pollInterval: 300000
    })
    this.$nextTick(() => {
      this.setPlayIndex(0)
    })
  },
  methods: {
    ...mapActions({ setPlayIndex: 'setPlayIndex' }),
    endedHandler(index) {
      this.setPlayIndex(index + 1 < this.recentPosts.length ? index + 1 : 0)
    },
    playPrevHandler() {
      this.setPlayIndex(this.playIndex - 1 > -1 ? this.playIndex - 1 : this.recentPosts.length - 1)
    },
    playNextHandler() {
      this.setPlayIndex(this.playIndex + 1 < this.recentPosts.length ? this.playIndex + 1 : 0)
    },
    swipeHandler(direction) {
      if (direction === 'bottom') this.playPrevHandler()
      if (direction === 'top') this.playNextHandler()
    }
  },
  head() {
    return {
      title: 'Instaplay - Share Instagram video playlists with your loved ones!'
    }
  }
}
</script>
