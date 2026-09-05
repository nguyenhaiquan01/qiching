import { Link } from "react-router";

/** Bài hướng dẫn "Nạp Giáp" — nội dung nguồn:
 * `legacy/project-brain/drafts-huong-dan/01-nap-giap.md` (BẢN NHÁP, chưa qua domain review). */
export function HuongDanNapGiap() {
  return (
    <>
      <div className="the">
        <h2>Nạp Giáp là gì? Cách gán Địa Chi vào quẻ Kinh Dịch theo Kinh Phòng</h2>
        <p>
          Nếu chỉ đọc Thoán Từ và Hào Từ của một quẻ, bạn đang đọc quẻ theo lối <strong>nghĩa
          lý</strong> — cách hiểu Kinh Dịch qua văn bản triết học, kiểu Chu Dịch mà Khổng Tử và các
          nhà chú giải đời sau (Trình Di, Chu Hy...) truyền lại. Nhưng khi người xưa <strong>bốc quẻ
          để đoán việc</strong> (hỏi hôm nay có nên xuất hành, việc này có thành hay không), họ dùng
          một hệ thống khác hẳn: <strong>Bốc Dịch</strong>, hay còn gọi Lục Hào — nơi mỗi hào của quẻ
          được gán một Địa Chi và một vai trò Lục Thân, rồi luận đoán bằng quan hệ sinh khắc Ngũ Hành
          giữa các hào đó với ngày tháng hiện tại. <strong>Nạp Giáp</strong> chính là bước đầu tiên và
          là nền tảng của toàn bộ hệ thống này.
        </p>
      </div>

      <div className="the">
        <h2>Nguồn gốc: từ Kinh Phòng đến Tăng San Bốc Dịch</h2>
        <p>
          Phép Nạp Giáp được cho là do <strong>Kinh Phòng</strong> (京房, thời Tây Hán) sáng lập, gán
          Thiên Can và Địa Chi vào từng hào của 64 quẻ để có thể dùng lý Ngũ Hành sinh khắc mà đoán
          việc — thay vì chỉ dựa vào lời quẻ. Đây là bước ngoặt biến Kinh Dịch từ một hệ thống triết
          lý thuần túy thành một công cụ chiêm bốc thực hành, với quy tắc rõ ràng, có thể kiểm tra
          lại.
        </p>
        <p>
          Đến đời Thanh, <strong>Dã Hạc Lão Nhân</strong> (野鶴老人) hệ thống hoá lại toàn bộ cách
          luận Bốc Dịch — bao gồm Nạp Giáp, cách xác định Dụng Thần, các loại thần sát, và rất nhiều
          án lệ thực tế — trong bộ sách <strong>Tăng San Bốc Dịch</strong> (增删卜易, "Bốc Dịch được
          tăng bổ và cắt gọt"). Đây là một trong những tài liệu nền tảng mà người học Bốc Dịch ngày
          nay vẫn tham khảo, vì sách không chỉ nêu quy tắc mà còn giảng qua rất nhiều ví dụ đoán việc
          thật.
        </p>
        <p>
          Điểm cần nói rõ ngay: Nạp Giáp là một <strong>hệ thống riêng</strong>, tách biệt với văn
          bản Thoán Từ/Hào Từ theo nghĩa lý. Một quẻ có thể có Thoán Từ nói về "hanh thông", nhưng
          phần Nạp Giáp/Lục Thân của quẻ đó khi đối chiếu với ngày giờ hỏi việc lại cho ra kết quả
          khác — vì hai hệ thống trả lời hai câu hỏi khác nhau: nghĩa lý nói về đạo lý tổng quát của
          quẻ, Bốc Dịch nói về việc cụ thể bạn đang hỏi vào đúng thời điểm bạn hỏi.
        </p>
      </div>

      <div className="the">
        <h2>Vì sao gọi là "Nạp Giáp"?</h2>
        <p>
          <strong>Giáp</strong> (甲) là can đầu tiên trong Thập Thiên Can. <strong>Nạp</strong> nghĩa
          là đưa vào, gán vào. "Nạp Giáp" — theo nghĩa hẹp là "đưa can Giáp vào quẻ Càn", quẻ đứng
          đầu trong 8 quẻ đơn — được dùng làm tên gọi chung cho toàn bộ phép gán Can Chi vào 8 quẻ đơn
          của Kinh Phòng, dù phần vận dụng thực tế trong luận đoán chủ yếu xoay quanh <strong>Địa
          Chi</strong> chứ không phải Thiên Can.
        </p>
        <p>
          Đây cũng là điều bạn sẽ thấy nếu dùng công cụ QIChing: phần "Nạp Giáp" hiển thị cho mỗi hào
          chỉ gồm Lục Thân + Địa Chi + Ngũ Hành (ví dụ "Tử Tôn Tý Thủy"), không có Thiên Can. Điều này
          khớp với thực hành phổ biến của Bốc Dịch hiện đại: Thiên Can là quy ước lịch sử để gọi tên
          phép Nạp Giáp, còn phần thực sự dùng để tính sinh khắc, vượng suy với ngày/tháng là Địa Chi.
        </p>
      </div>

      <div className="the">
        <h2>Mỗi quẻ đơn nạp một dãy Địa Chi cố định</h2>
        <p>
          64 quẻ Kinh Dịch đều được ghép từ 2 trong 8 quẻ đơn (nội quái ở dưới — hào 1-3, ngoại quái
          ở trên — hào 4-6). Với mỗi quẻ đơn trong 8 quẻ đơn (Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn,
          Khôn), có một dãy 6 Địa Chi cố định gán sẵn cho hào 1 đến hào 6 khi quẻ đơn đó xuất hiện
          (dãy này vốn được định nghĩa đầy đủ cho trường hợp quẻ thuần — quẻ đơn đó lặp lại ở cả nội
          lẫn ngoại — rồi áp dụng nửa tương ứng khi quẻ đơn đó chỉ nằm ở nội hoặc ngoại của một quẻ
          ghép khác). Ghép Địa Chi với Ngũ Hành của nó, so với Ngũ Hành của Cung mà quẻ thuộc về, ta
          tính ra được vai trò <strong>Lục Thân</strong> của từng hào (xem bài kế).
        </p>
      </div>

      <div className="the">
        <h2>Ví dụ: quẻ Thuần Càn (☰☰), Cung Càn</h2>
        <p>
          Quẻ Thuần Càn — nội quái và ngoại quái đều là Càn, đồng thời cũng là quẻ đứng đầu Cung Càn
          — là ví dụ kinh điển nhất để minh hoạ Nạp Giáp:
        </p>
        <table className="bang-ket-qua">
          <thead>
            <tr>
              <th>Hào</th>
              <th>Địa Chi</th>
              <th>Ngũ Hành</th>
              <th>Lục Thân (so với Cung Càn — Kim)</th>
              <th>Thế/Ứng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>6 (trên cùng)</td>
              <td>Tuất</td>
              <td>Thổ</td>
              <td>Phụ Mẫu</td>
              <td>Thế</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Thân</td>
              <td>Kim</td>
              <td>Huynh Đệ</td>
              <td>—</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Ngọ</td>
              <td>Hỏa</td>
              <td>Quan Quỷ</td>
              <td>—</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Thìn</td>
              <td>Thổ</td>
              <td>Phụ Mẫu</td>
              <td>Ứng</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Dần</td>
              <td>Mộc</td>
              <td>Thê Tài</td>
              <td>—</td>
            </tr>
            <tr>
              <td>1 (dưới cùng)</td>
              <td>Tý</td>
              <td>Thủy</td>
              <td>Tử Tôn</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
        <p>
          Vị trí Thế/Ứng ở đây theo đúng quy tắc Bát Cung (Thuần Càn là quẻ mở đầu Cung Càn nên Thế
          đặt ở hào 6, Ứng cách 3 hào nên ở hào 3) — xem chi tiết ở bài{" "}
          <Link to="/huong-dan/the-ung">Thế Ứng</Link>.
        </p>
        <p>
          Từ bảng này, người luận quẻ đã có đủ dữ liệu để đi bước tiếp theo: biết hào nào là Dụng
          Thần ứng với câu hỏi của mình (xem bài <Link to="/huong-dan/luc-than">Lục Thân</Link>), rồi
          mới xét hào đó đang vượng hay suy theo ngày tháng hỏi việc.
        </p>
      </div>

      <div className="the">
        <h2>Vì sao Nạp Giáp quan trọng, không chỉ là chi tiết kỹ thuật</h2>
        <p>
          Nạp Giáp không phải là bước "cho có" — nó là điều kiện bắt buộc để làm hai việc mà cách đọc
          quẻ theo nghĩa lý không làm được:
        </p>
        <ol>
          <li>
            <strong>Xác định vai trò Lục Thân của từng hào</strong> (Phụ Mẫu, Huynh Đệ, Quan Quỷ, Thê
            Tài, Tử Tôn) — từ đó chọn đúng hào nào đại diện cho việc bạn đang hỏi (Dụng Thần).
          </li>
          <li>
            <strong>Xét vượng suy của hào đó theo Nhật–Nguyệt</strong> (ngày, tháng hỏi việc) — vì
            mỗi Địa Chi có quan hệ sinh, khắc, vượng, suy khác nhau với Địa Chi của ngày/tháng hiện
            tại.
          </li>
        </ol>
        <p>
          Đây đúng là phần QIChing tự tính cho mọi quẻ, không phải tra bảng thủ công — bạn có thể{" "}
          <Link to="/">thử gieo một quẻ</Link> và xem trực tiếp bảng Nạp Giáp mà công cụ tính ra.
        </p>
      </div>
    </>
  );
}
