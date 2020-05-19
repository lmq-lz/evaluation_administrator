<template>
	<el-container class="home-container">
		<el-header height="10%">
			<div class="header-title">
				<div class="avatar_box">
					<img src="../../assets/image/logoITElite.jpg" alt="" />
				</div>
				<span> 教学质量评估系统-初始化密码 </span>
			</div>
		</el-header>
		<el-container class="main-container">
			<el-card>
				<span class="title"> 初始化密码 </span>
				<el-form ref="initFormRef" :model="initForm" :rules="initFormRules" label-position="right" label-width="80px">
					<el-form-item label="学/工号" prop="username">
						<el-input placeholder="请输入学/工号" v-model="initForm.username"></el-input>
					</el-form-item>

					<el-form-item label="身份证号" prop="idnumber">
						<el-input placeholder="请输入身份证号" v-model="initForm.idnumber"></el-input>
					</el-form-item>

					<el-form-item label="新密码" prop="newpwd">
						<el-input placeholder="请输入新密码" v-model="initForm.newpwd" type="password" show-password></el-input>
					</el-form-item>

					<el-form-item label="确认密码" prop="comfirmpwd">
						<el-input placeholder="确认密码" v-model="initForm.comfirmpwd" type="password" show-password></el-input>
					</el-form-item>
				</el-form>
				<div class="btns">
					<el-button type="primary" @click='saveButton()'>保存</el-button>
					<el-button type="info" @click='goLogin()'>返回登录页</el-button>
				</div>
			</el-card>
		</el-container>
		<el-footer height="5%">
			<span>Made by Team 4 : JaegerTao</span>
			<span>初始化密码</span>
		</el-footer>
	</el-container>
</template>

<script>
	export default {
		data() {
			var validatePass2 = (rule, value, callback) => {
			        if (value === '') {
			          callback(new Error('请再次输入密码'));
			        } else if (value !== this.initForm.newpwd) {
			          callback(new Error('两次输入密码不一致!'));
			        } else {
			          callback();
			        }
			      };
			return {
				initForm: {
					username: '',
					idnumber: '',
					oldpwd: '',
					newpwd: '',
					comfirmpwd: ''
				},
				//验证输入表单
				initFormRules: {
				  // 验证用户名是否合法
				  username: [
				    { required: true, message: '请输入用户账号', trigger: 'blur' },
				    { min: 2, max: 12, message: '请输入正确的账号', trigger: 'blur' }
				  ],
				  // 验证密码是否合法
				  idnumber: [
				    { required: true, message: '请输入身份证号', trigger: 'blur' },
				    { min: 10, max: 18 , message: '请输入正确的身份证', trigger: 'blur' }
				  ],
				  newpwd: [
					  { required: true, message: '请输入密码', trigger: 'blur' },
					  { min: 3, message: '密码最少6位', trigger: 'blur' }
				  ],
				  comfirmpwd: [
				  	{ validator: validatePass2, trigger: 'blur' }
				  ]
				}
			}
		},
		created() {

		},
		methods: {
			saveButton() {
				this.$refs.initFormRef.validate(valid => {
					if (!valid) {
						this.$message.warning('请正确填写各项')
						return // 验证不通过
					}
					const idnumber = this.$md5(this.initForm.idnumber)
					const newpwd = this.$md5(this.initForm.newpwd)
					const comfirmpwd = this.$md5(this.initForm.comfirmpwd)
					this.$http.post('/user/findPWD', {
						username: this.initForm.username,
						idnumber: idnumber,
						newpwd: newpwd,
						oldpwd: null,
						comfirmpwd: comfirmpwd
					}).then(res => {
						console.log(res)
						this.statusCheck(res.data.status)
					}).catch(err => {
						this.$alert('请检查输入用户名、身份证、密码是否正确', '初始化失败', {
							confirmButtonText: '确定'
						})
						console.log(err)
					})
				})
			},
			//返回登录页
			goLogin() {
				this.$router.push('/login')
			},
			//根据返回的status做出不同操作
			statusCheck(status) {
				switch (status) {
					case '200':
						this.$message.success('初始化密码成功！')
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
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-header {
		background-color: #55557f;
		border-radius: 0px 0px 10px 10px;
		box-shadow: 10px 10px 5px #e2e2e2;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.header-title {
			display: flex;
			align-items: center;

			span {
				margin-left: 20px;
				font-size: 25px;
				color: #ffffff;
				height: 30px;
				overflow: hidden;
			}
		}


	}

	.avatar_box {
		height: 30px;
		width: 30px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		background-color: #FFFFFF;

		img {
			height: 100%;
			width: 100%;
			border-radius: 50%;
			background-color: #eee;
		}
	}

	.el-footer {
		background-color: #55557f;
		border-radius: 5px 5px 0px 0px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row-reverse;

		>span {
			color: #FFFFFF;
		}
	}

	.home-container {
		height: 100%;
	}

	.main-container {
		height: 80%;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.el-card {
		width: 100%;
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

	.el-form {
		// border: 1px solid black;
		margin-top: 50px;
		margin-left: 50%;
		transform: translate(-50%);
	}

	.btns {
		// border: 1px solid black;
		margin-top: 50px;
		width: 200px;
		margin-left: 50%;
		transform: translate(-50%);
	}
</style>
