# Nihongo Local — Kế hoạch xây dựng ứng dụng học tiếng Nhật cá nhân

> Tài liệu sản phẩm và kỹ thuật cho ứng dụng React Native + Expo, học từ nhập môn đến JLPT N2, ưu tiên ngữ pháp, pitch accent (cao độ) và kanji. Ứng dụng hoạt động offline-first; Gemini là trợ giảng tùy chọn qua Wi‑Fi hoặc dữ liệu di động 3G/4G/5G khi người dùng bật AI và tự nhập API key.

## 1. Tóm tắt sản phẩm

**Tên tạm:** Nihongo Local  
**Nền tảng:** iOS và Android  
**Đối tượng:** Một người dùng cá nhân, tự học từ số 0 hoặc ôn JLPT N5 → N4 → N3 → N2  
**Công nghệ chính:** React Native, Expo, TypeScript, Expo Router, MobX, Prisma ORM và SQLite local  
**Ngôn ngữ giao diện:** Tiếng Việt; nội dung học gồm tiếng Nhật, kana, romaji tùy chọn và nghĩa tiếng Việt  
**Nguyên tắc:** Không cần đăng nhập, không phụ thuộc server, không cần mạng cho các chức năng học cốt lõi. AI chỉ cần kết nối internet và Gemini API key do chính người dùng nhập.

### Mục tiêu

- Xây dựng lộ trình rõ ràng từ bảng chữ cái đến trình độ N2.
- Học ngữ pháp theo mẫu câu, sắc thái, ngữ cảnh và lỗi người Việt thường gặp.
- Ghi nhớ kanji bằng thành phần, âm On/Kun, từ vựng và ôn cách quãng.
- Luyện cao độ tiếng Nhật theo mora và mẫu pitch accent, không chỉ nghe rồi lặp lại cảm tính.
- Duy trì thói quen bằng phiên học ngắn, streak, nhiệm vụ và báo cáo tiến độ.
- Dùng Gemini để giải thích, tạo ví dụ và chấm bài; app vẫn dùng tốt khi không có Gemini.

### Không thuộc phạm vi bản đầu

- Mạng xã hội, bảng xếp hạng hoặc tài khoản nhiều người dùng.
- Đồng bộ cloud tự động.
- Lớp học trực tiếp với giáo viên.
- Cam kết chấm phát âm chính xác như một hệ thống ngữ âm chuyên dụng.
- Tự động tạo toàn bộ giáo trình bằng AI mà không qua kiểm duyệt.

## 2. Nguyên tắc trải nghiệm học

1. **Học ít nhưng đều:** một phiên mặc định 10–20 phút.
2. **Nhớ chủ động:** ưu tiên tự trả lời, điền câu, viết và nói trước khi xem đáp án.
3. **Ôn đúng lúc:** mọi nội dung quan trọng đều đi qua hệ thống SRS.
4. **Học trong ngữ cảnh:** mỗi điểm ngữ pháp và kanji phải có câu ví dụ tự nhiên.
5. **Không phụ thuộc romaji:** hiển thị romaji ở giai đoạn nhập môn và có thể tắt hoàn toàn.
6. **Phân biệt “đúng JLPT” và “tự nhiên khi giao tiếp”:** giải thích rõ văn viết, văn nói, trang trọng và thân mật.
7. **AI không phải nguồn chân lý:** nội dung AI được đánh dấu, có nút báo sai và không tự ghi vào giáo trình chuẩn nếu chưa được người dùng duyệt.

## 3. Lộ trình nội dung N5 → N2

Các con số kanji dưới đây là **mục tiêu nội bộ để lập kế hoạch**, không phải danh sách chính thức của JLPT.

| Chặng | Trọng tâm | Mục tiêu kanji tích lũy gợi ý | Kết quả mong đợi |
|---|---|---:|---|
| Nhập môn | Hiragana, katakana, trường âm, âm ngắt, âm ghép, mora, câu chào hỏi | 0–30 | Đọc kana và phát âm nhịp cơ bản |
| N5 | Trợ từ, chia động/tính từ, tồn tại, thời gian, đếm, câu đơn | ~100 | Hiểu và tạo câu sinh hoạt rất cơ bản |
| N4 | Thể て, thể thường, khả năng, dự định, kinh nghiệm, mệnh đề bổ nghĩa | ~300 | Giao tiếp các tình huống quen thuộc |
| N3 | Liên kết câu, suy đoán, điều kiện, bị động/sai khiến, sắc thái trung cấp | ~650 | Đọc và nghe nội dung đời sống ở tốc độ vừa |
| N2 | Ngữ pháp văn viết, lập luận, sắc thái gần nghĩa, đọc hiểu dài | ~1.000 | Hiểu nội dung phổ thông phức tạp và ôn thi N2 |

Mỗi chặng gồm bốn loại bài:

- **Learn:** học kiến thức mới bằng giải thích ngắn và ví dụ.
- **Drill:** bài tập có mục tiêu, phản hồi ngay.
- **Review:** ôn bằng SRS.
- **Checkpoint:** kiểm tra tổng hợp để mở khóa chặng tiếp theo; vẫn cho phép người dùng bỏ qua nếu đã có nền tảng.

## 4. Các tính năng chính

### 4.1. Onboarding và đánh giá đầu vào

- Chọn mục tiêu: giao tiếp, JLPT N3, JLPT N2 hoặc củng cố nền tảng.
- Chọn thời lượng mỗi ngày: 10, 20, 30 hoặc 45 phút.
- Chọn ngày thi dự kiến nếu có.
- Tự đánh giá hoặc làm bài kiểm tra xếp trình độ ngắn.
- Tạo kế hoạch tuần, nhưng cho phép sửa bất kỳ lúc nào.
- Chọn cách hiển thị furigana và romaji: luôn hiện, hiện khi chạm hoặc ẩn.

### 4.2. Trang chủ “Hôm nay”

- Thẻ “Tiếp tục bài đang học”.
- Số thẻ đến hạn ôn, chia theo ngữ pháp/kanji/từ vựng.
- Nhiệm vụ ngày: một bài mới, một lượt ôn, một câu shadowing.
- Chuỗi ngày học và lịch heatmap.
- Cảnh báo nhẹ khi khối lượng ôn ngày mai quá lớn.
- Nút “Quick 5”: tạo phiên học nhanh gồm 5 câu ưu tiên cao nhất.

### 4.3. Ngữ pháp — trọng tâm số 1

Mỗi điểm ngữ pháp có:

- Mẫu cấu trúc, cách nối với danh từ/động từ/tính từ.
- Ý nghĩa ngắn và giải thích chi tiết bằng tiếng Việt.
- Sắc thái: tích cực/tiêu cực, chủ quan/khách quan, trang trọng/thân mật, văn nói/văn viết.
- Các mẫu dễ nhầm và bảng so sánh trực tiếp.
- 3–6 ví dụ có furigana, bản dịch và audio nếu có.
- Lỗi người Việt thường gặp.
- Ghi chú cá nhân và đánh dấu yêu thích.

Dạng bài tập:

- Chọn mẫu phù hợp theo ngữ cảnh.
- Điền phần còn thiếu.
- Sắp xếp cụm từ thành câu.
- Chuyển câu sang thể yêu cầu.
- Chọn câu tự nhiên hơn giữa hai phương án gần nghĩa.
- Dịch Việt → Nhật với nhiều đáp án hợp lệ.
- Tự viết câu, sau đó so với rubric hoặc nhờ Gemini góp ý.
- “Sửa lỗi”: tìm và sửa một lỗi cố ý trong câu.

