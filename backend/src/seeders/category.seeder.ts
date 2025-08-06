import { Category } from "@/entities/categories.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Category);

    const categories: Partial<Category>[] = [
      {
        name: 'Mô hình Gunpla',
        description: 'Gunpla là tên gọi chung cho các mô hình Gundam do Bandai sản xuất. Gunpla là loại mô hình Gundam phổ biến nhất và được bán trên toàn thế giới. Gunpla có nhiều kích thước và mức độ chi tiết khác nhau, từ mô hình SD (Super Deformed) nhỏ gọn đến mô hình MG (Master Grade) chi tiết cao.'
      },
      {
        name: 'Mô hình Resin',
        description: 'Mô hình Resin là loại mô hình Gundam được làm từ nhựa Resin. Mô hình Resin thường được làm thủ công và có độ chi tiết cao hơn mô hình Gunpla.'
      },
      {
        name: 'Mô hình Metal Build',
        description: 'Mô hình Metal Build là loại mô hình Gundam được làm từ kim loại. Mô hình Metal Build thường có khả năng cử động và có độ chi tiết cao.'
      },
      {
        name: 'Mô hình Figma',
        description: 'Mô hình Figma là loại mô hình Gundam có thể cử động. Mô hình Figma có nhiều khớp nối linh hoạt, cho phép tạo dáng mô hình theo nhiều tư thế khác nhau.'
      },
      {
        name: 'Mô hình Statue',
        description: 'Mô hình Statue là loại mô hình Gundam có kích thước lớn. Mô hình Statue thường được làm từ nhựa Resin hoặc Fiberglass và được trưng bày như tác phẩm nghệ thuật.'
      }
    ];

    for(const category of categories) {
      await repository.save(repository.create(category));
    }
  }
}