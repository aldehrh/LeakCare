import datetime
import os

def generate_evidence_path():
    # 현재 시간을 초 단위까지 가져와서 이름표 만들기
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_evidence.png"
    
    # 현재 컴퓨터의 폴더 경로와 파일 이름을 합치기
    output_path = os.path.join(os.getcwd(), filename)
    return output_path, filename
