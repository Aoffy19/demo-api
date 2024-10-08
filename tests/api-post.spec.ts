import { test, expect, APIRequestContext } from '@playwright/test';

test('should get correct response from API', async ({ request }: { request: APIRequestContext }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.status()).toBe(200);

  const responseBody: Array<{ userId: number; id: number; title: string; body: string }> = await response.json();
  let containsExpectedText = false;

  responseBody.forEach(item => {
    expect(item).toHaveProperty('userId');
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('body');

    // ตรวจสอบประเภทของค่าที่อยู่ในแต่ละ property
    expect(typeof item.userId).toBe('number');
    expect(typeof item.id).toBe('number');
    expect(typeof item.title).toBe('string');
    expect(typeof item.body).toBe('string');

    // ตรวจสอบว่า userId อยู่ในช่วง 1 ถึง 10 เท่านั้น
    expect(item.userId).toBeGreaterThanOrEqual(1);
    expect(item.userId).toBeLessThanOrEqual(10);

    // ตรวจสอบว่า title เป็นตัวอักษรเท่านั้น
    expect(/^[a-zA-Z\s]+$/.test(item.title)).toBe(true);

    // ตรวจสอบข้อความใน body
    if (item.body.includes('suscipit')) {
      containsExpectedText = true;
    }
  });

  expect(containsExpectedText).toBe(true);
});
