import { runFeatureTests } from './tests.ts';

async function main() {
  console.log('====================================================');
  console.log('🔬 JAJAL MEDICAL CASE MANAGEMENT - FEATURE TEST SUITE');
  console.log('Automated Tests (Laravel / PHPUnit / Pest specification)');
  console.log('====================================================\n');

  const results = await runFeatureTests();
  let passed = 0;
  let failed = 0;

  for (const test of results) {
    if (test.status === 'passed') {
      passed++;
      console.log(`✅ [PASS] ${test.id}: ${test.title} (${test.durationMs}ms)`);
      console.log(`   -> ${test.assertionMessage}`);
    } else {
      failed++;
      console.log(`❌ [FAIL] ${test.id}: ${test.title}`);
      console.log(`   -> ${test.assertionMessage}`);
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('----------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
