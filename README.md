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

### 3. Học Ngữ Pháp & Luyện Đọc Hiểu (Grammar & Reading)
*   **Học ngữ pháp trực quan**: Các bài tập ngữ pháp được số hóa cấu trúc từ lý thuyết đến thực hành.
*   **Luyện tập đọc hiểu**: Giao diện hiển thị bài đọc song song với câu hỏi trắc nghiệm/điền từ, lưu giữ trạng thái cuộn giúp người học dễ dàng tham chiếu thông tin.

### 4. Luyện Nghe & Tin Tức (Listening & News)
*   **Luyện nghe đa dạng**: Nghe các đoạn hội thoại hoặc radio trực tuyến (qua RadioStationCard) để nâng cao phản xạ nghe.
*   **Tiếp cận tin tức**: Cập nhật các bản tin tiếng Anh học thuật hàng ngày giúp gia tăng vốn từ vựng thực tế.

### 5. Game Học Từ Vựng Wordle
*   **Mini-game đoán từ**: Trò chơi đoán từ vựng 5 chữ cái cổ điển hỗ trợ phản hồi màu sắc trực quan (đúng vị trí, sai vị trí, không tồn tại trong từ mục tiêu). Giúp học viên học từ mới một cách vui nhộn và đỡ nhàm chán.

### 6. Quản Lý Tiến Độ & Thành Tích (Progress & Achievements)
*   **Báo cáo học tập**: Theo dõi số bài học đã hoàn thành, điểm kiểm tra, và tiến độ ôn thi thử.
*   **Hệ thống huy hiệu**: Mở khóa các thành tích khi đạt các mốc học tập cụ thể, tạo động lực duy trì thói quen học hàng ngày.

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng

