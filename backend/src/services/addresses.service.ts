import { CreateAddressDto } from "../dto/addresses/create-address.dto";
import { UpdateAddressDto } from '../dto/addresses/update-address.dto'; // It's good practice to have a specific DTO for updates
import { PaginationDto } from "../dto/pagination/pagination.dto";
import { Addresses } from "../entities/addresses.entity";
import { AddressRepository } from "../repositories/addresses.repository";
import { AppError } from "../utils/app-error";

/**
 * Contains the business logic for managing user addresses.
 * It ensures users can only access their own addresses and handles application-specific rules.
 */
export class AddressService {
  private addressRepository: AddressRepository;
  constructor() {
    this.addressRepository = new AddressRepository();
  }

  /**
     * A private helper method to centralize the logic for verifying address ownership.
     * @param userId The ID of the user.
     * @param addressId The ID of the address to check.
     * @returns The address entity if ownership is verified.
     * @throws {AppError} 403 if the user does not own the address.
     */
    private async verifyUserOwnsAddress(userId: number, addressId: number): Promise<Addresses> {
      const address = await this.addressRepository.findById(addressId);
      if (address.userId !== userId) {
        throw new AppError('Forbidden: You do not have permission to perform this action.', 403);
      }
      return address;
    }

  /**
   * Retrieves a single address, ensuring the user has permission to view it.
   * @param userId The ID of the user requesting the address.
   * @param addressId The ID of the address to retrieve.
   * @returns The address entity.
   */
  public async findById(userId: number, addressId: number): Promise<Addresses> {
    const address = await this.addressRepository.findById(addressId);

    // Security check: Verify the user owns this address.
    await this.verifyUserOwnsAddress(userId, addressId);
    
    return address;
  }

  /**
   * Retrieves a paginated list of all addresses for the authenticated user.
   * @param userId The ID of the user.
   * @param paginationDto Pagination options.
   * @returns An object with a list of addresses and the total count.
   */
  public async findAll(userId: number, paginationDto?: PaginationDto): Promise<{ items: Addresses[], total: number }> {
    return await this.addressRepository.findAllByUserId(userId, paginationDto);
  }

  /**
   * Creates a new address for the user.
   * If this is the user's first address, it automatically becomes the default.
   * @param userId The ID of the user creating the address.
   * @param createDto The data for the new address.
   * @returns The newly created address.
   */
  public async create(userId: number, createDto: CreateAddressDto): Promise<Addresses> {
    const { items: existingAddresses, total } = await this.findAll(userId);
    
    // Construct the new address data, including the userId.
    const newAddressData: Partial<Addresses> = {
      ...createDto,
      userId: userId,
      // Business Rule: The first address created is automatically the default.
      isDefault: total === 0,
    };

    return await this.addressRepository.create(newAddressData);
  }

  /**
   * Updates an existing address after verifying ownership.
   * @param userId The ID of the user updating the address.
   * @param addressId The ID of the address to update.
   * @param updateDto The new data for the address.
   * @returns The updated address.
   */
  public async update(userId: number, addressId: number, updateDto: Partial<Addresses>): Promise<Addresses> {
    // This helper function handles both finding the address and checking ownership.
    await this.verifyUserOwnsAddress(userId, addressId);

    // It's not allowed to change the `isDefault` status through this method. Use setDefault().
    if(typeof updateDto.isDefault !== 'undefined') {
        throw new AppError('Cannot change default status via update. Please use the dedicated endpoint.', 400);
    }
    
    return await this.addressRepository.update(addressId, updateDto);
  }

  /**
   * Deletes an address after verifying ownership and business rules.
   * @param userId The ID of the user deleting the address.
   * @param addressId The ID of the address to delete.
   */
  public async delete(userId: number, addressId: number): Promise<void> {
    const addressToDelete = await this.verifyUserOwnsAddress(userId, addressId);

    // Business Rule: A user cannot delete their default address.
    if (addressToDelete.isDefault) {
      throw new AppError('Cannot delete a default address. Please set another address as default first.', 400);
    }
    
    await this.addressRepository.softDelete(addressId);
  }

  /**
   * Sets a specific address as the user's default.
   * @param userId The ID of the user performing the action.
   * @param addressId The ID of the address to set as default.
   * @returns The address that was set as default.
   */
  public async setDefault(userId: number, addressId: number): Promise<Addresses> {
    // The repository method already contains a security check, but it's good practice
    // to have the check here as well. The repository's check is a failsafe.
    await this.verifyUserOwnsAddress(userId, addressId);

    return await this.addressRepository.setDefault(userId, addressId);
  }
}