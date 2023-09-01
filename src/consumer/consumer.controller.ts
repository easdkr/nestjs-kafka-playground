import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('consumers')
export class ConsumerController {
  constructor(private readonly consumerService: ProducerService) {}

  @Get()
  consume() {
    return this.consumerService.produce();
  }

  @Get('2')
  consume2() {
    return this.consumerService.produce2();
  }
}
