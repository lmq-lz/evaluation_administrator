<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="{path: '/teachingSituation' }">教学情况查看</el-breadcrumb-item>
			<el-breadcrumb-item>评价详情</el-breadcrumb-item>
		</el-breadcrumb>

		<el-table class="table-classinfo" :data="courseCheckItem" border style="width: 90%" size="mini" :header-cell-style="{'text-align':'center'}"
		 :cell-style="{'text-align':'center'}">
			<el-table-column prop="number" label="课程号" width="100">
			</el-table-column>
			<el-table-column prop="courseDep" label="学院" width="150">
			</el-table-column>
			<el-table-column prop="courseType" label="课程类别" width="220">
			</el-table-column>
			<el-table-column prop="courseClass" label="课程类型">
			</el-table-column>
			<el-table-column prop="name" label="课程名称" width="150">
			</el-table-column>
			<el-table-column prop="time" label="学时">
			</el-table-column>
			<el-table-column prop="score" label="学分">
			</el-table-column>
			<el-table-column prop="teacher.name" label="任课教师">
			</el-table-column>
		</el-table>

		<el-tabs v-loading='loading' v-model="activeName" type="border-card">

			<el-tab-pane label="总体情况" name="totalappraise">
				<div class="charts">
					<div>
						<v-chart :options="totalappraise"></v-chart>
					</div>
					<div class="total-content">
						<div class="total-content-title">总体情况(5分制)</div>
						<el-row :gutter="20">
							<el-col :span="12">
								<div class="grid-content bg-purple">学生评价平均分</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple">{{ totalScoreStu == 0 ? '暂无': totalScoreStu }}</div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12">
								<div class="grid-content bg-purple">教师互评平均分</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple">{{ totalScoreTeacher == 0 ? '暂无': totalScoreTeacher }}</div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12">
								<div class="grid-content bg-purple">督导评价平均分</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple">{{ totalScoreSpv == 0 ? '暂无': totalScoreSpv }}</div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12">
								<div class="grid-content bg-purple">总平均分</div>
							</el-col>
							<el-col :span="12">
								<div class="grid-content bg-purple">{{ totalScore == 0 ? '暂无': totalScore }}</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-tab-pane>

			<el-tab-pane label="学生评价" name="stuappraise">
				<el-table :data="appraiseListStu" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
					<el-table-column type="index" fixed="left"></el-table-column>
					<el-table-column prop="content" label="评价内容" width="600">
					</el-table-column>
					<el-table-column label="平均得分">
						<template slot-scope="scope">
							{{ scope.row.score }}
						</template>
					</el-table-column>
				</el-table>
				<el-row>
					<el-col :span="15">
						<!-- <el-button type="info" :disabled="totalScoreStu == 0" @click='goAdvice(3)'>查看建议</el-button> -->
            学生评价总平均分：
					</el-col>
					<el-col :span="9">
						<div class="sumscore">{{ totalScoreStu == 0 ? '暂无': totalScoreStu }}</div>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="教师评价" name="tchappraise">
				<el-table :data="appraiseListTeacher" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="content" label="评价内容" width="600">
					</el-table-column>
					<el-table-column label="平均得分">
						<template slot-scope="scope">
							{{ scope.row.score }}
						</template>
					</el-table-column>
				</el-table>
				<el-row>
					<el-col :span="15">
						<!-- <el-button type="info" :disabled="totalScoreTeacher == 0" @click='goAdvice(2)'>查看建议</el-button> -->
            教师评价总平均分：
					</el-col>
					<el-col :span="9">
						<div class="sumscore">{{ totalScoreTeacher == 0 ? '暂无': totalScoreTeacher }}</div>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="督导评价" name="svappraise">
				<el-table :data="appraiseListSpv" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="content" label="评价内容" width="600">
					</el-table-column>
					<el-table-column label="平均得分">
						<template slot-scope="scope">
							{{ scope.row.score }}
						</template>
					</el-table-column>
				</el-table>
				<el-row>
					<el-col :span="15">
						<!-- <el-button type="info" :disabled="totalScoreSpv == 0" @click='goAdvice(4)'>查看建议</el-button> -->
            督导评价总平均分：
					</el-col>
					<el-col :span="9">
						<div class="sumscore">{{ totalScoreSpv == 0 ? '暂无': totalScoreSpv }}</div>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeName: 'totalappraise',

				commentData: [],
				appraiseListStu: [],
				appraiseListTeacher: [],
				appraiseListSpv: [],
				totalScoreStu: 0,
				totalScoreTeacher: 0,
				totalScoreSpv: 0,
				totalScore: 0,

				courseCheckItem: [],
				courseid: '',
        teacherid: '',

				totalappraise: {
					title: {
						text: '评价占比',
						subtext: '各角色评价权重占比',
						left: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: ['学生评价', '教师互评', '督导评价']
					},
					series: [{
						name: '评价权重占比',
						type: 'pie',
						radius: '55%',
						center: ['40%', '40%'],
						data: [{
								value: 30,
								name: '学生评价'
							},
							{
								value: 30,
								name: '教师互评'
							},
							{
								value: 40,
								name: '督导评价'
							}
						],
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				},
				loading: true
			}
		},
		created() {
			this.getCheckCourseItem()
			this.initList()
		},
		methods: {
			//跳转到查看建议页面
			goAdvice(adviceRole) {
				window.sessionStorage.setItem('adviceRole',adviceRole)
				this.$router.push('/teacher/teacheradvice')
			},
			//获取当前查看课程
			getCheckCourseItem() {
				let rowstr = window.sessionStorage.getItem('courseCheckItem')
				this.courseCheckItem = []
				this.courseCheckItem.push(JSON.parse(rowstr))
				this.courseid = this.courseCheckItem[0].id
        this.teacherid = this.courseCheckItem[0].teacher.id
			},
			//加载列表
			async initList() {
				this.loading = true
				await this.getAppraiseList()
				await this.getSummaryEva()
        let that = this
        setTimeout(function(){
          that.loading = false
        }, 300)
			},
			getAppraiseList() {
				this.$http.get('/evaluationItem/list?rid=2')
					.then(res => {
						this.appraiseListTeacher = res.data.data
					})
					.catch(err => {
						console.log(err)
					})
				this.$http.get('/evaluationItem/list?rid=3')
					.then(res => {
						this.appraiseListStu = res.data.data
					})
					.catch(err => {
						console.log(err)
					})
				this.$http.get('/evaluationItem/list?rid=4')
					.then(res => {
						this.appraiseListSpv = res.data.data
					})
					.catch(err => {
						console.log(err)
					})

			},
			getSummaryEva() {
				this.$http.get('/evaluation/admin/summaryEvaluation/byTeacherId', {
						params: {
              teacherId: this.teacherid,
							courseId: this.courseid
						}
					})
					.then(res => {
						console.log(res.data)
						for (let eva of res.data.data) {
							switch (eva.role_name) {
								case "学生":
									let scorelistStu = []
									// scorelistStu[0] = eva.score_1
									// scorelistStu[1] = eva.score_2
									// scorelistStu[2] = eva.score_3
									// scorelistStu[3] = eva.score_4
									// scorelistStu[4] = eva.score_5
									// scorelistStu[5] = eva.score_6
									this.totalScoreStu = eva.total_score
									scorelistStu = this.initScoreList(eva)
									// console.log(scorelistStu)
									for (let i = 0; i < this.appraiseListStu.length; i++) {
										this.appraiseListStu[i].score = scorelistStu[i]
									}
									break
								case "教师":
									let scorelistTeacher = []
									this.totalScoreTeacher = eva.total_score
									scorelistTeacher = this.initScoreList(eva)
									for (let i = 0; i < this.appraiseListTeacher.length; i++) {
										this.appraiseListTeacher[i].score = scorelistTeacher[i]
									}
									break
								case "督导":
									let scorelistSpv = []
									this.totalScoreSpv = eva.total_score
									scorelistSpv = this.initScoreList(eva)
									for (let i = 0; i < this.appraiseListSpv.length; i++) {
										this.appraiseListSpv[i].score = scorelistSpv[i]
									}
									break
								default:
									break
							}
						}
						// console.log(this.appraiseListStu)
						this.totalScore = Number(this.totalScoreStu * 0.3 + this.totalScoreTeacher * 0.3 + this.totalScoreSpv * 0.4).toFixed(2)
					})
					.catch(err => {
						console.log(err)
					})
			},
			//构建分数数组
			initScoreList(eva) {
				let scorelist = []
				scorelist[0] = eva.score_1
				scorelist[1] = eva.score_2
				scorelist[2] = eva.score_3
				scorelist[3] = eva.score_4
				scorelist[4] = eva.score_5
				scorelist[5] = eva.score_6
				return scorelist
			},
			initScoreById(item, scorelist) {
				let i = Number(item.id)
				return scorelist[i - 1]
			}
		}
	}
