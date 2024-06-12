import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt_access_token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, guru) {
    if (err || !guru) {
      throw err || new UnauthorizedException();
    }
    return guru;
  }
}

export class JwtGuardRefreshToken extends AuthGuard('jwt_refresh_token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, guru) {
    if (err || !guru) {
      throw err || new UnauthorizedException();
    }
    return guru;
  }
}
