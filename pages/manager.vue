<template>
  <div class="max-h-full px-5 overflow-y-auto">
    <div class="container mx-auto">
      <div class="flex items-baseline justify-center mt-2 md:fixed md:justify-start">
        <button class="mr-5 text-clay" @click="$router.go(-1)">← Back</button>
        <h1 class="z-20 mt-8 text-2xl font-bold text-clay md:mt-2 md:mb-5 lg:text-3xl md:text-left">
          Instaplay
        </h1>
      </div>
    </div>
    <div class="container flex flex-col mx-auto md:flex-row">
      <div class="w-full max-w-sm mx-auto my-10 md:order-2">
        <p class="w-full mb-2 text-xs text-center text-gray-200 lg:text-sm md:text-left">
          Get
          <a class="font-bold text-gray-200" href="https://www.instagram.com" rel="nofollow" target="_blank"
            >Instagram</a
          >
          video links from public accounts (feed only)<br />
          <!--          Or you can get feed and story video links from-->
          <!--          <a class="font-bold text-gray-200" href="https://www.insta-stories.com/en" rel="nofollow" target="_blank"-->
          <!--            >here</a-->
          <!--          >-->
        </p>

        <form class="vue-form" @submit.prevent="submit">
          <div class="error-message">
            <p v-show="!link.valid" class="absolute w-full">
              Please paste a valid Intagram link
            </p>
            <p v-show="!selection.valid">
              Please enter a valid Intagram hashtag
            </p>
          </div>

          <fieldset>
            <legend>Add Instagram video</legend>
            <div>
              <label class="label" for="id">Link <span class="text-red-500">*</span></label>
              <input
                id="id"
                v-model="link.value"
                type="text"
                name="id"
                required=""
                :class="{ id: link, error: !link.valid }"
              />
            </div>
            <div v-if="hashTags">
              <h4>Hashtag <span class="text-red-500">*</span></h4>
              <client-only>
                <v-select v-model="selection.hashTag" :options="hashTags" taggable>
                  <template #search="{attributes, events}">
                    <input class="vs__search" :required="!selection.hashTag" v-bind="attributes" v-on="events" />
                  </template>
                </v-select>
              </client-only>
            </div>
            <!--          <div>-->
            <!--            <label class="label" for="textarea">Message</label>-->
            <!--            <textarea-->
            <!--              id="textarea"-->
            <!--              v-model="message.text"-->
            <!--              class="message"-->
            <!--              name="textarea"-->
            <!--              :maxlength="message.maxlength"-->
            <!--            ></textarea>-->
            <!--            <span class="counter"-->
            <!--              >{{ message.text.length }} / {{ message.maxlength }}</span-->
            <!--            >-->
            <!--          </div>-->
            <div>
              <input type="submit" value="Add video" />
            </div>
          </fieldset>
        </form>
      </div>
      <div class="flex justify-center max-w-xl max-h-screen mx-auto md:order-1 md:w-7/12">
        <div class="flex-1 mt-8 mb-10 mr-5 overflow-y-auto bg-white shadow-md md:mt-20 md:mr-8">
          <table v-if="posts" class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="px-4 py-4 text-sm font-bold text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  Thumb
                </th>
                <th class="px-4 py-4 text-sm font-bold text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  Post
                </th>
                <th class="px-4 py-4 text-sm font-bold text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  HashTag
                </th>
                <th class="px-4 py-4 text-sm font-bold text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="post in recentPosts" :key="post._id" class="hover:bg-gray-200">
                <td class="px-4 py-4 border-b border-gray-200">
                  <img class="w-12" :src="post.poster.length ? post.poster : 'svg/no-image.svg'" alt="" />
                </td>
                <td class="px-4 py-4 border-b border-gray-200">
                  <span v-if="post.code === 'no-record'">no-record</span>
                  <a v-else :href="'https://www.instagram.com/p/' + post.code" target="_blank">{{ post.code }}</a>
                </td>
                <td class="px-4 py-4 border-b border-gray-200">
                  <a :href="'https://www.instagram.com/explore/tags/' + post.hashtag.label.slice(1)" target="_blank">{{
                    post.hashtag.label
                  }}</a>
                </td>
                <td class="px-4 py-4 border-b border-gray-200">
                  <!--                  <button-->
                  <!--                    class="px-3 py-1 mb-2 text-xs font-bold text-white bg-green-400 rounded hover:bg-green-500 focus:outline-none focus:shadow-outline"-->
                  <!--                  >-->
                  <!--                    View-->
                  <!--                  </button>-->
                  <button
                    class="px-4 py-1 text-xs font-bold text-white bg-red-400 rounded hover:bg-red-500 focus:outline-none focus:shadow-outline"
                    @click="deletePost(post._id, post.hashtag._id)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ALL_HASHTAGS from '~/apollo/queries/ALL_HASHTAGS'
