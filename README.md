# TourDL - Hệ Thống Quản Lý & Đặt Tour Du Lịch

Nền tảng đặt tour du lịch trực tuyến toàn diện, xây dựng trên kiến trúc Client-Server hiện đại với giao diện Server-Side Rendering (Node.js/Express/EJS), hệ thống dịch vụ Backend mạnh mẽ (Java Spring Boot), cơ sở dữ liệu MySQL và hỗ trợ container hóa hoàn chỉnh qua Docker Compose.

---

## 🌟 Điểm nổi bật & Tính năng chính

### 👤 Dành cho khách hàng (Customer)
- **Khám phá & Tìm kiếm Tour**: Bộ lọc tour thông minh theo ngân sách, điểm xuất phát, điểm đến, loại tour và ngày khởi hành.
- **Hero Banner Slider**: Hiển thị các điểm đến nổi bật, chiến dịch ưu đãi được cập nhật từ Admin.
- **Chi tiết Tour & Lịch trình**: Cung cấp thông tin tổng quan, lịch khởi hành chi tiết, bảng giá và điều khoản dịch vụ.
- **Đặt Tour & Quản lý đơn hàng**: Quy trình đặt tour linh hoạt cho nhiều đối tượng (người lớn, trẻ em, em bé), theo dõi lịch sử và trạng thái đơn hàng (`/my-orders`).
- **Thanh toán trực tuyến**: Tích hợp thanh toán PayPal sandbox an toàn.
- **Chế độ Sáng / Tối (Dark / Light Mode)**:
  - Mặc định chế độ sáng theo phong cách hiện đại.
  - Công tắc chuyển đổi (Switch Toggle) trực quan ngay trên thanh Header.
  - Tự động ghi nhớ trạng thái theo `localStorage`, không bị chớp nháy (FOUC) khi tải lại trang.

### 🛠️ Dành cho Quản trị viên (Admin)
- **Dashboard doanh thu**: Biểu đồ thống kê doanh thu theo thời gian, phân tích đơn hàng và khách hàng.
- **Quản lý Tour & Lịch khởi hành**: Thêm mới, chỉnh sửa thông tin tour, cấu hình ngày khởi hành và số lượng chỗ.
- **Quản lý Khách hàng & Đơn đặt tour**: Theo dõi tiến trình đơn hàng, xác nhận hoặc hủy tour.
- **Quản lý Voucher & Ưu đãi**: Tạo mã giảm giá, thiết lập hạn sử dụng và tỷ lệ chiết khấu.
- **Quản lý Banner Slider**: Đăng tải hình ảnh banner, thiết lập thứ tự hiển thị và chuyển đổi trạng thái ẩn/hiện.

---

## 🏗️ Kiến trúc & Công nghệ

```
TourDL/
├── Access/              # Dữ liệu khởi tạo MySQL (database_HDV.sql)
├── Backend/             # API Service (Java Spring Boot 3, Spring Security, JPA)
├── Frontend/            # Web Server & UI (Node.js, Express.js, EJS, SCSS/CSS)
├── compose.yaml         # Docker Compose orchestration cho toàn bộ hệ thống
└── README.md
```

### Tech Stack
- **Frontend**: Node.js, Express.js, EJS View Engine, Sequelize ORM, Axios, FontAwesome, SCSS/CSS.
- **Backend**: Java 17+, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate, Maven.
- **Database**: MySQL 8.4 (hỗ trợ tự động nạp cơ sở dữ liệu mẫu).
- **Container**: Docker, Docker Compose.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Cách 1: Sử dụng Docker Compose (Khuyến nghị)

Toàn bộ dịch vụ (MySQL, Backend, Frontend) đã được đóng gói sẵn sàng.

1. **Clone repository về máy**:
   ```bash
   git clone https://github.com/hieuhakkai/TourDL.git
   cd TourDL
   ```

2. **Khởi chạy hệ thống**:
   ```bash
   docker compose up --build -d
   ```

3. **Truy cập ứng dụng**:
   - **Frontend (Giao diện người dùng):** [http://localhost:3124](http://localhost:3124)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **MySQL Server:** `localhost:3307` (database: `tourdlhdv`)

4. **Xem logs hoặc dừng dịch vụ**:
   ```bash
   # Xem log frontend
   docker compose logs -f frontend

   # Dừng tất cả container
   docker compose down
   ```

---

### Cách 2: Chạy thủ công trên môi trường Local (Dev)

#### 1. Cơ sở dữ liệu MySQL
- Khởi động MySQL và tạo database `tourdlhdv`.
- Import file dữ liệu mẫu từ `Access/database_HDV.sql`:
  ```bash
  mysql -u root -p tourdlhdv < Access/database_HDV.sql
  ```
  *(Hoặc chạy nhanh container MySQL: `docker compose up -d mysql`)*

#### 2. Khởi chạy Backend (Spring Boot)
- Yêu cầu: **JDK 17+** và **Maven**.
  ```bash
  cd Backend
  ./mvnw spring-boot:run
  # hoặc: mvn spring-boot:run
  ```
  Backend sẽ chạy tại cổng `8080`.

#### 3. Khởi chạy Frontend (Node.js)
- Yêu cầu: **Node.js 18+** (hoặc 20+).
  ```bash
  cd Frontend
  npm install
  ```
- Tạo file `.env` tại thư mục `Frontend/.env` (tham khảo `Frontend/.env.example`):
  ```env
  PORT=3124
  URL=http://localhost:3124
  DB_HOST=localhost
  DB_PORT=3307
  DB_NAME=tourdlhdv
  DB_USER=tourdl
  DB_PASSWORD=tourdlpass
  DB_DIALECT=mysql
  COOKIE_SIGNED=tourdl-cookie-secret
  JWT_SECRET=tourdl-dev-jwt-secret-key-1234567890
  JWT_ALGORITHM=HS256
  JWT_EXPIRES_IN=3600000
  ```
- Khởi chạy server:
  ```bash
  npm start
  ```
- Truy cập trình duyệt: [http://localhost:3124](http://localhost:3124)

---

## ⚙️ Cấu hình biến môi trường

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `PORT` | `3124` | Cổng hoạt động của Frontend |
| `SERVER_PORT` | `8080` | Cổng hoạt động của Backend Spring Boot |
| `MYSQL_PORT` | `3307` | Cổng ánh xạ MySQL ra ngoài máy host |
| `MYSQL_DATABASE` | `tourdlhdv` | Tên cơ sở dữ liệu |
| `MYSQL_USER` | `tourdl` | Tên người dùng database |
| `MYSQL_PASSWORD` | `tourdlpass` | Mật khẩu database |
| `JWT_SECRET` | `tourdl-dev-jwt-...` | Khóa bí mật ký JWT Token |
| `JWT_EXPIRATION` | `3600000` (1h) | Thời gian hết hạn JWT (ms) |

