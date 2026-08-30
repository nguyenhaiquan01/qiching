# QIChing Web (migration)

Repository này chứa cả hai phiên bản của QIChing:

- Source web mới (React + TypeScript) nằm tại thư mục gốc.
- Source desktop cũ (C#/.NET Framework 3.5/WinForms) nằm trong [`legacy/`](legacy/README.md).

Bản viết lại của ứng dụng desktop QIChing ([`legacy/`](legacy/README.md), C#/.NET Framework/WinForms)
thành static SPA — React + TypeScript, không backend/database server. Xem đầy đủ bối cảnh,
quyết định kiến trúc và lý do trong [`legacy/project-brain/`](legacy/project-brain/), đặc biệt:

- [`01-tong-quan-du-an.md`](legacy/project-brain/01-tong-quan-du-an.md) — ứng dụng gốc làm gì
- [`05-ke-hoach-migrate-web.md`](legacy/project-brain/05-ke-hoach-migrate-web.md) — kế hoạch migrate chi tiết theo từng giai đoạn
- [`06-deployment.md`](legacy/project-brain/06-deployment.md) — kế hoạch deploy (Cloudflare Pages/GitHub Pages, static hosting)

## Trạng thái hiện tại

**Đã làm (Giai đoạn 1 — tầng nghiệp vụ TypeScript):**

- `src/core/lunar.ts` — bọc thư viện `lunar-calendar-ts-vi` (cùng gốc thuật toán Hồ Ngọc
  Đức/Meeus 1998 với bản C# gốc) để tính Can Chi Năm/Tháng/Ngày/Giờ, Tiết Khí, Giờ Hoàng
  Đạo. Áp dụng đúng quy tắc đổi ngày 23h của bản gốc.
- `src/core/const.ts` — port nguyên văn `Const.cs`.
- `src/core/business.ts` — port `Business/business.cs` (an quẻ, biến quẻ, Nạp Giáp, Tuần
  Không, tìm ngày tốt...).
- `src/core/queDich.ts` — port class `Business/QueDich.cs` (bao gồm tính điểm vượng suy
  Lục Thân — `GiaiQue`/`GiaiQueCuocDoi`).
- `src/core/types.ts` — port `Hao.cs`, `QueInfo.cs`.
- `src/core/data/` — **toàn bộ dữ liệu tra cứu tĩnh đã điền xong và đối chiếu với dữ liệu
  thật** của `KinhDich.sdf` gốc (bao gồm cả `queKinhDich.ts` — Nạp Giáp Bát Quái, bảng rủi
  ro cao nhất theo kế hoạch migrate ban đầu). Xem `src/core/data/README.md` để biết quá
  trình lấy dữ liệu qua 3 nguồn độc lập (đọc bytes thô → thư viện `sqlce` Python → export
  CSV chính thức từ người dùng, trong `DBexport/`).
- `src/core/storage.ts` — lưu trữ "quẻ đã lưu" qua `localStorage` (Giai đoạn 3 của kế
  hoạch), thay cho bảng `InfoQue` (không migrate dữ liệu cũ — xem lý do trong kế hoạch
  migrate). Có thêm export/import JSON thủ công cho nhu cầu đồng bộ nhiều thiết bị.
- `src/core/__tests__/` — test cho toàn bộ hàm/dữ liệu đã có, bao gồm `dbexport.test.ts` so
  trực tiếp từng bảng dữ liệu với `DBexport/*.csv` (chạy: `npm test`).
- **Giao diện React (Giai đoạn 4)** — 5 trang:
  - `src/pages/XemQue.tsx` (frmKinhDich) — thiết kế lại theo
    [`legacy/project-brain/05.1. Chỉnh UI-UX.md`](<legacy/project-brain/05.1. Chỉnh UI-UX.md/Chỉnh UI/Chỉnh UI/UX.md>):
    Câu hỏi (loại quẻ/chủ đề/câu hỏi) → **Kết quả** (quẻ chính → quẻ biến, mức độ thuận lợi,
    điểm thuận/cần lưu ý) → **Luận quẻ theo việc đang hỏi** (chỉ hiện khi có Dụng Thần cụ
    thể) → **Căn cứ luận quẻ** (accordion) → Lịch âm → **Vượng suy Lục Thân** (thanh phân
    cực quanh mốc 0) → **Chi tiết Lục Hào** đầy đủ (quẻ chính/biến, có chú giải ký hiệu,
    tooltip cho thuật ngữ chuyên môn) → Lưu quẻ/Chia sẻ/In. Logic diễn giải ở `src/ui/luanQue.ts`
    (mức độ thuận lợi tái dùng đúng ngưỡng Vượng/Hung đã có, không bịa ngưỡng mới), thuật
    ngữ ở `src/ui/thuatNgu.ts` + `src/components/ThuatNgu.tsx`. Tách rõ màu Ngũ Hành (phân
    loại) khỏi màu trạng thái UX (success/warning/danger) để tránh xung đột kiểu "Hỏa=đỏ=xấu".
  - `src/pages/Que64.tsx` (`DanhSachQue.tsx` + `ChiTietQue.tsx`) — tra cứu 64 quẻ (lưới 8×8),
    nội dung đầy đủ từng quẻ lấy từ `src/core/data/noiDungQue.json` (scrape có đối chiếu từ
    cohoc.net, xem comment đầu file).
  - `src/pages/TimNgayTot.tsx` (frmTimNgayTotTheoQueDich): quét khoảng ngày giờ trong Web
    Worker (`src/core/timNgayTot.worker.ts`) để không chặn UI, có thanh tiến độ, hai chế độ
    quét (2 giờ/lần ngưỡng Vượng, hoặc hàng ngày ngưỡng Hung theo giờ cố định).
  - `src/pages/QueDaLuu.tsx` (frmLoadQue): danh sách quẻ đã lưu, xem lại/xoá, xuất/nhập JSON.
  - `src/pages/GioiThieu.tsx` (AboutBox).
  - Điều hướng bằng state đơn giản (không dùng router). Container rộng 1200px, đoạn văn dài
    giới hạn ~720px để dễ đọc (theo brief UI/UX). Hỗ trợ dark mode (bản gốc WinForms không có).
  - Đã chạy thử bằng Playwright (headless Chromium) qua tất cả các trang + trạng thái (xem
    một việc/tổng quan/quẻ cuộc đời, mobile 390px không bị tràn ngang), không có lỗi console.

**Giai đoạn 1-4 của kế hoạch migrate đã hoàn tất** — toàn bộ tầng nghiệp vụ TypeScript có dữ
liệu thật, `QueDich.giaiQue()` chạy được end-to-end, và có giao diện React dùng được thật sự.

## Chạy thử

```bash
npm install
npm test        # chạy bộ test hiện có
npm run dev      # dev server (hot reload) — http://localhost:5173
npm run build && npm run preview   # bản production — http://localhost:4173
```

## Bước tiếp theo được đề xuất

1. (Khuyến nghị, chưa bắt buộc) Viết bộ test hồi quy đối chiếu `GiaiQue` end-to-end với kết
   quả bản desktop trên nhiều mốc thời gian mẫu thật (giao thừa, tháng nhuận, giờ 23h-24h) —
   Giai đoạn 5 của kế hoạch. Hiện tại độ tin cậy dữ liệu đến từ đối chiếu trực tiếp với
   `KinhDich.sdf` gốc (xem `src/core/data/README.md`), không phải chạy song song desktop.
2. Cân nhắc build + deploy lên Cloudflare Pages/GitHub Pages (`npm run build`) theo kế hoạch
   ở `legacy/project-brain/06-deployment.md`.
3. Bundle production hiện ~700KB (chủ yếu do `noiDungQue.json` ~480KB nhúng thẳng vào bundle)
   — có thể lazy-load nếu cần tối ưu thời gian tải ban đầu, hiện chưa cần thiết cho dùng cá nhân.
