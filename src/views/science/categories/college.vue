<template>
  <div v-loading="isPulling" element-loading-text="拼命加载中...">
    <el-row class="m-b-10">
      <el-col :span="12">
        <el-button name="btnCreateParent" type="primary" size="small" @click="createParent">新建大类</el-button>
      </el-col>
      <el-col :span="12" class="tr">
        <el-button size="small" @click="changeAllShow">{{allShow ? '- 全部收起' : '+ 全部展开'}}</el-button>
      </el-col>
    </el-row>
    <ul class="category-list">
      <li class="category-item" v-for="(item, index) in data" :key="index">
        <div class="category-name" @click="changeParentShow(item)">
          <span>
            <i class="m-r-10" :class="{
                'el-icon-arrow-down': item.showChildren,
                'el-icon-arrow-right': !item.showChildren
              }"></i>
            {{ item.DictName }}
          </span>
          <div class="category-opes">
            <span class="sort-items">
              <sort-item :index="index" :source="data" :sort="(...args) => onDataSort(item, ...args)"/>
            </span>
            <div>
              <el-button name="btnCreateChild" type="text" @click.stop="createChild(item)">新建子类</el-button>
              <el-button name="btnEditChild" type="text" @click.stop="modifyCategory(item, '')">修改</el-button>
              <el-button name="btnRemoveChild" type="text" @click.stop="deleteCategory($event,item)">删除</el-button>
            </div>
          </div>
        </div>
        <ul v-show="item.showChildren">
          <li class="category-sub-item" v-for="(child, ci) in item.items" :key="ci">
            <div class="category-sub-name">
              <div class="left">
                <!--<img :src="$root.settings.DOMAIN_IMAGE + child.imageUrl" />-->
                <span>{{ child.DictName }}</span>
              </div>
              <section class="category-opes">
                <div class="sort-items">
                  <sort-item :index="ci" :source="item.items" :sort="(...args) => onDataSort(child, ...args)"/>
                </div>
                <div>
                  <el-button name="btnEdit" type="text" @click="modifyCategory(child, item.categoryName)">修改</el-button>
                  <el-button name="btnRemove" type="text" @click="deleteCategory($event,child)">删除</el-button>
                </div>
              </section>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <!-- @module 编辑 -->
    <el-dialog :title="editForm.DictName ? '编辑' : '新建'" width="520px" :visible.sync="editVisible" @close="resetEditForm">
      <el-form class="fix-w" label-position="right" label-width="100px" :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="父类名称：" prop="parentName" v-if="editForm.parent">
          <span>{{ editForm.parent.DictName }}</span>
        </el-form-item>
        <el-form-item :label="(editForm.parent ? '子类' : '大类') + '名称：'" prop="DictName">
          <el-input name="categoryName" v-model="editForm.DictName" :maxlength="editForm.parent ? 10 : 6" :placeholder="(editForm.parent ? '10' : '6') + '个字以内'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="saveCategory" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btnCancel" @click="resetEditForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 编辑 -->
    <img-cropper v-if="cropperVisible" :cropperVisible="cropperVisible" :imgSize="imgSize" :url="cropperUrl" @listenCropper="listenCropper"></img-cropper>
  </div>
</template>

<script>
import {
  COLLEGE_API_SETTINGDICTIONARY_GETS,
  COLLEGE_API_SETTINGDICTIONARY_SORT,
  COLLEGE_API_SETTINGDICTIONARY_DELETE,
  COLLEGE_API_SETTINGDICTIONARY_CREATE,
  COLLEGE_API_SETTINGDICTIONARY_UPDATE
} from '@/apis/science'
import { InfrastCourseChannelType } from '@/enums/science'
import sortItem from '../template/sortOrderItem'
import _ from 'lodash'
import { rearrangeDict } from '../util'

const originEditForm = {
  DictName: '',
  DictType: InfrastCourseChannelType.College
}

