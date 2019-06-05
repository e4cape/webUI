<template>
  <div class="content">
    <ul v-if="characterType != CharacterType.Supplier" class="tabs border-bottom-1px">
      <li name="tab0" class="tab" :class="{active: currentTab == 0}" @click="changeTabs(0)">单据打印模板</li>
      <li name="tab1" class="tab" :class="{active: currentTab == 1}" @click="changeTabs(1)">货品标签打印模板</li>
      <li name="tab2" class="tab" :class="{active: currentTab == 2}" @click="changeTabs(2)">旧货标签打印模板</li>
      <li name="tab3" class="tab" :class="{active: currentTab == 3}" @click="changeTabs(3)">质保单打印模板</li>
      <li name="tab4" class="tab" :class="{active: currentTab == 4}" @click="changeTabs(4)">电子质保单模板</li>
      <li name="tab5" class="tab" :class="{active: currentTab == 5}" @click="changeTabs(5)">电子标签模板</li>
    </ul>
    <div class="container">
      <div v-show="currentTab == 0" class="nav">
        <div class="tree-box">
          <el-tree ref="allTree" :data="allList" node-key="KeyId" default-expand-all highlight-current :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </div>
      <div class="main">
        <div v-if="characterType != CharacterType.Lingcb" class="sys-tpl">
          <div class="table-title">自定义模板</div>
          <ul class="template-list border-1px">
            <li v-for="item in storeTemplateList" :key="item.PrintingId">
              <div :class="{'template-item':true, 'default': item.IsDefault == YNStatus.Yes}">
                <div class="switch">
                  <el-tooltip :content="item.IsDefault==YNStatus.Yes?'默认模板不能停用':item.State==printState.Normal?'点击停用模板':'点击启用模板'" placement="top">
                    <el-switch
                      name="State"
                      v-model="item.State"
                      @change="changeState(item,0)"
                      active-color="#64bd63"
                      :disabled="item.IsDefault==YNStatus.Yes"
                      :active-value="printState.Normal"
                      :inactive-value="printState.Designing"
                    ></el-switch>
                  </el-tooltip>
                </div>
                <div class="t-name">{{item.PrintingName}}</div>
                <div class="p-t-20 text-center">
                  <span name="design" class="t-btn" @click="design(item, 0)">设计</span>
                  <span name="view" class="t-btn" @click="view(item, 0)">预览</span>
                  <span name="reName" class="t-btn" @click="reName(item, 0)">重命名</span>
                  <span name="copy" class="t-btn" v-if="item.State != printState.Designing" @click="copy($event,item.PrintingId, 1)">复制</span>
                  <span name="del" class="t-btn" v-show="item.IsDefault!=YNStatus.Yes" @click="del($event,item.PrintingId, 0)">删除</span>
                  <span name="setDefault" class="t-btn" v-if="item.IsDefault!=YNStatus.Yes && item.State != printState.Designing" @click="setDefault(item, 0)">设为默认</span>
                </div>
              </div>
            </li>
            <li>
              <div name="addTemplate" class="template-item last" @click="addTemplate(0)"></div>
            </li>
          </ul>
        </div>

        <div class="sys-tpl" v-loading="sysLoading">
          <div class="table-title">系统模板</div>
          <ul class="template-list border-1px">
            <template v-if="sysTemplateList">
              <li v-for="item in sysTemplateList" :key="item.PrintingId">
                <div :class="{'template-item':true, 'default': item.IsDefault == YNStatus.Yes}">
                  <div v-if="characterType == CharacterType.Lingcb" class="switch">
                    <el-tooltip :content="item.IsDefault==YNStatus.Yes?'默认模板不能停用':item.State==printState.Normal?'点击停用模板':'点击启用模板'" placement="top">
                      <el-switch
                        name="state"
                        v-model="item.State"
                        @change="changeState(item,1)"
                        active-color="#64bd63"
                        :disabled="item.IsDefault==YNStatus.Yes"
                        :active-value="printState.Normal"
                        :inactive-value="printState.Designing"
                      ></el-switch>
                    </el-tooltip>
                  </div>
                  <div class="t-name">{{item.PrintingName}}</div>
                  <div class="p-t-20 text-center">
                    <span name="design" class="t-btn" v-if="characterType == CharacterType.Lingcb" @click="design(item, 1)">设计</span>
                    <span name="view" class="t-btn" @click="view(item, 1)">预览</span>
                    <span name="reName" class="t-btn" v-if="characterType == CharacterType.Lingcb" @click="reName(item, 1)">重命名</span>
                    <span name="copy" class="t-btn" v-if="item.State != printState.Designing" @click="copy($event,item.PrintingId, 0)">复制</span>
                    <span name="del" class="t-btn" v-if="item.IsDefault!=YNStatus.Yes && characterType == CharacterType.Lingcb" @click="del($event,item.PrintingId, 1)">删除</span>
                    <span
                      name="setDefault"
                      class="t-btn"
                      v-if="item.IsDefault!=YNStatus.Yes&&characterType == CharacterType.Lingcb && item.State != printState.Designing"
                      @click="setDefault(item, 1)"
                    >设为默认</span>
                  </div>
                </div>
              </li>
            </template>
            <li>
              <div name="addTemplate" v-if="characterType == CharacterType.Lingcb" class="template-item last" @click="addTemplate(1)"></div>
            </li>
          </ul>
        </div>

        <div v-if="characterType == CharacterType.Lingcb" class="store-tpl p-t-20">
          <div class="table-title border-b-none">所有模板</div>
          <div class="search-box p-l-10 border-bottom-none">
            <el-form inline :model="storeSearchData" @submit.native.prevent>
              <!-- <el-form-item label="编码：">
                <el-input name="CharacterCode" v-model="storeSearchData.CharacterCode"></el-input>
              </el-form-item>-->
              <el-form-item label="名称：">
                <el-input name="CharacterName" @keyup.enter.native="search" v-model="storeSearchData.PrintingName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button name="search" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <ul class="template-list">
            <li v-for="item in storeTemplateList" :key="item.PrintingId">
              <div class="template-item">
                <div class="h-title">
                  <span>{{item.CompanyCode}}</span>
                  <span>{{item.CharacterCode}}-{{item.CharacterName}}</span>
                </div>
                <div class="t-name">{{item.PrintingName}}</div>
                <div class="p-t-20 text-center">
                  <span name="view" class="t-btn" @click="view(item)">预览</span>
                  <span name="copy" class="t-btn" @click="copy($event,item.PrintingId, 0)">复制</span>
                </div>
              </div>
            </li>
          </ul>
          <pagination :total="total" :pg="storeSearchData.PageIndex" :size="storeSearchData.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DOMAIN_PRINT } from '@/configs/appSettings.js'
