import { test, expect, type Page } from '@playwright/test';

// 難易度と問題数はRadix Selectなので、トリガーを開いてからオプションを選ぶ。
// トリガーのアクセシブル名はラベルと現在値のどちらになるか実装依存なので、
// アプリが明示しているidで取得する。
async function selectOption(page: Page, trigger: string, optionName: string) {
  await page.locator(trigger).click();
  await page.getByRole('option', { name: optionName, exact: true }).click();
}

// バトル演出をOFFにすると回答直後に解説が表示されるため、
// 待ち時間なしで次の問題へ進める。
async function setBattleAnimation(page: Page, enabled: boolean) {
  const toggle = page.getByRole('switch', { name: /回答後のバトル演出/ });
  if ((await toggle.getAttribute('aria-checked')) !== String(enabled)) {
    await toggle.click();
  }
  await expect(toggle).toHaveAttribute('aria-checked', String(enabled));
}

// 進捗表示は「問題 1 / 10」のように空白を含む。
const questionProgress = (current: number, total: number) =>
  new RegExp(`問題\\s*${current}\\s*/\\s*${total}`);

const startButton = (page: Page) =>
  page.getByRole('button', { name: /クイズを開始する/ });

// TypeIconはalt="＜タイプ名＞タイプ"のimgを描画する。
const typeIcons = (page: Page) => page.locator('img[alt$="タイプ"]');

test.describe('Pokemon Type Quiz E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the start screen correctly', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /タイプ相性クイズ/, level: 1 })
    ).toBeVisible();

    await expect(
      page.getByText(
        'ポケモンのタイプ相性を覚えて、ポケモンマスターを目指そう！'
      )
    ).toBeVisible();

    await expect(startButton(page)).toBeVisible();
  });

  test('should display difficulty and question count selection', async ({
    page,
  }) => {
    await expect(page.getByText('難易度を選択してください')).toBeVisible();
    await page.locator('#difficulty').click();
    for (const name of ['かんたん', 'ふつう', 'むずかしい']) {
      await expect(page.getByRole('option', { name, exact: true })).toBeVisible();
    }
    await page.keyboard.press('Escape');

    await expect(page.getByText('問題数を選択してください')).toBeVisible();
    await page.locator('#question-count').click();
    for (const name of ['5問', '10問', '15問', '20問']) {
      await expect(page.getByRole('option', { name, exact: true })).toBeVisible();
    }
    await page.keyboard.press('Escape');
  });

  test('should show type icons on the start screen', async ({ page }) => {
    await expect(typeIcons(page).first()).toBeVisible();

    // ヒーロー3種 + 全18タイプのマーキー2セット。
    expect(await typeIcons(page).count()).toBeGreaterThan(10);
  });

  test('should start quiz with default settings', async ({ page }) => {
    await startButton(page).click();

    // 既定はふつう・10問。
    await expect(page.getByText(questionProgress(1, 10)).first()).toBeVisible();

    for (const name of [
      'こうかばつぐん(2倍)',
      'ふつう(1倍)',
      'こうかいまひとつ(0.5倍)',
      'こうかなし(0倍)',
    ]) {
      await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
    }
  });

  test('should change difficulty and question count', async ({ page }) => {
    await selectOption(page, '#difficulty', 'むずかしい');
    await selectOption(page, '#question-count', '5問');
    await startButton(page).click();

    await expect(page.getByText(questionProgress(1, 5)).first()).toBeVisible();

    // むずかしいは複合タイプのみ出題されるため6択になる。
    await expect(
      page.getByRole('button', { name: 'こうかばつぐん(4倍)', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'こうかいまひとつ(0.25倍)', exact: true })
    ).toBeVisible();
  });

  test('should complete a full quiz flow', async ({ page }) => {
    await setBattleAnimation(page, false);
    await selectOption(page, '#difficulty', 'かんたん');
    await selectOption(page, '#question-count', '5問');
    await startButton(page).click();

    for (let i = 1; i <= 5; i++) {
      await expect(page.getByText(questionProgress(i, 5)).first()).toBeVisible();
      await page
        .getByRole('button', { name: 'ふつう(1倍)', exact: true })
        .click();

      const nextLabel = i < 5 ? '次の問題へ' : '結果を見る';
      await page.getByRole('button', { name: nextLabel }).click();
    }

    await expect(page.getByRole('heading', { name: 'クイズ結果' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /同じ設定でもう一度/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /メニューに戻る/ })
    ).toBeVisible();
  });

  test('should handle quiz quit functionality', async ({ page }) => {
    await startButton(page).click();

    // 中断ボタンの表記はビューポート幅で変わる。
    await page.getByRole('button', { name: /中断/ }).click();
    await expect(page.getByText('クイズを中断しますか？')).toBeVisible();

    await page.getByRole('button', { name: 'キャンセル' }).click();
    await expect(page.getByText(questionProgress(1, 10)).first()).toBeVisible();

    await page.getByRole('button', { name: /中断/ }).click();
    await page.getByRole('button', { name: '中断する', exact: true }).click();

    await expect(
      page.getByRole('heading', { name: /タイプ相性クイズ/, level: 1 })
    ).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(
      page.getByRole('heading', { name: /タイプ相性クイズ/, level: 1 })
    ).toBeVisible();
    await expect(startButton(page)).toBeVisible();

    await startButton(page).click();

    await expect(page.getByText(questionProgress(1, 10)).first()).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'こうかばつぐん(2倍)', exact: true })
    ).toBeVisible();
  });

  test('should maintain quiz progress correctly', async ({ page }) => {
    await setBattleAnimation(page, false);
    await selectOption(page, '#question-count', '10問');
    await startButton(page).click();

    for (let i = 1; i <= 2; i++) {
      await expect(page.getByText(questionProgress(i, 10)).first()).toBeVisible();
      await page
        .getByRole('button', { name: 'ふつう(1倍)', exact: true })
        .click();
      await page.getByRole('button', { name: '次の問題へ' }).click();
    }

    await expect(page.getByText(questionProgress(3, 10)).first()).toBeVisible();
  });

  test('should show type icons on the quiz screen', async ({ page }) => {
    await startButton(page).click();

    await expect(typeIcons(page).first()).toBeVisible();

    // 攻撃側と防御側で最低2つ。
    expect(await typeIcons(page).count()).toBeGreaterThanOrEqual(2);
  });

  test('should play the battle animation when enabled', async ({ page }) => {
    await setBattleAnimation(page, true);
    await selectOption(page, '#question-count', '5問');
    await startButton(page).click();

    await page.getByRole('button', { name: 'ふつう(1倍)', exact: true }).click();

    const overlay = page.getByRole('dialog', { name: '攻撃アニメーション' });
    await expect(overlay).toBeVisible();

    // 結果フェーズに入ると先へ進むボタンが現れる。
    const proceed = page.getByRole('button', { name: /次に進む/ });
    await expect(proceed).toBeVisible({ timeout: 10000 });
    await proceed.click();

    await expect(overlay).toBeHidden();
    await expect(
      page.getByRole('button', { name: /次の問題へ|結果を見る/ })
    ).toBeVisible();
  });
});
