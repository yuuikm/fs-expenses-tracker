import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Account } from '../../../prisma/generated/client';
import {
  AccountCreateInput,
  AccountUpdateInput,
} from '../../../prisma/generated/models/Account';

@Injectable()
export class AuthRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findByPhone(phone: string): Promise<Account | null> {
    return await this.prismaService.account.findUnique({
      where: {
        phone,
      },
    });
  }

  public async findByEmail(email: string): Promise<Account | null> {
    return await this.prismaService.account.findUnique({
      where: {
        email,
      },
    });
  }

  public async createAccount(data: AccountCreateInput): Promise<Account> {
    return await this.prismaService.account.create({ data });
  }

  public async updateAccount(
    id: string,
    data: AccountUpdateInput,
  ): Promise<Account> {
    return await this.prismaService.account.update({ where: { id }, data });
  }
}
