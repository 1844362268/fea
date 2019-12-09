<template>
  <div>
    <a-card style="display: flex;flex-direction: row-reverse;background: #f0f2f5;border:0px">

      <a-button style="margin-right: 10px" size="large" type="default" @click="handleBatchAdd()">批量导入</a-button>
      <a-button type="primary"  size="large"  @click="handleAdd()">导入试题</a-button>

    </a-card>

    <a-card :bordered="false">
      <a-form>
        <a-form-item label="技术方向:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group @change="onChange" v-model="queryParam.skill">
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
          <a-radio-group @change="onChange" v-model="queryParam.type">
            <a-radio-button class="select-btn" :value="item.id" v-for="item in questionTypes">{{item.name}}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>


        <a-form-item label="难度系数:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group @change="onChange" v-model="queryParam.level">
            <a-radio-button class="select-btn" :value="item.id" v-for="item in levels">{{item.name}}</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-row>

        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <s-list
        ref="table"
        rowKey="id"
        :data="loadData"
        showPagination="auto">
        <span slot-scope="text, record">
          <template>
           <a-card hoverable style="width: 100%">
            <div>{{record.type | typeFormat}}{{record.title}}</div>
             <a-list itemLayout="horizontal" :dataSource="record.questionDetails">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <p class="select-p">
                  <span class="select-span active" v-show="item.isAnswer">{{selectLetters[index]}}.</span>
                  <span class="select-span" v-show="!item.isAnswer">{{selectLetters[index]}}.</span>
                  {{item.content}}</p>
              </a-list-item>
  </a-list>
    <template class="ant-card-actions" slot="actions">

     <p> 技术方向：<!--{{record.skill}}--> java</p>
     <p> 技能标签：<span v-for="tag in record.questionSkillTags">{{tag.tagName}};</span></p>
     <p> 组卷次数：{{record.usedNum}}次</p>
     <p> 难度系数：{{record.level | levelFormat}}</p>
    </template>
  </a-card>
        </template>
      </span>
      </s-list>
    </a-card>
  </div>
</template>

<script>
  import {SList} from '@/components'
  import AccountApi from '@/api/account'
  import QuestionApi from "@/api/question";

  let vm = {};
  export default {
    name: 'TableList',
    components: {
      SList
    },
    data() {
      vm = this;
      return {
        labelCol: {
          lg: {span: 1}, sm: {span: 7}
        },
        wrapperCol: {
          lg: {span: 23}, sm: {span: 17}
        },
        skills: [
          {name: "全部", id: null},
          {name: "Java开发", id: 1},
        ],
        skillTags: [
          {name: "全部", id: null},
          {name: "mysql", id: 1},
          {name: "spring", id: 2},
          {name: "Spring boot", id: 3},
          {name: "mybatis", id: 4},
          {name: "jpa", id: 5},
        ],
        skillTagIds: [],
        questionTypes: [
          {name: "全部", id: null},
          {name: "单选题", id: 1},
          {name: "多选题", id: 2},
          {name: "问答题", id: 3},
          {name: "编程题", id: 4},
        ],
        levels: [
          {name: "全部", id: null},
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
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return QuestionApi.getQuestions(Object.assign(parameter, this.queryParam)).then(res => {
            return res.data
          })
        },
      }
    },
    filters: {
      typeFormat: function (value) {
        const type = _.findIndex(vm.questionTypes, ['id', value]);
        return "[" + vm.questionTypes[type].name + "]";
      },
      levelFormat: function (value) {
        const type = _.findIndex(vm.levels, ['id', value]);
        return vm.levels[type].name;
      },
    },
    methods: {
      checkBoxClick(item) {
        const id = item.id;
        console.log("id")
        console.log(id)
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
      onChange() {
        this.refresh()
      },
      handleAdd() {
        this.$router.push('question/add')
      },
      handleBatchAdd() {
        this.$router.push('question/BatchAdd')
      },
      handleEdit(record) {
        this.$router.push({path: 'account/add', query: {id: record.id}})
      },
      handleDelete(record) {
        AccountApi.deleteAccount(record.id).then(res => {
          this.$message.success("删除成功")
          this.refresh()
        })
      },
      refresh() {
        this.$refs.table.refresh()
      },
      reset() {
        this.queryParam = {}
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style scoped lang="less">
  .select-btn {
    margin: 0px 10px;
  }

  .select-p {
    display: flex;
    align-items: center; /*  子元素相对父元素垂直居中 */

  }

  .select-span {
    text-align: center;
    align-items: center; /*  子元素相对父元素垂直居中 */
    justify-content: center;
    display: flex;
    width: 25px;
    height: 25px;
    border-radius: 12.5px;
    margin-right: 5px;
  }

  .active {
    color: white;
    background: #0082E9;

  }

  .selext-box {

/*    .checkBoxChecked {
      color: #1b9aee;
      border-color: #1b9aee;
      -webkit-box-shadow: -1px 0 0 0 #1b9aee;
      box-shadow: -1px 0 0 0 #1b9aee;
    }*/
  }

</style>
