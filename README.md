# Dida
dida weapp


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
