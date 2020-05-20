<template>
  <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/administrator' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>授课管理</el-breadcrumb-item>
          <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
          <!-- 添加班级按钮区域 -->
          <!-- <el-row>
              <el-col>
                  <el-button type='primary'>添加班级</el-button>
              </el-col>
          </el-row> -->
          <!-- 搜索与添加区域 -->
          <el-row :gutter="100">
            <el-col :span="7">
                <el-input placeholder="请输入内容" clearable @clear="getClassList">
                    <el-button slot="append" icon="el-icon-search" @click="getClassList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addClassDialogVisible = true">添加班级</el-button>
            </el-col>
          </el-row>

          <!-- 班级列表区域 -->
          <!-- border：表格边框线，stripe：隔
            行变色 -->
            <el-table :data="classList" border stripe>
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
              <el-table-column label="班级id" prop="id"></el-table-column>
              <el-table-column label="班级名称" prop="name"></el-table-column>
              <el-table-column label="班级代码" prop="number"></el-table-column>
              <el-table-column label="所属学院" prop="departmentName"></el-table-column>
              <el-table-column label="年级" prop="grade"></el-table-column>
              <!-- <el-table-column label="权限名称" prop="permission"></el-table-column> -->
              <el-table-column label="操作" width="350px">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditClassDialog(scope.row)">编辑班级</el-button>
                  <el-button type="primary" icon="el-icon-edit" size='mini'>查看选课</el-button>
                  <!-- <el-button type="danger" icon="el-icon-delete" size='mini'>查看选课学生</el-button> -->
                  <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteClass(scope.row.id)">删除班级</el-button>
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

      <!-- 添加班级的对话框 -->
      <el-dialog
      title="添加班级"
      :visible.sync="addClassDialogVisible"
      width="40%" @close="addClassDialogClosed">
      <!-- class_id, number, name, class_type, class_class, class_dep, score, time -->
          <!-- 内容主体区域 -->
          <el-form :model="addClassForm" :rules="addClassFormRules" ref="addClassFormRef" label-width="70px">
              <!-- prop是验证规则rules(即addClassFormRules)的属性 -->
              <!-- v-model数据双向绑定，同步到addClassForm -->
              <el-form-item label="班级id" prop="id">
                <el-input v-model="addClassForm.id"></el-input>
              </el-form-item>
              <el-form-item label="班级代码" prop="number">
                  <el-input v-model="addClassForm.number"></el-input>
              </el-form-item>
              <el-form-item label="班级名称" prop="name">
                  <el-input v-model="addClassForm.name"></el-input>
              </el-form-item>
              <el-form-item label="年级" prop="grade">
                <el-input v-model="addClassForm.grade"></el-input>
              </el-form-item>
              <!-- <el-form-item label="id" prop="id">
                <el-input v-model="addClassForm.id"></el-input>
              </el-form-item>
              <el-form-item label="班级名称" prop="id">
                <el-input v-model="addClassForm.name"></el-input>
              </el-form-item>
              <el-form-item label="班级代码" prop="id">
                <el-input v-model="addClassForm.number"></el-input>
              </el-form-item>
              <el-form-item label="年级" prop="id">
                <el-input v-model="addClassForm.grade"></el-input>
              </el-form-item> -->
              <el-form-item label="系名称">
                <template>
                  <el-select v-model="addClassForm.departmentId">
                    <el-option
                      v-for="item in departmentList"
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
              <el-button @click="addClassDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="addClass">确定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑班级的对话框 -->
      <el-dialog
      title="编辑班级"
      :visible.sync="editClassDialogVisible"
      width="40%" @close="editClassDialogClosed">
      <!-- class_id, number, name, class_type, class_class, class_dep, score, time -->
          <!-- 内容主体区域 -->
          <el-form :model="editClassForm" :rules="editClassFormRules" ref="editClassFormRef" label-width="70px">
              <!-- prop是验证规则rules(即editClassFormRules)的属性 -->
              <el-form-item label="班级id" prop="id">
                  <!-- v-model数据双向绑定，同步到editClassForm -->
                <el-input v-model.number="editClassForm.id"></el-input>
              </el-form-item>
              <el-form-item label="班级代码" prop="number">
                  <el-input v-model="editClassForm.number"></el-input>
              </el-form-item>
              <el-form-item label="班级名称" prop="name">
                  <el-input v-model="editClassForm.name"></el-input>
              </el-form-item>
              <el-form-item label="年级" prop="grade">
                <el-input v-model="editClassForm.grade"></el-input>
              </el-form-item>
              <el-form-item label="系名称">
                <template>
                  <el-select v-model="chosenDepId">
                    <el-option
                      v-for="item in departmentList"
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
              <el-button @click="editClassDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="updateClass">完成</el-button>
          </span>
      </el-dialog>
      <!-- 分配班级班级的对话选择框 -->
      <!-- <el-dialog
      title="编辑班级"
      :visible.sync="editClassDialogVisible"
      width="40%" @close="editRoleDialogClosed">
          <el-select v-model="selectedClassRoleId" placeholder="请选择班级">
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
              <el-button type="primary" @click="updateClassRole">确定</el-button>
          </span>
      </el-dialog> -->
    </div>