### Frontend (Client)
*   **Framework chính**: Next.js 14 (App Router) & React 18.
*   **Ngôn ngữ**: TypeScript để quản lý kiểu chặt chẽ.
*   **Styling & UI**: Tailwind CSS (Thiết kế Glassmorphic sống động, responsive trên mọi kích thước màn hình) cùng thư viện Heroicons.
*   **State Management**: Zustand (Cấu trúc các store độc lập như `authStore`, `uiStore`, `lessonStore`).
*   **React Context**: ThemeContext quản lý chế độ Dark/Light mode toàn hệ thống.
*   **HTTP Client**: Axios tích hợp Interceptors tự động đính kèm và làm mới (refresh) JWT token.
*   **Testing**: Vitest và Playwright (kiểm thử đầu cuối E2E).

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
│  PostgreSQL   │   │     Redis     │      │   Groq API    │
│  (Primary DB) │   │ (Cache/Limit) │      │   (LLaMA-3)   │
└───────────────┘   └───────────────┘      └───────────────┘
```

---

## 📂 Chi Tiết Cấu Trúc Thư Mục Thực Tế

### 1. Cấu Trúc Frontend (client/)
```text
├── client/                     # Thư mục chứa dự án Next.js Frontend
│   ├── src/app/                # Cấu trúc App Router của Next.js
│   │   ├── (auth)/             # Nhóm định tuyến Xác thực người dùng
│   │   │   ├── login/          # Trang đăng nhập
│   │   │   └── register/       # Trang đăng ký
│   │   └── (main)/             # Nhóm định tuyến chức năng chính của ứng dụng
│   │       ├── achievements/   # Xem và quản lý các thành tích đạt được
│   │       ├── dashboard/      # Bảng điều khiển tổng quan của học viên
│   │       ├── exams/          # Luyện thi thử IELTS, TOEIC, CEFR
│   │       ├── grammar/        # Nội dung học và luyện tập Ngữ pháp
│   │       ├── listening/      # Chức năng luyện nghe tiếng Anh
│   │       ├── news/           # Bản tin tiếng Anh học thuật hàng ngày
│   │       ├── practice/       # Các bài tập thực hành kỹ năng
│   │       ├── progress/       # Báo cáo tiến độ học tập chi tiết
│   │       ├── quizzes/        # Kho trắc nghiệm tổng hợp
│   │       ├── reading/        # Chức năng học và luyện đọc hiểu
│   │       ├── settings/       # Cài đặt tài khoản và hệ thống
│   │       ├── vocabulary/     # Kho học từ vựng
│   │       ├── wordle/         # Trò chơi đoán từ đoán nghĩa Wordle
│   │       └── writing/        # Viết luận kèm chấm điểm sửa lỗi bằng AI
│   ├── src/components/         # Thư viện UI components
│   │   ├── exams/              # Bộ kết xuất giao diện thi (Cloze, GapFill, MatchingHeadings...)
│   │   ├── profile/            # Component liên quan đến thông tin người dùng
│   │   ├── ui/                 # Các component cơ bản (Button, Card, Input...)
│   │   ├── wordle/             # Giao diện bàn phím và ô nhập từ Wordle
│   │   └── Sidebar.tsx         # Thanh điều hướng chính của nền tảng
│   ├── src/context/            # Nơi định nghĩa ThemeContext (quản lý Light/Dark mode)
│   ├── src/hooks/              # Các Custom Hooks dùng chung (useAuth, useExam...)
│   ├── src/lib/                # Cấu hình Axios API client & Tiện ích
│   ├── src/store/              # Zustand stores (authStore.ts, lessonStore.ts, uiStore.ts)
│   ├── src/types/              # Khai báo kiểu TypeScript
│   ├── src/styles/             # Tập tin định dạng CSS toàn cục (globals.css)
│   └── __tests__/              # Bộ mã nguồn kiểm thử phía Frontend (Vitest)
```

### 2. Cấu Trúc Backend (server/)
```text
├── server/                     # Thư mục chứa dự án Spring Boot Backend
│   ├── src/main/java/          # Thư mục chứa mã nguồn Java chính
│   │   └── com/example/english_learning_app/
│   │       ├── auth/           # Bộ lọc xác thực JWT, SecurityConfig, Controller đăng nhập/đăng ký
│   │       ├── config/         # Cấu hình hệ thống (AppConfig, RedisConfig, CorsConfig...)
│   │       ├── exam/           # Logic quản lý bài thi chuẩn hóa, chấm điểm tự động
│   │       ├── grammar/        # Quản lý bài học và câu hỏi luyện ngữ pháp
│   │       ├── health/         # Endpoint check trạng thái API, Postgres, Redis (/health)
│   │       ├── level/          # Quản lý trình độ học viên (A1, A2, B1...)
│   │       ├── localization/   # Bản địa hóa thông tin phản hồi của hệ thống
│   │       ├── publicapi/      # Tích hợp hoặc xuất bản các API công cộng
│   │       ├── reading/        # Quản lý bài học và câu hỏi luyện đọc hiểu
│   │       ├── unit/           # Quản lý bài học (units) và quizzes củng cố
│   │       ├── user/           # Quản lý thông tin và tài khoản cá nhân
│   │       ├── userprogress/   # Ghi nhận và thống kê tiến trình học của học viên
│   │       ├── web/            # Cấu hình Web MVC và các interceptors (Rate Limit...)
│   │       ├── wordle/         # Logic trò chơi Wordle (từ vựng 5 chữ cái)
│   │       └── writing/        # Tích hợp AI chấm điểm bài luận (Groq API LLaMA-3)
│   └── src/test/java/          # Bộ mã nguồn kiểm thử backend (JUnit, Mockito)
```

---

## ⚙️ Cấu Hướng Thiết Lập Môi Trường (Environment Setup)

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
Hệ thống backend tích hợp các test cases kiểm thử đơn vị (Unit tests) và tích hợp (Integration tests) đảm bảo tính toàn vẹn của logic nghiệp vụ, cấu hình bảo mật và phản hồi API.
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
Hệ thống frontend tích hợp các test cases dùng để kiểm tra hoạt động của các components UI, hooks, tiện ích API, và trạng thái Zustand.
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

*   **Xác Thực Không Trạng Thế (Stateless JWT)**: Sử dụng JWT lưu trong bộ nhớ máy khách kết hợp cơ chế quay vòng khóa Refresh Token an toàn. Không lưu trữ thông tin phiên làm việc (Session) trên máy chủ, tối ưu hóa khả năng mở rộng (horizontal scaling).
*   **Mã Hóa Mật Khẩu (BCrypt)**: Toàn bộ mật khẩu người dùng được băm bằng thuật toán BCrypt trước khi ghi nhận vào PostgreSQL database.
*   **Phòng Ngừa Prompt Injection (Groq API)**:
    *   Sử dụng cơ chế bao bọc prompt bằng thẻ định dạng XML riêng biệt để cách ly phần chỉ thị của hệ thống (system prompt) và phần dữ liệu do học viên cung cấp (user input).
    *   Áp dụng bộ lọc độ dài đầu vào nghiêm ngặt (chặn đứng các bài viết dài hơn 1000 từ).
*   **Giới Hạn Tần Suất (Redis Rate Limiting)**:
    *   Sử dụng Redis để đếm và quản lý số lượng yêu cầu (Request Rate Limit) theo từng User ID.
    *   Ngăn chặn spam và giảm thiểu tối đa các hành vi cố ý tấn công DoS/DDoS nhắm vào hệ thống API chấm điểm viết đắt đỏ.
*   **Tối Ưu Phản Hồi (Redis Caching)**: Caching tự động các bài học, danh sách bài tập từ vựng vốn ít có sự thay đổi liên tục, giảm thiểu truy vấn trực tiếp đến PostgreSQL database, gia tăng đáng kể tốc độ tải trang phía Client.
