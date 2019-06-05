<template>
  <base-export-field-setter
    @update:visible="$emit('update:visible', $event)"
    @submit="$emit('submit', $event)"
    :title="title"
    :visible="visible"
    :uploading="uploading"
    :items="items"
    :loading="loading"
  />
</template>

<script>
import baseExportFieldSetter from './baseExportFieldSetter'

export default {
  components: {
    baseExportFieldSetter
  },
  props: {
    title: {
      type: String,
      default: '导出'
    },
    apiKey: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    uploading: {
      type: Boolean,
      default: false
    },
    api: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      items: []
    }
  },
  watch: {
    async visible(value) {
      if (!value) {
        this.items = []
      }
      if (!this.loading && value) {
        try {
          this.loading = true
          const res = await this.api({
            apiKey: this.apiKey
          })
          if (res.data.Code === 'CORRECT') {
            this.items = res.data.Data.map(({
              name, desc 
            }) => {
              return {
                key: name,
                label: desc
              }
            })
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>
