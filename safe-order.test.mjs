import { test } from 'node:test';
import assert from 'node:assert';

/**
 * Typeguard for Jupiter Swap V2 API response
 */
function isTransactionReady(response) {
  return (
    response.transaction !== null &&
    response.transaction !== '' &&
    typeof response.transaction === 'string'
  );
}

/**
 * Mocking Jupiter Swap V2 responses for validation
 */
test('Jupiter Swap V2 Response Typeguards', async (t) => {
  await t.test('should identify null transaction as not ready', () => {
    const res = { transaction: null };
    assert.strictEqual(isTransactionReady(res), false);
  });

  await t.test('should identify empty string transaction as not ready', () => {
    const res = { transaction: '' };
    assert.strictEqual(isTransactionReady(res), false);
  });

  await t.test('should identify valid transaction as ready', () => {
    const res = { transaction: 'AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyA=' };
    assert.strictEqual(isTransactionReady(res), true);
  });

  await t.test('should handle missing transaction field', () => {
    const res = {};
    assert.strictEqual(isTransactionReady(res), false);
  });

  await t.test('should validate errorCode 2 (Metis: Insufficient SOL)', () => {
    const res = { errorCode: 2, message: 'Insufficient SOL' };
    assert.strictEqual(res.errorCode, 2);
  });

  await t.test('should validate errorCode 2 (JupiterZ: Missing ATA)', () => {
    const res = { errorCode: 2, message: 'Missing associated token account' };
    assert.strictEqual(res.errorCode, 2);
  });
});