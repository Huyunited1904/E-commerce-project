# E-commerce Web Application

Ứng dụng thương mại điện tử đang được phát triển với React, Node.js/Express và MySQL. Project tập trung xây dựng backend theo từng module, từ xác thực tài khoản đến quản lý danh mục và sản phẩm.

Mục tiêu là xây dựng một sản phẩm fullstack, đồng thời thực hành thiết kế API, tổ chức code theo tầng, bảo vệ các chức năng quản trị và tối ưu những truy vấn lặp lại.

> Trạng thái: đang phát triển. Backend đã triển khai Authentication và Category CRUD, với các luồng cơ bản được kiểm thử thủ công bằng Postman. Bước tiếp theo là xây dựng module Product và tích hợp frontend. Project chưa sẵn sàng cho môi trường production.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MySQL |
| MySQL client | mysql2 với Promise API và connection pool |
| Xác thực đăng nhập | JSON Web Token (JWT) |
| Hash mật khẩu | bcrypt |
| Token xác thực email | Token ngẫu nhiên và SHA-256 |
| Gửi email | Nodemailer, SMTP |
| Cấu hình môi trường | dotenv |
| Phát triển và kiểm thử API | nodemon, Postman |

## Chức năng và tiến độ

| Module | Chức năng | Trạng thái |
| --- | --- | --- |
| Authentication | Đăng ký tài khoản, kiểm tra email trùng, hash mật khẩu | Đã triển khai |
| Authentication | Tạo và gửi link xác thực email | Đã triển khai |
| Authentication | Kiểm tra token email, thời hạn và trạng thái đã sử dụng | Đã triển khai |
| Authentication | Đăng nhập, kiểm tra email đã xác thực và cấp JWT | Đã triển khai |
| Authentication | Xác minh JWT cho API được bảo vệ | Đã triển khai |
| User | Lấy thông tin tài khoản đang đăng nhập | Đã triển khai |
| Authorization | Kiểm tra quyền admin cho thao tác quản trị | Đã triển khai; đã sử dụng JWT admin khi thử API Category |
| Category | Tạo danh mục và kiểm tra tên trùng | Đã triển khai; đã thử luồng tạo thành công |
| Category | Lấy danh sách danh mục và cache trong bộ nhớ | Đã triển khai; đã thử lấy danh sách |
| Category | Cập nhật một phần thông tin danh mục bằng PATCH | Đã triển khai; đã thử cập nhật riêng mô tả |
| Category | Xóa danh mục | Đã triển khai; đã thử luồng cơ bản |
| Product | Quản lý và tra cứu sản phẩm | Kế hoạch |
| Frontend | Giao diện đăng ký, xác thực email và đăng nhập | Kế hoạch tích hợp |

## Tổ chức mã nguồn

Project gồm hai phần chính:

```text
backend/
  src/
    config/         # Cấu hình kết nối database và dịch vụ
    routes/         # Khai báo endpoint và middleware
    middlewares/    # Xác thực, phân quyền, kiểm tra đầu vào, xử lý lỗi
    controllers/    # Nhận request và trả HTTP response
    services/       # Xử lý nghiệp vụ
    models/         # Thực thi truy vấn MySQL
    app.js          # Cấu hình Express và gắn routes
    server.js       # Khởi động ứng dụng
frontend/
  public/
  src/
README.md
```

Đây là mô tả các thư mục chính; tên và số lượng file trong từng module có thể thay đổi theo tiến độ phát triển.

### Luồng xử lý request

Route chọn các middleware và controller tương ứng. Controller lấy dữ liệu từ request, gọi service và gửi response. Service kiểm tra điều kiện nghiệp vụ, sau đó gọi model khi cần đọc hoặc ghi database.

Khi xảy ra lỗi, controller chuyển lỗi bằng `next(error)` tới middleware xử lý lỗi tập trung.

### Luồng đăng ký và xác thực email

