# Nihongo Local — Đặc tả Thiết kế UI/UX & Trải nghiệm Người dùng Toàn diện

> **Mục tiêu tài liệu:** Thiết lập chuẩn mực thiết kế giao diện (UI) và trải nghiệm người dùng (UX) cho ứng dụng học tiếng Nhật **Nihongo Local** (React Native + Expo).  
> **Thách thức cốt lõi:** Làm sao để giao diện vừa **cực kỳ trực quan, thân thiện, không gây choáng ngợp cho người mới bắt đầu (Newbie)**, vừa **tinh gọn, tốc độ, đào sâu sắc thái và chuyên nghiệp cho người đã có nền tảng (N4 → N2)**.

---

## 1. Triết lý Thiết kế & Định hướng Sản phẩm (North Star)

### 1.1. Tinh thần chủ đạo: *“Zen & Swift — Tối giản tĩnh lặng, Phản hồi tức thời”*
- **Không xao nhãng (Frictionless):** Loại bỏ toàn bộ các yếu tố thừa thãi, banner quảng cáo, bảng xếp hạng ồn ào. Không gian học tập mang hơi hướng *Wabi-Sabi* hiện đại — thoáng đãng, tập trung, nhẹ nhàng.
- **Tiết lộ lũy tiến (Progressive Disclosure):** Màn hình ban đầu luôn tối giản nhất có thể. Chi tiết sâu (bộ thủ, âm On/Kun hiếm, sắc thái văn phong, F0 pitch accent) chỉ xuất hiện khi người dùng chạm hoặc kích hoạt.
- **Mọi ký tự tiếng Nhật đều tương tác được (Interactive Tokens):** Không hiển thị văn bản tĩnh chết. Mọi từ vựng, kanji, mẫu ngữ pháp xuất hiện trong câu đều có thể **chạm để tra cứu ngay lập tức** (Tap-to-inspect).

---

### 1.2. Giải quyết bài toán: Newbie vs. Người có nền tảng

| Tiêu chí | Người mới bắt đầu (Newbie / Nhập môn / N5) | Người đã có nền tảng (N4 → N2) |
| :--- | :--- | :--- |
| **Nỗi sợ / Trở ngại** | Nhìn thấy một khối Kana/Kanji bị "rối mắt", sợ đọc sai, không biết bắt đầu từ đâu. | Ghét nhìn Romaji, thấy Furigana làm cản trở việc nhớ mặt chữ Kanji, ghét các bài tập quá dễ kéo dài lê thê. |
| **Cách xử lý Furigana / Romaji** | Mặc định **Hiện Furigana + Romaji trợ âm** (có thể tắt dần). | Mặc định **Ẩn hoàn toàn Romaji**, Furigana ở chế độ **Tap-to-reveal** (chạm vào từ nào mới hiện cách đọc từ đó). |
| **Giải thích Ngữ pháp** | Dùng từ ngữ đời thường, sơ đồ trực quan (Lego blocks), ví dụ ngắn và kèm dịch nghĩa từng từ. | Bảng so sánh sắc thái đối chiếu (*nuance differential*), văn phong (văn nói/viết/kính ngữ), bài tập phân biệt từ gần nghĩa. |
| **Kanji** | Phân rã theo hình ảnh gợi nhớ (Mnemonics), thứ tự nét vẽ có chỉ dẫn mờ trên lưới ô vuông. | Học theo họ Kanji cùng bộ thủ/âm đọc (*Kanji Families*), từ ghép thực tế, sắc thái cấu thành từ. |
| **Luyện phát âm & Pitch** | Vẽ đường cao độ đơn giản hóa (Cao / Thấp), đếm nhịp phách Mora rõ ràng. | Biểu đồ đường cong Pitch Accent chuẩn xác (Heiban, Atamadaka, Nakadaka, Odaka), so sánh Waveform bản thu cá nhân với người bản xứ. |
| **Tốc độ thao tác (Pacing)** | Bước từng bước, giải thích ngay sau mỗi câu trả lời. | Chế độ "Speed Run SRS", hỗ trợ phím tắt / cử chỉ vuốt cực nhanh (Swipe gesture 1-2-3-4). |

---

## 2. Hệ thống Thiết kế (Design System & Design Tokens)

### 2.1. Bảng màu (Color Palette) — Cảm hứng Nhật Bản Đương đại

