import { Link } from "react-router";

/** Bài hướng dẫn "Ứng Kỳ" — nội dung nguồn:
 * `legacy/project-brain/drafts-huong-dan/06-ung-ky.md` (BẢN NHÁP, chưa qua domain review — bài này
 * KHÔNG đối chiếu được với code QIChing vì app chưa tính Ứng Kỳ tự động). */
export function HuongDanUngKy() {
  return (
    <>
      <div className="the">
        <h2>Ứng Kỳ: Quẻ báo cát hung rồi, nhưng bao giờ việc mới xảy ra?</h2>
        <p>
          Một quẻ Lục Hào có thể cho biết việc bạn hỏi sẽ thuận hay trắc trở, thông qua vượng suy và
          sinh khắc của hào Dụng Thần (xem bài <Link to="/huong-dan/luc-than">Lục Thân</Link>). Nhưng
          biết "sẽ ra sao" chưa trả lời được câu hỏi mà hầu như ai xem quẻ cũng hỏi tiếp: <strong>bao
          giờ?</strong> Phần luận đoán riêng để trả lời câu này gọi là <strong>Ứng Kỳ</strong>{" "}
          (應期) — kỳ hạn ứng nghiệm. Trong hệ Bốc Dịch mà Dã Hạc Lão Nhân hệ thống hoá lại trong{" "}
          <strong>Tăng San Bốc Dịch</strong>, Ứng Kỳ được xem là một trong những phần khó và dễ sai
          nhất, vì nó không dùng một công thức cố định duy nhất mà phải kết hợp nhiều lớp thông tin
          của cùng một hào.
        </p>
      </div>

      <div className="the">
        <h2>Nguyên tắc gốc: hào động chờ Hợp, hào tĩnh chờ Xung</h2>
        <p>
          Nguyên tắc thường được nhắc tới đầu tiên khi nói về Ứng Kỳ dựa trên việc hào đang{" "}
          <strong>động</strong> hay <strong>tĩnh</strong> (xem bài{" "}
          <Link to="/huong-dan/que-bien">Quẻ biến/Hào động</Link>):
        </p>
        <ul>
          <li>
            Một hào đã <strong>động</strong> — tức đã ở trạng thái chuyển biến — thường được xem là
            ứng vào đúng ngày hoặc tháng có Chi <strong>hợp</strong> với Chi của hào đó, vì Hợp làm
            hào động "dừng lại", đi tới một kết quả cụ thể.
          </li>
          <li>
            Một hào đang <strong>tĩnh</strong> — chưa có gì chuyển biến — thường phải chờ đến ngày
            hoặc tháng có Chi <strong>xung</strong> với Chi của hào đó mới bị kích hoạt (gọi là "ám
            động"), và đó thường là lúc sự việc thực sự bắt đầu hoặc xảy ra.
          </li>
        </ul>
        <p>
          Đây là nguyên tắc định hướng chung, không phải quy tắc áp dụng máy móc cho mọi trường hợp —
          nhiều tài liệu Bốc Dịch còn xét thêm cả ngày <strong>trị</strong> (ngày mang đúng Chi của
          hào đó) như một mốc ứng kỳ khả dĩ khác, tuỳ theo hào đó vượng hay suy tại thời điểm xem
          quẻ.
        </p>
      </div>

      <div className="the">
        <h2>Vượng suy quyết định việc xảy ra nhanh hay chậm</h2>
        <p>
          Bên cạnh Hợp/Xung, mức độ vượng suy của hào (theo Ngũ Hành ngày, tháng — xem bài{" "}
          <Link to="/huong-dan/nap-giap">Nạp Giáp</Link>) thường quyết định <strong>đơn vị thời
          gian</strong> dùng để tính Ứng Kỳ: hào càng vượng (đắc lệnh, được sinh) thì việc thường ứng
          nghiệm càng nhanh, có thể chỉ tính bằng ngày hoặc giờ; hào càng suy (hưu tù, bị khắc) thì
          phải chờ lâu hơn, có khi tính bằng tháng hoặc năm mới đủ khí phát tác. Nguyên tắc "vượng
          thì nhanh, suy thì chậm" này được nhắc tới ở nhiều nơi trong tài liệu Bốc Dịch — mức độ áp
          dụng cụ thể ra sao cho từng loại việc hỏi vẫn cần nhiều kinh nghiệm thực tế để luận cho
          đúng.
        </p>
      </div>

      <div className="the">
        <h2>Tuần Không: chờ đến ngày "xuất Không"</h2>
        <p>
          Nếu Dụng Thần lâm <strong>Tuần Không</strong> (xem bài{" "}
          <Link to="/huong-dan/tuan-khong">Tuần Không</Link>), hào đó tạm thời không phát huy tác
          dụng — nên Ứng Kỳ thường không tính vào lúc hào đang Không, mà phải chờ đến khi hào đó{" "}
          <strong>ra khỏi Không</strong> của tuần hiện tại ("xuất Không"), hoặc gặp đúng ngày xung
          phá Tuần Không, việc mới được xem là đủ điều kiện ứng nghiệm. Đây cũng là lý do vì sao đọc
          Ứng Kỳ không thể tách rời khỏi việc xét Tuần Không của từng hào trong quẻ.
        </p>
      </div>

      <div className="the">
        <h2>Nguyệt Phá: chờ đến khi được "điền thực"</h2>
        <p>
          Tương tự, một hào bị <strong>Nguyệt Phá</strong> (bị Chi tháng xung khắc, tổn thương nặng
          ngay từ gốc) thường được xem là chưa đủ sức ứng nghiệm ngay, mà phải chờ tới một mốc thời
          gian sau đó — thường gọi là "điền thực" (bù đắp/lấp đầy lại) — khi có Chi ngày hoặc tháng
          hợp/sinh cho hào đó, hào mới đủ lực để việc xảy ra. Cũng như phần Tuần Không, đây là nguyên
          tắc mang tính định hướng; cách tính mốc "điền thực" cụ thể có nhiều cách diễn đạt khác nhau
          tuỳ tài liệu.
        </p>
      </div>

      <div className="the">
        <h2>Ứng Kỳ không phải "Tìm thời điểm tốt" trên QIChing</h2>
        <p>
          Dễ nhầm lẫn: trang <Link to="/tim-ngay-tot">Tìm thời điểm tốt</Link> của QIChing quét hàng
          loạt ngày trong tương lai để tìm ngày mà một quẻ <em>giả định</em> gieo vào đúng lúc đó sẽ
          có điểm vượng suy tốt cho chủ đề bạn chọn — tức tìm thời điểm <strong>nên hành
          động</strong>, tính <strong>trước khi</strong> có quẻ thật. Ứng Kỳ thì ngược lại: bạn đã có
          một quẻ thật về một việc cụ thể, và Ứng Kỳ trả lời việc <strong>đã hỏi đó</strong> sẽ ứng
          nghiệm vào lúc nào — tính <strong>sau khi</strong> đã gieo quẻ, dựa trên chính các hào của
          quẻ đó. Hai khái niệm dùng chung chữ "thời điểm" nhưng phục vụ hai mục đích hoàn toàn khác
          nhau, không thể thay thế cho nhau.
        </p>
      </div>

      <div className="the">
        <h2>Vì sao đây là phần khó nhất, cần thận trọng nhất khi luận đoán</h2>
        <p>
          Không giống Nạp Giáp hay Tuần Không — những phần có công thức cố định, ra kết quả duy nhất
          cho mọi người — Ứng Kỳ đòi hỏi cân nhắc đồng thời nhiều lớp: hào động hay tĩnh, vượng hay
          suy, có lâm Không hay bị Phá hay không, và bản chất của việc đang hỏi (việc gấp thường ứng
          nhanh trong ngày/tháng, việc lớn thường ứng chậm hơn theo năm). Ngay trong chính truyền
          thống Bốc Dịch, đây cũng là phần được thừa nhận là khó nhất, cần nhiều kinh nghiệm thực
          chiến nhất để luận cho đúng — không có một công thức duy nhất áp dụng máy móc cho mọi quẻ.
          Vì QIChing hiện chưa tự tính Ứng Kỳ, phần này chỉ nên đọc như kiến thức nền tảng để tự luận
          thêm, không phải một con số QIChing sẽ hiển thị sẵn.
        </p>
        <p>
          <Link to="/">Thử gieo một quẻ</Link> để xem đầy đủ hào động/tĩnh, vượng suy và Tuần Không
          của quẻ bạn — nguyên liệu cần có trước khi luận Ứng Kỳ.
        </p>
      </div>
    </>
  );
}
