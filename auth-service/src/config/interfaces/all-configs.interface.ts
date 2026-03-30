import type { GrpcConfig } from '@/config/interfaces/grpc.interface';
import type { DatabaseConfig } from '@/config/interfaces/database.interface';
import type { RedisConfig } from '@/config/interfaces/redis.interface';

export interface AllConfig {
  database: DatabaseConfig;
  grpc: GrpcConfig;
  redis: RedisConfig;
}
