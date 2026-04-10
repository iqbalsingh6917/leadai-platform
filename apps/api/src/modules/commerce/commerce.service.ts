import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateProductDto, CreateOrderDto } from './dto/commerce.dto';

@Injectable()
export class CommerceService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  listProducts(tenantId: string) {
    return this.productRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async createProduct(tenantId: string, dto: CreateProductDto): Promise<Product> {
    return this.productRepo.save(this.productRepo.create({ ...dto, tenantId }));
  }

  async getProduct(tenantId: string, id: string): Promise<Product> {
    const p = await this.productRepo.findOne({ where: { tenantId, id } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async updateProduct(tenantId: string, id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    const p = await this.getProduct(tenantId, id);
    Object.assign(p, dto);
    return this.productRepo.save(p);
  }

  async deleteProduct(tenantId: string, id: string): Promise<{ message: string }> {
    await this.getProduct(tenantId, id);
    await this.productRepo.delete({ tenantId, id });
    return { message: 'Product deleted' };
  }

  listOrders(tenantId: string) {
    return this.orderRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async createOrder(tenantId: string, dto: CreateOrderDto): Promise<Order> {
    const subtotal = dto.items.reduce((s, i) => s + i.qty * i.price, 0);
    const tax = dto.tax ?? 0;
    return this.orderRepo.save(
      this.orderRepo.create({ ...dto, tenantId, subtotal, tax, total: subtotal + tax }),
    );
  }

  async updateOrderStatus(tenantId: string, id: string, status: OrderStatus): Promise<Order> {
    const o = await this.orderRepo.findOne({ where: { tenantId, id } });
    if (!o) throw new NotFoundException('Order not found');
    o.status = status;
    return this.orderRepo.save(o);
  }

  async sendCartViaWhatsApp(tenantId: string, id: string): Promise<{ message: string }> {
    const o = await this.orderRepo.findOne({ where: { tenantId, id } });
    if (!o) throw new NotFoundException('Order not found');
    return { message: `Cart sent to ${o.whatsappNumber} via WhatsApp (mock)` };
  }
}
