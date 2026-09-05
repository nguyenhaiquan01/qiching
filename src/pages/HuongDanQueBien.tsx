import { Link } from "react-router";

/** Bài hướng dẫn "Quẻ biến/Hào động" — nội dung nguồn:
 * `legacy/project-brain/drafts-huong-dan/04-que-bien-hao-dong.md` (BẢN NHÁP, chưa qua domain
 * review). */
export function HuongDanQueBien() {
  return (
    <>
      <div className="the">
        <h2>Hào động và Quẻ biến trong Lục Hào là gì? (Không phải Thể/Dụng của Mai Hoa Dịch Số)</h2>
        <p>
          Khi gieo một quẻ, không phải hào nào cũng "đứng yên". Một hoặc nhiều hào có thể{" "}
          <strong>động</strong> — tức đổi từ Dương sang Âm hoặc từ Âm sang Dương — tạo ra một quẻ thứ
          hai gọi là <strong>quẻ biến</strong>, bên cạnh quẻ ban đầu (<strong>quẻ chủ</strong>). Đây
          là khái niệm gốc rất cổ của Kinh Dịch, có từ chính phép bói bằng cỏ thi mô tả trong Hệ Từ
          Truyện (nơi phân biệt hào "lão" — hào đã biến động tới cùng, sẽ đổi — với hào "thiếu" — hào
          còn non, giữ nguyên), chứ không phải khái niệm riêng của Bốc Dịch.
        </p>
      </div>

      <div className="the">
        <h2>Cảnh báo quan trọng: đừng nhầm với Thể/Dụng của Mai Hoa Dịch Số</h2>
        <p>
          Đây là điểm rất dễ nhầm khi đọc tài liệu trên mạng, vì nhiều bài viết gộp chung hai phương
          pháp khác nhau: <strong>Mai Hoa Dịch Số</strong> đọc quẻ biến theo khung{" "}
          <strong>Thể/Dụng</strong> (Thể là phần không biến — đại diện chủ thể; Dụng là phần liên
          quan đến sự việc, thường là phần chứa hào động), rồi xét sinh khắc giữa Thể và Dụng. Đây là
          một hệ thống lý luận khác, tách biệt với <strong>Thế/Ứng</strong> của Lục Hào Bốc Dịch (xem
          bài <Link to="/huong-dan/the-ung">Thế Ứng</Link>) — hai cặp khái niệm này{" "}
          <strong>không thể dùng lẫn cho nhau</strong>, dù cùng nói về "quẻ biến". Bài này chỉ nói về
          cách đọc quẻ biến trong khung Lục Hào Nạp Giáp — đúng phương pháp mà QIChing dùng để luận
          giải.
        </p>
      </div>

      <div className="the">
        <h2>Hào động được xác định thế nào?</h2>
        <p>Cách xác định hào nào đang động khác nhau tuỳ phương pháp gieo quẻ:</p>
        <ul>
          <li>
            <strong>Ba đồng xu (đúng phương pháp Bốc Dịch cổ điển)</strong> — mỗi hào được gieo độc
            lập bằng 3 đồng xu. Ba mặt ngửa (hoặc ba mặt sấp, tùy quy ước) cho ra hào "lão" — đây là
            hào <strong>động</strong>, sẽ đổi Âm↔Dương ở quẻ biến; hai kết quả còn lại cho hào
            "thiếu" — đứng yên. Vì gieo độc lập cho cả 6 hào, một lần gieo có thể ra từ 0 đến 6 hào
            động cùng lúc.
          </li>
          <li>
            <strong>Theo thời gian (Mai Hoa Dịch Số)</strong> — thay vì gieo đồng xu, hào động được
            suy ra bằng công thức từ chính thời điểm hỏi quẻ (ngày/giờ), luôn cho ra đúng{" "}
            <strong>một</strong> hào động. Đây là cách QIChing dùng ở nhánh "Theo thời gian".
          </li>
        </ul>
        <p>
          QIChing hỗ trợ cả hai cách gieo (xem <Link to="/">trang chủ</Link>); dù theo cách nào, một
          khi đã biết hào nào động, cách đọc quẻ biến trong khung Lục Hào là như nhau.
        </p>
      </div>

      <div className="the">
        <h2>Vì sao quẻ biến quan trọng: hào biến ảnh hưởng ngược lại hào động</h2>
        <p>
          Trong khung Lục Hào Bốc Dịch, hào động không chỉ "đổi dấu" cho vui — Ngũ Hành của hào đó{" "}
          <strong>sau khi biến</strong> (ở quẻ biến) có quan hệ sinh hoặc khắc với chính hào đó{" "}
          <strong>trước khi biến</strong> (ở quẻ chủ), và quan hệ này làm tăng hoặc giảm lực của hào
          gốc:
        </p>
        <ul>
          <li>
            Nếu Ngũ Hành hào biến <strong>sinh</strong> cho Ngũ Hành hào gốc — hào gốc được tiếp thêm
            lực, thường được xem là tín hiệu thuận lợi hơn.
          </li>
          <li>
            Nếu Ngũ Hành hào biến <strong>khắc</strong> hào gốc — hào gốc bị hao tổn lực, thường được
            xem là bất lợi hơn.
          </li>
        </ul>
        <p>
          Đây chính là phần QIChing đã tính vào công thức: điểm vượng suy của mỗi hào không chỉ dựa
          vào Ngũ Hành ngày, Ngũ Hành tháng và bản thân hào đó, mà còn cộng thêm ảnh hưởng từ Ngũ Hành
          của hào tương ứng bên quẻ biến — đúng nguyên tắc trên, không phải chỉ hiển thị quẻ biến cho
          có.
        </p>
      </div>

      <div className="the">
        <h2>Không phải hào nào biến cũng đáng chú ý như nhau</h2>
        <p>
          Nếu quẻ có nhiều hào động cùng lúc (thường gặp khi gieo bằng ba đồng xu), điều đáng quan
          tâm nhất trong một lần hỏi việc là: <strong>hào Dụng Thần của bạn</strong> (hào đại diện
          đúng chủ đề câu hỏi — xem bài <Link to="/huong-dan/luc-than">Lục Thân</Link>) có nằm trong
          số hào động hay không, và nếu có, nó biến theo hướng sinh hay khắc cho chính nó. Đọc toàn
          bộ 6 hào biến cùng lúc mà không quy về đúng Dụng Thần dễ dẫn tới nhận định dàn trải, không
          đúng trọng tâm câu hỏi.
        </p>
        <p>
          <Link to="/">Thử gieo một quẻ</Link> để xem quẻ biến và ảnh hưởng của nó lên điểm vượng suy
          của chính quẻ bạn vừa gieo.
        </p>
      </div>
    </>
  );
}
