import { Module } from '@nestjs/common';
import { VisionApiService } from '../services/vision-api.service';

@Module({
  providers: [VisionApiService],
  exports: [VisionApiService],
})
export class VisionApiModule {}
