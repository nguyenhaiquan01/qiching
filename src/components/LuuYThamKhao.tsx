import { Link } from "react-router";

/**
 * Cảnh báo "chỉ để tham khảo" hiển thị cạnh mọi kết quả luận quẻ (Xem quẻ, Gieo đồng xu, Tìm
 * ngày tốt) — gate G3 (trust & safety) của `project-brain/10-ke-hoach-seo.md` mục 1.5/3.1: khi
 * trải nghiệm có thể ảnh hưởng quyết định tài chính/sức khỏe, cần nói rõ đây là phương pháp
 * truyền thống chưa được xác nhận khoa học, không thay thế tư vấn y tế/pháp lý/tài chính, và
 * không nên là căn cứ duy nhất cho quyết định hệ trọng.
 */
export function LuuYThamKhao() {
  return (
    <div
      className="the"
      style={{
        background: "var(--warning-bg)",
        borderColor: "var(--warning)",
        color: "var(--warning)",
      }}
    >
      <p className="giai-thich" style={{ margin: 0 }}>
        Kết quả dựa trên phương pháp Dịch học truyền thống, <strong>chỉ để tham khảo và chiêm
        nghiệm</strong> — chưa được xác nhận bằng phương pháp khoa học, không thay thế tư vấn y
        tế, pháp lý hoặc tài chính, và không nên là căn cứ duy nhất cho quyết định hệ trọng. Xem
        thêm phương pháp, nguồn dữ liệu và giới hạn tại{" "}
        <Link to="/gioi-thieu" style={{ color: "inherit" }}>
          trang Giới thiệu
        </Link>
        .
      </p>
    </div>
  );
}
