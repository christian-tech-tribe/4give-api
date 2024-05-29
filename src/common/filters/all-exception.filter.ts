import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = (exception instanceof HttpException) ? exception.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;

    // if (status === HttpStatus.UNAUTHORIZED) 
    //     return response.status(status).render('views/401');
    // if (status === HttpStatus.NOT_FOUND) 
    //     return response.status(status).render('views/404');
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //     if (process.env.NODE_ENV === 'production') {
    //       console.error(error.stack);
    //       return response.status(status).render('views/500');
    //     }
    //     else {
    //       let message = error.stack;
    //       return response.status(status).send(message); 
    //     } 
    // }

    console.log(status)

    if (status == HttpStatus.BAD_REQUEST) {

      console.error("Exception", (<HttpException>exception).getResponse());

      response
      .status(status)
      .json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        errors: (<HttpException>exception).getResponse()['message'],
        message: (<HttpException>exception).getResponse()['message'].join(". ")
      });
    }
    else {
      response
      .status(status)
      .json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: "Error"
      });

    }


  }
}