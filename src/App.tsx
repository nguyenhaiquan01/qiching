import { NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router";
import "./App.css";
import "./ui/stitch-theme.css";
import { XemQue } from "./pages/XemQue";
import { DanhSachQue } from "./pages/DanhSachQue";
import { ChiTietQue } from "./pages/ChiTietQue";
import { TimNgayTot } from "./pages/TimNgayTot";
import { QueDaLuu } from "./pages/QueDaLuu";
import { GioiThieu } from "./pages/GioiThieu";
import { DANH_SACH_QUE, duongDanQue, phanGiaiSlugQue, timQueTheoTenChuan } from "./ui/duongDan";
import type { QueDaGieoDaLuu } from "./core/coinCasting/storage";

/** Menu điều hướng. Mỗi mục là một URL thật (`<a href>` qua `NavLink`) chứ không phải
 * `<button>` như trước — bot mới có đường bò sang các trang khác, xem
 * `project-brain/10-ke-hoach-seo.md` Giai đoạn A. */
const TRANG = [
  { nhan: "Xem quẻ", duongDan: "/" },
  { nhan: "Tìm ngày tốt", duongDan: "/tim-ngay-tot" },
  { nhan: "64 Quẻ Kinh Dịch", duongDan: "/64-que" },
  { nhan: "Quẻ đã lưu", duongDan: "/que-da-luu" },
  { nhan: "Giới thiệu", duongDan: "/gioi-thieu" },
] as const;

/** State truyền qua `navigate(..., { state })` khi xem lại một quẻ đã lưu.
 *
 * Cố ý KHÔNG đưa vào URL: đây là dữ liệu cá nhân (thời điểm hỏi, nội dung quẻ đã gieo), mà
 * guardrail ở `10-ke-hoach-seo.md` mục 2.3 cấm đưa dữ liệu cá nhân vào URL/sitemap/metadata.
 * History state nằm trong bộ nhớ trình duyệt, không lộ ra thanh địa chỉ và không bị chia sẻ
 * nhầm khi copy link. */
interface StateXemLai {
  thoiDiem?: number;
  gieoQue?: QueDaGieoDaLuu;
}

/**
 * Chuẩn hoá đường dẫn về đúng một dạng canonical trước khi render.
 *
 * Router mặc định coi `/64-que` và `/64-que/` là một, tức cùng nội dung phục vụ ở hai URL —
 * đúng thứ `10-ke-hoach-seo.md` mục 3.2 cấm ("không để router chấp nhận vô hạn URL khác nhau
 * cho cùng một nội dung"). Ở đây bỏ dấu `/` thừa ở cuối và thay thế entry trong history
 * (`replace`) để không tạo thêm một bước back vô nghĩa.
 */
function ChuanHoaDuongDan({ children }: { children: React.ReactNode }) {
  const { pathname, search, hash } = useLocation();
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return <Navigate to={pathname.replace(/\/+$/, "") + search + hash} replace />;
  }
  return <>{children}</>;
}

function BoCuc() {
  return (
    <div className="app-shell theme-stitch">
      <header className="app-header">
        <h1>QIChing</h1>
        <span className="app-slogan">Hiểu Dịch · Hiểu Thời · Hiểu Mình</span>
      </header>
      <nav className="app-nav khong-in">
        {TRANG.map((t) => (
          <NavLink
            key={t.duongDan}
            to={t.duongDan}
            end={t.duongDan === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {t.nhan}
          </NavLink>
        ))}
      </nav>
      <main>
        <ChuanHoaDuongDan>
          <Outlet />
        </ChuanHoaDuongDan>
      </main>
    </div>
  );
}

function TrangXemQue() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? null) as StateXemLai | null;

  return (
    <XemQue
      // Remount khi chọn "Xem lại" một quẻ khác: `location.key` đổi theo từng lần điều hướng
      // nên thay được cho `key` cũ ghép từ createdAt/thời điểm.
      key={location.key}
      thoiDiemBanDau={state?.thoiDiem != null ? new Date(state.thoiDiem) : undefined}
      gieoQueBanDau={state?.gieoQue}
      onXemChiTietQue={(tenQueChuan) => {
        const que = timQueTheoTenChuan(tenQueChuan);
        if (que) navigate(duongDanQue(que));
      }}
    />
  );
}

function TrangChiTietQue() {
  const { slug } = useParams();
  const ketQua = phanGiaiSlugQue(slug);

  // Slug không chuẩn (thiếu/sai phần chữ) thì đưa về đúng một URL canonical thay vì phục vụ
  // cùng nội dung ở nhiều URL — tránh duplicate content.
  if (ketQua.trangThai === "canRedirect") return <Navigate to={ketQua.duongDanChuan} replace />;
  if (ketQua.trangThai === "khongThay") return <KhongTimThay />;

  const viTri = DANH_SACH_QUE.findIndex((q) => q.tenQueChuan === ketQua.que.tenQueChuan);
  return (
    <ChiTietQue
      que={ketQua.que}
      quaTruoc={viTri > 0 ? DANH_SACH_QUE[viTri - 1] : undefined}
      quaSau={viTri < DANH_SACH_QUE.length - 1 ? DANH_SACH_QUE[viTri + 1] : undefined}
    />
  );
}

function TrangQueDaLuu() {
  const navigate = useNavigate();
  return (
    <>
      {/* Trang chứa dữ liệu cá nhân, không được index — xem mục 3.2 của kế hoạch SEO. */}
      <meta name="robots" content="noindex, follow" />
      <QueDaLuu
        onXemLaiTheoThoiGian={(time) => navigate("/", { state: { thoiDiem: time.getTime() } satisfies StateXemLai })}
        onXemLaiGieoDongXu={(gieoQue) => navigate("/", { state: { gieoQue } satisfies StateXemLai })}
      />
    </>
  );
}

/** Route catch-all. Cloudflare Pages đang SPA-fallback nên URL sai vẫn trả HTTP 200 kèm app
 * shell; `noindex` là biện pháp chuyển tiếp để URL rác không lọt vào index (soft-404). Trạng
 * thái đích là trả HTTP 404 thật, nhưng chỉ làm được SAU khi mọi route hợp lệ đã có file HTML
 * riêng (Giai đoạn B) — thêm `404.html` sớm hơn sẽ tắt SPA fallback và làm hỏng deep-link. */
function KhongTimThay() {
  return (
    <>
      <meta name="robots" content="noindex, follow" />
      <div className="the">
        <h2>Không tìm thấy trang</h2>
        <p className="giai-thich">
          Đường dẫn bạn mở không tồn tại hoặc đã thay đổi. Thử quay lại{" "}
          <NavLink to="/">trang Xem quẻ</NavLink> hoặc mở{" "}
          <NavLink to="/64-que">danh sách 64 quẻ</NavLink>.
        </p>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<BoCuc />}>
        <Route index element={<TrangXemQue />} />
        <Route path="tim-ngay-tot" element={<TimNgayTot />} />
        <Route path="64-que" element={<DanhSachQue danhSach={DANH_SACH_QUE} />} />
        <Route path="64-que/:slug" element={<TrangChiTietQue />} />
        <Route path="que-da-luu" element={<TrangQueDaLuu />} />
        <Route path="gioi-thieu" element={<GioiThieu />} />
        <Route path="*" element={<KhongTimThay />} />
      </Route>
    </Routes>
  );
}

export default App;
