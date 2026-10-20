/**
 * The payment method registry (DESIGN.md §6.1, §8.5). Logos come from Shopify's open-source `activemerchant/payment_icons`
 * (MIT, pinned below) and are copied into src/payment/library/ by `pnpm payment-icons` (scripts/update-payment-icons.ts);
 * the copies are committed, so builds never fetch. Brands the library doesn't have (or a newer logo it hasn't caught up
 * with) go in src/payment/custom/<file>.svg, drawn on the same 38 × 24 card. `default` is our own generic card, drawn
 * in code from tokens (Figma Payment Icons `Default card`) and shown for unknown methods.
 *
 * To add a brand: add a line here (`library: '<file name in the library>'` or `custom: '<file>'`), then run
 * `pnpm payment-icons` for library logos. A test fails if a registered logo has no file.
 */
export const FIN_PAYMENT_LIBRARY = { repo: 'activemerchant/payment_icons', version: 'v1.7.69' } as const;

export interface FinPaymentMethodEntry {
  /** The brand's name: the icon's alt text. */
  name: string;
  /** The logo's file name in the library (app/assets/images/payment_icons/<library>.svg). */
  library?: string;
  /** The logo's file name in src/payment/custom/ (our own artwork). */
  custom?: string;
}

export const finPaymentMethods = {
  default: { name: 'Card' },
  visa: { name: 'Visa', library: 'visa' },
  mastercard: { name: 'Mastercard', library: 'master' },
  amex: { name: 'American Express', library: 'american_express' },
  dinersclub: { name: 'Diners Club', library: 'diners_club' },
  discover: { name: 'Discover', library: 'discover' },
  maestro: { name: 'Maestro', library: 'maestro' },
  unionpay: { name: 'UnionPay', library: 'unionpay' },
  paypal: { name: 'PayPal', library: 'paypal' },
  applepay: { name: 'Apple Pay', library: 'apple_pay' },
  googlepay: { name: 'Google Pay', library: 'google_pay' },
  amazonpay: { name: 'Amazon Pay', library: 'amazon' },
  alipay: { name: 'Alipay', library: 'alipay' },
  wechatpay: { name: 'WeChat Pay', library: 'wechatpay' },
  upi: { name: 'UPI', library: 'upi' },
  stripe: { name: 'Stripe', library: 'stripe' },
  klarna: { name: 'Klarna', library: 'klarna' },
  affirm: { name: 'Affirm', library: 'affirm' },
  interac: { name: 'Interac', library: 'interac' },
} as const satisfies Record<string, FinPaymentMethodEntry>;

export type FinPaymentMethod = keyof typeof finPaymentMethods;

export const isFinPaymentMethod = (value: string): value is FinPaymentMethod => Object.hasOwn(finPaymentMethods, value);
