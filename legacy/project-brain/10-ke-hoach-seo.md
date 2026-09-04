# 10 – Kế hoạch SEO cho qiching.org

> **Quyết định:** duyệt có điều kiện phần nền tảng kỹ thuật; chưa mở index toàn bộ 64 quẻ.
> Ba cổng bắt buộc trước khi một trang quẻ được index là **quyền sử dụng**, **giá trị riêng** và
> **review chất lượng/nghiệp vụ**. Mục tiêu của kế hoạch là tạo organic traffic có sử dụng công cụ,
> không phải chỉ tăng số URL được index.

## 1. Đánh giá hiện trạng (2026-09-02)

QIChing Web hiện là một static SPA "thuần" theo đúng nghĩa đen: toàn bộ điều hướng dùng
`useState` trong `src/App.tsx` (`const [trang, setTrang] = useState<Trang>(...)`), **không có
router, không có URL riêng cho bất kỳ trang/màn hình nào**. Dù người dùng đang ở "Xem quẻ", "64
Quẻ Kinh Dịch" hay đang xem chi tiết quẻ số 46, thanh địa chỉ trình duyệt luôn chỉ là
`https://qiching.org/`.

### 1.1. Nội dung 64 quẻ chưa đủ điều kiện để scale SEO

Đây là điều phải thừa nhận trước khi lập bất kỳ kế hoạch SEO nào, vì nó quyết định hạng mục nào
đáng đầu tư:

- `src/core/data/noiDungQue.ts` (comment đầu file) ghi rõ nội dung "theo bản dịch/giảng của Nguyễn
  Hiến Lê, lấy từ cohoc.net/64-que-dich.html".
- Kiểm chứng lại trên dữ liệu: **64/64** bản ghi trong `noiDungQue.json` có trường `nguon` trỏ về
  `cohoc.net`. `src/pages/ChiTietQue.tsx` cũng in link "Nguồn:" ra cuối trang chi tiết.

Nghĩa là phần Giải nghĩa/Thoán Từ/Giảng/Hào Từ là nội dung đã được một site khác publish. Duplicate
content không tự động đồng nghĩa với một "án phạt SEO", nhưng trang sao chép mà không thêm giá trị
đáng kể khó được chọn làm canonical/kết quả tốt nhất. Việc dẫn link "Nguồn" hoặc đặt `noindex`
**không thay thế giấy phép sử dụng** và không giải quyết rủi ro quyền đối với bản dịch/giảng.

Dữ liệu hiện cũng chưa đạt chuẩn xuất bản: spot-check `noiDungQue.json` còn nhiều lỗi OCR/chính tả
như `ngọai`, `họat`, `tòan`, `qủe`, `Hão` và lỗi từ ngữ nghiêm trọng hơn. Không dùng dữ liệu này để
sinh snippet/meta trước khi copyedit và đối chiếu với một ấn bản có provenance rõ ràng.

**Thứ QIChing có thêm so với cohoc.net** là phần tự tính toán: Nạp Giáp, Lục Thân, Thế–Ứng, Tuần
Không, Lục Thần, vượng suy Lục Thân, quẻ biến, cùng các công cụ khởi quẻ và tìm thời điểm. Đây là
hướng tạo giá trị riêng, nhưng chưa phải moat thị trường: SERP hiện đã có đối thủ cung cấp công cụ,
dữ liệu từng hào và cụm bài hướng dẫn. Lợi thế cần xây là tính minh bạch của công thức, provenance,
xử lý cục bộ/quyền riêng tư và cách giải thích có thể kiểm tra.

### 1.2. Rào cản kỹ thuật

- **Không có gì để index ngoài một trang duy nhất.** 64 màn hình chi tiết quẻ không có URL riêng để
  lập chỉ mục, để chia sẻ, hay để link tới.
- **Điều hướng không dùng link thật.** Nav 5 tab (`src/App.tsx`), lưới 64 quẻ
  (`src/pages/DanhSachQue.tsx`) và nút "quẻ trước/quẻ sau" (`src/pages/ChiTietQue.tsx`) đều là
  `<button onClick>`, không có `<a href>` nào. Kể cả khi đã có URL, bot vẫn không có đường nào để
  bò từ trang chủ tới 64 trang quẻ.
- **Không có `<title>`/`<meta description>` động.** `index.html` chỉ có `<title>QIChing</title>`
  tĩnh, không có `meta[name=description]`, không Open Graph/Twitter Card — link chia sẻ trên mạng
  xã hội hoặc Zalo/Messenger không có preview.
- **`robots.txt` và `sitemap.xml` hiện không hợp lệ.** Cả hai URL production trả HTTP 200 với
  `content-type: text/html` và app shell. Việc thiếu `robots.txt` tự nó không chặn crawl vì mặc định
  crawler được phép truy cập; vấn đề ở đây là endpoint giả dạng file hợp lệ và sitemap không tồn tại.
- **Năm hostname công khai đang trả nội dung:** `qiching.org`, `www.qiching.org`, `uat.qiching.org`,
  `qiching.pages.dev`, `qiching-uat.pages.dev`. Kiểm tra 2026-09-02 chưa thấy `X-Robots-Tag` trên
  các hostname này; `www` cũng chưa redirect.
- **Chưa có structured data (JSON-LD).** Đây không phải blocker index/ranking và chỉ nên làm sau
  khi content/template ổn định.
- Ứng dụng chạy 100% Client-Side Rendering, HTML gửi về chỉ có `<div id="root"></div>`. Googlebot
  có thể thực thi JavaScript nhưng chậm và kém tin cậy hơn HTML tĩnh; các bot xem trước liên kết
  (Facebook/Zalo/Slack) phần lớn **không chạy JavaScript** nên sẽ không thấy gì.

### 1.3. Về hiệu năng — đo trước khi tối ưu sâu

| Chỉ số | Giá trị thật (đo 2026-09-02) |
|---|---|
| `dist/assets/index-*.js` chưa nén | 756.179 byte (~756KB) — vượt ngưỡng cảnh báo 500KB của Vite |
| Cùng file đó khi production phục vụ | **~234KB** (Cloudflare trả `content-encoding: br`) |
| `src/core/data/noiDungQue.json` | 507.532 byte (~508KB), không phải ~480KB như README cũ ghi |

Ngưỡng 500KB của Vite là cảnh báo về chunk **chưa nén**; chi phí thật cần xem cả transfer,
parse/execute và trải nghiệm trên thiết bị yếu. Một phép đo synthetic mobile duy nhất cho kết quả
LCP khoảng 2,15 giây và CLS 0,065, nên hiệu năng chưa phải blocker lớn bằng indexability. Đây không
thay cho dữ liệu field/CrUX; chỉ tối ưu sâu sau khi có baseline và trace xác nhận nút thắt.

**Cập nhật 2026-09-03 — đã có field data, và nó chỉ ra CLS do font:**

