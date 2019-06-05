<template>
  <div>
    <el-button class="fr m-b-10" @click="$router.back(-1)">返回</el-button>
    <el-table
      :data="dataList"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      style="width: 100%"
    >
      <el-table-column prop="title" label="礼品名称" min-width="240">
        <template slot-scope="scope">
          <img
            :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl"
            alt
            width="50"
            height="50"
            style="vertical-align:middle"
            class="m-r-5"
          >
          <span v-text="scope.row.giftName"></span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryPathText" label="分类" width="180"></el-table-column>
      <el-table-column prop="price" label="价格" width="180">
        <template slot-scope="scope">
          <p>
            {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}
            <span>{{scope.row.wholesalePrice || '-'}}</span>
          </p>
          <p>
            建议零售价：
            <span>{{scope.row.retailPrice || '-'}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="积分兑换" width="180">
        <template slot-scope="scope">
          <el-button name="btnOpenScore" v-if="!scope.row.score" @click="openExchange(scope.$index,'score')">开启积分兑换</el-button>
          <el-input name="score" v-model="scope.row.score" :maxlength="9" style="width: 100px!important;" @keyup.native="scope.row.score = $root.toFixed(scope.row.score, 0)" v-else></el-input>
          <i
            name="btnCloseScore"
            class="el-icon-close m-l-5"
            v-if="scope.row.score"
            @click="closeExchange(scope.$index,'score')"
            title="关闭兑换"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="goldenRice" label="礼金兑换" width="180">
        <template slot-scope="scope">
          <el-button
            name="btnOpenGoldenRice"
            v-if="!scope.row.goldenRice"
            @click="openExchange(scope.$index,'goldenRice')"
          >开礼金兑换</el-button>
          <el-input name="goldenRice" v-model="scope.row.goldenRice" :maxlength="9" style="width: 100px!important;" @keyup.native="scope.row.goldenRice = $root.toFixed(scope.row.goldenRice, 0)" v-else></el-input>
          <i
            name="btnCloseGoldenRice"
            class="el-icon-close"
            v-if="scope.row.goldenRice"
            @click="closeExchange(scope.$index,'goldenRice')"
            title="关闭兑换"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-10" v-if="!$store.getters.tb_loading">
      <el-button name="btnSubmit" type="primary" @click="submit" :loading="submitNow">{{submitNow ? '上架中' : '确定上架'}}</el-button>
      <el-button name="btnBack" @click="$router.back(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  GIFTING_API_GIFT_GETONSHELFBYAGENT,
  GIFTING_API_GIFT_BATCHOPERATIONBYAGENT
} from '@/apis/gifting.js'
export default {
  data() {
    return {
      dataList: [],
      submitNow: false
    }
  },
  methods: {
    initData() {
      if (!this.$route.query) {
        return
      }
      let params =
        this.$route.query.ids instanceof Array
          ? this.$route.query.ids
          : [this.$route.query.ids]
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_GIFT_GETONSHELFBYAGENT(params).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.dataList = res.data.Data
        }
      })
    },
    closeExchange(v, k) {
      this.dataList[v][k] = ''
    },
    submit() {
      let flag = this.dataList.some(v => !v.score && !v.goldenRice)
      let flagZero = this.dataList.some(v => v.score == 0 || v.goldenRice == 0)
      if (flag) {
        this.$message.error('兑换方式必选一项！')
        return
      } else if (flagZero) {
        this.$message.error('积分或者礼金兑换不能为0！')
        return
      }
      let params = this.dataList.map(v => {
        if (v.score && v.goldenRice) {
          return Object.assign(v, {
            scoreType: 3 
          })
        } else if (!v.score && v.goldenRice) {
          return Object.assign(v, {
            scoreType: 2 
          })
        } else if (v.score && !v.goldenRice) {
          return Object.assign(v, {
            scoreType: 1 
          })
        } else if (!v.score && !v.goldenRice) {
          return Object.assign(v, {
            scoreType: 0 
          })
        }
      })
      this.submitNow = true
      GIFTING_API_GIFT_BATCHOPERATIONBYAGENT({
        items: params,
        operationType: 0
      }).then(res => {
        this.submitNow = false
        if (res.data.Code === 'CORRECT') {
          this.$message.success('已成功上架')
          this.$router.push({
            path: '/gift/giftManage/index' 
          })
        }
      })
    },
    openExchange(v, k) {
      this.dataList[v][k] = 1
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .cell {
  .el-input-number {
    .el-input .el-input__inner {
      text-align: left;
    }
    .el-input-number__decrease,
    .el-input-number__increase {
      display: none;
    }
    &:hover .el-input-number__decrease,
    &:hover .el-input-number__increase {
      display: block;
    }
  }
  .el-icon-close {
    display: none;
    padding: 5px;
    color: #409eff;
    cursor: pointer;
  }
  &:hover .el-icon-close {
    display: inline-block;
  }
}
</style>
