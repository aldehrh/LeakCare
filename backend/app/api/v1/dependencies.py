from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings
from app.core.database import db_instance

# 토큰을 추출할 경로 설정 (로그인 엔드포인트)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/users/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="유효하지 않은 인증 토큰입니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 1. 토큰 해독
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")  # 토큰 생성 시 넣었던 email
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 2. DB에서 해당 이메일을 가진 유저 검색
    user = await db_instance.db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    
    return user  # 유저 객체 전체를 반환 (id, email, name 포함)