import { AppDataSource } from "@/config/database";
import { ProductImage } from "@/entities/productImage";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class ProductImageSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = AppDataSource.getRepository(ProductImage);

    const images: Partial<ProductImage>[] = [
      {
        productId: 1,
        imageUrl: 'https://product.hstatic.net/200000326537/product/193_3736_s_q7cm4u9qxeji25338fuub95h51je_dd0290b54d35422aa0a5c45bd819a06c_master.jpg',
        sortOrder: 1,
        isPrimary: true
      },
      {
        productId: 1,
        imageUrl: 'https://product.hstatic.net/200000326537/product/153_3736_s_wvynd76m3nl4k258mm7p6mhxag6j_e99305d1d8c84886acf8de46cfa7448e_master.jpg',
        sortOrder: 2,
      },
      {
        productId: 1,
        imageUrl: 'https://product.hstatic.net/200000326537/product/155_3736_s_v00qvf0adt3znulb7v58xdvmml2i_fa1a6e4cb86a4c838b058f7a74f8f5dc_master.jpg',
        sortOrder: 3,
      },
      {
        productId: 1,
        imageUrl: 'https://product.hstatic.net/200000326537/product/156_3736_s_0jcfl0hwae8o6d72sq21ouxxukgl_265222920121449e8cc3a5d068507aae_master.jpg',
        sortOrder: 4,
      },
      {
        productId: 2,
        imageUrl: 'https://static.wikia.nocookie.net/gunplabuilders/images/7/78/MG-Freedom-Gundam-%282.0%29-boxart.jpg/revision/latest/scale-to-width-down/1000?cb=20171109062730',
        sortOrder: 1,
        isPrimary: true
      },
      {
        productId: 2,
        imageUrl: 'https://static.wikia.nocookie.net/gunplabuilders/images/5/50/MG-Freedom-Gundam-%282.0%29-1.jpg/revision/latest?cb=20171109060519',
        sortOrder: 2,
      },
      {
        productId: 2,
        imageUrl: 'https://static.wikia.nocookie.net/gunplabuilders/images/5/52/MG-Freedom-Gundam-%282.0%29-2.jpg/revision/latest?cb=20171109060520',
        sortOrder: 3,
      },
      {
        productId: 2,
        imageUrl: 'https://static.wikia.nocookie.net/gunplabuilders/images/c/cd/MG-Freedom-Gundam-%282.0%29-3.jpg/revision/latest?cb=20171109060520',
        sortOrder: 4,
      },
      {
        productId: 3,
        imageUrl: 'https://m.media-amazon.com/images/I/61goOj9QNaL._AC_SL1200_.jpg',
        sortOrder: 1,
        isPrimary: true
      },
      {
        productId: 3,
        imageUrl: 'https://m.media-amazon.com/images/I/61+BJ2Gg+YL._AC_SL1500_.jpg',
        sortOrder: 2,
      },
      {
        productId: 3,
        imageUrl: 'https://m.media-amazon.com/images/I/7179PtWagsL._AC_SL1500_.jpg',
        sortOrder: 3,
      },
      {
        productId: 3,
        imageUrl: 'https://m.media-amazon.com/images/I/71uGsiJymBL._AC_SL1500_.jpg',
        sortOrder: 4,
      },
      {
        productId: 4,
        imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/451/227/products/10896999b3-1698978626917.jpg?v=1698978640953',
        sortOrder: 1,
        isPrimary: true
      },
      {
        productId: 4,
        imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/451/227/products/10896999b4-1698978627492.jpg?v=1698978641463',
        sortOrder: 2,
      },
      {
        productId: 5,
        imageUrl: 'https://product.hstatic.net/200000326537/product/frame_1__3__c97c7136068b471a9fafb854af000338_master.png',
        sortOrder: 1,
        isPrimary: true
      },
      {
        productId: 5,
        imageUrl: 'https://product.hstatic.net/200000326537/product/10371551a7_3e010e962a924d2ca7ea324793688c2d_master.jpg',
        sortOrder: 2,
      },
      {
        productId: 5,
        imageUrl: 'https://product.hstatic.net/200000326537/product/10371551a8_f8bced0872904c2eb9af31623cf6a39a_master.jpg',
        sortOrder: 3,
      },
      {
        productId: 5,
        imageUrl: 'https://product.hstatic.net/200000326537/product/10371551a9_0d52dd2a601a4bb7a90b1c0782353365_master.jpg',
        sortOrder: 4,
      },
      
    ];

    try {
      await repository.save(images);
      console.log(`Insert product image list successfully.`);
    } catch (error) {
      console.log(`Failed to insert product list: ${error}`);
    }
  }
}