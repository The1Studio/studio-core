import { injectable, inject } from 'inversify';
import type { AxiosInstance } from 'axios';
import { TOKENS } from '../../di/tokens';
import type { IUserService } from '../../contracts/user/IUserService';
import type { User, CreateUserDto, UpdateUserDto } from '../../contracts/user/types';

/**
 * User service - CRUD operations
 *
 * Uses AxiosInstance (apiClient) for API calls.
 */
@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TOKENS.Http.Client) private http: AxiosInstance
  ) {}

  async getProfile(): Promise<User> {
    const response = await this.http.get<User>('/users/me');
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await this.http.get<User>(`/users/${id}`);
    return response.data;
  }

  async create(data: CreateUserDto): Promise<User> {
    const response = await this.http.post<User>('/users', data);
    return response.data;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await this.http.patch<User>(`/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`/users/${id}`);
  }
}
