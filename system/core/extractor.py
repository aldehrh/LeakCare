import requests

def get_location(ip):
    try:
        # IP 주소로 지도 정보 서비스(API)에 물어보기
        res = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        data = res.json()
        if data.get('status') == 'success':
            return data.get('country', 'Unknown'), data.get('city', 'Unknown')
        return "Unknown", "Unknown"
    except:
        return "Unknown", "Unknown"

async def extract_metadata(response):
    # 접속한 서버의 진짜 숫자 주소(IP) 가로채기
    server_addr = await response.server_addr()
    ip_address = server_addr.get('ipAddress', 'Unknown IP')
    return ip_address
