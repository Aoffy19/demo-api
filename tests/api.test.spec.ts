import { test, expect, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

// อ่านข้อมูลจาก JSON file
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf-8'));

test('should get correct response from API and export to Excel', async ({ request }: { request: APIRequestContext }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts?_limit=2');
    expect(response.status()).toBe(200);

    const responseBody: Array<{ userId: number; id: number; title: string; body: string }> = await response.json();

    // ตรวจสอบความยาวของ responseBody และ data
    expect(responseBody.length).toBe(data.length);

    responseBody.forEach((item, index) => {
        if (data[index]) {
            expect(item.userId).toBe(data[index].userId);
            expect(item.id).toBe(data[index].id);
            expect(item.title).toBe(data[index].title);

        }
    });
    // สร้าง Excel file จากข้อมูลที่ได้รับ
    const worksheet = XLSX.utils.json_to_sheet(responseBody);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'API Data');
    XLSX.writeFile(workbook, 'api_data.xlsx');
});
