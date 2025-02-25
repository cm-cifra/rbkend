import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { ProductKitsEntity } from './product_kits.entity';
import { ProductsEntity } from 'src/entities';

@Injectable()
export class ProductKitsService {
    constructor(
        @InjectRepository(ProductKitsEntity)
        private readonly i_repository: Repository<ProductKitsEntity>,
        private dataSource: DataSource
    ) { }

    async getAll(){

        return await this.i_repository.createQueryBuilder("product_kits")
        .orderBy('product_kits.description', 'ASC')
        .getMany();
    }

    async getCount(){

        const total_cnt = await this.i_repository.createQueryBuilder("product_kits")
        .select("COUNT(product_kits.id)", "cnt")
        .getRawOne();
    
        return {
          total_cnt : total_cnt.cnt,
        };
    }

    async getAllByPage(page: number, limit : number){

        var start_from = (page-1) * limit;

        return await this.i_repository.createQueryBuilder("product_kits")
        .orderBy('product_kits.description', 'ASC')
        .skip(start_from)
        .take(limit) 
        .getMany();
    }

    async findItem(id : number){

        return await this.i_repository.createQueryBuilder("product_kits")
        .where("product_kits.id = :id", {id : id})
        .getOne();
    }

    async addItem(user: ProductKitsEntity) : Promise<ProductKitsEntity>{
        return await this.i_repository.save(user);
    }

    async editItem(data:any){

        // return await this.i_repository.update(data.id, { 
        //     color: data.color,
        //     surface: data.surface,
        //     material : data.material,
        //     spout : data.spout,
        //     height : data.height,
        //     spout_height: data.spout_height,
        //     spout_length : data.spout_length,
        //     installation : data.installation,
        //     control : data.control,
        //     eyeliner_type : data.eyeliner_type,
        //     eyeliner_standard : data.eyeliner_standard,
        //     control_mechanism : data.control_mechanism,
        //     suitable_for_bowl_sink : data.suitable_for_bowl_sink,
        //     consumption_saving : data.consumption_saving,
        //     product_weight : data.product_weight,
        //     package_weight : data.package_weight,
        //     guarantee : data.guarantee,
        //     scheme : data.scheme,
        //     datetime_modified : data.datetime_modified,
        //   });

      }

      async deleteItem(data:any){

        return await this.i_repository.delete(data.id);
  
        }


        async searchName(name : string){

            // return await this.i_repository.createQueryBuilder("product_kits")
            // .where("product_kits.description LIKE :name", {name : `%${name}%`})
            // .getMany();
        }

        async findItemByProduct(id : number){

            return await this.i_repository.createQueryBuilder("product_kits")
            .where("product_kits.product_id = :id", {id : id})
            .getOne();
        }

        async findItemByKit(id : number){

            return await this.i_repository.createQueryBuilder("product_kits")
            .leftJoinAndMapOne('product_kits.kit_id',ProductsEntity,'kit','product_kits.kit_id = kit.id')
            .leftJoinAndMapOne('product_kits.product_id',ProductsEntity,'product','product_kits.product_id = product.id')
            .where("product_kits.kit_id = :id", {id : id})
            .getMany();
        }
    

    // async assignUserRole(user: UserrolesEntity) : Promise<UserTypesEntity>{
    //     return await this.i_repository.save(user);
    // }

    // async activateUserRole(activateData:any){

    //   return await this.i_repository.update(activateData.id, { 
    //     status: activateData.status 
    //   });

    //   }

}
