<template>
  <a-card :bordered="false">
    <a-steps :current="current">
      <a-step>
        <!-- <span slot="title">Finished</span> -->
        <template slot="title">
          上传文件
        </template>
<!--
        <span slot="description">上传文件</span>
-->
      </a-step>
      <a-step title="执行导入" />
      <a-step title="完成导入" />
    </a-steps>

    <div class="steps-content">
      <!--step1-->
      <div v-show="current==0">
        <a-row :gutter="16">
        <a-col :md="2">
          <a-icon :component="DownLoadSvg" />
        </a-col>
        <a-col :md="22">
          <p>请填写信息表</p>
          <p>请按照预设模板的格式进行试题导入，保证所有单元格均为文本格式，为防止解析出错，不同题型请放入不同单元簿中题目描述、选项、答案皆为必填。</p>
          <a>下载模版</a>
        </a-col>
        </a-row>

        <a-row :gutter="16">
        <a-col :md="2">
          <a-icon :component="UploadSvg" />
        </a-col>
        <a-col :md="22">
          <p>请填写信息表</p>
          <p>请按照预设模板的格式进行试题导入，保证所有单元格均为文本格式，为防止解析出错，不同题型请放入不同单元簿中题目描述、选项、答案皆为必填。</p>
          <a>上传文件</a>
        </a-col>
        </a-row>
      </div>

      <!--step2-->
      <div >

      </div>

      <!--step3-->
      <div >

      </div>

      <a-row :gutter="16" v-show="current==1">
        2
      </a-row>
      <a-row :gutter="16" v-show="current==2">
        3
      </a-row>
    </div>
    <div class="steps-action">
      <a-button v-if="current < 0" type="primary" @click="next">
        取消
      </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">
        下一步
      </a-button>
      <a-button
        v-if="current == steps.length - 1"
        type="primary"
        @click="$message.success('Processing complete!')"
      >
        完成
      </a-button>
      <a-button v-if="current>0" style="margin-left: 8px" @click="prev">
        上一步
      </a-button>
    </div>



  </a-card>
</template>

<script>
  import SingleUpload from '@/components/Upload/SingleUpload'
  import RoleApi from '@/api/role'
  import QuestionApi from '@/api/question'
  import DownLoadSvg from '@/assets/icons/download.svg'
  import UploadSvg from '@/assets/icons/upload.svg'
  import pick from 'lodash.pick'

  const phoneRegx = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/

  export default {
    components: {
      SingleUpload,
      DownLoadSvg,
      UploadSvg,
    },
    data() {
      const id = this.$route.query.id
      return {

        current: 0,
        steps:[1,2,3],
        fileList: [],
        id: id,
        placeholder: id ? '不填写则使用原来密码' : '请输入密码',
        roles: [],
        labelCol: {
          lg: {span: 7}, sm: {span: 7}
        },
        wrapperCol: {
          lg: {span: 10}, sm: {span: 17}
        },
        rules: {
          name: [{required: true, message: '用户名不能为空'}, {max: 30, message: '最大长度不超过30字节'}],
          password: [{required: !id, message: '请输入密码'}],
          phone: [{pattern: phoneRegx, message: '请输入正确的手机号'}],
          roleId: [{required: true, message: '角色不能为空'}],
          remark: [{max: 100, message: '最大长度不超过100字节'}]
        },
        uploadUrl: process.env.VUE_APP_API_BASE_URL + '/user/upload',
        questionUploadUrl: process.env.VUE_APP_API_BASE_URL + 'question/upload',
        form: this.$form.createForm(this),
        headers:{},
      }
    },
    created() {
      this.headers.Authorization ="BearereyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1NzU3NDcxMTgsInN1YiI6ImplZmZpZTkiLCJjcmVhdGVkIjoxNTc1NzExMTE4NzMzfQ.SM_3WJ5m0Hs2UCKPCnZT6p2LH9eZHq_7jgqyr2wUfQgrIj_LUA8AX80RkYJ7KgtIwR93imQ4C2jGCnSSzItgjg";

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
      next() {
        this.current++;
      },
      prev() {
        this.current--;
      },
      handleChange(info) {

        if(info.file.status=="done"){
          console.log("答案")

          info.fileList.map(item => {
            console.log(item.response);

          })


          return
        }

    //    console.log(info)
    //    console.log(info.event)
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });

        this.fileList = fileList;
      },
      handleSubmit(e) {
        e.preventDefault()

        const data = {
          "skill": 1,
          "type": 1,
          "title": "—&&&&&&—测试",
          "level": 1,
          "questionSkillTags": [ //标签ID
            {
              "tagId": 1
            },
            {
              "tagId": 2
            }
          ],
          "questionDetails": [ //选项ID
            {
              "content": "选项1",
              "isAnswer": 0
            },
            {
              "content": "选项2",
              "isAnswer": 0
            },
            {
              "content": "正确选项",
              "isAnswer": 1
            }
          ]
        };

        QuestionApi.addQuestion(data).then(res => {
          console.log(res)

        })

        return


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
