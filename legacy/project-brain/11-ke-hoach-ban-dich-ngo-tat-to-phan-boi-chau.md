# 11 – Kế hoạch bổ sung 2 bản dịch (Ngô Tất Tố, Phan Bội Châu) + toggle giao diện

> **Trạng thái (2026-09-04): đã triển khai và deploy thử lên UAT.**
> - Việc (a): `src/core/data/noiDungQueNgoTatTo.{json,ts}` và `noiDungQuePhanBoiChau.{json,ts}`
>   — theo đúng Phương án B đã chốt, cả 64 quẻ × 2 nguồn, có test cấu trúc riêng
>   (`src/core/__tests__/noiDungQueNgoTatTo.test.ts`, `...PhanBoiChau.test.ts`).
> - Việc (b): toggle 3 bản trong `src/pages/ChiTietQue.tsx`, lazy-load qua `import()` động khi
>   đổi bản, ghi nhớ lựa chọn bằng `localStorage`, có xử lý SSR-safe (khởi tạo ổn định rồi đọc
>   `localStorage` trong effect — tránh hydration mismatch, cùng pattern đã dùng ở
>   `QueDaLuu.tsx`).
> - Đã build + kiểm tra bằng Playwright (chụp màn hình cả 3 bản, kiểm tra chuyển quẻ trước/sau
>   khi đang ở bản khác mặc định, kiểm tra `localStorage` giữ lựa chọn qua reload) rồi deploy
>   thử: https://cb8fdaba.qiching-uat.pages.dev — chưa commit vào git (chờ owner duyệt).
> - **Phát hiện ngoài phạm vi việc này**: lỗi hydration mismatch (React error #418) xuất hiện
>   trên hầu hết route sau khi prerender (kể cả `/gioi-thieu`, quẻ không liên quan tới toggle) —
>   đã xác nhận đây là lỗi có sẵn từ trước, không phải do việc (a)/(b) gây ra, và không làm
>   hỏng nội dung hiển thị (React tự phục hồi), nhưng cần được điều tra riêng.
> - Đã biết còn thiếu: hàng loạt LỜI KINH/GIẢI NGHĨA của Ngô Tất Tố không tách theo tác giả (Trình
>   Di/Chu Hy/Tiên Nho — xem comment đầu `noiDungQueNgoTatTo.ts`); vài chỗ nội dung rơi vào
>   nhầm field (`dichAm` thay vì `dichNghia`) khi nguồn OCR sai nhãn hiếm gặp; 1 quẻ (32) hào 1
>   Ngô Tất Tố mất hẳn Hào Từ (nguồn tự thiếu, không phải lỗi trích xuất) — không chặn việc
>   dùng thử ở UAT nhưng nên biết trước khi mở public.

> **Quyết định của owner (chốt, thay thế các khuyến nghị mâu thuẫn bên dưới):**
> 1. **Quyền sử dụng: OK** — Ngô Tất Tố mất 1954, Phan Bội Châu mất 1940, cả hai đã hơn 50 năm kể
>    từ khi mất → hết thời hạn bảo hộ quyền tác giả (Điều 27 Luật SHTT: tác phẩm văn học được bảo
>    hộ trong suốt cuộc đời tác giả và 50 năm sau khi tác giả chết). Rủi ro bản quyền coi như đã
>    xử lý cho 2 bản này — không còn là blocker, kể cả khi bật hiển thị public/SEO (khác với bản
>    Nguyễn Hiến Lê, vẫn đang bị gate G1 chặn riêng, xem mục 4.4).
> 2. **Chọn Phương án B** (mục 4.1) — schema riêng cho từng bản dịch, giữ đúng cấu trúc nguồn thay
>    vì gộp về `NoiDungQueRow` chung.
> 3. **Bắt buộc làm bước audit tồn tại** link Ngô Tất Tố + Phan Bội Châu cho đủ 64 quẻ trước khi
>    viết script trích xuất (mục 5.2, mục 7 bước 1) — không còn là "câu hỏi mở", mà là việc phải
>    làm trong trình tự triển khai.
> 4. **Lazy-load tuỳ theo setting của người dùng**: không mặc định luôn tải bản Nguyễn Hiến Lê rồi
>    lazy-load phần còn lại — nếu người dùng đã có lựa chọn dịch giả ghi nhớ từ trước (setting/
>    preference), tải đúng bản đó khi vào trang; các bản không khớp setting hiện tại mới lazy-load
>    theo yêu cầu (xem mục 5.4).

## 1. Bối cảnh

`src/core/data/noiDungQue.json` hiện chỉ có **một** bản diễn giải cho 64 quẻ — theo Nguyễn Hiến
Lê, lấy từ `cohoc.net/64-que-dich.html` (xem comment đầu `src/core/data/noiDungQue.ts`).

Khảo sát lại `cohoc.net` cho thấy mỗi quẻ còn có nhiều bản diễn giải khác nhau, liệt kê ở mục
"Các cách diễn dịch khác" cuối mỗi trang quẻ (ví dụ trang quẻ 43:
`cohoc.net/trach-thien-quai-kid-43.html`):

```
Quẻ số - 43 - Kinh Dịch - Ngô Tất Tố
Quẻ số - 43 - Quốc Văn Chu Dịch - Phan Bội Châu
Quẻ số - 43 - Kinh dịch diễn giảng - Kiều Xuân Dũng
Quẻ số - 43 - Kinh Dịch diễn giải
Quẻ số - 43 - Bốc Phệ Chánh Tông
Quẻ số - 43 - Kinh Dịch - Dịch Tự Bản Nghĩa
Quẻ số - 43 - Kinh Dịch - Ngu Yên Nguyễn Đại Bằng
Quẻ số - 43 - Bí Ẩn Quẻ Dịch
Quẻ số - 43 - Quẻ Kinh Dịch cho gieo quẻ
```

Theo yêu cầu, phạm vi việc này giới hạn ở **2 bản**: **Ngô Tất Tố** (dịch giả bản "Kinh Dịch") và
**Phan Bội Châu** (bản "Quốc Văn Chu Dịch"). Các bản còn lại (Kiều Xuân Dũng, Bốc Phệ Chánh
Tông...) không nằm trong phạm vi kế hoạch này.

## 2. Hiện trạng schema (Nguyễn Hiến Lê) — điểm tham chiếu

`NoiDungQueRow` (`src/core/data/noiDungQue.ts`):

```ts
interface NoiDungQueRow {
  soThuTu: number;
  tenQue: string;
  tenQueChuan: string; // khớp que6Hao.ts — cầu nối sang phần tính toán
  cung, queThuong, queHa: string;
  haoThe: number;
  giaiNghia: string;
  thoanTu: { hanTu: string; dich: string; giang: string };
  haoTu: { vach: number; nhan: string; noiDung: string }[]; // 6 hào
  dungCuu: string | null; // chỉ Càn/Khôn
  chuThich: string | null;
  phuLuc: string | null;
  nguon: string;
}
```

Bài học đã rút ra khi làm việc với dữ liệu Nguyễn Hiến Lê (xem comment đầu `noiDungQue.ts` và
lịch sử sửa lỗi trong phiên làm việc trước) — **áp dụng lại cho 2 bản mới**:

1. Thoán Từ luôn mở đầu bằng dòng chữ Hán bắt đầu bằng tên quẻ viết tắt, dù trang có ghi nhãn hay
   không — dùng dấu hiệu này để tách đúng ranh giới đoạn thay vì đoán số đoạn cố định.
2. Khi một đoạn (chữ Hán, phiên âm, hay bản dịch) bị nguồn tách thành nhiều `<p>` liên tiếp, phải
   duyệt hết tới ranh giới đoạn kế tiếp (nhãn "Giảng:"/hào kế tiếp/...), không giả định "đúng 1
   đoạn rồi dừng" — đây chính là lỗi đã gặp và phải scrape lại 13/64 quẻ.
3. `tenQueChuan` phải suy từ cặp quẻ Thượng/Hạ đối chiếu `que6Hao.ts`, KHÔNG tin theo tên hiển thị
   của nguồn (nguồn có thể đặt tên khác bản gốc ở một số quẻ).
4. Nhãn hào (Cửu/Lục) nên tính lại từ dữ liệu quẻ đơn đã xác nhận (`queKinhDich.ts`), không tin
   nguyên văn scrape được (nguồn có lỗi chính tả nhãn hào).

## 3. Khảo sát 2 nguồn mới

### 3.1. URL pattern

Mẫu URL: `cohoc.net/que-so-<so>-kinh-dich-ngo-tat-to-qid-<id>.html` (Ngô Tất Tố) và
`cohoc.net/que-so-<so>-quoc-van-chu-dich-phan-boi-chau-qid-<id>.html` (Phan Bội Châu).

**`<id>` (qid) không suy được bằng công thức tuyến tính đáng tin cậy.** Khảo sát nhanh:

| Quẻ | qid Ngô Tất Tố | qid Phan Bội Châu |
|---|---|---|
| 1 | 2397 | 2462 |
| 12 | 2408 | 2473 |
| 30 | 2426 | 2491 |
| 43 | 2439 | **2503** (không phải 2504 — lệch khỏi ngoại suy tuyến tính từ 3 điểm trên) |

→ **Không đoán qid.** Cách đáng tin cậy: mỗi trang chính (bản Nguyễn Hiến Lê) của 64 quẻ đã có
sẵn link thật tới 2 bản này trong mục "Các cách diễn dịch khác" (`<li><a href='...'>`) — lấy href
trực tiếp từ 64 trang đó (đã tải/cache khi sửa lỗi Thoán Từ ở việc trước, có thể tải lại nếu cache
không còn) thay vì tự sinh URL.

### 3.2. Cấu trúc nội dung khác hẳn bản Nguyễn Hiến Lê — đây là rủi ro/quyết định chính của kế hoạch

Đối chiếu quẻ 1 (Thuần Càn) và quẻ 43 (Trạch Thiên Quải):

**Ngô Tất Tố** — chia nhỏ theo từng **mệnh đề** của Thoán Từ/Thoán Truyện/Hào Từ, mỗi mệnh đề có
cặp khối `LỜI KINH` (nguyên văn Hán + dịch âm + dịch nghĩa) rồi `GIẢI NGHĨA` (có thể gồm nhiều
nhà chú giải riêng biệt: "Truyện của Trình Di", "Bản nghĩa của Chu Hy", "Lời bàn của Tiên Nho" —
trong đó lại trích nhiều học giả khác nhau như Hồ Vân Phong). Quẻ 1 (Càn) có **54 khối "LỜI
KINH"** và **52 khối "GIẢI NGHĨA"** — mức chi tiết cao hơn nhiều so với 1 khối `giaiNghia` +
`thoanTu` + 6 `haoTu` hiện có.

**Phan Bội Châu** — có tiêu đề mục rõ ràng và khác tên gọi so với schema hiện tại: `TỰ QUÁI` (Tự
Quái Truyện), `SOÁN TỪ` (= Thoán Từ, kèm `PHỤ CHÚ` — chú thích thêm), `SOÁN TRUYỆN` (= Thoán
Truyện, giảng từng mệnh đề), `ĐẠI TƯỢNG TRUYỆN`, `HÀO TỪ VÀ TIỂU TƯỢNG TRUYỆN` (mỗi hào kèm Tiểu
Tượng Truyện riêng, có thể có `PHỤ CHÚ`). Quẻ 1 (Càn) có 13 lần xuất hiện "Văn Ngôn" (Văn Ngôn
Truyện — bài giảng nhân sinh riêng cho từng hào của Càn/Khôn, giống vai trò `dungCuu` hiện tại
nhưng phong phú hơn) và có `Dụng Cửu` riêng.

Hệ quả: **không thể chỉ đổi `nguon` rồi tái dùng logic scrape của Nguyễn Hiến Lê**; cần script
trích xuất riêng cho từng nguồn, và cần quyết định độ chi tiết của schema đích (mục 4.1).

### 3.3. Trường hợp Càn/Khôn

Cả 2 bản mới đều có nội dung mở rộng riêng cho Càn/Khôn (Dụng Cửu/Lục, và với Phan Bội Châu còn
có Văn Ngôn Truyện theo từng hào) — dung lượng trang lớn hơn hẳn quẻ thường (quẻ 1 Ngô Tất Tố
~82KB, Phan Bội Châu ~85KB so với quẻ 43 ~43–44KB). Script trích xuất phải xử lý 2 quẻ này như
trường hợp riêng, đúng tinh thần đã làm với bản Nguyễn Hiến Lê.

## 4. Việc (a) — Trích xuất 2 bản dịch thành JSON riêng

### 4.1. Độ chi tiết của schema — đã chốt: Phương án B

| Phương án | Mô tả | Ưu | Nhược |
|---|---|---|---|
| A. Tái dùng schema `NoiDungQueRow` | Gộp các khối con (LỜI KINH+GIẢI NGHĨA của Ngô Tất Tố; TỰ QUÁI/SOÁN TỪ/SOÁN TRUYỆN/ĐẠI TƯỢNG TRUYỆN của Phan Bội Châu) thành `giaiNghia`/`thoanTu.{hanTu,dich,giang}`/`haoTu[].noiDung` bằng cách nối đoạn (`\n`), tương tự cách đã xử lý Nguyễn Hiến Lê | UI toggle (việc b) gần như miễn phí — 3 nguồn cùng 1 interface TypeScript; component hiện có (`ChiTietQue.tsx`, `KetQuaHero.tsx`, `QueDichView.tsx`) chỉ cần đổi nguồn dữ liệu, không cần đổi cấu trúc render | Mất phân biệt "lời của Trình Di" vs "lời của Chu Hy" vs "lời bàn của Tiên Nho" trong Ngô Tất Tố; mất tách bạch Tự Quái/Soán Truyện/Đại Tượng Truyện/Tiểu Tượng Truyện trong Phan Bội Châu — gộp chung vào `giang`/`noiDung` dạng văn bản thô nhiều đoạn |
| **B. Schema riêng, giữ đúng cấu trúc nguồn** (per-clause cho Ngô Tất Tố, per-section cho Phan Bội Châu) — **đã chọn** | Giữ từng khối LỜI KINH/GIẢI NGHĨA hoặc TỰ QUÁI/SOÁN TỪ/... như mảng con có nhãn, riêng cho mỗi bản dịch | Giữ được toàn bộ độ chi tiết và các tên nhà chú giải | UI phải tự thiết kế cách hiển thị riêng cho từng bản (không dùng chung layout với bản Nguyễn Hiến Lê); tăng đáng kể độ phức tạp của cả script lẫn UI |

**Owner đã chọn Phương án B**: mỗi bản dịch (Ngô Tất Tố, Phan Bội Châu) có schema TypeScript
riêng, phản ánh đúng cấu trúc nguồn — không gộp về `NoiDungQueRow` chung với Nguyễn Hiến Lê. Hệ
quả cần lường trước khi viết script và UI:

- Ba nguồn **không còn cùng 1 interface** → data layer (mục 4.2) và UI toggle (mục 5) phải xử lý
  từng bản như một "hình dạng" dữ liệu riêng, không thể tái dùng nguyên component render của bản
  Nguyễn Hiến Lê cho 2 bản mới.
- Ngô Tất Tố: schema per-clause — mảng các mệnh đề, mỗi mệnh đề có khối `loiKinh` (Hán tự + dịch
  âm + dịch nghĩa) và mảng `giaiNghia` (mỗi phần tử có `tacGia` — ví dụ "Trình Di"/"Chu Hy"/"Tiên
  Nho" — và nội dung).
- Phan Bội Châu: schema per-section — các trường có nhãn rõ theo đúng tên nguồn: `tuQuai`,
  `soanTu` (+ `phuChu` tuỳ chọn), `soanTruyen`, `daiTuongTruyen`, `haoTu[]` (mỗi hào có
  `tieuTuongTruyen`, `vanNgon` tuỳ chọn, `phuChu` tuỳ chọn), `dungCuu` riêng cho Càn/Khôn.
- Ghi rõ trong comment đầu mỗi file JSON rằng schema này **không tương thích** với
  `NoiDungQueRow` của bản Nguyễn Hiến Lê, để tránh nhầm khi có người sau này thử tái dùng chung
  logic.

### 4.2. Vị trí & đặt tên file

Theo đúng convention hiện có (`src/core/data/noiDungQue.json` + `.ts` wrapper):

- `src/core/data/noiDungQueNgoTatTo.json` + đọc qua `noiDungQueNgoTatTo.ts`
- `src/core/data/noiDungQuePhanBoiChau.json` + đọc qua `noiDungQuePhanBoiChau.ts`

Vì đã chọn Phương án B (mục 4.1), **mỗi file `.ts` tự định nghĩa interface riêng** (ví dụ
`NoiDungQueNgoTatToRow`, `NoiDungQuePhanBoiChauRow`) — không tái dùng `NoiDungQueRow` của bản
Nguyễn Hiến Lê, vì cấu trúc khác hẳn (mục 3.2). Chỉ những trường chắc chắn tương đương về ý nghĩa
giữa 3 nguồn (`soThuTu`, `tenQueChuan`, `cung`/`queThuong`/`queHa`, `haoThe`, `nguon`) nên giữ tên
field giống nhau để dễ đối chiếu, dù kiểu dữ liệu các trường nội dung (giải nghĩa, thoán từ, hào
từ) khác nhau giữa 3 schema.

Vẫn nên thêm một enum/registry nhỏ liệt kê 3 nguồn (id, tên hiển thị, tên file dữ liệu) để UI
toggle (việc b) tra cứu tên/nhãn — nhưng registry này **không** ngụ ý 3 nguồn cùng 1 shape dữ
liệu; mỗi UI branch theo `nguonId` vẫn phải tự biết cách render đúng schema của nguồn đó.

### 4.3. Quy trình trích xuất (theo đúng cách đã làm hiệu quả ở việc trước)

1. Từ 64 trang chính (Nguyễn Hiến Lê) đã/sẽ cache cục bộ, harvest href thật của 2 bản dịch cho cả
   64 quẻ (mục 3.1) — tổng cộng 128 URL cần tải (64 × 2 nguồn).
2. Tải từng trang bằng `curl -A "Mozilla/5.0"` (không dùng `urllib` trực tiếp — đã gặp lỗi
   `CERTIFICATE_VERIFY_FAILED` trong phiên trước), cache HTML cục bộ trước khi parse — tránh tải
   lại khi phải sửa script parse nhiều lần.
3. Viết parser theo từng nguồn (khác nhau, xem mục 3.2), decode HTML entity + `unicodedata.
   normalize("NFC", ...)` — cohoc.net trộn entity (`&ecirc;`) với dấu kết hợp Unicode rời
   (combining mark), phải chuẩn hoá mới so khớp chuỗi đúng (bài học từ việc trước).
4. Suy `tenQueChuan` qua cặp Thượng/Hạ quái đối chiếu `que6Hao.ts`, không tin tên hiển thị của
   trang (mục 2, điểm 3) — 2 bản mới có thể dùng tên gọi khác cả Nguyễn Hiến Lê lẫn `que6Hao.ts`.
5. Viết script audit đối chiếu ngược (tương tự `audit2.py` đã dùng ở việc trước): với mỗi đoạn văn
   bản trích được từ HTML nguồn, xác nhận nó thực sự có mặt trong JSON đã build — phát hiện đoạn
   bị rớt trước khi coi là xong, thay vì chỉ nhìn qua vài quẻ mẫu rồi tin cả 64.
6. Copyedit tối thiểu: cả 2 bản chắc chắn cũng có lỗi OCR/chính tả tương tự bản Nguyễn Hiến Lê
   (nguồn cùng một trang, cùng kiểu xử lý) — xem mục 5.

### 4.4. Rủi ro bản quyền — đã xác minh: hết hạn bảo hộ, KHÔNG bị gate G1 chặn

`legacy/project-brain/10-ke-hoach-seo.md` (mục 3.1, gate G1 — Rights) đã đóng băng việc mở index
64 trang quẻ hiện có (Nguyễn Hiến Lê) cho tới khi có registry quyền sử dụng.

**2 bản dịch mới không nằm trong diện bị G1 chặn**, khác với nhận định ban đầu ở bản kế hoạch
trước: Ngô Tất Tố mất năm 1954, Phan Bội Châu mất năm 1940 — cả hai đều đã hơn 50 năm kể từ khi
mất tính đến 2026. Theo Điều 27 Luật Sở hữu trí tuệ VN, quyền tác giả với tác phẩm văn học được
bảo hộ suốt đời tác giả cộng 50 năm sau khi mất → quyền tác giả với cả 2 bản dịch đã **hết hạn
bảo hộ**, tác phẩm thuộc phạm vi công cộng (public domain).

Hệ quả: owner đã chốt coi quyền sử dụng 2 bản này là **OK**, không cần thêm vào registry quyền sử
dụng đang treo của G1, và không cần chờ đối chiếu G1 trước khi bật hiển thị public/SEO cho riêng
2 bản này — khác hẳn bản Nguyễn Hiến Lê (vẫn đang bị G1 chặn vì chưa xác minh được năm mất/thời
hạn bảo hộ của dịch giả). Nếu sau này xác minh lại được thời điểm Nguyễn Hiến Lê mất (bà 1984,
theo tài liệu phổ biến — cần đối chiếu nguồn đáng tin trước khi dùng để mở G1) đủ 50 năm, có thể
áp dụng logic tương tự để mở khóa G1 cho bản đó, nhưng đó là việc riêng của `10-ke-hoach-seo.md`,
không nằm trong phạm vi kế hoạch này.

## 5. Việc (b) — Toggle giao diện giữa 3 bản diễn giải

### 5.1. Nơi cần sửa

Cùng 3 nơi đã sửa khi tách `thoanTu` khỏi `dich`/`giang` (phiên làm việc trước) — cả 3 đều đọc qua
`timNoiDungQue(tenQueChuan)`:

- `src/pages/ChiTietQue.tsx` — trang chi tiết một quẻ (đầy đủ nhất, nơi toggle có ý nghĩa nhất).
- `src/components/KetQuaHero.tsx` — hover popup ở kết quả xem quẻ.
- `src/components/QueDichView.tsx` — hover popup ở bảng kết quả rút gọn.

### 5.2. Data layer

- Thêm hàm tra cứu theo nguồn, ví dụ `timNoiDungQueNgoTatTo(tenQueChuan)` và
  `timNoiDungQuePhanBoiChau(tenQueChuan)` riêng biệt (không gộp chung 1 hàm generic trả về union
  type phức tạp, vì mỗi nguồn đã có schema riêng theo Phương án B — mục 4.1) — UI gọi đúng hàm
  theo `nguonId` đang chọn.
- **Bắt buộc**: audit tồn tại đủ 64×2 link (Ngô Tất Tố + Phan Bội Châu) trước khi cam kết UI "luôn
  có 3 lựa chọn" — chỉ mới xác nhận quẻ 1/12/30/43 có đủ link, chưa kiểm chứng hết 64 quẻ. Đây là
  bước 1 trong trình tự triển khai (mục 7), không phải câu hỏi mở nữa — phải làm trước khi viết
  script trích xuất. Nếu phát hiện quẻ thiếu link cho 1 trong 2 bản, toggle phải disable/ẩn lựa
  chọn thiếu cho đúng quẻ đó thay vì hiện trang rỗng.

### 5.3. UI/UX

- Thêm control chọn dịch giả (segmented control hoặc tab nhỏ) đặt ở đầu khối nội dung diễn giải
  trong `ChiTietQue.tsx` — 3 lựa chọn: "Nguyễn Hiến Lê" (mặc định, giữ hành vi hiện tại) / "Ngô
  Tất Tố" / "Phan Bội Châu".
- Ghi nhớ lựa chọn dịch giả vào **localStorage** (không chỉ state cấp phiên nữa — xem quyết định
  lazy-load theo setting người dùng ở mục 5.4, cần setting này tồn tại lâu hơn 1 phiên để có tác
  dụng ở lần ghé sau). Nếu sau này có router (Giai đoạn A, `10-ke-hoach-seo.md`), cân nhắc thêm
  đồng bộ 2 chiều với query string để chia sẻ được link tới đúng bản.
- Mỗi bản vẫn phải hiện `nguon` (link "Nguồn:") riêng của chính bản đó, không dùng chung link của
  bản Nguyễn Hiến Lê — đúng tinh thần minh bạch provenance đã đặt ra trong `10-ke-hoach-seo.md`
  (mục 7.2, "Provenance/source, author/reviewer...").
- `KetQuaHero.tsx`/`QueDichView.tsx` là popup nhỏ (hover) — cân nhắc **không** nhân bản toggle ở
  đây (giữ đơn giản, luôn hiện bản mặc định Nguyễn Hiến Lê) và chỉ thêm toggle đầy đủ ở trang chi
  tiết `ChiTietQue.tsx`; quyết định cuối nên chờ xem UI thật trước khi cam kết.

### 5.4. Hiệu năng

`10-ke-hoach-seo.md` (Giai đoạn H) đã ghi nhận `noiDungQue.json` ~508KB là một phần của chunk lớn
chưa tối ưu. Thêm 2 file JSON cùng cỡ hoặc lớn hơn (nội dung Ngô Tất Tố/Phan Bội Châu chi tiết hơn
→ khả năng file to hơn bản hiện tại, xem mục 3.2 ước lượng dung lượng trang) sẽ nhân gấp 2–3 lần
payload nếu bundle chung. **Lazy-load theo lựa chọn** (`import()` động) là bắt buộc, không import
tĩnh cả 3 ở đầu module.

**Owner đã chốt: lazy-load tuỳ theo setting của người dùng, không cứng theo "mặc định luôn là
Nguyễn Hiến Lê"**:

- Lưu lựa chọn dịch giả của người dùng vào một setting bền vững (localStorage — khớp với ghi chú
  "nếu sau này có router... cân nhắc query string" ở mục 5.3, có thể làm cả hai: localStorage cho
  lần ghé sau, query string để chia sẻ link).
- Khi vào trang, đọc setting này trước khi quyết định `import()` nguồn nào: nếu người dùng đã có
  lựa chọn lưu sẵn khác Nguyễn Hiến Lê (ví dụ đã chọn Ngô Tất Tố ở lần trước), `import()` ngay
  đúng bản đó thay vì luôn tải Nguyễn Hiến Lê trước rồi mới lazy-load bản đã chọn — tránh tải
  thừa 1 bản không dùng tới ngay khi biết trước người dùng sẽ đổi.
- Nếu chưa có setting nào (lần đầu ghé trang), giữ hành vi mặc định là Nguyễn Hiến Lê như hiện
  tại, và chỉ lazy-load 2 bản còn lại khi người dùng chủ động đổi lựa chọn.

## 6. Rủi ro & câu hỏi mở

| Mức | Rủi ro/câu hỏi | Ghi chú |
|---|---|---|
| ~~Cao~~ Đã xử lý | Quyền sử dụng bản dịch Ngô Tất Tố/Phan Bội Châu | **Đã xác minh OK** (mục 4.4) — cả hai dịch giả mất đã hơn 50 năm, hết hạn bảo hộ; không còn bị G1 chặn kể cả khi bật public |
| Trung bình | Tăng độ phức tạp script + UI khi giữ nguyên cấu trúc nguồn (Phương án B, mục 4.1) | Đánh đổi đã được owner chấp nhận để giữ đủ độ chi tiết; không dùng chung layout render với bản Nguyễn Hiến Lê |
| ~~Trung bình~~ Đã lên kế hoạch | Không phải quẻ nào cũng có đủ 2 bản trên cohoc.net | Đã chốt: audit tồn tại link là bước bắt buộc đầu tiên (mục 5.2, mục 7 bước 1), không phải câu hỏi mở nữa |
| Trung bình | Lỗi OCR/chính tả trong 2 bản mới (chưa spot-check) | Áp dụng cùng mức cảnh giác đã ghi trong `10-ke-hoach-seo.md` (mục 1.1) cho bản Nguyễn Hiến Lê |
| Trung bình | `dungCuu`/Văn Ngôn Truyện của Phan Bội Châu phong phú hơn field `dungCuu` hiện tại | Với Phương án B đã chọn, vấn đề này tự giải quyết: schema riêng của Phan Bội Châu có field `vanNgon` riêng, không cần nhồi vào `dungCuu` hay lo phá vỡ tính đồng nhất với Nguyễn Hiến Lê (vì vốn đã không đồng nhất theo B) |
| Thấp | Tăng dung lượng bundle | Xử lý bằng lazy-load theo setting người dùng (mục 5.4), không phải blocker nhưng phải làm cùng lúc, không để sau |

## 7. Trình tự triển khai đề xuất

1. **Audit tồn tại (bắt buộc, làm trước tiên)**: với cả 64 quẻ, xác nhận có đủ URL Ngô Tất Tố +
   Phan Bội Châu (harvest từ 64 trang chính, không đoán qid) — quyết định ngay cách xử lý nếu có
   quẻ thiếu (disable toggle riêng quẻ đó, xem mục 5.2).
2. Định nghĩa 2 schema riêng theo Phương án B đã chốt (mục 4.1) trước khi viết script trích xuất,
   tránh viết lại.
3. Viết + chạy script trích xuất cho **1 nguồn, 2–3 quẻ mẫu** (gồm 1 quẻ thường + Càn/Khôn) trước,
   review thủ công đối chiếu HTML gốc, rồi mới chạy hết 64 quẻ × 2 nguồn.
4. Audit đối chiếu ngược toàn bộ (tương tự `audit2.py`) trước khi coi việc (a) là xong.
5. Thêm 2 hàm tra cứu riêng theo nguồn (`timNoiDungQueNgoTatTo`, `timNoiDungQuePhanBoiChau`, mục
   5.2) rồi mới đụng tới UI.
6. Làm UI toggle ở `ChiTietQue.tsx` trước (giá trị cao nhất) — cần 2 cách render riêng cho từng
   schema (hệ quả của Phương án B), review UX thật rồi mới quyết định có nhân ra 2 popup còn lại
   hay không (mục 5.3).
7. Thêm lazy-load theo setting người dùng (mục 5.4) cùng lúc với bước 6, không để lại làm sau.
8. Quyền sử dụng đã xác minh OK (mục 4.4) nên **không cần** bước chờ đối chiếu G1 riêng cho 2 bản
   này trước khi bật public/production — chỉ bản Nguyễn Hiến Lê vẫn cần gate đó.
