<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>修改密码</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<span class="title"> 修改密码 </span>
			<el-form ref="updataPwdFormRef" :model="updataPwdForm" :rules="updataPwdFormRules" label-position="right" label-width="80px">
				<el-form-item label="原密码:" prop="oldpwd">
					<el-input placeholder="请输入原密码" v-model="updataPwdForm.oldpwd" show-password></el-input>
				</el-form-item>

				<el-form-item label="新密码:" prop="newpwd">
					<el-input placeholder="请输入新密码" v-model="updataPwdForm.newpwd" show-password></el-input>
				</el-form-item>

				<el-form-item label="确认密码:" prop="comfirmpwd">
					<el-input placeholder="确认密码" v-model="updataPwdForm.comfirmpwd" show-password></el-input>
				</el-form-item>
			</el-form>
			<el-button class="saveButton" @click="saveButton()"> 保存 </el-button>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			var validatePass2 = (rule, value, callback) => {
			        if (value === '') {
			          callback(new Error('请再次输入新密码'));
			        } else if (value !== this.updataPwdForm.newpwd) {
			          callback(new Error('两次输入密码不一致!'));
			        } else {
			          callback();
			        }
			      };
			return {
				updataPwdForm: {
					username: '',
					idnumber: '',
					oldpwd: '',
					newpwd: '',
					comfirmpwd: ''
				},
				//验证输入表单
				updataPwdFormRules: {
				  oldpwd: [
				  	 { required: true, message: '请输入旧密码', trigger: 'blur' },
				  	{ min: 3, message: '密码最少6位', trigger: 'blur' }
				  ],
				  newpwd: [
					  { required: true, message: '请输入新密码', trigger: 'blur' },
					  { min: 3, message: '密码最少6位', trigger: 'blur' }
				  ],
				  comfirmpwd: [
				  	{ validator: validatePass2, trigger: 'blur' }
				  ]
				}
			}
		},
		created(){
			this.getUsername()
		},
		methods: {
			//获取用户名
			getUsername(){
				this.updataPwdForm.username = window.sessionStorage.getItem('username')
			},
			
			//修改密码
			saveButton() {
				this.$refs.updataPwdFormRef.validate(valid => {
					if (!valid) {
						this.$message.warning('请正确填写各项')
						return // 验证不通过
					}
					const oldpwd = this.$md5(this.updataPwdForm.oldpwd)
					const newpwd = this.$md5(this.updataPwdForm.newpwd)
					const comfirmpwd = this.$md5(this.updataPwdForm.comfirmpwd)
					this.$http.post('/user/updatePWD', {
						username: this.updataPwdForm.username,
						idnumber: null,
						oldpwd: oldpwd,
						newpwd: newpwd,
						comfirmpwd: comfirmpwd
					}).then(res => {
						// console.log(res)
						this.statusCheck(res.data.status)
						this.resetLoginForm()
					}).catch(err => {
						// console.log(err)
						this.$alert('请检查网络或密码输入是否正确', '修改失败', {
							confirmButtonText: '确定'
						})
						this.resetLoginForm()
					})
				})
				
				// this.$http.post('/user/updatePWD', 
				// 	JSON.stringify(this.updataPwdForm)
				// ).then(res => {
				// 	console.log(res)
				// }).catch(err => {
				// 	console.log(err)
				// })
			},
			//根据返回的status做出不同操作
			statusCheck(status) {
				switch (status) {
					case '200':
						this.$message.success('密码修改成功！')
						window.sessionStorage.clear()
						this.$router.push('/login')
						break
					case '401':
						this.$alert('请检查输入用户名、身份证、密码是否正确', '初始化失败', {
							confirmButtonText: '确定'
						})
						break
					default:
						break
				}
			},
			// 重置表单
			resetLoginForm () {
			  this.$refs.updataPwdFormRef.resetFields()
			},
		}
	};
</script>

<style lang="less" scoped>
	.el-breadcrumb {
		margin-bottom: 15px;
	}

	.title {
		display: -moz-inline-box;
		display: inline-block;
		margin-left: 50%;
		transform: translate(-50%);
		font-size: 30px;
	}

	.el-input {
		width: 90%;
	}

	.saveButton {
		margin-top: 25px;
		margin-left: 50%;
		transform: translate(-50%);
	}

	.el-form {
		// border: 1px solid black;
		margin-top: 50px;
		margin-left: 50%;
		transform: translate(-50%);
	}
</style>
