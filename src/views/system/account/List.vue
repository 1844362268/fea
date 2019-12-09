<template>
  <div>
    <a-card :bordered="false" class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.keyword" placeholder="请输入用户名关键字"
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
    <a-card :bordered="false">

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
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="handleDelete(record)">删除</a>
        </template>
      </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import AccountApi from '@/api/account'

export default {
  name: 'TableList',
  components: {
    STable
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
          title: '用户名',
          dataIndex: 'name'
        },
        {
          title: '联系方式',
          dataIndex: 'phone'
        },
        {
          title: '角色',
          dataIndex: 'roleName'
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
        return AccountApi.getAccounts(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
    }
  },
  methods: {
    handleAdd() {
      this.$router.push('account/add')
    },
    handleEdit (record) {
      this.$router.push({ path: 'account/add', query: { id: record.id } })
    },
    handleDelete (record) {
      AccountApi.deleteAccount(record.id).then(res => {
        this.$message.success("删除成功")
        this.refresh()
      })
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
