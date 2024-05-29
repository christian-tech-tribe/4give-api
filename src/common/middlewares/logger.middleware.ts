import { Injectable, NestMiddleware} from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private readonly logger = new Logger(LoggerMiddleware.name);

  path(req) {
    try {
      return req._parsedUrl.path
    } catch (error) {
      return "?"
    }
  }

  use(req: any, res: Response, next: Function) {
      try {
        var offuscateRequest = JSON.parse(JSON.stringify(req.body));
        if(offuscateRequest?.password) offuscateRequest.password = "*******";
        if(offuscateRequest?.newPassword) offuscateRequest.newPassword = "*******";
        if(offuscateRequest?.oldPassword) offuscateRequest.oldPassword = "*******";
        if(offuscateRequest?.currentPassword) offuscateRequest.currentPassword = "*******";
        if(Object.keys(offuscateRequest).length === 0) {
          this.logger.log(new Date().toString() + ' - [Request] ' + this.path(req) + " - " + JSON.stringify(offuscateRequest));
        }
      } catch (error) {
        this.logger.error(error)        
      }
      next();
    };  
}