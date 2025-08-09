import { AppDataSource } from "@/config/database";
import { Product } from "@/entities/products.entity";
import { DifficultyLevel, Scale } from "@/enums/enum";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class ProductSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const productRepository = AppDataSource.getRepository(Product);

    const products: Partial<Product>[] = [
      {
        sku: 'GUNPLA-RX78-2-HG-001',
        name: 'RX-78-2 Gundam (HG 1/144)',
        description: 'Mô hình Gunpla RX-78-2 tỉ lệ 1/144, dòng High Grade.',
        details: 'Bao gồm runner, decal, hướng dẫn lắp ráp.',
        categoryId: 1,
        brandId: 1,
        scale: Scale.BIG,
        difficultyLevel: DifficultyLevel.BEGINNER,
        material: 'Plastic',
        weight: '150 gam',
        dimensions: '13x8x5 cm',
        ageRating: '8+',
        originalPrice: 350000,
        sellingPrice: 299000
      },
      {
        sku: 'GUNPLA-ZGMF-X10A-MG-002',
        name: 'Freedom Gundam (MG 1/100)',
        description: 'Freedom Gundam Master Grade với chi tiết cao.',
        details: 'Có khung xương, cử động linh hoạt.',
        categoryId: 1,
        brandId: 1,
        scale: Scale.BIG,
        difficultyLevel: DifficultyLevel.INTERMEDIATE,
        material: 'Plastic',
        weight: '450 gam',
        dimensions: '18x12x8 cm',
        ageRating: '15+',
        originalPrice: 1200000,
        sellingPrice: 1050000
      },
      {
        sku: 'GUNPLA-MS-06S-RG-003',
        name: 'MS-06S Zaku II Char Custom (RG 1/144)',
        description: 'Phiên bản Real Grade của Char Aznable.',
        details: 'Chi tiết cực cao, decal nước.',
        categoryId: 1,
        brandId: 1,
        scale: Scale.MEDIUM,
        difficultyLevel: DifficultyLevel.ADVANCED,
        material: 'Plastic',
        weight: '200 gam',
        dimensions: '13x9x5 cm',
        ageRating: '15+',
        originalPrice: 950000,
        sellingPrice: 890000
      },
      {
        sku: 'GUNPLA-00R-HG-004',
        name: 'STRIKE FREEDOM GUNDAM MG EX 1/100 BANDAI',
        description: 'Gundam 00 Raiser với GN Sword III.',
        details: 'Lắp ráp đơn giản, chi tiết tốt.',
        categoryId: 1,
        brandId: 1,
        scale: Scale.BIG,
        difficultyLevel: DifficultyLevel.INTERMEDIATE,
        material: 'Plastic',
        weight: '180 gam',
        dimensions: '15x10x5 cm',
        ageRating: '18+',
        originalPrice: 480000,
        sellingPrice: 420000
      },
      {
        sku: 'GUNPLA-ZGMF-X10A-MG-002',
        name: 'Freedom Gundam (MG 1/100)',
        description: 'Freedom Gundam Master Grade với chi tiết cao.',
        details: 'Có khung xương, cử động linh hoạt.',
        categoryId: 1,
        brandId: 1,
        scale: Scale.BIG,
        difficultyLevel: DifficultyLevel.INTERMEDIATE,
        material: 'Plastic',
        weight: '450 gam',
        dimensions: '18x12x8 cm',
        ageRating: '15+',
        originalPrice: 1200000,
        sellingPrice: 1050000
      },
      {
        sku: 'GUNPLA-WINGZERO-MG-005',
        name: 'Wing Gundam Zero EW (MG 1/100)',
        description: 'Phiên bản Endless Waltz, cánh trắng đẹp mắt.',
        details: 'Có thể tạo dáng bay đẹp.',
        categoryId: 2,
        brandId: 1,
        scale: Scale.MEDIUM,
        difficultyLevel: DifficultyLevel.EXPERT,
        material: 'Plastic',
        weight: '400 gam',
        dimensions: '17x12x7 cm',
        ageRating: '15+',
        originalPrice: 1350000,
        sellingPrice: 1250000
      }, 
    ];

    try {
      await productRepository.save(products);
      console.log('Insert product list successfully.');
    } catch (error) {
      console.log(`Failed to insert product list: ${error}`);
    }
  }
}