<template>
  <div v-if="poster.length && video.length">
    <p v-if="errored" class="w-full py-10 text-center text-white">Video {{ index + 1 }} is not available!</p>
    <div class="relative" :class="{ 'h-0': errored }">
      <video
        playsinline=""
        preload="none"
        :poster="poster"
        :src="video"
        type="video/mp4"
        class="h-screen mx-auto"
      ></video>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PostItem',
  props: {
    index: {
      type: Number,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    video: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      errored: false
    }
  },
  computed: {
    ...mapGetters({
      playIndex: 'playIndex',
      isPlaying: 'isPlaying',
      isMuted: 'isMuted',
      playIntent: 'playIntent',
      playPosition: 'playPosition'
    }),
    getVidElement() {
      return document.getElementsByTagName('video')[this.index]
    }
  },
  watch: {
    playIndex(value, oldValue) {
      if (value !== this.index) {
        this.getVidElement.pause()
      }
      if (value === this.index) this.playVideo(oldValue !== -1)
    },
    playIntent(value) {
      if (value && this.playIndex === this.index) {
        this.playVideo(true)
      }
    },
    isMuted(value) {
      this.getVidElement.muted = value
    },
    isPlaying(value) {
      if (value) {
        this.setPlayIntent(false)
      } else if (this.playIndex === this.index) {
        this.getVidElement.pause()
      }
    },
    playPosition(value, oldValue) {
      if (this.playIndex === this.index) {
        this.getVidElement.currentTime =
          value > oldValue ? this.getVidElement.currentTime + 2 : this.getVidElement.currentTime - 2
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getVidElement.muted = this.isMuted

      this.getVidElement.onerror = () => {
        this.errored = true
      }
      this.getVidElement.onplay = () => {
        if (this.playIndex !== this.index) {
          this.setPlayIndex(this.index)
          return
        }
        this.setPlaying(true)
      }
      this.getVidElement.onpause = () => {
        if (this.playIndex === this.index) {
          this.setPlaying(false)
        }
      }
      this.getVidElement.ontimeupdate = () => {
        const progress = Math.floor((100 / this.getVidElement.duration) * this.getVidElement.currentTime)
        this.setProgress(progress)
      }
      this.getVidElement.onended = () => {
        this.$emit('ended')
      }
      this.getVidElement.onvolumechange = () => {
        this.setMuted(this.getVidElement.muted)
      }
    })
    this.$once('hook:beforeDestroy', () => {
      this.getVidElement.onerror = null
      this.getVidElement.onplay = null
      this.getVidElement.onpause = null
      this.getVidElement.ontimeupdate = null
      this.getVidElement.onended = null
      this.getVidElement.onvolumechange = null
    })
  },
  methods: {
    ...mapActions({
      setPlayIndex: 'setPlayIndex',
      setPlaying: 'setPlaying',
      setMuted: 'setMuted',
      setPlayIntent: 'setPlayIntent',
      setProgress: 'setProgress'
    }),
    playVideo(transition) {
      this.getVidElement.scrollIntoView({
        block: 'center',
        behavior: transition ? 'smooth' : 'auto'
      })
      const promise = this.getVidElement.play()
      if (promise !== undefined) {
        promise
          .then(() => {
            this.setPlaying(true)
          })
          .catch((error) => {
            console.log(error)
            if (error.code === DOMException.NOT_SUPPORTED_ERR) {
              this.playNext()
            }
          })
      }
    },
    playNext() {
      this.setPlayIndex(this.index + 1)
    }
  }
}
</script>
