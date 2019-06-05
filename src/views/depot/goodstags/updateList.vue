<template>
  <div class="content">
    <div class="tabs">
      <div class="tab" :class="{active: activedItem === 1}" @click="activedItem=1">正在更新</div>
      <div class="tab" :class="{active: activedItem === 2}" @click="activedItem=2">更新完成</div>
    </div>
    <div class="main">
      <div class="updating" v-if="activedItem === 1">
        <div class="description">
          <p><i class="icon-update icon"></i> 更新进度</p>
          <div class="progress">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="100" color="#ffa200"></el-progress>
          </div>
          <div>
            <el-button type="primary">全部开始</el-button>
            <el-button type="default">全部取消</el-button>
          </div>
        </div>
        <el-table :data="tableData" key="updating">
          <el-table-column prop="img" label="标签图片"></el-table-column>
          <el-table-column label="标签编号"></el-table-column>
          <el-table-column label="货品条码"></el-table-column>
          <el-table-column label="货品名称"></el-table-column>
          <el-table-column label="标签位置"></el-table-column>
          <el-table-column label="标签模板"></el-table-column>
          <el-table-column label="更新情况"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text"><i class="icon-play3 icon"></i></el-button>
              <el-button type="text"><i class="icon-pause icon"></i></el-button>
              <el-button type="text"><i class="icon-guanbi icon"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
      <div class="updated" v-else>
        <div class="description">
          <p><i class="icon icon-xiaogou"></i> 共更新了 10 个电子标签！（仅保留最近更新的500条记录)</p>
          <div>
            <el-button type="primary">清除所有记录</el-button>
          </div>
        </div>
        <el-table :data="tableData" key="updated">
          <el-table-column prop="img" label="标签图片"></el-table-column>
          <el-table-column label="标签编号"></el-table-column>
          <el-table-column label="货品条码"></el-table-column>
          <el-table-column label="货品名称"></el-table-column>
          <el-table-column label="标签位置"></el-table-column>
          <el-table-column label="标签模板"></el-table-column>
          <el-table-column label="更新时间" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text"><i class="icon-guanbi icon"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      activedItem: 1,
      total: 1,
      tableData: [
        {
          img: 1 
        }
      ],
      queryForm: {
        pageSize: 20,
        pageIndex: 1
      }
    }
  },
  methods: {
    currentChange() {
      this.activedItem = 2
    },
    sizeChange() {}
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px;
  border: 1px solid #e5e5e5;
}
.description {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    line-height: 16px;
  }
  .icon {
    font-weight: bold;
  }
  .progress {
    padding: 0 10px;
    flex: 1;
  }
}
.icon {
  vertical-align: middle;
  font-size: 16px;
  &.icon-guanbi {
    color: #da0000;
  }
}
.icon.icon-xiaogou {
  color: #ffa200;
}
</style>

