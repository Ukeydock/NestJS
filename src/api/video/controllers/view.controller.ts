import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('View')
@Controller('view')
export class ViewController {
  constructor() {}
}