### 4.4. Pitch accent và phát âm — trọng tâm số 2

Trong tài liệu này, “âm điệu” chủ yếu là **pitch accent/cao độ từ vựng**, kết hợp nhịp mora và ngữ điệu câu.

- Tách từ theo mora, ví dụ `が・っ・こ・う` thay vì đếm theo ký tự Latin.
- Vẽ đường cao độ thấp/cao trên từng mora.
- Gắn loại mẫu: heiban, atamadaka, nakadaka, odaka.
- Phát audio tốc độ thường và chậm, có loop A–B.
- Chế độ shadowing: nghe → đếm nhịp → thu âm → nghe đối chiếu.
- Waveform đơn giản để chọn lại đoạn thu.
- Lưu bản thu trong thiết bị và cho phép xóa hàng loạt.
- Bài “cặp dễ nhầm”: từ/cụm có âm gần nhau hoặc cao độ khác nhau.
- Tùy chọn ẩn đường pitch trước khi trả lời để luyện nhận biết.

Giới hạn kỹ thuật cần hiển thị trung thực:

- Speech-to-text chỉ kiểm tra nội dung được nói, không đủ để kết luận pitch accent đúng.
- MVP chấm bằng tự đối chiếu với audio mẫu và nhịp mora.
- Chấm cao độ tự động là tính năng nâng cao: trích đường F0, căn chỉnh mora và tính độ tương đồng; cần kiểm thử với nhiều giọng, giới tính và môi trường thu.
- Gemini có thể góp ý bản thu khi người dùng chủ động gửi, nhưng kết quả chỉ mang tính tham khảo và yêu cầu internet.

### 4.5. Kanji — trọng tâm số 3

Trang chi tiết kanji gồm:

- Ký tự, nghĩa gợi nhớ và cấp độ.
- Bộ thủ/thành phần, số nét, thứ tự nét nếu có dữ liệu.
- Âm On, âm Kun; chỉ nhấn mạnh cách đọc xuất hiện trong từ thực tế.
- 3–8 từ ghép ưu tiên theo tần suất/chặng học.
- Câu ví dụ liên kết với ngữ pháp đã mở khóa.
- Mnemonic mặc định và mnemonic cá nhân.
- Các chữ dễ nhầm về hình dạng hoặc cách đọc.

Dạng luyện tập:

- Nhìn kanji chọn nghĩa/cách đọc.
- Nghe từ rồi chọn kanji.
- Điền kanji trong câu.
- Ghép bộ phận thành chữ hoàn chỉnh.
- Viết theo thứ tự nét trên canvas; MVP tự đánh giá, bản sau mới chấm nét.
- “Kanji family”: khám phá nhóm chữ có cùng thành phần âm hoặc nghĩa.

### 4.6. Ôn tập SRS

- Hàng đợi riêng cho ngữ pháp, kanji và từ vựng nhưng có thể trộn trong một phiên.
- Các mức trả lời: `Quên`, `Khó`, `Được`, `Dễ`.
- Dùng thuật toán FSRS hoặc biến thể SM-2; ưu tiên FSRS nếu đội triển khai có bộ kiểm thử tốt.
- Lưu `stability`, `difficulty`, số lần quên và thời điểm đến hạn.
- “Leech card”: thẻ sai quá nhiều được chuyển sang phiên học lại, không tiếp tục ép ôn mù quáng.
- Giới hạn bài mới/ngày và tổng lượt ôn để tránh quá tải.
- Có nút hoàn tác ngay sau khi chấm nhầm.

### 4.7. Tra cứu và sổ tay

- Tìm theo kanji, kana, nghĩa tiếng Việt, tag và điểm ngữ pháp.
- Bộ lọc theo JLPT, đã học/chưa học, yêu thích và đến hạn ôn.
- Tạo ghi chú Markdown ngắn cho bài học.
- Lưu câu gặp ngoài đời vào “Sentence Mine”.
- Từ một câu đã lưu, người dùng có thể tự chọn phần cần che để tạo thẻ cloze.
- Liên kết hai chiều: câu → ngữ pháp/kanji và ngữ pháp/kanji → câu.

### 4.8. Vocabulary JLPT — tab học từ vựng riêng

