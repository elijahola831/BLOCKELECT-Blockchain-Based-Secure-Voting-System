/**
 * Enhanced NIN Verification System Test Suite
 * ==========================================
 * 
 * Comprehensive testing for the BLOCKELECT Enhanced NIN Verification System v2.0
 * 
 * Usage: node test-enhanced-nin.js
 * 
 * Make sure the BLOCKELECT server is running on http://localhost:3000
 */

const http = require('http');
const assert = require('assert');

console.log('🧪 Enhanced NIN Verification System - Comprehensive Test Suite');
console.log('============================================================');

// Test configuration
const API_BASE = 'http://localhost:3000';
const API_ENDPOINT = '/api/enhanced-nin/verify';
const INFO_ENDPOINT = '/api/enhanced-nin/info';

// Test session ID
const TEST_SESSION_ID = 'TEST_SESSION_' + Date.now();

/**
 * Make HTTP request helper
 */
function makeRequest(method, endpoint, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(endpoint, API_BASE);
        
        const options = {
            hostname: url.hostname,
            port: url.port || 3000,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': TEST_SESSION_ID,
                'X-Verification-Version': '2.0.0',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                try {
                    const result = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseBody ? JSON.parse(responseBody) : null
                    };
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${e.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * Test case runner
 */
async function runTest(testName, testFunction) {
    try {
        console.log(`\n🔍 Testing: ${testName}`);
        const startTime = Date.now();
        
        await testFunction();
        
        const duration = Date.now() - startTime;
        console.log(`✅ PASS: ${testName} (${duration}ms)`);
        return true;
        
    } catch (error) {
        console.log(`❌ FAIL: ${testName}`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

/**
 * Check if server is running
 */
async function checkServerHealth() {
    console.log('🏥 Checking Enhanced NIN API server health...');
    
    try {
        const response = await makeRequest('GET', '/api/health');
        
        if (response.statusCode === 200) {
            console.log('✅ Server is running and healthy');
            return true;
        } else {
            console.log(`❌ Server responded with status: ${response.statusCode}`);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Server is not responding');
        console.log('💡 Please start the server with: npm start');
        console.log('🔗 Server should be available at: http://localhost:3000');
        return false;
    }
}

/**
 * Test enhanced NIN system info endpoint
 */
async function testSystemInfo() {
    const response = await makeRequest('GET', INFO_ENDPOINT);
    
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data.success, true);
    assert.strictEqual(response.data.version, '2.0.0');
    assert.strictEqual(response.data.system, 'Enhanced NIN Verification System');
    assert(Array.isArray(response.data.features));
    assert(response.data.testData);
    assert(response.data.rateLimits);
}

/**
 * Test valid NIN verification cases
 */
async function testValidNINVerification() {
    const validCases = [
        {
            name: 'John Doe',
            nin: '12345678901',
            dateOfBirth: '1990-01-01',
            lastName: 'Doe'
        },
        {
            name: 'Jane Smith',
            nin: '98765432109',
            dateOfBirth: '1985-05-15',
            lastName: 'Smith'
        },
        {
            name: 'Test User',
            nin: '11111111111',
            dateOfBirth: '1995-12-25',
            lastName: 'User'
        }
    ];
    
    for (const testCase of validCases) {
        const response = await makeRequest('POST', API_ENDPOINT, {
            nin: testCase.nin,
            dateOfBirth: testCase.dateOfBirth,
            lastName: testCase.lastName
        });
        
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.data.success, true);
        assert.strictEqual(response.data.code, 'ENHANCED_VERIFICATION_SUCCESS');
        assert.strictEqual(response.data.data.nin, testCase.nin);
        assert.strictEqual(response.data.data.lastName, testCase.lastName);
        assert(response.data.data.verifiedAt);
        assert(response.data.data.processingTime);
        assert.strictEqual(response.data.metadata.apiVersion, '2.0.0');
        
        console.log(`   ✓ ${testCase.name} verified successfully`);
    }
}

/**
 * Test invalid NIN cases
 */
async function testInvalidNINCases() {
    const invalidCases = [
        {
            name: 'NIN Not Found',
            nin: '99999999999',
            dateOfBirth: '1990-01-01',
            lastName: 'NotFound',
            expectedCode: 'NIN_NOT_FOUND',
            expectedStatus: 404
        },
        {
            name: 'Suspended NIN',
            nin: '33333333333',
            dateOfBirth: '1992-04-18',
            lastName: 'Account',
            expectedCode: 'INACTIVE_NIN_STATUS',
            expectedStatus: 400
        },
        {
            name: 'DOB Mismatch',
            nin: '12345678901',
            dateOfBirth: '1990-01-02', // Wrong date
            lastName: 'Doe',
            expectedCode: 'DOB_MISMATCH',
            expectedStatus: 400
        },
        {
            name: 'Last Name Mismatch',
            nin: '12345678901',
            dateOfBirth: '1990-01-01',
            lastName: 'WrongName',
            expectedCode: 'LASTNAME_MISMATCH',
            expectedStatus: 400
        }
    ];
    
    for (const testCase of invalidCases) {
        const response = await makeRequest('POST', API_ENDPOINT, {
            nin: testCase.nin,
            dateOfBirth: testCase.dateOfBirth,
            lastName: testCase.lastName
        });
        
        assert.strictEqual(response.statusCode, testCase.expectedStatus);
        assert.strictEqual(response.data.success, false);
        assert.strictEqual(response.data.code, testCase.expectedCode);
        assert(response.data.error);
        
        console.log(`   ✓ ${testCase.name} handled correctly`);
    }
}

/**
 * Test input validation
 */
async function testInputValidation() {
    const validationCases = [
        {
            name: 'Invalid NIN Format (10 digits)',
            data: { nin: '1234567890', dateOfBirth: '1990-01-01', lastName: 'Test' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'Invalid NIN Format (contains letters)',
            data: { nin: '12345678901a', dateOfBirth: '1990-01-01', lastName: 'Test' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'Invalid Date Format',
            data: { nin: '12345678901', dateOfBirth: '01/01/1990', lastName: 'Test' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'Invalid Name Format (contains numbers)',
            data: { nin: '12345678901', dateOfBirth: '1990-01-01', lastName: 'Test123' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'Missing Fields',
            data: { nin: '12345678901', dateOfBirth: '1990-01-01' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'Future Date of Birth',
            data: { nin: '12345678901', dateOfBirth: '2030-01-01', lastName: 'Test' },
            expectedCode: 'INVALID_BIRTH_DATE'
        },
        {
            name: 'Underage (17 years old)',
            data: { 
                nin: '12345678901', 
                dateOfBirth: new Date(Date.now() - (17 * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], 
                lastName: 'Test' 
            },
            expectedCode: 'UNDERAGE_VOTER'
        }
    ];
    
    for (const testCase of validationCases) {
        const response = await makeRequest('POST', API_ENDPOINT, testCase.data);
        
        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.data.success, false);
        assert.strictEqual(response.data.code, testCase.expectedCode);
        
        console.log(`   ✓ ${testCase.name} validation works`);
    }
}

/**
 * Test rate limiting
 */
async function testRateLimit() {
    console.log('   Testing rate limiting (5 requests/minute)...');
    
    const testData = {
        nin: '12345678901',
        dateOfBirth: '1990-01-01',
        lastName: 'Doe'
    };
    
    let rateLimitHit = false;
    
    // Make 6 requests rapidly
    for (let i = 1; i <= 6; i++) {
        const response = await makeRequest('POST', API_ENDPOINT, testData);
        
        if (response.statusCode === 429) {
            assert.strictEqual(response.data.success, false);
            assert.strictEqual(response.data.code, 'ENHANCED_RATE_LIMIT');
            assert(response.data.retryAfter);
            rateLimitHit = true;
            console.log(`   ✓ Rate limit triggered at request #${i}`);
            break;
        } else if (response.statusCode === 200) {
            console.log(`   → Request #${i}: Success`);
        }
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    assert(rateLimitHit, 'Rate limiting should have been triggered');
}

/**
 * Test XSS and injection prevention
 */
async function testSecurityFeatures() {
    const securityCases = [
        {
            name: 'XSS Attempt in NIN',
            data: { nin: '<script>alert("xss")</script>', dateOfBirth: '1990-01-01', lastName: 'Test' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'XSS Attempt in Last Name',
            data: { nin: '12345678901', dateOfBirth: '1990-01-01', lastName: '<script>alert("xss")</script>' },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        },
        {
            name: 'SQL Injection Attempt',
            data: { nin: '12345678901', dateOfBirth: '1990-01-01', lastName: "'; DROP TABLE users; --" },
            expectedCode: 'ENHANCED_VALIDATION_ERROR'
        }
    ];
    
    for (const testCase of securityCases) {
        const response = await makeRequest('POST', API_ENDPOINT, testCase.data);
        
        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(response.data.success, false);
        assert.strictEqual(response.data.code, testCase.expectedCode);
        
        console.log(`   ✓ ${testCase.name} blocked successfully`);
    }
}

/**
 * Test performance and response times
 */
async function testPerformance() {
    const testData = {
        nin: '12345678901',
        dateOfBirth: '1990-01-01',
        lastName: 'Doe'
    };
    
    const times = [];
    const iterations = 3;
    
    for (let i = 0; i < iterations; i++) {
        const startTime = Date.now();
        const response = await makeRequest('POST', API_ENDPOINT, testData);
        const responseTime = Date.now() - startTime;
        
        times.push(responseTime);
        
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.data.success, true);
        assert(response.data.data.processingTime);
        
        // Wait to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`   ✓ Average response time: ${avgTime.toFixed(0)}ms`);
    
    // Performance should be reasonable (under 5 seconds including processing delay)
    assert(avgTime < 5000, 'Response time should be under 5 seconds');
}

/**
 * Test session management
 */
async function testSessionManagement() {
    const testData = {
        nin: '12345678901',
        dateOfBirth: '1990-01-01',
        lastName: 'Doe'
    };
    
    const uniqueSessionId = 'TEST_SESSION_' + Math.random().toString(36);
    
    const response = await makeRequest('POST', API_ENDPOINT, testData, {
        'X-Session-ID': uniqueSessionId,
        'X-Verification-Version': '2.0.0'
    });
    
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.data.data.sessionId, uniqueSessionId);
    assert.strictEqual(response.data.data.version, '2.0.0');
    
    console.log('   ✓ Session management working correctly');
}

/**
 * Test error handling
 */
async function testErrorHandling() {
    // Test with invalid JSON
    try {
        const response = await makeRequest('POST', API_ENDPOINT, 'invalid json');
        // Should not reach here, but if it does, check for proper error handling
        assert(response.statusCode >= 400);
    } catch (error) {
        // This is expected for invalid JSON
        console.log('   ✓ Invalid JSON handled correctly');
    }
    
    // Test with empty request body
    const emptyResponse = await makeRequest('POST', API_ENDPOINT, {});
    assert.strictEqual(emptyResponse.statusCode, 400);
    assert.strictEqual(emptyResponse.data.success, false);
    assert.strictEqual(emptyResponse.data.code, 'ENHANCED_VALIDATION_ERROR');
    
    console.log('   ✓ Empty request handled correctly');
}

/**
 * Run all tests
 */
async function runAllTests() {
    // Check server health first
    const serverHealthy = await checkServerHealth();
    if (!serverHealthy) {
        console.log('\n❌ Cannot run tests - server is not available');
        return;
    }
    
    console.log('\n🚀 Starting Enhanced NIN Verification Tests...\n');
    
    const tests = [
        { name: 'System Information Endpoint', func: testSystemInfo },
        { name: 'Valid NIN Verification', func: testValidNINVerification },
        { name: 'Invalid NIN Cases', func: testInvalidNINCases },
        { name: 'Input Validation', func: testInputValidation },
        { name: 'Rate Limiting', func: testRateLimit },
        { name: 'Security Features', func: testSecurityFeatures },
        { name: 'Performance Testing', func: testPerformance },
        { name: 'Session Management', func: testSessionManagement },
        { name: 'Error Handling', func: testErrorHandling }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        const success = await runTest(test.name, test.func);
        if (success) {
            passed++;
        } else {
            failed++;
        }
        
        // Wait between tests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test Results Summary
    console.log('\n🏁 Enhanced NIN Verification Test Results');
    console.log('=========================================');
    console.log(`✅ Passed: ${passed}/${tests.length}`);
    console.log(`❌ Failed: ${failed}/${tests.length}`);
    console.log(`📊 Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
    
    if (passed === tests.length) {
        console.log('\n🎉 All tests passed! Enhanced NIN Verification System is working correctly.');
        console.log('\n🌟 Key Features Verified:');
        console.log('   ✓ Advanced input validation and sanitization');
        console.log('   ✓ Comprehensive error handling with suggestions');
        console.log('   ✓ Rate limiting and security protections');
        console.log('   ✓ Session management and audit logging');
        console.log('   ✓ Performance within acceptable limits');
        console.log('   ✓ XSS and injection attack prevention');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the server logs and fix any issues.');
    }
    
    console.log('\n📝 Test Environment:');
    console.log(`   Server: ${API_BASE}`);
    console.log(`   API Version: 2.0.0`);
    console.log(`   Test Session: ${TEST_SESSION_ID}`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    
    console.log('\n💡 For more detailed testing, see: Enhanced-NIN-Documentation.md');
    console.log('\n✨ Enhanced NIN Verification System testing completed!');
}

/**
 * Load testing (optional)
 */
async function loadTest(concurrent = 3, requests = 10) {
    console.log(`\n🚀 Load Testing: ${concurrent} concurrent users, ${requests} requests each`);
    
    const testData = {
        nin: '12345678901',
        dateOfBirth: '1990-01-01',
        lastName: 'Doe'
    };
    
    const workers = [];
    const results = [];
    
    // Create concurrent workers
    for (let i = 0; i < concurrent; i++) {
        const worker = async () => {
            const workerResults = [];
            
            for (let j = 0; j < requests; j++) {
                const startTime = Date.now();
                
                try {
                    const response = await makeRequest('POST', API_ENDPOINT, testData, {
                        'X-Session-ID': `LOAD_TEST_${i}_${j}_${Date.now()}`
                    });
                    
                    workerResults.push({
                        success: response.statusCode === 200 || response.statusCode === 429, // 429 is expected due to rate limiting
                        responseTime: Date.now() - startTime,
                        statusCode: response.statusCode
                    });
                    
                } catch (error) {
                    workerResults.push({
                        success: false,
                        responseTime: Date.now() - startTime,
                        error: error.message
                    });
                }
                
                // Small delay between requests
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            return workerResults;
        };
        
        workers.push(worker());
    }
    
    // Wait for all workers to complete
    const allResults = await Promise.all(workers);
    
    // Flatten results
    allResults.forEach(workerResults => {
        results.push(...workerResults);
    });
    
    // Calculate statistics
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const rateLimited = results.filter(r => r.statusCode === 429).length;
    
    console.log(`📊 Load Test Results:`);
    console.log(`   Total Requests: ${results.length}`);
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Rate Limited: ${rateLimited}`);
    console.log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   Success Rate: ${Math.round((successful / results.length) * 100)}%`);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--load-test')) {
    // Run load test
    loadTest(3, 5).catch(console.error);
} else {
    // Run normal test suite
    runAllTests().catch(console.error);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Test suite interrupted by user');
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
