import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDto],
  imports: [UtilsModule]
})
export class UserModule {}
