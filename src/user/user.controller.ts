import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('login')
  login(): string {
    return 'This action returns all users';
  }
}
