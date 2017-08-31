# Dida
dida weapp


## 列表

### Toast

```
wx.showToast({
  title: '暂不支持!',
  image: '/assets/images/icon_smile.png',
  mask: true
})
```

### modal

```
<view class="q-anite-fadein q-modal todo-class-add" style="display: {{status === 'add' ? 'block' : 'none'}}">
  <view class="q-modal-main">
    <icon class="iconfont icon-close q-modal-close" bindtap="modalClose"></icon>
    <view class="q-modal-hd">
      <text class="q-modal-title">标题</text>
    </view>
    <view class="q-modal-bd">
      //
    </view>
    <view class="q-modal-ft">
      <button type="default" class="q-btn-mini" bindtap="modalClose">取消</button>
      <button type="primary" class="q-btn-mini" loading="" bindtap="submitClass" loading="{{posts.status === 0 ? '' : 'loading'}}" disabled="{{posts.status === 0 ? '' : 'disabled'}}">{{posts.status === 0 ? '保存' : '正在提交...'}}</button>
      <view class="error" wx:if="{{posts.error}}">错误提示：{{posts.error}}</view>
    </view>
  </view>
</view>
```


## 帐号配置

`/weapp/config.js` 文件

```
module.exports = {
  appId: '',
  appKey: '',
  masterKey: ''
}
```


## 密码加密

```
const PWD = md5(password).slice(5,25)

const umm = md5(password).slice(5)
const PWD = upwd.slice(0, 20)
```


## 规则

1. 邀请

如果参与者超过10人，有一半人点击完成，将自动完成

2. Todo

 － 1) 过期不能修改







