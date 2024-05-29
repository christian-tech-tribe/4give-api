
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException(context.getHandler().name);
        }
        const request = context.switchToHttp().getRequest();
        request.headers["X-Auth-Email"] = user.email;
        request.headers["X-Auth-Name"] = user.name;
        request.headers["X-Auth-Fullname"] = user.fullname;
        request.headers["X-Auth-Roles"] = user.platformRoles.join(",");
        return user;
    }

}