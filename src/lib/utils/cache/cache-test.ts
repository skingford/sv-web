/**
 * Simple tests for the caching tool
 */

import { cache, sessionCache, LocalCache, cacheUtils } from './storage';

export function runCacheTests() {
	console.log('🧪 Running Cache Tests...\n');

	// Test 1: Basic set/get with encryption
	console.log('Test 1: Basic set/get with encryption');
	cache.set('test-data', { message: 'Hello World', number: 42 });
	const retrieved = cache.get('test-data');
	console.log('✅ Retrieved:', retrieved);
	console.log(
		'✅ Match:',
		JSON.stringify(retrieved) === JSON.stringify({ message: 'Hello World', number: 42 })
	);

	// Test 2: Expiration
	console.log('\nTest 2: Expiration');
	cache.set('expire-test', { data: 'will expire' }, { ttl: 100 }); // 100ms
	console.log('✅ Immediately after set:', cache.get('expire-test'));

	setTimeout(() => {
		console.log('✅ After 150ms (should be null):', cache.get('expire-test'));
	}, 150);

	// Test 3: No encryption
	console.log('\nTest 3: No encryption');
	cache.set('no-encrypt', { public: true }, { encrypt: false });
	const noEncrypt = cache.get('no-encrypt', { encrypt: false });
	console.log('✅ No encryption data:', noEncrypt);

	// Test 4: Session storage
	console.log('\nTest 4: Session storage');
	sessionCache.set('session-data', { session: true });
	console.log('✅ Session data:', sessionCache.get('session-data'));

	// Test 5: Custom cache instance
	console.log('\nTest 5: Custom cache instance');
	const customCache = new LocalCache('custom-key');
	customCache.set('custom-data', { custom: true });
	console.log('✅ Custom cache data:', customCache.get('custom-data'));

	// Test 6: Cache metadata
	console.log('\nTest 6: Cache metadata');
	cache.set('metadata-test', { test: true }, { ttl: 60000 });
	const metadata = cache.getMetadata('metadata-test');
	console.log('✅ Metadata:', metadata);

	// Test 7: Cache statistics
	console.log('\nTest 7: Cache statistics');
	const stats = cache.getStats();
	console.log('✅ Stats:', stats);

	// Test 8: Cleanup
	console.log('\nTest 8: Cleanup');
	cache.set('cleanup-test-1', { data: 1 }, { ttl: 1 }); // 1ms - will expire immediately
	cache.set('cleanup-test-2', { data: 2 }, { ttl: 60000 }); // 1 minute

	setTimeout(() => {
		const cleanedCount = cache.cleanup();
		console.log('✅ Cleaned expired items:', cleanedCount);
	}, 10);

	// Test 9: Get or Set pattern
	console.log('\nTest 9: Get or Set pattern');
	let fetchCount = 0;

	const testGetOrSet = async () => {
		const result1 = await cacheUtils.getOrSet(
			'get-or-set-test',
			() => {
				fetchCount++;
				return { fetched: fetchCount, timestamp: Date.now() };
			},
			{ ttl: 1000 }
		);

		const result2 = await cacheUtils.getOrSet(
			'get-or-set-test',
			() => {
				fetchCount++;
				return { fetched: fetchCount, timestamp: Date.now() };
			},
			{ ttl: 1000 }
		);

		console.log('✅ First call:', result1);
		console.log('✅ Second call (cached):', result2);
		console.log('✅ Fetch count (should be 1):', fetchCount);
	};

	testGetOrSet();

	console.log('\n🎉 Cache tests completed!');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
	// Browser environment
	runCacheTests();
}
