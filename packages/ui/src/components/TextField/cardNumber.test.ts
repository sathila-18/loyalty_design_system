import { describe, expect, it } from 'vitest';
import { cardBrand, cardDigits, formatCardNumber } from './cardNumber';

describe('card numbers', () => {
  it.each([
    ['4242424242424242', 'visa'],
    ['5555555555554444', 'mastercard'],
    ['2223003122003222', 'mastercard'],
    ['378282246310005', 'amex'],
    ['30569309025904', 'dinersclub'],
    ['6011111111111117', 'discover'],
    ['6759649826438453', 'maestro'],
    ['6200000000000005', 'unionpay'],
    ['9999', 'default'],
    ['', 'default'],
  ])('%s is %s', (number, brand) => {
    expect(cardBrand(number)).toBe(brand);
  });

  it('groups the digits in fours, and American Express 4-6-5', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardNumber('424242')).toBe('4242 42');
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
  });

  it('keeps only digits, up to the brand’s length', () => {
    expect(cardDigits('4242-4242 abc')).toBe('42424242');
    expect(cardDigits('3782822463100059999')).toBe('378282246310005');
    expect(cardDigits('42424242424242424242424')).toHaveLength(19);
  });
});
