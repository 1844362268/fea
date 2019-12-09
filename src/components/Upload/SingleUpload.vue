<template>
  <div class="clearfix">
    <a-upload
      name="file"
      :listType="listType"
      class="avatar-uploader"
      :showUploadList="showUploadList"
      :action="action"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :remove="handleRemove"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
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
  name: 'SingleUpload',
  props: {
    value: String,
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
    limitSize: Object // 上传尺寸限制 {width: 200, height: 300}
  },
  data() {
    return {
      previewVisible: false
    }
  },
  computed: {
    previewImage: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
      }
    },
    previewImageName() {
      if (this.value !== null && this.value !== '' && this.value !== undefined) {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      if (!this.value) {
        return []
      }
      return [
        {
          uid: new Date().getTime(),
          status: 'done',
          response: { url: this.value },
          name: this.previewImageName,
          thumbUrl: this.value
        }]
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('change', val)
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
      if (file && file.response) {
        this.emitInput(file.response.data.url)
      }
      this.fileList.pop()
      this.fileList.push(file)
    },
    handleRemove(file) {
      this.emitInput('')
    }
  }
}
</script>
<style>
  .ant-upload-list-picture-card
  .ant-upload-list-item, .ant-upload.ant-upload-select-picture-card {
    width: 90px !important;
    height: 90px !important;
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