Hệ màu được tinh chỉnh với độ tương phản cao đạt chuẩn **WCAG AAA**, dịu mắt khi học lâu:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PRIMARY & BRAND COLORS                          │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│  Indigo Deep      │  Sakura Accent    │  Bamboo Green     │  Matcha Dark    │
│  #1E293B (Ink)    │  #F43F5E (Accent) │  #10B981 (Success)│  #065F46        │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PITCH ACCENT COLORS                              │
├───────────────────────────────────────┬─────────────────────────────────────┤
│  Pitch High (Cao độ cao):             │  Pitch Low (Cao độ thấp):           │
│  #E11D48 (Crimson Red / Đỏ son)       │  #0284C7 (Ocean Blue / Xanh lam)    │
└───────────────────────────────────────┴─────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────────────┐
│                             JLPT LEVEL BADGES                               │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│  N5: Green  │  N4: Teal   │  N3: Amber  │  N2: Indigo │  Nhập môn: Purple   │
│  #22C55E    │  #14B8A6    │  #F59E0B    │  #6366F1    │  #A855F7            │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────────────┘
```

#### Bảng màu Light Mode & Dark Mode

| Token Name | Light Mode | Dark Mode (OLED Friendly) | Ứng dụng |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#F8FAFC` (Slate 50) | `#0B0F17` (True Deep Slate) | Nền toàn ứng dụng |
| `bg-surface` | `#FFFFFF` (Pure White) | `#151D2A` (Elevated Card) | Nền thẻ bài học, ô bài tập |
| `bg-subtle` | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) | Vùng chứa ví dụ, ô ngữ pháp |
| `text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Tiêu đề, chữ tiếng Nhật chính |
| `text-secondary` | `#475569` (Slate 600) | `#94A3B8` (Slate 400) | Dịch nghĩa, giải thích |
| `text-tertiary` | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) | Romaji, Furigana mờ, số mora |
| `border-subtle` | `#E2E8F0` (Slate 200) | `#243044` (Slate 700) | Đường phân cách, viền card |
| `accent-correct`| `#10B981` (Emerald 500)| `#059669` (Emerald 600) | Phản hồi đúng |
| `accent-wrong`  | `#EF4444` (Red 500)    | `#DC2626` (Red 600)     | Phản hồi sai |

---

### 2.2. Nghệ thuật chữ & Tỷ lệ hiển thị (Typography Hierarchy)

Học tiếng Nhật đòi hỏi xử lý đồng thời 3 tầng văn bản: **Furigana (Kana nhỏ trên đầu)**, **Ký tự chính (Kanji/Kana)**, và **Romaji/Nghĩa dịch**.

#### Cặp Font (Font Pairing):
- **Tiếng Nhật:** `Noto Sans JP` / `Hiragino Sans` (cho Android / iOS) — Nét chữ cân bằng, rõ từng nét bộ thủ kể cả ở size nhỏ.
- **Tiếng Việt & Số:** `Plus Jakarta Sans` / `SF Pro Display` — Hiện đại, hình học dễ đọc.

#### Tỷ lệ kích thước và độ giãn dòng:
```text
┌────────────────────────────────────────────────────────┐
│  [f u r i g a n a]         font-size: 11px / #94A3B8   │  <- Tầng 1: Furigana
│  日 本 語                  font-size: 26px / #0F172A   │  <- Tầng 2: Chữ Nhật chính
│  ni-hon-go (Tiếng Nhật)    font-size: 13px / #475569   │  <- Tầng 3: Nghĩa / Romaji
└────────────────────────────────────────────────────────┘
```
> **Quy chuẩn kỹ thuật:** Line-height cho khối văn bản tiếng Nhật phải đặt tối thiểu là `1.8` đến `2.0` để khi chèn Furigana không bị đè chữ hoặc giật khung hình.

---

### 2.3. Lưới khoảng cách & Vùng chạm (Spacing & Touch Targets)
- **Hệ thống lưới:** Bội số của `4px` (`4`, `8`, `12`, `16`, `20`, `24`, `32`, `48`).
- **Touch Target tối thiểu:** `48x48 dp` cho mọi nút bấm, thẻ bài tập, nút SRS và ký tự chọn để tránh bấm nhầm trên màn hình cảm ứng di động.
- **Bo góc (Corner Radius):**
  - Thẻ lớn (Card): `16px` (`rounded-2xl`)
  - Nút bấm & Input: `12px` (`rounded-xl`)
  - Tag & Huy hiệu (Badge): `8px` hoặc `9999px` (Pill shape)

---

## 3. Các Thành phần Giao diện Cốt lõi (Core Interactive Components)

### 3.1. Khối Câu Tương Tác Đa Tầng (Interactive Sentence Tokenizer)

