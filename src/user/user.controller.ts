import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/user/roles.decorator';
import { Role } from 'src/user/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get('daily_report')
  async report(@Query('date') date: string) {
    return await this.userService.report(date);
  }
}
