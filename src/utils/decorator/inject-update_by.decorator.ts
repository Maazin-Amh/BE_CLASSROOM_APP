import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { request } from 'express';

export const InjectUpdatedBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log('name', req);

    req.body.updated_by = { id: req.user.id };

    return req.body;
  },
);
