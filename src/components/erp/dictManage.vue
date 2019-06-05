<template>
  <el-dialog :title="'新建' + dialogTitle" @update:visible="$emit('update:visible', $event)" :visible="visible" @close="close">
    <el-row>
      <el-button type="text" @click="createDict" name="btnCreatDict">+新建</el-button>
    </el-row>
    <el-table :data="enabledData">
      <el-table-column prop="Value" :label="dialogTitle">
        <template slot-scope="scope">
          <el-input v-model="scope.row.Value" v-if="scope.row.edit || scope.row.newAdd" :maxlength="30" name="Value"></el-input>
          <span v-else>{{scope.row.Value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="顺序" width="180">
        <template slot-scope="scope">
          <div class="rank-btn-group" v-if="addOrEdit">
            <span v-if="scope.$index !== 0" class="rank-btn to-first" @click="sorting(SortType.First, scope.row.Id)"></span>
            <span v-if="scope.$index !== 0" class="rank-btn to-prev" @click="sorting(SortType.Prev, scope.row.Id)"></span>
            <span v-if="scope.$index !== enabledData.length - 1" class="rank-btn to-next" @click="sorting(SortType.Next, scope.row.Id)"></span>
            <span v-if="scope.$index !== enabledData.length - 1" class="rank-btn to-last" @click="sorting(SortType.Last, scope.row.Id)"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="!scope.row.edit && !scope.row.newAdd">
            <el-button type="text" @click="editDict(scope)" name="btnEditDict">修改</el-button>
            <el-button type="text" @click="delDict(scope.row)" name="btnDelDict">删除</el-button>
          </template>
          <template v-if="scope.row.edit || scope.row.newAdd">
            <el-button type="text" @click="saveDict(scope)" :loading="isSaving" name="btnSaveDict">保存</el-button>
            <el-button type="text" @click="cancelDict(scope)" name="btnCancelDict">取消</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="disabledData.length" :data="disabledData" class="m-t-10" :style="{width: '50%', margin: '10px auto 0'}">
      <el-table-column prop="Value" :label="dialogTitle+'(已删除)'">
        <template slot-scope="scope">{{scope.row.Value}}</template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <template>
            <el-button type="text" @click="enableDict(scope)" name="btnEnableDict">恢复</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import {
  STOCKING_API_SETTING_DICTIONARY_CREATE,
  STOCKING_API_SETTING_DICTIONARY_UPDATE,
  STOCKING_API_SETTING_DICTIONARY_SORT,
  STOCKING_API_SETTING_DICTIONARY_DISABLE,
  STOCKING_API_SETTING_DICTIONARY_ENABLE
} from '@/apis/stocking.js'
import { SortType, YNStatus } from '@/enums/common.js'

export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    // dicts: {
    //   default() {
    //     return []
    //   },
    //   type: Array
    // },
    dialogTitle: {
      default: '',
      type: String
    },
    dictType: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      SortType,
      addOrEdit: true,
      isSaving: false,
      enabledData: [],
      disabledData: [],
      oldRow: {} // 修改前的数据
    }
  },
  beforeMount() {
    this.getDictList()
  },
  methods: {
    close() {
      this.$emit('listenDictSave')
      this.addOrEdit = true
      this.isSaving = false
    },
    createDict() {
      if (this.addOrEdit) {
        this.enabledData.unshift({
          Value: '',
          Type: this.dictType,
          newAdd: true
        })
        this.addOrEdit = false
      }
    },
    editDict(scope) {
      if (this.addOrEdit) {
        this.oldRow = JSON.parse(JSON.stringify(scope.row))
        this.oldRow['$index'] = scope.$index
        this.$set(
          this.enabledData,
          scope.$index,
          Object.assign(scope.row, {
            edit: true
          })
        )
        this.addOrEdit = false
      }
    },
    enableDict(scope) {
      STOCKING_API_SETTING_DICTIONARY_ENABLE({
        DictId: scope.row.Id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('恢复成功')
          this.addOrEdit = true
          this.getDictList()
          this.$emit('listenDictSave')
        }
      })
    },
    saveDict(scope) {
      if (!scope.row.Value.trim()) {
        this.$message.warning('请填写' + this.dialogTitle + '！')
      } else {
        this.isSaving = true
        if (scope.row.newAdd) {
          STOCKING_API_SETTING_DICTIONARY_CREATE({
            DictType: this.dictType,
            DictName: scope.row.Value
          })
            .then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('保存成功')
                scope.row.newAdd = false
                this.$emit('listenDictSave')
                this.getDictList()
              }

              this.isSaving = false
            })
            .catch(() => {
              this.isSaving = false
            })
        } else {
          this.updateDict(scope)
        }
        this.addOrEdit = true
      }
    },
    updateDict(scope) {
      STOCKING_API_SETTING_DICTIONARY_UPDATE({
        DictId: scope.row.Id,
        DictName: scope.row.Value
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            delete scope.row.edit
            this.$set(this.enabledData, scope.$index, scope.row)
            this.$emit('listenDictSave')
          }
          this.isSaving = false
        })
        .catch(() => {
          this.isSaving = false
        })
    },
    delDict(row) {
      STOCKING_API_SETTING_DICTIONARY_DISABLE({
        DictId: row.Id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('listenDictSave')
          this.enabledData.splice(row.index, 1)
          this.addOrEdit = true
          this.getDictList()
        }
      })
    },
    getDictList() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.dictType,
        IsEnable: 0
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let disabled = []
          let enabled = []
          let data = res.data.Data.Rows || []
          data.forEach(item => {
            if (item.State === YNStatus.Yes) {
              enabled.push(item)
            } else {
              disabled.push(item)
            }
          })

          this.enabledData = enabled
          this.disabledData = disabled
        }
      })
    },
    cancelDict(scope) {
      if (scope.row.newAdd) {
        this.enabledData.splice(scope.$index, 1)
      } else {
        this.$set(
          this.enabledData,
          this.oldRow.$index,
          Object.assign(this.oldRow, {
            edit: false
          })
        )
        this.oldRow = {}
      }
      this.addOrEdit = true
    },
    sorting(sortType, id) {
      STOCKING_API_SETTING_DICTIONARY_SORT({
        SortType: sortType,
        DictId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getDictList()
          this.$emit('listenDictSave')
        }
      })
    }
  }
}
</script>
