import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URI!,
    });

    const adapter = new PrismaPg(pool);

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

    await this.$disconnect();

    this.logger.log('Database connection closed');
  }
}