Cloudflare Web Analytics báo CLS phần lớn ở mức Poor, Debug View quy trách nhiệm cho
`#root>div.app-shell.theme-stitch>main` và `header.app-header>span.app-slogan`. Thí nghiệm đối chứng
bằng Playwright trên chính production xác nhận nguyên nhân:

| Kịch bản | CLS | Thời điểm shift |
|---|---|---|
| Desktop 1280px, mạng vừa, font bật | 0.0264 | ~3,5s |
| Desktop, **chặn Google Fonts** | **0.0000** | — |
| Mobile 390px, mạng chậm, font bật | 0.0691 | ~7,3s |
| Mobile, **chặn Google Fonts** | **0.0000** | — |

Cơ chế: `src/ui/stitch-theme.css` dòng 1 nạp font bằng `@import` **bên trong CSS đã bundle** →
trình duyệt phải tải CSS rồi mới khám phá ra font rồi mới tải font. Font về sau 3–7 giây, metrics chữ
đổi, header cao lên, đẩy toàn bộ `main` xuống. Đây chính là chuỗi request nối tiếp đã nêu ở Giai đoạn H
— giờ có bằng chứng field lẫn lab.

**Chưa kết luận được về mức độ:** đo thực tế chỉ ra 0.026–0.069 (vẫn thuộc "Good"), lệch xa mức Poor mà
field data báo. Hai khả năng chưa loại trừ: (a) mẫu field quá nhỏ và bị nhiễm bởi traffic test —
`uat.qiching.org` chiếm hơn nửa số lượt; (b) cột "CLS" trong Debug View hiện đúng số `1` ở mọi dòng nên
nhiều khả năng là *chỉ báo xếp loại*, không phải điểm CLS. Vì vậy: fix font là việc đúng và rẻ, nhưng
**đừng dùng con số "88% Poor" làm mốc trước/sau** — phải đo lại bằng dữ liệu đã lọc hostname.

### ĐÃ XỬ LÝ 2026-09-03 — self-host font, và hợp nhất về một font duy nhất

Đã lên production (`3037ff9`, deployment `1eff3650-7993-4152-9070-88c50bac4b44`). Ba việc gộp làm một:

1. **Self-host font, bỏ `@import`** → cắt chuỗi request nối tiếp, thêm `<link rel=preload>` trong
   `index.html`. Kết quả đo A/B trên CDN thật: CLS **0.0234 → 0.0000** (desktop), **0.0691 → 0.0000**
   (mobile mạng chậm); site không còn gọi `fonts.googleapis.com`/`fonts.gstatic.com`.
2. **Một font duy nhất cho toàn site.** Trước đây thân bài dùng Manrope, tên quẻ dùng Libre Caslon
   Text — mà Libre Caslon **không có glyph** cho dải U+1EA0-1EF9, nên chính tên quẻ (chữ to nhất màn
   hình) bị render lẫn hai kiểu chữ. Đã thử Manrope-cho-tất-cả trước, rồi chốt **EB Garamond**:
   old-style serif hợp theme giấy cổ, có subset `vietnamese` đủ cho cả normal lẫn italic.
3. **Thứ tự khai báo `@font-face` là chi tiết có ảnh hưởng thật.** `latin-ext` và `vietnamese` trùng
   nhau ở ă/đ; theo CSS thì rule khai báo sau thắng. Google xếp `latin-ext` sau nên trình duyệt tải
   thêm 2 file nặng (111KB + 86KB) dù nội dung thuần tiếng Việt. Đảo để `vietnamese` đứng sau:
   payload font **309KB → 112KB**, ảnh chụp khác **0/4.720.000 pixel**.

Bài học phương pháp cho lần sau: mọi kết luận ở trên đều đến từ **đo trên app thật** (Playwright +
so pixel). Các ảnh mockup dựng riêng để so font đã cho kết quả sai hoàn toàn — font Google không nạp
trong môi trường headless, khiến mọi phương án đều ra serif mặc định, và phép đo bề rộng chữ cũng sai
vì đo trước khi `document.fonts.load()` hoàn tất. Đừng tin mockup; dựng thẳng trên app rồi chụp.

**Điểm thuận lợi:** vì không có backend, toàn bộ nội dung là dữ liệu tĩnh biết trước tại thời điểm
build — điều kiện lý tưởng cho prerender/SSG mà không cần vận hành server, giữ đúng mô hình "static
SPA, không backend" hiện tại.

### 1.4. Khoảng trống chiến lược tìm kiếm

Danh sách route hiện phản ánh menu sản phẩm, chưa phải bản đồ nhu cầu tìm kiếm. Kế hoạch cần research
SERP và ánh xạ query → landing page cho bốn cụm:

1. **Tool intent:** gieo/xem quẻ Kinh Dịch online, ba đồng xu, Mai Hoa Dịch Số, lập quẻ Lục Hào.
2. **Learning intent:** Nạp Giáp, Lục Thân, Thế–Ứng, Tuần Không, Lục Thần, quẻ biến, cách đọc kết quả.
3. **Reference intent:** 64 quẻ, số quẻ, tên và alias của từng quẻ.
4. **Private/navigation intent:** quẻ đã lưu và kết quả cá nhân — phục vụ UX nhưng không index.

Riêng `Tìm ngày tốt`, SERP rộng thường kỳ vọng tuổi, 12 Trực, hoàng/hắc đạo và ngày kỵ; tính năng
QIChing thực tế quét điểm Lục Hào theo thời điểm. Copy/H1/title phải định vị rõ là **"Tìm thời điểm
thuận theo quẻ Dịch/Lục Hào"**, không hứa đáp ứng intent lịch vạn niên nếu sản phẩm không làm việc đó.

### 1.5. Trust, safety và độ đúng nghiệp vụ

UI hiện có ví dụ câu hỏi về đầu tư và sức khỏe, sau đó trả các mức như "Khá Thuận" hoặc "Cần Thận
Trọng". Khi trải nghiệm có thể ảnh hưởng quyết định tài chính/sức khỏe, cần mức trust cao hơn:

- Hiển thị rõ phương pháp truyền thống chỉ để tham khảo/chiêm nghiệm; không được xác nhận khoa học,
  không thay thế tư vấn y tế, pháp lý hoặc tài chính, và không nên là căn cứ duy nhất cho quyết định
  hệ trọng.
- Có trang phương pháp, nguồn dữ liệu, giới hạn, tác giả/người review, chính sách biên tập và đính chính.
- Không dùng claim "chính xác" hoặc "đã kiểm chứng" khi bằng chứng mới chỉ là parity với app 2011.
  Tài liệu kiến trúc đã ghi rõ legacy parity không mặc nhiên là oracle nghiệp vụ; một số trường hợp
  nhiều hào động vẫn chưa có oracle độc lập.
- Sửa bất nhất thuật ngữ: UI có hai cách khởi quẻ (Mai Hoa và ba đồng xu), trong khi trang Giới thiệu
  hiện chỉ mô tả khởi quẻ bằng Mai Hoa.

