# 앤클로이 스토어

`frontend`는 Next.js, `backend`는 Express API입니다. Prisma Studio는 API가 아닙니다.

```bash
npm install
npm run dev
npm run dev:backend
npm run studio
```

- `npm run dev` — 스토어프론트 (기본 포트 3000)
- `npm run dev:backend` — 결제·로그인 API (기본 포트 4000)
- `npm run studio` — Prisma Studio

API 환경변수 이름은 `backend/.env.example`에만 적습니다. 값은 `backend/.env`에 두고 커밋하지 않습니다.

`TRUST_PROXY`는 기본으로 꺼져 있습니다. 로컬에서는 그대로 둡니다. 배포에서 API 앞에 프록시가 하나 있으면 `TRUST_PROXY=1`로 둡니다. 그래야 요청 제한이 프록시 IP 하나로 뭉치지 않습니다. `true`는 모든 홉을 믿으므로 쓰지 않는 편이 좋습니다.

`ORDER_CONFIRM_TTL_MINUTES`는 결제 확인이 이 시간(기본 15분)을 넘기면 PortOne에 다시 묻고, 그래도 결제가 아니면 주문을 닫는 기한입니다. 닫힌 주문은 다음 결제를 막지 않습니다. 아직 기한 안인 같은 주문은 다시 결제하지 않습니다.
