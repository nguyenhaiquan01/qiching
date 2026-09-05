import { Link } from "react-router";

/** Bài hướng dẫn "Lục Thân" — nội dung nguồn:
 * `legacy/project-brain/drafts-huong-dan/02-luc-than.md` (BẢN NHÁP, chưa qua domain review). */
export function HuongDanLucThan() {
  return (
    <>
      <div className="the">
        <h2>Lục Thân trong Bốc Dịch là gì? Vì sao phải chọn đúng Dụng Thần trước khi luận quẻ</h2>
        <p>
          Sau khi một quẻ đã được Nạp Giáp (xem <Link to="/huong-dan/nap-giap">bài trước</Link>),
          mỗi hào không chỉ có một Can-Chi mà còn được gán thêm một vai trò gọi là <strong>Lục
          Thân</strong>: Phụ Mẫu, Huynh Đệ, Quan Quỷ, Thê Tài, Tử Tôn. Đây là bước quyết định để trả
          lời đúng câu hỏi thực tế bạn đang hỏi — vì mỗi Lục Thân đại diện cho một nhóm chủ đề khác
          nhau trong đời sống, và người luận quẻ phải chọn đúng hào nào là <strong>Dụng Thần</strong>
          — hào đại diện chính xác cho việc bạn hỏi — rồi mới xét hào đó đang vượng hay suy.
        </p>
      </div>

      <div className="the">
        <h2>Lục Thân được tính như thế nào?</h2>
        <p>
          Quy tắc gốc, được nhắc lại xuyên suốt các sách Bốc Dịch (trong đó có Tăng San Bốc Dịch của
          Dã Hạc Lão Nhân): lấy Ngũ Hành của <strong>Cung</strong> mà quẻ thuộc về làm gốc so sánh —
          coi đó là "ta" — rồi so Ngũ Hành của từng hào (đã có từ bước Nạp Giáp) với Ngũ Hành của Cung
          theo quan hệ sinh khắc Ngũ Hành (Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ,
          Thổ sinh Kim; Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim):
        </p>
        <table className="bang-ket-qua">
          <thead>
            <tr>
              <th>Quan hệ Ngũ Hành của hào so với Cung</th>
              <th>Lục Thân</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sinh ra Cung ("sinh ta")</td>
              <td>Phụ Mẫu</td>
            </tr>
            <tr>
              <td>Cùng Ngũ Hành với Cung ("cùng ta")</td>
              <td>Huynh Đệ</td>
            </tr>
            <tr>
              <td>Bị Cung khắc ("ta khắc")</td>
              <td>Thê Tài</td>
            </tr>
            <tr>
              <td>Khắc Cung ("khắc ta")</td>
              <td>Quan Quỷ</td>
            </tr>
            <tr>
              <td>Được Cung sinh ("ta sinh")</td>
              <td>Tử Tôn</td>
            </tr>
          </tbody>
        </table>
        <p>
          Đây chính là công thức được tóm trong câu quyết kinh điển của giới Bốc Dịch:{" "}
          <em>"sinh ta là Phụ Mẫu, ta sinh là Tử Tôn, khắc ta là Quan Quỷ, ta khắc là Thê Tài, cùng
          hàng là Huynh Đệ."</em> Một quẻ 6 hào luôn có đủ (hoặc gần đủ) 5 vai trò này phân bố trên 6
          hào, có hào trùng vai trò.
        </p>
      </div>

      <div className="the">
        <h2>Mỗi Lục Thân đại diện cho điều gì khi luận đoán?</h2>
        <ul>
          <li>
            <strong>Phụ Mẫu</strong> — cha mẹ, người lớn tuổi/bề trên, nhà cửa, giấy tờ, hợp đồng,
            bằng cấp, phương tiện đi lại. Hỏi việc học hành, giấy tờ, nhà đất thường lấy Phụ Mẫu làm
            Dụng Thần.
          </li>
          <li>
            <strong>Huynh Đệ</strong> — anh chị em, bạn bè, đồng nghiệp, người cùng vai vế. Cũng là
            hào chủ về hao tài, tranh giành — Huynh Đệ vượng thường không thuận lợi khi hỏi về tiền
            của hay hôn nhân.
          </li>
          <li>
            <strong>Quan Quỷ</strong> — công danh, chức vụ, sự nghiệp (khi hỏi thi cử/thăng chức là
            điều cần), nhưng đồng thời cũng là hào chủ bệnh tật, tai họa, kiện tụng, tiểu nhân — ý
            nghĩa tốt hay xấu phụ thuộc hoàn toàn vào chủ đề câu hỏi.
          </li>
          <li>
            <strong>Thê Tài</strong> — vợ (khi người hỏi là nam giới hỏi hôn nhân), tiền bạc, tài
            sản. Hỏi việc làm ăn, kinh doanh, cầu tài thường lấy Thê Tài làm Dụng Thần.
          </li>
          <li>
            <strong>Tử Tôn</strong> — con cái, học trò, thầy thuốc/thuốc men. Vì Tử Tôn khắc chế Quan
            Quỷ, nên khi xem bệnh, Tử Tôn vượng là dấu hiệu tốt (áp được "quỷ" gây bệnh); nhưng khi
            hỏi công danh, Tử Tôn vượng lại là điều không thuận (vì nó khắc mất Quan Quỷ — chính là
            thứ người hỏi công danh cần vượng).
          </li>
        </ul>
      </div>

      <div className="the">
        <h2>Vì sao không thể chỉ đọc chung ý nghĩa cả quẻ</h2>
        <p>
          Đây là điểm khác biệt lớn nhất giữa lối luận nghĩa lý (đọc thẳng Thoán Từ/Hào Từ) và lối
          luận Bốc Dịch: cùng một quẻ, nhưng hỏi về "công việc" và hỏi về "sức khỏe" sẽ lấy{" "}
          <strong>hai hào Dụng Thần khác nhau</strong> (một câu hỏi lấy Quan Quỷ, một câu hỏi khác
          lấy Tử Tôn hoặc Thê Tài tùy chủ đề cụ thể) — và hai hào đó hoàn toàn có thể đang ở hai trạng
          thái vượng suy trái ngược nhau trong cùng một quẻ. Nói "quẻ này tốt" hay "quẻ này xấu" mà
          không xác định trước Dụng Thần là một câu trả lời không có căn cứ theo đúng phương pháp Bốc
          Dịch.
        </p>
        <p>
          Đây cũng chính là logic mà công cụ QIChing áp dụng: khi bạn chọn chủ đề câu hỏi (công việc,
          tài lộc, sức khỏe, con cái...), công cụ tự xác định đúng Lục Thân làm Dụng Thần cho chủ đề
          đó, rồi mới xét vượng suy của riêng hào ấy theo Nhật–Nguyệt và hào động — thay vì đưa ra một
          nhận định chung chung cho cả quẻ. <Link to="/">Thử gieo một quẻ theo chủ đề của bạn</Link>{" "}
          để xem cách này hoạt động trên một trường hợp thật.
        </p>
      </div>

      <div className="the">
        <h2>Bài tiếp theo</h2>
        <p>
          Sau khi biết vai trò Lục Thân của từng hào, câu hỏi kế tiếp là: hào nào đại diện cho{" "}
          <em>bản thân người hỏi</em>, hào nào đại diện cho <em>đối tượng/hoàn cảnh liên quan</em>?
          Đó là nội dung của <Link to="/huong-dan/the-ung">Thế Ứng</Link>.
        </p>
      </div>
    </>
  );
}
