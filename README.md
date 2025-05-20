# 사전과제 (과제를 완성하지 못했습니다.)

MSA를 처음 구축해보았고, 네트워크에 대한 이해가 부족해 최종적으로 완성하지 못했습니다.
기회가 된다면 개인적인 역량을 쌓아 다시 지원하고 싶습니다.
시간을 할애해주셔서 감사합니다.

# 실행 방법 

```docker-compose up --build```


- 스웨거 접속
``` http://localhost:3000/swagger``` 

- 유저/관리자 회원가입
``` auth/user/register ```
- body
```
{
  "email": "test@test.com",
  "password": "12345678",
  "name": "홍길동"
}
```

- 유저 로그인
  - body : userType은 ```USER, ADMIN, OPERATOR, AUDITOR ``` 로 구분되어 있습니다. 
```
{
  "email": "test@test.com",
  "password": "12345678",
  "userType": "USER"
}
```
- 로그인 시 응답된 accessToken 을 복사 해 API 우측 자물쇠 버튼에 넣어주셔야 합니다.



