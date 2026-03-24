from playwright.async_api import async_playwright
from system.browser.stealth import stealth_async

class BrowserManager:
    """
    Playwright 브라우저 실행/종료 관리 클래스
    """

    def __init__(self):
        self.playwright = None
        self.browser = None

    async def start(self):
        """
        브라우저 실행 + 페이지 생성
        """
        self.playwright = await async_playwright().start()

        # headless=False → 실제 브라우저 창 표시
        self.browser = await self.playwright.chromium.launch(headless=False)

        context = await self.browser.new_context(
            viewport={'width': 1280, 'height': 800},
        )

        page = await context.new_page()

        # 봇 탐지 우회 적용
        await stealth_async(page)

        return page

    async def stop(self):
        """
        브라우저 종료
        """
        if self.browser:
            await self.browser.close()

        if self.playwright:
            await self.playwright.stop()
