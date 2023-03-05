import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [UserModule, AuthModule, PrismaClient],
})
export class AppModule {}
