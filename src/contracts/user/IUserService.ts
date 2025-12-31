import type { User, CreateUserDto, UpdateUserDto } from './types';

/**
 * User Service Contract
 *
 * CRUD operations for user management with bearer token auth.
 *
 * @example
 * const userService = useService<IUserService>(TOKENS.User.Service);
 * const user = await userService.getProfile();
 */
export interface IUserService {
  /** Get current user profile */
  getProfile(): Promise<User>;

  /** Get user by ID */
  getById(id: string): Promise<User>;

  /** Create new user */
  create(data: CreateUserDto): Promise<User>;

  /** Update user */
  update(id: string, data: UpdateUserDto): Promise<User>;

  /** Delete user */
  delete(id: string): Promise<void>;
}