- Tích hợp [JLPT Vocabulary API](https://jlpt-vocab-api.vercel.app/) qua REST, hỗ trợ dữ liệu N5 → N1.
- Tab `Từ vựng` cho phép chọn cấp độ, tìm theo từ tiếng Nhật và học theo bộ tối đa 20 flashcard.
- Mặt trước chỉ hiện từ; mặt sau hiện furigana, romaji và nghĩa tiếng Anh do API cung cấp.
- Người học tự chấm `Quên`, `Khó`, `Đã nhớ`; từ `Quên/Khó` được đưa vào vòng lặp lại trong cùng phiên.
- Validate response bằng Zod, timeout request, thông báo lỗi thân thiện và nút thử lại.
- Không dịch tự động nghĩa tiếng Anh thành tiếng Việt để tránh lưu bản dịch máy như nội dung chuẩn; bản sau có thể bổ sung lớp nghĩa tiếng Việt đã kiểm duyệt.
- Dữ liệu đã tải giữ trong session MobX; bước tiếp theo là cache SQLite và chuyển từ đã học thành SRS card bền vững.

## 5. Một số tính năng thú vị

### Daily Quest

Mỗi ngày sinh ba nhiệm vụ nhỏ theo tiến độ thực tế, ví dụ:

- Ôn 10 thẻ đến hạn.
- Nói lại 3 câu có mẫu `〜わけではない`.
- Tìm 2 kanji có bộ `言` trong các bài đã học.

### Grammar Detective

Cho một đoạn hội thoại ngắn, yêu cầu tìm mẫu ngữ pháp, giải thích sắc thái và chọn phương án thay thế. Sau khi trả lời mới hiện phân tích.

### Kanji Garden

Mỗi kanji đã “trưởng thành” qua các lần ôn sẽ trở thành một cây trong khu vườn. Đây chỉ là trực quan hóa tiến độ, không dùng cơ chế phạt làm mất cây.

### Pitch Echo

Phát một từ không hiện chữ; người dùng vẽ đường cao độ bằng thao tác vuốt, sau đó so với đáp án và nghe lại.

### One Sentence Diary

Mỗi ngày viết một câu tiếng Nhật. App liên kết câu đó với ngữ pháp đã học, lưu lịch sử sửa và có thể nhờ Gemini đưa ra tối đa ba góp ý ngắn.

### Boss Review

Cuối mỗi unit có một lượt ôn tổng hợp theo chủ đề. Không dùng mạng, lấy hoàn toàn từ ngân hàng câu hỏi local.

## 6. Thiết kế Gemini AI

Gemini là lớp hỗ trợ, không phải lõi bắt buộc của app.

### Chức năng AI đề xuất

- Giải thích lại một điểm ngữ pháp ở mức dễ hơn.
- So sánh hai mẫu gần nghĩa theo bảng: ý nghĩa, sắc thái, cấu trúc, ví dụ.
- Tạo thêm ví dụ chỉ dùng từ vựng trong cấp độ người học.
- Chấm câu tự viết theo rubric: đúng ngữ pháp, tự nhiên, sắc thái và đề xuất sửa.
- Tạo mini-quiz từ các lỗi gần đây.
- Trò chuyện nhập vai theo tình huống, có giới hạn mẫu ngữ pháp mục tiêu.
- Phân tích một câu người dùng dán vào: tách từ, cách đọc, ngữ pháp và kanji.
- Góp ý bản thu âm khi model/định dạng được chọn có hỗ trợ audio.

### Luồng thiết lập API key

1. Trong `Cài đặt → Gemini`, người dùng bật công tắc `Sử dụng AI`.
2. Người dùng tự dán key lấy từ Google AI Studio; app không cung cấp hoặc nhúng sẵn key.
3. App kiểm tra key bằng một request ngắn khi người dùng chủ động bấm `Kiểm tra kết nối`.
4. Key được lưu trong `expo-secure-store`, không lưu trong SQLite.
5. UI chỉ hiển thị dạng che `••••••1234`.
6. Có nút cập nhật key, xóa key, kiểm tra lại và chọn model.
7. Khi chưa có key, AI đang tắt hoặc mất mạng, các nút AI chuyển sang trạng thái giải thích rõ ràng; bài học local vẫn hoạt động.

### Điều kiện sử dụng AI và dữ liệu di động

AI sẵn sàng khi đồng thời thỏa cả ba điều kiện:

```text
AI đã bật
    AND Gemini API key hợp lệ
    AND có internet (Wi‑Fi hoặc 3G/4G/5G)
```

- Không giới hạn AI chỉ cho Wi‑Fi; kết nối 3G vẫn được phép gọi Gemini.
- Có tùy chọn `Cho phép AI dùng dữ liệu di động`, mặc định bật cho app cá nhân này.
- Khi mạng yếu, request có timeout, nút thử lại và giữ nguyên nội dung người dùng đang nhập.
- Không tự động gọi Gemini ở background; mỗi request AI phải xuất phát từ một hành động rõ ràng của người dùng.
- Hiển thị cảnh báo trước khi gửi audio hoặc tệp lớn qua dữ liệu di động.
- Có thể đặt giới hạn request AI mỗi ngày để kiểm soát quota và dung lượng mạng.

### Quy tắc bảo mật quan trọng

- Không hard-code key trong mã nguồn, `app.json`, asset, SQLite hoặc Git.
- Không dùng biến `EXPO_PUBLIC_*` cho bí mật vì giá trị sẽ nằm trong bundle phía client.
- Với app cá nhân cài trên thiết bị của chính người dùng, `SecureStore` là phương án thực dụng nhưng **không thể bảo đảm bí mật tuyệt đối trên thiết bị đã bị kiểm soát/root/jailbreak**.
- Nếu phát hành app cho nhiều người, phải chuyển lời gọi Gemini qua backend/proxy và giữ key phía server. Google khuyến cáo không để Gemini API key trong ứng dụng mobile/web production.
- Bật giới hạn quota/billing và restriction phù hợp trong Google Cloud/AI Studio.
- Không log key, header xác thực, toàn bộ prompt riêng tư hoặc nội dung bản thu.

### Riêng tư và dữ liệu gửi ra ngoài

- Trước lần dùng AI đầu tiên, app thông báo: nội dung prompt, câu do người dùng viết và tệp đính kèm được chọn sẽ rời thiết bị để gửi tới Gemini.
- Chỉ gửi dữ liệu cần cho tác vụ hiện tại; không tự động gửi toàn bộ lịch sử học.
- Bản thu âm chỉ được gửi khi người dùng bấm xác nhận.
- Lịch sử AI mặc định lưu local; có tùy chọn không lưu và nút xóa toàn bộ.

### Hợp đồng đầu ra

Yêu cầu Gemini trả JSON có cấu trúc thay vì văn bản tự do. Ví dụ cho chức năng chấm câu:

```ts
type WritingFeedback = {
  isGrammaticallyValid: boolean;
  correctedSentence: string;
  naturalAlternative?: string;
  explanationVi: string;
  grammarPoints: string[];
  caution?: string;
};
```

Quy trình xử lý:

1. Gửi system instruction cố định và context tối thiểu.
2. Parse và kiểm tra schema bằng Zod.
3. Nếu JSON lỗi, thử sửa/parse lại tối đa một lần.
4. Nếu vẫn lỗi, hiển thị lỗi thân thiện; không ghi dữ liệu hỏng vào SQLite.
5. Cache kết quả theo hash của prompt + model để giảm quota, cho phép xóa cache.

### Prompt mẫu: góp ý câu tự viết

```text
Bạn là trợ giảng tiếng Nhật cho người Việt ở trình độ {{level}}.
Hãy đánh giá câu của người học theo đúng ngữ cảnh đã cho.

Mục tiêu ngữ pháp: {{targetGrammar}}
Ngữ cảnh: {{context}}
Câu người học: {{sentence}}

Yêu cầu:
- Không đổi ý nếu câu đã đúng.
- Phân biệt lỗi ngữ pháp với cách nói chưa tự nhiên.
- Giải thích ngắn bằng tiếng Việt.
- Không dùng kiến thức vượt quá {{level}} nếu không cần thiết.
- Trả về đúng JSON theo schema được cung cấp.
```

## 7. Kiến trúc kỹ thuật

### Stack đề xuất

| Phần | Lựa chọn | Vai trò |
|---|---|---|
| App | React Native + Expo + TypeScript | Một codebase cho iOS/Android |
| Điều hướng | Expo Router | Route theo cấu trúc file, deep link |
| Database vật lý | SQLite local trên thiết bị | Nội dung, tiến độ, SRS, ghi chú, lịch sử |
| ORM/data access | Prisma ORM | Schema, typed client, relations, transaction và migration |
| Bí mật | `expo-secure-store` | Gemini API key và khóa nhỏ nhạy cảm |
| File local | Expo FileSystem | Bản thu, audio tải về, export/backup |
| Audio | Module audio/recording chính thức của Expo tương thích SDK đang dùng | Phát mẫu, loop, thu âm |
| Trạng thái mạng | Module network tương thích Expo SDK | Phát hiện offline, Wi‑Fi hoặc dữ liệu di động |
| State management | MobX + `mobx-react-lite` | Store phản ứng cho phiên học, tiến độ, cài đặt và AI |
| Data access | Repository dùng Prisma Client | Tách MobX/UI khỏi database và thuận tiện mock khi test |
| Validation | Zod | Validate dữ liệu import và đầu ra AI |
| Form | React Hook Form | Cài đặt, ghi chú, bài tự viết |
| Test | Jest + React Native Testing Library | Unit/component test |
| E2E | Maestro | Luồng học và ôn trên thiết bị |

MobX quản lý trạng thái runtime và điều phối use case; Prisma là cổng duy nhất để đọc/ghi database trong code ứng dụng. Không cho component gọi Prisma trực tiếp.

### Quyết định phiên bản Prisma cho Expo

- Khóa chính xác phiên bản `prisma`, `@prisma/client` và driver; không dùng range rộng hoặc tự động nâng major.
- Prisma 8 hiện chưa phải lựa chọn cho app này vì tài liệu hiện tại ghi SQLite vẫn đang được lên kế hoạch. Bắt đầu bằng nhánh Prisma 7 có SQLite và target runtime React Native, sau đó chỉ nâng version khi bộ compatibility test đã qua.
- Làm một compatibility spike trước khi xây tính năng: mở database local, chạy migration, CRUD, transaction, kill/restart app và kiểm tra iOS/Android.
- Driver phải thật sự hỗ trợ SQLite trên thiết bị React Native. Không dùng `better-sqlite3` trong mobile bundle vì đây là driver cho Node.js.
- Nếu integration Prisma cần native module/config plugin, app dùng Expo development build/EAS Build; Expo Go không phải môi trường nghiệm thu bắt buộc.
- Nếu Prisma/driver đang chọn không tương thích Expo New Architecture, dừng ở spike và đổi sang tổ hợp phiên bản đã được Prisma công bố hỗ trợ; không tự viết bridge tạm cho production.
- Ghi decision record gồm phiên bản Expo SDK, React Native, Prisma, driver, iOS và Android đã kiểm thử.

### Quy ước MobX

- Dùng một `RootStore` để khởi tạo và nối các feature store.
- Store chính gồm `SessionStore`, `ProgressStore`, `ReviewStore`, `SettingsStore` và `AiStore`.
- Dùng `makeAutoObservable`; mọi thay đổi state nằm trong action, async workflow dùng `flow` hoặc action sau `await`.
- Screen/component đọc observable trong `observer`; component trình bày thuần không cần `observer`.
- Không đưa toàn bộ database vào MobX. Store chỉ giữ dữ liệu màn hình đang dùng, ID được chọn, trạng thái tải và draft chưa lưu.
- SQLite/Prisma là nguồn dữ liệu bền vững; MobX không phải database thứ hai.
- Sau mutation Prisma, store cập nhật snapshot tương ứng hoặc reload query có phạm vi; tránh observer toàn cục gây render dây chuyền.

Ví dụ ranh giới giữa MobX và repository:

```ts
class ReviewStore {
  cards: ReviewCard[] = [];
  isLoading = false;

  constructor(
    private reviewRepository: ReviewRepository,
  ) {
    makeAutoObservable(
      this,
      { reviewRepository: false },
      { autoBind: true },
    );
  }

  *loadDueCards() {
    this.isLoading = true;
    try {
      this.cards = yield this.reviewRepository.findDue(new Date());
    } finally {
      this.isLoading = false;
    }
  }
}
```

### Sơ đồ luồng dữ liệu

```text
UI / Expo Router
      │
      └── MobX feature stores
                │
                ├── Use cases
                │      └── Repositories ── Prisma Client ── SQLite local
                ├── File service ───────── Audio / export / backup local
                └── AI service ─────────── SecureStore key → Gemini API
```

### Cấu trúc thư mục dự kiến

```text
app/
  _layout.tsx
  (tabs)/
    index.tsx                 # Hôm nay
    learn.tsx                 # Lộ trình
    review.tsx                # SRS
    vocabulary.tsx            # Flashcard từ vựng JLPT N5–N1
    notebook.tsx              # Tra cứu/sổ tay
    settings.tsx
  lesson/[lessonId].tsx
  grammar/[grammarId].tsx
  kanji/[kanjiId].tsx
  pitch/[itemId].tsx
  practice/[sessionId].tsx
src/
  components/
  features/
    grammar/
    kanji/
    pitch/
    review/
    vocabulary/
    diary/
    ai-tutor/
  db/
    prisma.ts
    repositories/
    seed/
    initialize.ts
  services/
    ai/
    audio/
    backup/
  domain/
    entities/
    srs/
  hooks/
  stores/
    RootStore.ts
    SessionStore.ts
    ProgressStore.ts
    ReviewStore.ts
    SettingsStore.ts
    AiStore.ts
  theme/
  utils/
assets/
  seed/
  audio/
  fonts/
prisma/
  schema.prisma
  migrations/
generated/
  prisma/
```

### Nguyên tắc tách lớp

- Component không gọi Prisma Client hoặc chạy SQL trực tiếp.
- MobX store điều phối use case và state của UI, không chứa câu query database.
- Repository chỉ quản lý lưu/đọc dữ liệu thông qua Prisma Client.
- Use case chứa logic như hoàn tất bài, chấm câu và cập nhật SRS.
- `aiService` có interface để thay Gemini bằng mock trong test.
- Nội dung giáo trình được seed có version; dữ liệu cá nhân không bị ghi đè khi nâng version.

## 8. Mô hình dữ liệu local

`prisma/schema.prisma` là nguồn sự thật duy nhất của schema. Các khối SQL bên dưới mô tả mô hình quan hệ để đọc nhanh; khi triển khai phải chuyển thành Prisma model và tạo migration bằng Prisma, không duy trì một bộ DDL thủ công song song.

Phần đầu schema cần target SQLite và sinh client cho runtime React Native theo phiên bản Prisma đã được compatibility spike xác nhận:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
  runtime  = "react-native"
}

