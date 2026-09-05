import { Link } from "react-router";

/** Bài hướng dẫn "Tuần Không" — nội dung nguồn:
 * `legacy/project-brain/drafts-huong-dan/05-tuan-khong.md` (BẢN NHÁP, chưa qua domain review). */
export function HuongDanTuanKhong() {
  return (
    <>
      <div className="the">
        <h2>Tuần Không (Không Vong) trong Lục Hào là gì?</h2>
        <p>
          Nếu một hào đang vượng theo Ngũ Hành ngày tháng nhưng lại rơi vào <strong>Tuần
          Không</strong>, kết quả luận đoán có thể đảo ngược hoàn toàn: hào đó tạm thời "mất lực",
          như đang vượng mà bỗng trống rỗng. Đây là một trong những khái niệm dễ bị bỏ qua nhất khi
          mới học Lục Hào, nhưng lại có thể thay đổi cả kết luận của một quẻ.
        </p>
      </div>

      <div className="the">
        <h2>Vì sao có "Không" — 10 Can không đủ ghép hết 12 Chi</h2>
        <p>
          Hệ thống Can Chi ghép Thiên Can (10 can) với Địa Chi (12 chi) để đặt tên cho ngày, tạo
          thành chu kỳ 60 ngày không lặp lại (Lục Thập Hoa Giáp — Giáp Tý, Ất Sửu, Bính Dần...). Vì
          10 không chia hết 12, mỗi khi ghép hết 10 can (một "tuần" 10 ngày) thì còn dư đúng 2 chi
          chưa được dùng tới trong tuần đó — hai chi dư này gọi là <strong>Tuần Không</strong> (hay
          Không Vong) của tuần đó.
        </p>
        <p>
          Ví dụ tuần bắt đầu bằng ngày <strong>Giáp Tý</strong>: 10 ngày trong tuần này là Giáp Tý,
          Ất Sửu, Bính Dần, Đinh Mão, Mậu Thìn, Kỷ Tỵ, Canh Ngọ, Tân Mùi, Nhâm Thân, Quý Dậu — dùng
          hết 10 chi từ Tý đến Dậu. Hai chi còn lại trong vòng 12 chi, <strong>Tuất</strong> và{" "}
          <strong>Hợi</strong>, không xuất hiện trong tuần này — nên bất kỳ hào nào mang Chi Tuất
          hoặc Hợi, nếu quẻ được lập vào một ngày thuộc tuần Giáp Tý, hào đó coi như lâm Tuần Không.
        </p>
        <p>
          Mỗi ngày hỏi quẻ luôn thuộc một trong 6 "tuần" (Giáp Tý, Giáp Tuất, Giáp Thân, Giáp Ngọ,
          Giáp Thìn, Giáp Dần), mỗi tuần có một cặp Chi Không riêng — vì vậy Tuần Không{" "}
          <strong>luôn được tính theo ngày lập quẻ</strong> chứ không cố định cho một hào hay một
          quẻ.
        </p>
      </div>

      <div className="the">
        <h2>Ý nghĩa khi luận đoán</h2>
        <p>
          Quy tắc phổ biến trong Lục Hào: hào lâm Tuần Không tạm thời không phát huy được tác dụng
          thật của nó, bất kể bản thân đang vượng hay suy theo Nhật–Nguyệt — giống như một con số
          đúng nhưng chưa "kích hoạt" được. Từ đó có hai cách nói thường gặp: hào xấu (bị khắc, suy)
          mà gặp Không đôi khi được xem là tạm thời tránh được cái xấu; hào tốt (được sinh, vượng) mà
          gặp Không lại tạm thời chưa phát huy được cái tốt. Đây là nguyên tắc mang tính định hướng,
          mức độ áp dụng còn tùy từng trường hợp cụ thể (hào động hay tĩnh, có bị xung phá Tuần Không
          hay không...) — không nên hiểu như một công thức tuyệt đối áp dụng máy móc cho mọi quẻ.
        </p>
      </div>

      <div className="the">
        <h2>Đừng nhầm với "Triệt Không" trong Tử Vi</h2>
        <p>
          Tuần Không (Lục Hào) và <strong>Triệt Không</strong>/<strong>Tuần Triệt</strong> (thường
          gặp trong Tử Vi Đẩu Số) là hai khái niệm khác nhau, dù tên gọi dễ gây nhầm lẫn và không ít
          tài liệu trên mạng lẫn lộn cả hai. Tuần Không trong Lục Hào tính theo{" "}
          <strong>ngày lập quẻ</strong> và áp dụng cho <strong>từng hào của một quẻ Kinh Dịch</strong>
          ; Triệt Không trong Tử Vi tính theo <strong>năm sinh</strong> và áp dụng cho{" "}
          <strong>cung trong lá số tử vi</strong>. Hai hệ thống này độc lập với nhau, không dùng
          chung công thức hay kết quả.
        </p>
      </div>

      <div className="the">
        <h2>QIChing tính Tuần Không như thế nào</h2>
        <p>
          Với mỗi quẻ, QIChing tính hai Chi "không" của tuần chứa ngày lập quẻ (dựa trên Can-Chi
          ngày, theo đúng công thức ở trên), rồi đánh dấu hào nào trong 6 hào mang một trong hai Chi
          đó là "lâm Tuần Không" — hiển thị ngay trong bảng Nạp Giáp của kết quả. Đây là dữ liệu tính
          tự động, không cần tra bảng thủ công. <Link to="/">Thử gieo một quẻ</Link> để xem hào nào
          của bạn đang lâm Tuần Không.
        </p>
      </div>
    </>
  );
}
