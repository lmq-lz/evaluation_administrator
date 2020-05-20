<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/administrator' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>授课管理</el-breadcrumb-item>
            <el-breadcrumb-item>班级管理</el-breadcrumb-item>
            <el-breadcrumb-item>班级课程管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加课程按钮区域 -->
            <!-- <el-row>
                <el-col>
                    <el-button type='primary'>添加课程</el-button>
                </el-col>
            </el-row> -->
            <!-- 搜索与添加区域 -->
            <el-row :gutter="100">
              <!-- <el-col :span="7">
                  <el-input placeholder="请输入内容" clearable @clear="getCourseList">
                      <el-button slot="append" icon="el-icon-search" @click="getCourseList"></el-button>
                  </el-input>
              </el-col> -->
              <el-col :span="4">
                  <el-button type="primary" @click="addCourseDialogVisible = true">添加课程</el-button>
              </el-col>
            </el-row>
  
            <!-- 课程列表区域 -->
            <!-- border：表格边框线，stripe：隔
              行变色 -->
              <el-table :data="courseList" border stripe>
                <!-- <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-row v-for="(item,index) in scope.row.permissions" :key="index">
                      <el-col :span="15">
                        <el-tag closable @close="deletePerms(item.id,scope.row.id)">权限名称{{index+1}}：{{item.name}}</el-tag>
                      </el-col>
                      <el-col :span="7">
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="deletePerms(item.id,scope.row.id)">删除权限</el-button>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column> -->
                <!-- 索引列 -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="课程id" prop="id"></el-table-column>
                <el-table-column label="课程名称" prop="name"></el-table-column>
                <el-table-column label="课程代码" prop="number"></el-table-column>
                <el-table-column label="课程类型" prop="courseType"></el-table-column>
                <el-table-column label="课程种类" prop="courseClass"></el-table-column>
                <el-table-column label="开课学院" prop="courseDep"></el-table-column>
                <el-table-column label="学分" prop="score"></el-table-column>
                <el-table-column label="学时" prop="time"></el-table-column>
                <el-table-column label="授课教师" prop="teacher"></el-table-column>
                <!-- <el-table-column label="权限名称" prop="permission"></el-table-column> -->
                <el-table-column label="操作" width="350px">
                  <template slot-scope="scope">
                    <!-- <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditCourseDialog(scope.row)">编辑课程</el-button> -->
                    <!-- <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button> -->
                    <!-- <el-button type="danger" icon="el-icon-delete" size='mini'>删除权限</el-button> -->
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteCourse(scope.row.id)">删除课程</el-button>
                  </template>
                </el-table-column>
              </el-table>
        </el-card>
  
        <!-- 添加课程的对话框 -->
        <el-dialog
        title="添加课程"
        :visible.sync="addCourseDialogVisible"
        width="40%" @close="addCourseDialogClosed">
        <!-- course_id, number, name, course_type, course_class, course_dep, score, time -->
            <!-- 内容主体区域 -->
            <el-form :model="addCourseForm" :rules="addCourseFormRules" ref="addCourseFormRef" label-width="70px">
                <!-- prop是验证规则rules(即addCourseFormRules)的属性 -->
                <el-form-item label="课程id" prop="course_id">
                    <!-- v-model数据双向绑定，同步到addCourseForm -->
                  <el-input v-model.number="addCourseForm.id"></el-input>
                </el-form-item>
                <el-form-item label="课程代码" prop="number">
                    <el-input v-model="addCourseForm.number"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="addCourseForm.name"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" prop="courseType">
                  <el-input v-model="addCourseForm.courseType"></el-input>
                </el-form-item>
                <el-form-item label="课程种类" prop="courseClass">
                    <el-input v-model="addCourseForm.courseClass"></el-input>
                </el-form-item>
                <el-form-item label="开课学院" prop="courseDep">
                  <el-input v-model="addCourseForm.courseDep"></el-input>
                </el-form-item>
                <el-form-item label="学分" prop="score">
                  <el-input v-model.number="addCourseForm.score"></el-input>
                </el-form-item>
                <el-form-item label="学时" prop="time">
                  <el-input v-model.number="addCourseForm.time"></el-input>
                </el-form-item>
            </el-form>
            <!-- footer是对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCourseDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addCourse">确定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑课程的对话框 -->
        <el-dialog
        title="编辑课程"
        :visible.sync="editCourseDialogVisible"
        width="40%" @close="editCourseDialogClosed">
        <!-- course_id, number, name, course_type, course_class, course_dep, score, time -->
            <!-- 内容主体区域 -->
            <el-form :model="editCourseForm" :rules="editCourseFormRules" ref="editCourseFormRef" label-width="70px">
                <!-- prop是验证规则rules(即editCourseFormRules)的属性 -->
                <el-form-item label="课程id" prop="course_id">
                    <!-- v-model数据双向绑定，同步到editCourseForm -->
                  <el-input v-model.number="editCourseForm.id"></el-input>
                </el-form-item>
                <el-form-item label="课程代码" prop="number">
                    <el-input v-model="editCourseForm.number"></el-input>
                </el-form-item>
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="editCourseForm.name"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" prop="course_type">
                  <el-input v-model="editCourseForm.courseType"></el-input>
                </el-form-item>
                <el-form-item label="课程种类" prop="course_class">
                    <el-input v-model="editCourseForm.courseClass"></el-input>
                </el-form-item>
                <el-form-item label="开课学院" prop="course_dep">
                  <el-input v-model="editCourseForm.courseDep"></el-input>
                </el-form-item>
                <el-form-item label="学分" prop="score">
                  <el-input v-model.number="editCourseForm.score"></el-input>
                </el-form-item>
                <el-form-item label="学时" prop="time">
                  <el-input v-model.number="editCourseForm.time"></el-input>
                </el-form-item>
            </el-form>
            <!-- footer是对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCourseDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateCourse">完成</el-button>
            </span>
        </el-dialog>
        <!-- 分配课程课程的对话选择框 -->
        <!-- <el-dialog
        title="编辑课程"
        :visible.sync="editCourseDialogVisible"
        width="40%" @close="editRoleDialogClosed">
            <el-select v-model="selectedCourseRoleId" placeholder="请选择课程">
              <el-option
                v-for="item in allRolesList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateCourseRole">确定</el-button>
            </span>
        </el-dialog> -->
      </div>
  </template>
  
  <script>
  export default {
    data () {
      // 检查学分是否是1~10
      var checkScore = (rule, value, callback) => {
        if (value < 0 || value > 10) {
          callback(new Error('请输入0~10的数字'))
        } else {
          callback()
        }
      }
      // 检查学时是否0
      var checkTime = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('请输入大于0的数值'))
        } else {
          callback()
        }
      }
      // 检查字符串输入长度是否在1~128之间
      // var checkStringLenMax128 = (rule, value, callback) => {
      //   if (value.length > 0 && value.length <= 128) {
      //     callback()
      //   } else {
      //     callback(new Error('请输入长度在1~128之间字符之间'))
      //   }
      // }
      // 检查课程代码是否只由数字与字母组成
      var checkCosNumberIsNumOrDigit = (rule, value, callback) => {
        const patter = /^[0-9a-zA-Z]+$/
        if (!patter.test(value)) {
          return callback(new Error('课程代码只能数字和字母组成！'))
        } else {
          callback()
        }
      }
      return {
        // 所有课程的列表
        courseList: [],
        // 控制添加课程对话框的显示与隐藏
        addCourseDialogVisible: false,
        // 控制编辑课程对话框的显示与隐藏
        editCourseDialogVisible: false,
        // 控制分配课程对话框的显示与隐藏
        // editRoleDialogVisible: false,
        // 添加课程的表单数据
        addCourseForm: {
          id: 0,
          number: '',
          name: '',
          courseType: '',
          courseClass: '',
          courseDep: '',
          score: 2,
          time: 32
        },
        // 编辑课程的表单数据
        editCourseForm: {
          id: 0,
          number: '',
          name: '',
          courseType: '',
          courseClass: '',
          courseDep: '',
          score: 2,
          time: 32
        },
        // 添加课程表单的验证规则
        addCourseFormRules: {
          course_id: [
            {
              required: true, message: '请输入课程id', trigger: 'blur'
            },
            { type: 'number', message: '年龄必须为数值' }
          ],
          name: [
            {
              required: true, message: '请输入课程名称', trigger: 'blur'
            }
          ],
          number: [
            {
              required: true, message: '请输入课程代码', trigger: 'blur'
            },
            {
              validator: checkCosNumberIsNumOrDigit, trigger: 'blur'
            }
          ],
          courseType: [
            {
              required: true, message: '请输入课程类型', trigger: 'blur'
            }
          ],
          courseClass: [
            {
              required: true, message: '请输入课程种类', trigger: 'blur'
            }
          ],
          courseDep: [
            {
              required: true, message: '请输入开课学院', trigger: 'blur'
            }
          ],
          score: [
            {
              required: true, message: '请输入学分', trigger: 'blur'
            },
            {
              validator: checkScore, trigger: 'blur'
            },
            { type: 'number', message: '年龄必须为数值' }
          ],
          time: [
            {
              required: true, message: '请输入学分', trigger: 'blur'
            },
            {
              validator: checkTime, trigger: 'blur'
            },
            { type: 'number', message: '年龄必须为数值' }
          ]
        },
        // 编辑课程的验证规则对象
        editCourseFormRules: this.addCourseFormRules
      }
    },
    created () {
      // sessionStorage.setItem('username', 'abc')
      this.getCourseList()
    },
    methods: {
      // 获取所有课程列表
      async getCourseList () {
        await this.$http.get('/courseManage/listCourse')
          .then(res => {
            this.courseList = res.data
          }).catch(err => {
            console.log('获取课程列表失败！' + err)
          })
      },
      // 通过课程id删除课程
      async deleteCourse (id) {
        // 弹框询问是否删除课程数据
        const confirmResult = await this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {
          return err
        })
        // 如果点击确定，confirmResult返回值为字符串 confirm，点击取消返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！123')
        }
        // 问题！！！！！！！！！答辩前需更改正确路径
        await this.$http.get('/courseManage/deleteCourse?id=' + id)
          .then(res => {
            if (res.status !== 200) {
              return this.$message.error('删除课程失败！')
            } else {
              console.log(res.message + '删除课程成功！')
            }
          })
      },
      // 监听添加课程对话框的关闭事件
      addCourseDialogClosed () {
        // alert('添加对话框关闭！')
        this.$refs.addCourseFormRef.resetFields()
      },
      // 监听编辑课程对话框的关闭事件
      editCourseDialogClosed () {
        this.$refs.editCourseFormRef.resetFields()
      },
      // 点击编辑时打开课程编辑对话框
      showEditCourseDialog (course) {
        console.log('操作课程为：' + course.courseType)
        this.editCourseDialogVisible = true
        this.editCourseForm = course
      },
      // 点击按钮添加课程
      addCourse () {
        alert('课程名：' + this.addCourseForm.name)
        this.$refs.addCourseFormRef.validate(async valid => {
          if (!valid) return
          await this.$http.post('/courseManage/addCourse', this.addCourseForm)
            .then(res => {
              return this.$message.success('添加课程成功！')
            }).catch(err => {
              console.log('添加课程失败！' + err)
            })
        })
        // 隐藏添加课程对话框
        this.addCourseDialogVisible = false
        // 重新获取课程列表
        this.getCourseList()
      },
      // 修改课程
      async updateCourse () {
        await this.$http.post('/courseManage/updateCourse', this.editCourseForm)
          .then(function (response) {
            // 重新获取课程列表
            this.getCourseList()
          }).catch(function (err) {
            console.log('编辑课程请求失败 errMsg：' + err)
          })
        // 关闭编辑课程对话框
        this.editCourseDialogVisible = false
      }
    }
  }
  </script>
  
  <style lang="less" scoped></style>
  