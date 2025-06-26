import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentStatusInput } from './dto/update-payment-status.input';
import { FilterPaymentsInput } from './dto/filter-payments.input';
import { RefundPaymentInput } from './dto/refund-payment.input';
import { Payment, PaymentStatus, PaymentProvider } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentInput): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: dto.amount,
        status: PaymentStatus.PENDING,
        provider: dto.provider,
        method: dto.method,
        externalId: dto.externalId,
        currency: dto.currency ?? 'UAH',
      },
    });
  }

  async updateStatus(
    id: string,
    dto: UpdatePaymentStatusInput,
  ): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Платіж не знайдено');
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        paidAt: dto.status === PaymentStatus.PAID ? new Date() : payment.paidAt,
        externalId: dto.externalId ?? payment.externalId,
      },
    });
  }

  async refund(id: string, dto: RefundPaymentInput): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Платіж не знайдено');
    // Тут можеш використати dto.amount або dto.reason якщо треба
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.REFUNDED,
        // reason: dto.reason // якщо додаш поле у модель
      },
    });
  }

  async findAll(query: FilterPaymentsInput) {
    const { orderId, status, provider, page = 1, limit = 20 } = query;
    const where: {
      orderId?: string;
      status?: PaymentStatus;
      provider?: PaymentProvider;
    } = {};
    if (orderId) where.orderId = orderId;
    if (status) where.status = status as PaymentStatus;
    if (provider) where.provider = provider as PaymentProvider;

    const total = await this.prisma.payment.count({ where });
    const items = await this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<Payment> {
    const item = await this.prisma.payment.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Платіж не знайдено');
    return item;
  }

  async findByOrder(orderId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [totalPaid, paidCount, totalRefunded, refundedCount] =
      await Promise.all([
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: PaymentStatus.PAID },
        }),
        this.prisma.payment.count({ where: { status: PaymentStatus.PAID } }),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: PaymentStatus.REFUNDED },
        }),
        this.prisma.payment.count({
          where: { status: PaymentStatus.REFUNDED },
        }),
      ]);
    return {
      totalPaid: totalPaid._sum.amount ?? 0,
      paidCount,
      totalRefunded: totalRefunded._sum.amount ?? 0,
      refundedCount,
    };
  }
}