</script>

<style lang="less" scoped>
  .body {
  	margin: 0;
  }
	.el-breadcrumb {
		margin-bottom: 15px;
	}
  .el-tab-pane{
    .el-row{
      margin: 15px;
    }
  }

	.el-col {
    font-family: 'Courier New', Courier, monospace;
		// margin-top: 10px;
		text-align: center;
	}

	.sumscore {
    margin-left: -35px;
		// margin-top: 10px;
	}

	.table-classinfo {
		margin-bottom: 10px;
		margin-left: 50%;
		transform: translate(-50%);
	}

	.charts {
		// border: 1px solid black;
		display: flex;
		flex-direction: row;

		.total-content {
			// border: 1px solid black;
			display: flex;
			flex-direction: column;
			width: 50%;

			.total-content-title {
				text-align: center;
				margin-top: 20px;
				margin-bottom: 20px;
				margin-left: 50%;
				transform: translate(-50%);
				font-size: 21px;
				font-family: 'Courier New', Courier, monospace;
			}

			.el-row {
				margin-bottom: 15px;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.el-col {
				border-radius: 4px;

			}

			.bg-purple-dark {
				background: #99a9bf;
			}

			.bg-purple {
				background: #d3dce6;
			}

			.bg-purple-light {
				background: #e5e9f2;
			}

			.grid-content {
				border-radius: 4px;
				min-height: 36px;
				padding-top: 8px;
				font-size: 20px;
				font-family: 'Courier New', Courier, monospace;
			}

			.row-bg {
				padding: 10px 0;
				background-color: #f9fafc;
			}

		}
	}
</style>
