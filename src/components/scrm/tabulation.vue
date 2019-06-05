<template>
  <div>
    <table class="vc-table">
      <tbody>
        <tr v-for="(isData, index) in data" :key="index">
          <template v-for="(item, index) in isData">
            <th :key="item.title">{{item.title || ''}}</th>
            <td v-if="item.type && (item.type == 'image' || item.type == 'img')" :colspan="item.colspan" :key="index">
              <template v-if="item.dataType && (item.dataType == 'array' || item.dataType == 'Array' || item.dataType == 'arr' || item.dataType == 'Arr')">
                <img v-for="(val, index) in item.content" :key="index" :src="$root.settings.DOMAIN_IMG_FILE + val">
              </template>
            </td>
            <td :colspan="item.colspan" :key="index" v-else>{{ item.content || ''}}</td>
          </template>
        </tr>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: new Array(),
      type: Array
    }
  }
}
</script>

<style scoped lang="scss">
$d: #ddd;
.vc-table {
  width: 100%;
  border: 1px solid $d;
  font-size: 12px;
  tr {
    border-bottom: 1px solid $d;
    th,
    td {
      border-right: 1px solid $d;
      padding: 8px 10px;
      line-height: 18px;
      max-width: 350px;
    }
    th {
      height: 32px;
      text-align: center;
      background: #f5f5f5;
      min-width: 100px;
      .asterisk {
        color: red;
      }
    }
    td {
      min-width: 150px;
      word-wrap: break-word;
      img {
        margin: auto;
        width: 200px;
        margin-right: 10px;
      }
      p {
        text-align: center;
        margin-top: 5px;
      }
    }
  }
  .vc-table-tdsp {
    padding: 10px;
  }
}
</style>
