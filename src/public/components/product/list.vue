<template>
  <div class="product_list">
    <div class="item_li" v-for="list in lists">
      <p @tap="showHide($index)" class="mui-icon"
         :class="{'crm-push-down':!list.showHide, 'crm-push-up': list.showHide}">
        <span class="name">{{list.productName}}</span>
        <span class="cost mui-icon-amount">&#165{{list.amount}}</span>
      </p>
      <div class="detail" v-if="list.showHide">
        <p>类别<span>{{list.productTypeText}}</span></p>
        <p>描述<span>{{list.description}}</span></p>
        <p>单价<span class="cost" v-if="!list.isEdit">¥{{list.productPrice}}</span>
          <input @input="totalA($index)" v-if="list.isEdit" type="text" v-model="list.productPrice">&nbsp;&nbsp;x&nbsp;&nbsp;
          <span class="cost" v-if="!list.isEditCount" v-text="list.quantity"></span>
          <input @input="totalA($index)" v-if="list.isEditCount" type="number" v-model="list.quantity">
        </p>
      </div>
      <div class="bu" v-if="list.showHide && !list.isOperation">
        <a v-if="!list.isRival" class="mui-icon mui-icon-rival" @tap="rival($index)">对手<span class="right"></span></a>
        <a class="mui-icon mui-icon-edit" @click="edit($index)">{{list.isEdit?'保存':'编辑'}}<span class="right"></span></a>
        <a class="mui-icon mui-icon-dustbin delete" @tap=deleteThis($index)>删除</a>
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import "../../css/module.css";
</style>
<script>
  export default{
    props: {
      lists: {}
    },
    data: function () {
      return {};
    },
    methods: {
      rival: function (index) {
        this.$dispatch('toRival', this.lists[index]);
      },
      showHide: function (index) {
        var lists = this.lists;
        if (lists[index].showHide) {
          lists[index].showHide = false;
        } else {
          lists[index].showHide = true;
        }
      },
      edit: function (index) {
        var lists = this.lists;
        var quantity = lists[index].quantity;
        if (!(quantity > 0 && (quantity + '').indexOf('.') === -1)) {
          mui.alert('数量必须是大于零的整数', '提示');
          return;
        }
        if (lists[index].isEdit) {
          lists[index].isEdit = false;
          /* 编辑，回调 */
          this.$dispatch('editSaveProduct', this.lists[index]);
        } else {
          lists[index].isEdit = true;
        }
        if (lists[index].isEditCount) {
          lists[index].isEditCount = false;
        } else {
          lists[index].isEditCount = true;
        }
      },
      deleteThis: function (index) {
        var btnArray = ['否', '是'];
        var self = this;
        var name = self.lists[index].productName;
        mui.confirm('是否删除产品[' + name + ']？', '提示', btnArray, function (e) {
          if (e.index === 1) {
            self.$dispatch('deleteSaveProduct', self.lists[index].id);
          }
        });
      },
      totalA: function (index) {
        var json = this.lists[index];
        if (json.quantity <= 0) {
          return;
        }
        json.amount = (parseFloat(json.productPrice) * parseFloat(json.quantity)).toFixed(2);
      },
      millesimal: function (numStr) {
        var b = /([-+]?\d{3})(?=\d)/g;
        return numStr.replace(b, function ($0, $1) {
          return $1 + ',';
        });
      }
    },
    ready: function () {}
  };
</script>
