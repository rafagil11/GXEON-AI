import { test, assert } from 'node:test';

/**
 * Type-guard for Jupiter Swap V2 response.
 * Ensures we don't attempt to sign a null or empty transaction.
 */
function isSwapTransactionValid(response) {
  return (
    response &&
    typeof response.transaction === 'string' &&
    response.transaction.length > 0
  );
}

test('Jupiter Swap V2 Response Type-Guards', async (t) => {
  await t.test('should reject null transaction', () => {
    const res = { transaction: null, errorCode: null };
    assert.strictEqual(isSwapTransactionValid(res), false);
  });

  await t.test('should reject empty string transaction', () => {
    const res = { transaction: '', errorCode: null };
    assert.strictEqual(isSwapTransactionValid(res), false);
  });

  await t.test('should accept valid base64 transaction', () => {
    const res = { transaction: 'AQIDBA==', errorCode: null };
    assert.strictEqual(isSwapTransactionValid(res), true);
  });

  await t.test('should handle errorCode 2 (Insufficient SOL)', () => {
    const res = { transaction: null, errorCode: 2, message: 'Insufficient SOL' };
    assert.strictEqual(isSwapTransactionValid(res), false);
    assert.strictEqual(res.errorCode, 2);
  });

  await t.test('should handle errorCode 2 (Missing ATA)', () => {
    const res = { transaction: null, errorCode: 2, message: 'Missing ATA' };
    assert.strictEqual(isSwapTransactionValid(res), false);
  });

  await t.test('should handle malformed response object', () => {
    assert.strictEqual(isSwapTransactionValid({}), false);
  });
});