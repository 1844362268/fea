<template>
  <a-card :bordered="false">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item style="display: none">
        <a-input type="hidden" v-decorator="['id']"></a-input>
      </a-form-item>
      <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="['name', {rules: rules.name}]"
          placeholder="请输入用户名"></a-input>
      </a-form-item>
      <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-password
          v-decorator="['password', {rules: rules.password}]" :placeholder="placeholder"></a-input-password>
      </a-form-item>
      <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-decorator="['roleId', {rules: rules.roleId}]" style="width: 180px">
          <a-select-option v-for="(role, index) in roles" :value="role.id" :key="index">{{role.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="['phone', {rules: rules.phone}]"
          placeholder="请输入联系电话"></a-input>
      </a-form-item>
      <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <single-upload
          v-decorator="['avatar']"
          :action="uploadUrl"
        ></single-upload>
      </a-form-item>
      <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea v-decorator="['remark', {rules: rules.remark}]" placeholder="备注信息" :rows="4"></a-textarea>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
        <a-button style="margin-left: 8px" @click="handleCancel()">取消</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import SingleUpload from '@/components/Upload/SingleUpload'
import RoleApi from '@/api/role'
import AccountApi from '@/api/account'
import pick from 'lodash.pick'

const phoneRegx = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/

export default {
  components: {
    SingleUpload
  },
  data () {
    const id = this.$route.query.id
    return {
      id: id,
      placeholder: id ? '不填写则使用原来密码' : '请输入密码',
      roles: [],
      labelCol: {
        lg: { span: 7 }, sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 }, sm: { span: 17 }
      },
      rules: {
        name: [{ required: true, message: '用户名不能为空' }, { max: 30, message: '最大长度不超过30字节' }],
        password: [{ required: !id, message: '请输入密码' }],
        phone: [{ pattern: phoneRegx, message: '请输入正确的手机号' }],
        roleId: [{ required: true, message: '角色不能为空' }],
        remark: [{ max: 100, message: '最大长度不超过100字节' }]
      },
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/user/upload',
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.$nextTick(() => {
      // 角色列表
      RoleApi.getList().then(res => {
        this.roles = res.data
      })
      // 用户编辑数据获取
      if (this.id) {
        AccountApi.getAccount(this.id).then(res => {
          this.form.setFieldsValue(res.data)
        })
      }
    })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.id) {
            AccountApi.addAccount(values).then(res => {
              this.$message.success("添加用户成功")
              this.$router.push('/account')
            })
          } else {
            AccountApi.updateAccount(values).then(res => {
              this.$message.success("修改用户成功")
              this.$router.push('/account')
            })
          }
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style>
</style>
