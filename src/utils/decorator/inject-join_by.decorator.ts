import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectJoinBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log('name', req);

    req.body.created_by = { id: req.siswa.id };

    return req.body;
  },
);
