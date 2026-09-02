# 06 – Runbook deployment bản web

## 1. Phạm vi và kiến trúc runtime

QIChing Web là static SPA React/TypeScript. `npm run build` tạo thư mục `dist/`; Cloudflare
Pages chỉ phân phối HTML, CSS, JavaScript và dữ liệu tĩnh trong thư mục này. Ứng dụng không có
backend, API nghiệp vụ, database server hay biến môi trường runtime.

Dữ liệu người dùng được lưu bằng `localStorage` trong trình duyệt. Vì `localStorage` bị giới hạn
theo origin, mỗi domain là một kho dữ liệu độc lập. Ứng dụng hiện có export/import JSON cho quẻ
theo thời gian; dữ liệu Coin Casting chưa tham gia cơ chế sao lưu này.

Ngoại lệ đối với mô hình "tự chứa hoàn toàn": stylesheet hiện tải Google Fonts từ
`fonts.googleapis.com`/`fonts.gstatic.com`. Logic nghiệp vụ vẫn chạy hoàn toàn phía client, nhưng
font cần mạng nếu chưa có trong cache.

## 2. Hạ tầng Cloudflare Pages hiện hành

Hai môi trường là hai Pages project độc lập:

| Môi trường | Pages project | Domain sử dụng | Domain kỹ thuật | Lệnh tiện ích hiện có |
|---|---|---|---|---|
| UAT | `qiching-uat` | `https://uat.qiching.org` | `https://qiching-uat.pages.dev` | `npm run deploy:uat` |
| Production | `qiching` | `https://qiching.org` | `https://qiching.pages.dev` | `npm run deploy:prod` |

`www.qiching.org` cũng đang trỏ vào production. Domain chuẩn phải là
`https://qiching.org`; xem chính sách redirect ở mục 8.

Hai project đều có `Git Provider: No`. Cơ chế hiện tại là **Direct Upload bằng Wrangler từ máy
chạy lệnh**, không phải Cloudflare tự build khi `git push`. Hai script trong `package.json` build
lại `dist/`, rồi chạy tương đương:

```bash
wrangler pages deploy dist --project-name=PROJECT_NAME --branch=main
```

`--branch=main` chọn production environment bên trong từng Pages project. Nó không chứng minh
working tree thực sự đang checkout nhánh `main`, cũng không chứng minh artifact được tạo từ commit
mà Cloudflare hiển thị.

Có thể kiểm tra trạng thái ngoài Cloudflare bằng CLI cục bộ của dự án:

```bash
npx wrangler pages project list
npx wrangler pages deployment list --project-name=qiching-uat
npx wrangler pages deployment list --project-name=qiching
```

## 3. Ảnh chụp trạng thái đã xác minh

Trạng thái sau chỉ là bằng chứng audit tại ngày **2026-09-02**, không phải cấu hình cố định:

| Môi trường | Source SHA Cloudflare hiển thị | Deployment ID | Trạng thái cần lưu ý |
|---|---|---|---|
| UAT | `60311e2` | `2f439666-eacd-456c-81b1-bdfda2476f0d` | Artifact đang phục vụ **không khớp** build sạch của SHA này — vẫn tái lập đúng blocker ở mục 4: deploy bằng `npm run deploy:uat` trong lúc working tree có thay đổi chưa commit, commit đó (`b2e314a`) chỉ được tạo *sau* khi đã deploy |
| Production | `b2e314a` | `2df24f42-a718-4cdb-9ab9-55ff638e7074` | Artifact **khớp** build sạch của SHA này (kiểm chứng lại được bằng cách build lại `b2e314a` rồi so tên file asset — xem bảng mục 4) |

Theo ghi chép của người phát hành, lần upload production này đi đúng quy trình mục 6: build một lần
từ `main` (đã khớp `origin/main`, working tree sạch), ghi checksum `dist/`, đối chiếu với artifact đã
kiểm thử trên UAT rồi upload bằng `wrangler ... --commit-hash=b2e314a`. Lưu ý repo **không** lưu
manifest/checksum của lần phát hành (xem mục 9), nên phần "đã đối chiếu checksum" không tự kiểm chứng
lại được từ repo — thứ kiểm chứng được là tên file asset đang phục vụ so với build lại từ SHA.

Các endpoint chính, asset tĩnh và SPA fallback đều trả HTTP 200 tại thời điểm audit. Build hiện
tại cũng vượt ngưỡng cảnh báo chunk 500 kB của Vite; đây là việc tối ưu hiệu năng, không phải lỗi
deploy.

Rút ra từ lần phát hành này: đi đúng quy trình thủ công ở mục 6 (build một lần, ghi checksum, upload
bằng `wrangler ... --commit-hash=FULL_SHA` thay vì script tiện ích) cho ra provenance đúng như kỳ
vọng. Bản thân `deploy:uat`/`deploy:prod` trong `package.json` thì chưa đổi gì — vẫn là lệnh tiện ích
nhanh cho mục đích xem trước, không phải release gate; xem mục 4.

