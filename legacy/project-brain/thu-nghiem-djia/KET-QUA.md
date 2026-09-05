# Kết quả thử nghiệm: Ứng Kỳ Thê Tài vs DJIA

Chạy lúc: 2026-09-05T05:10:28.252Z
Nguồn dữ liệu: `legacy/project-brain/thu-nghiem-djia/DJA.csv` (36863 phiên, 1885-05-02 → 2019-12-24)
Module khởi quẻ: `src/core/queDich.ts` (`QueDich`), không dùng thư viện ngoài.

## Kết quả chính

- **Thời gian thật, 10h00 sáng mỗi ngày, điểm Thê Tài > 4 → chỉ phát tín hiệu "tang" (module QueDich thật)**: 3191/6116 đúng = 52.17%, z = 3.401 → CÓ ý nghĩa thống kê (95%)
- **Đồng xu ngẫu nhiên (baseline, không dùng ngày tháng, trên toàn bộ mẫu)**: 18195/36655 đúng = 49.64%, z = -1.384 → không có ý nghĩa thống kê

## Số phiên bị loại khỏi mẫu (đúng quy tắc đã định trước trong prompt)

- Đứng yên (`Close[i] == Close[i-1]`): 207 phiên — loại khỏi mẫu.
- Điểm Thê Tài `<= 4` (không đủ bằng chứng để phát tín hiệu "tang" theo quy tắc `>4`, cập nhật 2026-09-05 (9)): 30706 phiên — loại khỏi mẫu.
- Còn lại trong mẫu so sánh (`diem > 4`, không đứng yên): 6116 phiên (≈ 16.6% tổng số phiên).

## Base rate cần biết để diễn giải trung thực

- Tỷ lệ ngày "tang" trên TOÀN BỘ 36655 phiên hợp lệ (không lọc theo Thê Tài): 52.57%.
  Nếu tỷ lệ đúng của quy tắc Thê Tài > 4 ở trên KHÔNG cao hơn rõ rệt con số này, quy tắc không cho thêm thông tin gì so với việc DJIA vốn có xu hướng tăng nền — kể cả khi z-test so với 50% "có ý nghĩa thống kê", vì mốc so sánh đúng phải là base rate này, không phải 50%.

## Phân bố điểm vượng suy Thê Tài (để kiểm tra thang điểm có hợp lý không)

| Điểm | Số phiên |
|---|---|
| -6 | 38 |
| -5 | 222 |
| -4 | 661 |
| -3 | 2100 |
| -2 | 5260 |
| -1 | 4057 |
| 0 | 1522 |
| 1 | 6875 |
| 2 | 7476 |
| 4 | 2495 |
| 5 | 4979 |
| 8 | 1177 |

Tổng thời gian chạy: 1.6s

## Giới hạn (nhắc lại từ prompt gốc)

- Đây là thử nghiệm minh họa, tự thiết kế, chưa qua bình duyệt khoa học.
- Baseline ngẫu nhiên ở trên chạy một lần bằng `Math.random()`, không cố định seed —
  chạy lại sẽ ra số hơi khác (dao động quanh 50%), không dùng để so sánh chính xác
  từng chữ số, chỉ để có một mốc "không có tín hiệu" cùng cỡ mẫu.
- Ngưỡng >4 áp cho MỌI ngày trong 134 năm dữ liệu — không xét đến việc thị trường
  đã đổi cấu trúc rất nhiều lần trong giai đoạn đó.
