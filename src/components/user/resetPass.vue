<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <span>教务管理系统</span>
            </div>
            <div font-size="12px" style="padding: 5px; border-radius: 10px; background-color: gray; margin: 15px;">
                <span>管理员：{{ adminName }}</span>
            </div>
            <div>
                <el-button type="info" @click="changePassword">修改密码</el-button>
                <el-button type="info" @click="logout">退出</el-button>
            </div>
        </el-header>
       
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 是否折叠左侧菜单
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      // 登录用户的用户名
      adminName: ''
    }
  },
  created () {
    this.adminName = window.sessionStorage.getItem('username')
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    // sessionStorage存储数据过程
    var userInfo = { id: 1, name: 'admin123' }
    window.sessionStorage.setItem('user', JSON.stringify(userInfo))
    // // this.adminName = window.sessionStorage.getItem('user').name
    // var getUserInfo = JSON.parse(window.sessionStorage.getItem('user'))
    this.adminName = window.sessionStorage.getItem('username')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      // this.$router.push('/login')
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
    //   const { data: res } = await this.$http.get('menus')
    //   console.log(res)
    },
    // 点击按钮切换菜单折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接默认激活的状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    changePassword () {
      this.$router.push('/changepwd')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373D41;
    
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    align-items: center;
    color: white;
    font-size: 22px;
}

.el-header > div {
    display: flex;
    align-items: center;
}

.el-header > div > span {
    margin: 5px;
}

.el-aside{
    background-color: #333744;
}

.el-aside > .el-menu {
    border-right: 0px;
}

.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.el-main{
    background-color: #eaedf1;
}
</style>