## 4. Blocker: provenance của artifact

Quy trình hiện tại cho phép deploy working tree có thay đổi chưa commit nhưng vẫn gắn deployment
với SHA của `HEAD` và nhãn branch `main`. Audit ngày 2026-09-02 lại tái lập được sai lệch này trên
UAT (xem mục 3): `npm run deploy:uat` chạy lúc working tree có thay đổi chưa commit, commit tương
ứng (`b2e314a`) chỉ xuất hiện sau đó. Đối chiếu bằng build lại thật (`git worktree` tại từng SHA →
`npm ci` → `npm run build`):

| Môi trường | Source SHA Cloudflare hiển thị | Asset đang phục vụ | Asset từ build sạch của SHA được ghi | Asset từ build sạch của SHA khác |
|---|---|---|---|---|
| UAT | `60311e2` | `index-DvF2yFCD.js`, `index-BKmrAyUy.css` | `index-bd924_4L.js`, `index-B_XYWNC8.css` (**không khớp**) | `b2e314a` → `index-DvF2yFCD.js`, `index-BKmrAyUy.css` (**khớp**) |

Nói cách khác: Cloudflare ghi UAT là `60311e2`, nhưng nội dung đang phục vụ thật sự là bản build của
`b2e314a`. Do đó không được dùng Source SHA trên Cloudflare làm bằng chứng duy nhất để audit hoặc
rollback những deployment hiện có — luôn đối chiếu bằng checksum/tên file asset thật sự đang phục vụ.

Trước lần phát hành production tiếp theo, quy trình bắt buộc phải bảo đảm:

1. Working tree sạch; source và tài liệu cần phát hành đều đã commit.
2. Commit đã được push. Production chỉ phát hành commit đã duyệt trên `main` và khớp
   `origin/main`.
3. Chạy lint, test và build thành công trước khi upload.
4. Ghi lại full Git SHA, deployment ID và checksum của `dist/`.
5. Artifact đã kiểm thử trên UAT phải là chính artifact đưa lên production; không sửa source hoặc
   build lại bằng dependency/runtime khác ở giữa hai bước.

Các script `deploy:uat`/`deploy:prod` hiện chỉ là lệnh tiện ích và **chưa phải release gate đầy
đủ**: chúng build lại, không chạy lint/test, không chặn dirty tree và không kiểm tra nhánh. Cần sửa
script hoặc bổ sung release script/CI riêng; chỉ đặt metadata `--commit-dirty=false` không thay thế
được việc kiểm tra Git thật.

## 5. Yêu cầu môi trường build

- **Node.js >= 22.12.0**. Đây là giao của yêu cầu Vite 8 và Wrangler 4; nên pin một bản Node LTS
  cụ thể trong `package.json#engines` và `.nvmrc`/`.node-version`.
- Cài dependency từ lockfile bằng `npm ci` cho build/release tái lập.
- Xác thực Cloudflare cho Wrangler (`npx wrangler whoami`). Credential chỉ phục vụ deploy, không
  được nhúng vào bundle hoặc commit vào Git.
- Trình duyệt đích phải hỗ trợ JavaScript hiện đại, Web Worker và `localStorage`.

Ứng dụng hiện không cần `.env` để chạy. Nếu sau này thêm biến `VITE_*`, phải nhớ rằng giá trị đó
được nhúng công khai vào JavaScript khi build và không được dùng để chứa secret.

## 6. Quy trình phát hành

Luồng chuẩn:

```text
Commit sạch đã push
        ↓
npm ci → lint → test → build một lần
        ↓
ghi SHA + checksum dist/
        ↓
upload UAT → smoke test/nghiệm thu
        ↓ giữ nguyên artifact
upload production → smoke test
```

### 6.1. Chuẩn bị và kiểm tra

```bash
git status --short
git branch --show-current
git rev-parse HEAD
npm ci
npm run lint
npm test
npm run build
shasum -a 256 dist/index.html dist/assets/*
```

`git status --short` phải không có output. Với production, branch phải là `main` và SHA phải khớp
commit đã duyệt trên remote. Lưu output checksum cùng thông tin release.

Tại lần audit gần nhất, các gate trên working tree khi đó đều đạt: build thành công, lint sạch và
63/63 test trong 8 test file đạt. Kết quả này không thay thế việc chạy lại gate cho release mới.

### 6.2. Upload UAT

Để giữ đúng một artifact, sau bước build nên upload trực tiếp `dist/` thay vì gọi script tiện ích
đang build lại. Thay `FULL_GIT_SHA` bằng SHA đầy đủ đã ghi ở bước chuẩn bị:

```bash
npx wrangler pages deploy dist \
  --project-name=qiching-uat \
  --branch=main \
  --commit-hash=FULL_GIT_SHA
```

Không sửa source hoặc `dist/` sau khi upload. Thực hiện checklist mục 7 và chỉ tiếp tục khi UAT
được nghiệm thu.

