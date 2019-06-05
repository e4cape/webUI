<template>
  <div class="content">
    <div class="m-b-10">
      <el-button type="primary" @click="editWarehouseVisible = true">新建仓库</el-button>
      <el-button @click="editShelfVisible = true">新建货架</el-button>
    </div>

    <el-table :data="tableData" :expand-row-keys="expandRows" @expand-change="expandRow" :row-key="row => row.RowIndex" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="expand" fixed>
        <template slot-scope="scope">
          <div style="width:600px; margin: 0 auto;">
            <el-table :data="scope.row.children" v-if="scope.row.children" v-loading="loading" row-key="childTable">
              <el-table-column prop="ShelfCode" label="货架编码" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="ShelfName" label="货架名称" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="IsDefault" label="是否默认" min-width="100" show-overflow-tooltip>
                <template slot-scope="scopeRow">{{scopeRow.row.IsDefault == YNStatus.Yes ? '默认' : '-'}}</template>
              </el-table-column>
              <el-table-column prop="WarehouseCode" label="操作" min-width="100" show-overflow-tooltip>
                <template slot-scope="scopeRow">
                  <el-button type="text" @click="editShelf(scopeRow.row)">编辑</el-button>
                  <el-button v-if="scopeRow.row.IsDefault != YNStatus.Yes" type="text" @click="delectShelf($event,scopeRow.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="WarehouseCode" label="仓库编码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseName" label="仓库名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseTypeDv" label="仓库类型" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="仓库属性" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.AllowRetail == YNStatus.Yes && (scope.row.AllowWholesale == 0 || scope.row.AllowWholesale == YNStatus.No) ">允许零售</div>
          <div v-else-if="(scope.row.AllowRetail == 0 || scope.row.AllowRetail == YNStatus.No) && scope.row.AllowWholesale == YNStatus.Yes">允许批发</div>
          <div v-else-if="scope.row.AllowRetail == YNStatus.Yes && scope.row.AllowWholesale == YNStatus.Yes">允许零售和批发</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="操作" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click="editWarehouse(scope.row)">编辑</el-button>
            <el-button type="text" @click="delectWarhouse($event,scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 编辑仓库 -->
    <el-dialog v-if="editWarehouseVisible" :title="(editWarehouseForm.WarehouseId ? '编辑': '新建') + '仓库'" width="600px" :visible.sync="editWarehouseVisible" @close="resetWarehouseForm">
      <el-form class="fix-w" label-position="right" label-width="100px" :model="editWarehouseForm" :rules="warehouseRules" ref="editWarehouseForm">
        <el-form-item label="仓库名称：" prop="WarehouseName">
          <el-input name="WarehouseName" v-model="editWarehouseForm.WarehouseName" @blur="editWarehouseForm.WarehouseName=editWarehouseForm.WarehouseName.trim()" placeholder="请输入仓库名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="仓库编码：" prop="WarehouseCode">
          <el-input name="WarehouseCode" v-model="editWarehouseForm.WarehouseCode" placeholder="请输入仓库编码" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="仓库类型：" prop="SystemId">
          <el-select name="SystemId" v-model="editWarehouseForm.WarehouseTypeDk" :filterable="true" placeholder="全部" @change="getWarehouseValue">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item, index) in warehouseTypes" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="warehouseTypesDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="仓库属性：" prop="SubName">
          <el-checkbox label="允许零售" :true-label="YNStatus.Yes" :false-label="YNStatus.No" v-model="editWarehouseForm.AllowRetail"></el-checkbox>
          <el-checkbox label="允许批发" :true-label="YNStatus.Yes" :false-label="YNStatus.No" v-model="editWarehouseForm.AllowWholesale"></el-checkbox>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" v-model="editWarehouseForm.Note" placeholder="请输入备注" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="saveGroup" type="primary" size="small" @click="saveWarehouse" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="cancelGroup" size="small" @click="resetWarehouseForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑仓库 -->
    <!-- @module 编辑货架 -->
    <el-dialog v-if="editShelfVisible" :title="(editShelfForm.ShelfId ? '编辑': '新建') + '货架'" width="600px" :visible.sync="editShelfVisible" @close="resetShelfForm">
      <el-form class="fix-w" label-position="right" label-width="100px" :model="editShelfForm" :rules="shelfRules" ref="editShelfForm">
        <el-form-item label="货架名称：" prop="ShelfName">
          <el-input name="WarehouseName" v-model="editShelfForm.ShelfName" @blur="editShelfForm.ShelfName=editShelfForm.ShelfName.trim()" placeholder="请输入货架名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="货架编码：" prop="ShelfCode">
          <el-input name="WarehouseCode" v-model="editShelfForm.ShelfCode" placeholder="请输入货架编码" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所属仓库：" prop="WarehouseId">
          <el-select :disabled="editShelfForm.ShelfId != ''" name="SystemId" v-model="editShelfForm.WarehouseId" :filterable="true" placeholder="全部">
            <el-option label="请选择" value></el-option>
            <el-option v-for="(item, index) in tableData" :key="index" :label="item.WarehouseName" :value="item.WarehouseId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="saveGroup" type="primary" size="small" @click="saveShelf" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="cancelGroup" size="small" @click="resetShelfForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑货架 -->
    <!-- @module Dialog·新建调仓库类型   -->
    <dict-manage
      v-if="warehouseTypesDialog"
      :visible.sync="warehouseTypesDialog"
      :dicts="warehouseTypes"
      :dialogTitle="'仓库类型'"
      :dictType="settingDictionaryDictTypes.WarehouseBasicWarehouseType"
      @listenDictSave="listenDictSave"
    ></dict-manage>
    <!-- End Dialog·新建调仓库类型 -->
  </div>
