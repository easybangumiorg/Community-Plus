import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { jwtPayload } from './dto/jwtPayload';
import { userSignInDto } from './dto/userSignDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    // eslint-disable-next-line prettier/prettier
  ) { }

  // 检查用户登录并签发Token
  async signIn(account: string, password: string): Promise<userSignInDto> {
    const user = await this.userService.getUserByAccount(account);
    if (!user)
      throw new UnauthorizedException({
        code: 401,
        msg: 'Invalid account or password',
      });
    if (user.password !== password)
      throw new UnauthorizedException({
        code: 401,
        msg: 'Invalid account or password',
      });
    const payload: jwtPayload = {
      id: user.id,
      acc: user.account,
      rol: user.role,
    };
    return {
      token: await this.jwt.signAsync(payload),
      id: user.id,
      account: user.account,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      profile: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
    };
  }

  // 修改用户密码
  async changePassword(id: number, oldPasswd: string, newPasswd: string) {
    const user = await this.userService.getPasswdUserByID(id, oldPasswd);
    if (!user)
      throw new ForbiddenException({
        code: 401,
        msg: 'Invalid old password',
      });
    return await this.userService.editUserPasswd(id, newPasswd);
  }
}