### 1.6. Hiện chưa có hệ đo thành công

Mục tiêu cũ chủ yếu là output kỹ thuật (URL, meta, sitemap). Cần thêm baseline và outcome:

- Search Console/Bing: impressions, clicks, CTR, query non-brand và trạng thái index/canonical.
- Analytics bảo vệ riêng tư: organic landing → bắt đầu/hoàn tất công cụ, guide → tool, lưu/chia sẻ.
- Không gửi nội dung câu hỏi, ngày giờ cá nhân hoặc dữ liệu quẻ đã lưu vào analytics/URL/OG metadata.
- Core Web Vitals theo field data ở percentile 75; lab test chỉ dùng để chẩn đoán.

## 2. Mục tiêu

### 2.1. Outcome

1. Tăng lượng tìm kiếm **non-brand** dẫn tới các trang công cụ và nội dung hướng dẫn phù hợp intent.
2. Tăng số phiên organic bắt đầu và hoàn tất một tác vụ hữu ích: lập/gieo quẻ, đọc cách giải hoặc
   tìm thời điểm theo phương pháp của QIChing.
3. Chỉ mở rộng index khi URL có demand, quyền sử dụng rõ, chất lượng xuất bản đạt chuẩn và giá trị
   khác biệt có thể chứng minh.

Không đặt mục tiêu traffic/ranking tuyệt đối trước khi có baseline Search Console và keyword demand.

### 2.2. Technical guardrail

1. Chỉ `https://qiching.org` phục vụ nội dung indexable. `www.qiching.org` và production
   `qiching.pages.dev` redirect 301 về apex, giữ path và query string. UAT được bảo vệ bằng Cloudflare
   Access hoặc trả `X-Robots-Tag: noindex`.
2. Mỗi route public có URL ổn định, link `<a href>` crawlable, HTML/head riêng và canonical tự trỏ.
3. URL không hợp lệ trả 404 thật; sitemap chỉ chứa URL canonical, indexable, trả HTTP 200.
4. Preview chia sẻ có title, description và ảnh đúng route mà không phụ thuộc bot chạy JavaScript.
5. Giữ trải nghiệm chuyển trang tức thời sau khi hydrate; không gây hydration mismatch hoặc stale
   build-time date.

### 2.3. Content guardrail

1. Không index văn bản bên thứ ba khi chưa xác minh quyền sử dụng.
2. Không publish hàng loạt trang quẻ chưa qua copyedit, review nghiệp vụ và kiểm tra giá trị riêng.
3. Không tạo 64 × chủ đề (tình yêu, sức khỏe, tài lộc) hoặc tách 384 hào thành trang mỏng.
4. Không đưa câu hỏi/kết quả cá nhân vào sitemap, metadata, analytics hoặc URL public.

## 3. Release gate và chính sách index

### 3.1. Bốn gate bắt buộc

| Gate | Câu hỏi bắt buộc | Bằng chứng đạt |
|---|---|---|
| G1 — Rights | QIChing có quyền publish phần nội dung này không? | License/nguồn public-domain/phạm vi trích dẫn được ghi trong registry |
| G2 — Editorial | Nội dung đã sạch OCR, đúng nguồn và có người review chưa? | Checklist copyedit, đối chiếu ấn bản, author/reviewer/version |
| G3 — Trust & safety | Phương pháp, giới hạn, provenance và cảnh báo đã rõ chưa? | Trang phương pháp/nguồn/đính chính và disclaimer hiển thị đúng ngữ cảnh |
| G4 — Technical | URL có 200, HTML hữu ích, canonical, metadata và link crawlable chưa? | Crawl build/production không lỗi; URL Inspection đạt |

Trang quẻ chỉ được chuyển từ `noindex` sang `index` khi vượt cả G1–G4.

### 3.2. Query → URL map ban đầu

URL cuối cùng phải được chốt sau SERP/keyword research; bảng dưới là policy tối thiểu, không phải danh
sách landing page phải tạo bằng mọi giá.

| Intent | URL ứng viên | Chính sách ban đầu |
|---|---|---|
| Gieo/xem quẻ Kinh Dịch online | `/` | Index + prerender; công cụ và hướng dẫn ngắn cùng trang |
| Tra cứu 64 quẻ | `/64-que` | Index + prerender; hub có link thật tới detail |
| Ý nghĩa một quẻ | `/64-que/<so>-<slug>` | URL ổn định nhưng `noindex` tới khi vượt G1–G4 |
| Tìm thời điểm theo Lục Hào | `/tim-ngay-tot` | Index sau khi copy giải thích đúng phương pháp và intent |
| Giới thiệu/phương pháp/nguồn | `/gioi-thieu` và route trust cần thiết | Index nếu có nội dung hữu ích, không tạo trang hình thức |
| Quẻ đã lưu/kết quả cá nhân | `/que-da-luu`, state kết quả | `noindex`, không sitemap, không public hóa dữ liệu |
| Hướng dẫn Nạp Giáp/Lục Thân/Thế–Ứng | Chốt sau keyword research | Chỉ tạo khi một URL đáp ứng intent riêng, tránh cannibalization |

Mỗi quẻ có một URL canonical cho mọi alias. Slug sai, alias URL hoặc biến thể trailing slash phải
redirect về URL chuẩn hoặc trả 404; không để router chấp nhận vô hạn URL khác nhau cho cùng `soThuTu`.

## 4. Việc cần làm, chia theo giai đoạn

### Giai đoạn 0 — Baseline, governance và domain hygiene (làm ngay)

