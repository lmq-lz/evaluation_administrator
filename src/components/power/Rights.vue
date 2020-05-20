<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="100">
              <el-col :span="7">
                <el-input placeholder="请输入内容" clearable @clear="getRightsList">
                    <el-button slot="append" icon="el-icon-search" @click="getRightsList"></el-button>
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="addRightsDialogVisible = true">添加新权限</el-button>
              </el-col>
            </el-row>
            <!-- border：表格边框线，stripe：隔
              行变色 -->
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="name"></el-table-column>
                <el-table-column label="权限路径" prop="url"></el-table-column>
                <el-table-column label="权限映射" prop="perms"></el-table-column>
                <el-table-column label="操作" width="180px">
                  <!-- 模板中定义的slot-scope属性接受作用域插槽的数据，通过scope.row获取这一行的数据 -->
                  <template slot-scope="scope">
                      <!-- 修改按钮 -->
                      <!-- el-tooltip：进行消息的提示-->
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRightDialog(scope.row)"></el-button>
                      </el-tooltip>
                      <!-- 删除按钮 -->
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePerms(scope.row.id)"></el-button>
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

        <!-- 添加权限的对话框 -->
        <el-dialog
        title="添加新权限"
        :visible.sync="addRightsDialogVisible"
        width="40%" @close="addRightDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addRightForm" :rules="addRightFormRules" ref="addRightFormRef" label-width="80px">
                <!-- prop是验证规则rules(即addRightFormRules)的属性 -->
                <el-form-item label="权限名" prop="name">
                    <!-- v-model数据双向绑定，同步到addUserForm -->
                  <el-input v-model="addRightForm.name"></el-input>
                </el-form-item>
                <el-form-item label="访问路径" prop="url">
                  <!-- v-model数据双向绑定，同步到addUserForm -->
                  <el-input v-model="addRightForm.url"></el-input>
                </el-form-item>
                <el-form-item label="权限映射" prop="perms">
                  <!-- v-model数据双向绑定，同步到addUserForm -->
                  <el-input v-model="addRightForm.perms"></el-input>
                </el-form-item>
            </el-form>
            <!-- footer是对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRightsDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addRight">添加</el-button>
            </span>
        </el-dialog>

        <!-- 编辑权限的对话框 -->
        <el-dialog
        title="编辑权限"
        :visible.sync="editRightsDialogVisible"
        width="40%" @close="editRightDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="editRightForm" :rules="editRightFormRules" ref="editRightFormRef" label-width="80px">
                <!-- prop是验证规则rules(即editRightFormRules)的属性 -->
                <el-form-item label="权限名" prop="name">
                    <!-- v-model数据双向绑定，同步到editUserForm -->
                  <el-input v-model="editRightForm.name"></el-input>
                </el-form-item>
                <el-form-item label="访问路径" prop="url">
                  <!-- v-model数据双向绑定，同步到editUserForm -->
                  <el-input v-model="editRightForm.url"></el-input>
                </el-form-item>
                <el-form-item label="访问映射" prop="perms">
                  <!-- v-model数据双向绑定，同步到editUserForm -->
                  <el-input v-model="editRightForm.perms"></el-input>
                </el-form-item>
            </el-form>
            <!-- footer是对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRightsDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateRight">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取权限列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        currentPage: 1,
        // 当前每页显示多少条数据
        pageSize: 5
      },
      // 获取权限数据总条数
      total: 0,
      // 所有的权限列表
      rightsList: [
        // { permissionName: '123查看权限', url: '/user/view' },
        // { permissionName: '修改权限', url: '/user/update' },
        // { permissionName: '添加权限', url: '/user/view' }
      ],
      // 控制添加新权限对话框的显示与隐藏
      addRightsDialogVisible: false,
      // 控制编辑权限对话框的显示与隐藏
      editRightsDialogVisible: false,
      // 添加新权限的表单数据
      addRightForm: {
        name: '',
        url: '',
        perms: ''
      },
      // 添加表单的验证规则对象
      addRightFormRules: {
        name: [
          {
            required: true, message: '请输入权限名', trigger: 'blur'
          },
          {
            min: 1, max: 20, message: '权限名的长度在1~20个字符之间', trigger: 'blur'
          }
        ],
        url: [
          {
            required: true, message: '请输入访问路径', trigger: 'blur'
          }
        ]
      },
      // 添加新权限的表单数据
      // 这里有一个问题，添加新权限应该是post两个数据，一个是权限名，一个是权限url(即拥有此权限可以访问哪个页面)
      editRightForm: {
        name: '',
        url: '',
        perms: ''
      },
      // 添加表单的验证规则对象
      editRightFormRules: {
        name: [
          {
            required: true, message: '请输入权限名', trigger: 'blur'
          },
          {
            min: 1, max: 20, message: '权限名的长度在1~20个字符之间', trigger: 'blur'
          }
        ],
        url: [
          {
            required: true, message: '请输入访问路径', trigger: 'blur'
          },
          {
            min: 1, message: '请输入路问访径', trigger: 'blur'
          }
        ]
      },
      // 被选择了的权限
      checkedPerms: []
    }
  },
  created () {
    // 获取所有权限数量
    this.getRightsTotal()
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取所有权限数量
    async getRightsTotal () {
      // 为了获取total进行axios请求(假设权限数不超过20)
      await this.$http.get('/admin/listPerms?pageSize=20&startPage=1')
        .then(res => {
          // 获取所有学生数量
          // alert(res.data.length)
          this.total = res.data.length
          // console.log(res.data)
        }).catch(err => {
          console.log('获取权限列表失败！' + err)
          // return this.$message.error('获取学生列表失败！')
        })
    },
    // 获取权限列表
    async getRightsList () {
      // axios请求获取权限列表
      await this.$http.get('/admin/listPerms?pageSize=' + this.queryInfo.pageSize + '&startPage=' + this.queryInfo.currentPage)
        .then(res => {
          this.rightsList = res.data
          // console.log(res.data)
        }).catch(err => {
          console.log('获取权限列表失败！' + err)
          // return this.$message.error('获取权限列表失败！')
        })
    },
    // 监听 pageSize(页面显示最多条数，在页面中可进行1,2,5,10条/页的选择) 改变的事件
    handleSizeChange (newSize) {
      // console.log('页面显示最多条数：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getRightsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.currentPage = newPage
      this.getRightsList()
    },
    // 监听添加新权限对话框的关闭事件
    addRightDialogClosed () {
      this.$refs.addRightFormRef.resetFields()
    },
    // 监听编辑新权限对话框的关闭事件
    editRightDialogClosed () {
      this.$refs.editRightFormRef.resetFields()
    },
    // 点击编辑时打开编辑对话框事件
    showEditRightDialog (right) {
      // 将权限数据展示到编辑对话框中
      this.editRightForm.name = right.name
      this.editRightForm.url = right.url
      this.editRightForm.perms = right.perms
      // 显示编辑对话框
      this.editRightsDialogVisible = true
    },
    // 添加新权限
    async addRight () {
      this.$refs.addRightFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加新权限的网络请求
        // const { data: res } = await this.$http.post('admin/addPerms/permission=' + this.addRightForm.rightname, this.addRightForm)
        // if (res.meta.status !== 201) {
        //   const errMsg = this.$message.error('添加新权限，请重试！')
        //   return errMsg
        // }
        await this.$http.post('/admin/addPerms', this.addRightForm)
          .then(response => {
            // console.log('添加权限请求res:' + response)
            this.$message.success('添加新权限成功！！')
            // 重新获取权限列表数据
          })
          .catch(err => {
            console.log('添加权限请求失败 errorMsg：' + err)
            // this.$message.error('添加新权限失败，请重试！')
          })
        // 动态获取权限列表
        this.getRightsList()
        // 隐藏添加新权限的对话框
        this.addRightsDialogVisible = false
      })
    },
    // 修改权限
    async updateRight () {
      await this.$http.put('/admin/updatePerms', this.editRightForm)
        .then(res => {
          // 重新获取权限列表数据
          this.getRightsList()
        })
        .catch(err => {
          console.log('编辑权限请求失败 errorMsg：' + err)
          // this.$message.error('编辑权限失败，请重试！')
        })
      this.editRightsDialogVisible = false
    },
    // 通过pid删除某一权限
    async deletePerms (pid) {
      await this.$http.delete('/admin/deletePerms?id=' + pid)
        .then(res => {
          // console.log('权限删除成功！')
          this.getRightsList()
        }).catch(err => {
          console.log('权限删除失败！' + err)
          // return this.$message.error('获取角色列表失败！')
        })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
