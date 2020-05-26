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
          <el-table :data="courseTeacherInfo" border stripe>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="课程id" prop="id"></el-table-column>
            <el-table-column label="课程名称" prop="name"></el-table-column>
            <el-table-column label="课程代码" prop="number"></el-table-column>
            <el-table-column label="课程类型" prop="courseType"></el-table-column>
            <el-table-column label="课程种类" prop="courseClass">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.courseClass === '专业必修课'||scope.row.courseClass === '必修课' ? 'primary' : (scope.row.courseClass === '选修课' ? 'warning':'success')"
                  disable-transitions>
                  {{scope.row.courseClass}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="开课学院" column-key="courseDep" prop="courseDep"></el-table-column>
            <el-table-column label="授课老师" prop="teacher.name"></el-table-column>
            <el-table-column label="老师职称" prop="teacher.jobTitle">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.teacher.jobTitle === '助教'||scope.row.teacher.jobTitle === '讲师' ? 'primary' : (scope.row.teacher.jobTitle === '副教授' ? 'warning':'success')"
                  disable-transitions>
                  {{scope.row.teacher.jobTitle}}
                </el-tag>
              </template>
            </el-table-column>
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
            <!-- <el-table-column label="操作" width="350px">
              <template slot-scope="scope">
                <el-button type="war" icon="el-icon-delete" size='mini' @click="deleteclassCourse(scope.row.id)">删除课程</el-button>
              </template>
            </el-table-column> -->
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
        courseTeacherInfo: [],
        // 当前班级的id
        stuId: 0
      }
  },
  created () {
    // eventBus.$on('stuId', function (val) {
    //   console.log('被查看课程列表班级id：', val)
    //   this.stuId = val
    // })
    // 获取课程授课信息(包括授课的老师)
    this.getcourseTeacherInfo()
    
  },
  methods: {
    // 获取班级课程信息
    async getcourseTeacherInfo () {
      // console.log('获取的name：', this.$router.params)
      // console.log('获取的参数：', JSON.parse(this.$router.params.courseName))
      const courseNameJson = window.sessionStorage.getItem('courseName')
      // this.courseTeacherInfo = []
      const courseName = JSON.parse(courseNameJson)
      console.log('courseName', courseName)
      var courseTeacherList = []
      // 假设开新课的老师不超过十个(使用此接口是按照班级查询的课程与老师，所以同一门课程同一个老师(教几个班)可能会有多条重复数据)
      await this.$http.get('/courseManage/searchCourse?pageSize=10&startPage=1&str=' + courseName)
        .then(res => {
          // 获取所有课程与教授的老师
          courseTeacherList = res.data
          console.log(res.data)
        }).catch(err => {
          console.log('获取课程授课情况失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
      var isSavedTeacher = false
      // courseTeacher保存不重复的教师课程信息
      courseTeacherList.forEach( item1 => {
        this.courseTeacherInfo.forEach( item2 => {
          if (item1.teacher.name === item2.teacher.name) {
            isSavedTeacher = true
          }
        })
        if (!isSavedTeacher) {
          this.courseTeacherInfo.push(item1)
        }
      })
    }
  }
}
</script>
    
<style lang="less" scoped>
</style>
    