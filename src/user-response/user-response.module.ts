import { Module } from '@nestjs/common';
import { UserResponseService } from './user-response.service';

@Module({
  providers: [UserResponseService]
})
export class UserResponseModule {}
