import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
    @Get('route1')
    findAll() {
        return 'All cats';
    }
}
