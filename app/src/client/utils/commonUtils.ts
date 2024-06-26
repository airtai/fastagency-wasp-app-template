export function generateNatsUrl(
  natsUrl: string | undefined,
  fastAgencyServerUrl: string | undefined
): string | undefined {
  if (natsUrl) return natsUrl;
  return fastAgencyServerUrl ? `${fastAgencyServerUrl.replace('https://', 'tls://')}:4222` : fastAgencyServerUrl;
}

export async function retryFunction(func: () => Promise<void>, maxRetries = 3, delay = 5000): Promise<void> {
  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      console.log(`Attempt number ${retries + 1}`);
      await func();
      console.log('Success!');
      return;
    } catch (error: any) {
      console.log(`Attempt number ${retries + 1} failed with error: ${error.message}`);
      if (retries === maxRetries - 1) {
        console.log('All attempts failed.');
        throw error;
      }
      console.log(`Waiting for ${delay}ms before next attempt.`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
