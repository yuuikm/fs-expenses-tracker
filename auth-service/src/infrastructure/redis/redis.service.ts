import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

  public constructor(private readonly configService: ConfigService) {
    const redisUrl = configService.get<string>('REDIS_URL');
    const redisHost = configService.getOrThrow<string>('REDIS_HOST');
    const redisPort = configService.get<number>('REDIS_PORT') ?? 6379;
    const redisUser = configService.get<string>('REDIS_USER')?.trim();
    const redisPassword = configService.get<string>('REDIS_PASSWORD')?.trim();
    const normalizedRedisUser =
      redisUser && redisUser !== 'root' ? redisUser : undefined;

    if (redisUrl) {
      super(redisUrl, {
        maxRetriesPerRequest: 5,
        enableOfflineQueue: true,
      });
      return;
    }

    super({
      host: redisHost,
      port: redisPort,
      username: normalizedRedisUser,
      password: redisPassword || undefined,
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,
    });
  }

  public onModuleInit() {
    const start = Date.now();

    this.logger.log('Initializing Redis connection');

    this.on('connect', () => {
      this.logger.log('Redis connecting');
    });

    this.on('ready', () => {
      const ms = Date.now() - start;
      this.logger.log(`Redis connection started: (time=${ms}ms)`);
    });

    this.on('error', (error) => {
      this.logger.error('Redis error', {
        error: error.message ?? error,
      });
    });

    this.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.on('reconnecting', () => {
      this.logger.log('Redis reconnecting');
    });
  }

  public async onModuleDestroy() {
    this.logger.log('Closing redis connection...');

    try {
      await this.quit();

      this.logger.log('Redis connection closed');
    } catch (error) {
      this.logger.error('Error closing Redis connection: ', error);
    }
  }
}
