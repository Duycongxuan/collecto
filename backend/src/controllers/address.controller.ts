import { Response, NextFunction } from 'express';
import { ICustomRequest } from '../interfaces/request.interface';
import { AddressService } from "../services/addresses.service";
import { PaginationDto } from '../dto/pagination/pagination.dto';
import { validateDto } from '../utils/validation';
import { logger } from '../config/logger';
import { ResponseUtil } from '../utils/response.util';
import { CreateAddressDto } from '../dto/addresses/create-address.dto';
import { UpdateAddressDto } from '../dto/addresses/update-address.dto';

export class AddressController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  /**
   * Handles the GET request to retrieve a paginated list of the user's addresses.
   * ROUTE: GET /
   */
  getAllAddresses = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paginationDto = await validateDto(PaginationDto, req.query);
      const result = await this.addressService.findAll(req.user?.id!, paginationDto);

      logger.info(`Fetched address list successfully for user: ${req.user?.id}`);
      ResponseUtil.paginated(res, result.items, paginationDto.page!, paginationDto.limit!, result.total, 'Address list retrieved successfully.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the GET request to retrieve a single address by its ID.
   * ROUTE: GET /:id
   */
  getAddressById = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addressId = parseInt(req.params.id);
      const address = await this.addressService.findById(req.user?.id!, addressId);
      
      logger.info(`Fetched address successfully with addressId: ${addressId}`);
      ResponseUtil.success(res, address, 'Address retrieved successfully.', 200);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the POST request to create a new address for the authenticated user.
   * ROUTE: POST /
   */
  createAddress = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createDto = await validateDto(CreateAddressDto, req.body);
      const newAddress = await this.addressService.create(req.user?.id!, createDto);
      
      logger.info(`Created new address successfully with id: ${newAddress.id}`);
      ResponseUtil.success(res, newAddress, 'Address created successfully.', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the PUT/PATCH request to update an existing address.
   * ROUTE: PUT /:id
   */
  updateAddress = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updateDto = await validateDto(UpdateAddressDto, req.body);
      const addressId = parseInt(req.params.id);
      const updatedAddress = await this.addressService.update(req.user?.id!, addressId, updateDto);
      
      logger.info(`Updated address successfully with addressId: ${updatedAddress.id}`);
      ResponseUtil.success(res, updatedAddress, 'Address updated successfully.', 200);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the DELETE request to remove an address.
   * ROUTE: DELETE /:id
   */
  deleteAddress = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addressId = parseInt(req.params.id);
      await this.addressService.delete(req.user?.id!, addressId);
      
      logger.info(`Deleted address with id: ${addressId} successfully.`);
      ResponseUtil.success(res, null, 'Address deleted successfully.', 200);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the request to set an address as the user's default.
   * ROUTE: PATCH /:id/default
   */
  setDefaultAddress = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addressId = parseInt(req.params.id);
      const updatedAddress = await this.addressService.setDefault(req.user?.id!, addressId);
      
      logger.info(`Set default address successfully for addressId: ${addressId}`);
      ResponseUtil.success(res, updatedAddress, 'Default address set successfully.', 200);
    } catch (error) {
      next(error);
    }
  };
}