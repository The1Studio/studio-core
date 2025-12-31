/**
 * User domain types
 */

// Re-export User from auth domain
export type { User } from '../auth/types';

export interface CreateUserDto {
  email: string;
  name?: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
}
