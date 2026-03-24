import datetime
import os
import json
import hashlib

def generate_evidence_path():
    """
    현재 시간을 기준으로 스크린샷 파일 이름 생성
    예: 20260323_153000_evidence.png
    """
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_evidence.png"

    # 현재 작업 디렉토리에 저장
    output_path = os.path.join(os.getcwd(), filename)

    return output_path, filename


def generate_progress_key(url, start, end):
    """
    URL + 페이지 범위를 기반으로
    고유한 진행 상태 파일 이름을 만들기 위한 키 생성
    """
    raw = f"{url}_{start}_{end}"

    # md5 해시 → 파일명 길이 제한 & 충돌 방지
    return hashlib.md5(raw.encode()).hexdigest()[:10]


def save_progress(linked_pages, last_index, url, start, end):
    """
    현재 진행 상태를 JSON 파일로 저장
    (중간에 중단되었을 때 이어서 실행 가능)
    """
    key = generate_progress_key(url, start, end)
    filename = f"progress_{key}.json"

    progress = {
        "url": url,
        "start": start,
        "end": end,
        "linked_pages": linked_pages,  # 전체 링크 리스트
        "last_index": last_index       # 마지막으로 처리한 인덱스
    }

    with open(filename, "w") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

    print(f"💾 진행 상태 저장 완료: {filename}")


def load_progress(url, start, end):
    """
    저장된 진행 상태 불러오기
    """
    key = generate_progress_key(url, start, end)
    filename = f"progress_{key}.json"

    if os.path.exists(filename):
        with open(filename, "r") as f:
            return json.load(f), filename

    return None, None


def delete_progress(url, start, end):
    """
    작업 완료 시 진행 상태 파일 삭제
    """
    key = generate_progress_key(url, start, end)
    filename = f"progress_{key}.json"

    if os.path.exists(filename):
        os.remove(filename)
