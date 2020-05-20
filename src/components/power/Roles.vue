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
        </el-card>

        <!-- 分配权限的对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%">
          <!-- 树形控件 -->
          <!-- <el-tree :data="data" :props="treeProps" show-checkBox></el-tree> -->
          <template>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllPerms" @change="handleCheckAllPermsChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedPerms" @change="handleCheckedPermsChange" ref="checkBoxGroupRef">
              <el-checkbox v-for="item in uncheckedPerms" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
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
                <el-form-item label="角色名" prop="rolename">
                    <!-- v-model数据双向绑定，同步到addRoleForm -->
                  <el-input v-model="addRoleForm.rolename"></el-input>
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
      checkAllPerms: false,
      isIndeterminate: true,
      // 被选中的权限列表
      checkedPerms: [],
      // 未被选择(即可被分配)的权限
      uncheckedPerms: [],
      // 备份备选中的权限列表
      savedCheckedPerms: [],
      // 控制添加用户对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色的表单数据
      addRoleForm: {
        rolename: ''
      },
      // 添加表单的验证规则对象
      addRoleFormRules: {
        rolename: [
          {
            required: true, message: '请输入角色名', trigger: 'blur'
          },
          {
            min: 1, max: 20, message: '角色名称的长度在1~20个字符之间', trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList () {
      // asios获取权限列表数据
      await this.$http.get('/admin/listPerms?pageSize=20&startPage=1')
        .then(res => {
          // this.allRightsList = res.data
          res.data.forEach(item => {
            this.allRightsList.push({ id: item.id, name: item.name })
          })
          // console.log('分配权限时获取的所有权限' + this.allRightsList)
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
      // 获取所有权限的数据
      // const { data: res } = await this.$http.get('getAllRights')
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取所有权限列表失败！')
      // }
      // 把获取到的所有权限保存到 data 中
      // this.rightsList = res.data

      // 想法一：将所有权限展示出来，已有权限默认打钩
      // this.checkedPerms = []
      // this.savedCheckedPerms = []
      this.checkedPerms = []
      role.permissions.forEach(item => {
        this.checkedPerms.push(item.name)
        // console.log('被选择权限：' + item.name)
      })
      // 想法二：只展示未被选择的权限
      this.allPermsDelCheckedPerms()
      // 备份已选权限(目的：全选与全不选时候用)
      this.savedCheckedPerms = this.checkedPerms
      this.setRightDialogVisible = true
      // this.$refs.checkBoxGroupRef.forEach(item => {
      //   item.disabled = 'disabled'
      // })
      return this.checkedPerms
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
        const { data: res } = await this.$http.post('role', this.addRoleForm)
        if (res.meta.status !== 201) {
          const errMsg = this.$message.error('添加角色失败')
          return errMsg
        }
        this.$message.success('添加角色成功')
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
      if (value) {
        this.allRightsList.forEach(item => this.checkedPerms.push(item.name))
      } else {
        this.checkedPerms = this.savedCheckedPerms
      }
      this.isIndeterminate = !this.isIndeterminate
    },
    // 分配权限事件
    allotRights () {
      // const keys = []
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
    // 根据id删除权限
    async deletePerms (pid, roleId) {
      await this.$http.get('/admin/deletePerms?id=' + pid + '&roleId=' + roleId)
        .then(res => {
          console.log('权限删除成功！')
        }).catch(err => {
          console.log('权限删除失败！' + err)
          // return this.$message.error('获取角色列表失败！')
        })
      // this.getRolesList()
    },
    // 分配权限时判断是否所有权限里面含有已分配权限
    // inPermsArray (checkedPerms, perm) {
    //   checkedPerms.forEach(item => {
    //     if (item === perm) return true
    //   })
    //   return false
    // },
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
