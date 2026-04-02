- ### ‼️ 시작
  1. 환경 설정
    pip install playwright insightface onnxruntime-gpu opencv-python reportlab httpx playwright install chromium
  2. 실행 방법
    python main.py "https://example.com/post/1" --mode single
  3. 게시판 전체 분석
    python main.py "https://example.com/board" --mode board --start 1 --end 5


- ### ‼️ 파일 구조
  LeakCare/
  ├── main.py                # 시스템 실행 메인 엔진
  ├── ai_module.py           # InsightFace 기반 AI 분석 모듈
  ├── system/
  │   ├── browser/
  │   │   ├── manager.py     # 브라우저 수명 주기 관리
  │   │   └── stealth.py     # 봇 탐지 우회 스크립트
  │   ├── core/
  │   │   ├── capture.py     # 스크린샷 및 스크롤 제어
  │   │   └── extractor.py   # 메타데이터 및 이미지 추출 로직
  │   └── utils/
  │       ├── file_path.py   # 파일 경로 및 진행 상태 관리
  │       └── report.py      # PDF 보고서 생성 엔진
  └── README.md

- ### ‼️ 핵심 기능
  1. 웹 크롤링 및 채증
  2. AI 얼굴 분석
  3. 실시간 데이터 동기화 및 보고서
