import { SetMetadata } from '@nestjs/common';
// 用户控制，硬编码

// 用户角色表
export enum role {
  user = 'USER',
  editor = 'EDITOR',
  admin = 'ADMIN',
}

// 用户组宏定义
export const group = {
  login: [role.user, role.editor, role.admin],
  editor: [role.editor, role.admin],
  admin: [role.admin],
};

// 用户权限
export const permission = {
  // 用户相关权限
  'user.profile': group.login, // 获取用户信息
  'user.profile.edit': group.login, // 编辑用户信息
  'user.email.bind': group.login, // 绑定邮箱
  'user.email.unbind': group.login, // 解绑邮箱
  'user.passwd.reset': group.login, // 重置密码
  'user.list': group.admin, // 获取用户列表
  'user.get': group.admin, // 获取用户信息
  'user.new': group.admin, // 创建用户
  'user.delete': group.admin, // 删除用户
  'user.modify': group.admin, // 修改用户信息

  // 分类相关权限
  'category.list': group.login, // 获取分类
  'category.get': group.login, // 获取分类信息
  'category.get.posts': group.login, // 获取分类番剧信息
  'category.add': group.admin, // 新增分类
  'category.edit': group.admin, // 修改分类
  'category.delete': group.admin, // 删除分类

  // 番剧相关权限    只有group.editor可以修改或删除别人上传的番剧
  'post.list': group.login, // 获取番剧列表
  'post.add': group.login, // 新增番剧
  'post.get': group.login, // 获取番剧详细信息
  'post.data.get': group.login, // 获取番剧主体数据
  'post.update': group.login, // 修改番剧信息
  'post.update.overuser': group.editor, // 修改别人的番剧信息
  'post.delete': group.login, // 删除番剧
  'post.delete.overuser': group.editor, // 删除别人的番剧
  'post.data.set': group.login, // 设置番剧主体数据
  'post.data.set.overuser': group.editor, // 设置别人番剧主体数据
  'post.state.ready': group.login, // 设置番剧的编辑状态
  'post.state.ready.overuser': group.editor, // 设置别人的番剧的编辑状态
  'post.state.publish': group.editor, // 设置番剧公开状态

  // 合集相关权限
  'collection.list': group.login, // 获取合集列表
  'collection.get': group.login, // 获取合集信息
  'collection.add': group.editor, // 新建合集
  'collection.update': group.editor, // 修改合集信息
  'collection.update.overuser': group.editor, // 修改其他用户上传合集的信息
  'collection.delete': group.editor, // 删除合集
  'collection.delete.overuser': group.editor, // 删除其他用户上传的合集
  'collection.append': group.editor, // 向合集追加番剧
  'collection.append.overuser': group.editor, // 向他用户的合集追加番剧
  'collection.remove': group.editor, // 从合集移除番剧
  'collection.remove.overuser': group.editor, // 从他用户的合集移除番剧
  'collection.state': group.editor, // 设置合集显示状态
  'collection.state.overuser': group.editor, // 设置其他用户上传合集的显示状态
};

export const ALLOW_ROLE_KEY = 'whoCanAccess';
export const NeedPermission = (pm: string) =>
  SetMetadata(ALLOW_ROLE_KEY, permission[pm]);

export function checkPermission(role: role, perm: string): boolean {
  return permission[perm].includes(role);
}
