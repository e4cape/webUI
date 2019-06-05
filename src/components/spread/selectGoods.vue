<template>
  <el-dialog title="选择商品" width="960px" :visible.sync="visible">
    <template v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-row class="tc" style="margin: 20px 0;">
        <el-steps finish-status="success" :active="selecteds.length + 1" simple>
          <el-step title="选择商品"></el-step>
          <el-step :title="activeType === 'bargain'? '设置砍价' : activeType === 'spellGroup'? '设置拼团' : '设置秒杀'"></el-step>
        </el-steps>
      </el-row>
      <el-form :model="queryForm" label-position="right" label-width="110px" class="list-query-form no-border-bottom" v-if="!selecteds.length">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字：">
              <el-input name="ProductName" v-model="queryForm.ProductName" :maxlength="50" @keyup.enter.native="search" placeholder="商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="activeType == 'spellGroup'">
            <el-form-item label="商品类型：">
              <el-select name="ProductType" v-model="queryForm.ProductType" placeholder="全部" :filterable="true">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in productType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品分类：">
              <el-select name="PrimeType" v-model="queryForm.PrimeType" placeholder="全部" :filterable="true">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in productBasicPrimeType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: center;">
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <template v-if="!selecteds.length">
        <el-table :data="data" @sort-change="sortchange" v-loading="tableLoading" key="dataList">
          <el-table-column prop="ProductId" label="商品编码" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductType" label="商品类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{productType.Types[scope.row.ProductType]}}</template>
          </el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="100" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.LabelPrice}}</template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="100" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.SalePrice}}</template>
          </el-table-column>
          <el-table-column prop="AvailableQty" label="库存" width="100" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column label="商品分类" width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{productBasicPrimeType.Types[scope.row.PrimeType]}}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button name="btnSelect" type="text" @click="selectGood(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- @module 分页组件 -->
        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        <!-- End 分页组件 -->
      </template>
      <template v-else>
        <el-table :data="selecteds" border>
          <el-table-column prop="ProductId" label="商品编码" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductType" label="商品类型" width="100" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">{{productType.Types[scope.row.ProductType]}}</template>
          </el-table-column>
          <el-table-column prop="AvailableQty" label="库存" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="80" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.LabelPrice}}</template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="100" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.SalePrice}}</template>
          </el-table-column>
          <el-table-column class-name="hd-required" prop="SeckillPrice" label="秒杀价" width="100" v-if="activeType === 'seckill'">
            <template slot-scope="scope">
              <el-input name="SeckillPrice" :maxlength="9" v-model="scope.row.SeckillPrice" @keyup.native="scope.row.SeckillPrice = $root.toFixed(scope.row.SeckillPrice, 2)"></el-input>
            </template>
          </el-table-column>
          <el-table-column class-name="hd-required" prop="CreateTime" label="秒杀时间" width="260" v-if="activeType === 'seckill'">
            <template slot-scope="scope">
              <el-date-picker
                name="CreateTime"
                v-model="scope.row.CreateTime"
                align="right"
                :unlink-panels="true"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="pickerOptions"
                style="width: 100%; height: 100%;"
              ></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column class-name="hd-required" prop="TeamQty" label="成团人数/团" width="100" v-if="activeType === 'spellGroup'">
            <template slot-scope="scope">
              <div>
                <el-input name="TeamQty" :maxlength="9" v-model="scope.row.TeamQty" @keyup.native="scope.row.TeamQty = $root.toFixed(scope.row.TeamQty, 0)"></el-input>
              </div>
              <div v-if="twoGroup">
                <el-input name="TeamQty1" :maxlength="9" v-model="scope.row.TeamQty1" @keyup.native="scope.row.TeamQty1 = $root.toFixed(scope.row.TeamQty1, 0)"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column class-name="hd-required" prop="MemberPrice" label="成员拼团价" width="100" v-if="activeType === 'spellGroup'">
            <template slot-scope="scope">
              <div>
                <el-input name="MemberPrice" :maxlength="9" v-model="scope.row.MemberPrice" @keyup.native="scope.row.MemberPrice = $root.toFixed(scope.row.MemberPrice, 2)"></el-input>
              </div>
              <div v-if="twoGroup">
                <el-input name="MemberPrice1" :maxlength="9" v-model="scope.row.MemberPrice1" @keyup.native="scope.row.MemberPrice1 = $root.toFixed(scope.row.MemberPrice1, 2)"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column class-name="hd-required" prop="ChiefPrice" label="团长拼团价" width="100" v-if="activeType === 'spellGroup'">
            <template slot-scope="scope">
              <div>
                <el-input name="ChiefPrice" :maxlength="9" v-model="scope.row.ChiefPrice" @keyup.native="scope.row.ChiefPrice = $root.toFixed(scope.row.ChiefPrice, 2)"></el-input>
              </div>
              <div v-if="twoGroup">
                <el-input name="ChiefPrice1" :maxlength="9" v-model="scope.row.ChiefPrice1" @keyup.native="scope.row.ChiefPrice1 = $root.toFixed(scope.row.ChiefPrice1, 2)"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" v-if="activeType === 'spellGroup'">
            <template slot-scope="scope" :data="scope">
              <!--不写scope，不显示下面内容-->
              <div v-if="!twoGroup" class="action-icon">
                <i name="btnTwoGroup" class="el-icon-circle-plus" @click="twoGroup = true"></i>
              </div>
              <div v-else class="action-icon m-t-35">
                <i name="btnTwoGroupChange" class="el-icon-remove" @click="twoGroupChange"></i>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="AvailablePrice" :render-header="privateHeader" class-name="hd-required" width="110" v-if="activeType === 'bargain'">
            <template slot-scope="scope">
              <el-input name="AvailablePrice" :maxlength="9" v-model="scope.row.AvailablePrice" @keyup.native="scope.row.AvailablePrice = $root.toFixed(scope.row.AvailablePrice, 2)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="SelfAmt" label="自砍次数(次）" class-name="hd-required" width="140" v-if="activeType === 'bargain'">
            <template slot-scope="scope">
              <el-input name="SelfAmt" :maxlength="9" v-model="scope.row.SelfAmt"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="SelfPrice" label="自砍金额（元）" class-name="hd-required" width="140" v-if="activeType === 'bargain'">
            <template slot-scope="scope">
              <el-input name="SelfPrice1" :maxlength="9" v-model="scope.row.SelfPrice1" @keyup.native="scope.row.SelfPrice1 = $root.toFixed(scope.row.SelfPrice1, 2)" style="width: 50px"></el-input>-
              <el-input name="SelfPrice2" :maxlength="9" v-model="scope.row.SelfPrice2" @keyup.native="scope.row.SelfPrice2 = $root.toFixed(scope.row.SelfPrice2, 2)" style="width: 50px"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="HelpPrice" class-name="hd-required" label="好友帮砍金额（元）" width="160" v-if="activeType === 'bargain'">
            <template slot-scope="scope">
              <el-input name="HelpPrice1" :maxlength="9" v-model="scope.row.HelpPrice1" @keyup.native="scope.row.HelpPrice1 = $root.toFixed(scope.row.HelpPrice1, 2)" style="width: 50px"></el-input>-
              <el-input name="HelpPrice2" :maxlength="9" v-model="scope.row.HelpPrice2" @keyup.native="scope.row.HelpPrice2 = $root.toFixed(scope.row.HelpPrice2, 2)" style="width: 50px"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddGoods" type="primary" @click="addGoods" :loading="$store.getters.is_loading" v-if="selecteds.length">确定</el-button>
        <el-button btn="btnCancel" @click="visible =  false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import pagination from '@/components/pagination'
import {
  ProductBasicPrimeType, ProductType
} from '@/enums/spread'
import { YNStatus } from '@/enums/common'
import {
  SPREAD_API_SPR_SEARCH
} from '@/apis/spread'
export default {
  props: {
    selectGoodsVisible: {
      default: false,
      type: Boolean
    },
    activeType: {
      default: '',
      type: String
    },
    activeTime: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      productType: ProductType,
      visible: this.selectGoodsVisible,
      productBasicPrimeType: ProductBasicPrimeType,
      tableLoading: false,
      twoGroup: false,
      queryForm: {
        ProductName: '',
        PrimeType: 0,
        ProductType: 0,
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      queryParameters: {
        ProductName: '',
        PrimeType: 0
      },
      selecteds: [],
      data: [],
      total: 0,
      pickerOptions: {
        disabledDate(date) {
          let now = new Date()
          return (
            Date.parse(date) <
            Date.parse(
              now.getFullYear() +
              '/' +
              (now.getMonth() + 1) +
              '/' +
              now.getDate()
            )
          )
        }
      }
    }
  },
  methods: {
    privateHeader(createElement) {
      return createElement('span', [
        createElement('span', {
        }, ['可砍金额']),
        createElement(
          'el-tooltip',
          {
            attrs: {
              placement: 'top',
              effect: 'light',
              class: 'el-icon-question',
              content:
                '在售价的基础上拿出来用于砍价的金额，砍完不能再砍以确保商品利润，需小于售价。'
            }
          },
          [
            createElement(
              'i',
              {
                attrs: {
                  style: 'margin-left:5px;'
                }
              },
              ['']
            )
          ]
        )
      ])
    },
    getData() {
      this.queryForm = Object.assign(this.queryForm, this.queryParameters)
      this.tableLoading = true
      let productType = this.activeType == 'spellGroup' ? this.queryForm.ProductType : ProductType.Entity // 区分商品类型，拼团给0
      SPREAD_API_SPR_SEARCH(Object.assign(this.queryForm, {
        IsAvailableQty: YNStatus.Yes, ProductType: productType
      })).then(res => { // IsAvailableQty 0 不去除0库存，1去除零库存
        this.tableLoading = false
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    search() {
      this.queryForm.PageIndex = 1
      this.queryParameters = Object.assign({
      }, this.queryForm)
      this.getData()
    },
    currentChange(val) {
      this.queryParameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      if (this.queryForm.PageSize !== val) {
        this.queryParameters.PageIndex = 1
        this.queryParameters.PageSize = val
        this.getData()
      }
    },
    sortchange(sort) {
      switch (sort.prop) {
        case 'LabelPrice':
          this.queryForm.OrderBy = 1
          break
        case 'SalePrice':
          this.queryForm.OrderBy = 2
          break
        case 'AvailableQty':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
    },
    selectGood(row) {
      let obj = {
      }
      switch (this.activeType) {
        case 'seckill':
          obj.SeckillPrice = ''
          obj.CreateTime = this.activeTime
          break
        case 'spellGroup':
          obj.TeamQty = 5
          obj.MemberPrice = row.SalePrice
          obj.ChiefPrice = row.SalePrice
          break
        case 'bargain':
          obj.AvailablePrice = ''
          obj.SelfAmt = 1
          obj.SelfPrice1 = ''
          obj.SelfPrice2 = ''
          obj.HelpPrice1 = ''
          obj.HelpPrice2 = ''
          break
        default:
      }
      this.selecteds = [
        Object.assign({
        }, row, obj)
      ]
    },
    addGoods() {
      let data = this.selecteds[0]
      let error = false
      switch (this.activeType) {
        case 'seckill':
          if (
            !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.SeckillPrice) ||
            parseFloat(data.SeckillPrice) === 0
          ) {
            this.$message.warning('请输入大于0的秒杀价！')
            error = true
            break
          } else if (parseFloat(data.SalePrice) < parseFloat(data.SeckillPrice)) {
            this.$message.warning('请输入小于售价的秒杀价！')
            error = true
            break
          }
          if (!data.CreateTime) {
            this.$message.warning('请设定秒杀时间！')
            error = true
          } else {
            let start = Date.parse(this.activeTime[0])
            let end = Date.parse(this.activeTime[1])
            if (
              Date.parse(data.CreateTime[0]) < start ||
              Date.parse(data.CreateTime[1]) > end
            ) {
              this.$message.warning('商品秒杀时间必须在活动有效时间范围内！')
              error = true
            } else if (
              Date.parse(data.CreateTime[0]) === Date.parse(data.CreateTime[1])
            ) {
              this.$message.warning('开始时间不能等于结束时间！')
              error = true
            }
          }
          break
        case 'spellGroup':
          if (data.TeamQty || data.MemberPrice || data.ChiefPrice) {
            if (data.TeamQty && (parseInt(data.TeamQty) > 10 || parseInt(data.TeamQty) < 2) || (data.TeamQty1 && (parseInt(data.TeamQty1) > 10 || parseInt(data.TeamQty1) < 2))) {
              this.$message.warning('请输入2-10的拼团人数！')
              error = true
              break
            }
            if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.MemberPrice)) {
              this.$message.warning('请输入大于0成员拼团价！')
              error = true
              break
            } else if (data.MemberPrice > data.SalePrice || (data.TeamQty1 && data.MemberPrice1 > data.SalePrice) || data.ChiefPrice > data.SalePrice || (data.TeamQty1 && data.ChiefPrice1 > data.SalePrice)) {
              this.$message.warning('拼团价不能大于售价！')
              error = true
              break
            }
            if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.ChiefPrice)) {
              this.$message.warning('请输入大于0团长拼团价！')
              error = true
              break
            }
          }
          if (data.TeamQty1 || data.MemberPrice1 || data.ChiefPrice1) {
            if (!/^[1-9]+\d*$/.test(data.TeamQty1) || parseInt(data.TeamQty1) < 2) {
              this.$message.warning('请输入大于2的成团人数！')
              error = true
              break
            }
            if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.MemberPrice1)) {
              this.$message.warning('请输入非负成员拼团价！')
              error = true
              break
            }
            if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.ChiefPrice1)) {
              this.$message.warning('请输入非负团长拼团价！')
              error = true
              break
            }
          }
          if (
            (!data.TeamQty || !data.MemberPrice || !data.ChiefPrice) && (!data.TeamQty1 || !data.MemberPrice1 || !data.ChiefPrice1)
          ) { // 必须得有一组完整数据
            this.$message.warning('请设定拼团数据！')
            error = true
            break
          } else if (data.TeamQty && data.TeamQty1 && parseInt(data.TeamQty) === parseInt(data.TeamQty1)) {
            this.$message.warning('不能创建两个相同的拼团人数！')
            error = true
            break
          } else if (data.TeamQty && (parseFloat(data.ChiefPrice) <= 0 || parseFloat(data.MemberPrice) <= 0)) {
            this.$message.warning(data.TeamQty + '人团的拼团价不能为零！')
            error = true
            break
          } else if (data.TeamQty1 && (parseFloat(data.ChiefPrice1) <= 0 || parseFloat(data.MemberPrice1) <= 0)) {
            this.$message.warning(data.TeamQty1 + '人团的拼团价不能为零！')
            error = true
            break
          } else {
            data.TeamSettings = []
            if (data.TeamQty && data.MemberPrice && data.ChiefPrice) {
              data.TeamSettings.push({
                TeamQty: data.TeamQty,
                MemberPrice: data.MemberPrice,
                ChiefPrice: data.ChiefPrice
              })
            }
            if (data.TeamQty1 && data.MemberPrice1 && data.ChiefPrice1) {
              data.TeamSettings.push({
                TeamQty: data.TeamQty1,
                MemberPrice: data.MemberPrice1,
                ChiefPrice: data.ChiefPrice1
              })
            }
          }
          break
        case 'bargain':
          if (!/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.AvailablePrice)) {
            this.$message.warning('请输入可砍金额！')
            error = true
            break
          } else if (parseFloat(data.AvailablePrice) >= data.SalePrice) {
            this.$message.warning('可砍金额必须小于售价！')
            error = true
            break
          } else {
            if (!/^[1-9]\d*$/.test(data.SelfAmt)) {
              this.$message.warning('请输入正整数的可砍次数！')
              error = true
              break
            }
            if (
              !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.SelfPrice1) ||
              !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.SelfPrice2)
            ) {
              this.$message.warning('请输入自砍金额范围！')
              error = true
              break
            } else if (
              parseFloat(data.SelfPrice1) > parseFloat(data.SelfPrice2)
            ) {
              this.$message.warning('自砍金额起始值不能大于结束值范围！')
              error = true
              break
            } else if (
              parseFloat(data.SelfPrice2) > parseFloat(data.AvailablePrice)
            ) {
              this.$message.warning('自砍金额结束值不能大于可砍金额！')
              error = true
              break
            } else if (parseFloat(data.SelfPrice1) <= 0) {
              this.$message.warning('砍价范围要大于0')
              error = true
              break
            }
            if (
              !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.HelpPrice1) ||
              !/^(\d+\.\d{1,2}|[1-9][0-9]*)$/.test(data.HelpPrice2)
            ) {
              this.$message.warning('请输入好友帮砍金额范围！')
              error = true
              break
            } else if (
              parseFloat(data.HelpPrice1) > parseFloat(data.HelpPrice2)
            ) {
              this.$message.warning('好友帮砍金额起始值不能大于结束值范围！')
              error = true
              break
            } else if (
              parseFloat(data.HelpPrice2) > parseFloat(data.AvailablePrice)
            ) {
              this.$message.warning('好友帮砍金额结束值不能大于可砍金额！')
              error = true
              break
            } else if (parseFloat(data.HelpPrice1) <= 0) {
              this.$message.warning('砍价范围要大于0')
              error = true
              break
            }
          }
          break
        default:
          break
      }
      if (error) {
        return
      }
      if (!data.TeamQty && data.TeamQty1) {
        data.TeamQty = data.TeamQty1
        data.MemberPrice = data.MemberPrice1
        data.ChiefPrice = data.ChiefPrice1
        data.TeamQty1 = ''
        data.MemberPrice1 = ''
        data.ChiefPrice1 = ''
      }
      this.$emit('listenSelectGoods', true, data)
    },
    twoGroupChange() {
      this.selecteds[0].ChiefPrice1 = ''
      this.selecteds[0].TeamQty1 = ''
      this.selecteds[0].MemberPrice1 = ''
      this.twoGroup = false
    }
  },
  beforeMount() {
    this.getData()
  },
  watch: {
    visible() {
      this.$emit('listenSelectGoods', false)
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.list-query-form {
  height: auto;
  border: 1px solid #ebeef5;
  border-bottom: 0;
  padding: 10px 0;
}
.el-table {
  border-left: 1px solid #ebeef5;
}
.pagination {
  margin-bottom: 0;
  padding: 0;
}
/deep/ .action-icon {
  margin-top: 5px;
  &.m-t-35 {
    margin-top: 35px;
  }
  i {
    font-size: 20px;
    color: #409eff;
  }
}
</style>