<div align="center">

# 🌸 Nihongo Local (日本語ローカル)

**Ứng dụng tự học tiếng Nhật cá nhân Offline-First — Từ Nhập môn đến JLPT N2**  
*Tối ưu trực quan cho cả Người mới bắt đầu (Newbie) và Người đã có nền tảng tiếng Nhật.*

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-54.0.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MobX](https://img.shields.io/badge/State-MobX%206-FF9955?logo=mobx&logoColor=white)](https://mobx.js.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%205-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20Local-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![FSRS](https://img.shields.io/badge/Algorithm-FSRS%20v4.5-10B981)](https://github.com/open-spaced-repetition/fsrs4anki)
[![Gemini](https://img.shields.io/badge/AI%20Tutor-Gemini%20Flash%20(Optional)-8E75FF?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📖 1. Giới thiệu tổng quan (About the Project)

**Nihongo Local** là ứng dụng di động đa nền tảng (iOS & Android) được xây dựng với phương châm **"Zen & Swift — Tối giản tĩnh lặng, Phản hồi tức thời"**. 

Khác với các ứng dụng học tiếng Nhật phụ thuộc hoàn toàn vào máy chủ đám mây, **Nihongo Local hoạt động 100% Offline-First**:
- Toàn bộ cơ sở dữ liệu giáo trình, từ vựng, ngữ pháp, kanji, nhật ký và thuật toán ôn tập đều nằm ngay trên thiết bị của bạn.
- Không cần tạo tài khoản, không theo dõi dữ liệu, không quảng cáo làm phiền.
- **Trợ giảng Gemini AI (Tùy chọn):** Bạn có thể nhập Gemini API key cá nhân để kích hoạt trợ giảng thông minh giải thích chuyên sâu và chấm bài viết khi có kết nối mạng.

---

## 🎯 2. Giải pháp trải nghiệm: Newbie vs. Người có nền tảng

Ứng dụng giải quyết triệt để sự khác biệt về nhu cầu giữa người mới bắt đầu và người đã có trình độ trung cấp:

```text
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           ADAPTIVE READING & LEARNING MATRIX                          │
├─────────────────────────┬───────────────────────────────────┬─────────────────────────┤
│ Tiêu chí                │ Người mới học (Newbie / N5)       │ Người có nền tảng (N4-N2)│
├─────────────────────────┼───────────────────────────────────┼─────────────────────────┤
│ Chế độ Furigana         │ Luôn hiển thị to rõ kèm Romaji    │ Tap-to-reveal (Chạm mở) │
│ Romaji (Chữ Latinh)     │ Bật hỗ trợ đọc                    │ Ẩn hoàn toàn            │
│ Ngữ pháp                │ Giải thích trực quan kiểu Lego    │ So sánh sắc thái sâu    │
│ Kanji                   │ Câu chuyện gợi nhớ + Lưới chữ Mễ  │ Học theo Họ chữ / Bộ thủ │
│ Cao độ (Pitch Accent)   │ Đếm nhịp Mora (Cao / Thấp)        │ Biểu đồ Pitch & Shadowing│
│ Tiến độ lộ trình        │ Bước từng bước qua các Unit       │ Mở khóa vượt cấp (Test) │
└─────────────────────────┴───────────────────────────────────┴─────────────────────────┘
```

---

## ✨ 3. Các tính năng cốt lõi (Core Features)

### 🔹 3.1. Interactive Sentence Tokenizer (Câu tương tác đa tầng)
Mọi câu tiếng Nhật trong bài học đều được chia tách thành các khối từ vựng có thể tương tác:
- **Chạm 1-chạm (Tap-to-inspect):** Mở bảng tra cứu nhanh hiển thị cách đọc Hiragana, âm Hán Việt (Sino-Vietnamese), từ loại, nghĩa trong ngữ cảnh và nút `⭐ Lưu vào Sổ tay`.
- **3 Chế độ đọc thích ứng:**
  1. *Newbie Mode:* Luôn hiện Furigana.
  2. *Active Recall Mode (Mặc định):* Furigana được che mờ, chạm vào từ nào mới hiển thị từ đó.
  3. *Hardcore Mode (N3-N2):* Ẩn hoàn toàn Furigana và Romaji.

### 🔹 3.2. Pitch Accent Visualizer (Trực quan hóa cao độ theo Mora)
- Vẽ đường cao độ chính xác theo các mẫu chuẩn: **Heiban [0]**, **Atamadaka [1]**, **Nakadaka [2/3]**, **Odaka**.
- Thiết kế hỗ trợ người mù màu (kết hợp màu sắc Đỏ son / Xanh lam, ký hiệu `H`/`L` và mũi tên `▲`/`▼`).
- Chế độ **Shadowing Lab**: Nghe audio người bản xứ, điều chỉnh tốc độ (0.8x / 1.0x), thu âm đối chiếu trực tiếp.

### 🔹 3.3. Lego Grammar Formula Block (Khối công thức ngữ pháp)
- Mô hình hóa cấu trúc nối từ: `[V-て] + [はいけません] (Cấm đoán mang tính quy tắc)`.
- **Huy hiệu sắc thái (Nuance Badges):** *⛔ Cấm đoán*, *👔 Lịch sự / Trang trọng*, *🗣️ Văn nói / Văn viết*.
- **Hộp cảnh báo lỗi người Việt hay mắc:** Chỉ ra các lỗi sai phổ biến do tư duy dịch word-by-word.

### 🔹 3.4. Kanji Anatomy & Rice Grid Canvas (Giải phẫu Kanji & Lưới tập viết)
- Phân rã chữ Hán thành các bộ thủ cấu thành (ví dụ: `休` = `亻 Người` + `木 Cây`).
- Câu chuyện gợi nhớ hình ảnh sinh động (*"Một NGƯỜI tựa lưng vào gốc CÂY để NGHỈ NGƠI"*).
- Bảng tập viết nét với **Lưới chữ Mễ (米 Grid)** và chế độ hướng dẫn nét mờ.

### 🔹 3.5. Thuật toán ôn tập ngắt quãng FSRS (FSRS Spaced Repetition)
- Tích hợp thuật toán **FSRS v4.5** hiện đại giúp tối ưu hóa khả năng ghi nhớ dài hạn.
- 4 nút đánh giá kèm thời gian dự đoán chính xác:
  - 🔴 **Quên (Again):** `< 10 phút`
  - 🟠 **Khó (Hard):** `1 ngày`
  - 🟢 **Được (Good):** `3 ngày`
  - 🟣 **Dễ (Easy):** `7 ngày`
- Hỗ trợ nút **Hoàn tác (Undo)** nổi khi bấm nhầm và cử chỉ lật thẻ mượt mà.

### 🔹 3.6. Sổ tay & Đào câu (Sentence Mining & 1-Tap Cloze)
- Lưu trữ các câu tiếng Nhật gặp ngoài đời thực (Anime, Manga, Tin tức, Phim ảnh).
- **Tạo thẻ Cloze 1-chạm:** Chạm vào bất kỳ từ nào trong câu đã lưu để biến từ đó thành ô trống `[ • • • ]` làm bài tập đố vui.

### 🔹 3.7. Kho Từ vựng JLPT N5 → N1 (JLPT Vocab API Integration)
- Tích hợp và chuẩn hóa hơn **8.000 từ vựng JLPT** từ N5 đến N1.
- Flashcard ôn tập theo bộ 20 từ, vòng lặp ôn lại các từ khó/quên và tìm kiếm từ vựng tức thời.

### 🔹 3.8. Trợ giảng Gemini AI (Tùy chọn & Bảo mật)
- Bật/tắt tùy ý, nhập API key cá nhân được mã hóa lưu trong `expo-secure-store`.
- **Chức năng AI:** Giải thích lại ngữ pháp theo phong cách dễ hiểu hơn, so sánh 2 mẫu câu gần nghĩa, chấm bài tự viết câu và đưa ra nhận xét chi tiết bằng tiếng Việt.

---

## 📱 4. Kiến trúc màn hình (Screen Architecture)

Ứng dụng sử dụng **Expo Router** với điều hướng tab tinh gọn:

```text
app/
├── (tabs)/
│   ├── index.tsx          # 🏠 Tab 1: Hôm nay (Dashboard, Tiếp tục bài học, Thẻ SRS Due, Nhiệm vụ ngày, Heatmap)
│   ├── learn.tsx          # 🗺️ Tab 2: Lộ trình học (Cây kỹ năng N5→N2, Skip Checkpoint cho người có nền tảng)
│   ├── review.tsx         # 📦 Tab 3: Ôn tập ngắt quãng FSRS (Flashcard, 4 nút đánh giá, Undo)
│   ├── vocabulary.tsx     # 📗 Tab 4: Từ vựng JLPT N5→N1 (Flashcard 20 từ, Tìm kiếm, Đánh giá)
│   ├── notebook.tsx       # 📖 Tab 5: Sổ tay & Sentence Mining (Đào câu đời thực, Tạo thẻ Cloze 1-chạm)
│   └── settings.tsx       # ⚙️ Tab 6: Cài đặt (Furigana, Romaji, Haptics, Gemini API Key qua SecureStore)
├── lesson/[lessonId].tsx  # 🎓 Trình diễn bài học tương tác 4 bước (Lý thuyết, Token, Xếp câu, Kanji)
└── pitch/[itemId].tsx     # 🎙️ Phòng luyện cao độ Pitch Accent & Shadowing Audio
```

---

## 🛠️ 5. Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| **Framework** | [React Native 0.81](https://reactnative.dev/) + [Expo SDK 54](https://expo.dev/) | Ứng dụng di động đa nền tảng (iOS & Android) |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) | Điều hướng File-based Routing hiện đại |
| **Ngôn ngữ** | [TypeScript 5.3](https://www.typescriptlang.org/) | Type-safe toàn bộ luồng dữ liệu |
| **State Management** | [MobX 6](https://mobx.js.org/) + `mobx-react-lite` | Quản lý trạng thái phản ứng (Reactive Stores) |
| **Database & ORM** | [Prisma ORM](https://www.prisma.io/) + SQLite Local | Cơ sở dữ liệu lưu trữ bền vững trên thiết bị |
| **Spaced Repetition**| FSRS Engine v4.5 | Thuật toán tính toán chu kỳ ôn tập ngắt quãng |
| **Bảo mật** | `expo-secure-store` | Mã hóa và lưu trữ Gemini API key |
| **Cảm giác & Hoạt họa**| `expo-haptics` + `react-native-reanimated` | Phản hồi rung vật lý và chuyển cảnh mượt mà 60fps |
| **Validation** | [Zod](https://zod.dev/) | Kiểm tra và chuẩn hóa schema dữ liệu |
| **AI Integration** | Google Gemini API (Flash 1.5 / 2.5) | Trợ giảng thông minh phân tích câu & ngữ pháp |

---

## 📂 6. Cấu trúc thư mục dự án (Project Directory Layout)

```text
japanese-study/
├── app/                        # Expo Router Pages & Navigation
│   ├── _layout.tsx             # Root Provider, Status Bar, Theme Stack & AI BottomSheet
│   ├── (tabs)/                 # 6 Màn hình Tab chính
│   ├── lesson/[lessonId].tsx   # Màn hình học bài tương tác
│   └── pitch/[itemId].tsx      # Màn hình luyện Pitch Accent & Shadowing
│
├── prisma/
│   └── schema.prisma           # 17 models cơ sở dữ liệu SQLite local
│
├── src/
│   ├── theme/                  # Hệ thống thiết kế: Colors, Typography, Spacing
│   │   ├── colors.ts           # Bảng màu Wabi-Sabi, Dark Mode OLED, JLPT Badges, Pitch Colors
│   │   ├── typography.ts       # Tỷ lệ chữ vàng tiếng Nhật chống đè Furigana
│   │   └── spacing.ts          # Lưới khoảng cách & chuẩn Touch Target 48dp
│   │
│   ├── domain/                 # Domain Entities & Nghiệp vụ cốt lõi
│   │   ├── entities/types.ts   # Kiểu dữ liệu TypeScript cho toàn ứng dụng
│   │   └── srs/fsrs.ts         # Triển khai thuật toán FSRS v4.5
│   │
│   ├── db/seed/                # Dữ liệu mẫu chuẩn N5
│   │   └── n5Data.ts           # Giáo trình N5: Ngữ pháp, Kanji, Pitch, Quests, SRS Cards
│   │
│   ├── services/               # Các dịch vụ ngoại vi & bảo mật
│   │   ├── ai/gemini.ts        # Gemini AI client với JSON Contract validation
│   │   ├── storage/secureStore.ts # Quản lý khóa bí mật qua Expo SecureStore
│   │   ├── haptics/hapticService.ts # Service rung phản hồi vật lý
│   │   └── vocabulary/jlptVocabApi.ts # Adapter kết nối JLPT Vocab API chuẩn hóa
│   │
│   ├── stores/                 # MobX State Management
│   │   ├── RootStore.ts        # Khởi tạo và liên kết các feature stores
│   │   ├── SettingsStore.ts    # Cài đặt hiển thị (Furigana, Romaji, Haptics, Gemini Key)
│   │   ├── ProgressStore.ts    # Streak, XP, Nhiệm vụ ngày (Daily Quests), Lịch Heatmap
│   │   ├── ReviewStore.ts      # Quản lý hàng đợi ôn tập SRS và Undo
│   │   ├── VocabularyStore.ts  # Quản lý phiên học từ vựng JLPT N5→N1
│   │   ├── NotebookStore.ts    # Quản lý câu đào (Sentence Mine) và thẻ Cloze
│   │   ├── AiStore.ts          # Điều phối câu hỏi và phản hồi từ Gemini AI
│   │   └── StoreContext.tsx    # React Context & Hooks tiêu chuẩn
│   │
│   └── components/             # Các thành phần giao diện tái sử dụng
│       ├── InteractiveSentence.tsx  # Khối câu tương tác đa tầng
│       ├── PitchVisualizer.tsx      # Biểu đồ cao độ Mora nốt chấm
│       ├── GrammarBlock.tsx         # Khối công thức ngữ pháp kiểu Lego
│       ├── KanjiCanvas.tsx          # Phân rã bộ thủ & Lưới chữ Mễ (米)
│       ├── SrsReviewCard.tsx        # Thẻ Flashcard FSRS + Nút Undo
│       ├── StreakHeatmap.tsx        # Biểu đồ chuỗi ngày học
│       ├── DailyQuestCard.tsx       # 3 nhiệm vụ ngày
│       └── AiTutorBottomSheet.tsx   # Khung trượt phản hồi AI
│
├── KE_HOACH_APP_HOC_TIENG_NHAT.md # Kế hoạch sản phẩm & tài liệu kỹ thuật tổng thể
├── THIET_KE_UI_UX.md              # Đặc tả thiết kế UI/UX, Wireframes & Design System
└── package.json                   # Cấu hình dự án & dependencies
```

---

## 🚀 7. Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### 📋 Yêu cầu tiên quyết:
- **Node.js:** phiên bản `18.x` trở lên (đã kiểm thử tương thích tốt với Node 20 / 22 / 26).
- **Trình quản lý gói:** `npm`, `yarn` hoặc `pnpm`.
- **Thiết bị chạy:** iPhone / Android thật (cài sẵn app **Expo Go** từ App Store / Google Play) hoặc **iOS Simulator / Android Emulator**.

---

### 📦 Các bước cài đặt:

1. **Clone repository về máy:**
   ```bash
   git clone git@github.com:nhathuy2401/japanese-study.git
   cd japanese-study
   ```

2. **Cài đặt các gói thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển Expo (Metro Bundler):**
   ```bash
   npx expo start
   ```

---

### 📲 Xem ứng dụng:

#### Cách 1: Chạy trên iPhone / Android thật qua Expo Go
1. Mở ứng dụng **Camera** trên điện thoại.
2. Quét **mã QR** hiển thị trên cửa sổ Terminal.
3. Bấm vào liên kết để mở trực tiếp trong **Expo Go**.

#### Cách 2: Chạy trên iOS Simulator (Máy Mac)
- Khi Terminal đang chạy `npx expo start`, nhấn phím **`i`** trên bàn phím.
- Hoặc chạy lệnh trực tiếp:
  ```bash
  npx expo start --ios
  ```

---

## 🔒 8. Bảo mật & Quyền riêng tư (Security & Privacy)

- **Offline-First:** Tất cả dữ liệu học tập cá nhân, tiến độ, ghi chú, câu mine và lịch sử ôn tập đều được lưu trữ **100% cục bộ trên thiết bị của bạn** bằng SQLite.
- **Không lưu trữ API Key lộ thiên:** Khóa Gemini API do bạn nhập được lưu trữ trong phân vùng bộ nhớ bảo mật phần cứng (`Keychain` trên iOS và `Keystore` trên Android) thông qua thư viện `expo-secure-store`.
- **Không tự động gửi dữ liệu:** Chỉ khi bạn chủ động bấm nút *"Hỏi AI"* hoặc *"Chấm bài"*, nội dung của câu đó mới được gửi tới Google Gemini API để xử lý.

---

## 📄 9. Giấy phép (License)

Dự án được phát triển cho mục đích học tập cá nhân và nghiên cứu công nghệ giáo dục. Phát hành dưới giấy phép **[MIT License](LICENSE)**.

<div align="center">

---

**Made with ❤️ for Japanese learners around the world.**  
*Chúc bạn học tiếng Nhật vui vẻ và sớm chinh phục mục tiêu JLPT! 🎌*

</div>
