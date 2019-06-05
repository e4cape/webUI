<template>
  <div class="rank-btn-group" v-if="source.length > 1" :if="!disabled">
    <span
      name="btnSort"
      class="rank-btn"
      v-for="(iconObj, spanIndex) in icons"
      :key="spanIndex"
      :class="iconObj.text"
      @click.capture.stop="onSort(iconObj.sort, iconObj)"
    ></span>
  </div>
</template>

<script>
import {
  SortType
} from '@/enums/common'

export default {
  props: {
    disabled: false,
    index: {
      type: Number,
      required: true
    },
    // 用来排序的数据
    source: {
      type: Array,
      required: true
    },
    // 请求到服务器的函数
    sort: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    async onSort(func, iconObj) {
      try {
        this.toggleLoading()
        // const arr = func()
        const isSuccess = await this.sort(iconObj)
        if (isSuccess) {
          console.log(isSuccess)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.toggleLoading()
      }
    },
    toggleLoading() {
      this.$emit('update:loading', !this.loading)
    }
  },
  // watch: {
  //   index: {
  //     immediate: true,
  //     handler(newVal) {}
  //   }
  // },
  computed: {
    icons() {
      const {
        index, source 
      } = this
      const {
        length 
      } = source

      const func = sort => () => {
        const arr = source.slice()
        const pendingItem = arr.splice(index, 1)[0]
        const func = {
          first() {
            arr.unshift(pendingItem)
          },
          last() {
            arr.push(pendingItem)
          },
          prev() {
            arr.splice(index - 1, 0, pendingItem)
          },
          next() {
            arr.splice(index + 1, 0, pendingItem)
          }
        }
        func[sort]()
        return arr
      }
      const textRank = [
        {
          text: 'to-first',
          sort: func('first'),
          ope: SortType.First
        },
        {
          text: 'to-prev',
          sort: func('prev'),

          ope: SortType.Prev
        },
        {
          text: 'to-next',
          sort: func('next'),
          ope: SortType.Next
        },
        {
          text: 'to-last',
          sort: func('last'),
          ope: SortType.Last
        }
      ]

      if (index === 0) {
        return textRank.slice(2)
      } else if (index === length - 1) {
        return textRank.slice(0, 2)
      }
      return textRank
    }
  }
}
</script>

<style lang="scss" scoped>
.rank-btn-group {
  .rank-btn.to-first {
    background-image: url(~@/assets/images/to-first.png);
  }
  .rank-btn.to-prev {
    background-image: url(~@/assets/images/to-prev.png);
  }
  .rank-btn.to-next {
    background-image: url(~@/assets/images/to-next.png);
  }
  .rank-btn.to-last {
    background-image: url(~@/assets/images/to-last.png);
  }
  .rank-btn {
    display: inline-block;
    margin: 0 5px;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-position: 50%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
}
