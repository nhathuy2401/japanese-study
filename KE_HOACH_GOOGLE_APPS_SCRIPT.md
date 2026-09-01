# Kế hoạch tích hợp Google Apps Script (GAS)

## Mục tiêu

Giữ ứng dụng **local-first**: học bài, SRS/FSRS, tiến độ, notebook và dữ liệu N5 tiếp tục hoạt động hoàn toàn trên thiết bị. Chỉ đưa một số tác vụ vốn cần Internet lên Google Apps Script để:

- Không yêu cầu người học tự tạo và dán Gemini API key.
- Không đưa Gemini API key vào bundle Expo hoặc Expo SecureStore trên máy người dùng.
- Có một nơi nhận phản hồi sản phẩm nhỏ gọn.
- Giữ phạm vi vận hành đơn giản, chưa cần Google Login hay cơ sở dữ liệu cloud.

> Cập nhật định hướng: dùng Firebase **Spark plan** (không gắn Cloud Billing) cho Google Login và đồng bộ dữ liệu học. GAS vẫn phục vụ Gemini/feedback; không dùng Cloud Functions.

## Quyết định đã chốt

- **Cloud Firestore là source of truth duy nhất** cho dữ liệu học có thể đồng bộ: settings, progress, streak và FSRS review state.
- **Local storage vẫn là lớp hoạt động đầu tiên** khi offline; Firestore đồng bộ các thay đổi khi có mạng.
- **Google Sheets không lưu state học chi tiết** và không dùng để khôi phục dữ liệu cho app.
- GAS chỉ ghi vào Sheet các báo cáo tổng hợp theo phiên học và feedback tự nguyện. Một lỗi GAS/Sheet không được làm thất bại thao tác học hoặc sync Firestore.

## Phạm vi giai đoạn 1

| Chức năng | Hiện tại | Sau khi chuyển | Lý do |
| --- | --- | --- | --- |
| Giải thích ngữ pháp AI | App gọi Gemini trực tiếp bằng API key người dùng | App gọi `POST /ai/grammar-explanation` của GAS; GAS gọi Gemini | Che giấu API key và kiểm soát prompt/quota tập trung |
| Chấm câu viết AI | App gọi Gemini trực tiếp bằng API key người dùng | App gọi `POST /ai/writing-feedback` của GAS; GAS gọi Gemini | Cùng lợi ích bảo mật và dễ áp dụng giới hạn sử dụng |
| Gửi feedback/lỗi | Chưa có endpoint tập trung | App gọi `POST /feedback`; GAS ghi một dòng vào Google Sheets | Không cần backend hoặc đăng nhập |
| Đăng nhập Google | Chưa có | Firebase Authentication, Google provider | Tạo tài khoản tùy chọn để bật sao lưu/đồng bộ |
| Đồng bộ dữ liệu học | Chỉ lưu local | Cloud Firestore: profile, settings, progress và review state | Đồng bộ đa thiết bị, vẫn giữ local-first |
| Báo cáo học tập | Chưa có | GAS ghi summary một dòng/phiên vào Google Sheets | Dễ xem dashboard, không ảnh hưởng state học |
| Dịch nghĩa từ vựng | API từ vựng trả nghĩa Anh | App gửi tối đa 20 gloss mới/lần tới `POST /ai/vocabulary-translation`; cache trên thiết bị | Có nghĩa Việt tự nhiên mà không biến GAS thành nguồn dữ liệu từ vựng |

## Ngoài phạm vi

Không chuyển các phần sau sang GAS trong giai đoạn 1:

- FSRS/SRS, streak, daily quest, tiến độ học, notebook và cài đặt cá nhân.
- Bộ dữ liệu N5 seed và màn hình học/review.
- GAS không làm API dữ liệu từ vựng chính. App vẫn lấy từ/cách đọc từ endpoint Vercel; GAS chỉ dịch theo lô các gloss chưa cache để bổ sung nghĩa Việt.
- Thanh toán, subscription, Cloud Storage, Cloud Functions, Cloud Run hay bất cứ dịch vụ nào buộc nâng cấp sang Blaze.
- Lưu nội dung câu trả lời AI dài hạn theo người dùng.

## Thiết kế đề xuất

```text
Expo app
  ├─ Firebase Authentication: Google Sign-In (tùy chọn)
  ├─ Cloud Firestore: đồng bộ dữ liệu của chính người dùng
  └─ GAS client (HTTPS POST + requestId)
       └─ Google Apps Script Web App
            ├─ Router + kiểm tra input + rate limit cơ bản
            ├─ PropertiesService: GEMINI_API_KEY, APP_SHARED_SECRET
            ├─ Gemini API
            └─ Google Sheets: Feedback + session summaries (báo cáo, không phải source of truth)
```

## Firebase Spark plan: phạm vi và giới hạn

Chỉ bật các dịch vụ sau trong Firebase project:

