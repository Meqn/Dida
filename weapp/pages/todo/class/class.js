const app = getApp()
import Util from '../../../utils/util'
import Todo from '../includes/todo'
import Menu from '../../../libs/scripts/menu'
import ActionMenu from '../../components/action-menu/action-menu'

const MenuItems = [{
  text: '编辑',
  icon: 'editor',
  fn: 'onEditClass'
},{
  text: '删除',
  icon: 'trash',
  fn: 'onDeleteClass'
}]

// index.js
Page({
  data: {
    status: 'loading',
    data: {
      class: [],
      mode: [],
      invite: 0,
      size: {}
    },
    posts: {
      status: 0,
      error: '',
      fields: {
        title: '',
        color: {
          value: 9,
          array: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink', 'teal', 'brown']
        }
      }
    },
    currentClass: null
  },
  ...ActionMenu,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 菜单按钮初始化
    this.__menu_init(MenuItems)
  },
  onReady: function () {
  },
  onShow: function () {
    Todo.todoArchive(data => {
      this.setData({
        status: 'end',
        'data.class': data.class,
        'data.mode': data.mode,
        'data.size': data.size,
      })
    })
    // 被邀请
    Todo.getFollowCount().then(data => this.setData({ 'data.invite': data }))
  },
  onHandleClass(e) {
    const idx = e.currentTarget.dataset.index
    this.data.currentClass = idx
    if (this.data.data.class[idx].owner != '0') {
      this.__menu_show(e)
    }
  },
  onEditClass(e) {
    const _class = this.data.data.class
    const _currentClass = this.data.currentClass
    const _posts = this.data.posts
    if(_currentClass === null) {
      return wx.showModal({content: '请选择要编辑的列表', showCancel:false})
    }
    const {title, color} = _class[_currentClass]
    this.__menu_hide(e)
    this.setData({
      status: 'edit',
      'posts.fields.title': _class[_currentClass].title,
      'posts.fields.color.value': this.getColorIndex(_class[_currentClass].color)
    })
  },
  onDeleteClass(e) {
    this.__menu_hide(e)
    const _index = this.data.currentClass
    const _data = this.data.data
    const classId = _data.class[_index].objectId
    if (_data.size[classId].length > 0) {
      return wx.showModal({
        content: '该清单下存在任务，无法删除',
        showCancel: false
      })
    }
    Todo.deleteClass(classId).then(res => {
      Util.storageUpdate('todoClass')
      Util.toast('删除成功', 'success')
      _data.class.splice(_index, 1)
      this.setData({
        'data.class': _data.class
      })
    }).catch(error => {
      Util.toast('删除失败', 'error')
    })
  },
  // 显示创建列表窗口
  onCreateClass() {
    this.setData({
      status: 'add'
    })
  },
  // 显示创建列表窗口
  onCloseModal() {
    this.setData({
      status: 'end',
      'posts.status': 0,
      'posts.error': ''
    })
  },
  // 创建列表
  onSubmitClass() {
    const context = this
    const posts = this.data.posts
    const title = posts.fields.title.trim()
    const color = posts.fields.color.array[posts.fields.color.value]

    if (!title) return this.setData({ 'posts.error': '名称不能为空' })
    if (app.globalData.user.level < 20) {
      this.modalClose()
      return wx.showModal({
        title: '',
        content: '权限不足,无法创建',
        showCancel: false,
      })
    }

    this.setData({
      'posts.status': 1,
      'posts.error': ''
    })
    if (this.data.status === 'add') {
      this.postClass({ title, color })
    } else {
      const classId = this.data.data.class[this.data.currentClass].objectId
      this.updateClass(classId, { title, color })
    }
  },
  // 获取列表名称
  onInput(e) {
    this.data.posts.fields.title = e.detail.value
  },
  // 获取列表颜色
  onSelectColor(event) {
    this.setData({
      'posts.fields.color.value': event.currentTarget.dataset.index
    })
  },
  getColorIndex(name) {
    return this.data.posts.fields.color.array.indexOf(name)
  },
  onSuccess() {
    this.setData({
      status: 'end',
      'posts.status': 0,
      'posts.error': '',
      'posts.fields.title': ''
    })
  },
  onFail(error) {
    this.setData({
      'posts.status': 0,
      'posts.error': error
    })
  },
  postClass(data) {
    Todo.postClass(data).then(res => {
      this.onSuccess()
      Util.storageUpdate('todoClass')
      const param = {}, key1 = 'data.class', key2 = 'data.size.'+ res.objectId
      param[key1] = [...this.data.data.class, res], param[key2] = []
      this.setData(param)
    }).catch(err => {
      this.onFail(err.errorText)
    })
  },
  updateClass(classId, data) {
    Todo.updateClass(classId, data).then(res => {
      this.onSuccess()
      Util.storageUpdate('todoClass')
      const _data = Object.assign({}, this.data.data.class[this.data.currentClass], data)
      const param = {}, key = `data.class[${this.data.currentClass}]`
      param[key] = _data
      this.setData(param)
    }).catch(err => {
      this.onFail(err.errorText)
    })
  }
})