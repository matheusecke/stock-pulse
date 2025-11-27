import {
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Tokens } from './types/tokens.type';
import { JwtPayload, JwtRefreshPayload } from './types/jwt-payload.type';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users/signup')
  async signup(@Body() dto: AuthUserDto): Promise<Tokens> {
    return this.authService.userSignup(dto);
  }

  @Post('users/login')
  login(@Body() dto: AuthLoginDto): Promise<Tokens> {
    return this.authService.userLogin(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('users/logout')
  logout(@Req() req: Request & { user?: JwtPayload }) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return this.authService.userLogout(req.user.sub);
  }

  @Post('admin/signup')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async adminSignup(@Body() dto: AuthUserDto): Promise<Tokens> {
    return this.authService.adminSignup(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('users/refresh')
  refreshTokens(
    @Req() req: Request & { user?: JwtRefreshPayload },
  ): Promise<Tokens> {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    const user = req.user;
    return this.authService.refreshTokens(user.sub, user.refreshToken);
  }
}
