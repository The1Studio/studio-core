import type {
  PaymentMethod,
  PaymentIntent,
  PaymentResult,
  CreatePaymentParams,
} from './types';

/**
 * Payment service contract
 *
 * Implementations:
 * - StripePaymentService (Stripe)
 * - PayPalPaymentService (PayPal)
 *
 * @example
 * const payment = useService<IPaymentService>(TOKENS.Payment.Service);
 * const intent = await payment.createPaymentIntent({ amount: 1000, currency: 'usd' });
 */
export interface IPaymentService {
  /**
   * Create a payment intent for processing
   */
  createPaymentIntent(params: CreatePaymentParams): Promise<PaymentIntent>;

  /**
   * Confirm and process a payment
   */
  confirmPayment(intentId: string): Promise<PaymentResult>;

  /**
   * Cancel a pending payment
   */
  cancelPayment(intentId: string): Promise<void>;

  /**
   * Get user's saved payment methods
   */
  getPaymentMethods(): Promise<PaymentMethod[]>;

  /**
   * Add a new payment method
   */
  addPaymentMethod(token: string): Promise<PaymentMethod>;

  /**
   * Remove a payment method
   */
  removePaymentMethod(methodId: string): Promise<void>;
}
