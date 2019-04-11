<template>
  <div class="new-good">
    <Form inline :label-width="100" :model="formData" ref="formData" enctype="multipart/form-data">
      <!-- :rules="formRules" -->
      <FormItem class="form-item" label="商品主图">
        <!-- <Upload
          ref='upload'
          :data="{ imgType: 'shop' }"
          name="image"
          :show-upload-list="false"
          :format="['jpg', 'jpeg', 'png']"
          :on-progress="handleUploading"
          :on-success="hanldeUploadSuccess"
          :on-error="handleUploadError">
          <Button type="ghost" icon="ios-cloud-upload-outline" @click="uploadPic">上传主图</Button>
        </Upload>
        <span class="tip">*推荐图片尺寸比例为1:1</span> -->
        <!-- <input ref="img" id="img" type="file" class="upload__input" @change="fileimages" accept="image/png,image/gif,image/jpg,image/jpeg" :on-success="hanldeUploadSuccess">
        <Upload action="http://localhost:8080//insertFile.json" :before-upload="handleUpload">
          <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
        </Upload> -->
        <!-- <input type="file" id="image" @change="fileimages">bendi tupian -->
        <input id="image" type="file" @change="fileimages" accept="image/png,image/gif,image/jpg,image/jpeg">
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { ApiInsertFile } from '@/api'
export default {
  data () {
    return {
      userInfo: this.$cookies.get('userInfo'),
      formData: {
          imgUrl: ''
      },
      file: null,
      loadingStatus: false
    }
  },
  methods: {
    fileimages () {
    var reader = new FileReader()
    var AllowImgFileSize = 2100000 //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
    // var file = $("#image")[0].files[0]
    var file = window.document.getElementById('image').files[0]
    // console.log(file)
    var imgUrlBase64
      if (file) {
        //将文件以Data URL形式读入页面
        imgUrlBase64 = reader.readAsDataURL(file)
        reader.onload = async function (e) {
          //var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
          if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
                alert( '上传失败，请上传不大于2M的图片！')
                return
          } else {
            //执行上传操作
            // alert(reader.result)
            // 获取base64图片编码
            let str = reader.result
            console.log(str)
            let str1 = str.indexOf(',')
            console.log(str1)
            let str2 = str.substring(str1+1)
            console.log(str2)
            // str.subString(0,str.indexOf(";"))
            let data = {
              images: str2
            }
            // let images = reader.result
            const res = await ApiInsertFile(data)
            console.log(res)
          }
        }
      }
    }
  }
}

</script>