> **Tiến độ 2026-09-03** (đã lên production, SHA `e46cb41` — xem `06-deployment.md` mục 3.1):
>
> | Việc | Trạng thái |
> |---|---|
> | `robots.txt` hợp lệ (`text/plain`, không còn app shell) | ✅ đã lên prod |
> | Meta/OG/Twitter/canonical tĩnh trong `index.html` + ảnh OG 1200×630 (`public/og-image.png`) | ✅ đã lên prod |
> | `noindex` cho `uat.qiching.org`, `qiching-uat.pages.dev`, `qiching.pages.dev` (`public/_headers`) | ✅ đã kiểm chứng bằng HTTP |
> | Hostname preview `<hash>.pages.dev` | ✅ Cloudflare tự gắn `x-robots-tag: noindex`, không cần làm gì |
> | 301 `www.qiching.org` → apex, giữ path/query | ✅ Cloudflare Redirect Rule (zone), đã kiểm chứng 3 case |
> | Google Search Console — xác minh quyền sở hữu | ✅ 2026-09-03, property URL-prefix `https://qiching.org/`, xác minh bằng **2 phương thức song song**: (1) **HTML tag** trong `index.html` — không chọn "HTML file" vì SPA fallback trả 200 cho mọi URL; (2) **Domain name provider** — TXT record tại apex trên Cloudflare. Nhờ (2) mà việc dọn `<head>` ở Giai đoạn C không làm mất quyền sở hữu, nhưng vẫn **không nên xoá** thẻ ở (1) |
> | Bing Webmaster Tools | ⬜ chưa làm |
> | Baseline Search Console (mục 2) | ✅ 2026-09-03: clicks 0 / impressions 0 / chưa có query ("No data" — property mới verify, Search Console không có dữ liệu hồi tố). Trang chủ **đã được index** (`Page is indexed`), `URL has no enhancements`. Đã Request Indexing để lấy lại bản có title/description/OG mới |
> | Registry quyền sử dụng `noiDungQue.json` (mục 3) | ⬜ chưa làm — G1 đang **đóng băng** theo quyết định của owner |
> | Analytics — pageview + CWV field data | ✅ Cloudflare Web Analytics đang chạy: **automatic setup ở tầng zone** `qiching.org`, Cloudflare tự chèn beacon ở edge (không có gì trong repo, bundle không tăng). Token `546a4737…c13` **dùng chung cho mọi hostname trong zone** nên `uat.qiching.org` cũng bị tính; `*.pages.dev` thì không (ngoài zone) |
> | Vệ sinh dữ liệu analytics | ⚠️ Xử lý bằng **lọc lúc đọc**, không chặn thu thập: luôn thêm filter `Hostname equals qiching.org` (+ `Exclude bots`) khi xem báo cáo — nên bookmark URL đã có filter. Bỏ quên filter thì mọi con số bị thổi phồng, đặc biệt nguy hiểm khi đo trước/sau Core Web Vitals. Phương án chặn triệt để (tắt automatic setup, chèn beacon thủ công có điều kiện hostname) đã cân nhắc và **cố ý không chọn** vì không đáng đánh đổi độ phức tạp trong `index.html` |
> | Custom event (`tool_start`, `tool_complete`, …) | ⬜ chưa làm — hoãn tới sau Giai đoạn A, vì funnel "guide → tool" chưa biểu diễn được khi toàn site còn 1 URL. Cloudflare Web Analytics không hỗ trợ custom event |

1. Đăng ký Google Search Console và Bing Webmaster Tools; bật analytics bảo vệ riêng tư và định nghĩa
   event `tool_start`, `tool_complete`, `guide_to_tool`, `save`, `share`. Tuyệt đối không gửi nội dung
   câu hỏi/kết quả vào event payload.
2. Chụp baseline: query/page non-brand, index coverage, canonical do Google chọn, CWV field data và
   funnel organic → công cụ. Nếu chưa đủ dữ liệu thì ghi `chưa có baseline`, không tự đặt target.
3. Lập registry quyền sử dụng cho `noiDungQue.json`; đóng băng việc mở index detail quẻ tới khi G1–G3
   có owner và checklist.
4. Redirect 301 `www.qiching.org/*` về `https://qiching.org/:splat`, giữ path/query. **Phải làm bằng
   Cloudflare Redirect Rules ở tầng zone (dashboard)** — không làm được từ repo, xem kết quả kiểm
   chứng bên dưới. Với mirror `qiching.pages.dev`, redirect sạch hơn `noindex` nhưng không đặt được
   Redirect Rule (domain này không thuộc zone qiching.org); phương án khả thi từ repo là `noindex`,
   muốn redirect thật thì tắt/đổi domain trong Pages settings.
5. Với `uat.qiching.org` và `qiching-uat.pages.dev`, ưu tiên Cloudflare Access. Nếu cần public cho
   tester, trả `X-Robots-Tag: noindex` và vẫn cho crawler đọc response; không `Disallow` bằng robots
   cùng lúc.

UAT và production dùng chung artifact **không ngăn** cấu hình header riêng hostname: Cloudflare Pages
`_headers` hỗ trợ pattern URL tuyệt đối, ví dụ `https://uat.qiching.org/*`. Nếu response chuyển sang
Pages Functions/Worker thì header phải được gắn trong code response vì `_headers` không áp dụng cho
response do Function sinh.

**Kiểm chứng 2026-09-02 trên UAT — `_headers` và `_redirects` KHÔNG giống nhau ở điểm này:**

| Cơ chế | Match theo hostname (absolute URL ở vế nguồn) | Bằng chứng |
|---|---|---|
| `_headers` | **Có** | `https://uat.qiching.org/*` → response trả đúng `x-robots-tag: noindex, nofollow`; hostname khác không bị ảnh hưởng |
| `_redirects` | **Không** | Cùng một deployment: rule đường dẫn `/__seo-path-test/* → /64-que 301` cho **HTTP 301**, trong khi rule `https://<host>/__seo-redirect-test/* → ... 301` cho **HTTP 200, không redirect** |

Hệ quả thực tế: rule dạng `https://www.qiching.org/* https://qiching.org/:splat 301` trong
`_redirects` là **rule chết** — im lặng không làm gì và tạo ảo giác "đã xong Giai đoạn E". Vì vậy
`public/_redirects` hiện cố ý để trống, chỉ dùng cho redirect theo đường dẫn trong cùng site.

Các quick win độc lập có thể đi cùng giai đoạn này:

- Thêm `robots.txt` hợp lệ ngay. Không cần đợi router; mặc định không có robots cũng đã cho crawl.
- Thêm fallback meta cho **homepage hiện tại** trong `index.html`: description, OG/Twitter và ảnh
  1200×630. Đây chỉ là preview chung tạm thời; đích đến vẫn là head tĩnh đúng từng route sau SSG.
- Xác minh bằng HTTP header/status thực tế, không chỉ bằng cấu hình trong dashboard.

Canonical không thay thế redirect cho mirror production hoặc `noindex`/Access cho UAT; canonical chỉ
là một tín hiệu để search engine lựa chọn URL đại diện.

### Giai đoạn A — Hạ tầng URL (điều kiện tiên quyết cho mọi việc còn lại)

> **ĐÃ LÀM 2026-09-04** (`d18e72e`, đang ở UAT, chưa lên production).
>
> | Hạng mục | Trạng thái |
> |---|---|
> | 6 route có URL riêng, đúng bảng bên dưới | ✅ |
> | `src/ui/duongDan.ts` — nguồn duy nhất sinh/phân giải đường dẫn | ✅ dùng chung cho router, link, và sitemap sau này |
> | Slug sai/thiếu → redirect canonical | ✅ `/64-que/46`, `/64-que/46-sai`, `/64-que/dia-phong-thang` đều về `/64-que/46-dia-phong-thang` |
> | Trailing slash → chuẩn hoá | ✅ `ChuanHoaDuongDan` trong layout |
> | `<button>` → `<a href>` (nav, 64 ô quẻ, nút trước/sau) | ✅ đếm được đúng 64 link trong lưới |
> | Dữ liệu cá nhân không lên URL | ✅ "Xem lại" truyền qua history state, URL sạch |
> | Catch-all + `/que-da-luu` gắn `noindex` | ✅ (biện pháp chuyển tiếp) |
> | **HTTP 404 thật cho URL sai** | ❌ **CÒN NỢ** — mọi URL vẫn trả 200 do SPA fallback, kiểm chứng lại trên UAT sau khi deploy. Phải đợi Giai đoạn B: thêm `404.html` trước khi mọi route hợp lệ có file HTML riêng sẽ tắt SPA fallback và làm hỏng deep-link |
>
> Kiểm chứng: 15 unit test URL contract + 36 test Playwright, chạy cả trên local lẫn trên bản
> UAT thật (deep link, refresh, back/forward, trailing slash, slug sai, URL rác, phân biệt quẻ 1
> với quẻ 52). Không lỗi console. Bundle 756KB → 796KB do thêm `react-router`.
>
> Việc mở khoá tiếp theo: Giai đoạn C (head/canonical theo route) giờ đã làm được, vì trước đây
> toàn site chỉ có một URL nên không có gì để phân biệt.

