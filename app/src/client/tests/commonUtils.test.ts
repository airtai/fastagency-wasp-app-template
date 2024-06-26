import { test, expect, describe, vi } from 'vitest';

import { generateNatsUrl, retryFunction } from '../utils/commonUtils';

describe('commonUtils', () => {
  describe('generateNatsUrl', () => {
    test('generateNatsUrl - local undefined', () => {
      const natsUrl = undefined;
      const fastAgencyServerUrl = undefined;
      const expected = undefined;
      const actual = generateNatsUrl(natsUrl, fastAgencyServerUrl);
      expect(actual).toEqual(expected);
    });

    test('generateNatsUrl - local', () => {
      const natsUrl = 'nats://localhost:4222';
      const fastAgencyServerUrl = 'https://api.staging.fastagency.ai';
      const expected = 'nats://localhost:4222';
      const actual = generateNatsUrl(natsUrl, fastAgencyServerUrl);
      expect(actual).toEqual(expected);
    });

    test('generateNatsUrl - staging', () => {
      const natsUrl = undefined;
      const fastAgencyServerUrl = 'https://api.staging.fastagency.ai';
      const expected = 'tls://api.staging.fastagency.ai:4222';
      const actual = generateNatsUrl(natsUrl, fastAgencyServerUrl);
      expect(actual).toEqual(expected);
    });

    test('generateNatsUrl - production', () => {
      const natsUrl = undefined;
      const fastAgencyServerUrl = 'https://api.fastagency.ai';
      const expected = 'tls://api.fastagency.ai:4222';
      const actual = generateNatsUrl(natsUrl, fastAgencyServerUrl);
      expect(actual).toEqual(expected);
    });
  });
  describe('retryFunction', () => {
    test('should retry the function until it succeeds', async () => {
      let attempt = 0;
      const mockFunc = vi.fn().mockImplementation(async () => {
        attempt++;
        if (attempt < 3) {
          throw new Error('Error');
        }
      });

      await retryFunction(mockFunc, 3, 1000);

      expect(mockFunc).toHaveBeenCalledTimes(3);
    });
    test('should throw an error if all attempts fail', async () => {
      const mockFunc = vi.fn().mockImplementation(async () => {
        throw new Error('Error');
      });

      await expect(retryFunction(mockFunc, 3, 1000)).rejects.toThrow('Error');
      expect(mockFunc).toHaveBeenCalledTimes(3);
    });
  });
});