</template>

<script>
import { YNStatus, EnableState } from '@/enums/common.js'
import { SettingDictionaryDictType } from '@/enums/stocking.js'
import {
  STOCKING_API_WAREHOUSE_BASIC_GETS,
  STOCKING_API_WAREHOUSE_BASIC_CREATE,
  STOCKING_API_WAREHOUSE_BASIC_UPDATE,
  STOCKING_API_WAREHOUSE_BASIC_DELETE,
  STOCKING_API_WAREHOUSE_SHELF_GETS,
  STOCKING_API_WAREHOUSE_SHELF_CREATE,
  STOCKING_API_WAREHOUSE_SHELF_DELETE,
  STOCKING_API_WAREHOUSE_SHELF_UPDATE
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'

import dictManage from '@/components/erp/dictManage'
import pagination from '@/components/pagination'

export default {
  data () {
    return {
      YNStatus,
      settingDictionaryDictTypes: SettingDictionaryDictType,
      editWarehouseVisible: false,
      warehouseTypesDialog: false,
      editShelfVisible: false,
      loading: false,
      tableData: [],
      expandRows: [],
      total: 0,
      warehouseTypes: [],
      warehouseRules: {
        WarehouseName: [
          {
            required: true,
            message: '请输入仓库名称',
            trigger: 'blur'
          }
        ]
      },
      shelfRules: {
        ShelfName: [
          {
            required: true,
            message: '请输入货架名称',
            trigger: 'blur'
          }
        ],
        WarehouseId: [
          {
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ]
      },
      editWarehouseForm: {
        WarehouseCode: '', //	string	仓库编码	max=50
        WarehouseName: '', //	string	仓库名称	max=50
        WarehouseTypeDk: 0, //	int64	仓库类型(SettingDictionary.DictId)	gte=0
        WarehouseTypeDv: '', //	string	仓库类型(SettingDictionary.DictName)	max=50
        AllowRetail: 0, //	int32	允许零售	gte=0
        AllowWholesale: 0, //	int32	允许批发	gte=0
        Note: '' //	string	备注
      },
      editShelfForm: {
        WarehouseId: '', //	string
        ShelfCode: '', //	string
        ShelfName: '', //	int64
        ShelfId: ''
      },
      queryForm: {
        OrderBy: 0, //	int32	排序字段(0=仓库序号)	gte=0
        IsAsced: YNStatus.No, //	int32	是否升序(枚举)	gte=0
        State: EnableState.Enable,
        PageIndex: 1, //	int32	当前页码	gt=0
        PageSize: 20 //	int32	每页?条	gt=0
      }
    }
  },
  beforeMount () {
    this.getWarehouseTypes()
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      STOCKING_API_WAREHOUSE_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.tableData.map((item, i) => {
            item['RowIndex'] = i
            item['children'] = []
          })
          this.total = res.data.Data.Count
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    saveWarehouse () {
      this.$refs['editWarehouseForm'].validate(valid => {
        if (valid) {
          var api = STOCKING_API_WAREHOUSE_BASIC_CREATE
          if (this.editWarehouseForm.WarehouseId) {
            api = STOCKING_API_WAREHOUSE_BASIC_UPDATE
            delete this.editWarehouseForm.children
          }
          api(this.editWarehouseForm).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(
                this.editWarehouseForm.WarehouseId ? '修改成功' : '新建成功'
              )
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
            this.expandRows = []
            this.editWarehouseVisible = false
            this.resetWarehouseForm()
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    saveShelf () {
      this.$refs['editShelfForm'].validate(valid => {
        if (valid) {
          var api = STOCKING_API_WAREHOUSE_SHELF_CREATE
          if (this.editShelfForm.ShelfId) {
            api = STOCKING_API_WAREHOUSE_SHELF_UPDATE
          }
          api(this.editShelfForm).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(
                this.editShelfForm.ShelfId ? '修改成功' : '新建成功'
              )
            } else {
              this.$message.error(res.data.Message)
            }
            this.editShelfVisible = false
            this.getShelfData()
            this.resetShelfForm()
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    delectWarhouse (e, row) {
      e.currentTarget.blur()
      this.$confirm('确定删除该仓库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_WAREHOUSE_BASIC_DELETE({
            WarehouseId: row.WarehouseId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('删除成功')
              this.getData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    delectShelf (e, row) {
      e.currentTarget.blur()
      this.$confirm('确定删除该货架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_WAREHOUSE_SHELF_DELETE({
            ShelfId: row.ShelfId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('删除成功')
              this.getShelfData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editWarehouse (row) {
      this.editWarehouseVisible = true
      this.editWarehouseForm = Object.assign({}, row)
    },
    editShelf (row) {
      this.editShelfVisible = true
      this.editShelfForm = Object.assign({}, row)
    },
    expandRow (row) {
      if (this.expandRows.indexOf(row.RowIndex) === -1) {
        this.expandRows = [row.RowIndex]
        this.getShelfData()
      } else {
        this.expandRows = []
      }
    },
    getShelfData () {
      this.loading = true
      let index = this.expandRows[0] || 0
      STOCKING_API_WAREHOUSE_SHELF_GETS({
        WarehouseId: this.tableData[index]['WarehouseId'],
        State: EnableState.Enable,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10000
      }).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          let item = this.tableData[index]
          item['children'] = res.data.Data.Rows
          this.$set(this.tableData, index, item)
        }
      })
    },
    resetWarehouseForm () {
      this.editWarehouseForm = {
        WarehouseCode: '', //	string	仓库编码	max=50
        WarehouseName: '', //	string	仓库名称	max=50
        WarehouseTypeDk: 0, //	int64	仓库类型(SettingDictionary.DictId)	gte=0
        WarehouseTypeDv: '', //	string	仓库类型(SettingDictionary.DictName)	max=50
        AllowRetail: 0, //	int32	允许零售	gte=0
        AllowWholesale: 0, //	int32	允许批发	gte=0
        Note: '' //	string	备注
      }
      this.editWarehouseVisible = false
    },
    resetShelfForm () {
      this.editShelfForm = {
        WarehouseId: '', //	string
        ShelfCode: '', //	string
        ShelfName: '', //	int64
        ShelfId: ''
      }
      this.editShelfVisible = false
    },
    getWarehouseValue () {
      this.warehouseTypes.forEach(res => {
        if (res.Id == this.editWarehouseForm.WarehouseTypeDk) {
          this.editWarehouseForm.WarehouseTypeDv = res.Value
        }
      })
    },
    getWarehouseTypes () {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictTypes.WarehouseBasicWarehouseType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.warehouseTypes = res.data.Data.Rows
        }
      })
    },
    listenDictSave () {
      this.getWarehouseTypes()
    },
    currentChange (val) {
      // 切换当前页
      this.expandRows = []
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange (val) {
      // 切换每页显示条数
      this.expandRows = []
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    }
  },
  components: {
    dictManage,
    pagination
  }
}
</script>

<style lang="scss" spoced>
.expand-talble {
  width: 400px;
  margin: 0 auto;
  line-height: 26px;
  border-collapse: collapse;
  text-align: center;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  th,
  td {
    text-align: center;
  }
}
</style>

