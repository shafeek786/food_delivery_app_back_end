import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}
  @Get()
  @UseGuards(AuthGuard())
  dashbord() {
    console.log('Test log output');
    return this.dashboardService.dashbord();
  }
}