Thêm client-side router (khuyến nghị `react-router` — hiện `package.json` chỉ có `react`,
`react-dom`, `lunar-calendar-ts-vi`, nên đây là dependency mới) để mỗi trang và mỗi quẻ có URL
riêng:

| Màn hình | URL đề xuất |
|---|---|
| Xem quẻ (trang chủ) | `/` |
| 64 Quẻ Kinh Dịch — danh sách | `/64-que` |
| Chi tiết một quẻ | `/64-que/<so-thu-tu>-<ten-khong-dau>` (ví dụ `/64-que/1-thuan-can`) |
| Tìm ngày tốt | `/tim-ngay-tot` |
| Quẻ đã lưu | `/que-da-luu` (`noindex`, không sitemap) |
| Giới thiệu | `/gioi-thieu` |

**Số thứ tự trong slug là khóa định danh:** slug hoá từ `tenQue` chỉ unique 63/64 — quẻ 1 "Thuần
Càn" và quẻ 52 "Thuần Cấn" đều ra `thuan-can`. Router phải kiểm tra cả số và slug: slug sai không
được âm thầm trả cùng nội dung với HTTP 200; phải redirect về canonical hoặc trả 404.

**Đổi `<button>` sang link thật.** Đây là phần dễ bỏ sót nhất của giai đoạn này: chuyển nav 5 tab,
lưới 64 quẻ và nút quẻ trước/sau sang `<Link>`/`<a href>` để bot có đường bò và để internal linking
(Giai đoạn G) có ý nghĩa. Chỉ đổi nguồn state từ `useState` sang URL là **chưa đủ**.

Cloudflare Pages hiện dùng SPA fallback nên mọi URL sai đều trả app shell HTTP 200. Route catch-all
gắn `noindex` là phương án chuyển tiếp, không phải trạng thái hoàn thành. Đích đến:

- Prerender một file HTML cho **mọi route hợp lệ**, kể cả route UX `noindex` như `/que-da-luu`.
- Sau đó dùng top-level `404.html` hoặc Pages Function/Worker có allowlist để URL không hợp lệ trả
  HTTP 404 thật. Thêm `404.html` trước khi các deep-link hợp lệ có file riêng sẽ tắt SPA fallback và
  làm hỏng deep-link, nên thứ tự triển khai là bắt buộc.
- Có test cho path trực tiếp, refresh, back/forward, trailing slash, slug sai và URL ngẫu nhiên.

### Giai đoạn B — Prerender/SSG (quyết định phạm vi trước khi làm)

> **ĐÃ LÀM 2026-09-04** (`5dbbb9e`, đang ở UAT). Prerender **toàn bộ** 69 route hợp lệ + `404.html`.
>
> | Hạng mục | Trạng thái |
> |---|---|
> | SSR entry + script prerender, `hydrateRoot` | ✅ `src/entry-server.tsx`, `scripts/prerender.mjs` |
> | Bóc metadata khỏi body, chèn vào `<head>` | ✅ cần vì `renderToString` chỉ dựng cây con nên React không có `<head>` để hoist |
> | Build FAIL khi sai | ✅ thiếu file route, metadata sót trong body, sai số lượng title/canonical/description |
> | Khởi tạo deterministic | ✅ ngày/giờ "bây giờ" (XemQue, TimNgayTot) và `localStorage` (QueDaLuu) chuyển sang set sau mount |
> | 0 cảnh báo hydration | ✅ đo trên cả 6 route, chạy trực tiếp trên UAT |
> | **HTTP 404 thật** | ✅ **đã trả được** — món nợ từ Giai đoạn A |
> | Bot không chạy JS đọc được nội dung | ✅ ~3.800 ký tự text trong HTML tĩnh của một trang quẻ |
>
> **Bẫy đã sập và cách thoát — ghi lại để không lặp lại:** bản deploy đầu tiên bị **vòng lặp
> redirect vô hạn**. Với `dist/64-que/index.html`, Cloudflare Pages coi URL canonical là dạng CÓ
> dấu `/` cuối và 308 `/64-que` → `/64-que/`, trong khi luật `_redirects` tự thêm lại 301 ngược
> chiều. Thoát bằng cách xuất **file phẳng** `dist/64-que.html` — Pages phục vụ thẳng `/64-que`
> ở 200 và tự nắn dạng có dấu `/` về canonical. Bài học: hành vi URL của Pages phụ thuộc CÁCH
> ĐẶT FILE, và chỉ lộ ra khi chạy trên hạ tầng thật, không thấy được ở local.
>
> Trạng thái HTTP hiện tại (đo trên Cloudflare): route hợp lệ 200; `/64-que/46` và alias theo
> tên 301 về canonical; URL rác 404; `/64-que/thuan-can` 404 vì nhập nhằng giữa quẻ 1 và 52 —
> cố ý không đoán.
>
> **Phạm vi index chưa đổi:** 64 trang quẻ vẫn `noindex` theo quyết định đóng băng G1.

> **Bằng chứng 2026-09-03 — Googlebot RENDER ĐƯỢC app, nên B hạ ưu tiên so với A.**
> URL Inspection → Live Test → rendered HTML của `https://qiching.org/` cho thấy Google dựng được
> toàn bộ cây DOM của React: header, nav 5 tab, khối "Cách khởi quẻ", form "Câu hỏi", nút "Lập quẻ".
> Không phải `<div id="root">` rỗng. Kết luận: giả định "CSR khiến Google không thấy nội dung" **không
> đúng với Googlebot** ở thời điểm này.
>
> Ba hệ quả:
> 1. **Nút thắt thật sự là Giai đoạn A, không phải B.** Google render tốt nhưng rendered HTML cho thấy
>    điều hướng vẫn là `<button type="button">64 Quẻ Kinh Dịch</button>` — **không có một `<a href>`
>    nào**. Google dựng được trang, rồi không có đường nào đi tiếp. Một URL, zero outgoing link.
> 2. **B vẫn cần, nhưng vì lý do khác** — không phải để Googlebot thấy nội dung, mà cho: bot preview
>    mạng xã hội (không chạy JS), Bing (JS-rendering yếu hơn Google), và tốc độ/độ tin cậy của việc
>    index hàng loạt URL sau khi có router.
> 3. **Xác nhận rủi ro hydration đã cảnh báo:** rendered HTML có `value="2026-09-02"` và `value="18:27"`
>    trong khi test chạy lúc Sep 3 08:27 (giờ VN) — tức renderer của Google chạy ở múi giờ khác
>    (UTC-7). Đây chính là hệ quả của `new Date()` trong initializer của `XemQue`/`TimNgayTot`. Khi làm
>    prerender, giá trị phụ thuộc "hôm nay" **bắt buộc** phải tách sang client effect hoặc render
>    placeholder ổn định, nếu không HTML tĩnh sẽ đóng băng một ngày sai.

