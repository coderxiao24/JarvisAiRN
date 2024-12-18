## 这是什么?

- 一个 Rn 开发的 ai 聊天 app

## 有哪些功能？

- 和 ai 对话，并且 ai 预置了钢铁侠中贾维斯的角色，你的角色预置为蜘蛛侠
- 发送语音功能，但是 ai 不会回复语音

# 如何启动

### For android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

### 常用命令

```bash
 # 检查你的设备是否能正确连接到 ADB
adb devices

#生成离线的 jsbundle 文件用于安卓打包
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# 唤起React Native Dev Menu
adb shell input keyevent 82
```

## 使用说明

- 直接聊天就行

## 有问题反馈

在使用中有任何问题,欢迎反馈给我,可以用以下联系方式跟我交流

- 邮件(xiaokaixuan24#163.com, 把#换成@)
- 电话: 13140022101(微信同号)

## 关于作者

```javascript
const me = {
  nickName: 'xkx',
  email: 'xiaokaixuan24@163.com',
  phone: '13140022101',
};
```

# 在线体验

- [点我体验](https://ai.xiaokaixuan.com/)(在这个页面中点击下载应用即可下载到安卓手机安装 app)
