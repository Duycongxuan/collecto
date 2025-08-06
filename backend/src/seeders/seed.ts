import { AppDataSource } from "@/config/database"
import { createDatabase, runSeeders } from "typeorm-extension"
import UserSeeder from "./user.seeder"
import CategorySeeder from "./category.seeder";
import BrandSeeder from "./brand.seeder";

(async () => {
  try {
    // Pass the AppDataSource options explicitly to createDatabase
    await createDatabase({ 
      options: AppDataSource.options,
      ifNotExist: true 
    });
    
    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Run the seeders
    await runSeeders(AppDataSource, { seeds: [UserSeeder, CategorySeeder, BrandSeeder] });
    
    console.log("Seeding completed successfully!");
    
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
})()