export default {
  name: 'college',
  data() {
    const checkCategoryName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写名称'))
      } else {
        // if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        //   callback(new Error('请输入汉字'))
        // }
        callback()
      }
    }
    return {
      remarkOptions: [], // 备注项目下拉列表
      data: [],
      editVisible: false,
      editForm: {
        ...originEditForm
      },
      cropperVisible: false,
      editRules: {
        DictName: [
          {
            required: true,
            validator: checkCategoryName,
            trigger: 'change'
          }
        ]
      },
      isPulling: false,
      dataCopy: []
    }
  },
  computed: {
    allShow() {
      return (
        this.data.filter(item => {
          if (!item.showChildren) {
            return item
          }
        }).length === 0
      )
    }
  },
  methods: {
    createParent() {
      this.editVisible = true
    },
    createChild(item) {
      this.editVisible = true
      this.editForm = {
        ...this.editForm,
        parent: item,
        ParentId: item.DictId
      }
      return true
    },
    modifyCategory(item) {
      this.editForm = {
        ...this.editForm,
        ..._.clone(item)
      }
      this.editVisible = true
    },
    saveCategory() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          let apiName = ''
          if (this.editForm.DictName.trim() == '') {
            this.$message.error('请输入非空的类名')
            return
          }
          let param = this.editForm
          if (this.editForm.DictId) {
            apiName = COLLEGE_API_SETTINGDICTIONARY_UPDATE
          } else {
            apiName = COLLEGE_API_SETTINGDICTIONARY_CREATE
          }
          this.isPulling = true
          apiName(param).then(res => {
            this.isPulling = false
            if (res.data.Code === 'CORRECT') {
              this.$message.success('操作成功！')
              this.editVisible = false
              this.resetEditForm()
              this.pullCollegeData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    resetEditForm() {
      this.editForm = originEditForm
      this.$refs['editForm'].resetFields()
      this.editVisible = false
    },
    deleteCategory(e, item) {
      e.currentTarget.blur()
      this.$confirm('确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isPulling = true
        COLLEGE_API_SETTINGDICTIONARY_DELETE({ DictId: item.DictId }).then(res => {
          this.isPulling = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.pullCollegeData()
          }
        })
      })
    },
    changeParentShow(item) {
      this.changeItemShow(item, !item.showChildren)
    },
    changeItemShow(item, show) {
      item.showChildren = show
      this.dataCopy = this.data.slice()
    },
    changeAllShow() {
      let show = !this.allShow
      this.data.forEach(item => {
        this.changeItemShow(item, show)
      })
    },
    async onDataSort(item, sortObj) {
      this.isPulling = true
      try {
        const response = await COLLEGE_API_SETTINGDICTIONARY_SORT({
          DictId: item.DictId,
          MoveType: sortObj.ope
        })
        if (response.data.Code === 'CORRECT') {
          return this.pullCollegeData()
        }
        this.isPulling = false
      } catch (e) { console.log(e) }
    },
    async pullCollegeData() {
      try {
        this.isPulling = true
        const response = await COLLEGE_API_SETTINGDICTIONARY_GETS({
          DictType: InfrastCourseChannelType.College
        })

        if (response.data.Code === 'CORRECT') {
          const { Subset } = response.data.Data

          const self = this

          this.data = rearrangeDict(Subset).map(item => {
            const found = self.dataCopy.find(copyItem => {
              return copyItem.DictId === item.DictId
            })
            const showChildren = found ? found.showChildren : false
            return {
              ...item,
              showChildren
            }
          })
        }
      } catch (e) { console.log(e) }
      this.isPulling = false
    }
  },
  async mounted() {
    this.pullCollegeData()
  },
  components: {
    sortItem
  }
}
</script>
<style lang="scss" scoped>
.category-list {
  > .category-item {
    .category-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      margin-bottom: 10px;
      background-color: #f5f5f5;
      cursor: pointer;
    }
  }
  ul {
    padding-left: 20px;
    > .category-sub-item {
      .category-sub-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 10px;
        margin-bottom: 10px;
        border: 1px solid #e5e5e5;
        .left {
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.el-icon-arrow-down,
.el-icon-arrow-right {
  color: #333;
}

.category-sub-item {
  .sort-items {
    margin-right: 60px;
  }
}

.category-opes {
  display: flex;
  .sort-items {
    min-width: 300px;
    text-align: center;
  }
}
</style>
