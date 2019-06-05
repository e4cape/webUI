<template>
  <div class="content">
    <el-row :gutter="20">
      <el-col style="width: 180px;">
        <div class="panel">
          <div class="subject-title">货品科目设置</div>
          <div :name="item" class="subject" :class="index == enumeratorType ? 'active-subject': ''" @click="enumeratorTypeChange(index)" v-for="(item, index) in tree.Types" :key="index">{{item}}</div>
        </div>
      </el-col>
      <el-col style="width: calc(100% - 180px);">
        <div class="m-b-10" v-if="$store.getters.user_session.CharacterType != CharacterType.Lingcb">
          <el-tooltip
            class="item"
            effect="dark"
            v-if="canNotAdd.indexOf(parseInt(this.enumeratorType)) > -1 || subjectData.length>=100"
            :content="subjectData.length<100?'此货品科目无法新建':'此货品科目不能超过一百个'"
            placement="bottom"
          >
            <div style="display: inline-block;">
              <el-button name="createSubject" v-popover:popover type="primary" disabled>新建</el-button>
            </div>
          </el-tooltip>
          <el-button name="createNewSubject" type="primary" v-else @click="visible = true">新建</el-button>

          <span class="m-l-10">{{tipText[enumeratorType]}}</span>
        </div>
        <!-- 表格 -->
        <el-table :data="subjectData | calculationMethod" class="purchase-table" v-loading="fullLoading">
          <el-table-column type="index" label="编码" width="70"></el-table-column>
          <el-table-column prop="EnumeratorVal" :label="tree.Types[enumeratorType + ''].replace('名称', '') + '名称'" min-width="100"></el-table-column>
          <el-table-column prop="rank" label="顺序" min-width="180">
            <template slot-scope="scope">
              <div class="rank-btn-group">
                <span name="rank" class="rank-btn" v-for="(clazz, index) in scope.row.rank" :key="index" :class="clazz" @click="sorting(clazz,scope.row)"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="IsEnable" label="启用/禁用" min-width="100">
            <template slot-scope="scope">
              <el-switch
                name="IsEnable"
                :disabled="scope.row.IsDefault === enableState.Disabled"
                v-model="scope.row.IsEnable"
                active-text
                inactive-text
                :active-value="enableState.Enable"
                :inactive-value="enableState.Disable"
                @change="IsEnable(scope.row, subjectData)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <!-- END 表格 -->
      </el-col>
    </el-row>
    <!-- dialog 新建名称 -->
    <el-dialog v-if="visible" width="500px" :title="'新建' + tree.Types[enumeratorType + ''] + '名称：'" :visible.sync="visible">
      <el-input name="enumeratorVal" class="code" :maxlength="10" v-model="enumeratorVal" @blur="enumeratorVal = enumeratorVal.trim()"></el-input>
      <div slot="footer" class="dialog-footer tc">
        <el-button name="createSubjectConfirm" type="primary" @click="createSubject" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="createSubjectCancel" @click="visible =  false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- End 新建名称 -->
  </div>
</template>

