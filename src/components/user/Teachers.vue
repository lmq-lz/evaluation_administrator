<template>
  <!-- 一定要放一个div根容器 -->
  <div>
      <!-- <h3>教师列表组件</h3> -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>教师管理</el-breadcrumb-item>
          <el-breadcrumb-item>教师列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          <!-- 搜索与添加区域 -->
          <el-row :gutter="100">
              <el-col :span="7">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getTeacherList">
                      <el-button slot="append" icon="el-icon-search" @click="getTeacherList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="showAddTeacherDialog()">添加教师</el-button>
              </el-col>
          </el-row>

          <!-- 教师列表区域 -->
          <el-table :data="TeacherList" border stripe :default-sort = "{prop: 'entranceDate', order: 'descending'}">
              <el-table-column type="index" label="行数"></el-table-column>
              <el-table-column label="学号" prop="id"></el-table-column>
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="籍贯" prop="region"></el-table-column>
              <el-table-column label="性别" prop="gender" >
                <template slot-scope="scope">
                  {{scope.row.gender === 0 ? '男':'女'}}
                </template>
              </el-table-column>
              <el-table-column label="身份证号" prop="idNumber"></el-table-column>
              <el-table-column label="出生日期" prop="birth"></el-table-column>
              <el-table-column label="所属系" prop="department.name"></el-table-column>
              <el-table-column label="学位" prop="degree"></el-table-column>
              <el-table-column label="毕业学校" prop="graduateSchool"></el-table-column>
              <el-table-column label="入职时间" column-key="entranceDate" prop="entranceDate"
              :filters="filterEntrDateArray"
              :filter-method="filterEntrDateHandler"></el-table-column>
              <el-table-column label="职称" prop="jobTitle" :filters="filterJobTitleArray" :filter-method="filterJobTitleTag">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.jobTitle === '助教'||scope.row.jobTitle === '讲师' ? 'primary' : (scope.row.jobTitle === '副教授' ? 'warning':'success')"
                    disable-transitions>
                    {{scope.row.jobTitle}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="角色名称" prop="role.name">
                <template slot-scope="scope">
                  <el-tag type='danger' disable-transitions>{{scope.row.role.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                  <!-- 模板中定义的slot-scope属性接受作用域插槽的数据，通过scope.row获取这一行的数据 -->
                  <template slot-scope="scope">
                      <!-- 修改按钮 -->
                      <!-- el-tooltip：进行消息的提示-->
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditTeacherDialog(scope.row)"></el-button>
                      </el-tooltip>
                      <!-- 删除按钮 -->
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeTeacherById(scope.row.id)"></el-button>
                      </el-tooltip>
                      <!-- 分配角色按钮 -->
                      <!-- <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showEditRoleDialog(scope.row)"></el-button>
                      </el-tooltip> -->
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

      <!-- 添加教师的对话框 -->
      <el-dialog
      title="添加教师"
      :visible.sync="addDialogVisible"
      width="40%" @close="addTeacherDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addTeacherForm" :rules="addTeacherFormRules" ref="addTeacherFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addTeacherFormRules)的属性 -->
              <el-form-item label="教师id" prop="id">
                <el-input v-model="addTeacherForm.id"></el-input>
              </el-form-item>
              <el-form-item label="教师名" prop="name">
                  <!-- v-model数据双向绑定，同步到addTeacherForm -->
                <el-input v-model="addTeacherForm.name"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="passwordBeforeMD5">
                <el-input v-model="addTeacherForm.passwordBeforeMD5"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="idNumberBeforeMD5">
                <el-input v-model="addTeacherForm.idNumberBeforeMD5"></el-input>
              </el-form-item>
              <!-- <el-form-item label="角色">
                <template>
                  <el-select v-model="chosenRoleIdAddTeacher">
                    <el-option
                      v-for="item in allRolesList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item> -->
              <!-- <el-form-item label="学院" prop="department">
                <el-input v-model="addTeacherForm.department"></el-input>
              </el-form-item> -->
              <!-- <el-form-item label="密码" prop="password">
                <el-input v-model="addTeacherForm.password"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addTeacherForm.password"></el-input>
              </el-form-item> -->
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="addTeacher">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑教师的对话框 -->
      <el-dialog
      title="编辑教师"
      :visible.sync="editDialogVisible"
      width="40%" @close="editTeacherDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editTeacherForm" :rules="editTeacherFormRules" ref="editTeacherFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addTeacherFormRules)的属性 -->
              <el-form-item label="教师名" prop="name">
                  <!-- v-model数据双向绑定，同步到addTeacherForm -->
                <el-input v-model="editTeacherForm.name"></el-input>
              </el-form-item>
              <el-form-item label="重置密码" prop="passwordBeforeMD5">
                <el-input v-model="editTeacherForm.passwordBeforeMD5"></el-input>
              </el-form-item>
              <!-- <el-form-item label="密码" prop="password">
                  <el-input v-model="editTeacherForm.password"></el-input>
              </el-form-item>
              <el-form-item label="学院" prop="department">
                  <el-input v-model="editTeacherForm.department"></el-input>
              </el-form-item> -->
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateTeacher()">确定</el-button>
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
      // 获取教师列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currentPage: 1,
        // 当前每页显示多少条数据
        pageSize: 2
      },
      TeacherList: [
        // { dep: '计算机科学', grade: '2017级', class: '4班', major: '软件工程', Teachername: '张三', stuNo: '2017110499' },
        // { dep: '数学', grade: '2016级', class: '1班', major: '应用数学', Teachername: '李思', stuNo: '2016130189' }
      ],
      // 为教师分配角色而获取的所有角色列表
      allRolesList: [],
      // 过滤入职时间条件数组
      filterEntrDateArray: [
        { text: '2016-09', value: '2016-09' },
        { text: '2017-09', value: '2017-09' },
        { text: '2018-09', value: '2018-09' },
        { text: '2019-09', value: '2019-09' }
      ],
      // 过滤职称条件数组
      filterJobTitleArray: [
        { text: '助教', value: '助教' },
        { text: '讲师', value: '讲师' },
        { text: '副教授', value: '副教授' },
        { text: '教授', value: '教授' }
      ],
      // 获取教师数据总条数
      total: 0,
      // 控制添加教师对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑教师对话框的显示与隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 添加教师的表单数据
      addTeacherForm: {
        id: 0,
        // 加密后的教师身份证号
        idNumber: '',
        name: '',
        // 加密后的密码
        password: '',
        // 接口中没有用到
        roleId: 0,
        role: {
          id: 0,
          name: '',
          permissions: []
        },
        // 表单里教师填入的密码
        passwordBeforeMD5: '',
        // 表单里教师填入的身份证
        idNumberBeforeMD5: ''
      },
      // 保存输入的密码
      inputPassword: '',
      // 保存输入的身份证
      inputIdNumber: '',
      // 添加教师时下拉框中被选择的角色ID
      // chosenRoleIdAddTeacher: 1,
      // 添加表单的验证规则对象
      addTeacherFormRules: {
        name: [
          {
            required: true, message: '请输入教师名', trigger: 'blur'
          },
          {
            min: 2, max: 15, message: '教师名的长度在2~15个字符之间', trigger: 'blur'
          }
        ],
        passwordBeforeMD5: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
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
        ],
        idNumberBeforeMD5: [
          {
            required: true, message: '请输入身份证号码', trigger: 'blur'
          },
          {
            validator: checkIdCardNumber, trigger: 'blur'
          }
        ]
      },
      // 编辑教师的表单数据(接口需要数据为id,idNumber,name,password,role.id)
      editTeacherForm: {
        id: 0,
        name: '',
        // 传给后台的解密后的密码
        password: '',
        // 表单中接受用户输入的密码
        passwordBeforeMD5: '',
        // 接口中没有用到
        roleId: 0,
        role: {
          id: 0,
          name: '',
          permissions: []
        }
      },
      // 编辑表单的验证规则对象
      editTeacherFormRules: {
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
      selectedTeacherRoleId: '',
      // 当前被编辑权限的用户的用户id
      selectedTeacherId: ''
    }
  },
  created () {
    // alert('加密内容：' + this.$md5('123'))
    this.getAllRolesList()
    this.getTeacherTotal()
    this.getTeacherList()
  },
  methods: {
    // 获取所有教师数量
    async getTeacherTotal () {
      // 为了获取total进行axios请求(假设教师人数不超过1000)
      await this.$http.get('/admin/listTeacher?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取所有教师数量
          // alert(res.data.length)
          this.total = res.data.length
          // console.log(res.data)
        }).catch(err => {
          console.log('获取教师列表失败！' + err)
          // return this.$message.error('获取教师列表失败！')
        })
    },
    // 获取所有教师列表(含分页参数)
    async getTeacherList () {
      //  axios请求(请求路径，请求参数)
      // const { data: res } = await this.$http.get('/admin/listTeacher', { rid: 3 })
      // if (res.meta.status !== 200) {
      //   const msg = this.$message.error('获取教师列表失败')
      //   return msg
      // }
      // this.TeacherList = res.data.TeacherList
      // this.total = res.data.total
      // console.log(res)

      await this.$http.get('/admin/listTeacher?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取教师列表信息以及教师数量
          this.TeacherList = res.data
          // alert('教师列表长度：' + res.data.length)
          // this.total = res.data.total
          // console.log(res.data)
        }).catch(err => {
          console.log('获取教师列表失败！' + err)
          // return this.$message.error('获取教师列表失败！')
        })
      this.TeacherList.forEach(item => {
        if (item.birth !== null) {
          item.birth = item.birth.substr(0, 10)
        }
        if (item.entranceDate !== null) {
          item.entranceDate = item.entranceDate.substr(0, 7)
        }
      })
    },
    // 获取所有角色列表(可以与上面的教师列表合并请求),同时获取教师角色id
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
            if (item.name === '教师') {
              // this.chosenRoleIdAddTeacher = item.id
              this.addTeacherForm.role.id = item.id
              this.editTeacherForm.role.id = item.id
            }
          })
          // console.log('获取的角色：' + this.allRolesList[2].id)
          // console.log('获取的角色：' + this.allRolesList[2].name)
        }).catch(err => {
          console.log('获取所有角色列表失败！' + err)
          // return this.$message.error('获取所有角色列表失败！')
        })
    },
    // 监听 pageSize(页面显示最多条数，在页面中可进行1,2,5,10条/页的选择) 改变的事件
    handleSizeChange (newSize) {
      // console.log('页面显示最多条数：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getTeacherList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.currentPage = newPage
      this.getTeacherList()
    },
    // 点击添加教师按钮展示添加对话框
    showAddTeacherDialog () {
      this.addDialogVisible = true
    },
    // 点击编辑展示编辑教师对话框
    showEditTeacherDialog (Teacher) {
      this.editTeacherForm.id = Teacher.id
      console.log('编辑教师id：', this.editTeacherForm.id)
      this.editTeacherForm.name = Teacher.name
      // this.editteacherForm.passwordBeforeMD5 = Teacher.password
      this.editDialogVisible = true
    },
    // 监听添加教师对话框的关闭事件
    addTeacherDialogClosed () {
      this.$refs.addTeacherFormRef.resetFields()
    },
    // 监听编辑教师对话框的关闭事件
    editTeacherDialogClosed () {
      this.$refs.editTeacherFormRef.resetFields()
    },
    // 监听分配角色对话框的关闭事件
    editRoleDialogClosed () {
      this.DefaultSelectedPermsName = ''
    },
    // 点击按钮添加新教师
    addTeacher () {
      this.$refs.addTeacherFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        this.addTeacherForm.password = this.$md5(this.addTeacherForm.passwordBeforeMD5)
        this.addTeacherForm.idNumber = this.$md5(this.addTeacherForm.idNumberBeforeMD5)
        this.inputPassword = this.addTeacherForm.passwordBeforeMD5 + ''
        this.inputIdNumber = this.addTeacherForm.idNumberBeforeMD5 + ''
        // console.log('输入的密码，身份证：', this.inputPassword, this.inputIdNumber)
        delete this.addTeacherForm.passwordBeforeMD5
        delete this.addTeacherForm.idNumberBeforeMD5
        // console.log('addForm', this.addTeacherForm)
        await this.$http.post('/admin/addUser', this.addTeacherForm)
          .then(res => {
            if (res.data.code === 400) {
              // this.$refs.addTeacherFormRef.resetFields()
              this.addTeacherForm.id = 0
              this.addTeacherForm.passwordBeforeMD5 = this.inputPassword
              this.addTeacherForm.idNumberBeforeMD5 = this.inputIdNumber
              return this.$message.error('学号不能重复，请重新输入学号')
            }
            if (res.status === 200 && res.data.code !== 400) {
              // 隐藏添加教师的对话框
              this.addDialogVisible = false
              return this.$message.success('添加教师成功！')
            }
          }).catch(err => {
            console.log('添加教师失败！' + err)
            // 隐藏添加教师的对话框
            this.addDialogVisible = false
            // return this.$message.error('获取所有角色列表失败！')
          })
        // this.$message.success('添加教师成功')
        // 重新获取教师列表数据
        this.getTeacherList()
      })
    },
    // 根据id删除对应的教师信息
    async removeTeacherById (id) {
      // console.log('删除教师的id是：' + id)
      // 弹框询问教师是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log('点击了删除对话框的 ' + confirmResult)
      // 如果教师点击确定，confirmResult返回值为字符串 confirm，点击取消返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！123')
      }
      // console.log('确认删除教师！')
      await this.$http.get('/admin/deleteUser?id=' + id)
        .then(res => {
          if (res.status !== 200) {
            return this.$message.error('删除教师失败！')
          } else {
            console.log(res.massage + '删除教师成功！')
          }
          this.getTeacherList()
        }).catch(err => {
          console.log('删除教师失败！' + err)
        })
    },
    // 展示编辑角色对话框
    showEditRoleDialog (role) {
      this.allRolesList = []
      this.getAllRolesList()
      // console.log('分配角色：' + this.allRolesList[0])
      // 保存当前操作用户的id以及其角色id
      this.selectedTeacherId = role.id
      this.selectedTeacherRoleId = role.roleId
      this.editRoleDialogVisible = true
      this.getTeacherList()
    },
    // 更新教师的角色
    async updateTeacherRole () {
      await this.$http.post('/admin/updateRole', { userId: this.selectedTeacherId, roleId: this.selectedTeacherRoleId })
        .then(res => {
          // console.log('更换角色请求res:' + response)
          // this.$message.success('更换角色成功！！')
          // 重新获取权限列表数据
          this.getAllRolesList()
        })
        .catch(function (err) {
          console.log('更换角色请求失败 errorMsg：' + err)
          // this.$message.error('更换角色失败，请重试！')
        })
    },
    // 更新教师密码
    async updateTeacher () {
      this.editTeacherForm.password = this.$md5(this.editTeacherForm.passwordBeforeMD5)
      console.log('编辑教师form：', this.editTeacherForm)
      delete this.editTeacherForm.passwordBeforeMD5
      await this.$http.put('/admin/updateUser', this.editTeacherForm)
        .then(res => {
          if (res.status === 200) {
            console.log('重置密码成功！')
            return this.$message.success('更改密码成功！')
          }
        }).catch(function (err) {
          console.log('重置秘密失败 errMsg ' + err)
        })
      this.editDialogVisible = false
    },
    // 入学时间过滤器进行筛选
    filterEntrDateHandler (value, row, column) {
      // const property = column.entranceDate
      return row.entranceDate === value
    },
    // 职称过滤器进行筛选
    filterJobTitleTag (value, row, column) {
      return row.jobTitle === value
    }
  }
}
</script>

<style lang="less" scoped>
</style>
