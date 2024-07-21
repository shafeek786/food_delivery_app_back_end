import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  dashbord() {
    return { message: 'welcome' };
  }
}
