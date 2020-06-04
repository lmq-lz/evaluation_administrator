<template>
  <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/administrator' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>授课管理</el-breadcrumb-item>
          <el-breadcrumb-item>课程管理</el-breadcrumb-item>
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
            <el-col :span="7">
                <el-input placeholder="请输入内容" clearable @clear="getCourseList">
                    <el-button slot="append" icon="el-icon-search" @click="getCourseList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addCourseDialogVisible = true">添加课程</el-button>
            </el-col>
          </el-row>

          <!-- 课程列表区域 -->
          <!-- border：表格边框线，stripe：隔
            行变色 -->
            <el-table :data="courseList" border stripe>
              <!-- 索引列 -->
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="课程id" prop="id"></el-table-column>
              <el-table-column label="课程名称" prop="name"></el-table-column>
              <el-table-column label="课程代码" prop="number"></el-table-column>
              <el-table-column label="开课学院" column-key="courseDep" prop="courseDep"
                :filters="departmentListFilterArr"
                :filter-method="filterDepHandler">
              </el-table-column>
              <!-- <el-table-column label="开课学院" prop="courseDep"></el-table-column> -->
              <el-table-column label="学分" prop="score"></el-table-column>
              <el-table-column label="学时" prop="time"></el-table-column>
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
              <!-- <el-table-column label="权限名称" prop="permission"></el-table-column> -->
              <el-table-column label="操作" width="350px">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditCourseDialog(scope.row)">编辑课程</el-button>
                  <!-- <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button> -->
                  <!-- <el-button type="danger" icon="el-icon-delete" size='mini'>查看开课情况</el-button> -->
                  <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteCourse(scope.row.id)">删除课程</el-button>
                </template>
              </el-table-column>
              <el-table-column label="开课情况" width="350px">
                <template slot-scope="scope">
                  <el-button type="success" size='mini' @click="linkCourseTearcherInfo(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <!-- pageSize就是页面显示做多条数，可按照page-sizes进行选择1,2,5,10条/页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.currentPage"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
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
              <!-- v-model数据双向绑定，同步到addCourseForm -->
              <!-- <el-form-item label="课程id" prop="id">
                <el-input v-model.number="addCourseForm.id"></el-input>
              </el-form-item> -->
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
                <!-- <el-input v-model="addCourseForm.courseDep"></el-input> -->
                <template>
                  <el-select v-model="addCourseForm.department">
                    <el-option
                      v-for="item in departmentList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
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
              <!-- v-model数据双向绑定，同步到editCourseForm -->
              <!-- <el-form-item label="课程id" prop="id">
                <el-input v-model.number="editCourseForm.id"></el-input>
              </el-form-item> -->
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
                <template>
                  <el-select v-model="editCourseForm.courseDep">
                    <el-option
                      v-for="item in departmentList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
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
      // 获取课程列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currentPage: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      // 获取课程数据总条数
      total: 0,
      // 所有课程的列表
      courseList: [],
      // 系列表
      departmentList: [],
      // 系列表过滤器
      departmentListFilterArr: [],
      // 所有老师列表
      teachersList: [],
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
        time: 32,
        teacher: {
        }
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
        time: 32,
        teacher: {
        },
        department: {
          id: 0
        }
      },
      // 添加课程表单的验证规则
      addCourseFormRules: {
        id: [
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

    // 获得基础数据
    this.getDepartmentList()
    this.getCourseTotal()
    this.getCourseList()
    this.getTeacherList()
    
    // 给用户行为详细内容赋值（页面统一id,module,subModule）
    // 具体operate在具体事件中指定
    this.$global_dataBurialForm.id = JSON.parse(window.sessionStorage.getItem('user')).id
    this.$global_dataBurialForm.module = '授课管理'
    this.$global_dataBurialForm.subModule = '课程管理'

    // 给用户行为详细内容赋值（页面统一id,module,subModule）
    // 具体operate在具体事件中指定
    this.$global_webPageDataBurialForm.id = JSON.parse(window.sessionStorage.getItem('user')).id
    this.$global_webPageDataBurialForm.subModule = '课程管理页面'
    console.log('网页表单：', this.$global_webPageDataBurialForm)
    // 上报事件（访问页面）
    this.reportDataBurial('/userBehavior/add', this.$global_webPageDataBurialForm)
  },
  methods: {
    // 获取所有学生数量
    async getCourseTotal () {
      // 为了获取total进行axios请求(假设课程数量不超过1000)
      await this.$http.get('/courseManage/listCourseWithNoTeacher?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取所有课程数量
          this.total = res.data.length
          // console.log(res.data)
        }).catch(err => {
          console.log('获取课程列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
    },
    // 获取所有课程列表
    async getCourseList () {
      await this.$http.get('/courseManage/listCourseWithNoTeacher?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          this.courseList = res.data
        }).catch(err => {
          console.log('获取课程列表失败！' + err)
        })
    },
    // 获取所有系列表
    async getDepartmentList () {
      await this.$http.get('/department/listDepartment?pageSize=20&startPage=1')
        .then(res => {
          this.departmentList = res.data
        }).catch(err => {
          console.log('获取系列表失败！' + err)
        })
      if (this.departmentList !== null) {
        this.departmentList.forEach( item => {
          this.departmentListFilterArr.push({ text: item.name, value: item.name })
        })
      }
    },    
    // 获取所有教师列表(含分页参数)
    async getTeacherList () {
      await this.$http.get('/admin/listTeacher?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取教师列表信息以及教师数量
          this.teacherList = res.data
        }).catch(err => {
          console.log('获取教师列表失败！' + err)
          // return this.$message.error('获取教师列表失败！')
        })
    },
    // 监听 pageSize(页面显示最多条数，在页面中可进行1,2,5,10条/页的选择) 改变的事件
    handleSizeChange (newSize) {
      // console.log('页面显示最多条数：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getCourseList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.currentPage = newPage
      this.getCourseList()
    },
    // 通过课程id删除课程
    // 埋点
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
      // axio删除特定id课程
      await this.$http.delete('/courseManage/deleteCourse/{id}?id=' + id)
        .then(res => {
          if (res.status !== 200) {
            return this.$message.error('删除课程失败！')
          } else {
            // 删除操作成功就向后端上报此事件
            // 埋点
            this.$global_dataBurialForm.operate = '删除课程'
            // 上报事件（上传用户行为内容）
            this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
            console.log(res.message + '删除课程成功！')
          }
        })
      this.getCourseList()
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
    // 埋点
    async addCourse () {
      console.log('添加课程info：', this.addCourseForm)
      await this.$http.post('/courseManage/addCourse', this.addCourseForm)
        .then(res => {
          if (res.status === 200) {
            // 给用户行为详细内容赋值
            this.$global_dataBurialForm.operate = '添加课程'
            console.log('表单数据：', this.$global_dataBurialForm)
            // 上报事件（上传用户行为内容）
            this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
            return this.$message.success('添加课程成功！')
          }
        }).catch(err => {
          console.log('添加课程失败！' + err)
        })
      // 隐藏添加课程对话框
      this.addCourseDialogVisible = false
      // 重新获取课程列表
      this.getCourseTotal()
      this.getCourseList()
    },
    // 修改课程
    async updateCourse () {
      await this.$http.put('/courseManage/updateCourse', this.editCourseForm)
        .then(function (response) {
          console.log('修改课程信息成功！')
        }).catch(function (err) {
          console.log('编辑课程请求失败 errMsg：' + err)
        })
      // 给用户行为详细内容赋值
      this.$global_dataBurialForm.operate = '编辑课程'
      // 上报事件（上传用户行为内容）
      this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
      // 刷新课程
      this.getCourseList()
      // 关闭编辑课程对话框
      this.editCourseDialogVisible = false
    },
    // 系名称过滤器进行筛选
    filterDepHandler (value, row, column) {
      // const property = column.entranceDate
      return row.entranceDate === value
    },
    // 查看课程对应的开课情况(教授该课程的老师以及课程信息)
    linkCourseTearcherInfo (courseTeacherInfo) {
      // console.log('student courseList：', student.courseList)
      // const courseInfo = JSON.stringify(courseTeacherInfo)
      // console.log('stringfy stuCourseList:', studentInfo)
      const courseName = JSON.stringify(courseTeacherInfo.name)
      window.sessionStorage.setItem('courseName', courseName)
      // 给用户行为详细内容赋值
      // 埋点
      this.$global_dataBurialForm.operate = '查看选课'
      console.log('表单数据：', this.$global_dataBurialForm)
      // 上报事件（上传用户行为内容）
      this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
      // 路由跳转到开课情况界面
      this.$router.push('courseTeacherInfo')
      // 全局组件传递参数
      // eventBus.$emit('classId', aclass.id)

      // query要用path来引入,接收参数都是this.$route.query.name。query类似于ajax中get传参，即在浏览器地址栏中显示参数。
      // params要用name来引入，接收参数都是this.$route.params.name。params则类似于post，即在浏览器地址栏中不显示参数。
      // 路由跳转选课详情界面
      // this.$router.push({name: 'courseTeacherInfo', params: {name: 'abc', courseName: JSON.stringify(courseTeacherInfo.name)}})
    }
  }
}
</script>

<style lang="less" scoped></style>
