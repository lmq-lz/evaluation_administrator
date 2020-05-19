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
                      <el-button slot="append" icon="el-icon-search" @click="getStudentList"></el-button>
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
              <el-table-column label="性别" prop="gender" >
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
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditStudentDialog(scope.row)"></el-button>
                      </el-tooltip>
                      <!-- 删除按钮 -->
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeStudentById(scope.row.id)"></el-button>
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

      <!-- 添加学生的对话框 -->
      <el-dialog
      title="添加学生"
      :visible.sync="addDialogVisible"
      width="40%" @close="addStudentDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addStudentForm" :rules="addStudentFormRules" ref="addStudentFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addStudentFormRules)的属性 -->
              <el-form-item label="学生id" prop="id">
                <el-input v-model="addStudentForm.id"></el-input>
              </el-form-item>
              <el-form-item label="学生名" prop="name">
                  <!-- v-model数据双向绑定，同步到addStudentForm -->
                <el-input v-model="addStudentForm.name"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="passwordBeforeMD5">
                <el-input v-model="addStudentForm.passwordBeforeMD5"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="idNumberBeforeMD5">
                <el-input v-model="addStudentForm.idNumberBeforeMD5"></el-input>
              </el-form-item>
              <!-- <el-form-item label="角色">
                <template>
                  <el-select v-model="chosenRoleIdAddStudent">
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
                <el-input v-model="addStudentForm.department"></el-input>
              </el-form-item> -->
              <!-- <el-form-item label="密码" prop="password">
                <el-input v-model="addStudentForm.password"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addStudentForm.password"></el-input>
              </el-form-item> -->
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="addStudent">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑学生的对话框 -->
      <el-dialog
      title="编辑学生"
      :visible.sync="editDialogVisible"
      width="40%" @close="editStudentDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editStudentForm" :rules="editStudentFormRules" ref="editStudentFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addStudentFormRules)的属性 -->
              <el-form-item label="学生名" prop="name">
                  <!-- v-model数据双向绑定，同步到addStudentForm -->
                <el-input v-model="editStudentForm.name"></el-input>
              </el-form-item>
              <el-form-item label="重置密码" prop="passwordBeforeMD5">
                <el-input v-model="editStudentForm.passwordBeforeMD5"></el-input>
              </el-form-item>
              <!-- <el-form-item label="密码" prop="password">
                  <el-input v-model="editStudentForm.password"></el-input>
              </el-form-item>
              <el-form-item label="学院" prop="department">
                  <el-input v-model="editStudentForm.department"></el-input>
              </el-form-item> -->
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateStudent()">确定</el-button>
          </span>
      </el-dialog>
      <!-- 分配学生角色的对话选择框 -->
      <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%" @close="editRoleDialogClosed">
          <el-select v-model="selectedStudentRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in allRolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <!-- <span style="float: left">{{ item.label }}</span> -->
              <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
            </el-option>
          </el-select>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateStudentRole">确定</el-button>
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
      // 获取学生数据总条数
      total: 0,
      // 控制添加学生对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑学生对话框的显示与隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 添加学生的表单数据
      addStudentForm: {
        id: 0,
        // 加密后的学生身份证号
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
        // 表单里学生填入的密码
        passwordBeforeMD5: '',
        // 表单里学生填入的身份证
        idNumberBeforeMD5: ''
      },
      // 保存输入的密码
      inputPassword: '',
      // 保存输入的身份证
      inputIdNumber: '',
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
      // 编辑学生的表单数据(接口需要数据为id,idNumber,name,password,role.id)
      editStudentForm: {
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
      // 编辑表单的验证规则对象
      editStudentFormRules: {
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
    // alert('加密内容：' + this.$md5('123'))
    this.getAllRolesList()
    this.getStudentTotal()
    this.getStudentList()
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
      //  axios请求(请求路径，请求参数)
      // const { data: res } = await this.$http.get('/admin/listStudent', { rid: 3 })
      // if (res.meta.status !== 200) {
      //   const msg = this.$message.error('获取学生列表失败')
      //   return msg
      // }
      // this.studentList = res.data.studentList
      // this.total = res.data.total
      // console.log(res)

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
              this.editStudentForm.role.id = item.id
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
    // 点击编辑展示编辑学生对话框
    showEditStudentDialog (student) {
      this.editStudentForm.id = student.id
      console.log('编辑学生id：', this.editStudentForm.id)
      this.editStudentForm.name = student.name
      // this.editStudnetForm.passwordBeforeMD5 = student.password
      this.editDialogVisible = true
    },
    // 监听添加学生对话框的关闭事件
    addStudentDialogClosed () {
      this.$refs.addStudentFormRef.resetFields()
    },
    // 监听编辑学生对话框的关闭事件
    editStudentDialogClosed () {
      this.$refs.editStudentFormRef.resetFields()
    },
    // 监听分配角色对话框的关闭事件
    editRoleDialogClosed () {
      this.DefaultSelectedPermsName = ''
    },
    // 点击按钮添加新学生
    addStudent () {
      this.$refs.addStudentFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加学生的网络请求
        // const { data: res } = await this.$http.post('addStudent', this.addStudentForm)
        // if (res.meta.status !== 201) {
        //   const errMsg = this.$message.error('添加学生失败')
        //   return errMsg
        // }
        this.addStudentForm.password = this.$md5(this.addStudentForm.passwordBeforeMD5)
        this.addStudentForm.idNumber = this.$md5(this.addStudentForm.idNumberBeforeMD5)
        this.inputPassword = this.addStudentForm.passwordBeforeMD5 + ''
        this.inputIdNumber = this.addStudentForm.idNumberBeforeMD5 + ''
        // console.log('输入的密码，身份证：', this.inputPassword, this.inputIdNumber)
        delete this.addStudentForm.passwordBeforeMD5
        delete this.addStudentForm.idNumberBeforeMD5
        // console.log('addForm', this.addStudentForm)
        await this.$http.post('/admin/addUser', this.addStudentForm)
          .then(res => {
            if (res.data.code === 400) {
              // this.$refs.addStudentFormRef.resetFields()
              this.addStudentForm.id = 0
              this.addStudentForm.passwordBeforeMD5 = this.inputPassword
              this.addStudentForm.idNumberBeforeMD5 = this.inputIdNumber
              return this.$message.error('学号不能重复，请重新输入学号')
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
      await this.$http.get('/admin/deleteUser?id=' + id)
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
    showEditRoleDialog (role) {
      this.allRolesList = []
      this.getAllRolesList()
      // console.log('分配角色：' + this.allRolesList[0])
      // 保存当前操作用户的id以及其角色id
      this.selectedStudentId = role.id
      this.selectedStudentRoleId = role.roleId
      this.editRoleDialogVisible = true
      this.getStudentList()
    },
    // 更新学生的角色
    async updateStudentRole () {
      await this.$http.post('/admin/updateRole', { userId: this.selectedStudentId, roleId: this.selectedStudentRoleId })
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
    // 更新学生密码
    async updateStudent () {
      this.editStudentForm.password = this.$md5(this.editStudentForm.passwordBeforeMD5)
      console.log('编辑学生form：', this.editStudentForm)
      delete this.editStudentForm.passwordBeforeMD5
      await this.$http.put('/admin/updateUser', this.editStudentForm)
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
