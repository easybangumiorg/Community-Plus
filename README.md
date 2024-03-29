<p align="center">
  <a href="https://github.com/easybangumiorg/Community-Plus" target="blank"><img src="https://easybangumi.org/icons/FAVICON-RAW.png" width="200" alt="Community Plus LOGO" /></a>
</p>

<p align="center">一个开源的、轻量的番剧管理实现，用于纯纯看番社区版插件的后端，专为<a href="https://github.com/easybangumiorg/EasyBangumi" target="blank">纯纯看番</a>插件化而实现。</p>

## 描述

采用 [Nest](https://nestjs.com/) 框架作为后端实现

采用 [Prisma](https://www.prisma.io/) 作为数据库接口

## 安装依赖

```bash
$ yarn install
```

## 设定环境

在环境变量指定数据库地址和令牌签发密钥

**DATABASE_URL**：数据库地址

**JWT_SIGN_KEY**：令牌签发密钥

```bash
# 设定数据库地址
$ export DATABASE_URL="mysql://user:passwd@domain:port/db_name"

# 设定令牌签发密钥
$ export JWT_SIGN_KEY="something like key"

# 在数据库创建数据模型
$ yarn db:g
$ yarn db:m
```

## 运行

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 迁移

计划对主流的一些CMS进行数据库迁移，目前并没有非常好的迁移方法。

以下是迁移功能的开发计划：

1. 完成API用户的角色设计及权限实现
2. 完成被动迁移的数据接口
3. 完成对Apple CMS的数据库主动迁移
4. 其他CMS系统的支持

## 插件连接

目前尚未完成对纯纯看番插件的接口设计，也没有第一方的的公开服务器。

插件计划为默认支持第一方服务器的连接也可选第三方的服务器连接，同时支持验证功能。

## 支持

纯纯看番社区+ 采用[MPL-2.0](LICENSE)许可发行源代码，如果你有什么新的功能或者建议，欢迎加入我们。

## 相关项目

- 纯纯看番 - [EasyBangumi](https://github.com/easybangumiorg/EasyBangumi)
- 纯纯看番社区+ 后端 - [Community-Plus](https://github.com/easybangumiorg/Community-Plus/)
- 纯纯看番社区+ 管理前端 - [Community-Plus-FrontEnd](https://github.com/easybangumiorg/Community-Plus-FrontEnd)
- 纯纯看番社区+ 插件 - [EasyBangumi-Extension-Community-Plus](https://github.com/easybangumiorg/EasyBangumi-Extension-Community-Plus)

## 许可

该项目由 [MPL-2.0](LICENSE) 许可发行。
