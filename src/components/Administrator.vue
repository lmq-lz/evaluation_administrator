<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <span>教务管理系统</span>
            </div>
            <div font-size="12px">
                <span>管理员：{{ adminName }}</span>
            </div>
            <div>
                <el-button type="info" @click="changePassword">修改密码</el-button>
                <el-button type="info" @click="logout">退出</el-button>
            </div>
        </el-header>
        <!-- 页面主题区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false"
                :router="true" :default-active="activePath">
                <!-- 一级菜单 -->
                <el-submenu index="1">
                    <!-- 一级菜单模板区域 -->
                    <template slot="title">
                    <!-- 一级菜单图标 -->
                    <i class="el-icon-location"></i>
                    <!-- 菜单文本 -->
                    <span>用户管理</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item index="/student" @click="saveNavState('/student')">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">学生管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/teachers" @click="saveNavState('/teachers')">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">教师管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/supervisor" @click="saveNavState('/supervisor')">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">督导管理</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 一级菜单 -->
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">权限管理</span>
                    </template>
                    <!-- 二级菜单 -->
                    <!-- index可以动态链接为 index="'/' + subItem.path(就是通过接口返回的path属性，例如users)" -->
                    <el-menu-item index="/roles" @click="saveNavState('/roles')">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">角色管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/rights">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">权限列表</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 一级菜单 -->
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">授课管理</span>
                    </template>
                    <!-- 二级菜单 -->
                    <!-- index可以动态链接为 index="'/' + subItem.path(就是通过接口返回的path属性，例如users)" -->
                    <el-menu-item index="/course">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">课程管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/class">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">班级管理</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 一级菜单 -->
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">教学情况查看</span>
                    </template>
                    <!-- 二级菜单 -->
                    <!-- index可以动态链接为 index="'/' + subItem.path(就是通过接口返回的path属性，例如users)" -->
                    <el-menu-item index="/teachingSituation">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">教学情况</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主题 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
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
    margin-left: 15px;
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
