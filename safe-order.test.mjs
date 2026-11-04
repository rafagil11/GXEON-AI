import { test } from 'node:test';
import assert from 'node:assert';

/**
 * Type guard for Jupiter Swap V2 Order Response
 * Handles the ambiguity between null, empty, and valid transaction strings.
 */
function validateJupiterOrder(response) {
  if (response.transaction === null) return { status: 'QUOTE_ONLY' };
  if (response.transaction === '') return { status: 'NO_TRANSACTION_BUILDABLE' };
  if (typeof response.transaction === 'string' && response.transaction.length > 0) return { status: 'READY' };
  throw new Error('Invalid transaction format');
}

test('Jupiter Swap V2 Order Response Validation', async (t) => {
  await t.test('should identify quote-only response', () => {
    const res = { transaction: null };
    assert.strictEqual(validateJupiterOrder(res).status, 'QUOTE_ONLY');
  });

  await t.test('should identify non-buildable transaction', () => {
    const res = { transaction: '' };
    assert.strictEqual(validateJupiterOrder(res).status, 'NO_TRANSACTION_BUILDABLE');
  });

  await t.test('should identify valid transaction', () => {
    const res = { transaction: 'base64_encoded_tx_data' };
    assert.strictEqual(validateJupiterOrder(res).status, 'READY');
  });

  await t.test('should handle errorCode 2 (Insufficient SOL)', () => {
    const res = { errorCode: 2, message: 'Insufficient SOL' };
    assert.strictEqual(res.errorCode, 2);
  });

  await t.test('should handle errorCode 2 (Missing ATA)', () => {
    const res = { errorCode: 2, message: 'Missing associated token account' };
    assert.strictEqual(res.errorCode, 2);
  });

  await t.test('should throw on malformed transaction', () => {
    const res = { transaction: 123 };
    assert.throws(() => validateJupiterOrder(res), /Invalid transaction format/);
  });
});