1. Người dùng gửi họ tên, email và mật khẩu.
2. Backend kiểm tra đầu vào, chuẩn hóa email và kiểm tra email đã tồn tại.
3. Mật khẩu được hash trước khi lưu vào bảng người dùng.
4. Backend tạo token xác thực, lưu token hash cùng user ID, thời hạn và trạng thái sử dụng vào MySQL.
5. Email gửi tới người dùng chứa link có token gốc.
6. Khi nhận yêu cầu xác thực, backend hash token được gửi lên và tìm bản ghi tương ứng.
7. Token hợp lệ, chưa sử dụng và còn hạn thì backend cập nhật trạng thái email của user và đánh dấu token đã dùng.

### Luồng đăng nhập

1. Tìm user bằng email đã chuẩn hóa.
2. Kiểm tra mật khẩu bằng `bcrypt.compare`.
3. Kiểm tra trạng thái xác thực email.
4. Cấp JWT chứa thông tin định danh và quyền.
5. Client gửi JWT trong header `Authorization: Bearer <token>` khi gọi API cần đăng nhập.

### Cache danh mục

Danh sách category được cache trong bộ nhớ của tiến trình backend với TTL 60 giây. Khi cache còn hạn, service trả dữ liệu từ cache. Khi tạo, cập nhật hoặc xóa category thành công, cache được xóa để lần đọc sau lấy dữ liệu mới từ MySQL.

Cache hiện tại chỉ có hiệu lực trong một tiến trình và mất khi backend khởi động lại.

## Chạy project trên máy cá nhân

### Yêu cầu

- Node.js và npm.
- MySQL Server đang chạy.
- Một database riêng cho project.
- Tài khoản SMTP để thử chức năng gửi email xác thực.

### 1. Cài dependencies

Tại thư mục gốc project:

```bash
cd backend
npm install
```

Cài dependencies frontend trong một terminal khác:

```bash
cd frontend
npm install
```

### 2. Tạo database

Trong MySQL Workbench hoặc MySQL client:

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db
  CHARACTER SET utf8mb4;