Phạm vi prerender và phạm vi index là hai quyết định khác nhau. Một route có thể được prerender để
deep-link/UX ổn định nhưng vẫn `noindex`. Kết luận hiện tại:

- **Ưu tiên index** trang chủ, `/64-que`, `/tim-ngay-tot` sau khi copy khớp intent, `/gioi-thieu` và
  các guide/trust page có giá trị thực.
- **Prerender route hợp lệ nhưng `noindex`** 64 detail page trong ngắn hạn để hỗ trợ chia sẻ/deep-link
  mà không scale nội dung bên thứ ba vào Search.
- **Pilot 8 trang quẻ** (mỗi cung một quẻ) chỉ sau khi đã qua G1–G4. Đo query, engagement và funnel
  trước khi quyết định mở rộng 64 trang.

Template pilot phải phân biệt rõ: nguyên văn cổ điển, bản dịch có quyền, dữ liệu app tính, giải thích
phương pháp và nhận định biên tập. Phần giá trị riêng nên gồm cấu trúc quẻ, bảng Nạp Giáp/Thế–Ứng có
giải thích, provenance, author/reviewer/version/limitations — không chỉ chèn cùng một đoạn boilerplate
vào 64 trang.

Về kỹ thuật: build-time render HTML cho từng route rồi hydrate lại, không cần backend runtime. Các
điều kiện bắt buộc:

- Thêm server/prerender entry và đổi client entry từ `createRoot` sang `hydrateRoot` khi đã có HTML
  server-generated; `createRoot` sẽ bỏ lợi ích hydrate và có thể thay lại markup.
- Rà cả **SSR-safe** lẫn **hydration-deterministic**. `window`/`localStorage` trong effect cần guard,
  nhưng `new Date()` trong initializer của `XemQue`/`TimNgayTot` còn có thể tạo HTML build-time cũ hoặc
  mismatch với client. Tách giá trị phụ thuộc "hôm nay" sang client effect hoặc render placeholder ổn định.
- `/que-da-luu` đọc localStorage chỉ nên hydrate phần client sau mount; HTML prerender phải ổn định và
  route vẫn `noindex`.
- Build phải fail nếu thiếu route file, duplicate canonical/title, metadata lọt vào `<body>`, hoặc
  hydrate phát warning.

### Giai đoạn C — Thẻ meta động theo route

> **ĐÃ LÀM 2026-09-04** (`48a3477`). `src/ui/MetaTrang.tsx` + `metaNoiDung.ts`.
>
> | Yêu cầu | Trạng thái |
> |---|---|
> | Mỗi route đúng 1 title/description/canonical/OG | ✅ script prerender fail build nếu sai số lượng |
> | Không để fallback tĩnh song song | ✅ đã bỏ toàn bộ metadata tĩnh khỏi `index.html`; chỉ giữ `google-site-verification` vì không đổi theo route |
> | Metadata không lọt vào `<div id="root">` | ✅ có kiểm tra trong script |
> | Canonical là URL tuyệt đối, tự trỏ | ✅ ví dụ `https://qiching.org/64-que/46-dia-phong-thang` |
> | Detail quẻ KHÔNG trích `giaiNghia` làm snippet | ✅ dùng dữ liệu định danh do app tính (số, tên, nội/ngoại quái, cung) — không đẩy văn bản chưa qua G1/G2 ra SERP |
> | Bot không chạy JS đọc được head | ✅ nhờ Giai đoạn B |
>
> `/tim-ngay-tot` đặt tiêu đề đúng thứ tính năng làm (quét theo Lục Hào), không hứa lịch vạn niên
> — theo mục 1.4.

React 19 (`package.json`: `react ^19.2.8`) hỗ trợ native việc render `<title>`, `<meta>`, `<link>`
từ component và hoist lên `<head>` — không bắt buộc dùng `react-helmet`. Yêu cầu cần kiểm tra trên
**HTML output cuối**, không phụ thuộc giả định về thứ tự hoist:

1. Mỗi file route có đúng một `<title>`, một description, một canonical và một bộ OG/Twitter; không
   để fallback tĩnh tồn tại song song thành metadata trùng/mâu thuẫn.
2. Prerender nên sinh cả document/template head đúng chuẩn hoặc có bước inject metadata được test;
   không để `<title>`/`meta` nằm trong `<div id="root">` ở HTML đã xuất.
3. Title/H1 mô tả đúng intent; canonical là absolute URL trên `https://qiching.org` và tự trỏ.
4. Detail quẻ chưa qua gate dùng meta mô tả tính năng/định danh do QIChing viết, không lấy tự động
   1–2 câu từ `giaiNghia` bên thứ ba chưa copyedit/chưa rõ quyền.
5. Bot preview không chạy JS phải đọc được head ngay từ response HTML. Metadata client-side trước SSG
   vẫn hữu ích cho tab trình duyệt/Google render, nhưng không đáp ứng mục tiêu preview đầy đủ.

### Giai đoạn D — Crawl/indexation files và Search Console validation

- Search Console/Bing và baseline thuộc Giai đoạn 0; không đợi router.
- `robots.txt` hợp lệ cũng làm ngay. Nó quản lý crawl, không phải công cụ canonicalization hoặc bảo
  mật; `Allow: /` tương đương mặc định cho crawl.
- Chỉ sinh/submit `sitemap.xml` sau khi URL/canonical/domain chuẩn ổn định. Sitemap chỉ chứa URL đã
  được policy cho index và trả HTTP 200; **không mặc định đọc `noiDungQue.json` để đưa đủ 64 quẻ**.
- Chỉ ghi `lastmod` khi nội dung thực sự thay đổi; không dùng ngày build cho mọi URL.
- Không thêm `priority`/`changefreq` với kỳ vọng Google dùng chúng; tập trung vào URL canonical và
  `lastmod` chính xác.
- Sau deploy, kiểm tra URL Inspection, Page Indexing, Sitemaps và canonical do Google chọn. Sitemap
  submitted thành công không đồng nghĩa URL sẽ được index.