import ALL_POSTS from '~/apollo/queries/ALL_POSTS'
import CREATE_POST from '~/apollo/mutations/CREATE_POST'
import DELETE_POST from '~/apollo/mutations/DELETE_POST'
// import UPDATE_POST from '~/apollo/mutations/UPDATE_POST'

export default {
  // Regular expression from W3C HTML5.2 input specification:
  // https://www.w3.org/TR/html/sec-forms.html#email-state-typeemail
  idRegExp: new RegExp(
    // eslint-disable-next-line no-useless-escape
    '(https?:\/\/(?:www\.)?instagram\.com\/p\/([^/?#&]+)).*'
  ),
  instaStoriesRegExp: new RegExp(
    // eslint-disable-next-line no-useless-escape
    '(https?:\/\/(?:scontent-)([^/?#&]+)).*'
  ),
  instaHashtagRegExp: new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^#[^~`!@#$%^&*\(\)\-\+={}\[\]:;"'<>\?,\./|\\\s]+$/
  ),
  transition: 'fade',
  data() {
    return {
      link: {
        value: '',
        valid: true
      },
      selection: {
        hashTag: null,
        valid: true
      },
      message: {
        text: '',
        maxlength: 255
      },
      video: '',
      poster: '',
      submitted: false,
      hashTags: null,
      posts: null
    }
  },
  computed: {
    recentPosts() {
      return this.posts.slice(0).reverse()
    }
  },
  watch: {
    // watching nested property
    'link.value'(value) {
      this.validate('link', value)
    },
    'selection.hashTag'(value) {
      this.validate('tag', value)
    }
  },
  apollo: {
    hashTags: {
      query: ALL_HASHTAGS,
      update: (data) => data.allHashtags.data
    },
    posts: {
      query: ALL_POSTS,
      update: (data) => data.allPosts.data
    }
  },
  methods: {
    // submit form handler
    submit() {
      if (!this.link.valid || !this.selection.valid) return
      this.submitted = true

      // console.log(this.selection.hashTag)

      // const create = []
      // const connect = []
      // const hashtag = {}
      //
      // for (let i = 0; i < this.selection.hashTag.length; i++) {
      //   console.log(this.selection.hashTag[i])
      //   if (!(this.selection.hashTag[i] instanceof Object)) {
      //     create.push({
      //       label: this.selection.hashTag[i]
      //     })
      //   } else {
      //     connect.push({ _id: this.selection.hashTag[i]._id })
      //   }
      // }
      //
      // if (create.length) hashtag.create = create
      // if (connect.length) hashtag.connect = connect

      const tempHashTag = this.selection.hashTag
      const link = Object.assign({}, this.link)
      this.selection.hashTag = null
      this.link.value = ''

      const hashtag = {}
      let label = ''
      !(tempHashTag instanceof Object)
        ? (hashtag.create = { label: tempHashTag }) && (label = tempHashTag)
        : (hashtag.connect = tempHashTag._id) && (label = tempHashTag.label)

      if (this.$options.idRegExp.test(link.value)) {
        const code = link.value.split('/')[4]
        this.$axios.$get(`https://www.instagram.com/p/${code}/?__a=1`).then((value) => {
          if (!value.graphql.shortcode_media.is_video) {
            alert('Not a video!')
            return
          }
          this.addPost(
            code,
            value.graphql.shortcode_media.video_url,
            value.graphql.shortcode_media.display_url,
            hashtag,
            label
          )
        })
      } else {
        this.addPost('no-record', link.value, '', hashtag, label)
      }
    },
    // validate by type and value
    validate(type, value) {
      if (type === 'link') {
        this.link.valid = !value || !value.length ? true : !!this.isId(value)
      } else if (type === 'tag') {
        this.selection.valid = !value || !value.length ? true : !!this.isTag(value)
      }
    },
    // check for valid Instagram post id
    isId(value) {
      return this.$options.idRegExp.test(value) || this.$options.instaStoriesRegExp.test(value)
    },
    // check for valid Instagram hashtag
    isTag(value) {
      return this.$options.instaHashtagRegExp.test(value)
    },
    addPost(code, video, poster, hashtag, label) {
      this.$apollo.mutate({
        mutation: CREATE_POST,
        variables: {
          data: { code, poster, video, type: 'INSTAGRAM', hashtag }
        },
        optimisticResponse: {
          createPost: {
            _id: '-1',
            poster,
            video,
            code,
            type: 'INSTAGRAM',
            hashtag: { _id: '-1', label, __typename: 'Hashtag' },
            __typename: 'Post'
          }
        },
        update: (store, { data: { createPost } }) => {
          const data = store.readQuery({ query: ALL_POSTS })
          data.allPosts.data.push(createPost)
          store.writeQuery({ query: ALL_POSTS, data })
        },
        refetchQueries: () => {
          return [{ query: ALL_HASHTAGS }]
        }
      })
    },
    deletePost(id, hashtag) {
      this.$apollo.mutate({
        mutation: DELETE_POST,
        variables: { id, disconnect: hashtag },
        optimisticResponse: {
          deletePost: {
            _id: id,
            hashtag: { _id: hashtag, __typename: 'Hashtag' },
            __typename: 'Post'
          }
        },
        update: (store) => {
          const data = store.readQuery({ query: ALL_POSTS })
          const index = data.allPosts.data.findIndex((element) => {
            return element._id === id
          })
          data.allPosts.data.splice(index, 1)
          store.writeQuery({ query: ALL_POSTS, data })
        }
      })
    }
  },
  head() {
    return {
      title: 'Instaplay - Manager - Add or remove video links from collections'
    }
  }
}
</script>
<style>
*,
*::after,
*::before {
  box-sizing: border-box;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  color: #2c3e50;
  text-decoration: none;
}

