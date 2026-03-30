import { PROTO_PATH } from '@yuuik/contracts';
import type { GrpcOptions } from '@nestjs/microservices';

export const grpcPackages = ['auth.v1'];

export const grpcProtoPaths = [PROTO_PATH.AUTH];

export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
