# Hướng dẫn thiết lập Google Apps Script Backend (Nihongo Local)

Tài liệu hướng dẫn triển khai Web App Serverless trên **Google Apps Script** phục vụ làm Proxy an toàn cho Gemini AI và ghi nhận phản hồi vào Google Sheets.

---

## 🛠️ Bước 1: Tạo Google Sheets & Script

1. Mở [Google Sheets](https://sheets.new) và tạo một bảng tính mới đặt tên: `Nihongo Local - Reports`.
2. Tạo sẵn 2 sheet (tab) bên dưới:
   - Tab 1: `Feedback`
   - Tab 2: `SessionSummaries`
3. Copy **Spreadsheet ID** từ thanh địa chỉ trình duyệt:
   - URL có dạng: `https://docs.google.com/spreadsheets/d/`**`1a2b3c4d5e6f7g8h...`**`/edit`
   - Phần in đậm chính là `FEEDBACK_SHEET_ID`.
4. Trên thanh menu, chọn: **Tiện ích mở rộng (Extensions) ➔ Apps Script**.
5. Xóa hết code mặc định trong file `Code.gs` và dán toàn bộ nội dung trong file [`gas/Code.js`](file:///Users/ccvn/Desktop/japanese-study/gas/Code.js) vào.

---

## 🔑 Bước 2: Cài đặt Script Properties (Bảo mật API Key)

Trong giao diện Google Apps Script:
1. Nhấp vào biểu tượng **Cài đặt dự án (Project Settings ⚙️)** ở cột bên trái.
2. Kéo xuống mục **Thuộc tính tập lệnh (Script Properties)** ➔ bấm **Thêm thuộc tính tập lệnh (Add script property)**.
3. Thêm các biến sau:
   - `GEMINI_API_KEY`: API Key lấy từ [Google AI Studio](https://aistudio.google.com/).
   - `FEEDBACK_SHEET_ID`: Spreadsheet ID bạn đã copy ở Bước 1.
   - `APP_SHARED_SECRET`: (Tùy chọn) Mã bí mật ví dụ `nihongo_local_secret_2026`.
4. Bấm **Lưu thuộc tính tập lệnh (Save script properties)**.

---

## 🚀 Bước 3: Triển khai thành Web App (Deploy)

1. Ở góc trên bên phải, bấm nút **Triển khai (Deploy) ➔ Triển khai mới (New deployment)**.
2. Nhấp vào biểu tượng bánh răng ⚙️ bên cạnh *"Chọn loại"* ➔ chọn **Ứng dụng web (Web app)**.
3. Cấu hình:
   - **Mô tả:** `Nihongo Local Backend v1`
   - **Thực thi dưới dạng (Execute as):** `Tôi (Your email)`
   - **Ai có quyền truy cập (Who has access):** `Bất kỳ ai (Anyone)` *(Bắt buộc chọn Anyone để app gửi request được)*.
4. Bấm **Triển khai (Deploy)** ➔ Cấp quyền truy cập Google nếu được hỏi.
5. Copy **URL ứng dụng web (Web app URL)**:
   - URL có dạng: `https://script.google.com/macros/s/AKfycbx.../exec`

---

## 📱 Bước 4: Cấu hình URL vào ứng dụng Mobile

1. Mở file `.env` (hoặc `.env.local`) trong thư mục gốc của app và thêm dòng:
   ```env
   EXPO_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/AKfycbx.../exec
   ```
2. Khởi động lại Expo (`npx expo start -c`) để nhận cấu hình mới.

## 📚 Nghĩa tiếng Việt cho từ vựng (Việt Sub)

Ứng dụng hiện được trang bị sẵn **8,385 từ vựng JLPT (N5 - N1)** đã được gắn nghĩa **Thuần Việt** tự nhiên (không dùng âm Hán-Việt khô cứng).

### Trạng thái tích hợp tự động:
Toàn bộ mã nguồn và dữ liệu đã được tự động đẩy trực tiếp vào dự án Google Apps Script của bạn tại [script.google.com project edit](https://script.google.com/u/1/home/projects/1sEZq5gxS0PAqKF_-Onsk4pcRlUWvOVxAnGcOmd8hfNGpjWGnE3ORvpwy/edit):
- `Code.gs` (Router API và Gemini Proxy)
- `VocabularySubtitles_Part1.gs` (Kho dữ liệu Việt Sub phần 1)
- `VocabularySubtitles_Part2.gs` (Kho dữ liệu Việt Sub phần 2 & hàm tra cứu tự động)
- `appsscript.json` (Cấu hình quyền Web App V8)

### Các bước hoàn tất trong Apps Script Editor:
1. Mở dự án tại [Google Apps Script Editor](https://script.google.com/u/1/home/projects/1sEZq5gxS0PAqKF_-Onsk4pcRlUWvOVxAnGcOmd8hfNGpjWGnE3ORvpwy/edit) (F5 tải lại trang để thấy các file).
2. Chọn hàm `doGet` ở thanh chọn hàm trên cùng và bấm nút **Chạy (Run ▶️)** một lần để cấp quyền Google Account nếu được hỏi.
3. Nhấp vào **Triển khai (Deploy) ➔ Quản lý bản triển khai (Manage deployments)**:
   - Bạn sẽ thấy bản triển khai Web App sẵn sàng với URL:
     `https://script.google.com/macros/s/AKfycbz3jvjPF01JNpUciXuB9TrqL9etIoUm78c0sg1-JqiqIZYxx3jbP23z7dMQ6Iu0XTjj/exec`
4. Cấu hình Script Properties (nếu dùng thêm Gemini AI để mở rộng):
   - `GEMINI_API_KEY`: API Key Gemini của bạn.
   - `FEEDBACK_SHEET_ID`: Spreadsheet ID của bạn.

---

## 🧪 Kiểm tra Endpoint (Health Check)
Mở trình duyệt và truy cập URL deploy kèm tham số:
`https://script.google.com/macros/s/AKfycbx.../exec?path=/health`

Kết quả trả về:
```json
{
  "ok": true,
  "version": "v1",
  "service": "nihongo-local-gas"
}
```
