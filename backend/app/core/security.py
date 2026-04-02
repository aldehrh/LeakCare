from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from app.core.config import settings

# 1. 암호화 알고리즘 설정 (bcrypt 사용)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. 비밀번호 해시화 및 검증 함수
def get_password_hash(password: str) -> str:
    # 비밀번호를 암호화(해시)
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # 입력받은 비밀번호와 DB의 암호화된 비밀번호가 일치하는지 확인
    return pwd_context.verify(plain_password, hashed_password)

# 3. JWT 액세스 토큰 생성 함수
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    # 만료 시간 설정 (인자가 없으면 기본 24시간)
    now = datetime.now(timezone.utc) 
        
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # 토큰에 만료 시간(exp) 정보 추가
    to_encode.update({"exp": expire})
    
    # 설정한 SECRET_KEY와 알고리즘으로 암호화하여 토큰 발행
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt