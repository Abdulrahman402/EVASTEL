import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, Role } from 'src/user/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { compare } from 'bcrypt';
import { AuthDto } from './auth.dto';
import { CustomException } from 'src/filters/custom-exception.filter';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(payload: { _id: Types.ObjectId; role: Role }) {
    console.log(process.env.JWT_KEY);
    try {
      return this.jwtService.signAsync(payload, { expiresIn: '15m' });
    } catch (e) {
      console.log(e);
    }
  }

  async createRefreshToken(payload: { _id: Types.ObjectId; role: Role }) {
    console.log(process.env.JWT_KEY + ' 2');
    try {
      return this.jwtService.signAsync(payload, { expiresIn: '7d' });
    } catch (e) {
      console.log(e);
    }
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token, { secret: process.env.JWT_KEY });
  }

  async decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async signUp(signUpData: AuthDto) {
    const { phone, password } = signUpData;
    let user = await this.userModel.findOne({ phone: phone });

    if (user) throw new CustomException('User already registered');

    const hashedPassword = bcrypt.hashSync(password, 10);

    user = await this.userModel.create({
      phone,
      password: hashedPassword,
      role: Role.VISITOR,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken({ _id: user._id, role: user.role }),
      this.createRefreshToken({ _id: user._id, role: user.role }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async login(loginBody: AuthDto) {
    const user = await this.userModel.findOne({ phone: loginBody.phone });

    if (!user) throw new CustomException('Invalid phone or password');

    const matchPassword = await compare(loginBody.password, user.password);

    if (!matchPassword) throw new CustomException('Invalid phone or password');

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken({ _id: user._id, role: user.role }),
      this.createRefreshToken({ _id: user._id, role: user.role }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async addAdmin(addAdminBody: AuthDto) {
    const { phone, password } = addAdminBody;
    let user = await this.userModel.findOne({ phone: phone });

    if (user) throw new CustomException('User already registered');

    const hashedPassword = bcrypt.hashSync(password, 10);

    user = await this.userModel.create({
      phone,
      password: hashedPassword,
      role: Role.ADMIN,
    });

    return `Admin with phone ${user.phone} has been created`;
  }
}