USE ecommerce_db;
```

Các hàm khởi tạo bảng trong backend cần được gọi khi khởi động ứng dụng. Nếu dự án đã chuyển sang dùng script SQL hoặc migration, hãy chạy theo cơ chế đó.

### 3. Cấu hình backend

Tạo file `backend/.env`. Các giá trị cần cấu hình gồm:

| Nhóm | Giá trị cần cung cấp |
| --- | --- |
| Server | Cổng chạy backend, ví dụ 5000 |
| MySQL | Host, port, user, password, database |
| JWT | Secret dùng để ký và xác minh JWT |
| Email | SMTP host, port, tài khoản gửi và mật khẩu ứng dụng hoặc credential SMTP |
| Link xác thực | URL trang frontend nhận token xác thực email |

Tên biến trong `.env` phải khớp với các biến `process.env` đang được đọc trong code. Không sao chép tên biến cấu hình từ tài liệu khác khi chưa đối chiếu.

Với Gmail SMTP, dùng mật khẩu ứng dụng theo cấu hình tài khoản, không dùng mật khẩu đăng nhập Gmail thông thường.

Không commit file `.env`, JWT secret hoặc thông tin đăng nhập SMTP. Có thể cung cấp `.env.example` chỉ chứa tên biến và giá trị mẫu, không chứa credential thật.

### 4. Khởi động backend

Chạy trong thư mục `backend`:

```bash
npm run dev
```

Nếu PowerShell không cho chạy `npm.ps1`, có thể dùng:

```powershell
npm.cmd run dev
```

Backend được cấu hình cổng 5000 thì có thể kiểm tra:

```http
GET http://localhost:5000/api/health
```

### 5. Khởi động frontend

Chạy trong thư mục `frontend`:

```bash
npm run dev
```

Mở URL do Vite hiển thị trong terminal. Cấu hình địa chỉ API phía frontend trỏ tới cổng backend thực tế.

## API chính

Các đường dẫn dưới đây phản ánh thiết kế đang phát triển; đối chiếu các file routes khi thay đổi endpoint.

| Method | Endpoint | Chức năng | Quyền truy cập |
| --- | --- | --- | --- |
| GET | `/api/health` | Kiểm tra backend đang chạy | Công khai |
| POST | `/api/auth/register` | Đăng ký tài khoản | Công khai |
| POST | `/api/auth/verify-email` | Xác thực email bằng token | Công khai; yêu cầu token hợp lệ |
| POST | `/api/auth/login` | Đăng nhập và nhận JWT | Công khai |
| GET | `/api/auth/profile` | Lấy thông tin tài khoản hiện tại | Đã đăng nhập |
| POST | `/api/category` | Tạo danh mục | Admin |
| GET | `/api/category` | Lấy danh sách danh mục | Công khai |
| PATCH | `/api/category/:id` | Cập nhật một phần danh mục | Admin |
| DELETE | `/api/category/:id` | Xóa danh mục | Admin |

Các thao tác POST, PATCH và DELETE Category chạy qua middleware xác thực JWT và kiểm tra quyền admin. DELETE hiện xóa hẳn bản ghi; quy tắc xử lý danh mục còn chứa sản phẩm sẽ được bổ sung cùng module Product.

## Kiểm thử thủ công

Authentication được kiểm tra qua Postman trong quá trình phát triển. Các trường hợp cần kiểm tra lại khi thay đổi code:

- Đăng ký hợp lệ, email trùng và dữ liệu đầu vào không hợp lệ.
- Token xác thực email hợp lệ, sai, hết hạn và đã sử dụng.
- Đăng nhập đúng hoặc sai mật khẩu; tài khoản chưa xác thực email.
- Gọi profile khi không có JWT, JWT sai, hết hạn hoặc hợp lệ.
- Gọi API quản trị bằng tài khoản thường và tài khoản admin.

Các luồng Category đã chạy thử trong quá trình phát triển:

- Đăng nhập lại sau khi cấp quyền admin để lấy JWT mới.
- Tạo danh mục bằng POST và lấy danh sách bằng GET.
- PATCH riêng mô tả, giữ nguyên tên danh mục.
- Gọi GET sau cập nhật để kiểm tra dữ liệu mới được trả về.
- Xóa danh mục qua DELETE theo ID.

Các trường hợp cần kiểm thử bổ sung hoặc kiểm tra lại khi sửa code:

- PATCH riêng tên và kiểm tra chuẩn hóa khoảng trắng, chữ hoa.
- Tạo hoặc cập nhật tên bị trùng; gửi tên rỗng hoặc sai kiểu dữ liệu.
- PATCH với body rỗng và kiểm tra cách xử lý các trường không được gửi.
- PATCH hoặc DELETE với ID không hợp lệ hoặc không tồn tại.
- DELETE lại cùng ID sau khi đã xóa thành công.
- Gọi API quản trị khi không có JWT, JWT không hợp lệ hoặc tài khoản không có quyền admin.
- Gọi GET ngay sau POST, PATCH và DELETE để kiểm tra cache được làm mới; kiểm tra thêm khi TTL hết hạn.

## Kế hoạch phát triển

- Mở rộng kiểm thử các trường hợp lỗi và phân quyền của Category CRUD.
- Bổ sung quy tắc xử lý danh mục đang có sản phẩm khi xây dựng module Product.
- Xây dựng module Product và liên kết với Category.
- Tích hợp các luồng Authentication vào frontend.
- Bổ sung gửi lại email xác thực và xử lý tài khoản chưa xác thực.
- Hoàn thiện xử lý tình huống tạo tài khoản thành công nhưng gửi email thất bại.
- Bổ sung kiểm thử tự động, giới hạn tần suất request và chiến lược quản lý phiên đăng nhập.
- Chuẩn hóa cấu hình môi trường và quy trình triển khai.

## Tác giả

Nguyễn Quang Huy

