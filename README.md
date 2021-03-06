## 功能

```
- 登录 / 注销

- 物料管理
  - 客户管理
  - 订单管理
  - 销售出库
  - 退货订单

- 查询统计
  - 台账
    - 月度台账
    - 季度台账
    - 年度台账
  - 仓库盘点

- 仓库管理
  -入库管理
  - 库位管理

- 管理员列表

```

## 开发

```bash
# 克隆项目
git clone https://github.com/linrty/erp_web.git

# 进入项目目录
cd course_project

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:8888

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)
