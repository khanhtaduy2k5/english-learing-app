# EngSphere - English Learning Web Application

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache-Redis-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Container-Docker-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20LLaMA--3-orange?style=for-the-badge)](https://groq.com/)

EngSphere là một nền tảng học tiếng Anh trực tuyến toàn diện, được thiết kế theo xu hướng giao diện cao cấp (**Premium Glassmorphic**) tối giản, hiện đại và hoạt động trơn tru. Hệ thống sử dụng mô hình kiến trúc phân lớp vững chắc, hỗ trợ mở rộng linh hoạt, tích hợp kiểm thử tự động toàn diện và các biện pháp bảo mật nâng cao bao gồm phòng chống Prompt Injection và giới hạn tần suất gọi API (Rate Limiting).

---

## 🚀 Các Tính Năng Nổi Bật

### 1. Luyện Thi Thử Chuẩn Hóa (Standardized Exams)
*   **Cơ chế xử lý động**: API và giao diện Frontend được tối ưu hóa để tương thích linh hoạt với cả cấu trúc phân mục câu hỏi dạng phân cấp (cây JSON gồm các `sections`, nhóm câu hỏi, bài đọc) và dạng mảng phẳng (flat array).
*   **Đa dạng loại câu hỏi**: Hỗ trợ đầy đủ các dạng bài thi chuẩn hóa quốc tế như IELTS, TOEIC, CEFR với các trình mô phỏng giao diện kéo thả, điền từ vào chỗ trống (Gap Fill), chọn tiêu đề phù hợp (Matching Headings), và chọn đáp án đúng (Multiple Choice).

### 2. Tích Hợp AI Đánh Giá Bài Viết (AI Writing Feedback)
*   **Tốc độ cao qua Groq Wrapper**: Tích hợp trực tiếp với API của Groq Cloud sử dụng mô hình LLaMA-3 để phân tích ngữ pháp, từ vựng và chấm điểm bài viết của học viên ngay lập tức.
*   **Lớp phòng vệ Prompt Injection**: Sử dụng cấu trúc đóng gói prompt bằng thẻ XML đặc trưng để phân tách nội dung bài viết của người dùng với chỉ dẫn của hệ thống, loại bỏ triệt để nguy cơ ghi đè prompt (Prompt Hijacking).
*   **Giới hạn chặt chẽ (Guardrails)**: Chặn cứng mọi bài viết vượt quá 1000 từ trực tiếp từ tầng Controller và Service để tối ưu tài nguyên và chi phí gọi API.

### 3. Hệ Thống Bài Học & Trắc Nghiệm (Lessons & Quizzes)
*   **Phân bậc trình độ chuẩn CEFR**: Giáo trình bài học và từ vựng được phân cấp rõ ràng theo trình độ người học (Beginner/A1, Intermediate/A2, Advanced/B1).
*   **Bài tập củng cố tương tác**: Đi kèm mỗi bài học là hệ thống quiz trắc nghiệm tính điểm tự động giúp học viên kiểm tra ngay kiến thức vừa tiếp thu.

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng

### Frontend (Client)
*   **Framework chính**: Next.js 14 (App Router) & React 18.
*   **Ngôn ngữ**: TypeScript để quản lý kiểu chặt chẽ.
*   **Styling & UI**: Tailwind CSS (Thiết kế Glassmorphic sống động, responsive trên mọi kích thước màn hình) cùng thư viện Heroicons.
*   **State Management**: Zustand (Cấu trúc các store độc lập như `authStore`, `uiStore`, `examStore`).
*   **HTTP Client**: Axios tích hợp Interceptors tự động đính kèm và làm mới (refresh) JWT token.
*   **Testing**: Vitest và React Testing Library.

### Backend (Server)
*   **Framework chính**: Spring Boot 3.x (Java 21).
*   **Security**: Spring Security 6 với cấu hình xác thực không lưu trạng thái (Stateless Authentication) qua JWT và mã hóa mật khẩu thông qua BCrypt.
*   **Data Access Layer**: Hibernate JPA & Spring Data JPA.
*   **Cơ sở dữ liệu**: PostgreSQL (Lưu trữ thông tin người dùng, bài học, bài thi và tiến trình học).
*   **Cache & Rate Limit**: Redis (Cấu hình lưu trữ cache tạm thời các thông tin bài học tĩnh và theo dõi giới hạn lượt gọi API thông qua bộ lọc chặn Interceptor).
*   **Testing**: JUnit 5, Mockito, Spring Security Test, và JaCoCo (Báo cáo độ phủ code).

---

## 📐 Kiến Trúc Hệ Thống (System Architecture)

Luồng tương tác và kết nối giữa các dịch vụ trong hệ thống EngSphere được tổ chức như sau:

```text
┌──────────────────────────────────────────────────────────┐
│                     Next.js Frontend                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │                    React UI App                    │  │
│  │  • Pages: Exams, Writing, Lessons, Auth, Profile   │  │
│  │  • Global State: Zustand Stores (auth, ui, exam)    │  │
│  └────────────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼ Axios HTTP Requests (JWT)    │
└───────────────────────────┼──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                 Spring Boot Backend REST API             │
│  ┌────────────────────────────────────────────────────┐  │
│  │                    Controllers                     │  │
│  │  • Auth, Exam, Writing, Level, Unit, UserProgress  │  │
│  └────────────────────────────────────────────────────┘  │
│       │                   │                      │       │
│       ▼ Spring Security   ▼ Interceptors         ▼       │
│  ┌───────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │ JWT Valid/    │  │ Redis Rate Limit │  │ Business  │  │
│  │ BCrypt Hash   │  │ Interceptor      │  │ Logic     │  │
│  └───────────────┘  └──────────────────┘  └───────────┘  │
└───────┬───────────────────┬──────────────────────┬───────┘
        │                   │                      │
        ▼ JPA               ▼ Redis Client         ▼ HTTP Client
┌───────────────┐   ┌───────────────┐      ┌───────────────┐
┌  PostgreSQL   │   │     Redis     │      │   Groq API    │
│  (Primary DB) │   │ (Cache/Limit) │      │   (LLaMA-3)   │
└───────────────┘   └───────────────┘      └───────────────┘
```

---

## 📂 Chi Tiết Cấu Trúc Thư Mục

```text
├── client/                     # Mã nguồn ứng dụng Next.js Frontend
│   ├── src/app/                # Các trang cấu trúc App Router (exams, writing, profile...)
│   ├── src/components/         # Thư viện component UI dùng chung và các bộ Renderer cho bài thi
│   ├── src/hooks/              # Custom React hooks (useAuth, useExam...)
│   ├── src/lib/                # Các hàm tiện ích và cấu hình Axios API client
│   ├── src/store/              # Các Zustand stores quản lý trạng thái ứng dụng
│   ├── src/types/              # Định nghĩa các kiểu TypeScript (interface, type)
│   ├── src/styles/             # Tập tin định dạng CSS toàn cục (globals.css)
│   └── __tests__/              # Bộ mã nguồn kiểm thử phía Frontend (Vitest)
│
├── server/                     # Mã nguồn ứng dụng Spring Boot Backend
│   ├── src/main/java/          # Source code Java chính
│   │   └── com/example/english_learning_app/
│   │       ├── auth/           # Quản lý Đăng ký, Đăng nhập, JWT, SecurityConfig
│   │       ├── user/           # Quản lý Thông tin cá nhân học viên
│   │       ├── lesson/         # Quản lý bài học và Quizzes
│   │       ├── exam/           # Quản lý cấu trúc bài thi, câu hỏi và chấm thi
│   │       ├── writing/        # Wrapper kết nối Groq AI phân tích bài viết
│   │       ├── config/         # Các lớp cấu hình hệ thống (AppConfig, RedisConfig, CorsConfig)
│   │       └── exception/      # Bộ xử lý ngoại lệ tập trung (GlobalExceptionHandler)
│   └── src/test/java/          # Bộ mã nguồn kiểm thử phía Backend (JUnit, Mockito)
│
├── deploy/                     # Chứa các tệp tin cấu hình triển khai dự án thực tế
└── docker-compose.yml          # Triển khai nhanh toàn bộ hệ thống ở máy local qua Docker
```

---

## ⚙️ Cấu Hình Môi Trường (Environment Setup)

### 1. Phía Backend (Spring Boot Server)
Tạo tệp `server/.env` tại thư mục `server/` và điền đầy đủ các thông tin cấu hình kết nối sau:
```env
# Database PostgreSQL
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/english_learning
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Cache & Rate limiting Redis
SPRING_DATA_REDIS_HOST=localhost
SPRING_DATA_REDIS_PORT=6379

# Email Service (Gửi mã xác thực, thông báo)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password

# Media Storage Cloudinary
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# AI Integration
GROQ_API_KEY=gsk_your_groq_api_key
```

### 2. Phía Frontend (Next.js Client)
Tạo tệp `client/.env.local` tại thư mục `client/` chứa cấu hình URL kết nối đến Backend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## ⚡ Khởi Chạy Nhanh (Quick Start)

### Cách 1: Sử dụng Docker Compose (Khuyên dùng)
Hãy chắc chắn rằng Docker Desktop đã được mở và khởi chạy trên máy của bạn.
1. **Khởi dựng và chạy toàn bộ dịch vụ**:
   ```bash
   docker compose up -d --build
   ```
2. **Các cổng truy cập mặc định**:
   *   **Giao diện người dùng Web Client**: [http://localhost:3000](http://localhost:3000)
   *   **Đường dẫn API Backend**: [http://localhost:8080](http://localhost:8080)
   *   **Tài liệu API Swagger**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
3. **Dừng toàn bộ dịch vụ**:
   ```bash
   docker compose down
   ```

### Cách 2: Khởi chạy thủ công từng phần
1. **Yêu cầu ban đầu**: Cần cài đặt và khởi chạy sẵn PostgreSQL và Redis tại máy local của bạn.
2. **Khởi chạy Backend (Spring Boot)**:
   ```bash
   cd server
   # Sử dụng Maven Wrapper để chạy
   # Trên Windows
   .\mvnw.cmd spring-boot:run
   # Trên Linux/Mac
   ./mvnw spring-boot:run
   ```
3. **Khởi chạy Frontend (Next.js)**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🧪 Kiểm Thử Hệ Thống (Testing & Coverage)

### 1. Phía Server (Spring Boot JUnit & JaCoCo Coverage)
Hệ thống backend tích hợp **125** test cases kiểm thử đơn vị (Unit tests) và tích hợp (Integration tests) đảm bảo tính toàn vẹn của logic nghiệp vụ, cấu hình bảo mật và phản hồi API.
*   **Chạy toàn bộ kiểm thử:**
    ```bash
    cd server
    # Trên Windows
    .\mvnw.cmd test
    # Trên Linux/Mac
    ./mvnw test
    ```
*   **Xem báo cáo độ phủ (JaCoCo Coverage):**
    Báo cáo độ phủ mã nguồn dưới dạng HTML sẽ tự động được cập nhật sau khi chạy kiểm thử thành công tại:
    `server/target/site/jacoco/index.html`

### 2. Phía Client (Next.js Vitest Unit Tests & Coverage)
Hệ thống frontend tích hợp **76** test cases dùng để kiểm tra hoạt động của các components UI, hooks, tiện ích API, và trạng thái Zustand.
*   **Chạy toàn bộ kiểm thử:**
    ```bash
    cd client
    npm run test
    ```
*   **Chạy một tệp test cụ thể:**
    ```bash
    npx vitest run __tests__/lib/api.test.ts
    ```
*   **Chạy kiểm thử và tạo báo cáo độ phủ (Vitest Coverage):**
    ```bash
    npm run test:coverage
    ```
    Báo cáo chi tiết dạng HTML được tạo tại thư mục sau:
    `client/coverage/index.html`

---

## 🛡️ Thiết Kế Bảo Mật & Tối Ưu Hiệu Năng

Hệ thống EngSphere được thiết kế tuân thủ các quy tắc bảo mật hiện đại nhằm bảo vệ thông tin người dùng và ngăn chặn tấn công:

*   **Xác Thực Không Trạng Thái (Stateless JWT)**: Sử dụng JWT lưu trong bộ nhớ máy khách kết hợp cơ chế quay vòng khóa Refresh Token an toàn. Không lưu trữ thông tin phiên làm việc (Session) trên máy chủ, tối ưu hóa khả năng mở rộng (horizontal scaling).
*   **Mã Hóa Mật Khẩu (BCrypt)**: Toàn bộ mật khẩu người dùng được băm bằng thuật toán BCrypt trước khi ghi nhận vào PostgreSQL database.
*   **Phòng Ngừa Prompt Injection (Groq API)**:
    *   Sử dụng cơ chế bao bọc prompt bằng thẻ định dạng XML riêng biệt để cách ly phần chỉ thị của hệ thống (system prompt) và phần dữ liệu do học viên cung cấp (user input).
    *   Áp dụng bộ lọc độ dài đầu vào nghiêm ngặt (chặn đứng các bài viết dài hơn 1000 từ).
*   **Giới Hạn Tần Suất (Redis Rate Limiting)**:
    *   Sử dụng Redis để đếm và quản lý số lượng yêu cầu (Request Rate Limit) theo từng User ID.
    *   Ngăn chặn spam và giảm thiểu tối đa các hành vi cố ý tấn công DoS/DDoS nhắm vào hệ thống API chấm điểm viết đắt đỏ.
*   **Tối Ưu Phản Hồi (Redis Caching)**: Caching tự động các bài học, danh sách bài tập từ vựng vốn ít có sự thay đổi liên tục, giảm thiểu truy vấn trực tiếp đến PostgreSQL database, gia tăng đáng kể tốc độ tải trang phía Client.
