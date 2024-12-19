import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { CategoriesEntity, CollectionsEntity, ProductsEntity, UserCartsEntity, UsersEntity } from 'src/entities';

@Injectable()
export class UserCartsService {
    constructor(
        @InjectRepository(UserCartsEntity)
        private readonly i_repository: Repository<UserCartsEntity>,
        private dataSource: DataSource
    ) { }

    async getAll(page : number, limit : number){

        var start_from = (page-1) * limit;

        const query = this.i_repository.createQueryBuilder('user_carts');

        query.leftJoinAndMapOne('user_carts.category_id',CategoriesEntity,'category','user_carts.category_id = category.id')
        .leftJoinAndMapOne('user_carts.collection_id',CollectionsEntity,'collection','user_carts.collection_id = collection.id')
      

        const results = await query
        .orderBy('user_carts.datetime_added', 'DESC')
        .skip(start_from)
        .take(limit) 
        .getManyAndCount();

        return results;
        
    }

    async getCount(){

        const total_cnt = await this.i_repository.createQueryBuilder("user_carts")
        .select("COUNT(user_carts.id)", "cnt")
        .getRawOne();
    
        return {
          total_cnt : total_cnt.cnt,
        };
    }

    async getAllByPage(page: number, limit : number){

        var start_from = (page-1) * limit;

        return await this.i_repository.createQueryBuilder("user_carts")
        .orderBy('user_carts.description', 'ASC')
        .skip(start_from)
        .take(limit) 
        .getMany();
    }

    async findItem(id : number){

        return await this.i_repository.createQueryBuilder("user_carts")
        .leftJoinAndMapOne('user_carts.category_id',CategoriesEntity,'category','user_carts.category_id = category.id')
        .leftJoinAndMapOne('user_carts.collection_id',CollectionsEntity,'collection','user_carts.collection_id = collection.id')
        .where("user_carts.id = :id", {id : id})
        .getOne();
    }

    async addItem(user: UserCartsEntity) : Promise<UserCartsEntity>{
        return await this.i_repository.save(user);
    }

    async editItemId(id: number, data: any) { 
        return await this.i_repository.update(id, {
          quantity: data.quantity,  
          status: data.status, 
        });
      }
      async editItem(data:any){}

      async deleteItem(data:any){

        return await this.i_repository.delete(data.id);
  
        }


        async searchName(name : string){

            return await this.i_repository.createQueryBuilder("user_carts")
            .where("user_carts.description LIKE :name", {name : `%${name}%`})
            .getMany();
        }

        async findByType(user_id : number, type : number, page : number, limit : number){

            var start_from = (page-1) * limit;

            const query = this.i_repository.createQueryBuilder('user_carts');
    
            query.leftJoinAndMapOne('user_carts.user_id',UsersEntity,'user','user_carts.user_id = user.id')
            query.leftJoinAndMapOne('user_carts.product_id',ProductsEntity,'product','user_carts.product_id = product.id')
            .where("user_carts.type = :type AND user_carts.user_id = :user_id", {type : type, user_id : user_id})
          
    
            const results = await query
            .orderBy('user_carts.datetime_added', 'DESC')
            .skip(start_from)
            .take(limit) 
            .getManyAndCount();
    
            return results;

        }
        
        async findByUser(user_id: number, type: number, status: number, product_id: number) {
            const query = this.i_repository.createQueryBuilder('user_carts');
          
            query
              .leftJoinAndMapOne('user_carts.user_id', UsersEntity, 'user', 'user_carts.user_id = user.id')
              .leftJoinAndMapOne('user_carts.product_id', ProductsEntity, 'product', 'user_carts.product_id = product.id')
              .where("user_carts.type = :type AND user_carts.user_id = :user_id  AND user_carts.status = :status AND user_carts.product_id = :product_id ", {type : type, user_id : user_id, status : status ,product_id:product_id})
            
              .orderBy('user_carts.datetime_added', 'DESC');
          
            const result = await query.getOne();
          
            return result || null;  
          }
          



}