Mọi câu tiếng Nhật trong app đều được chia thành các "Token" từ vựng có thể tương tác:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  [Câu ví dụ trong bài học]                                  🔊 [Nghe]  │
│                                                                         │
│    ┌─────────┐   ┌───┐   ┌─────────┐   ┌───┐   ┌─────────────┐          │
│    │ わたし  │   │   │   │ にほんご│   │   │   │ べんきょう  │          │
│    │  私     │   │ は│   │ 日本語  │   │ を│   │   勉強      │ します   │
│    └─────────┘   └───┘   └─────────┘   └───┘   └─────────────┘          │
│       (Danh từ)  (Trợ từ)  (Danh từ)  (Trợ từ)    (Động từ)             │
│                                                                         │
│  💬 "Tôi học tiếng Nhật."                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Trạng thái tương tác khi Chạm (Tap):
1. **Chạm lần 1 vào một từ (ví dụ `日本語`):** Mở Popup mini (Quick Popover) hiển thị:
   - Cách đọc Hiragana (`にほんご`) + Pitch accent (`[2] Nakadaka: 低-高-高-低`).
   - Âm Hán Việt (`NHẬT BẢN NGỮ`).
   - Nghĩa nhanh trong ngữ cảnh + Nút `[⭐ Lưu vào Sổ tay]`.
2. **Cơ chế 3 chế độ đọc thích ứng (Global Reading Modes):**
   - **Mode 1: Newbie (Nhập môn):** Luôn hiện Furigana phía trên Kanji + Romaji mờ bên dưới.
   - **Mode 2: Smart Active Recall (Mặc định gợi ý):** Furigana bị ẩn bằng ô màu xám mờ. Chạm vào chữ nào sẽ lật mở Furigana chữ đó.
   - **Mode 3: Hardcore (N3-N2):** Ẩn hoàn toàn Furigana và Romaji, chỉ hiện chữ Hán thuần túy.

---

### 3.2. Bộ Trực quan hóa Cao độ (Pitch Accent Visualizer)

Phát âm tiếng Nhật chuẩn cần nắm rõ cao độ từng Mora. Giao diện thể hiện dạng biểu đồ bậc thang trực quan:

```text
Ví dụ: Từ "雨" (Mưa - Atamadaka [1]) vs "飴" (Kẹo - Heiban [0])

1. あめ (雨 - Mưa): Kiểu [1] Atamadaka (Cao -> Thấp)
   CAO   ● [a]
          \
   THẤP    \__● [me]
   Mora:   1    2
   
2. あめ (飴 - Kẹo): Kiểu [0] Heiban (Thấp -> Cao đều)
   CAO        ● [me] ── [Trợ từ が]
             /
   THẤP  ● [a]
   Mora:   1    2
```

#### Chi tiết thiết kế UI của Pitch Visualizer:
- **Dấu chấm Mora (Mora Node):** Mỗi âm tiết là 1 điểm tròn.
- **Đường nối Gradient (Pitch Vector):** Nối giữa các điểm tròn, đổi màu Đỏ son (High) sang Xanh lam (Low).
- **Trợ từ đính kèm (Particle Connector):** Ký hiệu nét đứt biểu thị cao độ rơi vào trợ từ đi liền sau (`が`, `を`, `に`).
- **Hỗ trợ người mù màu:** Kèm nhãn ký hiệu `H` (High) / `L` (Low) trên từng nốt và mũi tên `▲` / `▼`.

---

### 3.3. Khối Công thức Ngữ pháp (Grammar Formula Lego Block)

Ngữ pháp được cấu trúc như các khối lắp ghép (Lego) giúp người học nắm bắt cách chia ngay lập tức:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  NGỮ PHÁP: 〜てはいけません (Không được làm gì / Cấm đoán)              │
├─────────────────────────────────────────────────────────────────────────┤
│  [CÔNG THỨC KẾT NỐI]                                                    │
│  ┌─────────────────────────┐   ┌───────────────────────────┐            │
│  │   Động từ thể て (V-て)  │ + │   はいけません            │            │
│  │   Ví dụ: たべて (Ăn)     │   │   (Không được...)         │            │
│  └─────────────────────────┘   └───────────────────────────┘            │
│                                                                         │
│  [HUY HIỆU SẮC THÁI - NUANCE BADGES]                                   │
│  [ ⛔ Cấm đoán/Quy tắc ]   [ 👔 Lịch sự / Trang trọng ]   [ 🗣️ Văn nói ] │
│                                                                         │
│  ⚠️ [LỖI NGƯỜI VIỆT THƯỜNG GẶP]                                         │
│  "Đừng nhầm với 〜ないでください (Xin đừng làm - dạng nhờ vả nhẹ nhàng). │
│   〜てはいけません mang tính quy tắc, biển cấm hoặc lời người lớn nhắc nhở."│
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4. Giải phẫu Kanji & Vùng vẽ nét (Kanji Anatomy & Canvas)

