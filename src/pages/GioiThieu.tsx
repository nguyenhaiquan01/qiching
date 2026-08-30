/** Trang "Giới thiệu" — port từ AboutBox. */
export function GioiThieu() {
  return (
    <div className="the">
      <h2>Giới thiệu</h2>
      <p>
        <strong>QIChing</strong> — công cụ an quẻ và luận giải quẻ Kinh Dịch theo phương pháp
        Mai Hoa Dịch Số, kết hợp lịch âm Việt Nam (Can Chi, Tiết Khí, Giờ Hoàng Đạo).
      </p>
      <p>
        Bản web này viết lại từ ứng dụng desktop gốc (C#/.NET Framework/WinForms, mã nguồn
        trong <code>legacy/</code>) thành static SPA — chạy hoàn toàn trong trình duyệt, không
        backend/database server. Dữ liệu tra cứu (64 quẻ, Nạp Giáp, Ngũ Hành, Nạp Âm...) đã
        đối chiếu trực tiếp với cơ sở dữ liệu gốc <code>KinhDich.sdf</code>.
      </p>
      <p>
        Quẻ đã lưu được giữ trong <code>localStorage</code> của trình duyệt (chỉ trên máy/trình
        duyệt này) — dùng tính năng xuất/nhập JSON ở trang "Quẻ đã lưu" nếu cần chuyển sang máy
        khác.
      </p>
    </div>
  );
}
