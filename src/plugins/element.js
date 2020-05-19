import Vue from 'vue'
// 下面为按需导入
import {
  Button,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Message,
  Submenu,
  MenuItemGroup,
  MenuItem,
  breadcrumb,
  breadcrumbItem,
  Card,
  Input,
  Row,
  Col,
  Table,
  TableColumn,
  Tooltip,
  Pagination,
  Dialog,
  Form,
  FormItem,
  MessageBox,
  Tag,
  Tree,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Loading
} from 'element-ui'

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Message)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(breadcrumb)
Vue.use(breadcrumbItem)
Vue.use(Card)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading)

Vue.prototype.$message = Message
// 把MessageBox.confirm函数挂载到Vue的原型对象上，名字为confirm，在组件中通过this.$confirm就可弹出确认消息的提示框
Vue.prototype.$confirm = MessageBox.confirm
