import { test, expect } from '@playwright/test';

test.describe('Pokemon Type Quiz E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should load the start screen correctly', async ({ page }) => {
    // Check if the main title is visible
    await expect(page.locator('text=ポケモン タイプ相性クイズ')).toBeVisible();
    
    // Check if the description is visible
    await expect(page.locator('text=攻撃技のタイプと防御側のタイプから、ダメージ倍率を当てよう！')).toBeVisible();
    
    // Check if the start button is present
    await expect(page.locator('button:has-text("クイズを始める")')).toBeVisible();
  });

  test('should display difficulty and question count selection', async ({ page }) => {
    // Check difficulty selection
    await expect(page.locator('text=難易度を選択してください')).toBeVisible();
    await expect(page.locator('text=かんたん')).toBeVisible();
    await expect(page.locator('text=ふつう')).toBeVisible();
    await expect(page.locator('text=むずかしい')).toBeVisible();
    
    // Check question count selection
    await expect(page.locator('text=問題数を選択してください')).toBeVisible();
    await expect(page.locator('text=5問')).toBeVisible();
    await expect(page.locator('text=10問')).toBeVisible();
    await expect(page.locator('text=20問')).toBeVisible();
  });

  test('should show type icons animation', async ({ page }) => {
    // Wait for type icons to appear
    await page.waitForSelector('[data-testid*="type-icon"]', { timeout: 5000 });
    
    // Check if multiple type icons are visible
    const typeIcons = await page.locator('[data-testid*="type-icon"]').count();
    expect(typeIcons).toBeGreaterThan(10); // Should have all 18 types
  });

  test('should start quiz with default settings', async ({ page }) => {
    // Click start button
    await page.click('button:has-text("クイズを始める")');
    
    // Should navigate to quiz screen
    await expect(page.locator('text=問題 1 /')).toBeVisible();
    
    // Should show answer choices
    await expect(page.locator('text=こうかばつぐん(2倍)')).toBeVisible();
    await expect(page.locator('text=ふつう(1倍)')).toBeVisible();
    await expect(page.locator('text=こうかいまひとつ(0.5倍)')).toBeVisible();
    await expect(page.locator('text=こうかなし(0倍)')).toBeVisible();
  });

  test('should change difficulty and question count', async ({ page }) => {
    // Select difficult mode
    await page.click('text=むずかしい');
    
    // Select 5 questions
    await page.click('text=5問');
    
    // Start quiz
    await page.click('button:has-text("クイズを始める")');
    
    // Should show quiz with 5 questions total
    await expect(page.locator('text=問題 1 / 5')).toBeVisible();
    
    // Difficult mode should have more answer choices
    await expect(page.locator('text=こうかばつぐん(4倍)')).toBeVisible();
    await expect(page.locator('text=こうかいまひとつ(0.25倍)')).toBeVisible();
  });

  test('should complete a full quiz flow', async ({ page }) => {
    // Select easy mode with 5 questions
    await page.click('text=かんたん');
    await page.click('text=5問');
    await page.click('button:has-text("クイズを始める")');
    
    // Answer all 5 questions
    for (let i = 1; i <= 5; i++) {
      // Wait for question to load
      await expect(page.locator(`text=問題 ${i} / 5`)).toBeVisible();
      
      // Click any answer (for testing purposes)
      await page.click('button:has-text("ふつう(1倍)")');
      
      // Wait for animation screen
      await page.waitForSelector('div:has-text("vs")', { timeout: 10000 });
      
      // Click anywhere to progress (since we implemented click-to-progress)
      await page.click('body');
      
      // Wait a bit for the transition
      await page.waitForTimeout(1000);
    }
    
    // Should reach result screen
    await expect(page.locator('text=クイズ結果')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=もう一度挑戦')).toBeVisible();
    await expect(page.locator('text=ホームに戻る')).toBeVisible();
  });

  test('should handle quiz quit functionality', async ({ page }) => {
    // Start quiz
    await page.click('button:has-text("クイズを始める")');
    
    // Click quit button
    await page.click('button:has-text("中断")');
    
    // Should show quit confirmation dialog
    await expect(page.locator('text=クイズを終了しますか？')).toBeVisible();
    
    // Cancel quit
    await page.click('button:has-text("キャンセル")');
    
    // Should still be in quiz
    await expect(page.locator('text=問題 1 /')).toBeVisible();
    
    // Try quit again and confirm
    await page.click('button:has-text("中断")');
    await page.click('button:has-text("終了")');
    
    // Should return to start screen
    await expect(page.locator('text=ポケモン タイプ相性クイズ')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still show main elements
    await expect(page.locator('text=ポケモン タイプ相性クイズ')).toBeVisible();
    await expect(page.locator('button:has-text("クイズを始める")')).toBeVisible();
    
    // Start quiz
    await page.click('button:has-text("クイズを始める")');
    
    // Should show quiz elements properly on mobile
    await expect(page.locator('text=問題 1 /')).toBeVisible();
    await expect(page.locator('text=こうかばつぐん(2倍)')).toBeVisible();
  });

  test('should maintain quiz progress correctly', async ({ page }) => {
    // Start quiz with 10 questions
    await page.click('text=10問');
    await page.click('button:has-text("クイズを始める")');
    
    // Answer first question
    await expect(page.locator('text=問題 1 / 10')).toBeVisible();
    await page.click('button:has-text("ふつう(1倍)")');
    
    // Wait for animation and click to progress
    await page.waitForSelector('div:has-text("vs")', { timeout: 10000 });
    await page.click('body');
    await page.waitForTimeout(1000);
    
    // Should progress to question 2
    await expect(page.locator('text=問題 2 / 10')).toBeVisible();
    
    // Answer second question
    await page.click('button:has-text("こうかばつぐん(2倍)")');
    
    // Wait for animation and click to progress
    await page.waitForSelector('div:has-text("vs")', { timeout: 10000 });
    await page.click('body');
    await page.waitForTimeout(1000);
    
    // Should progress to question 3
    await expect(page.locator('text=問題 3 / 10')).toBeVisible();
  });

  test('should handle type icons correctly', async ({ page }) => {
    // Start quiz
    await page.click('button:has-text("クイズを始める")');
    
    // Should show type icons on quiz screen
    await page.waitForSelector('img[alt*="タイプ"]', { timeout: 5000 });
    
    // Check if type icons are loaded
    const typeIcons = await page.locator('img[alt*="タイプ"]').count();
    expect(typeIcons).toBeGreaterThanOrEqual(2); // At least attack and defend type
  });
});