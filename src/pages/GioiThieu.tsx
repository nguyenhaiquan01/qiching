/** Trang "Giới thiệu" — port từ AboutBox. */
export function GioiThieu() {
  return (
    <>
      <div className="the">
        <h2>Giới thiệu</h2>
        <p>
          <strong>QIChing</strong> — công cụ hỗ trợ khởi quẻ, tra cứu và tham khảo luận giải Kinh
          Dịch, kết hợp các phương pháp Dịch học truyền thống với lịch pháp Việt Nam như Can Chi,
          Tiết Khí và giờ Hoàng Đạo.
        </p>
      </div>

      <div className="the">
        <h2>Phương pháp</h2>
        <table className="bang-ket-qua">
          <tbody>
            <tr>
              <th>Khởi quẻ</th>
              <td>Mai Hoa Dịch Số</td>
            </tr>
            <tr>
              <th>Luận quẻ</th>
              <td>Lục Hào Nạp Giáp</td>
            </tr>
          </tbody>
        </table>
        <p>
          Trong quá trình luận quẻ, QIChing sử dụng các thông tin như Nạp Giáp, Lục Thân,
          Thế–Ứng, Nhật–Nguyệt, hào động và quẻ biến; đồng thời xét quan hệ Ngũ Hành, sinh khắc và
          vượng suy để làm căn cứ diễn giải.
        </p>
        <p>
          QIChing hướng đến việc trình bày Dịch học theo cách rõ ràng, có căn cứ và dễ kiểm tra:
          người mới có thể tiếp cận ý nghĩa chính của quẻ, trong khi người nghiên cứu có thể xem
          các dữ liệu Lục Hào phía sau kết quả.
        </p>
      </div>

      <div className="the">
        <h2>Từ 2011 đến nay</h2>
        <p>
          QIChing được phát triển lần đầu dưới dạng ứng dụng desktop vào năm 2011 bởi Dr. Nguyen
          Hai Quan.
        </p>
        <p>
          Năm 2026, QIChing được xây dựng lại trên nền tảng web, kế thừa dữ liệu và logic từ phiên
          bản gốc nhằm mang lại trải nghiệm tra cứu, khởi quẻ và nghiên cứu Kinh Dịch thuận tiện
          hơn trên các thiết bị hiện đại.
        </p>
      </div>

      <div className="the">
        <h2>Quyền riêng tư &amp; dữ liệu</h2>
        <p>
          Các quẻ đã lưu được lưu cục bộ trên trình duyệt của bạn và không được gửi lên máy chủ.
          Bạn có thể xuất/nhập dữ liệu để sao lưu hoặc chuyển sang thiết bị khác.
        </p>
      </div>

      <div className="the">
        <h2>Thông tin sản phẩm</h2>
        <table className="bang-ket-qua">
          <tbody>
            <tr>
              <th>Sản phẩm</th>
              <td>QIChing</td>
            </tr>
            <tr>
              <th>Phiên bản</th>
              <td>QIChing Web 1.0.0</td>
            </tr>
            <tr>
              <th>Phương pháp khởi quẻ</th>
              <td>Mai Hoa Dịch Số</td>
            </tr>
            <tr>
              <th>Phương pháp luận quẻ</th>
              <td>Lục Hào Nạp Giáp</td>
            </tr>
            <tr>
              <th>Bản quyền</th>
              <td>© 2011–2026 Dr. Nguyen Hai Quan. All rights reserved.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="the">
        <h2>Góp ý &amp; liên hệ</h2>
        <p>Mọi góp ý về QIChing, dữ liệu hoặc nội dung Dịch học đều được trân trọng.</p>
        <p>
          Email: <a href="mailto:info@qiching.org">info@qiching.org</a>
        </p>
      </div>

      <div className="the">
        <h2>Thông tin kỹ thuật</h2>
        <p>
          QIChing Web được xây dựng lại từ ứng dụng QIChing Desktop nguyên bản trên C#/.NET
          Framework/WinForms (mã nguồn trong <code>legacy/</code>) thành ứng dụng web chạy trực
          tiếp trong trình duyệt.
        </p>
        <p>
          Các dữ liệu tra cứu như 64 quẻ, Nạp Giáp, Ngũ Hành và Nạp Âm đã được đối chiếu với cơ sở
          dữ liệu của phiên bản QIChing gốc.
        </p>
      </div>
    </>
  );
}
