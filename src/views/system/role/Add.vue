<template>
  <a-modal
    title="新建/编辑角色"
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
        <a-form-item label="角色名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: rules.name}]"
            placeholder="请输入角色名"></a-input>
        </a-form-item>
        <a-form-item label="角色标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['code', {rules: rules.code}]" placeholder="角色唯一标识，建议使用角色名英文字母"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import RoleApi from '@/api/role'

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
        name: [{ required: true, message: '角色名不能为空' }, { max: 30, message: '最大长度不超过30字节' }],
        code: [{ required: true, message: '角色标识不能为空' }, { max: 30, message: '最大长度不超过30字节' }]
      },
      visible: false,
      showLoading: false,
      form: this.$form.createForm(this)
    }
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
            RoleApi.update(values).then(res => {
              this.handleSuccess()
            })
          } else {
            RoleApi.add(values).then(res => {
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