### 6.3. Upload production

Upload nguyên `dist/` đã kiểm thử trên UAT:

```bash
npx wrangler pages deploy dist \
  --project-name=qiching \
  --branch=main \
  --commit-hash=FULL_GIT_SHA
```

Ghi deployment ID, Git SHA và checksum artifact vào biên bản/release note, rồi chạy lại toàn bộ
smoke test trên domain production.

## 7. Checklist smoke test

### Tự động/từ terminal

- Domain chính trả HTTP 200.
- `favicon.svg`, JavaScript, CSS và Web Worker được tham chiếu từ `index.html` đều tải được.
- Một đường dẫn không tồn tại trên server trả về SPA shell thay vì lỗi 404.
- Deployment mới nhất trong `wrangler pages deployment list` có đúng project và SHA dự kiến.

Ví dụ kiểm tra tối thiểu:

```bash
curl -fsS https://uat.qiching.org/ > /dev/null
curl -fsS https://uat.qiching.org/favicon.svg > /dev/null
curl -fsS https://qiching.org/ > /dev/null
curl -fsS https://qiching.org/favicon.svg > /dev/null
```

### Trên trình duyệt

- Mở các màn hình chính và xác nhận không có lỗi console.
- An quẻ và xem kết quả end-to-end.
- Chạy “Tìm ngày tốt” để kiểm tra Web Worker.
- Lưu một quẻ, reload trang và xác nhận dữ liệu còn trong `localStorage`.
- Kiểm tra export/import JSON cho quẻ theo thời gian; không kỳ vọng dữ liệu Coin Casting được chuyển.
- Kiểm tra viewport desktop và mobile quan trọng.
- Production phải hiển thị đúng bản vừa nghiệm thu trên UAT.

## 8. Canonical origin và dữ liệu người dùng

Domain chuẩn của production là `https://qiching.org`. Cần cấu hình redirect vĩnh viễn
`https://www.qiching.org/*` sang `https://qiching.org/*` trong Cloudflare và kiểm tra lại bằng HTTP
status/`Location`. `qiching.pages.dev` chỉ là endpoint kỹ thuật, không nên phát cho người dùng như
URL chính.

Nếu không redirect, dữ liệu đã lưu ở `qiching.org`, `www.qiching.org` và `qiching.pages.dev` không
nhìn thấy nhau vì đây là ba origin khác nhau. UAT là origin tách biệt theo chủ đích; không dùng dữ
liệu UAT làm bằng chứng rằng production đã lưu đúng.

## 9. Rollback và khôi phục

1. Dừng các deployment tiếp theo và ghi nhận lỗi, deployment ID, SHA và thời điểm phát hiện.
2. Xem lịch sử bằng `wrangler pages deployment list --project-name=PROJECT_NAME`.
3. Chọn deployment production gần nhất đã biết là tốt và dùng chức năng rollback trong Cloudflare
   Pages dashboard. Nếu có artifact đã lưu và kiểm chứng, có thể upload lại artifact đó.
4. Chạy lại smoke test trên domain chính sau rollback.
5. Không suy ra nội dung artifact chỉ từ SHA đối với các deployment cũ đã nêu ở mục 4.

Hiện repo chưa lưu artifact release hay manifest checksum. Đây là khoảng trống cần khắc phục để
rollback độc lập với dashboard và có thể đối chiếu chính xác nội dung đã phát hành.

## 10. Security, cache và khả năng offline

Repo hiện chưa có `public/_headers` hay cấu hình hosting tương đương. Live response có một số
header mặc định của Cloudflare như `X-Content-Type-Options` và `Referrer-Policy`, nhưng chưa có
policy được version hóa trong repo.

Các việc cần thực hiện và kiểm thử riêng trước khi áp dụng production:

- khai báo security headers phù hợp, gồm CSP, HSTS, chống nhúng frame và Permissions Policy;
- đặt cache dài hạn/`immutable` cho asset có content hash trong `assets/`, nhưng để `index.html`
  revalidate nhằm tránh giữ HTML trỏ tới asset cũ;
- ghi lại redirect/domain rule đang nằm trên Cloudflare dashboard;
- nếu giữ Google Fonts, CSP phải cho phép đúng hai origin font; ưu tiên self-host font nếu cần giảm
  phụ thuộc mạng và tăng riêng tư;
- nếu thêm PWA/service worker, kiểm thử chiến lược update và cache để không giữ phiên bản cũ sau
  release.

## 11. Ghi chú khi thay đổi nền tảng

`vite.config.ts` hiện dùng `base="/"` mặc định, đúng với các custom domain và `pages.dev` ở root.
Cloudflare Pages cũng đang cung cấp SPA fallback khi không có file `404.html` riêng.

Nếu chuyển sang GitHub Pages ở subpath, phải thay `base`, bổ sung workflow publish và kiểm thử lại
deep-link/404 fallback. Đây không phải cấu hình của hệ thống đang chạy hiện nay.
