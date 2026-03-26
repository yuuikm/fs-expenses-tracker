import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaPg({
      user: configService.getOrThrow<string>('POSTGRES_USER'),
      password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
      host: configService.getOrThrow<string>('POSTGRES_HOST'),
      port: configService.getOrThrow<number>('POSTGRES_PORT'),
      database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
    });

    super({ adapter });
  }

  async onModuleInit() {
    const start = Date.now();

    this.logger.log('Connecting to database...');

    await this.$connect();

    const ms = Date.now() - start;

    this.logger.log(`Database connection established: (time=${ms}ms)`);
  }

  async onModuleDestroy() {
    this.logger.log('Disconnected from database...');

    try {
      await this.$disconnect();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.log('Failed to disconnect from database: ', error);
    }
  }
}