header {
  position: relative;
  height: 150px;
  padding-top: 100px;
}

header h1 {
  text-align: center;
  font-size: 2.4rem;
  font-weight: 300;
}

.vue-form {
  font-size: 16px;
  /*width: 500px;*/
  padding: 15px 30px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
  @apply mx-auto;
}
.vue-form fieldset {
  /*margin: 24px 0 0 0;*/
}
.vue-form legend {
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
}
.vue-form div {
  position: relative;
  margin: 20px 0;
}
.vue-form h4,
.vue-form .label {
  color: #94aab0;
  margin-bottom: 10px;
}
.vue-form .label {
  display: block;
}
.vue-form input,
.vue-form textarea,
.vue-form select,
.vue-form label {
  color: #2b3e51;
}
.vue-form input[type='text'],
.vue-form input[type='email'],
.vue-form textarea,
.vue-form select,
.vue-form legend {
  display: block;
  width: 100%;
  appearance: none;
}
.vue-form input[type='text'],
.vue-form input[type='email'],
.vue-form textarea,
.vue-form select {
  padding: 12px;
  border: 1px solid #cfd9db;
  background-color: #ffffff;
  border-radius: 0.25em;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
}
.vue-form input[type='text']:focus,
.vue-form input[type='email']:focus,
.vue-form textarea:focus,
.vue-form select:focus {
  outline: none;
  border-color: #2c3e50;
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.2);
}
.vue-form .select {
  position: relative;
}
.vue-form .select::after {
  content: '';
  position: absolute;
  z-index: 1;
  right: 16px;
  top: 50%;
  margin-top: -8px;
  display: block;
  width: 16px;
  height: 16px;
  background: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0D%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0D%0A%09%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20enable-background%3D%22new%200%200%2016%2016%22%20xml%3Aspace%3D%22preserve%22%3E%0D%0A%3Cg%3E%0D%0A%09%3Cpolygon%20fill%3D%22%232c3e50%22%20points%3D%220.9%2C5.5%203.1%2C3.4%208%2C8.3%2012.9%2C3.4%2015.1%2C5.5%208%2C12.6%20%09%22%2F%3E%0D%0A%3C%2Fg%3E%0D%0A%3C%2Fsvg%3E')
    no-repeat center center;
  pointer-events: none;
}
.vue-form select {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.vue-form select::-ms-expand {
  display: none;
}
.vue-form .vue-form-list {
  margin-top: 16px;
}
.vue-form .vue-form-list::after {
  clear: both;
  content: '';
  display: table;
}
.vue-form .vue-form-list li {
  display: inline-block;
  position: relative;
  user-select: none;
  margin: 0 26px 16px 0;
  float: left;
}
.vue-form input[type='radio'],
.vue-form input[type='checkbox'] {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
  opacity: 0;
  z-index: 2;
}
.vue-form input[type='radio'] + label,
.vue-form input[type='checkbox'] + label {
  padding-left: 24px;
}
.vue-form input[type='radio'] + label::before,
.vue-form input[type='radio'] + label::after,
.vue-form input[type='checkbox'] + label::before,
.vue-form input[type='checkbox'] + label::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -8px;
  width: 16px;
  height: 16px;
}
.vue-form input[type='radio'] + label::before,
.vue-form input[type='checkbox'] + label::before {
  border: 1px solid #cfd9db;
  background: #ffffff;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08);
}
.vue-form input[type='radio'] + label::before,
.vue-form input[type='radio'] + label::after {
  border-radius: 50%;
}
.vue-form input[type='checkbox'] + label::before,
.vue-form input[type='checkbox'] + label::after {
  border-radius: 0.25em;
}
.vue-form input[type='radio'] + label::after,
.vue-form input[type='checkbox'] + label::after {
  background-color: #2c3e50;
  background-position: center center;
  background-repeat: no-repeat;
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.4);
  display: none;
}
.vue-form input[type='radio'] + label::after {
  background-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0D%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0D%0A%09%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20enable-background%3D%22new%200%200%2016%2016%22%20xml%3Aspace%3D%22preserve%22%3E%0D%0A%3Ccircle%20fill%3D%22%23FFFFFF%22%20cx%3D%228%22%20cy%3D%228%22%20r%3D%223%22%2F%3E%0D%0A%3C%2Fsvg%3E');
}
.vue-form input[type='checkbox'] + label::after {
  background-image: url('data:image/svg+xml;charset=utf-8,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0D%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2018.1.1%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0D%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-%2F%2FW3C%2F%2FDTD%20SVG%201.1%2F%2FEN%22%20%22http%3A%2F%2Fwww.w3.org%2FGraphics%2FSVG%2F1.1%2FDTD%2Fsvg11.dtd%22%3E%0D%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0D%0A%09%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20enable-background%3D%22new%200%200%2016%2016%22%20xml%3Aspace%3D%22preserve%22%3E%0D%0A%3Cpolyline%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-miterlimit%3D%2210%22%20points%3D%225%2C8%207%2C10%2011%2C6%20%22%2F%3E%0D%0A%3C%2Fsvg%3E');
}
.vue-form input[type='radio']:focus + label::before,
.vue-form input[type='checkbox']:focus + label::before {
  box-shadow: 0 0 5px rgba(44, 151, 222, 0.6);
}
.vue-form input[type='radio']:checked + label::after,
.vue-form input[type='checkbox']:checked + label::after {
  display: block;
}
.vue-form input[type='radio']:checked + label::before,
.vue-form input[type='radio']:checked + label::after,
.vue-form input[type='checkbox']:checked + label::before,
.vue-form input[type='checkbox']:checked + label::after {
  animation: cd-bounce 0.3s;
}
.vue-form textarea {
  min-height: 120px;
  resize: vertical;
  overflow: auto;
}
.vue-form input[type='submit'] {
  border: none;
  background: #2c3e50;
  border-radius: 0.25em;
  padding: 12px 20px;
  color: #ffffff;
  font-weight: bold;
  float: right;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  appearance: none;
}
.no-touch .vue-form input[type='submit']:hover {
  background: #42a2e1;
}
.vue-form input[type='submit']:focus {
  outline: none;
  background: #2b3e51;
}
.vue-form input[type='submit']:active {
  transform: scale(0.9);
}
.vue-form .error-message {
  height: 25px;
  margin: 0px;
}
.vue-form .error-message p {
  background: #e94b35;
  color: #ffffff;
  font-size: 1.2rem;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border-radius: 0.25em;
  padding: 10px;
}
.vue-form .error {
  border-color: #e94b35 !important;
}
.vue-form .counter {
  background-color: #ecf0f1;
  position: absolute;
  right: 0px;
  top: 0px;
  font-size: 10px;
  padding: 4px;
}

@-webkit-keyframes cd-bounce {
  0%,
  100% {
    -webkit-transform: scale(1);
  }
  50% {
    -webkit-transform: scale(0.8);
  }
}
@-moz-keyframes cd-bounce {
  0%,
  100% {
    -moz-transform: scale(1);
  }
  50% {
    -moz-transform: scale(0.8);
  }
}
@keyframes cd-bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.8);
  }
}
.vs__selected-options {
  @apply my-0 !important;
}
</style>
