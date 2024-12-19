import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from "@nestjs/common";
import { ProductKitsService } from "./product_kits.service";
import { ProductKitsEntity } from "./product_kits.entity";

@Controller('product_kits')
export class ProductKitsController {

    constructor(private i_service: ProductKitsService) {

    }

    @Get("get_all")
    async getAll() {
        const response = await this.i_service.getAll();
        return response;
    }

    @Get("get_count")
    async getCount() {
        const response = await this.i_service.getCount();
        return response;
    }

    @Get("find/:id")
    async findItem(@Param('id') id: number) {
        const response = await this.i_service.findItem(id);
        return response;
    }

    @Post('add')
    async addItem(@Body() createUserOto: ProductKitsEntity){
        const response = await this.i_service.addItem(createUserOto);
        return response;
    }

    @Post("edit")
    async editItem(@Body() data:any) {
        const response = await this.i_service.editItem(data);
        return response;
    }

    @Post("delete")
    async deleteItem(@Body() data:any) {
        const response = await this.i_service.deleteItem(data);
        return response;
    }

    @Get("search/:name")
    async searchName(@Param('name') name: string) {
        const response = await this.i_service.searchName(name);
        return response;
    }

    
    @Get("find_by_product/:id")
    async findItemByProduct(@Param('id') id: number) {
        const response = await this.i_service.findItemByProduct(id);
        return response;
    }

    @Get("find_by_kit/:id")
    async findItemByKit(@Param('id') id: number) {
        const response = await this.i_service.findItemByKit(id);
        return response;
    }



}
