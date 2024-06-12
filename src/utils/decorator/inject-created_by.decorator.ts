import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectCreatedBy = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log('name', req);

    req.body.created_by = { id: req.user.id };
    req.body.class_by = { id: req.user.id };

    return req.body;
  },
);
