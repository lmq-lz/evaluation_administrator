<template>
    <!-- 一定要放一个div根容器 -->
    <div>
      <!-- <h3>学生列表组件</h3> -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/student' }">学生管理</el-breadcrumb-item>
          <el-breadcrumb-item>学生选课列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          <!-- 学生课程列表区域 -->
          <!-- border：表格边框线，stripe：隔
          行变色 -->
          <el-table :data="studentCourseInfo" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="课程id" prop="id"></el-table-column>
            <el-table-column label="课程名称" prop="name"></el-table-column>
            <el-table-column label="课程代码" prop="number"></el-table-column>
            <el-table-column label="课程类型" prop="courseType">
            </el-table-column>
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
                <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteStudentCourse(scope.row.id)">删除课程</el-button>
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
        // 获取学生列表的参数对象
        queryInfo: {
          query: '',
          // 当前的页数
          currentPage: 1,
          // 当前每页显示多少条数据
          pageSize: 2
        },
        // 传递过来的学生课程信息
        studentCourseInfo: [],
        // 当前学生的id
        stuId: 0
      }
  },
  created () {
    eventBus.$on('stuId', function (val) {
      console.log('被查看课程列表学生id：', val)
      this.stuId = val
    })
    this.getStudentInfo()
    
  },
  methods: {
    // 获取学生信息
    getStudentInfo () {
      const student = window.sessionStorage.getItem('studentCourseInfo')
      // console.log('getItem courseList：', student)
      this.studentCourseInfo = []
      // console.log('json.parse courselist', JSON.parse(student))
      this.studentCourseInfo = JSON.parse(student)
      // console.log('查看详细学生信息：', this.studentInfo)

      // 全局eventBus传递参数
      eventBus.$on('stuId', function (val) {
        // console.log('被查看课程列表学生id：', val)
        this.stuId = val
      })
    }
  }
}
</script>
    
<style lang="less" scoped>
</style>
    