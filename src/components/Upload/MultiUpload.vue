<template>
  <div class="clearfix">
    <a-upload
      name="file"
      :listType="listType"
      :class="[custom]"
      :showUploadList="showUploadList"
      :action="action"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :remove="handleRemove"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < limit">
        <a-icon type="plus"/>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'MultiUpload',
  props: {
    value: Array,
    listType: {
      type: String,
      default: 'picture-card'
    },
    showUploadList: {
      type: Boolean,
      default: true
    },
    custom: String,
    action: String,
    limit: {
      type: Number,
      default: 3
    }, // 上传数量限制，默认为3个
    limitSize: Object // 上传尺寸限制 {width: 200, height: 300}
  },
  data() {
    return {
      previewVisible: false,
      previewImage: null,
      fileList: []
    }
  },
  computed: {
    defFileList() {
      let fileList = []
      for (let i = 0; i < this.value.length; i++) {
        fileList.push(
          {
            uid: -new Date().getTime(),
            status: 'done',
            response: { url: this.value[i] },
            name: this.imageName(this.value[i]),
            thumbUrl: this.value[i]
          }
        );
      }
      return fileList;
    }
  },
  created(){
    this.fileList = this.defFileList
  },
  methods: {
    imageName(val) {
      if (val !== null && val !== '' && val !== undefined) {
        return val.substr(val.lastIndexOf("/") + 1)
      } else {
        return null
      }
    },
    emitInput(fileList) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].response.url)
      }
      this.$emit('input', value)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPG) {
        this.$message.error('图片格式不正确，只能上传jpg、png格式图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小不超过 2MB!');
      }

      const that = this.limitSize
      if (that) {
        const isSize = new Promise(function(resolve, reject) {
          let width = that.width
          let height = that.height
          let _URL = window.URL || window.webkitURL
          let img = new Image()
          img.onload = function() {
            let valid = img.width == width && img.height == height
            valid ? resolve() : reject()
          }
          img.src = _URL.createObjectURL(file)
        }).then(() => {
          return file
        }, () => {
          this.$message.error('图片尺寸不符合规范，大小限制为宽：' + that.width + "px,高：" + that.height + 'px')
          return Promise.reject()
        })
        return isJPG && isLt2M && isSize;
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      if (file && file.status === 'done') {
        this.emitInput(this.fileList)
      }
      if (file && file.status !== 'error') {
        this.fileList = fileList
      }
    },
    handleRemove(file) {
      let newFileList = []
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.uid !== this.fileList[i].uid) {
          newFileList.push(this.fileList[i])
        }
      }
      this.fileList = newFileList
      this.emitInput(this.fileList)
    }
  }
}
</script>
<style>
  .avatar-uploader > img {
    width: 80px;
    height: 80px;
  }

  .ant-upload-select-picture-card i {
    font-size: 16px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>