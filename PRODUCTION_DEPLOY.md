# TechJob AI production deploy

Mục tiêu production là: frontend deploy trên Vercel, backend AI deploy riêng trên Render/Railway/Fly, API key chỉ nằm trong backend environment variables.

Không đưa các key này vào frontend:

- `OPENROUTER_API_KEY`
- `MISTRAL_API_KEY`
- `CEREBRAS_API_KEY`
- `GROQ_API_KEY`
- `GROQ_FALLBACK_API_KEY`

Với Vite, mọi biến có prefix `VITE_` đều public trên browser bundle.

## 1. Deploy backend

Backend nằm trong `data-pipeline`.

Render blueprint đã có ở `render.yaml`. Khi tạo service, nhập secret env theo `data-pipeline/.env.production.example`.

Các biến bắt buộc:

```env
POSTGRES_HOST=
POSTGRES_PORT=5432
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
PGSSLMODE=require

LLM_PROVIDER_CHAIN=openrouter,mistral,cerebras,groq
OPENROUTER_API_KEY=
MISTRAL_API_KEY=
CEREBRAS_API_KEY=
GROQ_API_KEY=
```

Nếu dùng Render manual Docker service:

- Root directory: `data-pipeline`
- Dockerfile: `Dockerfile.backend`
- Health check path: `/api/health`

Sau khi deploy, kiểm tra:

```bash
curl https://YOUR_BACKEND_DOMAIN/api/health
curl https://YOUR_BACKEND_DOMAIN/api/health/ai
```

## 2. Deploy frontend trên Vercel

Trong Vercel project settings, đặt:

```env
VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api
VITE_WS_URL=wss://YOUR_BACKEND_DOMAIN/ws/chat
VITE_USE_MOCK=false
VITE_CHAT_TIMEOUT_MS=90000
```

Không đặt LLM API key trong Vercel frontend env.

## 3. Local smoke test trước khi deploy

```powershell
docker compose -f data-pipeline\docker-compose.yml up -d backend
npm run build
```

Kiểm tra backend local:

```powershell
Invoke-WebRequest http://localhost:8000/api/health
Invoke-WebRequest http://localhost:8000/api/health/ai
```

## 4. Nếu key từng lộ

Nếu API key đã từng xuất hiện trong chat, ảnh chụp, commit, hoặc frontend bundle, hãy rotate/regenerate key trước khi deploy production.

