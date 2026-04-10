import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { CommerceService } from './commerce.service';
import { CreateProductDto, CreateOrderDto, UpdateOrderStatusDto } from './dto/commerce.dto';

@ApiTags('commerce')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('commerce')
export class CommerceController {
  constructor(private readonly service: CommerceService) {}

  @Get('products')
  listProducts(@GetTenant() tenantId: string) {
    return this.service.listProducts(tenantId);
  }

  @Post('products')
  createProduct(@Body() dto: CreateProductDto, @GetTenant() tenantId: string) {
    return this.service.createProduct(tenantId, dto);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.getProduct(tenantId, id);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>, @GetTenant() tenantId: string) {
    return this.service.updateProduct(tenantId, id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.deleteProduct(tenantId, id);
  }

  @Get('orders')
  listOrders(@GetTenant() tenantId: string) {
    return this.service.listOrders(tenantId);
  }

  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto, @GetTenant() tenantId: string) {
    return this.service.createOrder(tenantId, dto);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto, @GetTenant() tenantId: string) {
    return this.service.updateOrderStatus(tenantId, id, dto.status);
  }

  @Post('orders/:id/send-whatsapp')
  sendWhatsApp(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.sendCartViaWhatsApp(tenantId, id);
  }
}
