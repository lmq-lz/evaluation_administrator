<template>
    <!-- 一定要放一个div根容器 -->
    <div>
      <!-- <h3>班级列表组件</h3> -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/class' }">班级管理</el-breadcrumb-item>
          <el-breadcrumb-item>班级选课列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          <!-- 班级课程列表区域 -->
          <!-- border：表格边框线，stripe：隔
          行变色 -->
          <el-table :data="classCourseInfo" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="课程id" prop="id"></el-table-column>
            <el-table-column label="课程名称" prop="name"></el-table-column>
            <el-table-column label="课程代码" prop="number"></el-table-column>
            <el-table-column label="课程类型" prop="courseType"></el-table-column>
            <el-table-column label="课程类型" prop="teacher.name"></el-table-column>
            <el-table-column label="开课学院" column-key="courseDep" prop="courseDep">
            </el-table-column>
            <!-- <el-table-column label="开课学院" prop="courseDep"></el-table-column> -->
            <el-table-column label="学分" prop="score"></el-table-column>
            <el-table-column label="学时" prop="time"></el-table-column>
            <el-table-column label="课程种类" prop="courseClass">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.courseClass === '专业必修课'||scope.row.courseClass === '必修课' ? 'primary' : (scope.row.courseClass === '选修课' ? 'warning':'success')"
                  disable-transitions>
                  {{scope.row.courseClass}}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column label="授课教师" prop="teacher.name">
              <template slot-scope="scope">
                <el-tag type='danger' disable-transitions>{{scope.row.teacher.name}}</el-tag>
              </template>
            </el-table-column> -->
            <!-- <el-table-column label="权限名称" prop="permission"></el-table-column> -->
            <el-table-column label="操作" width="350px">
              <template slot-scope="scope">
                <!-- <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditCourseDialog(scope.row)">编辑课程</el-button> -->
                <!-- <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button> -->
                <!-- <el-button type="danger" icon="el-icon-delete" size='mini'>删除权限</el-button> -->
                <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteclassCourse(scope.row.id)">删除课程</el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-card>
    </div>
  </template>

  <script>
export default {
  data () {
      return {
        // 获取班级列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          currentPage: 1,
          // 当前每页显示多少条数据
          pageSize: 2
        },
        // 传递过来的班级课程信息
        classCourseInfo: [],
        // 当前班级的id
        stuId: 0
      }
  },
  created () {
    eventBus.$on('stuId', function (val) {
      console.log('被查看课程列表班级id：', val)
      this.stuId = val
    })
    this.getclassInfo()
    
  },
  methods: {
    // 获取班级课程信息
    getclassInfo () {
      const aclass = window.sessionStorage.getItem('classCourseInfo')
      // console.log('getItem courseList：', aclass)
      this.classCourseInfo = []
      // console.log('json.parse courselist', JSON.parse(aclass))
      this.classCourseInfo = JSON.parse(aclass)
      // console.log('查看详细班级信息：', this.classInfo)

      // 全局eventBus传递参数
      eventBus.$on('classId', function (val) {
        // console.log('被查看课程列表班级id：', val)
        this.aclassId = val
      })
    }
  }
}
</script>
    
<style lang="less" scoped>
</style>
    