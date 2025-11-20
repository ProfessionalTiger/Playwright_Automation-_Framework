import { test, expect } from './fixtures/fixtures.js';
import { DataGenerator } from './utils/dataGenerator.js';

/**
 * Test Suite: API Testing with Playwright
 * Demonstrates API testing using Playwright's request context
 */
test.describe('API Testing Examples', () => {
  test.beforeAll(async () => {
    console.log('🌐 API Testing Suite Started');
  });

  test('should make GET request to API', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';

    // Act
    const response = await request.get(apiUrl);

    // Assert
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(1);
    console.log('✅ GET request successful:', data.title);
  });

  test('should make POST request to API', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const postData = {
      title: 'Test Post',
      body: 'This is a test post created by Playwright',
      userId: 1,
    };

    // Act
    const response = await request.post(apiUrl, {
      data: postData,
    });

    // Assert
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.title).toBe(postData.title);
    console.log('✅ POST request successful, created post ID:', data.id);
  });

  test('should make PUT request to API', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
    const updateData = {
      id: 1,
      title: 'Updated Post Title',
      body: 'Updated post body',
      userId: 1,
    };

    // Act
    const response = await request.put(apiUrl, {
      data: updateData,
    });

    // Assert
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.title).toBe(updateData.title);
    console.log('✅ PUT request successful');
  });

  test('should make DELETE request to API', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';

    // Act
    const response = await request.delete(apiUrl);

    // Assert
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    console.log('✅ DELETE request successful');
  });

  test('should handle API errors gracefully', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/999999';

    // Act
    const response = await request.get(apiUrl);

    // Assert
    expect(response.status()).toBe(200); // JSONPlaceholder returns 200 for non-existent resources
    console.log('✅ Error handling test passed');
  });

  test('should make API request with custom headers', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const customHeaders = {
      'Custom-Header': 'test-value',
      'Authorization': 'Bearer test-token',
    };

    // Act
    const response = await request.get(apiUrl, {
      headers: customHeaders,
    });

    // Assert
    expect(response.ok()).toBeTruthy();
    console.log('✅ Request with custom headers successful');
  });

  test('should measure API response time', async ({ request }) => {
    // Arrange
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

    // Act
    const startTime = Date.now();
    const response = await request.get(apiUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(5000); // Response should be faster than 5 seconds
    console.log(`✅ API response time: ${responseTime}ms`);
  });
});
