import { Controller, Post } from '@nestjs/common';

@Controller('dogs')
export class DogsController {
    @Post('route1')
    create() {
        return 'New dog';
    }
}
