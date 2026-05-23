# ScrollPals

ScrollPals 是一个面向移动端体验的 AI 伙伴短视频社区原型。项目以手机壳预览的方式展示完整的产品流程：创建 AI 伙伴、浏览短视频信息流、查看 AI 伙伴主页、聊天互动、收藏明信片、查看足迹地图，以及从视频内容触发兴趣报告。

当前仓库主要包含一个可直接预览的前端静态原型，位于 `frontend_reference/` 目录中。原型使用 React UMD、ReactDOM、Babel Standalone 和 Leaflet，通过浏览器直接加载 JSX 文件，不依赖本地打包工具。

## 功能概览

- AI 伙伴创建：输入名称、选择/描述角色外貌与性格，生成个人 AI 伙伴的起始体验。
- 短视频信息流：纵向滚动卡片流，支持视频、照片明信片、攻略卡片等内容形态。
- 互动操作：点赞、评论计数、收藏、分享、卡片翻面等基础交互。
- 角色主页：展示 AI 伙伴资料、粉丝/获赞数据、作品宫格和足迹入口。
- 聊天页：模拟即时通讯场景，包含聊天气泡、快捷表情和输入栏。
- 收藏室：将明信片保存到本地 `localStorage`，按城市聚合展示。
- 足迹地图：使用 Leaflet 展示访问城市，并尝试从 OpenStreetMap Nominatim 获取行政边界。
- 兴趣报告：内置吉他学习报告页面，展示预算、学习路径、资源推荐和常见问题。

## 目录结构

```text
.
├── README.md
└── frontend_reference/
    ├── index.html              # 入口页，自动跳转到 prototype.html
    ├── prototype.html          # 原型主页面
    ├── app.jsx                 # 应用路由与屏幕切换
    ├── app.css                 # 全局样式与手机壳样式
    ├── tweaks-panel.jsx        # 原型调试面板
    ├── screens/                # 各业务页面
    ├── cards/                  # 明信片图片资源
    ├── figs/                   # 角色/背景图片资源
    ├── uploads/                # 上传素材与头像资源
    └── videos/                 # 本地视频素材
```

## 使用方法

### 方式一：直接打开静态页面

在文件管理器中打开：

```text
frontend_reference/index.html
```

页面会自动跳转到 `prototype.html`。如果浏览器限制本地文件加载，推荐使用方式二。

### 方式二：启动本地静态服务

进入前端原型目录：

```bash
cd frontend_reference
```

使用 Python 启动本地服务：

```bash
python -m http.server 8000
```

然后在浏览器访问：

```text
http://localhost:8000
```

也可以直接访问：

```text
http://localhost:8000/prototype.html
```

## 页面导航

原型左侧默认显示屏幕切换器，可快速跳转到各个页面：

- `Create`：创建 AI 伙伴
- `Feed`：短视频信息流
- `Profile`：角色主页
- `Map`：足迹地图
- `Chat`：聊天页
- `Postcards`：收藏室
- `Report`：吉他兴趣报告

也可以通过 URL hash 直接打开指定页面，例如：

```text
http://localhost:8000/prototype.html#feed
http://localhost:8000/prototype.html#chat
http://localhost:8000/prototype.html#collection
```

## 外部依赖说明

原型页面通过 CDN 加载以下资源：

- React 18
- ReactDOM 18
- Babel Standalone
- Leaflet
- Google Fonts

足迹地图页面还会访问：

- Carto 地图瓦片服务
- OpenStreetMap Nominatim API

因此，完整体验需要网络连接。若离线打开，非地图页面和本地图片/视频素材仍可用于基础预览，但字体、地图和行政边界加载可能不可用。

## 数据与存储

项目当前使用前端内置 mock 数据，主要定义在：

```text
frontend_reference/screens/shared.jsx
```

收藏室数据保存在浏览器 `localStorage` 中，键名为：

```text
scrollpals.collection.v1
```

足迹地图边界缓存也保存在 `localStorage` 中，键名为：

```text
fp.boundary.v2
```

如需重置演示状态，可以在浏览器开发者工具中清空当前站点的 `localStorage`。

## 开发说明

该原型没有引入 npm 工程或构建流程。新增页面时，可以参考现有页面的写法：

1. 在 `frontend_reference/screens/` 下新增页面组件。
2. 在 `prototype.html` 中添加对应 JSX 脚本引用。
3. 在 `app.jsx` 的 `SCREENS` 和 `Router` 中注册页面。
4. 如需复用角色、帖子、图标或收藏逻辑，可从 `screens/shared.jsx` 中扩展。

## 注意事项

- 当前项目是静态交互原型，不包含真实后端、登录系统或 AI 接口调用。
- JSX 由浏览器端 Babel 实时编译，适合快速演示，不适合直接用于生产环境。
- 视频、图片等素材使用相对路径加载，建议通过本地 HTTP 服务预览以减少浏览器本地文件限制。
