import { AppError } from '../utils/app-error';
import { AppDataSource } from '../config/database';
import { Addresses } from '../entities/addresses.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginationDto } from '../dto/pagination/pagination.dto';

/**
 * Manages all database queries for the `Addresses` entity.
 */
export class AddressRepository {
  private repository: Repository<Addresses>;
  constructor() {
    this.repository = AppDataSource.getRepository(Addresses);
  }

  /**
   * Finds a single address by its ID.
   * @param addressId The unique identifier of the address.
   * @returns A promise that resolves to the Address entity.
   * @throws {AppError} 404 if not found.
   */
  public async findById(addressId: number): Promise<Addresses> {
    const address = await this.repository.findOne({ where: { id: addressId } });
    if (!address) {
      throw new AppError(`Address with ID ${addressId} not found.`, 404);
    }
    return address;
  }

  /**
   * Finds all addresses for a user (paginated).
   * @param userId The ID of the user whose addresses to retrieve.
   * @param paginationDto An object containing `page` and `limit` for pagination.
   * @returns An object with a list of items and the total count.
   */
  public async findAllByUserId(userId: number, paginationDto?: PaginationDto): Promise<{ items: Addresses[], total: number }> {
    const { page = 1, limit = 5 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions<Addresses> = {
      where: { userId: userId },
      order: { isDefault: 'DESC', createdAt: 'DESC'}, // Show default address first
      skip,
      take: limit,
    };

    const [items, total] = await this.repository.findAndCount(findOptions);
    return { items, total };
  }

  /**
   * Creates a new address.
   * @param addressData An object containing the data for the new address.
   * @returns The newly created address entity.
   */
  public async create(addressData: Partial<Addresses>): Promise<Addresses> {
    const newAddress = this.repository.create(addressData);
    return await this.repository.save(newAddress);
  }

  /**
   * Updates an existing address.
   * @param addressId The ID of the address to update.
   * @param updateData An object with the new data for the address.
   * @returns The updated address entity.
   */
  public async update(addressId: number, updateData: Partial<Addresses>): Promise<Addresses> {
    const addressToUpdate = await this.findById(addressId);
    Object.assign(addressToUpdate, updateData);
    return await this.repository.save(addressToUpdate);
  }

  /**
   * Soft-deletes an address by its ID.
   * @param addressId The ID of the address to soft-delete.
   * @throws {AppError} 404 if the address is not found.
   */
  public async softDelete(addressId: number): Promise<void> {
    const result = await this.repository.softDelete(addressId);
    if (result.affected === 0) {
      throw new AppError('Address to delete not found.', 404);
    }
  }

  /**
   * Sets an address as the user's default in an atomic transaction.
   * @param userId The ID of the user performing the action.
   * @param addressIdToSet The ID of the address to be set as the new default.
   * @returns The address that was successfully set as default.
   */
  public async setDefault(userId: number, addressIdToSet: number): Promise<Addresses> {
    const newDefaultAddress = await this.findById(addressIdToSet);

    if (newDefaultAddress.userId !== userId) {
      throw new AppError('You do not have permission to modify this address.', 403);
    }
    if (newDefaultAddress.isDefault) {
      throw new AppError('This address is already the default.', 400);
    }

    // Use a transaction to guarantee data integrity.
    await this.repository.manager.transaction(async (transactionalEntityManager) => {
      // Step 1: Unset the current default for this user.
      await transactionalEntityManager.update(
        Addresses,
        { userId: userId, isDefault: true },
        { isDefault: false }
      );
      
      // Step 2: Set the new address as the default.
      await transactionalEntityManager.update(Addresses, addressIdToSet, { isDefault: true });
    });
   
    // Return the updated entity to confirm the change.
    return await this.findById(addressIdToSet);
  } 
}