<template>
	<footer>
		<ol>
			<li v-for="icon in icons" :class="{active: icon.isActive}" @tap.stop="toLink(icon.linkUrl)">
				<a>
					<b><img :src="icon.imgSrc" ></b>
					<span> {{ icon.text }} </span>
				</a>
			</li>
		</ol>
    <div class="add-container">
      <a href="javascript:;" @tap.stop="toShow()">
        <b><img src="../../public/images/icon/add-active.png" ></b>
      </a>
    </div>
  </footer>
</template>
<script>
  export default {
    data: function () {
      return {
        isShow: true,
        icons: [
          {
            imgSrc: require('../../public/images/icon/home-active.png'),
            text: '首页',
            linkUrl: '/home',
            isActive: true
          },
          {
            imgSrc: require('../../public/images/icon/workbench.png'),
            text: '工作台',
            linkUrl: '/work',
            isActive: false
          }
        ]
      };
    },
    methods: {
      toShow: function () {
        this.$emit('show-newpage', this.isShow);
      },
      toLink: function (path) {
        this.$router.go(path);
      },
      setActive: function (index) {
        this.icons.map(function (v, i) {
          i === index ? v.isActive = true : v.isActive = false;
        });
      }
    },
    watch: {
      '$route': function (newValue, oldValue) {
      }
    }
  };
</script>