import { StoreSettingPrintingState } from '@/enums/marketing.js'
import { YNStatus, CharacterType } from '@/enums/common'
import { SettingPrintingType } from '@/enums/merchant.js'
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import {
  MERCHANT_API_SETTING_PRINTING_GETS,
  MERCHANT_API_SETTING_PRINTING_SYSGETS,
  MERCHANT_API_SETTING_PRINTING_CREATE,
  MERCHANT_API_SETTING_PRINTING_DELETE,
  MERCHANT_API_SETTING_PRINTING_DEFAULT,
  MERCHANT_API_SETTING_PRINTING_DESIGN,
  MERCHANT_API_SETTING_PRINTING_NORMAL,
  MERCHANT_API_SETTING_PRINTING_COPY,
  MERCHANT_API_SETTING_PRINTING_UPDATE
} from '@/apis/merchant.js'
export default {
  components: {
    pagination,
    searchPanel
  },
  data () {
    return {
      YNStatus: YNStatus,
      printState: StoreSettingPrintingState,
      sysLoading: false,
      storeLoading: false,
      currentTab: 0,
      data: [],
      erpList: [
        {
          KeyId: 1,
          Value: 'ERP系统',
          children: []
        }
      ],
      giftList: [
        {
          KeyId: 2,
          Value: '礼品商城系统',
          children: []
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'Value'
      },
      sysTemplateList: [],
      storeTemplateList: [],
      storeSearchData: {
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      CharacterType,
      characterType: '',
      currPrintingType: '',
      allList: []
    }
  },
  created () {
    this.init()
    this.characterType = this.$store.getters['user_session'].CharacterType
  },
  methods: {
    changeTabs (state) {
      this.currentTab = state
      this.sysTemplateList = []
      this.storeTemplateList = []
      switch (state) {
        case 0:
          this.currPrintingType = 9201
          this.$refs['allTree'].setCurrentKey(9201)
          break
        case 1:
          this.currPrintingType = 9101
          break
        case 2:
          this.currPrintingType = 9243
          break
        case 3:
          this.currPrintingType = 9105
          break
        case 4:
          this.currPrintingType = 1101
          break
        case 5:
          this.currPrintingType = 9107
          break
        default:
      }
      this.getSysTemplate(this.currPrintingType)
      this.getStoreTemplate(this.currPrintingType, true)
    },
    getSysTemplate (id) {
      this.sysLoading = true
      MERCHANT_API_SETTING_PRINTING_SYSGETS({
        PageIndex: 1,
        PageSize: 1000,
        PrintingType: id,
        IsSys: this.YNStatus.Yes
      }).then(res => {
        this.sysLoading = false
        if (res.data.Code == 'CORRECT') {
          this.sysTemplateList = res.data.Data.Rows
        }
      })
    },
    getStoreTemplate (id, flag) {
      this.storeLoading = true
      // 搜索的时候将PageIndex置为1
      if (flag) {
        this.storeSearchData.PageIndex = 1
      }
      let page = {}
      if (this.characterType != CharacterType.Lingcb) {
        page.PageIndex = 1
        page.PageSize = 1000
      }
      this.storeSearchData = Object.assign({}, this.storeSearchData, page)
      let params = Object.assign(
        {},
        {
          PrintingType: id
        },
        this.storeSearchData
      )
      let api = MERCHANT_API_SETTING_PRINTING_GETS
      if (this.characterType == this.CharacterType.Lingcb) {
        api = MERCHANT_API_SETTING_PRINTING_SYSGETS
        params.IsSys = this.YNStatus.No
      }
      api(params).then(res => {
        this.storeLoading = false
        if (res.data.Code == 'CORRECT') {
          this.total = res.data.Data.Count
          this.storeTemplateList = res.data.Data.Rows
        }
      })
    },
    init () {
      let [erpArr, giftArr] = [[], []]
      SettingPrintingType.TypeArray.forEach(item => {
        if (item.Value.search('礼品') != -1) {
          giftArr.push(item)
        } else if (
          item.KeyId != SettingPrintingType.StockingCloudGoodsLabel &&
          item.KeyId != SettingPrintingType.MarketingCloudPaperQuality &&
          item.KeyId != SettingPrintingType.MarketingCloudElectronicQuality &&
          item.KeyId != SettingPrintingType.StockingCloudGoodsTags &&
          item.KeyId != SettingPrintingType.StockingCloudJunkPrintOrder
        ) {
          erpArr.push(item)
        }
      })
      this.erpList[0].children = erpArr
      this.giftList[0].children = giftArr
      if (this.characterType != CharacterType.Supplier) {
        this.allList = [
          this.erpList[0],
          this.giftList[0]
        ]
      } else {
        this.allList = [
          this.giftList[0]
        ]
      }
      this.getTemplate()
    },
    findFirst (arr) {
      if (arr[0].children) {
        return this.findFirst(arr[0].children)
      }
      return arr[0].KeyId
    },
    getTemplate () {
      this.$nextTick(function () {
        if (this.characterType != this.CharacterType.Supplier) {
          this.$refs.allTree.setCurrentKey(this.findFirst(this.erpList))
        } else {
          this.$refs.allTree.setCurrentKey(this.findFirst(this.giftList))
        }
        this.getSysTemplate(this.getCurrentPrintingType())
        this.getStoreTemplate(this.getCurrentPrintingType())
      })
    },
    getCurrentPrintingType () {
      if (this.currentTab == 0) {
        if (this.$refs.allTree) {
          return this.$refs.allTree.getCurrentKey()
        }
      } else {
        return this.currPrintingType
      }
    },
    handleNodeClick (data) {
      if (data.KeyId && !data.children) {
        this.getSysTemplate(data.KeyId)
        this.getStoreTemplate(data.KeyId)
      }
    },
    changeState (data, isSys) {
      if (data.State == this.printState.Normal) {
        MERCHANT_API_SETTING_PRINTING_NORMAL({
          PrintingId: data.PrintingId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message({
              type: 'success',
              message: res.data.Message
            })
            isSys
              ? this.getSysTemplate(this.getCurrentPrintingType())
              : this.getStoreTemplate(this.getCurrentPrintingType())
          }
        })
      } else {
        MERCHANT_API_SETTING_PRINTING_DESIGN({
          PrintingId: data.PrintingId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message({
              type: 'success',
              message: res.data.Message
            })
            isSys
              ? this.getSysTemplate(this.getCurrentPrintingType())
              : this.getStoreTemplate(this.getCurrentPrintingType())
          }
        })
      }
    },
    design (data) {
      window.open(
        DOMAIN_PRINT +
        '/Designer/index?PrintingId=' +
        data.PrintingId +
        '&PrintingType=' +
        data.PrintingType
      )
    },
    view (data) {
      window.open(
        DOMAIN_PRINT +
        '/Viewer/index?PrintingId=' +
        data.PrintingId +
        '&PrintingType=' +
        data.PrintingType
      )
    },
    reName (item, isSys) {
      this.$prompt('模板名称：', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '模板名称必须30个字以内',
        inputValue: item.PrintingName,
        inputValidator: value => {
          if (value === null) {
            return false
          } else {
            return /^(\s|\S){0,30}$/.test(value)
          }
        }
      })
        .then(({ value }) => {
          MERCHANT_API_SETTING_PRINTING_UPDATE({
            PrintingId: item.PrintingId,
            PrintingName: value
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              isSys && this.getSysTemplate(this.getCurrentPrintingType())
              this.getStoreTemplate(this.getCurrentPrintingType())
            }
          })
        })
        .catch(() => { })
    },
    copy (e, id, isDiy) {
      e.currentTarget.blur()
      this.$confirm('是否复制?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SETTING_PRINTING_COPY({
            PrintingId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.getSysTemplate(this.getCurrentPrintingType())
              isDiy || this.getStoreTemplate(this.getCurrentPrintingType())
            }
          })
        })
        .catch(() => { })
    },
    del (e, id, state) {
      e.currentTarget.blur()
      this.$confirm('删除后将无法恢复该文件，确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SETTING_PRINTING_DELETE({
            PrintingId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              if (state == 0) {
                this.getStoreTemplate(this.getCurrentPrintingType())
              } else {
                this.getSysTemplate(this.getCurrentPrintingType())
              }
            }
          })
        })
        .catch(() => { })
    },
    setDefault (data, state) {
      if (data.State == this.printState.Normal) {
        MERCHANT_API_SETTING_PRINTING_DEFAULT({
          PrintingId: data.PrintingId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message({
              type: 'success',
              message: res.data.Message
            })
            if (state == 0) {
              this.getStoreTemplate(this.getCurrentPrintingType())
            } else {
              this.getSysTemplate(this.getCurrentPrintingType())
            }
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '该模板在设计中, 操作失败.'
        })
      }
    },
    addTemplate (state) {
      this.$prompt('模板名称：', '新建模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '模板名称必须30个字以内',
        inputValidator: value => {
          if (value === null) {
            return false
          } else {
            return /^(\s|\S){0,30}$/.test(value)
          }
        }
      })
        .then(({ value }) => {
          MERCHANT_API_SETTING_PRINTING_CREATE({
            PrintingType: this.getCurrentPrintingType(),
            PrintingName: value,
            State: this.printState.Designing
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '创建成功！'
              })
              if (state == 0) {
                this.getStoreTemplate(this.getCurrentPrintingType())
              } else {
                this.getSysTemplate(this.getCurrentPrintingType())
              }
            }
          })
        })
        .catch(() => { })
    },
    search () {
      this.getStoreTemplate(this.getCurrentPrintingType(), true)
    },
    sizeChange (val) {
      this.storeSearchData.PageSize = parseInt(val)
      this.storeSearchData.PageIndex = 1
      this.getStoreTemplate(this.getCurrentPrintingType())
    },
    currentChange (val) {
      this.storeSearchData.PageIndex = parseInt(val)
      this.getStoreTemplate(this.getCurrentPrintingType())
    }
  }
}
</script>
<style lang="scss">
.tree-box {
  .el-tree-node__content {
    color: #333333;
    .el-tree-node__label {
      font-size: 12px;
    }
  }
}
</style>
<style lang="scss" scoped>
.container {
  display: -webkit-flex; /* Safari */
  display: flex;
  margin-top: 10px;
  .nav {
    min-width: 180px;
    flex: 1;
    margin-right: 10px;
    border: 1px solid #e5e5e5;
  }
  .main {
    width: 1470px;
    .template-list {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      li {
        padding: 5px;
        .template-item {
          position: relative;
          width: 280px;
          height: 140px;
          background: url('/static/images/bg_model.png') no-repeat;
          &.default {
            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 62px;
              height: 62px;
              transform: rotate(-90deg);
              background: url('/static/images/default_template.png') no-repeat;
            }
          }
          .switch {
            position: absolute;
            top: 10px;
            right: 10px;
          }
          .t-name {
            padding-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .t-btn {
            font-size: 12px;
            color: #fff;
            cursor: pointer;
            padding: 4px 5px;
            background: rgba(0, 0, 0, 0.2);
            &:nth-of-type(1) {
              padding-left: 10px;
            }
            &:nth-last-child(1) {
              padding-right: 10px;
            }
          }
          &.last {
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            background: none;
            cursor: pointer;
            &::before {
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100px;
              height: 10px;
              border-radius: 10px;
              background-color: #ccc;
            }
            &::after {
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 10px;
              height: 100px;
              border-radius: 10px;
              background-color: #ccc;
            }
          }
        }
      }
    }

    .store-tpl {
      .template-list {
        li {
          &:first-of-type {
            .template-item {
              &::before {
                display: none;
              }
            }
          }
          .template-item {
            position: relative;
            .h-title {
              position: absolute;
              top: 0;
              left: 0;
              padding: 15px;
              width: 100%;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.template-title {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #f5f5f5;
}
.table-title {
  font-size: 14px;
  color: #777777;
  background: #f5f5f5;
  margin: 0;
  padding: 10px 0 10px 30px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.border-b-none {
  border-bottom: none !important;
}
.border-bottom-1px {
  border-bottom: 1px solid #dddddd;
}
.text-center {
  text-align: center;
}
</style>

