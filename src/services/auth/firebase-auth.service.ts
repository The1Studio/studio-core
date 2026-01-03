import { injectable, inject } from 'inversify';
import { TOKENS } from '../../di/tokens';
import type {
  IAuthService,
  Credentials,
  RegisterData,
  AuthResponse,
  User,
} from '../../contracts';

/**
 * Firebase Auth type definitions (minimal interface for DI)
 * Compatible with both Firebase JS SDK and @react-native-firebase/auth
 */
export interface FirebaseAuthInstance {
  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseUserCredential>;
  createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseUserCredential>;
  signOut(): Promise<void>;
  currentUser: FirebaseUser | null;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken(forceRefresh?: boolean): Promise<string>;
}

export interface FirebaseUserCredential {
  user: FirebaseUser;
}

/**
 * Firebase Authentication Service
 *
 * Uses Firebase Auth SDK for authentication. Firebase instance is injected
 * via DI, allowing each client app to configure their own Firebase project.
 *
 * @example
 * // In client app module:
 * import auth from '@react-native-firebase/auth';
 *
 * options.bind(TOKENS.Auth.FirebaseAuth).toConstantValue(auth());
 * options.rebind(TOKENS.Auth.Service).to(FirebaseAuthService).inSingletonScope();
 */
@injectable()
export class FirebaseAuthService implements IAuthService {
  constructor(
    @inject(TOKENS.Auth.FirebaseAuth)
    private readonly firebaseAuth: FirebaseAuthInstance
  ) {}

  async login(credentials: Credentials): Promise<AuthResponse> {
    try {
      const result = await this.firebaseAuth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      return this.mapUserCredentialToResponse(result);
    } catch (error) {
      throw this.mapFirebaseError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const result = await this.firebaseAuth.createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      return this.mapUserCredentialToResponse(result);
    } catch (error) {
      throw this.mapFirebaseError(error);
    }
  }

  async logout(): Promise<void> {
    await this.firebaseAuth.signOut();
  }

  async refreshToken(_token: string): Promise<string> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    return user.getIdToken(true);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.firebaseAuth.currentUser;
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || undefined,
      avatar: firebaseUser.photoURL || undefined,
    };
  }

  private async mapUserCredentialToResponse(
    credential: FirebaseUserCredential
  ): Promise<AuthResponse> {
    const { user } = credential;
    const token = await user.getIdToken();

    return {
      user: {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || undefined,
        avatar: user.photoURL || undefined,
      },
      token,
      refreshToken: token, // Firebase handles refresh internally
    };
  }

  private mapFirebaseError(error: unknown): Error {
    const firebaseError = error as { code?: string; message?: string };
    const code = firebaseError.code || '';

    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email is already registered',
      'auth/weak-password': 'Password is too weak',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
    };

    return new Error(
      errorMessages[code] || firebaseError.message || 'Authentication failed'
    );
  }
}
