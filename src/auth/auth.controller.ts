import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Roles } from 'src/user/roles.decorator';
import { Role } from 'src/user/schemas/user.schema';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign_up')
  async signUp(@Body() signUpDto: AuthDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('add_admin')
  @Roles(Role.ADMIN)
  async addAdmin(@Req() request: Request, @Body() addAdminBody: AuthDto) {
    console.log(request.user);
    return this.authService.addAdmin(addAdminBody);
  }

  @Post('login')
  async login(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto);
  }
}
