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

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Heroicons.
*   **Backend**: Spring Boot 3, Spring Security, Hibernate JPA, PostgreSQL, Redis, Jackson, Lombok.
*   **AI Integration**: Groq API (LLaMA-3) với cấu trúc prompt bọc XML an toàn.
*   **Deployment**: Docker & Docker Compose để container hóa toàn bộ dịch vụ.

---

## 📦 Kiến Trúc Dự Án

```text
├── client/                 # Next.js Client App
│   ├── src/app/            # App Router Pages (exams, writing, profile...)
│   └── src/components/     # UI Components (Sidebar, glass containers...)
├── server/                 # Spring Boot Backend Server
│   └── src/main/java/      # Modules: auth, exam, writing, level, unit...
├── deploy/                 # File cấu hình deploy sản phẩm
└── docker-compose.yml      # Cấu hình container orchestrator chạy cục bộ
```

---

## ⚡ Khởi Chạy Nhanh (Quick Start)

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

---

## 🧪 Kiểm Thử Hệ Thống (Testing)

### 1. Phía Server (Spring Boot JUnit tests)
Chạy toàn bộ 96 test cases kiểm thử đơn vị (Unit tests) và tích hợp (Integration tests) của backend:
```bash
cd server
./mvnw test
```

### 2. Phía Client (TypeScript Type Check)
Kiểm tra tính nhất quán kiểu của Frontend:
```bash
cd client
npm run type-check
```

---

> [!NOTE]
> Dự án áp dụng các tiêu chuẩn an toàn cao về bảo mật thông tin (không hardcode secret, mã hóa mật khẩu bằng BCrypt, và xác thực phân quyền qua JWT).