datasource db {
  provider = "sqlite"
}

model Level {
  id        String @id
  title     String
  sortOrder Int    @map("sort_order")
  units     Unit[]

  @@map("levels")
}

model Unit {
  id          String   @id
  levelId     String   @map("level_id")
  title       String
  description String?
  sortOrder   Int      @map("sort_order")
  level       Level    @relation(fields: [levelId], references: [id])
  lessons     Lesson[]

  @@index([levelId, sortOrder])
  @@map("units")
}

model Lesson {
  id               String @id
  unitId           String @map("unit_id")
  type             String
  title            String
  estimatedMinutes Int?   @map("estimated_minutes")
  contentVersion   Int    @default(1) @map("content_version")
  sortOrder        Int    @map("sort_order")
  unit             Unit   @relation(fields: [unitId], references: [id])

  @@index([unitId, sortOrder])
  @@map("lessons")
}
```

Tên model dùng PascalCase/số ít; tên bảng và cột hiện có được giữ bằng `@@map`/`@map`. Tất cả quan hệ và index phục vụ hàng đợi SRS phải được khai báo trong Prisma schema.

### Bảng nội dung

```sql
levels(
  id TEXT PRIMARY KEY,        -- intro, n5, n4, n3, n2
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);

units(
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL REFERENCES levels(id),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL
);

lessons(
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES units(id),
  type TEXT NOT NULL,         -- grammar, kanji, pitch, mixed
  title TEXT NOT NULL,
  estimated_minutes INTEGER,
  content_version INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL
);

grammar_points(
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL REFERENCES levels(id),
  pattern TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  formation_json TEXT NOT NULL,
  nuance_json TEXT,
  common_mistakes_json TEXT,
  tags_json TEXT
);

kanji(
  id TEXT PRIMARY KEY,
  character TEXT NOT NULL UNIQUE,
  level_id TEXT REFERENCES levels(id),
  meanings_vi_json TEXT NOT NULL,
  onyomi_json TEXT,
  kunyomi_json TEXT,
  radicals_json TEXT,
  stroke_count INTEGER,
  pitch_note TEXT
);

vocabulary(
  id TEXT PRIMARY KEY,
  expression TEXT NOT NULL,
  reading TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  level_id TEXT REFERENCES levels(id),
  pitch_pattern_json TEXT,
  audio_asset TEXT,
  tags_json TEXT
);

examples(
  id TEXT PRIMARY KEY,
  japanese TEXT NOT NULL,
  reading TEXT,
  meaning_vi TEXT NOT NULL,
  audio_asset TEXT,
  source_note TEXT
);

lesson_items(
  lesson_id TEXT NOT NULL REFERENCES lessons(id),
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  PRIMARY KEY (lesson_id, item_type, item_id)
);
```

### Bảng dữ liệu cá nhân

```sql
study_progress(
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  status TEXT NOT NULL,       -- locked, available, learning, learned
  mastery REAL NOT NULL DEFAULT 0,
  last_studied_at TEXT,
  PRIMARY KEY (content_type, content_id)
);

srs_cards(
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  card_type TEXT NOT NULL,
  due_at TEXT NOT NULL,
  stability REAL NOT NULL DEFAULT 0,
  difficulty REAL NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  state TEXT NOT NULL,
  last_reviewed_at TEXT
);

review_logs(
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES srs_cards(id),
  rating INTEGER NOT NULL,
  elapsed_ms INTEGER,
  reviewed_at TEXT NOT NULL,
  previous_state_json TEXT NOT NULL
);

