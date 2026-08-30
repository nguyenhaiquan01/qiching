# 06 – Deployment cho bản web (Static SPA)

## Đặc điểm cần cân nhắc khi chọn nơi deploy

- Đây là **ứng dụng cá nhân/nghiên cứu**, không phải sản phẩm thương mại nhiều người dùng đồng thời → không cần hạ tầng scale lớn.
- Sau khi đổi kiến trúc sang **static SPA** (xem `05-ke-hoach-migrate-web.md`) — không còn backend, không còn database server, không còn nhu cầu persistent storage phía server. Toàn bộ ứng dụng chỉ là **HTML/CSS/JS tĩnh** sau khi build (`npm run build`), và dữ liệu "quẻ đã lưu" nằm trong `localStorage` của trình duyệt người dùng, không phải trên server.
- Vì vậy bài toán deploy chỉ còn là: **host một thư mục file tĩnh**, không cần chọn nơi hỗ trợ .NET/Docker/volume nữa.

## Lựa chọn deploy

| Nơi deploy | Chi phí | Độ phức tạp setup | Ghi chú |
|---|---|---|---|
| **Cloudflare Pages** | Miễn phí | Rất thấp — kết nối repo Git, tự build & deploy mỗi lần push | **Khuyến nghị hàng đầu** — CDN toàn cầu, HTTPS tự động, không giới hạn băng thông đáng kể cho traffic cá nhân. |
| **GitHub Pages** | Miễn phí | Rất thấp — bật trong repo settings hoặc dùng GitHub Actions build rồi publish | Đơn giản nhất nếu code đã ở GitHub, không cần tài khoản dịch vụ thứ ba nào khác. |
| **Netlify** | Miễn phí (tier cá nhân) | Rất thấp — tương tự Cloudflare Pages | Tương đương Cloudflare Pages, UI thân thiện, có preview deploy cho mỗi PR. |
| **Self-host tại nhà** (Raspberry Pi/NAS + Cloudflare Tunnel) | Miễn phí | Trung bình | Không cần thiết nữa với static site — chỉ hợp lý nếu muốn kiểm soát tuyệt đối, không phụ thuộc dịch vụ ngoài. |

## Khuyến nghị

**Cloudflare Pages** (hoặc GitHub Pages nếu muốn tối giản tối đa số dịch vụ liên quan): kết nối repo Git, mỗi lần push lên nhánh chính → tự động `npm run build` → publish thư mục `dist/`. Không cần server, không cần Docker, không cần quản lý uptime/restart/volume.

## Kiến trúc deploy đề xuất

```
┌─────────────────────────────┐
│  Git push lên nhánh chính    │
└──────────────┬───────────────┘
               │ trigger tự động
               ▼
┌─────────────────────────────┐
│  Cloudflare Pages build      │
│   npm run build → dist/      │
└──────────────┬───────────────┘
               │ publish
               ▼
┌─────────────────────────────┐
│  CDN tĩnh (HTML/CSS/JS)      │
│  + logic an quẻ/lịch âm      │
│    chạy 100% trong trình     │
│    duyệt người dùng          │
│  + localStorage lưu quẻ đã   │
│    xem (trên máy người dùng) │
└──────────────┬───────────────┘
               ▲
               │ HTTPS (tự động)
               │
            Người dùng
```

Ưu điểm so với phương án backend cũ: **không server để vận hành/bảo trì**, chi phí **$0**, deploy chỉ là `git push`, không có khái niệm downtime/restart/cold-start vì không có process server nào chạy liên tục.

## Việc cần làm khi tới bước deploy (không làm ngay bây giờ)

- Cấu hình `vite.config.ts` với `base` path phù hợp nếu deploy vào subpath (ví dụ GitHub Pages dạng `username.github.io/repo`).
- Nối domain riêng (nếu có) vào Cloudflare Pages/Netlify — cấu hình DNS, HTTPS tự động cấp.
- Cân nhắc thêm PWA (service worker) để ứng dụng dùng được offline — hợp lý với kiến trúc static/client-side, không bắt buộc cho lần deploy đầu.
- Không cần backup dữ liệu phía server; nếu muốn, có thể thêm chức năng "export/import quẻ đã lưu ra file JSON" ở tầng ứng dụng để người dùng tự sao lưu `localStorage`.
</content>
</invoke>
