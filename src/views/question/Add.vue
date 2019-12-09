<template>
  <a-card :bordered="false">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item style="display: none">
        <a-input type="hidden" v-decorator="['id']"></a-input>
      </a-form-item>

      <a-form-item label="技术方向:" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group @change="onChange" v-decorator="['skill']">
          <a-radio-button class="select-btn" :value="item.id" v-for="item in skills">{{item.name}}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="技能标签:" :labelCol="labelCol" :wrapperCol="wrapperCol" class="selext-box">
        <div>
          <a-radio-button :class="{'ant-radio-button-wrapper-checked': skillTagIds.indexOf(item.id)>-1 }" @click="checkBoxClick(item)"
                          class="select-btn " :value="item.id" v-for="item in skillTags">{{item.name}}
          </a-radio-button>
        </div>
      </a-form-item>

      <a-form-item label="题型:" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group @change="onChange" v-decorator="['type']" v-model="queryParam.type">
          <a-radio-button class="select-btn" :value="item.id" v-for="item in questionTypes">{{item.name}}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
<!--
      <div v-for="(item,index) in queryParam.questionDetails" :key="index">
        <a-form-item label="答案选项:" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="Basic usage"   v-decorator="[`questionDetails[${index}].content`]"  />

          <a-checkbox-group @change="questionChange">
            <a-row >
              <a-col :span="24" style="margin-top: 10px" >
                <a-checkbox value="index" style="display: flex;align-items: center">
                  <a-input placeholder="Basic usage"   v-decorator="[`questionDetails[${index}].content`]"  />
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </div>-->

      <a-form-item label="题干信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea v-decorator="['title']" placeholder="题干信息" :rows="4"></a-textarea>
      </a-form-item>

      <div >
        <a-form-item label="答案选项:" :labelCol="labelCol" :wrapperCol="wrapperCol"  v-show="queryParam.type==1 || queryParam.type==2">
          <a-checkbox-group @change="questionChange" v-decorator="['checkboxGroup']">
            <a-row >
              <a-col :span="24" style="margin-top: 10px" v-for="(item,index) in queryParam.questionDetails" :key="index">
                <a-checkbox :value="index" style="display: flex;align-items: center;width: 100%">
                  <div style="display: flex;align-items: center">
                    <span style="margin: 0px 10px 0px 5px">{{selectLetters[index]}}</span>
                    <a-input placeholder="填写选项内容"   style="width: 500px"  v-decorator="[`questionDetails[${index}].content`]"  />
                  <!--  <a-icon type="plus-circle" theme="twoTone" style="font-size: 20px;margin-left: 10px"/>
                    <a-icon type="minus-circle" theme="twoTone" style="font-size: 20px;margin-left: 10px"/>-->

                  </div>
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </div>


      <a-form-item label="难度系数:" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group @change="onChange" v-decorator="['level']">
          <a-radio-button class="select-btn" :value="item.id" v-for="item in levels">{{item.name}}</a-radio-button>
        </a-radio-group>
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
import QuestionApi from '@/api/question'
import pick from 'lodash.pick'

const phoneRegx = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/

export default {
  components: {
    SingleUpload
  },
  data () {
    const id = this.$route.query.id;
    const question = {
      content:"",
      isAnswer:0
    }
    return {
      queryParam:{
        password:"1212",
        skillTagIds:[],
        type:null,
        checkboxGroup:[],

        questionDetails:[
          {
            content:"",
            isAnswer:0
          },
          {
            content:"",
            isAnswer:0
          },
          {
            content:"",
            isAnswer:0
          },
          {
            content:"",
            isAnswer:0
          },
        ],
      },
      id: id,
      placeholder: id ? '不填写则使用原来密码' : '请输入密码',
      roles: [],
      labelCol: {
        lg: { span: 7 }, sm: { span: 7 }
      },
      wrapperCol: {
        lg: { span: 10 }, sm: { span: 17 }
      },
      skills: [
/*
        {name: "全部", id: null},
*/
        {name: "Java开发", id: 1},
      ],
      skillTags: [
/*
        {name: "全部", id: null},
*/
        {name: "mysql", id: 1},
        {name: "spring", id: 2},
        {name: "Spring boot", id: 3},
        {name: "mybatis", id: 4},
        {name: "jpa", id: 5},
      ],
      skillTagIds: [],
      questionTypes: [
/*
        {name: "全部", id: null},
*/
        {name: "单选题", id: 1},
        {name: "多选题", id: 2},
        {name: "问答题", id: 3},
        {name: "编程题", id: 4},
      ],
      levels: [
/*
        {name: "全部", id: null},
*/
        {name: "易", id: 1},
        {name: "偏易", id: 2},
        {name: "适中", id: 3},
        {name: "偏难", id: 4},
        {name: "难", id: 5},
      ],
      selectLetters: [
        "A",
        "B",
        "C",
        "D",
      ],
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
    questionChange() {

    },
    checkBoxClick(item) {
      const id = item.id;
      if(id==null){
        const ids = [];
        for (let i = 0; i < this.skillTags.length; i++) {
          if(this.skillTags[i].id!=null){
            ids.push(this.skillTags[i].id);
          }
        }
        this.queryParam.skillTagIds = ids.join(",")
        this.skillTagIds = [null];
      }else{
        for (let i = 0; i < this.skillTagIds.length; i++) {
          if(this.skillTagIds[i]==null){
            this.skillTagIds.splice(i, 1)
          }
        }
        console.log("this.skillTagIds")

        console.log(this.skillTagIds)

        const index = this.skillTagIds.indexOf(item.id);
        if (index > -1) {
          this.skillTagIds.splice(index, 1)
        } else {
          this.skillTagIds.push(item.id)
        }
        this.queryParam.skillTagIds = this.skillTagIds.join(",")
      }

      this.onChange()
    },

    onChange() {},
    handleSubmit (e) {
      e.preventDefault()


   /*   console.log(this.queryParam.questionDetails[0].content)
      return*/
  /*    const  data ={
        "id":65,
        "skill": 1,
        "type": 1,
        "title": "—&&222&&&&—测试",
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

      QuestionApi.getQuestion(64).then(res =>{
        console.log(res)

      })
*/
/*
      return
*/


      this.form.validateFields((err, values) => {

        const checkboxGroup = values.checkboxGroup;
        const questionSkillTags = [];
        for (let i = 0; i < checkboxGroup.length; i++) {
            const obj = {};
            obj.tagId = checkboxGroup[i];
          questionSkillTags.push(obj);
          values.questionDetails[checkboxGroup[i]].isAnswer=1;
        }

        for (let i = 0; i < values.questionDetails.length; i++) {
          if(values.questionDetails[i].isAnswer!=1){
            values.questionDetails[i].isAnswer=0
          }
        }

        values.questionSkillTags = questionSkillTags;

        if(values.type==1 ){
          if(values.checkboxGroup.length>1){
            alert("单选题哦")
            return
          }
        }


        if (!err) {
          if (!this.id) {
            QuestionApi.addQuestion(values).then(res => {
              this.$message.success("添加试题成功")
              this.$router.push('/question')
            })
          } else {
            QuestionApi.updateQuestion(values).then(res => {
              this.$message.success("修改试题成功")
              this.$router.push('/question')
            })
          }
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    }
  },
  mounted() {
    this.form.setFieldsValue(this.queryParam)
    console.log("this.form")
    console.log(this.form)
  }
}
</script>
<style>
  .select-btn {
    margin: 0px 10px;
  }

</style>
