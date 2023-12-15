import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { env } from 'process';
import { jwtPayload } from './dto/jwtPayload';
import { ALLOW_ROLE_KEY, role } from 'src/shared';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const whoCanAccess = this.reflector.getAllAndOverride<role[]>(
      ALLOW_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    // 处理令牌，将用户信息保存到request中
    if (!token) {
      throw new UnauthorizedException({
        code: 401,
        msg: 'User Need signin',
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync<jwtPayload>(token, {
        secret: env.JWT_SIGN_KEY,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        code: 401,
        msg: 'Invalid token',
      });
    }
    // 处理权限相关内容，如不定义具体谁可以访问，则默认所有用户可以访问
    if (whoCanAccess) {
      if (!whoCanAccess.includes(request['user'].rol as role)) {
        throw new ForbiddenException({
          code: 403,
          msg: 'Permission denied',
        });
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
