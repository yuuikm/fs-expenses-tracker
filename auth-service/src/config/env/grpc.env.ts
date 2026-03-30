import { registerAs } from '@nestjs/config';
import type { GrpcConfig } from '@/config/interfaces/grpc.interface';
import { validateEnv } from '@/shared/utils';
import { GrpcValidator } from '@/config/validators';

export const grpcEnv = registerAs<GrpcConfig>('grpc', () => {
  validateEnv(process.env, GrpcValidator);

  return {
    host: process.env.GRPC_HOST,
    port: parseInt(process.env.GRPC_PORT),
  };
});
