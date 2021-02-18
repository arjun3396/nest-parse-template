import { Module } from '@nestjs/common';
import { UserResponseService } from './user-response.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [UserResponseService, UserResponseDto],
  imports: [
    UtilsModule
  ]
})
export class UserResponseModule {}
