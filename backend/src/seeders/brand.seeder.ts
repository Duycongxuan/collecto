import { Brand } from "@/entities/brands.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class BrandSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Brand);

    const brands: Partial<Brand>[] = [
      {
        name: 'Bandai Namco',
        description: 'Chủ sở hữu thương hiệu Gundam và nhà sản xuất duy nhất được cấp phép làm mô hình Gunpla. Uy tín, chất lượng cao, nhựa tốt, độ chính xác cao. Sản xuất đa dạng dòng sản phẩm theo nhiều cấp độ (HG, MG, RG...).',
        logoUrl: 'https://tse2.mm.bing.net/th/id/OIP.L4IVBeXQ1Fb0lmL1RUSrkAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        website: 'https://toy.bandai.co.jp/',
        country: 'Japan'
      },
      {
        name: 'Metal Build',
        description: 'Mô hình làm bằng kim loại và nhựa cao cấp, không cần lắp ráp, sơn sẵn, rất chi tiết, giá cao.',
        website: 'https://tamashiiweb.com/item_brand/metal_build/',
        country: 'China'
      },
      {
        name: 'Robot Spirits (Damashii)',
        description: 'Mô hình nhựa có khớp, đã lắp sẵn, nhỏ gọn, chơi được ngay.',
        website: 'https://tamashiiweb.com/item_brand/robot_tamashii/?wovn=en',
        country: 'China'
      }, 
      {
        name: 'Metal Robot Spirits', 
        description: 'Kết hợp giữa Robot Spirits và Metal Build - nhỏ nhưng có kim loại, rất chắc và đẹp.',
        website: 'https://tamashiiweb.com/item_brand/robot_tamashii/?wovn=en',
        country: 'china'
      }
    ];

    try {
      for(const brand of brands) {
        await repository.save(repository.create(brand));
      }
    } catch (error) {
      console.log('Failed to create brands.')
    }
  }
}