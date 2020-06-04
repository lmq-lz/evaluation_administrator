<template>
  <!-- 一定要放一个div根容器 -->
  <div>
      <!-- <h3>督导列表组件</h3> -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>督导管理</el-breadcrumb-item>
          <el-breadcrumb-item>督导列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          <!-- 搜索与添加区域 -->
          <el-row :gutter="100">
              <el-col :span="7">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getSupervisorList">
                      <el-button slot="append" icon="el-icon-search" @click="getSupervisorList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="showAddSupervisorDialog()">添加督导</el-button>
              </el-col>
          </el-row>

          <!-- 督导列表区域 -->
          <el-table :data="supervisorList" border stripe :default-sort = "{prop: 'id', order: 'ascending'}">
              <el-table-column type="index" label="行数"></el-table-column>
              <el-table-column label="督导ID" prop="id"></el-table-column>
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="性别" prop="gender" >
                <template slot-scope="scope">
                  {{scope.row.gender === 0 ? '男':'女'}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                  <!-- 模板中定义的slot-scope属性接受作用域插槽的数据，通过scope.row获取这一行的数据 -->
                  <template slot-scope="scope">
                      <!-- 修改老师具体信息按钮 -->
                      <!-- el-tooltip：进行消息的提示-->
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditSupervisorInfoDialog(scope.row)"></el-button>
                      </el-tooltip>
                      <!-- 删除按钮 -->
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeSupervisorById(scope.row.id)"></el-button>
                      </el-tooltip>
                      <!-- 更改姓名和密码按钮 -->
                      <el-tooltip  effect="dark" content="重置姓名或密码" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showeditSupervisorNaPDialog(scope.row)"></el-button>
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

      <!-- 添加督导的对话框 -->
      <el-dialog
      title="添加督导"
      :visible.sync="addDialogVisible"
      width="40%" @close="addSupervisorDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addSupervisorForm" :rules="addSupervisorFormRules" ref="addSupervisorFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addSupervisorFormRules)的属性 -->
              <!-- 督导id由系统自动生成 -->
              <!-- <el-form-item label="督导id" prop="id">
                <el-input v-model="addSupervisorForm.id"></el-input>
              </el-form-item> -->
              <el-form-item label="督导名" prop="name">
                  <!-- v-model数据双向绑定，同步到addSupervisorForm -->
                <el-input v-model="addSupervisorForm.name"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="passwordBeforeMD5">
                <el-input v-model="addSupervisorForm.passwordBeforeMD5"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="idNumberBeforeMD5">
                <el-input v-model="addSupervisorForm.idNumberBeforeMD5"></el-input>
              </el-form-item>
              <el-form-item label='性别'>
                <el-select v-model="addSupervisorForm.gender" placeholder="请选择性别">
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
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="addSupervisor">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑督导信息的对话选择框 -->
      <el-dialog
      title="编辑督导"
      :visible.sync="editSupervisorInfoDialogVisible"
      width="40%" @close="editSupervisorInfoDialogClosed">
        <el-form :model="editSupervisorInfoForm" :rules="editSupervisorInfoFormRules" ref="editSupervisorInfoFormRef" label-width="70px">
          <el-form-item label="督导名" prop="name">
            <!-- v-model数据双向绑定，同步到addSupervisorForm -->
          <el-input v-model="editSupervisorInfoForm.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="passwordBeforeMD5">
            <el-input v-model="editSupervisorInfoForm.passwordBeforeMD5"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNumberBeforeMD5">
            <el-input v-model="editSupervisorInfoForm.idNumberBeforeMD5"></el-input>
          </el-form-item> -->
          <el-form-item label='性别'>
            <el-select v-model="editSupervisorInfoForm.gender" placeholder="请选择性别">
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
        </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editSupervisorInfoDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateSupervisorInfo">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑督导姓名和重置密码的对话框 -->
      <el-dialog
      title="编辑督导"
      :visible.sync="editDialogVisible"
      width="40%" @close="editSupervisorNaPDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editSupervisorNaPForm" :rules="editSupervisorNaPFormRules" ref="editSupervisorNaPFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addSupervisorFormRules)的属性 -->
              <el-form-item label="督导名" prop="name">
                  <!-- v-model数据双向绑定，同步到addSupervisorForm -->
                <el-input v-model="editSupervisorNaPForm.name"></el-input>
              </el-form-item>
              <el-form-item label="重置密码" prop="passwordBeforeMD5">
                <el-input v-model="editSupervisorNaPForm.passwordBeforeMD5"></el-input>
              </el-form-item>
          </el-form>
          <!-- footer是对话框底部区域 -->
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateSupervisor()">确定</el-button>
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
      // 获取督导列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currentPage: 1,
        // 当前每页显示多少条数据
        pageSize: 2
      },
      supervisorList: [
        // { dep: '计算机科学', grade: '2017级', class: '4班', major: '软件工程', Supervisorname: '张三', stuNo: '2017110499' },
        // { dep: '数学', grade: '2016级', class: '1班', major: '应用数学', Supervisorname: '李思', stuNo: '2016130189' }
      ],
      // 性别列表
      genderList: [{ id: 0, gender: '男' }, { id: 1, gender: '女' }],
      // 政治面貌列表
      politicalStatusList: [{ id: 1, name: '中共党员' }, { id: 2, name: '共青团员' }, { id: 3, name: '少先队员' }, { id: 4, name: '群众' }],
      // 学位列表
      degreeList: [{ id: 1, name: '博士' }, { id: 2, name: '硕士研究生' }, { id: 3, name: '本科' }, { id: 4, name: '专科' } ],
      // 获取督导数据总条数
      total: 0,
      // 控制添加督导对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑督导名称和密码对话框的显示与隐藏
      editDialogVisible: false,
      // 控制编辑督导具体信息的显示与隐藏
      editSupervisorInfoDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 添加督导的表单数据
      addSupervisorForm: {
        // 性别编号
        gender: 0,
        id: 0,
        name: '',
        role: {
          id: 2,
          name: '',
          permissions: []
        },
        // 加密后的密码
        password: '',
        // 加密后的督导身份证号
        idNumber: '',
        // 表单里督导填入的密码
        passwordBeforeMD5: '',
        // 表单里督导填入的身份证
        idNumberBeforeMD5: ''
      },
      // 添加表单的验证规则对象
      addSupervisorFormRules: {
        name: [
          {
            required: true, message: '请输入督导名', trigger: 'blur'
          },
          {
            min: 2, max: 15, message: '督导名的长度在2~15个字符之间', trigger: 'blur'
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
      // 编辑督导具体信息的表单
      editSupervisorInfoForm: {
        // 性别编号
        gender: 0,
        id: 0,
        name: '',
        role: {
          id: 2,
          name: '',
          permissions: []
        }
        // 加密后的密码
        // password: '',
        // 加密后的督导身份证号
        // idNumbe/r: '',
        // 表单里督导填入的密码
        // passwordBeforeMD5: '',
        // 表单里督导填入的身份证
        // idNumberBeforeMD5: ''
      },
      // 编辑督导具体信息的验证规则
      editSupervisorInfoFormRules: {
        name: [
          {
            required: true, message: '请输入督导名', trigger: 'blur'
          },
          {
            min: 2, max: 15, message: '督导名的长度在2~15个字符之间', trigger: 'blur'
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
      // 编辑督导姓名与密码的表单数据((接口需要数据为id,idNumber,name,password,role.id)?)
      editSupervisorNaPForm: {
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
      editSupervisorNaPFormRules: {
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
      selectedSupervisorRoleId: '',
      // 当前被编辑权限的用户的用户id
      selectedSupervisorId: '',
      // datePicker日期选择器的快速选择+选择条件
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
    }
  },
  created () {
    // this.getAllRolesList()
    this.getSupervisorTotal()
    this.getSupervisorList()

    // 给用户行为详细内容赋值（页面统一id,module,subModule）
    // 具体operate在具体事件中指定
    this.$global_dataBurialForm.id = JSON.parse(window.sessionStorage.getItem('user')).id
    this.$global_dataBurialForm.module = '用户管理'
    this.$global_dataBurialForm.subModule = '督导管理'

    // 给用户行为详细内容赋值（页面统一id,module,subModule）
    // 具体operate在具体事件中指定
    this.$global_webPageDataBurialForm.id = JSON.parse(window.sessionStorage.getItem('user')).id
    this.$global_webPageDataBurialForm.subModule = '督导管理页面'
    console.log('网页表单：', this.$global_webPageDataBurialForm)
    // 上报事件（访问页面）
    this.reportDataBurial('/userBehavior/add', this.$global_webPageDataBurialForm)
  },
  methods: {
    // 获取所有督导数量
    async getSupervisorTotal () {
      // 为了获取total进行axios请求(假设督导人数不超过1000)
      await this.$http.get('/admin/listSupervisor?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取所有督导数量
          // alert(res.data.length)
          this.total = res.data.length
          // console.log(res.data)
        }).catch(err => {
          console.log('获取督导列表失败！' + err)
          // return this.$message.error('获取督导列表失败！')
        })
    },
    // 获取所有督导列表(含分页参数)
    async getSupervisorList () {
      //  axios请求(请求路径，请求参数)
      // const { data: res } = await this.$http.get('/admin/listSupervisor', { rid: 3 })
      // if (res.meta.status !== 200) {
      //   const msg = this.$message.error('获取督导列表失败')
      //   return msg
      // }
      // this.SupervisorList = res.data.SupervisorList
      // this.total = res.data.total
      // console.log(res)

      await this.$http.get('/admin/listSupervisor?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取督导列表信息以及督导数量
          this.supervisorList = res.data
          if (this.supervisorList !== null) {
            this.addSupervisorForm.role.id = this.supervisorList[0].role.id
          }
          // alert('督导列表长度：' + res.data.length)
          // this.total = res.data.total
          // console.log(res.data)
        }).catch(err => {
          console.log('获取督导列表失败！' + err)
          // return this.$message.error('获取督导列表失败！')
        })
        // 如果supervisorList不为空就将设置日期格式
        // if (this.supervisorList !== null) {
        //   // 设置时间为yyyy-MM-dd
        //   this.supervisorList.forEach(item => {
        //     if (item.birth !== null) {
        //       item.birth = item.birth.substr(0, 10)
        //     }
        //     if (item.entranceDate !== null) {
        //       item.entranceDate = item.entranceDate.substr(0, 7)
        //     }
        //     if (item.grantDate !== null) {
        //       item.grantDate = item.grantDate.substr(0, 10)
        //     }
        //   })
        // }
        
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
      this.getSupervisorList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.currentPage = newPage
      this.getSupervisorList()
    },
    // 点击添加督导按钮展示添加对话框
    showAddSupervisorDialog () {
      // this.getDepartmentList()
      this.addDialogVisible = true
    },
    // 点击编辑展示编辑督导对话框
    showeditSupervisorNaPDialog (supervisor) {
      this.editSupervisorNaPForm.id = supervisor.id
      console.log('编辑督导id：', this.editSupervisorNaPForm.id)
      this.editSupervisorNaPForm.name = supervisor.name
      // this.editSupervisorNaPForm.passwordBeforeMD5 = Supervisor.password
      this.editDialogVisible = true
    },
    // 点击编辑展示编辑督导对话框
    showeditSupervisorInfoDialog (supervisor) {
      if (supervisor === null) return this.$message.error('该督导不存在！')
      this.editSupervisorInfoForm.id = supervisor.id
      console.log('编辑督导id：', this.editSupervisorInfoForm.id)
      // this.editSupervisorInfoForm.name = Supervisor.name
      this.editSupervisorInfoForm = supervisor
      // 设置下拉框中默认的职称
      this.defaultJobTitle = supervisor.jobTitle
      // if (supervisor.birth !== null) {
      //   this.editSupervisorInfoForm.birth = supervisor.birth.substr(0,10)
      // }
      // if (supervisor.entranceDate !== null) {
      //   this.editSupervisorInfoForm.entranceDate = supervisor.entranceDate.substr(0,7)
      // }
      // if (supervisor.grantDate !== null) {
      //   this.editSupervisorInfoForm.grantDate = supervisor.grantDate.substr(0,10)
      // }
      // console.log('jobTitle:', this.editSupervisorInfoForm.jobTitle)
      // console.log('editInfo：', this.editSupervisorInfoForm)
      // this.editSupervisorNaPForm.passwordBeforeMD5 = Supervisor.password
      this.editSupervisorInfoDialogVisible = true
    },
    // 监听添加督导对话框的关闭事件
    addSupervisorDialogClosed () {
      this.$refs.addSupervisorFormRef.resetFields()
    },
    // 监听编辑督导姓名和重置密码对话框的关闭事件
    editSupervisorNaPDialogClosed () {
      this.$refs.editSupervisorNaPFormRef.resetFields()
    },
    // 监听编辑督导具体信息对话框的关闭事件
    editSupervisorInfoDialogClosed () {
      this.$refs.editSupervisorInfoFormRef.resetFields()
    },
    // 监听分配角色对话框的关闭事件
    editRoleDialogClosed () {
      this.DefaultSelectedPermsName = ''
    },
    // 点击按钮添加新督导
    // 埋点
    addSupervisor () {
      this.$refs.addSupervisorFormRef.validate(async valid => {
        if (!valid) return
        // 对输入的密码与身份证进行加密
        this.addSupervisorForm.password = this.$md5(this.addSupervisorForm.passwordBeforeMD5)
        this.addSupervisorForm.idNumber = this.$md5(this.addSupervisorForm.idNumberBeforeMD5)
        // console.log('输入的密码，身份证：', this.inputPassword, this.inputIdNumber)
        delete this.addSupervisorForm.passwordBeforeMD5
        delete this.addSupervisorForm.idNumberBeforeMD5
        // console.log('addForm', this.addSupervisorForm)
        await this.$http.post('/admin/addSupervisor', this.addSupervisorForm)
          .then(res => {
            if (res.data.code === 400) {
              return this.$message.error('添加督导失败！')
            }
            if (res.status === 200 && res.data.code !== 400) {
              // 隐藏添加督导的对话框
              this.addDialogVisible = false
              // 给用户行为详细内容赋值
              // 埋点
              this.$global_dataBurialForm.operate = '添加督导'
              // console.log('表单数据：', this.$global_dataBurialForm)
              // 上报事件（上传用户行为内容）
              this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
              return this.$message.success('添加督导成功！')
            }
          }).catch(err => {
            console.log('添加督导失败！' + err)
            // return this.$message.error('获取督导失败！！')
          })
        // 隐藏添加督导的对话框
        this.addDialogVisible = false
        // 重新获取督导列表数据
        this.getSupervisorList()
        this.getSupervisorTotal()
      })
    },
    // p为不够10添加0的函数(为日期设置的函数)
    p(s) {
          return s < 10 ? '0' + s : s
    },
    // 根据id删除对应的督导信息
    async removeSupervisorById (id) {
      // console.log('删除督导的id是：' + id)
      // 弹框询问督导是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该督导, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log('点击了删除对话框的 ' + confirmResult)
      // 如果督导点击确定，confirmResult返回值为字符串 confirm，点击取消返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！123')
      }
      // console.log('确认删除督导！')
      await this.$http.delete('/admin/deleteSupervisor?id=' + id)
        .then(res => {
          if (res.status !== 200) {
            return this.$message.error('删除督导失败！')
          } else {
            // 给用户行为详细内容赋值
            // 埋点
            this.$global_dataBurialForm.operate = '删除督导'
            // console.log('表单数据：', this.$global_dataBurialForm)
            // 上报事件（上传用户行为内容）
            this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
            console.log('删除督导成功！')
          }
          this.getSupervisorList()
          this.getSupervisorTotal()
        }).catch(err => {
          console.log('删除督导失败！' + err)
        })
    },
    // 更新督导姓名+密码
    async updateSupervisor () {
      this.editSupervisorNaPForm.password = this.$md5(this.editSupervisorNaPForm.passwordBeforeMD5)
      // console.log('编辑督导form：', this.editSupervisorNaPForm)
      delete this.editSupervisorNaPForm.passwordBeforeMD5
      await this.$http.put('/admin/updateUser', this.editSupervisorNaPForm)
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
    // 更改督导具体信息
    async updateSupervisorInfo () {
        // 入职日期的格式化
        const dEntrance = new Date(this.editSupervisorInfoForm.entranceDate)
        this.editSupervisorInfoForm.entranceDate = dEntrance.getFullYear() + '-' + this.p((dEntrance.getMonth() + 1)) + '-' + this.p(dEntrance.getDate())
        // 入学时间的格式化
        const dBirth = new Date(this.editSupervisorInfoForm.birth)
        this.editSupervisorInfoForm.birth = dBirth.getFullYear() + '-' + this.p((dBirth.getMonth() + 1)) + '-' + this.p(dBirth.getDate())
        // 被授予职称日期的格式化
        const dGrant = new Date(this.editSupervisorInfoForm.grantDate)
        this.editSupervisorInfoForm.grantDate = dGrant.getFullYear() + '-' + this.p((dGrant.getMonth() + 1)) + '-' + this.p(dGrant.getDate())
        // 职称的更新
        this.editSupervisorInfoForm.jobTitle = this.defaultJobTitle
        console.log('所有信息SupervisorInfo：', this.editSupervisorInfoForm)
        await this.$http.put('/admin/updateSupervisor', this.editSupervisorInfoForm)
        .then(res => {
          if (res.status === 200) {
            console.log('修改督导信息成功！')
            this.$global_dataBurialForm.operate = '编辑'
            // 上报事件（上传用户行为内容）
            // 埋点
            this.reportDataBurial('/userBehavior/add', this.$global_dataBurialForm)
            return this.$message.success('修改督导信息成功！')
          }
        }).catch(function (err) {
          console.log('修改督导信息！失败信息： errMsg—— ' + err)
        })
      this.editSupervisorInfoDialogVisible = false
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