### Giai đoạn E — Domain chuẩn (canonical domain)

Hoàn thành hai redirect vĩnh viễn trên Cloudflare:

- `https://www.qiching.org/*` → `https://qiching.org/:splat`.
- `https://qiching.pages.dev/*` → `https://qiching.org/:splat`.

Giữ path/query, tránh redirect chain và kiểm tra bằng HTTP status/`Location`. `uat.qiching.org` và
`qiching-uat.pages.dev` không redirect về production vì phục vụ kiểm thử; chúng dùng Access hoặc
`X-Robots-Tag: noindex` theo Giai đoạn 0.

### Giai đoạn F — Structured data (JSON-LD)

Structured data là lớp mô tả sau khi content/template ổn định, không phải cách bù cho nội dung yếu:

- Ưu tiên `WebSite` trên homepage với `name`, `alternateName` và `url` chính xác để mô tả site name.
- `BreadcrumbList` chỉ dùng khi breadcrumb tương ứng hiển thị và link được trên trang.
- `Article` chỉ dùng cho bài biên tập thực sự có headline, author/reviewer, ngày và nội dung nguyên bản;
  không gắn máy móc vào trang quẻ chứa văn bản bên thứ ba.
- `DefinedTerm` có thể mô tả ngữ nghĩa nhưng không phải rich result ưu tiên. Dùng ít schema nhưng đầy
  đủ, chính xác và khớp nội dung visible tốt hơn phủ schema hàng loạt.
- Validate bằng Rich Results Test/Schema validator và kiểm tra HTML prerender. Google không bảo đảm
  rich result ngay cả khi markup hợp lệ.

Google ngừng hiển thị sitelinks search box từ **21/11/2024**, không phải 11/2023; không đưa hạng mục
này vào backlog.

### Giai đoạn G — On-page và internal linking

- **Main heading rõ ràng:** hai `<h1>` không tự thân là lỗi SEO, nhưng mỗi route cần một tiêu đề chính
  dễ nhận biết, khớp title và intent. Hợp lý nhất là dùng logo/site name như link thương hiệu và để
  tên công cụ/tên quẻ làm `<h1>`; giữ hierarchy `<h2>`/`<h3>` nhất quán.
- **Internal link:** từ trang chi tiết một quẻ, link sang các quẻ cùng cung Bát Quái và quẻ biến —
  hữu ích cho người dùng, đồng thời tạo liên kết nội bộ giữa 64 trang (chỉ có tác dụng nếu đã đổi
  sang `<a href>` thật ở Giai đoạn A).
- **Hub-and-spoke:** guide khái niệm link đến công cụ và quẻ minh họa; công cụ link lại hướng dẫn
  phương pháp/giới hạn; hub 64 quẻ link detail bằng tên và alias có nghĩa.
- **`aria-label` cho hình quẻ** (`HinhQue.tsx`, `DanhSachHaoDich.tsx` — hiện vẽ bằng `div`/`span`,
  toàn bộ `src/` không có một `alt`/`aria-label` nào): làm vì accessibility và khả năng hiểu UI;
  không hứa đây là đòn bẩy ranking trực tiếp.

### Giai đoạn H — Performance (Core Web Vitals)

- **Route-level code splitting trước:** lazy-load module `Que64`/dataset có thể hoãn tải và parse
  toàn bộ JSON khỏi các route không dùng nó, dù file JSON vẫn chứa 64 bản ghi. Đây là quick win hợp
  lệ; nó chỉ chưa giảm chi phí khi người dùng thực sự vào `/64-que`.
- **Tách index/detail khi có bằng chứng:** nếu trace cho thấy `/64-que` còn nặng, tạo index nhẹ
  (`soThuTu`, tên/alias, quẻ thượng/hạ...) và lazy-load phần giải nghĩa/hào từ theo quẻ. Quyết định
  trường nào nằm trong index dựa trên UX thật; không giữ đoạn dài chỉ để phục vụ hover.
- **Google Fonts đang là `@import` bên trong CSS đã bundle** (`src/ui/stitch-theme.css` dòng 1) —
  chuỗi request nối tiếp tệ nhất cho LCP: tải CSS → mới phát hiện font CSS → mới tải font. Trước khi
  tính self-host, chỉ cần chuyển thành `<link rel="preconnect">` + `<link rel="stylesheet">` trong
  `index.html` đã cải thiện đáng kể với chi phí gần bằng 0. Self-host (loại hẳn phụ thuộc mạng
  ngoài, xem `06-deployment.md` mục 1) là bước sau.
- Ưu tiên theo field data và trace; không coi cảnh báo chunk 500KB hoặc một lần Lighthouse là KPI.

## 5. Roadmap 90 ngày

Owner dưới đây là vai trò; phải gán tên cụ thể trước khi bắt đầu milestone.

| Thời gian | Owner chính | Đầu ra | Definition of done |
|---|---|---|---|
| Tuần 0–2 | Product/SEO + Content owner | Baseline, rights registry, query/SERP map, analytics events, domain hygiene, robots và homepage OG | Có baseline hoặc ghi rõ thiếu dữ liệu; `www`/prod pages.dev 301; UAT Access/noindex; không log câu hỏi cá nhân |
| Tuần 2–4 | Engineering | Router, link thật, SSG/hydration, head theo route, canonical, 404 thật, sitemap policy | Crawl production không có soft-404/duplicate head; refresh mọi route hợp lệ; invalid URL trả 404; sitemap chỉ chứa URL indexable |
| Tuần 4–8 | Content owner + domain reviewer | Trang phương pháp/nguồn/giới hạn, 3–5 guide thực chất, copy đúng intent cho tool, pilot 8 quẻ | Mỗi trang vượt gate tương ứng; không lỗi OCR đã biết; author/reviewer/source/version hiển thị; internal links hoạt động |
| Tuần 8–12 | Product/SEO | Đánh giá pilot và quyết định scale/stop/iterate | Báo cáo query → landing → tool completion; quyết định 64 quẻ dựa trên demand, quality và conversion, không dựa trên số URL index |

### 5.1. Thứ tự triển khai kỹ thuật

1. Measurement/governance và canonical-host hygiene.
2. Fallback homepage meta/OG và `robots.txt` hợp lệ.
3. Router, URL contract và link crawlable.
4. Prerender deterministic HTML + `hydrateRoot` + metadata/canonical theo route.
5. Real 404, sitemap allowlist và Search Console validation.
6. Content/trust pilot, on-page/internal links và schema phù hợp.
7. Performance tối ưu theo field data.

## 6. KPI và nhịp review

### 6.1. KPI kỹ thuật

