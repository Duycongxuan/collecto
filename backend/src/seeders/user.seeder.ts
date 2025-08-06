import { User } from "@/entities/users.entity";
import { GENDER, Role } from "@/enums/enum";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import * as bcrypt from 'bcryptjs';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'congxuanduy2004@gmail.com' } 
    });

    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }

    const admin: Partial<User> = {
      name: 'Cong Xuan Duy',
      email: 'congxuanduy2004@gmail.com',
      phoneNumber: '+8484898221', 
      dateOfBirth: new Date('2004-01-27'),
      gender: GENDER.MALE,
      password: await bcrypt.hash('admin123', 12), 
      role: Role.ADMIN
    }

    const savedUser = await userRepository.save(userRepository.create(admin));
    console.log('Admin user created:', savedUser.email);
  }
}