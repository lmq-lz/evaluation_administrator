<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/administrator' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <!-- <el-row>
                <el-col>
                    <el-button type='primary'>添加角色</el-button>
                </el-col>
            </el-row> -->
            <!-- 搜索与添加区域 -->
            <el-row :gutter="100">
              <el-col :span="7">
                  <el-input placeholder="请输入内容" clearable @clear="getRolesList">
                      <el-button slot="append" icon="el-icon-search" @click="getRolesList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
              </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <!-- border：表格边框线，stripe：隔
              行变色 -->
              <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 这里的key最好绑定id，但是后端返回数据的id都是0，所以暂时换为index -->
                    <el-row v-for="(item,index) in scope.row.permissions" :key="index">
                      <el-col :span="15">
                        <el-tag closable @close="deletePerms(item.id,scope.row.id)">权限名称{{index+1}}：{{item.name}}</el-tag>
                      </el-col>
                      <el-col :span="7">
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="deletePerms(item.id,scope.row.id)">删除权限</el-button>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="角色id" prop="id"></el-table-column>
                <el-table-column label="角色名称" prop="name"></el-table-column>
                <!-- <el-table-column label="权限名称" prop="permission"></el-table-column> -->
                <el-table-column label="操作" width="350px">
                  <template slot-scope="scope">
                    <el-button type="warning" icon="el-icon-setting" size='mini' @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    <!-- <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button> -->
                    <!-- <el-button type="danger" icon="el-icon-delete" size='mini'>删除权限</el-button> -->
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="deleteRole(scope.row.id)">删除角色</el-button>
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

        <!-- 分配权限的对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%">
          <!-- 树形控件 -->
          <!-- <el-tree :data="data" :props="treeProps" show-checkBox></el-tree> -->
          <template v-if="uncheckedPerms.length !== 0">
            <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllPermsChange">全选</el-checkbox> -->
            <div style="border: 1px; border-radius: 5px;">
              <el-checkbox-group v-model="savedCheckedPerms" @change="handleCheckedPermsChange" ref="checkBoxGroupRef">
                <el-checkbox v-for="item in uncheckedPerms" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
          <template v-if="uncheckedPerms.length === 0">
            <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllPermsChange">全选</el-checkbox> -->
            <div style="margin: 15px 15px; padding: 25px; padding-left: calc(50% - 100px); background-color: lavender; border: 1px; border-radius: 5px;">没有更多的权限可被分配</div>
          </template>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 添加角色的对话框 -->
        <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="40%" @close="addRoleDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="70px">
                <!-- prop是验证规则rules(即addRoleFormRules)的属性 -->
                <el-form-item label="角色名" prop="name">
                    <!-- v-model数据双向绑定，同步到addRoleForm -->
                  <el-input v-model="addRoleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <!-- footer是对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addRole">确定</el-button>
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
      // 所有角色列表数据
      rolesList: [
        // { id: 31, roleName: '管理员', perms: [{ id: 2, permission: '查看权限' }, { id: 3, permission: '删除权限' }, { id: 4, permission: '修改权限' }] },
        // { id: 35, roleName: '学生', perms: [{ id: 2, permission: '查看权限' }] }
      ],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有的权限列表数据(只保存权限id和权限名称)
      allRightsList: [
        // { id: 2, permission: '123查看权限', url: '/user/view' }, { id: 3, permission: '修改权限', url: '/user/update' }, { id: 4, permission: '添加权限', url: '/user/view' }
      ],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'perms',
        children: 'perms'
      },
      // 分配权限是是否全选所有权限
      checkAll: false,
      isIndeterminate: true,
      // 被选中的权限列表
      checkedPerms: [],
      // 未被选择(即可被分配)的权限
      uncheckedPerms: [],
      chosenRoleId: 0,
      // 备用户选中的权限列表
      savedCheckedPerms: [],
      // 控制添加用户对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色的表单数据
      addRoleForm: {
        name: '',
        permissions: []
      },
      // 添加表单的验证规则对象
      addRoleFormRules: {
        name: [
          {
            required: true, message: '请输入角色名', trigger: 'blur'
          },
          {
            min: 1, max: 20, message: '角色名称的长度在1~20个字符之间', trigger: 'blur'
          }
        ]
      },
      allotSomeRolePermsForm: {
        // 角色id
        // id: 0,
        // // 权限列表
        // permissions: {
        // }
      }
    }
  },
  created () {
    this.getRolesTotal()
    this.getRolesList()
    this.getRightsList()
  },
  methods: {
    // 获取所有权限数量
    async getRolesTotal () {
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
      // asios获取权限列表数据
      await this.$http.get('/admin/listPerms?pageSize=20&startPage=1')
        .then(res => {
          this.allRightsList = res.data
          console.log('权限列表获取成功！')
          // return this.$message.success('获取所有权限列表成功！')
        }).catch(err => {
          console.log('获取所有权限列表失败！' + err)
          // return this.$message.error('获取所有权限列表失败！')
        })
    },
    // 获取所有角色列表
    async getRolesList () {
      // axios获取角色列表数据
      await this.$http.get('/admin/listRole?pageSize=20&startPage=1')
        .then(res => {
          // 获取学生列表信息以及学生数量
          this.rolesList = res.data
          // console.log('角色列表数据：' + res.data)
          console.log('获取角色列表成功')
          // return this.$message.success('获取角色列表成功！')
        }).catch(err => {
          console.log('获取角色列表失败！' + err)
          // return this.$message.error('获取角色列表失败！')
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
    // 根据id删除对应的权限(角色id,权限id)
    async removeRightById (role, rightsId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      // console.log('成功删除权限')

      const { data: res } = await this.$http.delete('admin/deleteRole?roleId=' + role.id + 'rightsId=' + rightsId)
      if (res.status !== 200) {
        console.log('删除权限失败！')
        // return this.$message.error('删除权限失败！')
      }
      // 页面中的权限会全部重新渲染(当前权限详细信息下拉条会关闭)
      this.getRolesList()
      // 如果上述http请求返回数据携带role角色的权限信息，那么页面数据就不会全部渲染，可以提高用户体验
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      // 分配权限表单获取被编辑角色的id
      // this.allotSomeRolePermsForm.id = role.id
      this.chosenRoleId = role.id
      // 想法一：将所有权限展示出来，已有权限默认打钩
      // this.checkedPerms = []
      // this.savedCheckedPerms = []
      this.checkedPerms = role.permissions
      // 声明变量保存获取的角色列表
      var allPermsList = this.allRightsList
      var isChecked = false
      this.savedCheckedPerms = []
      allPermsList.forEach( (allPermsItem, index) => {
        isChecked = false
        this.checkedPerms.forEach( checkedPermsItem => {
          if (allPermsItem.name === checkedPermsItem.name) {
            // delete allPermsList[index]
            isChecked = true
            // console.log('已选权限：', checkedPermsItem.name)
          }
        })
        if (!isChecked) {
          this.uncheckedPerms.push(allPermsItem)
        }
        if ( this.uncheckedPerms === null) {
          
        }
      })
      // console.log('未选列表：', this.uncheckedPerms)
      // role.permissions.forEach(item => {
      //   this.checkedPerms.push(item.name)
      //   // console.log('被选择权限：' + item.name)
      // })
      // 想法二：只展示未被选择的权限
      // this.allPermsDelCheckedPerms()
      // 备份已选权限(目的：全选与全不选时候用)
      // this.savedCheckedPerms = this.checkedPerms
      // 声明变量保存获取的角色列表
      var allPermsList = this.allRightsList
      this.uncheckedPerms = []
      var isChecked = false
      allPermsList.forEach( (allPermsItem, index) => {
        isChecked = false
        // console.log('所有权限item，',allPermsItem.name)
        this.checkedPerms.forEach( checkedPermsItem => {
          if (allPermsItem.name === checkedPermsItem.name) {
            // delete allPermsList[index]
            isChecked = true
            // console.log('已选权限：', checkedPermsItem.name)
          }
        })
        if (!isChecked) {
          // console.log('push:', allPermsItem.name)
          this.uncheckedPerms.push(allPermsItem)
        }
      })
      this.setRightDialogVisible = true
      // this.$refs.checkBoxGroupRef.forEach(item => {
      //   item.disabled = 'disabled'
      // })
    },
    // 权限选中状态被改变调用的事件 --  checkbox选中 当绑定值变化时触发的事件
    handleCheckedPermsChange (value) {
      const checkedCount = value.length
      this.checkAllPerms = checkedCount === this.allRightsList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRightsList.length
    },
    // 监听添加角色对话框的关闭事件
    addRoleDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色事件
    addRole () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        // const { data: res } = await this.$http.post('/admin/addRole', this.addRoleForm)
        // if (res.status !== 201) {
        //   const errMsg = this.$message.error('添加角色失败')
        //   // return errMsg
        // } else if ( res.status === 200) {
        //   console.log('添加角色成功')
        //   this.$message.success('添加角色成功')
        // }
        await this.$http.post('/admin/addRole', this.addRoleForm)
          .then(res => {
            if (res.data.code === 400) {
              return this.$message.error('添加角色失败')
            }
            if (res.status === 200 && res.data.code !== 400) {
              return this.$message.success('添加角色成功！')
            }
          }).catch(err => {
            console.log('添加学生失败！' + err)
            // return this.$message.error('获取所有角色列表失败！')
          })
        // 隐藏添加用户的对话框
        this.addRoleDialogVisible = false
        // 重新获取用户列表数据
        this.getRolesList()
      })
    },
    // 分配权限时全选所有权限  --当绑定值变化时触发的事件
    handleCheckAllPermsChange (value) {
      // let checkedCount = values.length
      // this.checkAllPerms = checkedCount === this.
      // 选中全选时，循环遍历源数据，把数据的每一项加入到默认的数组checkedPerms
      // this.allRightsList.forEach(item => {
      //   this.checkedPerms.push(item.name)
      // })
      // this.checkedPerms = value ? this.allRightsList : this.checkedPerms
      // if (value) {
      //   this.allRightsList.forEach(item => this.checkedPerms.push(item.name))
      // } else {
      //   this.checkedPerms = this.savedCheckedPerms
      // }
      // this.isIndeterminate = !this.isIndeterminate
      // delete this.allRightsList
    },
    // 分配权限事件
    allotRights () {
      // const keys = []
      // console.log('被选中的权限：', this.savedCheckedPerms)
      // 向分配权限表单中添加权限列表
      this.allotSomeRolePermsForm = []
      this.allRightsList.forEach( allRightItem => {
        // console.log('所有权限：', allRightItem)
        this.savedCheckedPerms.forEach( checkedPermsItem => {
            // console.log('备选权限：', checkedPermsItem)
          if (allRightItem.name === checkedPermsItem) {
            // console.log('push:', this.allotSomeRolePermsForm)
            this.allotSomeRolePermsForm.push(allRightItem)
          }
        })
      })
      // console.log('分配权限：', this.allotSomeRolePermsForm)
      // axios请求分配某角色某权限
      this.allotSomeRolePermsForm.forEach( item => {
        console.log('请求参数：', item)
        this.$http.post('/admin/addRolePermission?permsId=' + item.id + '&roleId=' + this.chosenRoleId)
        .then(res => {
          console.log('权限添加成功！')
        }).catch(err => {
          console.log('权限添加失败！' + err)
          // return this.$message.error('权限添加失败！')
        })
      })
      this.getRolesList()
      // 分配权限对话框关闭
      this.setRightDialogVisible = false
    },
    // 删除角色
    deleteRole (rid) {
      this.$http.delete('/admin/deleteRole?id=' + rid)
        .then(res => {
          // 删除角色成功
          console.log('角色删除成功！')
          return this.$message.success('删除角色成功！')
        }).catch(err => {
          console.log('角色删除失败！' + err)
          // return this.$message.error('角色删除失败！')
        })
      this.getRolesList()
    },
    // 根据id删除某角色某权限(权限id，角色id)
    async deletePerms (pid, roleId) {
      await this.$http.delete('/admin/deleteRolePermission?permsId=' + pid + '&roleId=' + roleId)
        .then(res => {
          console.log('权限删除成功！')
        }).catch(err => {
          console.log('权限删除失败！' + err)
          // return this.$message.error('获取角色列表失败！')
        })
      this.getRolesList()
    },
    // 把所有权限里面删除已有权限供用户选择
    allPermsDelCheckedPerms () {
      this.uncheckedPerms = []
      this.allRightsList.forEach(item1 => {
        // 如果某权限还未被分配
        let isPermsInArray = false
        console.log('item1 ' + item1.name)
        this.checkedPerms.forEach(item2 => {
          console.log('item2 ' + item2)
          if (item1.name === item2) {
            isPermsInArray = true
          }
        })
        if (!isPermsInArray) {
          this.uncheckedPerms.push(item1)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #eee;
  line-height: 32px;
  text-align: center;
  margin-left: 20%;
  margin-right: 20%;
  margin-bottom: 12px;
}

.v-center {
  display: flex;
  align-items: center;
}
</style>
