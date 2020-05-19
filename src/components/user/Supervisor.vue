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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getSuperVisorList">
                        <el-button slot="append" icon="el-icon-search" @click="getSuperVisorList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加督导</el-button>
                </el-col>
            </el-row>

            <!-- 督导列表区域 -->
            <el-table :data="SuperVisorList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="id" prop="id"></el-table-column>
                <el-table-column label="姓名" prop="SuperVisorname"></el-table-column>
                <el-table-column label="院系" prop="dep"></el-table-column>
                <el-table-column label="性别" prop="gender"></el-table-column>
                <el-table-column label="民族" prop="region"></el-table-column>
                <el-table-column label="教授课程数" prop="total_class"></el-table-column>
                <el-table-column label="职称" prop="job_title"></el-table-column>
                <el-table-column label="学位" prop="degree"></el-table-column>
                <el-table-column label="毕业学校" prop="graduate_school"></el-table-column>
                <el-table-column label="操作" width="200px">
                    <!-- 模板中定义的slot-scope属性接受作用域插槽的数据，通过scope.row获取这一行的数据 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <!-- el-tooltip：进行消息的提示-->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeSuperVisorById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <!-- pageSize就是页面显示做多条数，可按照page-sizes进行选择1,2,5,10条/页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
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
        width="40%" @close="addSuperVisorDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addSuperVisorForm" :rules="addSuperVisorFormRules" ref="addSuperVisorFormRef" label-width="70px">
                <!-- prop是验证规则rules(即addSuperVisorFormRules)的属性 -->
                <el-form-item label="督导名" prop="SuperVisorname">
                    <!-- v-model数据双向绑定，同步到addSuperVisorForm -->
                  <el-input v-model="addSuperVisorForm.SuperVisorname"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addSuperVisorForm.password"></el-input>
                </el-form-item>
                <el-form-item label="学院" prop="department">
                    <el-input v-model="addSuperVisorForm.department"></el-input>
                </el-form-item>
            </el-form>
            <!-- footer是对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addSuperVisor">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取督导列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pageSize: 2
      },
      SuperVisorList: [
        { id: '1023157', SuperVisorname: '何伟', dep: '计算机科学学院', gender: '男', region: '汉族', total_class: 3, job_title: '教授', degree: '博士后', graduate_school: '四川大学' },
        { id: '1032432', SuperVisorname: '李琴', dep: '数学学院', gender: '女', region: '汉族', total_class: 4, job_title: '副教授', degree: '博士后', graduate_school: '北京大学' }
      ],
      // 获取督导数据总条数
      total: 2,
      // 控制添加督导对话框的显示与隐藏
      addDialogVisible: false,
      // 添加督导的表单数据
      addSuperVisorForm: {
        SuperVisorname: '',
        password: '',
        department: ''
      },
      // 添加表单的验证规则对象
      addSuperVisorFormRules: {
        SuperVisorname: [
          {
            required: true, message: '请输入督导名', trigger: 'blur'
          },
          {
            min: 1, max: 20, message: '督导名的长度在1~20个字符之间', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true, message: '请输入学院名称', trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getSuperVisorList()
  },
  methods: {
    async getSuperVisorList () {
      //  axios请求(请求路径，请求参数)
      const { data: res } = await this.$http.get('/admin/listSupervisor', { param: this.queryInfo })
      if (res.meta.status !== 200) {
        // const msg = this.$message.error('获取督导列表失败')
        // return msg
      }
      // this.SuperVisorList = res.data.SuperVisorList
      // this.total = res.data.total
      // console.log(res)
    },
    // 监听 pageSize(页面显示最多条数，在页面中可进行1,2,5,10条/页的选择) 改变的事件
    handleSizeChange (newSize) {
      // console.log('页面显示最多条数：' + newSize)
      this.queryInfo.pageSize = newSize
      this.getSuperVisorList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log('最新页码值： ' + newPage)
      this.queryInfo.pagenum = newPage
      this.getSuperVisorList()
    },
    // 监听添加督导对话框的关闭事件
    addSuperVisorDialogClosed () {
      this.$refs.addSuperVisorFormRef.resetFields()
    },
    // 点击按钮添加新督导
    addSuperVisor () {
      this.$refs.addSuperVisorFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加督导的网络请求
        const { data: res } = await this.$http.post('addSuperVisor', this.addSuperVisorForm)
        if (res.status !== 201) {
          const errMsg = this.$message.error('添加督导失败')
          return errMsg
        }
        this.$message.success('添加督导成功')
        // 隐藏添加督导的对话框
        this.addDialogVisible = false
        // 重新获取督导列表数据
        this.getSuperVisorList()
      })
    },
    // 根据id删除对应的督导信息
    async removeSuperVisorById (id) {
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
      const { data: res } = await this.$http.delete('SuperVisors/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除督导失败！')
      }
      this.$message.success('删除督导成功！')
      this.getSuperVisorList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
