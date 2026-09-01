# Kế hoạch streak theo ngày

## Mục tiêu

Thay streak demo hiện tại bằng streak học thật theo **ngày local của người dùng**. Một người học bao nhiêu hoạt động trong cùng một ngày vẫn chỉ được tính một ngày streak.

## Định nghĩa streak

- Một ngày được tính khi người học có ít nhất một hoạt động học hợp lệ.
- Hoạt động hợp lệ ở giai đoạn đầu:
  - Hoàn thành lesson.
  - Chấm ít nhất một thẻ SRS.
  - Hoàn thành bài luyện pitch/shadowing.
- Không tăng lại nếu cùng ngày đã được ghi nhận.
- Học hôm nay sau khi đã học hôm qua: `currentStreak + 1`.
- Học hôm nay khi ngày học gần nhất cách quá một ngày: streak mới là `1`.
- Nếu mở app và ngày học gần nhất cách hôm nay quá một ngày: hiển thị `0`; không cần cron job để reset.

## State cần lưu

```ts
interface StreakState {
  currentStreak: number;
  lastStudyDay: string | null; // YYYY-MM-DD theo local timezone
  activityDays: string[];      // danh sách ngày đã học, giữ tối đa 365 ngày
  updatedAt: string;
}
```

Không dùng `new Date().toISOString().split('T')[0]` cho streak vì đó là ngày UTC. Tạo helper `getLocalDayKey(date): string` bằng năm/tháng/ngày local của thiết bị.

## Thuật toán

```text
recordStudyActivity(now):
  today = getLocalDayKey(now)

  nếu lastStudyDay === today:
    return  // idempotent, không tăng streak

  nếu lastStudyDay === getLocalDayKey(now - 1 ngày):
    currentStreak += 1
  ngược lại:
    currentStreak = 1

  lastStudyDay = today
  thêm today vào activityDays nếu chưa có
  cắt activityDays còn 365 ngày gần nhất
  lưu local trước, rồi đưa vào queue sync Firestore

getDisplayStreak(now):
  nếu lastStudyDay là hôm nay hoặc hôm qua: trả currentStreak
  ngược lại: trả 0
```

## Thay đổi mã nguồn

1. Tạo `src/domain/streak/streak.ts` chứa `getLocalDayKey`, `addLocalDays`, `recordStudyActivity` và `getDisplayStreak`; toàn bộ hàm có test đơn vị.
2. Thay `ProgressStore.currentStreak = 12` và `weeklyActivity` cứng bằng state `StreakState` được hydrate từ local storage.
3. Đổi `recordStudySession()` thành `recordStudyActivity(source)` và gọi từ:
   - lúc hoàn thành lesson;
   - ngay sau lần đánh giá thẻ SRS đầu tiên trong ngày;
   - lúc hoàn thành pitch/self-score.
4. Không gọi trực tiếp từ UI nếu service học có thể làm việc đó, để tránh các màn hình khác tính khác nhau.
5. Tạo `weeklyActivity` từ 7 `activityDays` gần nhất; label phải theo ngày thực tế và xác định đúng ô hôm nay.
6. Đưa `currentStreak`, `lastStudyDay`, `activityDays`, `updatedAt` vào payload Firestore hiện có.
7. Khi login/sync lần đầu, merge theo `updatedAt`; nếu cloud mới hơn thì lấy cloud. Không ghi đè local âm thầm.
8. Đổi ngày trong session-summary GAS sang `getLocalDayKey` để báo cáo Sheet khớp ngày streak.

## Quy tắc lưu và đồng bộ

- Local storage là nguồn hoạt động tức thời khi offline.
- Firestore chỉ là bản đồng bộ đa thiết bị.
- Ghi Firestore theo debounce/batch, không ghi mỗi lần render.
- Khi hai thiết bị cùng hoạt động trong một ngày, `activityDays` phải được union/deduplicate; `currentStreak` được tính lại từ chuỗi ngày thay vì tin tuyệt đối vào giá trị cũ.

## Kiểm thử bắt buộc

- Học 3 lần trong cùng ngày: streak chỉ tăng một lần.
- Học hôm qua rồi hôm nay: streak tăng một.
- Bỏ một ngày rồi học lại: streak bằng một.
- Mở app sau khi bỏ quá một ngày: UI hiển thị zero.
- 23:59 rồi 00:01 theo timezone Việt Nam: hai ngày khác nhau.
- Người dùng ở timezone khác: không dùng UTC làm ngày học.
- Một review SRS, lesson hoàn thành và pitch hoàn thành trong cùng ngày: vẫn chỉ một streak day.
- Restart app: streak/hotmap được khôi phục từ local storage.
- Offline rồi online: Firestore merge không tạo trùng `activityDays`.

## Tiêu chí hoàn thành

- Streak không còn tăng theo số lesson trong ngày.
- UI, heatmap và session summary cùng dùng một `getLocalDayKey`.
- Dữ liệu streak tồn tại sau khi restart app và đồng bộ được giữa thiết bị.
- Các test biên ngày, timezone và nhiều hoạt động trong một ngày đều pass.
