import { CoinGeckoClient } from 'coingecko-api-v3';
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

interface ConversionOptions {
  baseTokenPrice: number;
  destinationTokenPrice: number;
  baseTokenAmount: number;
  options?: any;
}
// Accepts an array of tokens as IDs, and VS currency e.g USD and returns an array with the prices
export async function getCurrentPrices(tokenIDs) {
  return client.simplePrice({
    vs_currencies: 'usd',
    ids: tokenIDs,
    include_24hr_change: false,
    include_24hr_vol: false,
    include_last_updated_at: false,
    include_market_cap: false,
  });
}

export function calculateExchangeRate(options: ConversionOptions) {
  const { baseTokenPrice, destinationTokenPrice, baseTokenAmount } = options;
  const valueOfBaseToken = baseTokenPrice * baseTokenAmount;
  return (valueOfBaseToken / destinationTokenPrice).toFixed(8);
}
