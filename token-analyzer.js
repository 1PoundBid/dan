import { analyzeTokenUsage, getTokenMetrics } from './src/lib/token-analysis.ts';

// Print token usage analysis
console.log('\n=== Token Usage Analysis ===\n');

const metrics = getTokenMetrics();

console.log('Total Tokens Used:', metrics.totalTokens);

console.log('\nTop 5 Endpoints by Usage:');
metrics.topEndpoints.forEach(([endpoint, tokens]) => {
  console.log(`  ${endpoint}: ${tokens} tokens`);
});

console.log('\nUsage by Method:');
Object.entries(metrics.methodDistribution).forEach(([method, tokens]) => {
  console.log(`  ${method}: ${tokens} tokens`);
});

console.log('\nPeak Usage Hour:', metrics.peakUsageHour[0]);
console.log('Average Daily Usage:', Math.round(metrics.dailyAverage), 'tokens');

const analysis = analyzeTokenUsage();

console.log('\nDetailed Time Analysis:');
console.log('\nHourly Distribution:');
Object.entries(analysis.timeAnalysis.hourly)
  .sort(([a], [b]) => Number(a) - Number(b))
  .forEach(([hour, tokens]) => {
    console.log(`  ${hour.padStart(2, '0')}:00 - ${tokens} tokens`);
  });

console.log('\nDaily Distribution:');
Object.entries(analysis.timeAnalysis.daily)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([date, tokens]) => {
    console.log(`  ${date}: ${tokens} tokens`);
  });