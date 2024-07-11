import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ALLOW_ROLE_KEY, Role, JwtPayload } from 'src/shared';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const whoCanAccess = this.reflector.getAllAndOverride<Role[]>(
      ALLOW_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!token) return false;
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
    } catch {
      return false;
    }
    if (whoCanAccess) {
      if (!whoCanAccess.includes(request['user'].rol as Role)) {
        throw new ForbiddenException();
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
