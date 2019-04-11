<style lang="less" scoped>
@import './index.less';
</style>

<template>
<!-- 2018.8.28.19.30 -->
  <div class="new-good">
    <Form inline :label-width="100" :model="formData" :rules="formRules" ref="form">
      <FormItem class="form-item" label="商品名称" prop="goodsName">
        <Input v-model="formData.goodsName"></Input>
      </FormItem>
      <FormItem class="form-item" label="商品库存" prop="amount">
        <Input v-model="formData.amount"></Input>
      </FormItem>
      <FormItem class="form-item" label="商品价格" prop="price">
        <Input v-model="formData.price"></Input>
      </FormItem>
      <!-- <FormItem class="form-item" style="color:" label="注意">
        如果您的商品需要单独支付邮费,请在填写价格时将邮费计算在其中(商品价格 = 商品售价 + 邮费)
      </FormItem> -->
      <br />
      <!-- <FormItem class="form-item" :label="JSON.parse(this.$cookies.get('userInfo')).id === -5 || JSON.parse(this.$cookies.get('userInfo')).isAdmin === 1 ? '积分最高可抵扣' : '最低折扣价'" prop="lowest_discountPrice">
        <Input v-model="formData.lowest_discountPrice"></Input>
      </FormItem> -->
      <FormItem class="form-item" label="商品类型" prop="categoryId">
        <!-- <Select v-model="formData.categoryId" style="width:162px">
          <Option v-for="(item, index) in typeData" :key="item.categoryName" :value="item.id" v-text="item.categoryName"></Option>
        </Select> -->
        <Cascader :data="typeData" v-model="formData.categoryId"></Cascader>
      </FormItem>
      <FormItem class="form-item" label="商品标题">
        <Input v-model="formData.title"></Input>
      </FormItem>
      <!-- 商品总体积分抵扣 -->
      <!-- <FormItem class="form-item" :label="userInfo.id === -5 || userInfo.isAdmin === 1 ? '积分最高可抵扣' : '最低折扣价'" prop="lowest_discountPrice">
        <Input v-model="formData.lowest_discountPrice"></Input>
      </FormItem> -->
      <FormItem class="form-item" label="商品邮费">
        <Input v-model="formData.postage" type="number" placeholder="不填写则默认包邮"></Input>
      </FormItem>
      <br />
      <FormItem class="form-item" label="商品备注">
        <Input v-model="formData.remark"></Input>
      </FormItem>
      <!-- <FormItem class="form-item" prop="promotionPrice" label="商品促销价" v-if="JSON.parse(this.$cookies.get('userInfo')).id === -4">
        <Input v-model="formData.promotionPrice"></Input>
      </FormItem> -->
      <!-- <FormItem class="form-item" label="套餐商品">
        <Switch v-model="formData.set_meal" :true-value="1" :false-value="0">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </Switch>
      </FormItem> -->
       <!-- <FormItem class="form-item" label="销售额提点">
        <Input v-model="formData.remark"></Input>
      </FormItem>
       <FormItem class="form-item" label="差价">
        <Input v-model="formData.remark"></Input>
      </FormItem> -->
      <!-- <br/> -->
      <!-- <FormItem class="form-item" label="添加优惠券" v-if="JSON.parse(this.$cookies.get('userInfo')).id === -1 && $route.query.goodsEvents !== 'edit'">
        <Switch v-model="cuponIsUse" :true-value="1" :false-value="0">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </Switch>
      </FormItem>
      <br/> -->
      <!-- <FormItem class="form-item" label="选择优惠券" prop="cuponIsName" v-if="cuponIsUse === 1">
        <Select style="width:200px" v-model="cuponIsName" on-change="">
          <Option v-for="item in couponData" :value="tem.coupon_id" :key="item.coupon_id">{{ item.coupon_name }}</Option>
        </Select> -->
        <!-- <Cascader :data="couponData" v-model="formData.cuponIsName" @anchange="getCouponList"></Cascader> -->
      <!-- </FormItem>
      <br/> -->
      <FormItem class="form-item" label="总量" prop="totalNum" v-if="formData.set_meal === 1">
        <Input v-model="formData.totalNum"></Input>
      </FormItem>
      <FormItem class="form-item" label="单次配送数量" prop="singleNum" v-if="formData.set_meal === 1">
        <Input v-model="formData.singleNum"></Input>
      </FormItem>
      <br />
      <FormItem class="form-item" label="商品主图" prop="imgURL">
        <Upload
          :action="addPicAdress"
          :data="{ imgType: 'shop' }"
          name="image"
          :show-upload-list="false"
          :format="['jpg', 'jpeg', 'png', 'mp4']"
          :on-progress="handleUploading"
          :on-success="hanldeUploadSuccess"
          :on-error="handleUploadError">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传主图</Button>
        </Upload>
        <span class="tip">*推荐图片尺寸比例为1:1</span>
      </FormItem>
      <Carousel
        v-if="formData.imgURL.length > 0"
        :autoplay="formData.imgURL.length > 1"
        :autoplay-speed="5000"
        class="picPreview"
        v-model="previewPicIndex">
        <CarouselItem v-for="(pic, picIndex) in formData.imgURL" :key="pic">
          <div class="craouselDiv">
            <Button type="error" @click.native="handleDeleteImg(picIndex)" class="craouselDele" icon="trash-b" shape="circle"></Button>
            <img style="width: 100%" :src="`${utils.handleImgPrefix(pic)}`" alt="">
          </div>
        </CarouselItem>
      </Carousel>
      <br />
      <FormItem class="form-item" label="商品规格">
        <Button @click="handleAddSpec" type="primary">
          <Icon type="plus-round"></Icon>
          添加规格
        </Button>
      </FormItem>
      <FormItem class="form-item" label="规格须知:">
        如果您的商品需要添加积分抵扣，请设置对应的规格价格和抵扣的积分(抵扣积分不得大于等于规格价格)。<span style="color:red;">一旦添加规格，则规格价格为必填项！</span>
      </FormItem>
      <br />
      <template v-for="(item, index) in specList">
        <FormItem class="form-item" label="规格名称">
          <Input v-model="item.attributeName"></Input> 
        </FormItem>
        <FormItem class="form-item" label="规格参数">
          <Input v-model="item.value"></Input> 
        </FormItem>
        <br />
        <FormItem class="form-item" label="规格库存">
          <Input v-model="item.amount"></Input>
        </FormItem>
        <FormItem class="form-item" label="规格价格">
          <Input v-model="item.price"></Input>
        </FormItem>
        <FormItem class="form-item" :label="userInfo.id === -5 || userInfo.isAdmin === 1 ? '积分最高可抵扣' : '最低折扣价'" prop="integralDeduction">
          <Input v-model="item.integralDeduction"></Input>
        </FormItem>
        <FormItem :label-width="1">
          <Button size="small" @click="handleRemoveSpec(index)" shape="circle" type="warning" icon="minus-round"></Button>
        </FormItem>
        <hr style="margin-bottom:20px;">
      </template>
    </Form>
    <Card shadow>
      <p slot="title">商品详情</p>
      <p slot="extra">
        <Button :loading="isLoading" type="primary" @click="submitProdInfo">{{submitBtnEadit}}</Button>
      </p>
      <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
    </Card>
    <!-- 裁剪图片弹框 -->
    <Modal
      :width="60"
      v-model="showCropper"
      @on-ok="handleCropperSure">
      <div>
        <Alert style="margin-top: 20px" type="success">
          <p style="color: red">按住shift可保持当前比例拖动</p>
          <span> --- 宽：{{ cropperSize.w }} --- 高：{{ cropperSize.h }} --- 当前宽高比：{{ parseFloat(cropperSize.w / cropperSize.h) }} --- </span>
        </Alert>
        <img id="cropper" style="width: 600px" :src="`${utils.handleImgPrefix(waitForCropperImg)}`">
      </div>
    </Modal>
  </div>
