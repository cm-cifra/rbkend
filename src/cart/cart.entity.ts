import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
 

@Entity({ name: "cart"})
export class Cart  {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productId: number

  @Column()
  quantity: number

  @Column()
  userId: number

  @Column({ nullable: true })
  sessionId: string
}
 