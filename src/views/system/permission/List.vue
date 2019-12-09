<template>
  <div>
    <a-card :bordered="false" class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.keyword" placeholder="请输入查询关键字"
                       @pressEnter="refresh()"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="refresh()">查询</a-button>
              <a-button style="margin-left: 8px" icon="redo" @click="reset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">新建权限</a-button>
      </div>
      <div v-if="sourceData">
        <a-table
          ref="table"
          rowKey="id"
          :columns="columns"
          :dataSource="sourceData"
          :defaultExpandAllRows="true"
          :pagination="false"
        >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record)" :disabled="record.code == 'all'">删除</a>
      </span>
        </a-table>
      </div>
    </a-card>
    <add-modal ref="addModal" @ok="refresh"></add-modal>
  </div>
</template>

<script>
import PermissionApi from '@/api/permission'
import ACard from 'ant-design-vue/es/card/Card'
import AddModal from './Add'

export default {
  name: 'TableList',
  components: {
    ACard,
    AddModal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '权限名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '权限标识',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: '操作',
          key: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      sourceData: null
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      PermissionApi.getTree(this.queryParam.keyword).then(res => {
        this.sourceData = res.data
      })
    },
    handleAdd() {
      this.$refs.addModal.show()
    },
    handleEdit (record) {
      this.$refs.addModal.show(record)
    },
    handleDelete (record) {
      let that = this
      this.$confirm({
        title: '您确定要删除该权限吗？',
        content: '',
        onOk() {
          PermissionApi.delete(record.id).then(res => {
            that.$message.success("删除成功")
            that.refresh()
          })
        }
      });
    },
    refresh () {
      this.loadData()
    },
    reset () {
      this.queryParam = {}
      this.sourceData = null
      this.loadData()
    }
  }
}
</script>
