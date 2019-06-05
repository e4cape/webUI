<template>
  <base-export-field-setter
    @update:visible="$emit('update:visible', $event)"
    @submit="$emit('submit', $event)"
    :visible="visible"
    :uploading="uploading"
    :items="items"
  />
</template>

<script>
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  name: 'exportFieldSetter',
  components: {
    baseExportFieldSetter
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    uploading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped></style>
