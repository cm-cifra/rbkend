import { Controller, Post, Body, Get, Query, Session } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
async addToCart(
  @Body('productId') productId: number,
  @Body('quantity') quantity: number,
  @Body('userId') userId: number,
  @Session() session: any,
) {
  console.log('Session:', session);  // Log session for debugging

  if (!session) {
    throw new Error('Session is not initialized');
  }

  if (!session.id) {
    session.id = Math.random().toString(36).substring(2);
  }

  return this.cartService.addToCart(productId, quantity, userId, session.id);
}

  @Get()
  async getCart(@Query('userId') userId: number, @Session() session: any) {
    const sessionId = session.id;
    return this.cartService.getCart(userId, sessionId);
  }

  @Post('merge')
  async mergeCart(@Body('userId') userId: number, @Session() session: any) {
    const sessionId = session.id;
    await this.cartService.mergeCarts(sessionId, userId);
  }

  // New endpoint for getting all cart items
  @Get('all')
  async getAllCartItems() {
    return this.cartService.getAllCartItems();
  }
}