</template>

<script>
export default {
  data () {
    // 检查年级是否是数字组成
    var checkGrade = (rule, value, callback) => {
      const patter = /^[0-9]+$/
      if (!patter.test(value)) {
        return callback(new Error('年级只能由数字组成！'))
      } else {
        callback()
      }
    }
    // 检查字符串输入长度是否在1~128之间
    var checkStringLenMax128 = (rule, value, callback) => {
      if (value.length > 0 && value.length <= 128) {
        callback()
      } else {
        callback(new Error('请输入长度在1~128之间字符之间'))
      }
    }
    // 检查班级代码是否只由数字与字母组成
    var checkCosNumberIsNumOrDigit = (rule, value, callback) => {
      const patter = /^[0-9a-zA-Z]+$/
      if (!patter.test(value)) {
        return callback(new Error('班级代码只能数字和字母组成！'))
      } else {
        callback()
      }
    }
    // 检查班级代码是否重复
    var checkClassIdIsRepeated = (rule, value, callback) => {
      if (this.classList !== null) {
        this.classList.forEach(item => {
          // 如果班级代码已存在，设置布尔值
          if (item.id === value) {
            return callback(new Error('班级代码已存在，请重新输入班级代码'))
          }
        })
        callback()
      }
    }
    return {
      // 获取班级列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currentPage: 1,
        // 当前每页显示多少条数据
        pageSize: 2
      },
      // 获取班级数据总条数
      total: 0,
      // 所有班级的列表
      classList: [],
      // 所有的系列表
      departmentList: [],
      // 控制添加班级对话框的显示与隐藏
      addClassDialogVisible: false,
      // 控制编辑班级对话框的显示与隐藏
      editClassDialogVisible: false,
      // 控制分配班级对话框的显示与隐藏
      // editRoleDialogVisible: false,
      // 添加班级的表单数据
      addClassForm: {
        id: 0,
        number: '',
        name: '',
        departmentId: '',
        grade: ''
      },
      // 编辑班级的表单数据
      editClassForm: {
        departmentId: 0,
        grade: '',
        id: 0,
        name: '',
        number: ''
      },
      // 更新班级数据时下拉框中被选择的系id
      chosenDepId: 0,
      // 添加班级表单的验证规则
      addClassFormRules: {
        id: [
          {
            required: true, message: '请输入班级id', trigger: 'blur'
          },
          {
            validator: checkClassIdIsRepeated, trigger: 'blur'
          }
        ],
        number: [
          {
            required: true, message: '请输入班级代码(例如：171104)', trigger: 'blur'
          },
          {
            validator: checkStringLenMax128, trigger: 'blur'
          },
          {
            validator: checkCosNumberIsNumOrDigit, trigger: 'blur'
          }
        ],
        name: [
          {
            required: true, message: '请输入班级名称(例如：汉语言学)', trigger: 'blur'
          },
          {
            validator: checkStringLenMax128, trigger: 'blur'
          }
        ],
        grade: [
          {
            required: true, message: '请输入年级(例如：2017)', trigger: 'blur'
          },
          {
            validator: checkGrade, trigger: 'blur'
          }
        ]
      },
      // 编辑班级的验证规则对象
      editClassFormRules: {
        id: [
          {
            required: true, message: '请输入班级id', trigger: 'blur'
          },
          {
            validator: checkClassIdIsRepeated, trigger: 'blur'
          }
        ],
        number: [
          {
            required: true, message: '请输入班级代码(例如：171104)', trigger: 'blur'
          },
          {
            validator: checkStringLenMax128, trigger: 'blur'
          },
          {
            validator: checkCosNumberIsNumOrDigit, trigger: 'blur'
          }
        ],
        name: [
          {
            required: true, message: '请输入班级名称(例如：汉语言学)', trigger: 'blur'
          },
          {
            validator: checkStringLenMax128, trigger: 'blur'
          }
        ],
        grade: [
          {
            required: true, message: '请输入年级(例如：2017)', trigger: 'blur'
          },
          {
            validator: checkGrade, trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // alert('用户名：' + sessionStorage.getItem('username'))
    this.getClassTotal()
    this.getDepartmentList()
    this.getClassList()
  },
  methods: {
    // 获取所有班级数量
    async getClassTotal () {
      // 为了获取total进行axios请求(假设班级人数不超过1000)
      await this.$http.get('/classe/listClass?pageSize=1000&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          // 获取所有班级数量
          this.total = res.data.length
        }).catch(err => {
          console.log('获取班级列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
    },
    // 获取所有班级列表(请求参数包括分页数据)
    async getClassList () {
      await this.$http.get('/classe/listClass?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          this.classList = res.data
          this.classList.forEach(classItem => {
            this.departmentList.forEach(depItem => {
              if (classItem.departmentId === depItem.id) {
                classItem.departmentName = depItem.name
              }
            })
          })
          // console.log('class info：', this.classList)
        }).catch(err => {
          console.log('获取班级列表失败！' + err)
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
      this.getClassList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.currentPage = newPage
      this.getClassList()
    },
    // 通过班级id删除班级
    async deleteClass (id) {
      // 弹框询问是否删除班级数据
      const confirmResult = await this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
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
      await this.$http.delete('/classe/deleteClass/{id}?id=' + id)
        .then(res => {
          if (res.status !== 200) {
            return this.$message.error('删除班级失败！')
            // 刷新页面
            this.getClassList()
          } else {
            console.log(res.message + '删除班级成功！')
          }
        })
    },
    // 监听添加班级对话框的关闭事件
    addClassDialogClosed () {
      this.$refs.addClassFormRef.resetFields()
    },
    // 监听编辑班级对话框的关闭事件
    editClassDialogClosed () {
      this.$refs.editClassFormRef.resetFields()
    },
    // 点击编辑时打开班级编辑对话框
    showEditClassDialog (aClass) {
      this.editClassForm = aClass
      // this.editClassForm.id = aClass.id
      // this.editClassForm.departmentId = aClass.departmentId
      // this.editClassForm.grade = aClass.grade
      // this.editClassForm.name = aClass.name
      // this.editClassForm.number = aClass.number
      // console.log('操作班级为：' + this.editClassForm.departmentName)
      this.chosenDepId = aClass.departmentId
      this.getDepartmentList()
      this.editClassDialogVisible = true
      // this
    },
    // 点击按钮添加班级
    addClass () {
      this.$refs.addClassFormRef.validate(async valid => {
        if (!valid) return
        console.log('添加班级的信息：', this.addClassForm)
        await this.$http.post('/classe/addClass', this.addClassForm)
          .then(res => {
            // code为400表示参数出错，违反数据完整性
            if (res.data.code === '400') {
              console.log(res.data.msg + ',' + res.data.info)
            } else {
              // 请求返回状态码是200，表示成功
              if (res.status === '200') {
                return this.$message.success('添加班级成功！')
              }
            }
          }).catch(err => {
            console.log('添加班级失败！' + err)
          })
      })
      // 隐藏添加班级对话框
      this.addClassDialogVisible = false
      // 重新获取班级列表
      this.getClassList()
    },
    // 修改班级
    async updateClass () {
      // alert('被选择的系id：' + this.chosenDepId)
      this.editClassForm.departmentId = this.chosenDepId
      // this.$refs.editClassFormRef._method = 'put'
      var httpIsSuccess = false
      await this.$http.put('/classe/updateClass', this.editClassForm)
        .then(function (response) {
          if (response.status === 200) {
            httpIsSuccess = true
          }
          // alert(response.status)
        }).catch(function (err) {
          console.log('编辑班级请求失败 errMsg：' + err)
        })
      if (httpIsSuccess) {
        this.getClassList()
      }
      // 关闭编辑班级对话框
      this.editClassDialogVisible = false
    },
    // 选中值发生变化时触发
    change () {
      alert('选中值变化时触发')
    }
  }
}
</script>

<style lang="less" scoped></style>