Giao diện chi tiết Kanji kết hợp phân tách bộ thủ và bảng tập viết:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  KANJI N5: 休 (HƯU - Nghỉ ngơi)                     Số nét: 6          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐   ┌─────────────────────────────────────┐  │
│  │      VÙNG VẼ NÉT        │   │        PHÂN RÃ THÀNH PHẦN           │  │
│  │   ┌───┬───┐             │   │  休 = 亻 (Người) + 木 (Cây)         │  │
│  │   │ ＼│／ │   [ 1 ] ➔   │   │                                     │  │
│  │   ├───┼───┤             │   │  💡 CÂU CHUYỆN GỢI NHỚ:             │  │
│  │   │ ／│＼ │             │   │  "Một NGƯỜI (亻) tựa lưng vào      │  │
│  │   └───┴───┘             │   │   gốc CÂY (木) để NGHỈ NGƠI (休)." │  │
│  │  Lưới Mễ (米 Grid)     │   │                                     │  │
│  │  [ ↺ Vẽ lại ] [ 👁️ Gợi ý]│   │  • On: KYŪ (きゅう)                 │  │
│  │                         │   │  • Kun: yasu-mu (休む)              │  │
│  └─────────────────────────┘   └─────────────────────────────────────┘  │
│  [TỪ GHÉP QUAN TRỌNG]                                                   │
│  • 休み (yasumi) : Ngày nghỉ       • 休日 (kyūjitsu) : Ngày lễ          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.5. Thẻ Ôn tập SRS (FSRS Review Card)