<script>
import { EnableState, SortType, YNStatus, CharacterType } from '@/enums/common'
import { SettingEnumeratorEnumeratorType } from '@/enums/stocking'
import {
  STOCKING_API_SETTING_ENUMERATOR_GETS,
  STOCKING_API_SETTING_ENUMERATOR_CREATE,
  STOCKING_API_SETTING_ENUMERATOR_ENABLE,
  STOCKING_API_SETTING_ENUMERATOR_DISABLE,
  STOCKING_API_SETTING_ENUMERATOR_SORT
} from '@/apis/stocking.js'
export default {
  data () {
    return {
      CharacterType,
      enableState: EnableState,
      tree: SettingEnumeratorEnumeratorType,
      sortType: SortType,
      canNotAdd: [
        SettingEnumeratorEnumeratorType.MaterialType,
        SettingEnumeratorEnumeratorType.GoldType,
        SettingEnumeratorEnumeratorType.CategoryType
      ],
      fullLoading: false,
      visible: false,
      visible2: false,
      enumeratorVal: '',
      enumeratorType: SettingEnumeratorEnumeratorType.CategoryType,
      subjectData: [],
      tipText: {
        1:'货品种类为货品主要类别，用于入库时区别货品类型，用于入库模板。',
        3:'材质为入库必填的重要信息，用于各类统计与分析，与营销产品相关联。',
      }
    }
  },
  methods: {
    sorting (clazz, row) {
      var tosortType = ''
      switch (
        clazz // 排序计算
      ) {
        case 'to-first':
          tosortType = this.sortType.First
          break
        case 'to-prev':
          tosortType = this.sortType.Prev
          break
        case 'to-next':
          tosortType = this.sortType.Next
          break
        case 'to-last':
          tosortType = this.sortType.Last
          break
        default:
          break
      }
      STOCKING_API_SETTING_ENUMERATOR_SORT({
        SortType: tosortType,
        EnumeratorType: this.enumeratorType,
        EnumeratorKey: row.EnumeratorKey
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getSubjectData()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    IsEnable (row, data) {
      let EnumeratorKey = row.EnumeratorKey
      let api
      if (row.IsEnable == YNStatus.No) {
        api = STOCKING_API_SETTING_ENUMERATOR_DISABLE
      } else {
        api = STOCKING_API_SETTING_ENUMERATOR_ENABLE
      }
      api({
        EnumeratorType: this.enumeratorType,
        EnumeratorKey
      }).then(res => {
        if (res.data.Code === 'ERROR') {
          row.IsEnable =
            row.IsEnable === EnableState.Enable
              ? EnableState.Disable
              : EnableState.Enable
          this.$set(data, row.RowIndex, row)
          this.$message.error(res.data.Message)
        }
      })
    },
    createSubject () {
      if (
        this.subjectData.findIndex(value => {
          return value.EnumeratorVal === this.enumeratorVal
        }) > -1
      ) {
        this.$message.error(this.enumeratorVal + '已存在，请勿重复添加！')
        return false
      }

      if (!this.enumeratorVal.trim()) {
        this.$message.error('请输入科目名称!')
        return false
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_SETTING_ENUMERATOR_CREATE({
        EnumeratorType: this.enumeratorType,
        EnumeratorVal: this.enumeratorVal
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.visible = false
          this.enumeratorVal = ''
          this.getSubjectData()
          this.$message.success(res.data.Message)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getSubjectData () {
      this.fullLoading = true
      STOCKING_API_SETTING_ENUMERATOR_GETS({
        EnumeratorType: this.enumeratorType, // 	int32	科目类型(枚举)	gte=0
        EnumeratorKey: 0, // 	int32	枚举键(自增量)	gte=0
        EnumeratorVal: '', //	string	枚举值(名称)	max=50
        IsDefault: 0, // 	int32	是否默认(枚举)	gte=0
        IsEnable: 0, // 	int32	是否启用(枚举)	gte=0
        IsAppend: 0, // 	int32	是否追加(枚举)	gte=0
        SortId: 0, // 	int32	排序编号	gte=0
        OrderBy: 0, // 	int32	排序字段(0=EnumeratorKey)	gte=0
        IsAsced: YNStatus.Yes, // 	int32	是否升序(枚举)	gte=0
        PageIndex: 1, // 	int32	当前页码	gt=0
        PageSize: 1000 // 	int32	每页?条	gt=0
      }).then(res => {
        this.fullLoading = false
        if (res.data.Code === 'CORRECT') {
          this.subjectData = res.data.Data.Rows || []
        }
      })
    },
    enumeratorTypeChange (index) {
      this.enumeratorType = Number(index)
      this.getSubjectData()
    },
    deleteSubject (id) {
      this.$message(id)
    }
  },
  filters: {
    calculationMethod (value) {
      // 重新计算数据格式
      value.map((text, index) => {
        text.RowIndex = index
        text.rank = ['to-first', 'to-prev', 'to-next', 'to-last']
      })
      if (value.length) {
        value[0].rank = ['to-next', 'to-last']
        if (value.length > 1) {
          value[value.length - 1].rank = ['to-first', 'to-prev']
        }
      }
      return value
    }
  },
  mounted () {
    this.getSubjectData()
  }
}
</script>
<style lang="scss" scoped>
// new
/deep/ .el-button--primary.is-disabled {
  border: none !important;
}
.subject-title {
  background-color: #f2f2f2;
  border-bottom: 1px solid #ddd;
}
.subject,
.subject-title {
  width: 100%;
  height: 36px;
  color: #606266;
  font-size: 12px;
  line-height: 36px;
  text-align: center;
  border-color: #ddd;
}
.subject {
  font-size: 12px;
  cursor: Pointer;
}
.active-subject {
  background-color: #399fe5;
  color: #fff;
}
.panel .subject-panel {
  padding: 0;
}
// new
.goods-subject {
  margin: 0 !important;
  padding: 20px 0;
  .title {
    font-size: 18px;
    line-height: 50px;
    font-weight: bold;
    color: #555;
  }
  .el-table {
    border-top: 1px solid #ddd;
  }
}
</style>

