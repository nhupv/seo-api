import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.query.page || !request.query.perPage) {
      request.query.page = 1;
      request.query.perPage = 10;
    }
    if (!request.query.sortBy) {
      request.query.sortBy = 'createdAt';
    }
    if (!request.query.sortType) {
      request.query.sortType = 'desc';
    }
    const { page, perPage } = request.query;
    request.query.skip = (page - 1) * perPage;
    return next.handle();
  }
}