notes(
  id TEXT PRIMARY KEY,
  target_type TEXT,
  target_id TEXT,
  body_md TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

diary_entries(
  id TEXT PRIMARY KEY,
  entry_date TEXT NOT NULL,
  japanese TEXT NOT NULL,
  context_vi TEXT,
  ai_feedback_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

recordings(
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  local_uri TEXT NOT NULL,
  duration_ms INTEGER,
  self_score INTEGER,
  created_at TEXT NOT NULL
);

study_sessions(
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0
);

app_settings(
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

ai_cache(
  cache_key TEXT PRIMARY KEY,
  feature TEXT NOT NULL,
  model TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT
);
```

### Quy tắc database

- Bật `PRAGMA journal_mode = WAL` và `PRAGMA foreign_keys = ON` khi khởi tạo.
- Mọi CRUD nghiệp vụ đi qua repository sử dụng Prisma Client.
- Với raw query, chỉ dùng API tagged/parameterized; cấm API dạng `Unsafe` nhận input người dùng.
- Migrations được sinh và quản lý từ `prisma/schema.prisma`, tăng dần và có kiểm thử từ database ở các version cũ.
- Migration mobile được đóng gói cùng app và áp dụng trước khi khởi tạo các MobX store cần dữ liệu.
- Thao tác cập nhật progress + review log + SRS card phải nằm trong cùng Prisma transaction.
- Seed content và user data tách logic cập nhật.
- Không lưu file audio dạng BLOB trong SQLite; chỉ lưu URI và metadata.
- Thời gian lưu theo ISO 8601 UTC; chuyển timezone khi hiển thị.
- Prisma Client là singleton theo vòng đời app; không tạo client mới trong screen hoặc store.

## 9. Điều hướng và màn hình

```text
Onboarding
  └─ Mục tiêu → Xếp trình độ → Kế hoạch ngày → Trang chủ

Tabs
  ├─ Hôm nay
  │   ├─ Bài tiếp theo
  │   ├─ Quick 5
  │   └─ Daily Quest
  ├─ Học
  │   └─ Level → Unit → Lesson → Kết quả
  ├─ Ôn tập
  │   └─ Chọn bộ thẻ → Phiên ôn → Tổng kết
  ├─ Từ vựng
  │   └─ Chọn JLPT → Tìm/chọn bộ từ → Flashcard → Tự chấm
  ├─ Sổ tay
  │   ├─ Tìm kiếm
  │   ├─ Sentence Mine
  │   └─ Nhật ký
  └─ Cài đặt
      ├─ Học tập
      ├─ Audio và dữ liệu
      ├─ Gemini
      └─ Backup/khôi phục
```

> **Tài liệu tham chiếu chi tiết:** Xem đặc tả thiết kế giao diện, Design System, wireframes và ma trận trải nghiệm Newbie vs Advanced tại [THIET_KE_UI_UX.md](file:///Users/ccvn/Desktop/japanese-study/THIET_KE_UI_UX.md).

### Thiết kế một phiên học

1. Màn mở đầu nêu mục tiêu và thời lượng.
2. Một khối giải thích không quá dài.
3. Ví dụ tương tác: chạm để hiện furigana/dịch/pitch.
4. 3–7 bài tập tăng dần độ khó.
5. Một câu tự tạo hoặc shadowing.
6. Tóm tắt, mức tự tin và các thẻ SRS vừa được tạo.

## 10. Backup, import và export

- Export một file ZIP gồm database, manifest version, ghi chú và tùy chọn audio.
- Không đưa Gemini API key vào backup.
- Cho phép export thống kê CSV và ghi chú/nhật ký Markdown.
- Trước khi import, validate manifest, schema version và checksum.
- Khi khôi phục, tạo bản backup hiện tại trước khi thay dữ liệu.
- MVP dùng chia sẻ file thủ công; iCloud/Google Drive là tùy chọn về sau.

## 11. Phi chức năng

### Hiệu năng

- Khởi động vào trang Hôm nay nhanh trên thiết bị tầm trung.
- Query danh sách luôn phân trang hoặc có `LIMIT`.
- Không load toàn bộ audio vào bộ nhớ.
- Tác vụ phân tích/backup nặng không chặn tương tác chính.

### Accessibility

- Font Nhật đủ lớn, tăng cỡ chữ theo cài đặt hệ thống.
- Màu cao/thấp không phải tín hiệu duy nhất; dùng cả vị trí và ký hiệu.
- Có nhãn cho screen reader, vùng chạm tối thiểu hợp lý và dark mode.
- Tùy chọn giảm animation.

### Offline

- Học, tra cứu, ôn SRS, nghe audio đã đóng gói/tải về, thu âm và xem tiến độ đều hoạt động khi offline.
- AI hoạt động qua Wi‑Fi hoặc 3G/4G/5G nếu người dùng đã bật AI, cho phép dữ liệu di động và tự nhập Gemini API key hợp lệ.
- Chỉ AI, tải gói audio/nội dung mới và kiểm tra cập nhật cần mạng.
- Không để lỗi mạng làm mất câu người dùng đang viết.

## 12. Kế hoạch triển khai

### Giai đoạn 0 — Nền móng

- Khởi tạo Expo TypeScript và Expo Router.
- Thiết lập theme, lint, format, test và CI.
- Thực hiện compatibility spike Prisma + SQLite local trên cả iOS và Android; khóa bộ phiên bản đã chạy ổn định.
- Tạo `schema.prisma`, migration đầu tiên, generated client, database initializer và seed nhỏ.
- Tạo MobX `RootStore`, Context provider và các store khung.
- Xây navigation tabs và component cơ bản.

**Hoàn thành khi:** development build mở được trên iOS/Android; Prisma chạy CRUD, transaction và migration lặp lại an toàn; một MobX store tải được lesson mẫu qua repository và dữ liệu còn nguyên sau kill/restart.

### Giai đoạn 1 — MVP học offline

- Onboarding và cài đặt mục tiêu.
- Trang Hôm nay, lộ trình Level/Unit/Lesson.
- Lesson engine cho ngữ pháp, kanji và quiz cơ bản.
- SRS, review log, streak và thống kê tối thiểu.
- Tìm kiếm, ghi chú, favorite.
- Seed nội dung nhập môn và một unit N5 hoàn chỉnh.

**Hoàn thành khi:** người dùng có thể học một unit, đóng app, mở lại và tiếp tục đúng tiến độ hoàn toàn offline.

### Giai đoạn 2 — Audio và pitch accent

- Audio player: tốc độ, loop, tua ngắn.
- Hiển thị mora và đường pitch.
- Thu âm, phát đối chiếu, tự chấm.
- Pitch Echo và shadowing session.
- Quản lý dung lượng audio/recording.

**Hoàn thành khi:** một bài phát âm đầy đủ chạy offline, bản thu tồn tại sau khi restart và có thể xóa.

### Giai đoạn 3 — Gemini tutor

- Màn cài API key bằng SecureStore.
- Công tắc bật/tắt AI và cho phép sử dụng qua 3G/4G/5G.
- AI service, timeout, retry, cancel và error mapping.
- Schema validation, cache và giới hạn request mỗi ngày do người dùng đặt.
- Chấm câu, giải thích ngữ pháp và tạo quiz từ lỗi.
- Consent riêng tư và xóa lịch sử.

**Hoàn thành khi:** AI gọi được qua cả Wi‑Fi và dữ liệu di động; không có key app vẫn hoạt động đầy đủ; key không xuất hiện trong log, database, export hoặc bundle config.

### Giai đoạn 4 — Nội dung N4/N3/N2 và chất lượng

- Mở rộng giáo trình theo từng unit đã kiểm duyệt.
- Grammar Detective, One Sentence Diary, Kanji Garden.
- Dashboard điểm yếu và kế hoạch ôn theo ngày thi.
- Import/export, backup/restore.
- E2E test, accessibility pass và profiling.

**Hoàn thành khi:** toàn bộ đường học N5→N2 có nội dung tối thiểu, liên kết chéo và checkpoint; restore từ backup được kiểm thử.

### Backlog chi tiết cho 8 nhóm chức năng

Thứ tự ưu tiên triển khai được sắp theo quan hệ phụ thuộc, không chỉ theo thứ tự màn hình. `P0` là lõi cần có để tạo một vòng học hoàn chỉnh; `P1` hoàn thiện trải nghiệm chính; `P2` là tính năng mở rộng sau khi dữ liệu và lesson engine đã ổn định.

| # | Nhóm chức năng | Ưu tiên | Phụ thuộc chính | Mốc triển khai |
|---:|---|---|---|---|
| 1 | SQLite/persistence | P0 | Compatibility spike Prisma/Expo | Giai đoạn 0 |
| 2 | Lesson engine động | P0 | SQLite, content schema | Giai đoạn 1 |
| 3 | SRS thật | P0 | SQLite, lesson engine | Giai đoạn 1 |
| 4 | Audio/recording | P1 | SQLite, lesson engine, file storage | Giai đoạn 2 |
| 5 | Onboarding | P0 | Settings/progress repository | Giai đoạn 1 |
| 6 | Search + chi tiết Grammar/Kanji | P1 | Content đã seed, SQLite index | Giai đoạn 1–2 |
| 7 | Backup/restore | P1 | Schema và migration ổn định | Giai đoạn 4 |
| 8 | Diary, Detective, Kanji Garden | P2 | Lesson engine, SRS, search/detail | Giai đoạn 4 |

#### 1. SQLite và persistence

**Phạm vi:** thay toàn bộ dữ liệu giả hoặc state chỉ nằm trong bộ nhớ bằng nguồn dữ liệu local bền vững; Prisma repository là cổng truy cập duy nhất.

- Chốt tổ hợp Expo SDK, Prisma Client và SQLite driver bằng compatibility spike trên Android/iOS.
- Tạo migration, seed version, database initializer và cơ chế chạy migration idempotent khi app khởi động.
- Hoàn thiện repository cho content, progress, settings, review log, SRS card, note, favorite và recording metadata.
- Dùng transaction cho các luồng nhiều bước như hoàn tất lesson → ghi kết quả → cập nhật progress → tạo thẻ SRS.
- Thêm trạng thái loading/empty/error và cơ chế phục hồi khi migration hoặc transaction thất bại.
- Test CRUD, unique/index, rollback, nâng schema và dữ liệu còn nguyên sau kill/restart.

**Nghiệm thu:** cài mới tạo database đúng schema; mở lại app giữ nguyên tiến độ; migration từ fixture phiên bản trước không mất dữ liệu; component không gọi Prisma trực tiếp.

#### 2. Lesson engine động

**Phạm vi:** một engine dùng chung có thể render lesson từ dữ liệu thay vì hard-code từng màn hình.

- Định nghĩa schema `LessonDefinition` có version, level/unit, prerequisites, estimated time và danh sách block/exercise.
- Hỗ trợ block nội dung: text, grammar explanation, vocabulary, kanji, example, image, audio và pitch.
- Hỗ trợ bài tập MVP: multiple choice, cloze, sentence ordering, error correction và self-rating.
- Xây registry `type -> renderer/grader`, validation bằng Zod và fallback an toàn cho block chưa được app hỗ trợ.
- Tạo `SessionStore` điều phối resume, submit, feedback, retry, skip, complete và checkpoint.
- Lưu session draft sau mỗi câu để đóng app giữa bài vẫn tiếp tục được; engine phát sự kiện chuẩn cho progress và SRS.
- Viết fixture lesson cho Kana, Grammar và Kanji; test grading tách khỏi UI.

**Nghiệm thu:** thêm một lesson mới chỉ bằng seed/content file, không sửa screen; resume đúng câu đang học; content lỗi bị chặn khi import/seed và không làm crash phiên học.

#### 3. SRS thật

**Phạm vi:** thay lịch ôn minh họa bằng scheduler có trạng thái thẻ, hàng đợi đến hạn và review log đầy đủ.

- Chọn FSRS làm thuật toán mặc định; đóng gói scheduler sau interface để có thể thay hoặc nâng phiên bản.
- Lưu trạng thái cần thiết như `due`, `stability`, `difficulty`, `reps`, `lapses`, `state` và `lastReview`.
- Tạo thẻ từ kết quả lesson theo entity nguồn; chống tạo trùng thẻ cho cùng nội dung/template.
- Xây queue theo ngày, timezone và loại nội dung; hỗ trợ giới hạn bài mới, review trộn và thứ tự ưu tiên.
- Chấm `Quên/Khó/Được/Dễ`, hiển thị thời gian ôn dự kiến, ghi `ReviewLog` và hỗ trợ undo lần chấm gần nhất bằng transaction.
- Thêm relearning, leech threshold, bury sibling và thống kê retention/workload cơ bản.
- Dùng clock cố định trong unit test để kiểm tra boundary ngày, đổi timezone, lịch quá hạn và chuỗi rating.

**Nghiệm thu:** cùng một input luôn tạo cùng lịch; không mất hoặc nhân đôi lượt ôn sau restart; undo khôi phục cả card và log; hàng đợi chỉ lấy đúng thẻ đến hạn.

#### 4. Audio và recording

**Phạm vi:** phát audio mẫu, loop đoạn, thu giọng người học và quản lý file hoàn toàn local.

- Tạo `AudioService` quản lý một player dùng chung, preload/cleanup, tốc độ phát, seek và loop A–B.
- Xin quyền microphone đúng thời điểm, giải thích khi bị từ chối và dẫn tới cài đặt hệ thống khi cần.
- Thiết kế state machine `idle -> preparing -> recording -> stopped -> playing/error` để chống bấm lặp và xung đột player/recorder.
- Lưu file trong thư mục app; SQLite chỉ giữ URI, duration, lesson/entity liên quan, ngày tạo và dung lượng.
- Hỗ trợ nghe mẫu → thu → nghe lại → phát đối chiếu → tự chấm; waveform có thể dùng dữ liệu amplitude giản lược ở MVP.
- Thêm trang quản lý dung lượng, xóa từng bản thu/xóa hàng loạt và dọn orphan file.
- Test ngắt cuộc gọi, app chuyển background, thiếu quyền, thiếu dung lượng và file nguồn không tồn tại.

**Nghiệm thu:** audio mẫu phát được offline; bản thu còn dùng được sau restart; dừng/thoát màn hình giải phóng tài nguyên; xóa bản thu loại bỏ cả file và metadata.

#### 5. Onboarding

**Phạm vi:** thiết lập trải nghiệm ban đầu và tạo kế hoạch học đầu tiên, không yêu cầu tài khoản.

- Luồng gồm: chào mừng → mục tiêu → trình độ/bài test tùy chọn → thời lượng/ngày thi → furigana/romaji → quyền thông báo tùy chọn → xác nhận kế hoạch.
- Lưu draft sau mỗi bước; cho quay lại, thoát và tiếp tục mà không mất lựa chọn.
- Sinh `StudyPlan` ban đầu và điểm bắt đầu trong lộ trình; người đã biết tiếng Nhật có thể bỏ qua Kana hoặc làm placement test.
- Chỉ hỏi microphone khi lần đầu dùng recording, không hỏi trong onboarding nếu chưa có ngữ cảnh.
- Cho phép sửa toàn bộ lựa chọn trong Settings và có nút chạy lại placement mà không xóa lịch sử.
- Theo dõi local các mốc bắt đầu/hoàn tất/bỏ qua để tìm bước gây rớt, không lưu dữ liệu nhận dạng.

**Nghiệm thu:** người mới đi tới bài học đầu tiên; người có nền tảng được xếp đúng chặng; force-close ở mỗi bước có thể resume; hoàn tất rồi không tự hiện lại onboarding.

#### 6. Search và trang chi tiết Grammar/Kanji

**Phạm vi:** tra cứu offline nhanh và liên kết chéo giữa kết quả, bài học, ghi chú, favorite và SRS.

- Chuẩn hóa trường tìm kiếm cho kanji, kana, romaji tùy chọn, nghĩa tiếng Việt, mẫu ngữ pháp, alias và tag.
- Dùng SQLite FTS nếu driver/runtime đã xác nhận hỗ trợ; nếu chưa, dùng bảng search index đã normalize và `LIKE` có index cho MVP.
- Thêm debounce, ranking kết quả chính xác/prefix/substring và bộ lọc level, loại, đã học, favorite.
- Trang Grammar detail hiển thị cấu trúc, ý nghĩa, sắc thái, cách nối, ví dụ, mẫu dễ nhầm, note và bài liên quan.
- Trang Kanji detail hiển thị nghĩa, On/Kun, bộ/thành phần, số nét, từ ghép, ví dụ, chữ dễ nhầm, mnemonic và tiến độ SRS.
- Deep-link từ lesson, search, diary và review; trạng thái empty/no-result có gợi ý sửa truy vấn.
- Benchmark với bộ seed mục tiêu và test tiếng Nhật không khoảng trắng, kana/kanji, dấu tiếng Việt.

**Nghiệm thu:** kết quả đúng và phản hồi nhanh với dữ liệu mục tiêu; detail mở được hoàn toàn offline; favorite/note/SRS cập nhật nhất quán ở mọi điểm vào.

#### 7. Backup và restore

**Phạm vi:** xuất/khôi phục dữ liệu cá nhân có version; không đưa Gemini API key vào backup.

- Định nghĩa manifest gồm `formatVersion`, `schemaVersion`, app version, ngày tạo, checksum và thống kê bản ghi/file.
- Backup database người dùng cùng note, progress, SRS, diary, settings và tùy chọn kèm recording; loại trừ cache, content có thể seed lại và secret trong SecureStore.
- Ghi snapshot nhất quán sau khi khóa/flush transaction; đóng gói vào một file và chia sẻ qua system share sheet.
- Validate extension, kích thước, checksum, schema và từng payload trước khi chạm database hiện tại.
- Restore theo quy trình: preview → tạo safety backup → import vào database tạm → migrate → kiểm tra → atomic swap → restart store.
- Nếu restore lỗi, giữ nguyên dữ liệu hiện tại và cung cấp thông báo có thể hành động; hỗ trợ chế độ thay thế toàn bộ trước, merge để phiên bản sau.
- Test round-trip, backup cũ, file hỏng, thiếu recording và hết dung lượng.

**Nghiệm thu:** backup → xóa dữ liệu thử nghiệm → restore trả lại đúng progress/SRS/diary; file sai không làm thay đổi database; key Gemini không xuất hiện trong gói.

#### 8. One Sentence Diary, Grammar Detective và Kanji Garden

Ba module dùng chung entity/content hiện có, tránh tạo một hệ thống tiến độ riêng.

**One Sentence Diary**

- CRUD một hoặc nhiều câu theo ngày, mood/tag tùy chọn, bản sửa và liên kết grammar/kanji.
- Cho tạo thẻ cloze hoặc gửi đúng câu được chọn tới Gemini sau consent; phiên bản offline vẫn tự lưu và tra liên kết thủ công.
- Calendar/streak của Diary tách khỏi streak học để không tạo áp lực sai lệch.

**Grammar Detective**

- Scenario lấy từ content seed gồm đoạn hội thoại, grammar mục tiêu, distractor, hint và lời giải sắc thái.
- Engine theo ba bước: đánh dấu mẫu → chọn ý nghĩa/sắc thái → giải thích hoặc chọn câu thay thế.
- Ghi attempt và mastery; câu sai tạo review item hoặc lesson remedial, không trực tiếp sửa lịch card hiện có hai lần.

**Kanji Garden**

- Mỗi cây ánh xạ tới một kanji; stage được tính từ mastery/SRS hiện tại thay vì lưu điểm game không kiểm chứng.
- Quy tắc tăng trưởng deterministic, ví dụ `seed -> sprout -> young -> mature -> bloom`; sai bài chỉ làm chậm tăng trưởng, không làm cây chết.
- Hỗ trợ lọc theo level/bộ thủ, chạm cây mở Kanji detail và chế độ giảm chuyển động cho accessibility.

**Nghiệm thu:** cả ba module hoạt động offline; liên kết mở đúng Grammar/Kanji detail; dữ liệu xuất hiện trong backup; Garden tái tạo cùng trạng thái từ dữ liệu SRS và không làm sai lịch ôn.

### Thứ tự bàn giao đề xuất

1. Hoàn tất SQLite/persistence và bộ migration test.
2. Hoàn tất lesson engine động với một unit N5 làm vertical slice.
3. Gắn SRS thật vào kết quả lesson để khép kín vòng `học -> ôn -> cập nhật tiến độ`.
4. Hoàn tất onboarding, sau đó search và hai trang detail để tạo luồng người dùng đầu-cuối.
5. Thêm audio/recording và kiểm thử lifecycle trên thiết bị thật.
6. Khóa schema backup, làm backup/restore và fixture tương thích ngược.
7. Xây Diary, Detective, Kanji Garden trên các API/repository đã ổn định.

Mỗi mục chỉ chuyển sang `Done` khi có migration/fixture cần thiết, unit hoặc integration test cho logic chính, E2E cho happy path, trạng thái offline/error và cập nhật tài liệu schema/content tương ứng.

## 13. Chiến lược nội dung

- Nội dung chuẩn nên nằm trong file seed có version và nguồn rõ ràng.
- Mỗi mục cần trạng thái `draft`, `reviewed`, `published` trong pipeline biên soạn, dù app chỉ nhận bản published.
- Ví dụ phải được rà tính tự nhiên, bản quyền và độ phù hợp level.
- Không sao chép hàng loạt ví dụ/audio từ nguồn không có giấy phép.
- Audio nên có metadata người đọc, dialect nếu liên quan, tốc độ và giấy phép.
- Pitch accent thay đổi theo vùng và ngữ cảnh; ghi nguồn/từ điển tham chiếu, tránh trình bày một biến thể như chân lý duy nhất.
- AI có thể tạo bản nháp nhưng không tự động gắn nhãn “nội dung chuẩn”.

## 14. Kiểm thử quan trọng

### Unit test

- Tính lịch SRS với bốn rating và timezone khác nhau.
- Hoàn tác review khôi phục đúng trạng thái trước đó.
- Parse furigana/mora và dữ liệu pitch.
- MobX action/computed/flow cho trạng thái loading, success và error.
- Prisma migration và seed idempotent.
- Validate đầu ra Gemini, kể cả JSON thiếu trường hoặc sai kiểu.

### Integration test

- MobX store → use case → repository → Prisma → SQLite chạy đúng trên database test.
- Hoàn thành lesson cập nhật progress và tạo đúng card.
- Transaction rollback toàn bộ khi một bước ghi review log/SRS thất bại.
- Xóa một recording xóa cả file và metadata.
- Update seed không ghi đè note/progress cá nhân.
- Không có mạng vẫn mở lesson và review bình thường.
- Xóa Gemini key khiến AI service ngừng gửi request.

### E2E test

- Người dùng mới → onboarding → học bài đầu → ôn → xem thống kê.
- Đóng app giữa phiên rồi khôi phục an toàn.
- Export → cài lại/reset dữ liệu test → import → kiểm tra tiến độ.
- Bật font lớn và dark mode trên các màn chính.

## 15. Definition of Done cho mỗi tính năng

- Có trạng thái loading, empty, error và offline phù hợp.
- Dữ liệu tồn tại sau khi app restart.
- Có unit test cho logic nghiệp vụ quan trọng.
- Không log dữ liệu nhạy cảm.
- Hoạt động trên ít nhất một thiết bị/simulator iOS và Android.
- Hỗ trợ font scaling và screen reader ở mức cơ bản.
- Có Prisma migration nếu `schema.prisma` thay đổi.
- Nội dung tiếng Nhật đã qua kiểm tra thủ công trước khi seed vào bản chính.

## 16. Chỉ số theo dõi local

Không cần analytics cloud. Dashboard local có thể tính:

- Số phút học theo ngày/tuần.
- Tỷ lệ hoàn thành nhiệm vụ.
- Retention SRS theo loại nội dung.
- Các ngữ pháp/kanji có nhiều lapse nhất.
- Số ngày có diary/shadowing.
- Khối lượng ôn dự kiến trong 7 ngày.
- Tỷ lệ câu tự viết được sửa lại sau feedback.

Mục tiêu sản phẩm nên ưu tiên **khả năng nhớ và sử dụng**, không chỉ số bài đã bấm qua.

## 17. Các quyết định nên giữ cố định ở MVP

- Single-user, không đăng nhập.
- SQLite local là nơi lưu dữ liệu bền vững; Prisma ORM là data-access layer duy nhất.
- MobX là state manager duy nhất cho state chia sẻ/runtime; không dùng Zustand hoặc Redux song song.
- API key do người dùng tự nhập và lưu trong SecureStore.
- AI dùng được qua Wi‑Fi hoặc 3G/4G/5G khi được bật; không có request AI chạy ngầm.
- Nội dung cốt lõi được biên soạn/kiểm duyệt, không sinh ngẫu nhiên lúc học.
- AI luôn tùy chọn và có fallback.
- Chấm pitch tự động chưa phải điều kiện ra mắt.
- Chỉ phát triển N5 mẫu thật tốt trước khi nhập khối lượng lớn N4–N2.

## 18. Việc đầu tiên để bắt đầu code

1. Khởi tạo app Expo TypeScript với Expo Router.
2. Tạo spike Prisma + SQLite local và chạy trên development build iOS/Android.
3. Khóa phiên bản Prisma/driver tương thích, sau đó tạo `schema.prisma`, migration đầu và generated client.
4. Thiết lập MobX `RootStore`, Context provider, `SessionStore` và `ReviewStore`.
5. Seed một unit N5 gồm 3 bài: ngữ pháp, kanji và pitch.
6. Hoàn thiện luồng `Hôm nay → MobX store → use case → Prisma repository → SQLite → Kết quả → SRS`.
7. Kiểm thử transaction và persistence khi kill/restart app.
8. Sau khi luồng local ổn định mới thêm thu âm và Gemini.

## 19. Tài liệu kỹ thuật tham khảo

- [Expo — Local-first architecture](https://docs.expo.dev/guides/local-first/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Expo — Store data](https://docs.expo.dev/develop/user-interface/store-data/)
- [MobX — React integration](https://mobx.js.org/react-integration.html)
- [MobX — Creating observable state](https://mobx.js.org/observable-state.html)
- [Prisma — SQLite](https://docs.prisma.io/docs/orm/core-concepts/supported-databases/sqlite)
- [Prisma Schema API — React Native runtime](https://docs.prisma.io/docs/orm/reference/prisma-schema-reference)
- [Prisma ORM for React Native và Expo](https://github.com/prisma/react-native-prisma)
- [Prisma ORM hiện tại và trạng thái SQLite](https://www.prisma.io/docs/orm)
- [Google Gemini API — API keys và bảo mật](https://ai.google.dev/gemini-api/docs/api-key)
- [Google Gemini API — Generate content](https://ai.google.dev/api/generate-content)

## 20. Nhật ký thay đổi triển khai

### 2026-08-31 — Tích hợp tab Vocabulary JLPT

**Đã hoàn thành**

- Thêm tab `Từ vựng` vào bottom navigation, route tại `app/(tabs)/vocabulary.tsx`.
- Tích hợp REST API `https://jlpt-vocab-api.vercel.app/api/words` với lọc level, phân trang và tìm theo từ tiếng Nhật.
- Hỗ trợ chọn đủ năm cấp độ `N5`, `N4`, `N3`, `N2`, `N1`; mỗi bộ học tải tối đa 20 từ.
- Flashcard ẩn đáp án ban đầu, sau khi lật hiển thị `furigana`, `romaji` và nghĩa tiếng Anh từ API.
- Thêm ba mức tự chấm `Quên`, `Khó`, `Đã nhớ`; từ được chấm `Quên/Khó` tự đưa vào vòng học lại cho tới khi người dùng đánh dấu đã nhớ.
- Thêm tìm kiếm, xóa truy vấn, empty state, loading state, timeout, error state và nút thử lại.
- Tạo `VocabularyStore`, đăng ký trong `RootStore` và cung cấp hook `useVocabularyStore` qua Store Context.
- Tách API client tại `src/services/vocabulary/jlptVocabApi.ts`; response được validate bằng Zod trước khi đưa vào store.
- Chống race condition khi người dùng đổi level/tìm kiếm liên tục bằng request ID; response cũ không được ghi đè state mới.
- Cập nhật kiểu `style` của component dùng chung `Button` và `Card` sang `StyleProp` để hỗ trợ ghép nhiều style đúng type React Native.

**Đã kiểm tra**

- `npm exec tsc -- --noEmit`: đạt, không còn lỗi TypeScript.
- `expo export --platform android`: bundle Android thành công.
- Gọi trực tiếp API cho cả N5 → N1: tất cả level đều trả danh sách đúng schema `word`, `meaning`, `furigana`, `romaji`, `level`.
- `git diff --check`: không có lỗi whitespace; chỉ có cảnh báo chuyển line ending LF/CRLF trên Windows.

**Giới hạn hiện tại và việc tiếp theo**

- API hiện cung cấp nghĩa tiếng Anh; chưa có lớp nghĩa tiếng Việt đã kiểm duyệt.
- Tiến độ và bộ từ đang nằm trong MobX runtime, chưa tồn tại sau khi đóng app.
- Chưa cache dữ liệu API vào SQLite nên lần tải bộ từ mới vẫn cần internet.
- Chưa chuyển kết quả tự chấm thành `SrsCardData` hoặc đưa vào hàng đợi Review chung.
- Bước tiếp theo: cache từ vựng bằng repository/SQLite, lưu mastery theo khóa `level + word + furigana`, sau đó tạo/upsert thẻ Vocabulary vào SRS và đưa dữ liệu này vào backup/restore.

---

Tài liệu này là blueprint cho bản đầu. Khi triển khai, nên chia nội dung giáo trình thành các file seed nhỏ theo level/unit để có thể rà soát và cập nhật độc lập mà không ảnh hưởng dữ liệu học cá nhân.
