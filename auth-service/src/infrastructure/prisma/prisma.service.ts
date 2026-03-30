import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import type { AllConfigs } from '@/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService<AllConfigs>) {
    const adapter = new PrismaPg({
      user: configService.get('database.user', { infer: true }),
      password: configService.get('database.password', { infer: true }),
      host: configService.get('database.host', { infer: true }),
      port: configService.get('database.port', { infer: true }),
      database: configService.get('database.name', { infer: true }),
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
