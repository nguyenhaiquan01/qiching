import { Link } from "react-router";

/** Danh sách bài hướng dẫn, dùng chung cho trang hub và (nếu cần sau này) sitemap/nav phụ.
 *
 * BẢN NHÁP: nội dung từng bài lấy từ `legacy/project-brain/drafts-huong-dan/`, CHƯA qua domain
 * review (G2) — xem `trang_thai` trong từng file draft. Toàn bộ cụm `/huong-dan/*` đang lên UAT để
 * xem giao diện/luồng đọc thật, KHÔNG lập chỉ mục (`khongIndex` ở từng route trong `App.tsx`). */
export const DANH_SACH_HUONG_DAN = [
  {
    duongDan: "/huong-dan/nap-giap",
    tieuDe: "Nạp Giáp là gì?",
    moTa: "Cách gán Địa Chi vào quẻ Kinh Dịch theo Kinh Phòng — nền tảng của toàn bộ hệ Bốc Dịch.",
  },
  {
    duongDan: "/huong-dan/luc-than",
    tieuDe: "Lục Thân là gì?",
    moTa: "Vì sao phải chọn đúng Dụng Thần — hào đại diện đúng việc bạn hỏi — trước khi luận quẻ.",
  },
  {
    duongDan: "/huong-dan/the-ung",
    tieuDe: "Thế Ứng là gì?",
    moTa: "Hào nào là \"bạn\", hào nào là \"đối tượng liên quan\" trong chính sự việc bạn đang hỏi.",
  },
  {
    duongDan: "/huong-dan/que-bien",
    tieuDe: "Hào động và Quẻ biến là gì?",
    moTa: "Phân biệt với Thể/Dụng của Mai Hoa Dịch Số — đúng khung Lục Hào mà QIChing dùng để luận giải.",
  },
  {
    duongDan: "/huong-dan/tuan-khong",
    tieuDe: "Tuần Không (Không Vong) là gì?",
    moTa: "Vì sao một hào đang vượng vẫn có thể tạm \"mất lực\" — và cách phân biệt với Triệt Không của Tử Vi.",
  },
  {
    duongDan: "/huong-dan/ung-ky",
    tieuDe: "Ứng Kỳ: bao giờ việc mới xảy ra?",
    moTa: "Quẻ báo cát hung rồi, nhưng thời điểm ứng nghiệm còn phụ thuộc hào động/tĩnh, vượng suy, Tuần Không.",
  },
] as const;

/** Trang hub liệt kê toàn bộ bài hướng dẫn Bốc Dịch/Lục Hào — mỗi bài đọc độc lập, có link chéo
 * sang bài liên quan và sang công cụ. */
export function HuongDanHub() {
  return (
    <div className="the">
      <h2>Hướng dẫn Bốc Dịch / Lục Hào</h2>
      <p>
        Loạt bài giải thích các khái niệm nền tảng mà QIChing dùng để luận quẻ — theo hệ Bốc Dịch
        Nạp Giáp (Kinh Phòng, được Dã Hạc Lão Nhân hệ thống hoá lại trong <em>Tăng San Bốc Dịch</em>)
        — tách biệt với cách đọc Thoán Từ/Hào Từ theo nghĩa lý ở trang{" "}
        <Link to="/64-que">tra cứu 64 quẻ</Link>. Đọc theo thứ tự dưới đây nếu bạn mới bắt đầu.
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
        Đây là bản nháp đang thử nghiệm trên UAT, một số nội dung chưa qua rà soát chuyên môn đầy đủ
        — xem thêm ở <Link to="/gioi-thieu">Giới thiệu</Link> về mức độ tin cậy chung của QIChing.
      </p>
      <ol>
        {DANH_SACH_HUONG_DAN.map((b) => (
          <li key={b.duongDan}>
            <Link to={b.duongDan}>{b.tieuDe}</Link> — {b.moTa}
          </li>
        ))}
      </ol>
    </div>
  );
}
