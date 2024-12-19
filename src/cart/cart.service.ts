import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async addToCart(productId: number, quantity: number, userId: number, sessionId: string) {
    const existingCartItem = await this.cartRepository.findOne({
      where: [
        { productId, userId: userId || null },
        { productId, sessionId: sessionId || null },
      ],
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      return this.cartRepository.save(existingCartItem);
    }

    const cartItem = this.cartRepository.create({
      productId,
      quantity,
      userId: userId || null,
      sessionId: sessionId || null,
    });

    return this.cartRepository.save(cartItem);
  }

  async getCart(userId: number, sessionId: string) {
    return this.cartRepository.find({
      where: userId ? { userId } : { sessionId },
    });
  }

  async mergeCarts(sessionId: string, userId: number) {
    const sessionCart = await this.getCart(null, sessionId);

    for (const item of sessionCart) {
      await this.addToCart(item.productId, item.quantity, userId, null);
      await this.cartRepository.remove(item);
    }
  }

  // New method for retrieving all cart items
  async getAllCartItems() {
    return this.cartRepository.find();
  }
}
