import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { Role } from '@prisma/client';
// 用户控制，硬编码

export const group = {
  user: [Role.USER, Role.EDITOR, Role.ADMIN],
  editor: [Role.EDITOR, Role.ADMIN],
  admin: [Role.ADMIN],
};

// 用户权限
export const permission = {
  'resource.public': group.user, // 能够查看公开资源
  'resource.all': group.editor, // 能够查看所有资源

  'user.self': group.user, // 能够设定自己的信息
  'collection.self': group.user, // 能够创建自己的合集并管理它
  'post.self': group.user, // 能够创建自己的文章并管理它
  'parse_method.self': group.admin, // 能够创建自己的解析方法并管理它

  'user.manage': group.admin, // 管理所有用户
  'category.manage': group.admin, // 管理所有分类
  'tag.manage': group.editor, // 管理所有标签
  'collection.manage': group.editor, // 管理所有合集
  'choreography.manage': group.editor, // 管理所有编排
  'parse_method.manage': group.admin, // 管理所有解析方法
  'post.manage': group.editor, // 管理所有文章
};

export const ALLOW_ROLE_KEY = 'whoCanAccess';
export const NeedPermission = (
  pm: string,
): ClassDecorator & MethodDecorator => {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) {
    // 方法装饰器逻辑
    SetMetadata('allow_role_key', permission[pm])(
      target,
      propertyKey,
      descriptor,
    );
    UseGuards(AuthGuard)(target, propertyKey, descriptor);
  };
};

export function checkPermission(role: Role, perm: string): boolean {
  return permission[perm].includes(role);
}
