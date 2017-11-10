<template>
  <div class="mui-scroll-wrapper" style="top: 130px;">
    <div class="mui-scroll">
      <ul class="mui-table-view">
        <li class="emp_sel_per" v-for="list in person.personList" @click="select($index)">
          <span class="mui-icon" :class="{'crm-circle': !list.selected, 'crm-solid-check': list.selected}"></span>
          <a v-if="list.name">
            <img :src="list.headPhotoUrl||'../public/images/default_contact.png'"
                 onerror="this.src='../public/images/default_contact.png'">
            <div>
              {{list.name}}
              <p class='mui-ellipsis' v-text="list.title"></p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  // 公共的数据
  import store from './em-store';
  export default {
    data: function () {
      return {
        person: store.state
      };
    },
    methods: {
      'select': function (idx) {
        var self = this;
        var id = self.person.personList[idx].ID || self.person.personList[idx].id;
        var flag = store.repetition(self.person.personSelectList, id);
        if (self.person.personList[idx].selected) {
          self.person.personList[idx].selected = false;
        } else {
          self.person.personList[idx].selected = true;
        }
        if (flag) {
          store.deleteEmp(id);
        } else {
          self.person.personSelectList.push(self.person.personList[idx]);
          setTimeout(function () {
            store.updateSelectDept();
          }, 100);
        }
        var width = (document.body.offsetWidth * 0.72).toFixed(1);
        var wrapperWidth = self.person.personSelectList.length * 50;
        if (width < wrapperWidth) {
          wrapperWidth = width;
        }
        self.person.hWidth.width = wrapperWidth;

        self.$nextTick(function () {
          self.scroller && self.scroller.refresh();
          if (self.scroller.maxScrollX < -50)self.scroller.scrollTo(self.scroller.maxScrollX, 0, 500);
        });
      }
    },
    created: function () {
    },
    ready: function () {
      this.scroller = mui('.search-box .top-bar-wrapper').scroll({
        scrollY: false,
        scrollX: true,
        indicators: true
      });
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
