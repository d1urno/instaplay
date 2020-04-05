<template>
  <!-- Form -->
  <form id="form" class="px-6 py-3 text-sm text-clay" name="contactForm" @submit.prevent="sendEmail($event)">
    <div>
      <div class="flex">
        <p class="w-full mr-3 text-sm">
          <label class="block mb-0" for="floatName">
            Name
          </label>
          <input
            id="floatName"
            v-model="form.name"
            name="name"
            type="text"
            required
            class="block w-full p-2 mb-2 text-gray-700 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:bg-white"
          />
        </p>
        <p class="w-full mb-1 md:text-sm md:mb-0">
          <label class="block mb-0" for="floatEmail">
            E-mail
          </label>
          <input
            id="floatEmail"
            v-model="form.email"
            type="email"
            name="email"
            required
            class="block w-full p-2 mb-2 text-gray-700 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:bg-white"
          />
        </p>
      </div>
      <p class="w-full mb-1 md:text-sm md:mb-0">
        <label class="block mb-0" for="floatMessage">
          Message
        </label>
        <textarea
          id="floatMessage"
          v-model="form.message"
          name="message"
          required
          rows="5"
          class="block w-full p-2 text-gray-700 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:bg-white"
          maxlength="4000"
        />
      </p>
      <p class="my-4 text-center md:text-sm md:my-2">
        <button
          type="submit"
          class="w-full rounded-lg button--green md:w-40 focus:outline-none focus:shadow-outline"
          name="send"
          value="Formulario Float"
        >
          SEND
        </button>
      </p>
    </div>
  </form>
</template>

<script>
import emailjs from 'emailjs-com'
export default {
  name: 'ContactForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    sendEmail(e) {
      this.$emit('send')
      emailjs.sendForm('mailjet', 'instaplay', e.target, process.env.emailJsUserId).then(
        (result) => {
          this.$toast.success('Message sent!', {
            duration: 5000,
            theme: 'bubble'
          })
          this.form = { name: '', email: '', message: '' }
        },
        (error) => {
          this.$toast.error('Ops! there was an error, please try again later...', {
            duration: 5000,
            theme: 'bubble'
          })
          console.log(error)
        }
      )
    }
  }
}
</script>
