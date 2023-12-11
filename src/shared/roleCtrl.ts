// 用户控制，硬编码

// 用户角色表
export const role = {
  guest: 'GUEST',
  user: 'USER',
  editor: 'EDITOR',
  admin: 'ADMIN',
};

// 用户组宏定义
export const group = {
  all: [role.guest, role.user, role.editor, role.admin],
  login: [role.user, role.editor, role.admin],
  editor: [role.editor, role.admin],
  admin: [role.admin],
};

// 用户权限
export const permission = {
  // 用户相关权限
  'user.profile': group.login, // 获取用户信息
  'user.profile.edit': group.login, // 编辑用户信息
  'user.list': group.admin, // 获取用户列表
  'user.new': group.admin, // 创建用户
  'user.delete': group.admin, // 删除用户
  'user.modify': group.admin, // 修改用户信息

  // 分类相关权限
  'category.list': group.login, // 获取分类
  'category.add': group.editor, // 新增分类
  'category.update': group.editor, // 修改分类
  'category.delete': group.editor, // 删除分类

  // 番剧相关权限    只有group.editor可以修改或删除别人上传的番剧
  'post.list': group.login, // 获取番剧列表
  'post.add': group.login, // 新增番剧
  'post.update': group.login, // 修改番剧
  'post.delete': group.login, // 删除番剧
  'post.state': group.editor, // 设置番剧公开状态

  // 合集相关权限
  'collection.list': group.editor, // 获取合集列表
  'collection.get': group.editor, // 获取合集信息
  'collection.add': group.editor, // 新建合集
  'collection.update': group.editor, // 修改合集
  'collection.delete': group.editor, // 删除合集
  'collection.append': group.editor, // 向合集追加番剧
  'collection.remove': group.editor, // 从合集移除番剧
  'collection.state': group.editor, // 设置合集显示状态
};
