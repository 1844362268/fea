<template>
  <a-drawer
    :title="'【' + roleName + '】角色授权'"
    :width="600"
    @close="hide"
    :visible="visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form :form="form" layout="vertical" hideRequiredMark>
      <a-table
        bordered
        ref="table"
        rowKey="id"
        :columns="columns"
        :dataSource="sourceData"
        :pagination="false"
      >
        <span slot="name" slot-scope="text, record">
          <a-checkbox @change="onItemChange($event, record)"
                      :value="record.id"
                      :checked="selected[record.id] && selected[record.id].includes(record.id)">{{text}}</a-checkbox>
        </span>
        <span slot="sub" slot-scope="text, record">
          <a-checkbox-group
            style="display: flex;justify-content: space-between; flex-wrap: wrap;"
            v-model="selected[record.id]"
            @change="onSubItemChange($event, record.id)">
            <div v-for="item in text" style="width: 30%; padding: 10px 0">
              <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
            </div>
          </a-checkbox-group>
        </span>
      </a-table>
    </a-form>
    <div class="grant-footer">
      <a-button :style="{marginRight: '8px'}" @click="hide">
        取消
      </a-button>
      <a-button @click="onSubmit" type="primary">保存</a-button>
    </div>
  </a-drawer>
</template>
<script>
import PermissionApi from '@/api/permission'
import RoleApi from '@/api/role'

export default {
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      roleId: 0,
      roleName: '',
      columns: [
        {
          title: '权限模块',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作权限',
          dataIndex: 'sub',
          key: 'sub',
          scopedSlots: { customRender: 'sub' }
        }
      ],
      sourceData: null,
      permItems: {}, // 全部权限id对象，{10:[1,2,3],11:[4,5,6]}
      selected: [] // 选择的权限id
    }
  },
  created() {
  },
  methods: {
    loadData() {
      PermissionApi.getTree({ roleId: this.roleId }).then(res => {
        let items = []
        res.data.forEach(perm => {
          perm.sub = perm.children
          let subArr = [], selectedArr = []

          // 选中的状态放入selectedArr
          if (perm.checked) {
            selectedArr.push(perm.id)
          }
          perm.children.forEach(item => {
            subArr.push(item.id)
            if (item.checked) {
              selectedArr.push(item.id)
            }
          })
          perm.children = null // 删除掉，防止出现树形结构
          items.push(perm)

          this.permItems[perm.id] = subArr

          // 触发dom 更新，此处只能通过vm.$set实现
          vm.$set(this.selected, perm.id, selectedArr)
        })
        this.sourceData = items
      })
    },

    show(record) {
      this.roleId = record.id
      this.roleName = record.name
      this.loadData()
      this.visible = true
    },

    hide() {
      this.visible = false
    },

    onItemChange(e, record) {
      const { checked, value } = e.target
      let newItems = []
      if (checked && record.sub.length > 0) {
        newItems.push(value)
        record.sub.forEach(item => {
          newItems.push(item.id)
        })
        vm.$set(this.selected, value, newItems)
      } else {
        vm.$set(this.selected, value, [])
      }
    },

    onSubItemChange(item, pid) {
      if (item.length === this.permItems[pid].length) {
        if (item.includes(pid)) {
          item = item.filter(item => item !== pid)
        } else {
          item.push(pid)
        }
      }
      vm.$set(this.selected, pid, item)
    },

    onSubmit() {
      if (!this.selected) {
        this.$message.error("请至少选择一个权限")
        return
      }

      let permIds = []
      for (let index in this.selected) {
        let arr = this.selected[index]
        if (arr.length > 0) {
          permIds = [...permIds, ...arr]
        }
      }

      let params = { roleId: this.roleId, permissionIds: permIds }
      RoleApi.grant(params).then(res => {
        if (res.code === 200) {
          this.$message.success("权限分配成功")
          this.hide()
        }
      })
    }
  },
}
</script>
<style scoped>
  .grant-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right
  }
</style>