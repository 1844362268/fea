<template>
  <div>
    <a-card :bordered="false" class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名">
              <a-input v-model="queryParam.keyword" placeholder="请输入角色名关键字"
                       @pressEnter="$refs.table.refresh()"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="$refs.table.refresh()">查询</a-button>
              <a-button style="margin-left: 8px" icon="redo" @click="reset()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>

      <s-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
        <span slot="createTime" slot-scope="text, record">{{record.createTime | moment}}</span>
        <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)" :disabled="record.code == 'ROLE_ADMIN'">编辑</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleDelete(record)" :disabled="record.code == 'ROLE_ADMIN'">删除</a>
          <a-divider type="vertical"></a-divider>
          <a @click="handleGrant(record)" :disabled="record.code == 'ROLE_ADMIN'">授权</a>
        </template>
      </span>
      </s-table>
      <add-modal ref="addModal" @ok="refresh"></add-modal>
      <grant-modal ref="grantModal"></grant-modal>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import RoleApi from '@/api/role'
import AddModal from './Add'
import ACard from 'ant-design-vue/es/card/Card'
import GrantModal from './Grant'

export default {
  name: 'TableList',
  components: {
    ACard,
    STable,
    AddModal,
    GrantModal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '角色名',
          dataIndex: 'name'
        },
        {
          title: '角色标识',
          dataIndex: 'code'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          sorter: true,
          sortField: 'create_time' // 排序字段名和数据库保持一致
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return RoleApi.getPages(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
    }
  },
  methods: {
    handleAdd() {
      this.$refs.addModal.show()
    },
    handleEdit (record) {
      this.$refs.addModal.show(record)
    },
    handleGrant(record) {
      this.$refs.grantModal.show(record)
    },
    handleDelete (record) {
      let that = this
      this.$confirm({
        title: '您确定要删除该角色吗？',
        content: '',
        onOk() {
          RoleApi.delete(record.id).then(res => {
            that.$message.success("删除成功")
            that.refresh()
          })
        }
      });
    },
    refresh () {
      this.$refs.table.refresh()
    },
    reset () {
      this.queryParam = {}
      this.$refs.table.refresh()
    }
  }
}
</script>
