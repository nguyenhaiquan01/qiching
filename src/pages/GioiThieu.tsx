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
              <td>Mai Hoa Dịch Số hoặc gieo đồng xu</td>
            </tr>
            <tr>
              <th>Luận quẻ</th>
              <td>Lục Hào Nạp Giáp</td>
            </tr>
          </tbody>
        </table>
        <p>
          Khác với nhiều công cụ chỉ dừng ở việc tạo quẻ và lập Lục Hào, QIChing luận giải theo
          đúng <strong>Dụng Thần</strong> — Lục Thân đại diện cho việc bạn đang hỏi (công việc,
          tài lộc, con cái...) — rồi xét <strong>vượng suy</strong> của riêng hào đó theo
          Nhật–Nguyệt, sinh khắc Ngũ Hành, hào động và quẻ biến, thay vì chỉ đọc chung ý nghĩa cả
          quẻ.
        </p>
        <p>
          Trong quá trình luận quẻ, QIChing sử dụng các thông tin như Nạp Giáp, Lục Thân,
          Thế–Ứng, Nhật–Nguyệt, hào động và quẻ biến làm căn cứ diễn giải.
        </p>
        <p>
          QIChing hướng đến việc trình bày Dịch học theo cách rõ ràng, có căn cứ và dễ kiểm tra:
          người mới có thể tiếp cận ý nghĩa chính của quẻ, trong khi người nghiên cứu có thể xem
          các dữ liệu Lục Hào phía sau kết quả.
        </p>
      </div>

      <div className="the">
        <h2>Giới hạn &amp; mức độ tin cậy</h2>
        <p>
          Kết quả của QIChing dựa trên phương pháp Dịch học truyền thống (Mai Hoa Dịch Số, Lục
          Hào Nạp Giáp), <strong>chỉ để tham khảo và chiêm nghiệm</strong> — chưa được xác nhận
          bằng phương pháp khoa học, không thay thế tư vấn y tế, pháp lý hoặc tài chính, và không
          nên là căn cứ duy nhất cho các quyết định hệ trọng.
        </p>
        <p>
          Phần tính toán (Nạp Giáp, Lục Thân, Thế–Ứng, Tuần Không, vượng suy, quẻ biến...) đã được
          đối chiếu để cho ra cùng kết quả với phiên bản QIChing Desktop 2011. Việc khớp với bản
          2011 xác nhận tính nhất quán giữa hai phiên bản, <strong>không phải bằng chứng cho tính
          đúng đắn nghiệp vụ tuyệt đối</strong> — một số trường hợp nhiều hào động cùng lúc hiện
          chưa có nguồn đối chiếu độc lập bên ngoài QIChing.
        </p>
      </div>

      <div className="the">
        <h2>Nguồn nội dung 64 quẻ</h2>
        <p>
          Phần diễn giải văn bản (Thoán Từ, Hào Từ, Giảng...) của 64 quẻ đến từ ba bản dịch/giảng
          Kinh Dịch khác nhau, không phải do QIChing biên soạn:
        </p>
        <table className="bang-ket-qua">
          <tbody>
            <tr>
              <th>Phan Bội Châu</th>
              <td>
                <em>Quốc Văn Chu Dịch Diễn Giải</em>. Tác giả mất năm 1940 nên tác phẩm đã hết
                thời hạn bảo hộ — dùng làm bản mặc định hiển thị và được đưa vào chỉ mục tìm kiếm.
              </td>
            </tr>
            <tr>
              <th>Nguyễn Hiến Lê</th>
              <td>
                <em>Kinh Dịch — Đạo của người quân tử</em> (qua cohoc.net). Còn trong thời hạn bảo
                hộ (dự kiến tới khoảng 2034) — chỉ hiển thị khi người dùng tự chọn, không nằm
                trong nội dung được lập chỉ mục.
              </td>
            </tr>
            <tr>
              <th>Ngô Tất Tố</th>
              <td>
                <em>Kinh Dịch Trọn Bộ</em>. Xem như một lựa chọn diễn giải bổ sung khi người dùng
                tự chọn.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Mỗi trang chi tiết quẻ đều ghi rõ nguồn/tác giả của bản diễn giải đang xem ở cuối trang.
          Phần dữ liệu do QIChing tự tính (Nạp Giáp, Lục Thân, Thế–Ứng, Tuần Không, vượng suy...)
          là logic/phần mềm riêng, tách biệt khỏi ba bản văn bản nói trên.
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
              <td>Mai Hoa Dịch Số hoặc gieo đồng xu</td>
            </tr>
            <tr>
              <th>Phương pháp luận quẻ</th>
              <td>Lục Hào Nạp Giáp</td>
            </tr>
            <tr>
              <th>Bản quyền phần mềm</th>
              <td>© 2011–2026 Dr. Nguyen Hai Quan. All rights reserved. Áp dụng cho mã nguồn và
                logic tính toán QIChing — không áp dụng cho văn bản diễn giải 64 quẻ, xem mục
                "Nguồn nội dung 64 quẻ" ở trên.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="the">
        <h2>Góp ý &amp; đính chính</h2>
        <p>
          Mọi góp ý về QIChing, dữ liệu hoặc nội dung Dịch học đều được trân trọng — kể cả báo lỗi
          chính tả/OCR trong văn bản diễn giải hoặc sai sót trong phần tính toán. Lỗi được xác
          nhận sẽ được sửa trực tiếp trên trang liên quan, không lưu lịch sử đính chính riêng.
        </p>
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