- 100% URL trong sitemap trả 200, indexable, self-canonical và có HTML hữu ích.
- 0 URL private/UAT/nội dung chưa qua gate trong sitemap hoặc index policy.
- 0 soft-404 do SPA fallback đối với URL không hợp lệ sau milestone tuần 2–4.
- Không duplicate/missing title, description, canonical; không hydration warning ở route prerender.
- Theo dõi LCP/INP/CLS bằng field data ở percentile 75; dùng ngưỡng Core Web Vitals hiện hành làm
  guardrail, không biến điểm Lighthouse thành north-star KPI.

### 6.2. KPI acquisition và product

- Non-brand impressions, clicks và CTR theo cluster `tool`, `learning`, `reference`.
- Số query/page vào top 20/top 10 để phát hiện cơ hội, không dùng ranking đơn lẻ làm mục tiêu cuối.
- Tỷ lệ organic landing → `tool_start` → `tool_complete`.
- Tỷ lệ guide → tool, save/share và người dùng quay lại nếu có cách đo bảo vệ riêng tư.

### 6.3. KPI nội dung/guardrail

- Số trang vượt đủ G1–G4; tỷ lệ trang pilot có impression/click/engagement sau thời gian quan sát.
- 0 lỗi quyền nội dung chưa xử lý, 0 lỗi OCR đã biết trong trang indexable.
- 0 claim "chính xác/đã kiểm chứng" không có bằng chứng; disclaimer hiển thị ở form/kết quả liên quan.

Review dashboard hàng tuần trong giai đoạn release, sau đó hàng tháng. So sánh theo cluster và cohort
ngày publish; không đổi ngày nội dung chỉ để tạo cảm giác mới.

## 7. Content governance

### 7.1. Registry và workflow

Mỗi asset nội dung cần ghi: nguồn/ấn bản, tác giả/dịch giả, trạng thái quyền sử dụng, phạm vi trích,
người viết, người review, ngày review thật và version. Workflow tối thiểu:

`draft → rights review → copyedit/source check → domain & safety review → SEO/UX review → publish`.

Tuyên bố bản quyền phải tách software/nội dung do QIChing tạo khỏi tài liệu bên thứ ba; không dùng một
dòng "All rights reserved" khiến người đọc hiểu nhầm quyền sở hữu toàn bộ corpus.

### 7.2. Template trang quẻ đủ điều kiện index

1. Nhận diện: số, tên chính, alias, Hán tự, nội/ngoại quái và hình quẻ accessible.
2. Dữ liệu QIChing: Nạp Giáp, Lục Thân, Thế–Ứng... kèm giải thích cách tính/đọc, không chỉ bảng thô.
3. Nội dung biên tập nguyên bản đã review; nhãn rõ phần cổ văn, bản dịch, logic app và nhận định.
4. Provenance/source, author/reviewer, ngày/version, giới hạn và link đính chính.
5. Breadcrumb và internal link hữu ích đến hub, guide, quẻ liên quan/quẻ biến.

Không tạo page variant theo mọi chủ đề hoặc mọi tổ hợp input. Kết quả phụ thuộc câu hỏi/ngày giờ là
trải nghiệm cá nhân, không phải inventory SEO.

### 7.3. Distribution và link earning

Technical SEO chỉ giúp crawl; kế hoạch tăng trưởng cần phân phối có chọn lọc: tài liệu phương pháp có
thể kiểm chứng, ví dụ tính toán, trang privacy/local-processing, chia sẻ công cụ trong cộng đồng Dịch
học phù hợp và liên kết từ tài sản/sản phẩm hiện có. Không mua link, spam directory hoặc tạo network
nội dung hàng loạt. Ghi nguồn referral/link earned để biết nội dung nào thực sự được cộng đồng dùng.

## 8. Acceptance criteria trước production

- Redirect apex policy, UAT noindex/Access và HTTP→HTTPS đều được test bằng status/header.
- Mỗi route hợp lệ refresh trực tiếp được; link nội bộ có `href`; route sai/slug sai có status đúng.
- View-source của route indexable chứa main content, title, description, canonical và OG đúng route.
- View-source của route `noindex` chứa `noindex`; URL đó không có trong sitemap.
- Sitemap/robots đúng content-type/cú pháp; sitemap không chứa redirect, 404, noindex hoặc URL mirror.
- Hydration không warning; ngày giờ mặc định không bị đóng dấu từ build; localStorage không tạo mismatch.
- Analytics network payload không chứa câu hỏi, kết quả, ngày giờ cá nhân hoặc dữ liệu quẻ đã lưu.
- Rich Results/Schema validation đạt với loại schema thực sự dùng; schema khớp nội dung visible.
- Pilot content có evidence G1–G4 và đã qua spell/OCR scan trước khi bỏ `noindex`.

## 9. Risk/decision register

| Mức | Rủi ro/quyết định | Cách xử lý |
|---|---|---|
| Blocker | Quyền sử dụng bản dịch/giảng chưa xác minh | Không index/scale; lập registry và xin phép hoặc thay nội dung |
| Blocker | Nghiệp vụ nhiều hào động chưa có oracle độc lập | Không claim accuracy; domain review và test fixture độc lập trước content promise |
| Cao | 64 trang templated ít giá trị hoặc lỗi OCR | Pilot 8, editorial gate và đánh giá dữ liệu trước scale |
| Cao | Câu hỏi sức khỏe/tài chính gây hiểu như lời khuyên | Disclaimer tại điểm dùng, sửa prompt mặc định, không dùng kết quả làm căn cứ duy nhất |
| Cao | Duplicate host và UAT bị index | 301 mirror production; Access/noindex UAT; monitor Search Console |
| Cao | SPA fallback tạo infinite soft-404 | Static file cho route hợp lệ + 404/edge allowlist |
| Cao | Hydration mismatch/stale date/localStorage | Deterministic SSR, client-only initialization có chủ đích, test console/DOM |
| Trung bình | Cannibalization giữa tool/guide/detail/alias | Query→URL map, một canonical mỗi intent/entity, redirect alias |
| Trung bình | Tối ưu performance không dựa dữ liệu | Field data/trace trước; route split trước, split corpus khi có bằng chứng |
| Trung bình | Analytics làm lộ dữ liệu người dùng | Event allowlist, payload test, privacy disclosure và không thu nội dung câu hỏi |

## 10. Tài liệu chuẩn tham chiếu

- Google Search: [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
  [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing),
  [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro),
  [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
  [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content),
  [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) và
  [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- Cloudflare Pages: [custom headers](https://developers.cloudflare.com/pages/configuration/headers/),
  [redirect pages.dev](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/),
  [redirect www](https://developers.cloudflare.com/pages/how-to/www-redirect/) và
  [serving/404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).
- React: [document metadata](https://react.dev/reference/react-dom/components/title),
  [server rendering](https://react.dev/reference/react-dom/server) và
  [hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot).

> Nguyên tắc chốt: không mở rộng index theo số lượng URL; chỉ mở rộng khi từng nhóm URL có demand,
> quyền sử dụng rõ, chất lượng xuất bản đạt chuẩn và giá trị khác biệt có thể chứng minh.
