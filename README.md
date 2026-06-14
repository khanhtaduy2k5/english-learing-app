# EngSphere - English Learning Web Application

EngSphere là một ứng dụng học tiếng Anh trực tuyến toàn diện, được thiết kế với giao diện cao cấp (Premium Glassmorphism) cùng kiến trúc hệ thống hiện đại, ổn định và tích hợp trí tuệ nhân tạo thông minh.

---

## 🚀 Các Tính Năng Nổi Bật

1. **Standardized Exams**: Hỗ trợ luyện thi thử các bài thi chuẩn hóa quốc tế (IELTS, TOEIC, CEFR...).
   - *Cơ chế xử lý động*: API và giao diện được thiết kế tương thích linh hoạt với cả cấu trúc phân mục phức tạp (JSON Object chứa các `sections` câu hỏi) và mảng phẳng (JSON Array).
2. **AI Writing Feedback (Groq AI Wrapper)**: Chấm điểm và nhận xét chi tiết các bài viết tiếng Anh của người học sử dụng mô hình AI tốc độ cao từ Groq.
   - *An toàn & Bảo mật nâng cao*: Tích hợp giới hạn lượt gọi (Rate Limiting) theo User ID qua Redis, kiểm soát Prompt Injection (XML isolation) và chặn cứng bài viết vượt quá 1000 từ.
3. **Lessons & Quizzes**: Kho bài học từ vựng, ngữ pháp phân cấp trực quan theo trình độ cá nhân (A1, A2, B1) đi kèm bài tập trắc nghiệm củng cố kiến thức.

---

## 🛠️ Công Nghệ Sử Dụng

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Heroicons, Zustand.
*   **Backend**: Spring Boot 3, Spring Security, Hibernate JPA, PostgreSQL, Redis, Jackson, Lombok.
*   **AI Integration**: Groq API (LLaMA-3) với cấu trúc prompt bọc XML an toàn.
*   **Deployment**: Docker & Docker Compose để container hóa toàn bộ dịch vụ.

---

## 📦 Kiến Trúc Dự Án

```text
├── client/                 # Next.js Client App
│   ├── src/app/            # App Router Pages (exams, writing, profile...)
│   ├── src/components/     # UI Components (Sidebar, glass containers...)
│   ├── src/store/          # Zustand State Management (authStore, uiStore...)
│   └── __tests__/          # Vitest testing suite (unit & component tests)
├── server/                 # Spring Boot Backend Server
│   ├── src/main/java/      # Modules: auth, exam, writing, level, unit, userprogress...
│   └── src/test/java/      # Backend test suite (JUnit, Mockito, Security Integration)
├── deploy/                 # File cấu hình deploy sản phẩm
└── docker-compose.yml      # Cấu hình container orchestrator chạy cục bộ
```

---

## ⚙️ Cấu Hình Môi Trường (Environment Setup)

### Phía Backend (Server)
Tạo file `server/.env` tại thư mục `server/` chứa các cấu hình kết nối sau:
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/english_learning
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_DATA_REDIS_HOST=localhost
SPRING_DATA_REDIS_PORT=6379
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
GROQ_API_KEY=gsk_your_groq_api_key
```

### Phía Frontend (Client)
Tạo file `client/.env.local` tại thư mục `client/` chứa cấu hình trỏ về API Backend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## ⚡ Khởi Chạy Nhanh (Quick Start)

### Cách 1: Sử dụng Docker Compose (Khuyên dùng)
Dự án được cấu hình chạy hoàn chỉnh thông qua Docker Compose. Hãy đảm bảo bạn đã cài đặt Docker Desktop trên máy.
1. **Khởi chạy toàn bộ hệ thống** (Database, Redis, Server, Frontend):
   ```bash
   docker compose up -d --build
   ```
2. **Các cổng truy cập**:
   *   **Giao diện Web Client**: [http://localhost:3000](http://localhost:3000)
   *   **API Backend**: [http://localhost:8080](http://localhost:8080)
   *   **Swagger API Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
3. **Dừng toàn bộ hệ thống**:
   ```bash
   docker compose down
   ```

### Cách 2: Khởi chạy thủ công từng phần
1. **Backend**:
   Đảm bảo PostgreSQL và Redis đã chạy trên local của bạn.
   ```bash
   cd server
   # Windows
   .\mvnw.cmd spring-boot:run
   # Linux/Mac
   ./mvnw spring-boot:run
   ```
2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🧪 Kiểm Thử Hệ Thống & Độ Phủ Test (Testing & Coverage)

### 1. Phía Server (Spring Boot JUnit & JaCoCo Coverage)
Chạy toàn bộ **125** test cases kiểm thử đơn vị (Unit tests) và tích hợp (Integration tests) của backend:
*   **Chạy toàn bộ test:**
    ```bash
    cd server
    # Windows
    .\mvnw.cmd test
    # Linux/Mac
    ./mvnw test
    ```
*   **Tạo báo cáo Coverage (JaCoCo):**
    Báo cáo HTML về độ phủ dòng code (Line Coverage) tự động tạo khi chạy test. Bạn có thể mở file sau để xem:
    `server/target/site/jacoco/index.html`

### 2. Phía Client (Next.js Vitest Unit Tests & Coverage)
Chạy toàn bộ **76** tests unit, hook, và component ở phía frontend:
*   **Chạy toàn bộ test:**
    ```bash
    cd client
    npm run test
    ```
*   **Chạy test cụ thể:**
    ```bash
    npx vitest run __tests__/lib/api.test.ts
    ```
*   **Kiểm tra độ phủ test coverage (Vitest Coverage):**
    Chạy lệnh sau để tính toán độ phủ code phía frontend:
    ```bash
    npm run test:coverage
    ```
    Mở file báo cáo HTML tại đường dẫn sau để xem kết quả trực quan:
    `client/coverage/index.html`

---

> [!NOTE]
> Dự án áp dụng các tiêu chuẩn an toàn cao về bảo mật thông tin (không hardcode secret, mã hóa mật khẩu bằng BCrypt, xác thực phân quyền qua JWT, giới hạn Rate Limit qua Redis, và ngăn ngừa Prompt Injection bằng cấu trúc XML).
