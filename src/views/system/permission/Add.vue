<template>
  <a-modal
    title="新建/编辑权限"
    :width="640"
    :visible="visible"
    :confirmLoading="showLoading"
    @ok="handleSubmit"
    @cancel="hide"
  >
    <a-spin :spinning="showLoading">
      <a-form :form="form">
        <a-form-item style="display: none">
          <a-input type="hidden" v-decorator="['id']"></a-input>
        </a-form-item>
        <a-form-item label="权限名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: rules.name}]"
            placeholder="请输入权限名"></a-input>
        </a-form-item>
        <a-form-item label="权限标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['code', {rules: rules.code}]" placeholder="权限唯一标识，建议使用权限名英文字母"></a-input>
        </a-form-item>
        <a-form-item label="上级权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['pid', {rules: rules.pid}]" style="width: 180px">
            <a-select-option v-for="(p, index) in parents" :value="p.id" :key="index">{{p.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import PermissionApi from '@/api/permission'
import AddModal from './Add'

export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      rules: {
        name: [{ required: true, message: '权限名不能为空' }, { max: 30, message: '最大长度不超过30字节' }],
        code: [{ required: true, message: '权限标识不能为空' }, { max: 30, message: '最大长度不超过30字节' }],
        pid: [{ required: true, message: '上级权限不能为空' }]
      },
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this),
      parents: [{ id: 0, pid: 0, name: '根权限' }]
    }
  },
  created() {
    this.$nextTick(() => {
      PermissionApi.getParent().then(res => {
        this.parents = this.parents.concat(res.data)
      })
    })
  },
  methods: {
    show (params) {
      this.visible = true
      // 编辑赋值
      if (params) {
        this.$nextTick(() => {
          this.form.setFieldsValue(params)
        })
      }
    },
    hide() {
      this.visible = false
      this.form.resetFields()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.showLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (values.id) {
            PermissionApi.update(values).then(res => {
              this.handleSuccess()
            })
          } else {
            PermissionApi.add(values).then(res => {
              this.handleSuccess()
            })
          }
        }
        this.showLoading = false
      })
    },
    handleSuccess () {
      this.visible = false
      this.$emit('ok')
      this.form.resetFields()
    }
  }
}
</script>
