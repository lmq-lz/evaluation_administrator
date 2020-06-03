// 定义全局变量

// 埋点数据的表单(用于存储点击事件行为的表单)
var dataBurialForm = {
  createDate: '',
  id: 0,
  // 菜单选项(例如：用户管理，授课管理)
  module: '',
  name: '',
  // 埋点的操作(例如：添加学生，编辑，删除，查看开课情况等)
  operate: '',
  role: '',
  // 子菜单选项(例如：学生管理，班级管理，课程管理，角色管理等等)
  subModule: '',
  username: 'admin'
}

// 埋点数据的表单(用于存储页面访问行为的表单)
var webPageDataBurialForm = {
  createDate: '',
  id: 0,
  // 菜单选项(例如：用户管理，授课管理)
  module: '页面访问',
  name: '',
  // 埋点的操作(例如：添加学生，编辑，删除，查看开课情况等)
  operate: '成功访问',
  role: '',
  // 子菜单选项(例如：学生管理，班级管理，课程管理，角色管理等等)
  subModule: '',
  username: ''
}
export default{
  dataBurialForm,
  webPageDataBurialForm
}