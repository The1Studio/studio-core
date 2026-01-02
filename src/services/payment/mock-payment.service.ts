import { injectable } from 'inversify';
import type {
  IPaymentService,
  PaymentMethod,
  PaymentIntent,
  PaymentResult,
  CreatePaymentParams,
} from '../../contracts';

/**
 * Mock Payment Service for development/testing
 *
 * Simulates payment processing with configurable delays and success rates.
 * Replace with real implementation (StripePaymentService, etc.) in production.
 *
 * @example
 * const payment = useService<IPaymentService>(TOKENS.Payment.Service);
 * const intent = await payment.createPaymentIntent({ amount: 1000, currency: 'USD' });
 * const result = await payment.confirmPayment(intent.id);
 */
@injectable()
export class MockPaymentService implements IPaymentService {
  private paymentMethods: PaymentMethod[] = [
    { id: 'pm_mock_visa', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: 'pm_mock_mc', type: 'card', last4: '5555', brand: 'Mastercard', isDefault: false },
  ];

  private pendingIntents: Map<string, PaymentIntent> = new Map();

  // Simulate network delay (ms)
  private delay = 800;

  private async simulateDelay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent> {
    await this.simulateDelay();

    console.log('[MockPayment] Creating payment intent:', params);

    const intent: PaymentIntent = {
      id: this.generateId('pi'),
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      clientSecret: this.generateId('secret'),
    };

    this.pendingIntents.set(intent.id, intent);

    return intent;
  }

  async confirmPayment(intentId: string): Promise<PaymentResult> {
    await this.simulateDelay();

    console.log('[MockPayment] Confirming payment:', intentId);

    const intent = this.pendingIntents.get(intentId);

    if (!intent) {
      return {
        success: false,
        error: 'Payment intent not found',
      };
    }

    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      intent.status = 'succeeded';
      this.pendingIntents.delete(intentId);

      return {
        success: true,
        transactionId: this.generateId('txn'),
      };
    }

    intent.status = 'failed';
    return {
      success: false,
      error: 'Payment declined. Please try again.',
    };
  }

  async cancelPayment(intentId: string): Promise<void> {
    await this.simulateDelay();

    console.log('[MockPayment] Cancelling payment:', intentId);

    const intent = this.pendingIntents.get(intentId);
    if (intent) {
      intent.status = 'cancelled';
      this.pendingIntents.delete(intentId);
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await this.simulateDelay();

    console.log('[MockPayment] Getting payment methods');

    return [...this.paymentMethods];
  }

  async addPaymentMethod(token: string): Promise<PaymentMethod> {
    await this.simulateDelay();

    console.log('[MockPayment] Adding payment method:', token);

    const newMethod: PaymentMethod = {
      id: this.generateId('pm'),
      type: 'card',
      last4: token.slice(-4) || '0000',
      brand: 'Unknown',
      isDefault: this.paymentMethods.length === 0,
    };

    this.paymentMethods.push(newMethod);

    return newMethod;
  }

  async removePaymentMethod(methodId: string): Promise<void> {
    await this.simulateDelay();

    console.log('[MockPayment] Removing payment method:', methodId);

    const index = this.paymentMethods.findIndex((m) => m.id === methodId);
    if (index !== -1) {
      this.paymentMethods.splice(index, 1);
    }
  }
}