Giao diện thẻ SRS tối ưu cho ngón tay cái (Thumb-zone), hiển thị trực tiếp khoảng cách ôn tập tiếp theo:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  [SRS Review] ── Thẻ 14/25                            [ ↩️ Hoàn tác ]   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╸━━━━━━━━━━━━━━━━━━━━━━━━ 56%             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                                 約束                                    │
│                              [やくそく]                                 │
│                                                                         │
│                 "Lời hứa, hẹn ước (Danh từ / Động từ Suru)"             │
│                                                                         │
│            💬 友達と約束があります。(Tôi có hẹn với bạn.)               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [ 4 NÚT ĐÁNH GIÁ KÈM THỜI GIAN DỰ TÍNH FSRS ]                          │
│  ┌────────────┬────────────┬────────────┬────────────┐                  │
│  │    QUÊN    │    KHÓ     │    ĐƯỢC    │     DỄ     │                  │
│  │   < 10p    │    1 ngày  │   3 ngày   │   7 ngày   │                  │
│  │  [ Đỏ #EF ]│ [ Cam #F5 ]│ [ Xanh #10]│[ Xanh #63 ]│                  │
│  └────────────┴────────────┴────────────┴────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Đặc tả Chi tiết Từng Màn hình (Screen-by-Screen Specification)

### 4.1. Luồng Onboarding & Phân nhánh Người học (Adaptive Onboarding)

Mục tiêu: Đưa người dùng vào bài học đầu tiên trong vòng **dưới 60 giây**, không bắt đăng ký tài khoản.

```text
[Màn 1: Chào mừng] ───> [Màn 2: Chọn trình độ] ───> [Màn 3: Tùy chỉnh hiển thị]
                             │
                             ├─► "Tôi là người mới tinh" (Bắt đầu từ Bảng chữ cái)
                             ├─► "Đã thuộc Hiragana/Katakana" (Vào thẳng N5)
                             └─► "Đã có nền tảng (N4/N3/N2)" 
                                      │
                                      ▼
                             [Làm bài Quick Test 3 phút] hoặc [Bỏ qua để mở khóa cấp độ]
```

#### Màn hình Tùy chỉnh Hiển thị (Display Preferences Screen):
- **Công tắc 1: Hiển thị Romaji (Chữ cái Latinh)**
  - *Bật:* Thích hợp người mới học tuần đầu.
  - *Tắt (Khuyên dùng):* Ép não bộ đọc trực tiếp chữ Kana/Kanji.
- **Công tắc 2: Chế độ Furigana**
  - *Luôn hiện / Chỉ hiện khi chạm (Tap-to-reveal) / Tắt hoàn toàn*.
- **Công tắc 3: Mục tiêu hàng ngày**
  - `10 phút/ngày (Thong thả)` | `20 phút/ngày (Tiêu chuẩn)` | `30 phút/ngày (Cường độ cao)`.

---

### 4.2. Màn hình "Hôm nay" (Today Dashboard) — Tab 1

Màn hình chính khi mở app, tập trung hoàn toàn vào hành động cần làm trong ngày.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  NIHONGO LOCAL                             🔥 Streak: 12 ngày  ⚙️ Cài đặt│
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  🎯 TIẾP TỤC HỌC                                                 │  │
│  │  Bài 4: Mẫu câu 〜てください (Nhờ vả lịch sự)                      │  │
│  │  Tiến độ: 3/5 bài tập                                             │  │
│  │  [ ▶ TIẾP TỤC HỌC NGAY - 5 PHÚT ]                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  📦 CẦN ÔN TẬP HÔM NAY (SRS DUE)                                  │  │
│  │  Tổng số: 18 thẻ đến hạn                                          │  │
│  │  ┌─────────────────┬─────────────────┬─────────────────┐          │  │
│  │  │  8 Ngữ pháp     │  6 Kanji        │  4 Từ vựng      │          │  │
│  │  │  [#6366F1]      │  [#F59E0B]      │  [#10B981]      │          │  │
│  │  └─────────────────┴─────────────────┴─────────────────┘          │  │
│  │  [ ⚡ BẮT ĐẦU PHIÊN ÔN TẬP NHANH ]                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  🏆 NHIỆM VỤ NGÀY (DAILY QUESTS)                                  │  │
│  │  [✓] Hoàn thành 1 bài học mới                     (+20 XP)        │  │
│  │  [ ] Luyện 1 câu Shadowing phát âm                 (+15 XP)        │  │
│  │  [ ] Ôn tập toàn bộ 18 thẻ SRS                    (+25 XP)        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  📅 LỊCH CHUỖI HỌC (HEATMAP STREAK)                                │  │
│  │  T2   T3   T4   T5   T6   T7   CN                                 │  │
│  │  🟩   🟩   🟩   🟩   🟩   🟩   ⬜ (Hôm nay)                        │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3. Màn hình Lộ trình Học (Roadmap / Learn) — Tab 2

Trực quan hóa lộ trình từ Nhập môn đến N2 theo dạng Bản đồ chặng (Node Map).

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  [ < Cấp độ: JLPT N5 ] ⌵                  🔍 Tìm bài học   🏷️ Bộ lọc     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│      ( ⭐ CHECKPOINT NHẬP MÔN: KANA & PHÁT ÂM - HOÀN THÀNH )            │
│                               │                                         │
│                               ▼                                         │
│      ┌──────────────────────────────────────────────┐                   │
│      │ UNIT 1: CHÀO HỎI & GIỚI THIỆU BẢN THÂN       │                   │
│      │ 3/3 Bài học  •  Đã mở khóa                   │                   │
│      └──────────────────────────────────────────────┘                   │
│                               │                                         │
│                               ▼                                         │
│      ┌──────────────────────────────────────────────┐                   │
│      │ UNIT 2: ĐỒ VẬT, ĐỊA ĐIỂM & SỐ ĐẾM (ĐANG HỌC) │                   │
│      │                                              │                   │
│      │  ( ● ) Bài 1: Trợ từ これ・それ・あれ            │ [Đã học]          │
│      │  ( ▶ ) Bài 2: Hỏi giá tiền いくら            │ [HỌC TIẾP]        │
│      │  ( ○ ) Bài 3: Kanji Số đếm 1-10              │ [Chưa học]        │
│      │                                              │                   │
│      │  [ ⚔️ THI THỬ UNIT CHECKPOINT ]              │                   │
│      └──────────────────────────────────────────────┘                   │
│                               │                                         │
│                               ▼                                         │
│      ┌──────────────────────────────────────────────┐                   │
│      │ UNIT 3: HOẠT ĐỘNG HÀNG NGÀY (THỂ ĐỘNG TỪ)    │                   │
│      │ 🔒 Cần hoàn thành Unit 2 hoặc [Làm bài Test] │                   │
│      └──────────────────────────────────────────────┘                   │
│                                                                         │
│  💡 [Dành cho người có nền tảng]:                                       │
│  Nút [🔓 BỎ QUA CẤP ĐỘ NÀY] hiển thị ở góc giúp làm test nhảy vọt lên N4/N3│
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4.4. Màn hình Trình diễn Bài học (Interactive Lesson Engine)

Khi bắt đầu học một bài mới, ứng dụng chuyển sang chế độ tập trung toàn màn hình (Modal Focus View):

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  ✕ Thoát             Bài 2: Trợ từ を (Tân ngữ)             [ 3/7 ] ─── │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [DẠNG BÀI TẬP: SẮP XẾP TỪ THÀNH CÂU HOÀN CHỈNH]                       │
│                                                                         │
│  Dịch câu sau: "Tôi uống nước hoa quả."                                │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  VÙNG ĐÁP ÁN:                                                     │  │
│  │  [ わたしは ] [ ジュース ] [ を ] [ のみます ]                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  NGÂN HÀNG TỪ VỰNG GỢI Ý (Bấm để đưa lên vùng đáp án):                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ ジュース │  │  のみます │  │    を    │  │ わたしは │                 │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                 │
│  ┌──────────┐  ┌──────────┐                                             │
│  │    に    │  │  たべます│  (2 từ gây nhiễu)                           │
│  └──────────┘  └──────────┘                                             │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [BOTTOM SHEET KẾT QUẢ KHI BẤM "KIỂM TRA"]                              │
│  🎉 CHÍNH XÁC!                                              🔊 [Phát âm]│
│  Giải thích: Trợ từ を đứng sau danh từ (ジュース) để chỉ đối tượng bị tác│
│  động bởi hành động uống (のみます).                                      │
│                                                                         │
│  [ NÚT: TIẾP TỤC (Phím cách / Enter) ]                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Các dạng bài tập tương tác được hỗ trợ:
1. **Interactive Sentence Builder:** Chạm/Kéo thả các khối từ thành câu hoàn chỉnh.
2. **Cloze Gap Fill (Điền trợ từ / Chia thể):** Bấm chọn từ đúng trong 4 phương án nhanh.
3. **Nuance Picker (Chọn câu tự nhiên hơn):** So sánh 2 câu có ngữ nghĩa tương tự nhưng khác nhau về sắc thái lịch sự/thân mật.
4. **Error Buster (Sửa lỗi câu cố ý):** Cho 1 câu tiếng Nhật có 1 lỗi sai trợ từ hoặc chia thể, chạm trực tiếp vào từ sai để sửa.
5. **Pitch Match (Khớp cao độ):** Nghe từ và chọn đường pitch accent tương ứng.

---

### 4.5. Màn hình Luyện phát âm & Shadowing (Pitch & Audio Lab)

Màn hình chuyên sâu giúp luyện ngữ điệu chuẩn người bản xứ mà không học vẹt.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  < Luyện Shadowing                             Bài: N5 - Đi siêu thị    │
├─────────────────────────────────────────────────────────────────────────┤
│  CÂU MỤC TIÊU:                                                          │
│  これ を ください。(Cho tôi cái này.)                                   │
│                                                                         │
│  [BIỂU ĐỒ CAO ĐỘ CHUẨN (NATIVE PITCH ACCENT)]                           │
│  CAO         ●[れ]                   ●[だ]                              │
│             / \                     / \                                 │
│  THẤP    ●[こ]  \__●[を]         ●[く]  \__●[さ]__●[い]                 │
│                                                                         │
│  [AUDIO MẪU BẢN XỨ]                                                     │
│  ▶ Phát [1.0x]   [ 0.8x Chậm ]   [ 🔁 Lặp đoạn A-B ]                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [BẢN THU ÂM CỦA BẠN]                                                   │
│  Waveform:  |||||i||||||||i|||||||||||||||i|||                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  🎙️ [ GIỮ ĐỂ THU ÂM / CHẠM ĐỂ BẮT ĐẦU ]                           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  [ 🔊 Nghe lại bản thu ]    [ ⚖️ Phát đối chiếu liên tiếp ]              │
│                                                                         │
│  ĐÁNH GIÁ CỦA BẠN:                                                      │
│  [ 😟 Chưa giống ]      [ 😊 Khá ổn ]      [ 🌟 Rất chuẩn ]            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4.6. Màn hình Sổ tay & Đào câu (Notebook & Sentence Mining) — Tab 4

Tính năng yêu thích của người học trung cấp: Tự lưu trữ câu thực tế và tạo thẻ SRS trong 1 chạm.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  SỔ TAY CÁ NHÂN                                🔍 Tìm kiếm   ➕ Thêm câu │
├─────────────────────────────────────────────────────────────────────────┤
│  [Bộ lọc: Tất cả | Câu đã lưu (24) | Kanji yêu thích (15) | Ngữ pháp (8)]│
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  CÂU MINE TỪ ANIME / PHIM:                                        │  │
│  │  「そんな[つもり]じゃなかったのに...」                               │  │
│  │  Nghĩa: "Tôi đâu có ý định làm thế đâu..."                        │  │
│  │  Tag: #N3 #Tsumori #GiaoTiep                                      │  │
│  │                                                                   │  │
│  │  ⚙️ Thao tác nhanh:                                               │  │
│  │  [ 🎴 Biến thành thẻ Cloze SRS ]  [ 🤖 Nhờ AI phân tích ]  [ 🗑️ ] │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  TÍNH NĂNG TẠO CLOZE TRONG 1 CHẠM:                                │  │
│  │  Chỉ cần chạm vào chữ "つもり" trong câu -> Từ đó lập tức biến      │  │
│  │  thành ô trống [ ... ] để làm bài tập ôn tập!                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 4.7. Giao diện Trợ giảng Gemini AI (Tùy chọn & Tinh gọn)

AI không can thiệp vào luồng học offline, mà đóng vai trò như một **Drawer / Bottom Sheet hỗ trợ khi cần**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  [Bài tập Ngữ pháp: 〜わけではない]                                    │
│  ... Nội dung bài học chính đang diễn ra ...                            │
│                                                   [ ✨ Nhờ Trợ giảng AI ]│
├─────────────────────────────────────────────────────────────────────────┤
│  ▲ [BOTTOM SHEET GEMINI AI - BẬT LÊN KHI CHẠM]                          │
│                                                                         │
│  🤖 TRỢ GIẢNG GEMINI (Flash 2.5)                       [ ✕ Đóng ]       │
│                                                                         │
│  "Bạn chưa hiểu chỗ nào trong mẫu câu này?"                             │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  [ Gợi ý 1: Giải thích siêu dễ hiểu cho người mới bắt đầu ]       │  │
│  │  [ Gợi ý 2: So sánh 〜わけではない với 〜というわけではない ]       │  │
│  │  [ Gợi ý 3: Tạo 2 ví dụ trong đời sống công sở ]                  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  💬 PHẢN HỒI CỦA AI:                                                    │
│  "Hãy tưởng tượng ai đó hỏi bạn: 'Có phải bạn ghét đồ ngọt không?'     │
│   Bạn trả lời: 'Không hẳn là ghét (chỉ là đang giảm cân thôi)'.        │
│   Đó chính là 〜わけではない!"                                          │
│                                                                         │
│  [ 📝 Lưu giải thích này vào Note ]     [ 🔄 Đặt câu hỏi khác... ]      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Ma trận Trải nghiệm: So sánh Chi tiết Newbie vs. Advanced

| Tính năng | Trải nghiệm cho Newbie (Nhập môn & N5) | Trải nghiệm cho Người có nền tảng (N4 → N2) |
| :--- | :--- | :--- |
| **Giao diện bảng chữ cái Kana** | Bảng tương tác kèm âm thanh phát âm, hình minh họa nét vẽ, phân biệt âm đục/âm ngắt/trường âm bằng hoạt họa sinh động. | Có thể ẩn hoàn toàn bảng chữ cái khỏi Menu chính; chỉ cần 1 bài test 2 phút để hoàn thành toàn bộ chặng Kana. |
| **Hiển thị Kanji trong bài đọc** | Luôn kèm Furigana to rõ, chạm vào Kanji để xem số nét và hoạt họa thứ tự viết từng nét. | Furigana ẩn dạng "Tap-to-reveal". Nhấn mạnh vào Kanji đồng âm khác nghĩa và từ ghép chuyên sâu. |
| **Thuật ngữ ngữ pháp** | Tránh dùng thuật ngữ ngôn ngữ học phức tạp. Thay "Động từ Ngũ đoạn (Godan)" bằng "Động từ Nhóm 1". | Hiển thị đầy đủ thuật ngữ chuyên môn: Ngũ đoạn, Tự động từ/Tha động từ, Bị động/Sai khiến/Tôn kính ngữ/Khiêm nhường ngữ. |
| **Chấm bài tự viết câu** | AI chấm điểm mức độ dễ dãi: Ưu tiên khuyến khích, sửa lỗi trợ từ cơ bản, không trừ điểm phong cách. | AI chấm khắt khe: So sánh câu viết với cách nói tự nhiên nhất của người bản xứ (Collocation), gợi ý từ đồng nghĩa cao cấp hơn. |
| **Tốc độ ôn thẻ SRS** | Từng thẻ mở ra nhẹ nhàng, tự động phát audio sau khi lật mặt đáp án. | Chế độ "Pro Reviewer": Bấm phím số hoặc vuốt màn hình để chấm điểm ngay, tắt tự động phát âm để tối ưu thời gian ôn 50 thẻ/phút. |

---

## 6. Micro-Interactions, Âm thanh & Haptics (Trải nghiệm Cảm giác)

### 6.1. Phản hồi Rung (Haptic Feedback Matrix)
Ứng dụng sử dụng module rung tương thích của Expo (`expo-haptics`) để tạo cảm giác xúc giác chân thực:
- **Chạm chọn từ trong câu:** `Haptics.impactAsync(ImpactFeedbackStyle.Light)` (Cảm giác nảy nhẹ như phím cơ).
- **Trả lời đúng / Vượt qua bài kiểm tra:** `Haptics.notificationAsync(NotificationFeedbackType.Success)` (Rung 2 nhịp vui vẻ).
- **Chọn sai đáp án:** `Haptics.notificationAsync(NotificationFeedbackType.Warning)` (Rung ngắn trầm).
- **Chấm thẻ SRS (Easy/Good/Hard/Again):** Rung lực biến thiên tương ứng theo độ khó.

### 6.2. Hiệu ứng Chuyển cảnh (Animations & Transitions)
- Sử dụng **React Native Reanimated**:
  - Khi chọn đúng thẻ: Khối từ phát sáng nhẹ viền xanh Emerald (`#10B981`) trong 200ms trước khi chuyển câu.
  - Lật thẻ Flashcard: Hiệu ứng xoay 3D trục Y (Flip 180 độ) mượt mà 60fps.
  - Vẽ nét Kanji: Đường vẽ nét bám theo đầu ngón tay với hiệu ứng mài mòn thư pháp (Calligraphy brush stroke via Skia).

---

## 7. Khung Kỹ thuật Triển khai Giao diện (Technical UI Stack)

Để đảm bảo thiết kế trên được hiện thực hóa mượt mà, chuẩn 60-120fps trên cả iOS và Android:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          UI ARCHITECTURE TECH STACK                         │
├─────────────────────────┬───────────────────────────────────────────────────┤
│  UI Component Styling   │  NativeWind (Tailwind CSS cho React Native)       │
│  Hoạt họa & Chuyển cảnh │  React Native Reanimated + Gesture Handler        │
│  Đồ họa Cao độ & Vẽ nét │  @shopify/react-native-skia                       │
│  Biểu tượng (Icons)     │  Lucide React Native (Nét mảnh, tối giản)         │
│  Quản lý Trạng thái UI  │  MobX Store (`SettingsStore`, `SessionUiStore`)    │
│  Font chữ Local         │  Expo Font (`NotoSansJP`, `PlusJakartaSans`)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Quản lý Trạng thái Cài đặt Giao diện qua MobX (`SettingsStore`):

```ts
export class SettingsStore {
  // Chế độ đọc thích ứng
  furiganaMode: 'always' | 'tap-to-reveal' | 'hidden' = 'tap-to-reveal';
  showRomaji: boolean = false;
  
  // Tùy chọn giao diện
  theme: 'light' | 'dark' | 'system' = 'system';
  hapticsEnabled: boolean = true;
  soundEffectsEnabled: boolean = true;
  fontSizeScale: number = 1.0; // 0.9 -> 1.3
  
  // Tùy chọn học tập
  audioSpeed: number = 1.0; // 0.8, 1.0, 1.2
  srsQuickGestures: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setFuriganaMode(mode: 'always' | 'tap-to-reveal' | 'hidden') {
    this.furiganaMode = mode;
  }

  toggleRomaji(val: boolean) {
    this.showRomaji = val;
  }
}
```

---

## 8. Danh sách Kiểm tra Nghiệm thu Thiết kế (Design DoD Checklist)

Trước khi chuyển giao hoặc hoàn tất bất kỳ màn hình nào trong codebase:

- [ ] **Khả năng tiếp cận (Accessibility):** Độ tương phản văn bản đạt WCAG AA trở lên. Mọi nút bấm có nhãn accessibility label cho Screen Reader.
- [ ] **Màn hình nhỏ:** Layout không bị vỡ hoặc đè chữ trên các thiết bị màn hình nhỏ (như iPhone SE hoặc Android 4.7 inch).
- [ ] **Hỗ trợ Dark Mode:** Chuyển đổi mượt mà giữa Light và Dark mode không để sót text màu đen trên nền tối.
- [ ] **Line-height Furigana:** Văn bản tiếng Nhật không bị cắt ngọn dấu Furigana phía trên.
- [ ] **Offline Readiness:** Không xuất hiện icon loading vĩnh viễn khi không có internet; các trạng thái trống (empty state) luôn có nút hướng dẫn cụ thể.

---

> **Tóm lại:** Bản đặc tả này đóng vai trò là "kim chỉ nam" xuyên suốt quá trình lập trình giao diện của Nihongo Local. Sự kết hợp giữa **tính tương tác chạm tức thời**, **chế độ đọc thích ứng (Newbie vs Pro)** và **trực quan hóa bằng hình khối (Lego / Pitch curve / Kanji anatomy)** sẽ biến ứng dụng thành một công cụ học tiếng Nhật trực quan, hiện đại và sâu sắc nhất.