| Dịch vụ | Mục đích | Quy tắc sử dụng |
| --- | --- | --- |
| Firebase Authentication | Google Sign-In | Đăng nhập là tùy chọn; không dùng Phone Auth/SMS |
| Cloud Firestore (Standard) | Sao lưu và đồng bộ | Chỉ một database mặc định; chỉ dữ liệu học của user hiện tại |
| App Check | Giảm lạm dụng từ client không hợp lệ | Bật sau khi bản beta đăng nhập ổn định |
| Crashlytics / Analytics | Theo dõi lỗi và usage tổng hợp | Không gửi nội dung câu học hay API key |

Giữ project ở **Spark**, không liên kết Cloud Billing. Theo quota miễn phí hiện tại, Firestore có 1 GiB storage, 50.000 document reads/ngày, 20.000 writes/ngày, 20.000 deletes/ngày và 10 GiB egress/tháng. Khi chạm quota, tính năng cloud phải báo lỗi/đợi reset, không được tự nâng lên Blaze. [Firebase pricing](https://firebase.google.com/pricing)

Cloud Functions bị loại khỏi kiến trúc vì yêu cầu Blaze. Gemini tiếp tục đi qua GAS, do đó không cần billing Firebase. [Firebase Functions quota](https://firebase.google.com/docs/functions/quotas)

### Mô hình dữ liệu Firestore tối giản

```text
users/{uid}
  ├─ profile              # displayName, photoURL, createdAt
  ├─ settings             # các cài đặt có thể đồng bộ
  ├─ progress/current     # streak, totals, updatedAt
  └─ reviews/{itemId}     # trạng thái FSRS của từng item
```

- Security Rules bắt buộc chỉ cho phép `request.auth.uid == uid`; tuyệt đối không dùng rule mở công khai.
- Local database vẫn là nguồn hoạt động chính. Chỉ queue các thay đổi rồi sync theo debounce/batch, khi mở app hoặc khi mạng trở lại.
- Không dùng realtime listener toàn collection. Chỉ đọc khi khởi động, sau login, thao tác sync tay hoặc có thay đổi local cần resolve; điều này giữ số reads thấp.
- Nếu hai thiết bị cùng sửa một item, dùng `updatedAt` và last-write-wins trong beta; hiển thị lần sync gần nhất trong Settings.
- Lần Google login đầu tiên: hỏi người dùng có muốn upload dữ liệu local hiện tại hay lấy bản cloud. Không âm thầm ghi đè.

### Endpoints

Tất cả request dùng JSON, trả JSON. Base URL không được hard-code trong nhiều file; dùng một cấu hình duy nhất (`EXPO_PUBLIC_GAS_API_URL`).

| Endpoint | Payload tối thiểu | Response |
| --- | --- | --- |
| `POST /ai/grammar-explanation` | `pattern`, `level`, `requestId` | `simpleExplanationVi`, `practicalNuance`, `examples[]` |
| `POST /ai/writing-feedback` | `sentence`, `targetGrammar`, `level`, `requestId` | Giữ đúng `WritingFeedback` hiện có |
| `POST /feedback` | `message`, `category`, `appVersion`, `requestId` | `{ "ok": true }` |
| `POST /analytics/session-summary` | `uidHash`, `date`, `level`, `reviewed`, `correct`, `durationSeconds`, `requestId` | `{ "ok": true }` |
| `GET /health` | — | `{ "ok": true, "version": "v1" }` |

`/analytics/session-summary` chỉ được gọi tối đa một lần khi kết thúc phiên học hoặc khi app vào background, có queue/retry nền. Không gửi API key, email, tên, từng câu trả lời hoặc toàn bộ lịch sử học. Với feedback, hiển thị thông báo rõ cho người dùng trước khi gửi.

### Bảo mật và giới hạn

- Lưu `GEMINI_API_KEY` chỉ trong **Script Properties**, không trong source code, `app.json` hoặc biến `EXPO_PUBLIC_*`.
- Web App bắt buộc HTTPS và chạy bằng tài khoản chủ sở hữu script.
- Một shared secret trong app **không phải** là lớp bảo mật mạnh (có thể bị trích từ bundle); chỉ dùng để giảm request ngẫu nhiên. Không xem đó là cơ chế xác thực.
- Thêm `requestId`, giới hạn độ dài input, kiểm tra method/content type và từ chối endpoint không hợp lệ.
- Rate limit theo mã định danh cài đặt ngẫu nhiên của app, ví dụ 10 request AI/giờ/thiết bị. Đặt giới hạn thấp lúc beta để tránh phát sinh chi phí/quota.
- Không ghi câu viết vào Sheet trong giai đoạn 1. Chỉ ghi feedback khi người dùng chủ động gửi.
- Định nghĩa timeout client 20 giây, retry tối đa một lần cho lỗi mạng, không retry với lỗi 4xx.

## Các bước thực hiện

### 1. Thiết lập Firebase Spark

1. Tạo Firebase project mới, xác nhận đang ở Spark và không liên kết Cloud Billing.
2. Bật Google provider trong Firebase Authentication; khai báo Android package và iOS bundle ID đúng theo `app.json`.
3. Tạo Cloud Firestore Standard database mặc định và deploy Security Rules theo `users/{uid}`.
4. Cài Firebase JS SDK, `@react-native-async-storage/async-storage` cho Auth persistence và luồng Google OAuth tương thích Expo.
5. Thêm màn hình “Đăng nhập để sao lưu & đồng bộ”; người dùng có thể bỏ qua và tiếp tục học offline.
6. Viết sync service local-to-Firestore theo batch/debounce, thêm nút “Đồng bộ ngay” và trạng thái lần sync cuối.

### 2. Tạo Apps Script độc lập

1. Tạo Google Sheet `Nihongo Local - Reports`, gồm hai tab `Feedback` và `SessionSummaries`; ghi lại spreadsheet ID.
2. Tạo Apps Script standalone và tạo Script Properties: `GEMINI_API_KEY`, `APP_SHARED_SECRET`, `FEEDBACK_SHEET_ID`.
3. Cài router `doGet`/`doPost`, validator và các handler theo bảng endpoint.
4. Dùng prompt/schema JSON tương đương `src/services/ai/gemini.ts`; validate response từ Gemini trước khi trả về app.
5. Deploy thành Web App. Ghi URL deploy và version vào tài liệu vận hành, không commit secret.

### 3. Bổ sung client GAS trong Expo

1. Tạo `src/services/api/gasClient.ts`: base URL, timeout, parse JSON lỗi, `requestId`.
2. Tách type request/response dùng chung từ `src/services/ai/gemini.ts` để UI/store không bị thay đổi contract.
3. Đổi `GeminiService.checkWriting` và `GeminiService.explainGrammar` sang gọi GAS.
4. Giữ `AiStore` và UI bottom sheet gần như nguyên trạng; bảo toàn error message thân thiện.
5. Thêm `src/services/feedback/feedbackService.ts` và một điểm vào nhỏ trong Settings, ví dụ “Gửi góp ý”.
6. Thêm `src/services/analytics/sessionSummaryService.ts`; chỉ tạo một summary khi kết thúc phiên review, không log từng thẻ.

### 4. Chuyển UI AI theo từng đợt

1. Đợt beta: giữ chế độ “API key cá nhân” làm fallback để không chặn người dùng cũ.
2. Test GAS trên thiết bị thật và kiểm tra quota/error logs.
3. Khi endpoint ổn định: bật GAS làm mặc định, thay phần nhập key bằng mô tả quyền riêng tư và giới hạn AI.
4. Bản phát hành kế tiếp: migration xóa key Gemini đã lưu bằng `deleteGeminiApiKey`; sau đó xóa luồng nhập/test key và code gọi Gemini trực tiếp.

### 5. Kiểm thử trước khi phát hành

- Unit test: parse/validation các response hợp lệ, JSON lỗi, timeout và rate-limit.
- Manual test trên iOS/Android: cả Wi-Fi, 4G/5G, offline và thao tác liên tục.
- Test Google login, logout, restore session, upload local data lần đầu và conflict giữa hai thiết bị.
- Test Firestore Rules bằng Firebase Emulator Suite trước khi deploy; đảm bảo user A không đọc/ghi được `users/{uid}` của user B.
- Verify phản hồi Gemini không làm vỡ schema UI hiện tại.
- Verify Sheet chỉ nhận feedback tự nguyện và session summary tổng hợp; không ghi review state hoặc nội dung câu trả lời.
- Verify Sheet chỉ nhận một summary tổng hợp/phiên; việc endpoint này lỗi không ảnh hưởng Firestore sync hoặc luồng review.
- Check quota sau một tuần beta; theo dõi tỉ lệ lỗi, latency p95 và số request AI/ngày.

## Tiêu chí hoàn thành giai đoạn 1

- Người dùng mới dùng được hai chức năng AI mà không cần Gemini API key.
- Không còn Gemini key trong client release sau khi kết thúc migration.
- Lỗi mạng/quota hiển thị rõ ràng, không làm crash màn hình học.
- Feedback được ghi được vào Sheet với timestamp, category, message, app version và request ID.
- Sheet có dashboard log theo phiên học, nhưng xóa Sheet hoàn toàn không làm mất dữ liệu học hay làm app không sync được.
- Toàn bộ chức năng học offline vẫn dùng được khi GAS/Gemini không khả dụng.

## Quyết định cần chốt trước khi code

1. Dùng quota AI miễn phí nội bộ cho beta hay bật một số lượt AI miễn phí mỗi ngày?
2. Feedback Sheet nên nhận ảnh chụp màn hình hay chỉ text trong giai đoạn 1? Khuyến nghị: chỉ text.
3. Khi hết quota, có hiện lời mời nhập API key cá nhân làm fallback không? Khuyến nghị: không trong beta đầu, để luồng đơn giản và đo quota thật.
