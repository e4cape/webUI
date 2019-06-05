<template>
  <div v-show="visible" @click="closePhoto" name="btnClosePhoto">
    <div id="outerdiv" class="outerdiv">
      <img id="bigimg" :src="imgSrc" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
      default: ''
    }
  },
  methods: {
    closePhoto() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.outerdiv {
  text-align: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(000, 000, 000, 0.5);
}
.outerdiv #bigimg {
  height: auto;
  width: 50%;
  border: 0;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
