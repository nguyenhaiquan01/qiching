import { Link } from "react-router";

/** Bài hướng dẫn "Thế Ứng" — nội dung nguồn:
 * `legacy/project-brain/drafts-huong-dan/03-the-ung.md` (BẢN NHÁP, chưa qua domain review). */
export function HuongDanTheUng() {
  return (
    <>
      <div className="the">
        <h2>Thế Ứng trong Bốc Dịch: hào nào là "bạn", hào nào là "đối tượng liên quan"</h2>
        <p>
          Một quẻ 6 hào có 6 vai trò Lục Thân (xem{" "}
          <Link to="/huong-dan/luc-than">bài trước</Link>), nhưng chỉ có đúng <strong>hai hào đặc
          biệt</strong> không đại diện cho một chủ đề (tiền, công danh, con cái...) mà đại diện cho{" "}
          <strong>hai bên</strong> trong chính sự việc bạn đang hỏi: <strong>Thế</strong> (世) — bản
          thân người hỏi/chủ thể sự việc, và <strong>Ứng</strong> (應) — đối tượng, hoàn cảnh, hoặc
          bên còn lại liên quan đến việc đó.
        </p>
      </div>

      <div className="the">
        <h2>Vị trí Thế không phải chọn tùy ý — nó cố định theo "Bát Cung"</h2>
        <p>
          Đây là điểm nhiều người mới học hay hiểu nhầm: Thế không phải là hào bạn tự chọn để "đại
          diện cho mình", mà là một vị trí <strong>cố định cho mỗi quẻ trong số 64 quẻ</strong>, theo
          cách sắp xếp cổ điển gọi là <strong>Bát Cung</strong> (8 cung) — chia 64 quẻ thành 8 nhóm 8
          quẻ, mỗi nhóm bắt đầu từ một quẻ thuần (Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài) rồi biến
          đổi dần từng hào một.
        </p>
        <p>Trong mỗi cung, vị trí Thế dịch chuyển theo đúng một quy luật 8 bước, không đổi giữa các cung:</p>
        <table className="bang-ket-qua">
          <thead>
            <tr>
              <th>Thứ tự trong cung</th>
              <th>Tên gọi</th>
              <th>Thế ở hào</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Bản cung (quẻ thuần)</td><td>6</td></tr>
            <tr><td>2</td><td>Nhất thế</td><td>1</td></tr>
            <tr><td>3</td><td>Nhị thế</td><td>2</td></tr>
            <tr><td>4</td><td>Tam thế</td><td>3</td></tr>
            <tr><td>5</td><td>Tứ thế</td><td>4</td></tr>
            <tr><td>6</td><td>Ngũ thế</td><td>5</td></tr>
            <tr><td>7</td><td>Du Hồn</td><td>4</td></tr>
            <tr><td>8</td><td>Quy Hồn</td><td>3</td></tr>
          </tbody>
        </table>
        <p>Ví dụ với <strong>Cung Càn</strong> (8 quẻ, dữ liệu đối chiếu trực tiếp với cơ sở dữ liệu gốc của QIChing):</p>
        <table className="bang-ket-qua">
          <thead>
            <tr>
              <th>Quẻ</th>
              <th>Vai trò trong cung</th>
              <th>Thế ở hào</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Càn Vi Thiên</td><td>Bản cung</td><td>6</td></tr>
            <tr><td>Thiên Phong Cấu</td><td>Nhất thế</td><td>1</td></tr>
            <tr><td>Thiên Sơn Độn</td><td>Nhị thế</td><td>2</td></tr>
            <tr><td>Thiên Địa Bĩ</td><td>Tam thế</td><td>3</td></tr>
            <tr><td>Phong Địa Quán</td><td>Tứ thế</td><td>4</td></tr>
            <tr><td>Sơn Địa Bác</td><td>Ngũ thế</td><td>5</td></tr>
            <tr><td>Hỏa Địa Tấn</td><td>Du Hồn</td><td>4</td></tr>
            <tr><td>Hỏa Thiên Đại Hữu</td><td>Quy Hồn</td><td>3</td></tr>
          </tbody>
        </table>
        <p>
          7 cung còn lại (Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài) theo đúng cùng một quy luật 8 bước
          này, chỉ khác quẻ thuần khởi đầu.
        </p>
      </div>

      <div className="the">
        <h2>Ứng luôn cách Thế đúng 3 hào</h2>
        <p>
          Một khi biết Thế ở hào nào, Ứng được suy ra ngay — luôn nằm cách Thế đúng 3 vị trí trên
          vòng 6 hào:
        </p>
        <table className="bang-ket-qua">
          <thead>
            <tr>
              <th>Thế ở hào</th>
              <th>Ứng ở hào</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>4</td></tr>
            <tr><td>2</td><td>5</td></tr>
            <tr><td>3</td><td>6</td></tr>
            <tr><td>4</td><td>1</td></tr>
            <tr><td>5</td><td>2</td></tr>
            <tr><td>6</td><td>3</td></tr>
          </tbody>
        </table>
        <p>Không có ngoại lệ — quy tắc này áp dụng cho mọi quẻ trong cả 8 cung.</p>
      </div>

      <div className="the">
        <h2>Ý nghĩa khi luận đoán</h2>
        <ul>
          <li>
            <strong>Thế</strong> đại diện cho bản thân người xem quẻ, hoặc chủ thể chính của sự việc
            đang hỏi (ví dụ hỏi về công ty của mình thì Thế đại diện công ty đó).
          </li>
          <li>
            <strong>Ứng</strong> đại diện cho đối tượng liên quan: người kia trong quan hệ, đối tác,
            đối thủ, khách hàng, sự việc bên ngoài — tùy câu hỏi cụ thể.
          </li>
        </ul>
        <p>
          Khi luận đoán, người xem thường xét quan hệ sinh khắc giữa Thế và Ứng để biết chiều hướng
          quan hệ giữa hai bên: Ứng sinh Thế hoặc Thế khắc Ứng thường được xem là thuận lợi cho người
          hỏi hơn là chiều ngược lại — nhưng đây chỉ là một lớp thông tin, luôn phải xét cùng vượng
          suy của Dụng Thần (hào đại diện chủ đề câu hỏi, xem bài{" "}
          <Link to="/huong-dan/luc-than">Lục Thân</Link>) chứ không dùng riêng lẻ.
        </p>
      </div>

      <div className="the">
        <h2>Vì sao bài này tách khỏi phần đọc Thoán Từ/Hào Từ</h2>
        <p>
          Cũng như Nạp Giáp và Lục Thân, Thế Ứng thuộc hệ thống Bốc Dịch (Kinh Phòng, được Dã Hạc Lão
          Nhân hệ thống hoá lại trong Tăng San Bốc Dịch) — một hệ thống tính toán để chiêm bốc việc
          cụ thể. Nó độc lập với phần văn bản Thoán Từ/Hào Từ theo nghĩa lý mà bạn thấy ở{" "}
          <Link to="/64-que">trang tra cứu 64 quẻ</Link>: một quẻ có thể có Thoán Từ nói về đạo lý
          tổng quát, trong khi vị trí Thế/Ứng của chính quẻ đó lại đến từ một lớp quy tắc hoàn toàn
          khác, phục vụ một mục đích khác. QIChing hiển thị rõ Thế/Ứng cho từng lần gieo quẻ thật ở
          khối "Chi tiết Lục Hào" — <Link to="/">thử gieo một quẻ</Link> để xem trực tiếp trên quẻ
          của bạn.
        </p>
      </div>
    </>
  );
}
