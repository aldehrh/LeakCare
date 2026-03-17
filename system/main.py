import asyncio
import argparse
from system.browser.manager import BrowserManager
from system.core.capture import take_screenshot
from system.core.extractor import extract_metadata, get_location
from system.utils.file_path import generate_evidence_path

async def main():
    # 1. 터미널에서 주소 입력받기 (동적 입력 시스템)
    parser = argparse.ArgumentParser(description="LeakCare 엔진")
    parser.add_argument("url", help="채증할 URL 입력")
    args = parser.parse_args()

    # 2. 브라우저 준비
    bm = BrowserManager()
    page = await bm.start()

    try:
        # 3. 경로 생성 및 사진 촬영
        output_path, filename = generate_evidence_path()
        response = await take_screenshot(page, args.url, output_path)

        # 4. 정보 추출 및 위치 확인
        ip = await extract_metadata(response)
        country, city = get_location(ip)

        # 5. 결과 출력
        print("-" * 40)
        print(f"✅ 채증 성공! | IP: {ip} | 위치: {country}({city})")
        print(f"📂 저장파일명: {filename}")
        print("-" * 40)

    except Exception as e:
        print(f"❌ 오류: {e}")
    finally:
        await bm.stop()

if __name__ == "__main__":
    asyncio.run(main())
