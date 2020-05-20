<template>
  <!-- 一定要放一个div根容器 -->
  <div>
      <!-- <h3>学生列表组件</h3> -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>学生管理</el-breadcrumb-item>
          <el-breadcrumb-item>学生列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          <!-- 搜索与添加区域 -->
          <el-row :gutter="100">
              <el-col :span="7">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getStudentList">
                      <el-button slot="append" icon="el-icon-search" @click="searchStudnetList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="showAddStudentDialog()">添加学生</el-button>
              </el-col>
          </el-row>

          <!-- 学生列表区域 -->
          <el-table :data="studentList" border stripe :default-sort = "{prop: 'id', order: 'ascending'}">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="学号" prop="id"></el-table-column>
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="籍贯" prop="region"></el-table-column>
              <el-table-column label="性别" prop="gender" 
              :filters="[{text: '男', value: '男'}, {text: '女', value: '女'}]"
              :filter-method="filterGenderHandler"
              >
                <template slot-scope="scope">
                  {{scope.row.gender === 0 ? '男':'女'}}
                </template>
              </el-table-column>
              <el-table-column label="出生日期" prop="birth"></el-table-column>
              <el-table-column label="已修学分" prop="score"></el-table-column>
              <el-table-column label="入学时间" column-key="entranceDate" prop="entranceDate"
              :filters="[{text: '2016-09', value: '2016-09'}, {text: '2017-09', value: '2017-09'}, {text: '2018-09', value: '2018-09'}, {text: '2019-09', value: '2019-09'}]"
              :filter-method="filterEntrDateHandler"></el-table-column>
              <el-table-column label="角色名称" prop="role.name">
                <template slot-scope="scope">
                  <el-tag type='primary' disable-transitions>{{scope.row.role.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                  <!-- 模板中定义的slot-scope属性接受作用域插槽的数据，通过scope.row获取这一行的数据 -->
                  <template slot-scope="scope">
                      <!-- 修改按钮 -->
                      <!-- el-tooltip：进行消息的提示-->
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditStudentInfoDialog(scope.row)"></el-button>
                      </el-tooltip>
                      <!-- 删除按钮 -->
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeStudentById(scope.row.id)"></el-button>
                      </el-tooltip>
                      <!-- 修改用户名和密码按钮 -->
                      <el-tooltip  effect="dark" content="修改用户名和密码" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showeditStudentNaPDialog(scope.row)"></el-button>
                      </el-tooltip>
                  </template>
              </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <!-- pageSize就是页面显示做多条数，可按照page-sizes进行选择1,2,5,10条/页 -->
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.currentPage"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
          </el-pagination>
      </el-card>

      <!-- 添加学生的对话框 -->
      <el-dialog
      title="添加学生"
      :visible.sync="addDialogVisible"
      width="40%" @close="addStudentDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addStudentForm" :rules="addStudentFormRules" ref="addStudentFormRef" label-width="70px">
            <!-- prop是验证规则rules(即addStudentFormRules)的属性 -->
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addStudentForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passwordBeforeMD5">
              <el-input v-model="addStudentForm.passwordBeforeMD5"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idNumberBeforeMD5">
              <el-input v-model="addStudentForm.idNumberBeforeMD5"></el-input>
            </el-form-item>
            <el-form-item label='性别'>
              <el-select v-model="addStudentForm.gender" placeholder="请选择性别">
                <el-option
                  v-for="item in genderList"
                  :key="item.id"
                  :label="item.gender"
                  :value="item.id">
                  <!-- <span style="float: left">{{ item.label }}</span> -->
                  <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="addStudentForm.birth"
                type="date"
                placeholder="选择日期" :picker-options="pickerDateOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="家庭地址" prop="region">
              <el-input v-model="addStudentForm.region"></el-input>
            </el-form-item>
            <el-form-item label="入学时间" prop="entranceDate">
              <el-date-picker
                v-model="addStudentForm.entranceDate"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="系名称">
              <template>
                <el-select v-model="addStudentForm.aclass.departmentId">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item label="班级名称">
              <template>
                <el-select v-model="addStudentForm.aclass.id">
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="addStudent">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑学生名称以及重置密码的对话框 -->
      <el-dialog
      title="编辑学生名称与密码"
      :visible.sync="editStudentNaPDialogVisible"
      width="40%" @close="editStudentNaPDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editStudentNaPForm" :rules="editStudentNaPFormRules" ref="editStudentNaPFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addStudentFormRules)的属性 -->
              <el-form-item label="学生名" prop="name">
                  <!-- v-model数据双向绑定，同步到addStudentForm -->
                <el-input v-model="editStudentNaPForm.name"></el-input>
              </el-form-item>
              <el-form-item label="重置密码" prop="passwordBeforeMD5">
                <el-input v-model="editStudentNaPForm.passwordBeforeMD5"></el-input>
              </el-form-item>
              <!-- <el-form-item label="密码" prop="password">
                  <el-input v-model="editStudentNaPForm.password"></el-input>
              </el-form-item>
              <el-form-item label="学院" prop="department">
                  <el-input v-model="editStudentNaPForm.department"></el-input>
              </el-form-item> -->
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editStudentNaPDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateStudent()">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑学生信息的对话选择框 -->
      <el-dialog
      title="编辑学生"
      :visible.sync="editStudentInfoDialogVisible"
      width="40%" @close="editStudentInfoDialogClosed">
        <el-form :model="editStudentInfoForm" :rules="editStudentInfoFormRules" ref="editStudentInfoFormRef" label-width="70px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editStudentInfoForm.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="passwordBeforeMD5">
            <el-input v-model="editStudentInfoForm.passwordBeforeMD5" placeholder="不修改密码则不填入数据"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="身份证号" prop="idNumberBeforeMD5">
            <el-input v-model="editStudentInfoForm.idNumberBeforeMD5" placeholder="不修改身份证则不填入数据"></el-input>
          </el-form-item> -->
          <el-form-item label='性别'>
            <el-select v-model="editStudentInfoForm.gender" placeholder="请选择性别">
              <el-option
                v-for="item in genderList"
                :key="item.id"
                :label="item.gender"
                :value="item.id">
                <!-- <span style="float: left">{{ item.label }}</span> -->
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="editStudentInfoForm.birth"
              type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              placeholder="选择日期" :picker-options="pickerDateOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="家庭地址" prop="region">
            <el-input v-model="editStudentInfoForm.region"></el-input>
          </el-form-item>
          <el-form-item label="入学时间" prop="entranceDate">
            <el-date-picker
              v-model="editStudentInfoForm.entranceDate"
              type="month"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="系名称">
            <template>
              <el-select v-model="editStudentInfoForm.aclass.departmentId">
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item> -->
          <el-form-item label="班级名称">
            <template>
              <el-select v-model="editStudentInfoForm.aclass.id">
                <el-option
                  v-for="item in classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editStudentInfoDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateStuInfo">确定</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 检查身份证是否是有效
    var checkIdCardNumber = (rule, value, callback) => {
      const patter = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!patter.test(value)) {
        return callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    // 检查密码由数字与字母组成
    var checkCosNumbersAreNumandDigit = (rule, value, callback) => {
      // 以下是检测数字或字母的正则表达式
      // const patter = /^[0-9a-zA-Z]+$/
      const patter = /^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,}$/
      if (!patter.test(value)) {
        return callback(new Error('密码必须是6位以上，同时含有字母与数字'))
      } else {
        callback()
      }
    }
    // var checkStuIdIsPepeated = (rule, value, callback) => {

    // }
    return {
      // 获取学生列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currentPage: 1,
        // 当前每页显示多少条数据
        pageSize: 2
      },
      studentList: [
        // { dep: '计算机科学', grade: '2017级', class: '4班', major: '软件工程', studentname: '张三', stuNo: '2017110499' },
        // { dep: '数学', grade: '2016级', class: '1班', major: '应用数学', studentname: '李思', stuNo: '2016130189' }
      ],
      // 为学生分配角色而获取的所有角色列表
      allRolesList: [],
      // 所有班级列表
      classList: [],
      // 性别列表
      genderList: [{ id: 0, gender: '男' }, { id: 1, gender: '女' }],
      // 系列表
      departmentList: [],
      // 默认性别id为0
      selectedStudentGenderId: 0,
      // 获取学生数据总条数
      total: 0,
      // 控制添加学生对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑学生对话框的显示与隐藏
      editStudentNaPDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      editStudentInfoDialogVisible: false,
      // 添加学生的表单数据
      addStudentForm: {
        aclass: {
          departmentId: 0,
          grade: "string",
          id: 0,
          name: "string",
          number: "string"
        },
        birth: '',
        courseList: [
        ],
        entranceDate: '2019-09-01',
        gender: 0,
        // 后台自动生成id
        id: 0,
        name: '',
        region: '四川成都',
        role: {
          id: 0
        },
        score: 0,
        // 接口传递参数时使用的加密过的密码和身份证
        password: '',
        idNumber: '',
        // 加密前的密码和身份证
        passwordBeforeMD5: '',
        idNumberBeforeMD5: ''
      },
      pickerDateOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        },
        {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        },
        {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      // 添加学生时下拉框中被选择的角色ID
      // chosenRoleIdAddStudent: 1,
      // 添加表单的验证规则对象
      addStudentFormRules: {
        name: [
          {
            required: true, message: '请输入学生名', trigger: 'blur'
          },
          {
            min: 2, max: 15, message: '学生名的长度在2~15个字符之间', trigger: 'blur'
          }
        ],
        region: [
          {
            required: true, message: '请输入家庭住址', trigger: 'blur'
          }
        ],
        idNumberBeforeMD5: [
          {
            required: true, message: '请输入身份证号', trigger: 'blur'
          },
          {
            validator: checkIdCardNumber, trigger: 'blur'
          }
        ],
        passwordBeforeMD5: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          },
          {
            validator: checkCosNumbersAreNumandDigit, trigger: 'blur'
          }
        ]
      },
      // 编辑学生信息的表单数据
      editStudentInfoForm: {
        aclass: {
          departmentId: 0,
          grade: "string",
          id: 0,
          name: "string",
          number: "string"
        },
        birth: '2000-03-02',
        courseList: [
        ],
        entranceDate: '2020-09-01',
        gender: 0,
        // 后台自动生成id
        id: 0,
        name: '',
        region: '',
        role: {
          id: 0
        },
        roleId: 0,
        score: 0,
        // 接口传递参数时使用的加密过的密码和身份证
        password: '',
        idNumber: '',
        // 加密前的密码和身份证
        // passwordBeforeMD5: '',
        // idNumberBeforeMD5: ''
      },
      // 编辑学生信息表单的验证规则
      editStudentInfoFormRules: {
        name: [
          {
            required: true, message: '请输入学生名', trigger: 'blur'
          },
          {
            min: 2, max: 15, message: '学生名的长度在2~15个字符之间', trigger: 'blur'
          }
        ],
        region: [
          {
            required: true, message: '请输入家庭住址', trigger: 'blur'
          }
        ]
        // idNumberBeforeMD5: [
        //   // {
        //   //   required: true, message: '请输入身份证号', trigger: 'blur'
        //   // },
        //   {
        //     validator: checkIdCardNumber, trigger: 'blur'
        //   }
        // ],
        // passwordBeforeMD5: [
        //   // {
        //   //   required: true, message: '请输入密码', trigger: 'blur'
        //   // },
        //   {
        //     validator: checkCosNumbersAreNumandDigit, trigger: 'blur'
        //   }
        // ]
      },
      // 编辑学生的表单数据(接口需要数据为id,idNumber,name,password,role.id)
      editStudentNaPForm: {
        id: 0,
        name: '',
        password: '',
        passwordBeforeMD5: '',
        // 接口中没有用到
        roleId: 0,
        role: {
          id: 0,
          name: '',
          permissions: []
        }
      },
      // 编辑用户名以及重置密码表单的验证规则对象
      editStudentNaPFormRules: {
        name: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          },
          {
            min: 2, max: 15, message: '用户名的长度在2~15个字符之间', trigger: 'blur'
          }
        ],
        // 表单中存储的加密的密码
        password: [
          // {
          //   required: true, message: '请输入密码', trigger: 'blur'
          // },
          // {
          //   min: 6,
          //   max: 15,
          //   message: '密码的长度在6~15个字符之间',
          //   trigger: 'blur'
          // }
        ],
        passwordBeforeMD5: [
          {
            required: true, message: '请输入重置的密码', trigger: 'blur'
          },
          // {
          //   min: 6,
          //   max: 15,
          //   message: '密码的长度在6~15个字符之间',
          //   trigger: 'blur'
          // }
          {
            validator: checkCosNumbersAreNumandDigit, trigger: 'blur'
          }
        ]
      },
      // 当前被编辑权限的用户的角色id
      selectedStudentRoleId: '',
      // 当前被编辑权限的用户的用户id
      selectedStudentId: ''
    }
  },
  created () {
    // 获取基本数据
    this.getAllRolesList()
    this.getStudentTotal()
    this.getStudentList()
    this.getClassList()
    this.getDepartmentList()
  },
  methods: {
    // 获取所有学生数量
    async getStudentTotal () {
      // 为了获取total进行axios请求(假设学生人数不超过1000)
      await this.$http.get('/admin/listStudent?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取所有学生数量
          // alert(res.data.length)
          this.total = res.data.length
          // console.log(res.data)
        }).catch(err => {
          console.log('获取学生列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
    },
    // 获取所有学生列表(含分页参数)
    async getStudentList () {
      // console.log('管理员姓名')
      // console.log('username', window.sessionStorage.getItem('username'))
      await this.$http.get('/admin/listStudent?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取学生列表信息以及学生数量
          this.studentList = res.data
          // alert('学生列表长度：' + res.data.length)
          // this.total = res.data.total
          // console.log(res.data)
        }).catch(err => {
          console.log('获取学生列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
      this.studentList.forEach(item => {
        if (item.birth !== null) {
          item.birth = item.birth.substr(0, 10)
        }
        if (item.entranceDate !== null) {
          item.entranceDate = item.entranceDate.substr(0, 7)
        }
      })
    },
    // 获取所有班级数量
    async getClassList () {
      // 为了获取total进行axios请求(假设班级人数不超过1000)
      await this.$http.get('/classe/listClass?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取所有班级
          this.classList = res.data
        }).catch(err => {
          console.log('获取班级列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
    },
    // 获取所有角色列表(可以与上面的学生列表合并请求),同时获取学生角色id
    async getAllRolesList () {
      await this.$http.get('/admin/listRole?pageSize=10&startPage=1')
        .then(res => {
          // 获取所有角色列表信息
          // res.data.forEach(item => {
          //   this.allRolesList.push({ id: item.id, name: item.name })
          // })
          // alert('getRoleList:' + res.data)
          this.allRolesList = res.data
          this.allRolesList.forEach(item => {
            if (item.name === '学生') {
              // this.chosenRoleIdAddStudent = item.id
              this.addStudentForm.role.id = item.id
              this.editStudentNaPForm.role.id = item.id
            }
          })
          // console.log('获取的角色：' + this.allRolesList[2].id)
          // console.log('获取的角色：' + this.allRolesList[2].name)
        }).catch(err => {
          console.log('获取所有角色列表失败！' + err)
          // return this.$message.error('获取所有角色列表失败！')
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
    },
    // 监听 pageSize(页面显示最多条数，在页面中可进行1,2,5,10条/页的选择) 改变的事件
    handleSizeChange (newSize) {
      // console.log('页面显示最多条数：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getStudentList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.currentPage = newPage
      this.getStudentList()
    },
    // 点击添加学生按钮展示添加对话框
    showAddStudentDialog () {
      this.addDialogVisible = true
    },
    // 点击编辑展示编辑学生姓名和重置密码对话框
    showeditStudentNaPDialog (student) {
      this.editStudentNaPForm.id = student.id
      console.log('编辑学生id：', this.editStudentNaPForm.id)
      this.editStudentNaPForm.name = student.name
      // this.editstudentForm.passwordBeforeMD5 = student.password
      this.editStudentNaPDialogVisible = true
    },
    // 监听添加学生对话框的关闭事件
    addStudentDialogClosed () {
      this.$refs.addStudentFormRef.resetFields()
    },
    // 监听编辑学生对话框的关闭事件
    editStudentNaPDialogClosed () {
      this.$refs.editStudentNaPFormRef.resetFields()
    },
    // 监听分配角色对话框的关闭事件
    editStudentInfoDialogClosed () {
      this.DefaultSelectedPermsName = ''
    },
    // 点击按钮添加新学生
    addStudent () {
      // 入学时间和出生日期的格式化
      const dEntrance = new Date(this.addStudentForm.entranceDate.substr)
      this.addStudentForm.entranceDate = dEntrance.getFullYear() + '-' + this.p((dEntrance.getMonth() + 1)) + '-' + this.p(dEntrance.getDate())
      const dBirth = new Date(this.addStudentForm.birth.substr)
      this.addStudentForm.birth = dBirth.getFullYear() + '-' + this.p((dBirth.getMonth() + 1)) + '-' + this.p(dBirth.getDate())
      // 密码与身份证的加密
      this.addStudentForm.password = this.$md5(this.addStudentForm.passwordBeforeMD5)
      this.addStudentForm.idNumber = this.$md5(this.addStudentForm.idNumberBeforeMD5)
      delete this.addStudentForm.passwordBeforeMD5
      delete this.addStudentForm.idNumberBeforeMD5
      console.log('添加学生的信息：', this.addStudentForm)
      this.$refs.addStudentFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        await this.$http.post('/admin/addStudent', this.addStudentForm)
          .then(res => {
            if (res.data.code === 400) {
              // this.$refs.addStudentFormRef.resetFields()
              return this.$message.error('添加学生失败')
            }
            if (res.status === 200 && res.data.code !== 400) {
              // 隐藏添加学生的对话框
              this.addDialogVisible = false
              return this.$message.success('添加学生成功！')
            }
          }).catch(err => {
            console.log('添加学生失败！' + err)
            // 隐藏添加学生的对话框
            this.addDialogVisible = false
            // return this.$message.error('获取所有角色列表失败！')
          })
        // this.$message.success('添加学生成功')
        // 重新获取学生列表数据
        this.getStudentList()
      })
    },
    // p为不够10添加0的函数(用于日期对象)
    p(s) {
          return s < 10 ? '0' + s : s
    },
    // 根据id删除对应的学生信息
    async removeStudentById (id) {
      // console.log('删除学生的id是：' + id)
      // 弹框询问学生是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log('点击了删除对话框的 ' + confirmResult)
      // 如果学生点击确定，confirmResult返回值为字符串 confirm，点击取消返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！123')
      }
      // console.log('确认删除学生！')
      await this.$http.delete('/admin/deleteStudent?id=' + id)
        .then(res => {
          if (res.status !== 200) {
            return this.$message.error('删除学生失败！')
          } else {
            console.log(res.massage + '删除学生成功！')
          }
          this.getStudentList()
        }).catch(err => {
          console.log('删除学生失败！' + err)
        })
    },
    // 展示编辑角色对话框
    showeditStudentInfoDialog (student) {
      // 学生基本信息的赋值
      this.editStudentInfoForm.aClass = student.aClass
      this.editStudentInfoForm.id = student.id
      this.editStudentInfoForm.name = student.name
      this.editStudentInfoForm.gender = student.gender
      this.editStudentInfoForm.aclass.id = student.aclass.id

      // 日期的处理
      this.editStudentInfoForm.entranceDate = student.entranceDate
      this.editStudentInfoForm.birth = student.birth
      // 家庭住址，密码，身份证号，角色，课时的处理
      this.editStudentInfoForm.region = student.region
      this.editStudentInfoForm.password = student.password
      this.editStudentInfoForm.idNumber = student.idNumber
      this.editStudentInfoForm.role.id = student.role.id
      this.editStudentInfoForm.roleId = student.roleId
      this.editStudentInfoForm.score = student.score
      // 对话框的关闭以及页面的更新
      this.editStudentInfoDialogVisible = true
      this.getStudentList()
    },
    // 更新学生姓名和密码
    async updateStudent () {
      this.editStudentNaPForm.password = this.$md5(this.editStudentNaPForm.passwordBeforeMD5)
      delete this.editStudentNaPForm.passwordBeforeMD5
      await this.$http.put('/admin/updateUser', this.editStudentNaPForm)
        .then(res => {
          if (res.status === 200) {
            console.log('重置密码成功！')
            return this.$message.success('更改密码成功！')
          }
        }).catch(function (err) {
          console.log('重置密码失败 errMsg ' + err)
        })
      this.editStudentNaPDialogVisible = false
    },
    // 入学时间过滤器进行筛选
    filterEntrDateHandler (value, row, column) {
      return row.entranceDate === value
    },
    // 性别过滤器进行筛选
    filterGenderHandler (value, row, column) {
      console.log('性别', row.gender)
      var genderId = row.gender
      var gender = ''
      this.genderList.forEach( item => {
        if (item.id === genderId) {
          gender = item.gender
        }
      })
      return gender === value
    },
    // 编辑(或修改)学生信息
    async updateStuInfo () {
      console.log('传回的入学日期', this.editStudentInfoForm.entranceDate)
      const dEntrance = new Date(this.editStudentInfoForm.entranceDate)
      this.editStudentInfoForm.entranceDate = dEntrance.getFullYear() + '-' + this.p((dEntrance.getMonth() + 1)) + '-' + this.p(dEntrance.getDate())
      const dBirth = new Date(this.editStudentInfoForm.birth)
      this.editStudentInfoForm.birth = dBirth.getFullYear() + '-' + this.p((dBirth.getMonth() + 1)) + '-' + this.p(dBirth.getDate())
      console.log('update 修改学生信息：', this.editStudentInfoForm)
      await this.$http.put('/admin/updateStudent', this.editStudentInfoForm)
          .then(res => {
            if (res.status === 200) {
              console.log('更新学生信息成功！')
              return this.$message.success('更改学生信息成功！')
            }
          }).catch(function (err) {
            console.log('更改学生信息失败 errMsg ' + err)
          })
        this.editStudentInfoDialogVisible = false
        this.getStudentList()
    },
    // 模糊搜寻学生
    async searchStudnetList () {
      console.log('queryInfo', this.queryInfo.query)
      this.queryInfo.pageSize = 10
      await this.$http.get('/admin/searchStudent?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage + '&str=' + this.queryInfo.query)
        .then(res => {
          // 获取学生列表信息以及学生数量
          this.studentList = res.data
        }).catch(err => {
          console.log('获取学生列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
      this.studentList.forEach(item => {
        if (item.birth !== null) {
          item.birth = item.birth.substr(0, 10)
        }
        if (item.entranceDate !== null) {
          item.entranceDate = item.entranceDate.substr(0, 7)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