</template>

<script>
import { ApiGetAddGoods, ApiUpdateGoods, ApiGetGoodsCategory, API_UPLOADPIC, ApiTailorImage, ApiUploadPic, ApiFindCouponList, ApiDeleteGoodsSpecification } from '@/api'
// 富文本编辑器
import tinymce from 'tinymce'
// 样式
import 'tinymce/themes/modern/theme.js'
import 'tinymce/skins/lightgray/skin.min.css'
import 'tinymce/skins/lightgray/content.min.css'
// 语言
import '@/lib/zh_CN.js'
// 插件
import 'tinymce/plugins/advlist/plugin.min.js'
import 'tinymce/plugins/autolink/plugin.min.js'
import 'tinymce/plugins/lists/plugin.min.js'
import 'tinymce/plugins/link/plugin.min.js'
import 'tinymce/plugins/image/plugin.min.js'
import 'tinymce/plugins/charmap/plugin.min.js'
import 'tinymce/plugins/print/plugin.min.js'
import 'tinymce/plugins/preview/plugin.min.js'
import 'tinymce/plugins/hr/plugin.min.js'
import 'tinymce/plugins/anchor/plugin.min.js'
import 'tinymce/plugins/pagebreak/plugin.min.js'
import 'tinymce/plugins/imagetools/plugin.min.js'
import 'tinymce/plugins/searchreplace/plugin.min.js'
import 'tinymce/plugins/visualblocks/plugin.min.js'
import 'tinymce/plugins/visualchars/plugin.min.js'
import 'tinymce/plugins/fullpage/plugin.min.js'
import 'tinymce/plugins/insertdatetime/plugin.min.js'
import 'tinymce/plugins/media/plugin.min.js'
import 'tinymce/plugins/nonbreaking/plugin.min.js'
import 'tinymce/plugins/save/plugin.min.js'
import 'tinymce/plugins/table/plugin.min.js'
import 'tinymce/plugins/contextmenu/plugin.min.js'
import 'tinymce/plugins/directionality/plugin.min.js'
import 'tinymce/plugins/paste/plugin.min.js'
import 'tinymce/plugins/textcolor/plugin.min.js'
import 'tinymce/plugins/colorpicker/plugin.min.js'
import 'tinymce/plugins/textpattern/plugin.min.js'

