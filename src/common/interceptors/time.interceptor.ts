import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before');
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Request took ${Date.now() - now}ms`)));

    // map((value) => {
    //   value.timestamp = new Date();
    //   return console.log(value);
    // }),
  }
}
