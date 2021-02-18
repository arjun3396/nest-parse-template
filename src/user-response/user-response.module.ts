import { Module } from '@nestjs/common';
import { UserResponseService } from './user-response.service';
import { UserResponseDto } from './dto/user-response.dto';

@Module({
  providers: [UserResponseService, UserResponseDto]
})
export class UserResponseModule {}