// 图片裁剪
// import Cropper from 'cropperjs'
// import 'cropperjs/dist/cropper.min.css'
import { env } from '@/api'

export default {
  data () {
    return {
      userInfo: this.$cookies.get('userInfo'),
      showCropper: false,
      waitForCropperImg: '',
      previewPicIndex: 0,
      bigImgSrc: '',
      submitBtnEadit: '提交新增产品',
      bigImg: false,
      isChooseImg: false,
      cropperSize: {
        x: '',
        y: '',
        w: '',
        h: ''
      },
      couponData: [],
      formData: {
        goodsName: '',
        amount: '',
        price: '',
        // lowest_discountPrice: '',
        contents: '',
        remark: '',
        set_meal: 0,
        title: '',
        imgURL: [],
        categoryId: [],
        totalNum: '',
        singleNum: '',
        postage: 0
      },
      cuponIsUse: '',
      cuponIsName: '',
      formRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(value)
              if (value === '') {
                callback(new Error('请输入商品价格'))
              } else if (!/^-?\d*\.?\d*$/.test(value)){
                callback(new Error('请输入数字'))
              } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                callback(new Error('最多有两位小数点'))
              } else {
                callback()
              }
              // else if ((+value < +this.formData.lowest_discountPrice) && this.formData.lowest_discountPrice || (+value === +this.formData.lowest_discountPrice)) {
              //   callback(new Error('商品价格不能小于积分抵扣价'))
              // } 
            },
            trigger: 'blur' }
        ],
        // lowest_discountPrice: [
        //   {required: false, validator: (rule, value, callback) => {
        //     if ((+value > +this.formData.price && this.formData.price) || (+value === +this.formData.price && this.formData.price)) {
        //       callback(new Error('抵扣价格不能大于商品价格'))
        //     } else {
        //       callback()
        //     }
        //   }, trigger: 'change'}
        // ],
        categoryId: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                callback(new Error('请选择商品类型'))
              } else {
                callback();
              }
            },
            trigger: 'change' }
        ],
        cuponIsName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                callback(new Error('请选择优惠券'))
              } else {
                callback()
              }
            }
          }
        ],
        imgURL: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value && value !== 0) {
                callback(new Error('请上传商品主图'))
              } else {
                callback();
              }
            },
            trigger: 'blur' }
        ],
        amount: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入商品库存'))
              } else if (!/^[1-9]\d*|0$/.test(value)){
                callback(new Error('库存只能是不小于0的整数'))
              } else {
                callback();
              }
            },
            trigger: 'blur' }
        ],
        totalNum: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入总量'))
              } else if (!/^[1-9]\d*|0$/.test(value)) {
                 callback(new Error('总量必须是不小于0的整数'))
              } else {
                callback()
              }
            }
          }
        ],
        singleNum: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入配送数量'))
              } else if (!/^[1-9]\d*|0$/.test(value)) {
                 callback(new Error('配送数量必须是不小于0的整数'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // specItem: {
      //   attributeName: '',
      //   amount: '',
      //   value: '',
      //   price: '',
      //   lowest_discountPrice: ''
      // },
      specList: [],
      cropper: {},
      isLoading: false,
      activeGoods: {},
      typeData: []
    }
  },
  computed: {
    addPicAdress () {
      return API_UPLOADPIC
    }
  },
  methods: {
    // 获取商品类型
    async getGoodsType () {
      const res = await ApiGetGoodsCategory()
      if (res.errorCode > 0) {
        console.log(res)
        let category = this.dealTheGoodType(res.data)
        this.typeData = category
        console.log(this.typeData)
      }
    },
    // 查询优惠券
    async getCouponList () {
      const data = {
        enterpriseId: this.$cookies.get('userInfo').id,
        coupon_status: 1,
        num: 1000000,
        page:1
      }
      const res = await ApiFindCouponList(data)
      if (res.errorCode > 0) {
        this.couponData = res.data
      }
    },
    // 处理商品类型数据
    dealTheGoodType (arr) {
      let tempArr = []
      for (let i of arr) {
        const obj = {
          label: i.categoryName,
          value: i.id,
          parentId: i.parentId
        }
        if (i.categories) {
          obj.children = this.dealTheGoodType(i.categories)
        }
        tempArr.push(obj)
      }
      return tempArr
    },
    // 提交新增产品
    submitProdInfo () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const data = {}
          for (var i in this.formData) {
            // 商品
            if (i === 'amount' || i === 'price') {
              data[i] = +this.formData[i]
            // 类别
            } else if (i === 'categoryId') {
              data[i] = this.formData[i][this.formData[i].length - 1]
              if (this.formData[i].length > 1) {
                data['category_parentId'] = this.formData[i][0]
              }
            } else {
              data[i] = this.formData[i]
            }
          }
          // if (JSON.parse(this.$cookies.get('userInfo')).id === -1 && this.$route.query.goodsEvents !== 'edit') {
          //   data['cuponIsUse'] = this.cuponIsUse
          //   console.log('输出cuponIsUse')
          //   console.log(this.cuponIsUse)
          //   console.log('输出data["cuponIsUse"]')
          //   console.log(data['cuponIsUse'])
          //   data['cuponIsName'] = this.cuponIsName
          // }
          if (this.formData.set_meal !== -1) {
            delete data['totalNum']
            delete data['singleNum']
          }
          data.postage = Number(this.formData.postage)
          if (Number(this.formData.postage) < 0) {
          // if (!Number(this.formData.postage) && Number(this.formData.postage) < 0) {
            this.$Message.warning('邮费输入不正确,请检查后再试')
            return false
          }
          data['imgURL'] = this.formData.imgURL.join(',')
          data.enterpriseId = this.userInfo.id
          console.log('specList内容')
          console.log(this.specList)
          if (this.specList && this.specList.length !== 0) {
            for (let index in this.specList) {
              if (+this.specList[index].integralDeduction >= +this.specList[index].price) {
                this.$Message.warning('您在' + this.specList[index].attributeName + '中的定价不大于抵扣的积分值')
                return false
              }
            }
            data.goodsAttributeList = this.specList
            if (data.goodsAttributeList.length > 0) {
              for (let j of data.goodsAttributeList) {
                j.amount = +j.amount
                j.price = j.price ? +j.price : +data.price
                j.integralDeduction = +j.integralDeduction
              }
            }
          } else {
            delete data['goodsAttributeList']
          }
          data.contents = tinymce.get('tinymceEditer').getContent()
          if (this.userInfo.parentid === 0) {
            data.state = 4
          } else {
            data.state = 0
          }
          // 祥和富杰商户添加促销价格
          // if (JSON.parse(this.$cookies.get('userInfo')).id === -4) {
          //   if (this.formData.promotionPrice !== null && this.formData.promotionPrice !== '') {
          //     let promotionPrice = +this.formData.promotionPrice
          //     data.promotionPrice = +promotionPrice.toFixed(2)
          //   }
          // }
          // ******************* //
          this.isLoading = true
          if (this.$route.query.goodsEvents === 'edit') {
            data.id = this.activeGoods.id
            var res = await ApiUpdateGoods(data, 0)
          } else {
            var res = await ApiGetAddGoods(data)
          }
          this.isLoading = false
          this.$Message.success(res.msg)
          if (res.errorCode > 0) {
            this.$router.push({name: 'goods'})
          }
        }
      })
    },
    //tinymce Init
    init () {
      this.$nextTick(() => {
        let vm = this
        tinymce.init({
          selector: '#tinymceEditer',
          branding: false,
          elementpath: false,
          min_height: 600,
          resize: true,
          language: 'zh_CN',
          menubar: 'edit insert view format table tools',
          plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
            'searchreplace visualblocks visualchars fullpage',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'paste textcolor colorpicker textpattern imagetools'
          ],
          toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media',
          autosave_interval: '20s',
          image_advtab: true,
          table_default_styles: {
            width: '100%',
            borderCollapse: 'collapse'
          },
          convert_urls: true,
          relative_urls: false,
          remove_script_host: false,
          images_upload_url: this.actionTarget,
          images_upload_handler: async function (blobInfo, success, failure) {
            const fileTypes = ['jpg', 'jpeg', 'png', 'bmp']
            for (let i of fileTypes) {
              if (blobInfo.filename().indexOf(i) > -1) {
                let formData = new FormData()
                formData.append('image', blobInfo.blob(), blobInfo.filename())
                formData.append('imgType', 'shop')
                try {
                  const res = await ApiUploadPic(formData)
                  if (res.errorCode > -1) {
                    success(vm.utils.handleImgPrefix(res.imgPath))
                  } else {
                    failure(res.msg)
                  }
                } catch (error) {
                  failure('上传失败')
                  throw new Error(error)
                }
                return
              }
            }
            failure('上传图片格式有误,请上传jpg/jpeg/png/bmp格式的图片')
          },
          setup: function (editor) {
            editor.on('init', function (e) {
              vm.spinShow = false
              if (localStorage.editorContent) {
                tinymce.get('tinymceEditer').setContent(localStorage.editorContent)
              }
            })
            editor.on('keydown', function (e) {
              localStorage.editorContent = tinymce.get('tinymceEditer').getContent()
              /* const ifr = document.getElementById('tinymceEditer_ifr')
              const contentHeight = ifr.style.height.split('px')[0]
              const bodyHeight = ifr.contentDocument.body.offsetHeight
              if (bodyHeight > +contentHeight) {
                ifr.style.height = `${bodyHeight + 80}px`
              } */
            })
          }
        })
      })
    },
    // 增加规格
    handleAddSpec () {
      this.specList = [...this.specList, {
      }]
    },
    // 删除规格
    async handleRemoveSpec (index) {
      let indexSpecList = this.specList[index]
      console.log('输出删除的数据')
      console.log(indexSpecList)
      let con =  window.confirm('您确定要删除规格吗?')
      if(indexSpecList.id === null){
        indexSpecList.id = -1
      }
      if (con && indexSpecList.id > 0){
        let data = {
          id: indexSpecList.id
        }
        let res = await ApiDeleteGoodsSpecification(data)
        if(res.errorCode === 1){
          this.$Message.success(res.msg)
        } else if (res.errorCode === 0){
          this.$Message.error(res.msg)
        } else{
          this.$Message.error(res.msg)
        }
      } else if(con === false){
          return
      }     
      this.specList = [
      ...this.specList.slice(0, index),
      ...this.specList.slice(index + 1)
      ]     
    },
    // 图片上传中
    handleUploading () {
      this.$Message.loading('上传中...')
    },
    // 上传图片成功时
    hanldeUploadSuccess (res) {
      this.$Message.destroy()
      this.$Message.success('上传成功')
      this.formData.imgURL = [...this.formData.imgURL, res.imgPath]
      // this.waitForCropperImg = res.imgPath
      // this.showCropper = true
      // this.$nextTick(() => {
      //   if (this.cropper.canvas) {
      //     this.cropper.replace(this.utils.handleImgPrefix(res.imgPath))
      //     return
      //   }
      //   let img = document.getElementById('cropper')
      //   this.cropper = new Cropper(img, {
      //     dragMode: 'drag',
      //     minCropBoxWidth: 100,
      //     minCropBoxHeight: 100,
      //     restore: false,
      //     center: false,
      //     highlight: false,
      //     scalable: false,
      //     zoomable: false,
      //     cropBoxMovable: true,
      //     toggleDragModeOnDblclick: false,
      //     ready: () => {
      //       this.cropper.setCropBoxData({
      //         width: 200,
      //         height: 200
      //       })
      //     },
      //     crop: (e) => {
      //       this.cropperSize.x = parseInt(e.detail.x)
      //       this.cropperSize.y = parseInt(e.detail.y)
      //       this.cropperSize.w = parseInt(e.detail.width)
      //       this.cropperSize.h = parseInt(e.detail.height)
      //     }
      //   })
      // })
    },
    // 上传失败时
    handleUploadError () {
      this.$Message.destroy()
      this.$Message.warning('上传失败')
    },
    // 裁剪图片
    async handleCropperSure () {
      const res = await ApiTailorImage(this.waitForCropperImg, 'shop', this.cropperSize)
      if (res.errorCode === 1) {
        this.waitForCropperImg = ''
        this.formData.imgURL = [...this.formData.imgURL, res.data]
        this.$nextTick(() => {
          this.$Message.success('裁剪完成')
        })
      }
    },
    // 删除主图
    handleDeleteImg (index) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '确认删除该主图吗？',
        onOk: () => {
          this.formData.imgURL = [...this.formData.imgURL.slice(0, index), ...this.formData.imgURL.slice(index + 1)]
        }
      })
    },
    // 修改时初始数据渲染
    setOriginInfo () {
      if (this.$route.query.goodsEvents === 'edit') {
        this.activeGoods = JSON.parse(sessionStorage.getItem('activeGoods'))
        for (var i in this.formData) {
          if (i === 'imgURL') {
            this.$set(this.formData, i, this.activeGoods[i].split(','))
          } else if (i === 'contents') {
            tinymce.get('tinymceEditer').setContent(this.activeGoods[i])
          } else if (i === 'categoryId') {
            this.$set(this.formData, i, this.findCategory(this.activeGoods[i]))
          } else {
            this.$set(this.formData, i, this.activeGoods[i])
          }
        }
        let array = []
        if (this.activeGoods['goodsAttributeList'] && this.activeGoods['goodsAttributeList'] !== {}) {
          for (let o of this.activeGoods['goodsAttributeList']) {
            array = [...array, o]
          }
        }
        this.specList = array
        this.submitBtnEadit = "提交更新"
      }
    },
    parseFloat (val) {
      return parseFloat(val)
    },
    // 查询商品类型数组
    findCategory (id) {
      for (let i of this.typeData) {
        if (i.value === id) {
          return [i.value]
        } else if (i.children) {
          for (let j of i.children) {
            if (j.value === id) {
              return [i.value, j.value]
            }
          }
        }
      }
      return []
    }
  },
  created () {
    this.init()
  },
  async mounted () {
    await this.getGoodsType()
    this.$nextTick(() => {
      this.setOriginInfo()
    })
    // this.getCouponList()
  },
  destroyed () {
    localStorage.removeItem('editorContent')
    tinymce.get('tinymceEditer').destroy()
  }
}
</script>
