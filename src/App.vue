<template>
  <router-view class="container" v-loading.fullscreen.lock="$store.getters.full_loading"></router-view>
</template>

<style lang="scss">
@import './assets/sass/common.scss';
@import './assets/sass/theme.scss';
</style>
