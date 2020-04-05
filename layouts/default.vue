<template>
  <div>
    <nuxt />
  </div>
</template>

<style>
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  min-width: 360px;
  background: #949c4e;
  background: linear-gradient(155deg, rgba(86, 216, 228, 1) 10%, rgba(159, 1, 234, 1) 90%);
  @apply min-h-screen;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.nuxt-link-exact-active {
  @apply font-bold duration-500;
}

button:active,
.c-link:active {
  transform: scale(0.9);
  @apply transition-transform duration-200;
}

.button--green {
  text-decoration: none;
  @apply py-1 transition-colors duration-300 border shadow-md border-clay text-clay;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  @apply py-1 transition-colors duration-300 shadow-md;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  @apply transition ease-out transform scale-100 duration-500 opacity-100;
}

.scale-enter,
.scale-leave-to {
  @apply scale-110 opacity-25;
}

.scale-in-enter-active {
  @apply transition ease-out transform scale-100 duration-1000 opacity-100;
}

.scale-in-enter,
.scale-in-leave-to {
  @apply scale-75 opacity-25 -translate-x-5 origin-left;
}
</style>
