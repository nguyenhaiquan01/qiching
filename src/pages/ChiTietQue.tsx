import { useEffect, useState } from "react";
import { Link } from "react-router";
import { HinhQue } from "../components/HinhQue";
import type { NoiDungQueRow } from "../core/data/noiDungQue";
import type { NoiDungQueNgoTatToRow, MenhDeNgoTatTo } from "../core/data/noiDungQueNgoTatTo";
import type { NoiDungQuePhanBoiChauRow } from "../core/data/noiDungQuePhanBoiChau";
import { duongDanQue } from "../ui/duongDan";
import { docBanPhanBoiChauNhung } from "../ui/duLieuNhung";

type NguonDichGia = "nguyen-hien-le" | "ngo-tat-to" | "phan-boi-chau";

const NHAN_NGUON: Record<NguonDichGia, string> = {
  "nguyen-hien-le": "Nguyễn Hiến Lê",
  "ngo-tat-to": "Ngô Tất Tố",
  "phan-boi-chau": "Phan Bội Châu",
};

/** Tên tác phẩm + tác giả hiển thị ở dòng "Nguồn:" — khớp cách ghi nguồn của chính từng bản
 * dịch, thay cho URL thô. */
const NHAN_NGUON_TAC_PHAM: Record<NguonDichGia, string> = {
  "nguyen-hien-le": "Kinh Dịch - Đạo của người quân tử - Tác giả: Nguyễn Hiến Lê",
  "ngo-tat-to": "Kinh Dịch Trọn Bộ - Tác giả: Ngô Tất Tố",
  "phan-boi-chau": "Quốc Văn Chu Dịch Diễn Giải - Tác giả: Sào Nam Phan Bội Châu",
};

const KHOA_NGUON_DA_LUU = "qiching-nguon-dich-gia";

/** Đọc lựa chọn dịch giả đã lưu (nếu có) — dùng làm state khởi tạo để tải đúng bản đã chọn
 * ngay từ đầu thay vì luôn mặc định Nguyễn Hiến Lê rồi mới lazy-load lại
 * (xem legacy/project-brain/11-ke-hoach-ban-dich-ngo-tat-to-phan-boi-chau.md mục 5.4). */
function docNguonDaLuu(): NguonDichGia {
  try {
    const v = localStorage.getItem(KHOA_NGUON_DA_LUU);
    if (v === "ngo-tat-to" || v === "phan-boi-chau") return v;
  } catch {
    // localStorage có thể bị chặn (chế độ riêng tư) — bỏ qua, dùng mặc định.
  }
  return "nguyen-hien-le";
}

/** Một "mệnh đề" LỜI KINH + GIẢI NGHĨA của bản Ngô Tất Tố. */
function KhoiMenhDeNgoTatTo({ md }: { md: MenhDeNgoTatTo }) {
  return (
    <div className="hao-tu-chi-tiet">
      {md.loiKinh.hanTu && <p className="han-tu">{md.loiKinh.hanTu}</p>}
      <p className="giai-thich">
        {md.loiKinh.dichAm}
        {md.loiKinh.dichAm && md.loiKinh.dichNghia ? "\n" : ""}
        {md.loiKinh.dichNghia}
      </p>
      {md.giaiNghia && <p className="giai-thich">{md.giaiNghia}</p>}
    </div>
  );
}

/** Trang chi tiết một quẻ — tương tự cấu trúc trang cohoc.net/&lt;ten-que&gt;.html: đồ hình,
 * Giải nghĩa, Dịch, Giảng, Hào Từ đầy đủ 6 hào, Dụng Cửu/Lục và Chú Thích (nếu có). Có thể
 * toggle qua lại giữa 3 bản diễn giải (Nguyễn Hiến Lê/Ngô Tất Tố/Phan Bội Châu) — xem
 * legacy/project-brain/11-ke-hoach-ban-dich-ngo-tat-to-phan-boi-chau.md. */
export function ChiTietQue({
  que,
  quaTruoc,
  quaSau,
}: {
  que: NoiDungQueRow;
  quaTruoc?: NoiDungQueRow;
  quaSau?: NoiDungQueRow;
}) {
  // Cuộn lên đầu trang mỗi khi chuyển sang xem một quẻ khác — tránh vẫn ở vị trí cuộn cũ
  // (ví dụ khi bấm tên quẻ từ trang Xem quẻ, hoặc bấm quẻ trước/sau).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [que.tenQueChuan]);

  // Mặc định là bản PHAN BỘI CHÂU: đây là bản được prerender vào HTML tĩnh và do đó là bản
  // Google index. Chọn bản này vì tác giả mất năm 1940 nên tác phẩm đã hết thời hạn bảo hộ
  // (đời + 50 năm), khác với bản Nguyễn Hiến Lê còn được bảo hộ tới khoảng 2034. Bản Nguyễn
  // Hiến Lê vẫn xem được đầy đủ khi người dùng tự chọn — chỉ là không nằm trong HTML được
  // index. Xem `project-brain/10-ke-hoach-seo.md` gate G1.
  //
  // Luôn khởi tạo bằng đúng giá trị mà server dùng (không đọc localStorage trong initializer)
  // rồi mới đọc lựa chọn đã lưu trong effect bên dưới, tránh hydration mismatch (React #418).
  const [nguon, setNguon] = useState<NguonDichGia>("phan-boi-chau");
  const [ngoTatTo, setNgoTatTo] = useState<NoiDungQueNgoTatToRow | undefined>();
  // Dữ liệu bản mặc định được nhúng sẵn trong chính trang (xem `ui/duLieuNhung.ts`) nên đọc
  // được đồng bộ ngay lần render đầu, ở cả server lẫn client.
  const [phanBoiChau, setPhanBoiChau] = useState<NoiDungQuePhanBoiChauRow | undefined>(() =>
    docBanPhanBoiChauNhung(que.tenQueChuan),
  );
  const [dangTai, setDangTai] = useState(false);

  useEffect(() => {
    const daLuu = docNguonDaLuu();
    if (daLuu !== "phan-boi-chau") setNguon(daLuu);
  }, []);

  function doiNguon(n: NguonDichGia) {
    setNguon(n);
    try {
      localStorage.setItem(KHOA_NGUON_DA_LUU, n);
    } catch {
      // không lưu được (chế độ riêng tư) — vẫn đổi hiển thị bình thường, chỉ không nhớ được
      // cho lần ghé sau.
    }
  }

  // Chỉ import động (code-splitting) 1 trong 2 bản còn lại khi thực sự cần — bản Nguyễn Hiến
  // Lê đã có sẵn trong prop `que`, không cần tải thêm. Dữ liệu 2 bản mới khá lớn (>1MB mỗi
  // bản), không nên bundle tĩnh vào chunk chính khi đa số người dùng không đổi bản mặc định.
  useEffect(() => {
    if (nguon === "nguyen-hien-le") return; // đã có sẵn trong prop `que`
    if (nguon === "phan-boi-chau" && phanBoiChau) return; // đã nhúng sẵn trong trang
    let huy = false;
    setDangTai(true);
    if (nguon === "ngo-tat-to") {
      import("../core/data/noiDungQueNgoTatTo").then((m) => {
        if (huy) return;
        setNgoTatTo(m.timNoiDungQueNgoTatTo(que.tenQueChuan));
        setDangTai(false);
      });
    } else {
      import("../core/data/noiDungQuePhanBoiChau").then((m) => {
        if (huy) return;
        setPhanBoiChau(m.timNoiDungQuePhanBoiChau(que.tenQueChuan));
        setDangTai(false);
      });
    }
    return () => {
      huy = true;
    };
  }, [nguon, que.tenQueChuan, phanBoiChau]);

  const nguonHienTai =
    nguon === "nguyen-hien-le" ? que.nguon : nguon === "ngo-tat-to" ? ngoTatTo?.nguon : phanBoiChau?.nguon;
  // Hiện tên tác phẩm/tác giả thay vì URL thô — khớp cách ghi nguồn của chính từng bản dịch.
  const nhanNguonHienTai = NHAN_NGUON_TAC_PHAM[nguon];

  return (
    <div>
      {/* Link thật, không phải button: đây là internal link giữa 64 trang quẻ — vừa cho người
          dùng mở tab mới/copy link, vừa là đường để bot bò ngang giữa các quẻ. */}
      <div className="hang-form khong-in" style={{ marginBottom: 12 }}>
        <Link className="nut phu" to="/64-que">
          ← Danh sách 64 quẻ
        </Link>
        {quaTruoc && (
          <Link className="nut phu" to={duongDanQue(quaTruoc)}>
            ‹ {quaTruoc.soThuTu}. {quaTruoc.tenQue}
          </Link>
        )}
        {quaSau && (
          <Link className="nut phu" to={duongDanQue(quaSau)}>
            {quaSau.soThuTu}. {quaSau.tenQue} ›
          </Link>
        )}
      </div>

      <div className="the">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <HinhQue queThuong={que.queThuong} queHa={que.queHa} />
          <div>
            <div className="que-dich-cung">Quẻ số {que.soThuTu}</div>
            <div className="que-dich-ten" style={{ fontSize: "1.3rem" }}>
              {que.tenQue}
            </div>
            <div className="que-dich-cung">{que.tenQueChuan}</div>
            <div className="que-dich-cung">
              Nội quái: {que.queHa} — Ngoại quái: {que.queThuong} — Cung {que.cung}
            </div>
          </div>
        </div>
      </div>

      <div className="the khong-in">
        <h2>Bản diễn giải</h2>
        <div className="hang-form" role="group" aria-label="Chọn bản diễn giải">
          {(Object.keys(NHAN_NGUON) as NguonDichGia[]).map((n) => (
            <button
              key={n}
              type="button"
              className={`nut${nguon === n ? "" : " phu"}`}
              onClick={() => doiNguon(n)}
              aria-pressed={nguon === n}
            >
              {NHAN_NGUON[n]}
            </button>
          ))}
        </div>
      </div>

      {nguon === "nguyen-hien-le" && (
        <>
          <div className="the">
            <h2>Giải nghĩa</h2>
            <p className="giai-thich">{que.giaiNghia}</p>
          </div>

          <div className="the">
            <h2>Thoán Từ</h2>
            {que.thoanTu.hanTu && <p className="han-tu">{que.thoanTu.hanTu}</p>}
            <p className="giai-thich">{que.thoanTu.dich}</p>
          </div>

          <div className="the">
            <h2>Giảng (Thoán Từ)</h2>
            <p className="giai-thich">{que.thoanTu.giang}</p>
          </div>

          <div className="the">
            <h2>Hào Từ</h2>
            {que.haoTu
              .slice()
              .sort((a, b) => a.vach - b.vach)
              .map((h) => (
                <div key={h.vach} className="hao-tu-chi-tiet">
                  <h3>
                    Hào {h.vach} — {h.nhan}
                  </h3>
                  <p className="giai-thich">{h.noiDung}</p>
                </div>
              ))}
          </div>

          {que.dungCuu && (
            <div className="the">
              <h2>Dụng Cửu / Dụng Lục</h2>
              <p className="giai-thich">{que.dungCuu}</p>
            </div>
          )}

          {que.chuThich && (
            <div className="the">
              <h2>Chú Thích</h2>
              <p className="giai-thich">{que.chuThich}</p>
            </div>
          )}

          {que.phuLuc && (
            <div className="the">
              <h2>Phụ Lục</h2>
              <p className="giai-thich">{que.phuLuc}</p>
            </div>
          )}
        </>
      )}

      {nguon !== "nguyen-hien-le" && dangTai && (
        <div className="the">
          <p className="giai-thich">Đang tải bản {NHAN_NGUON[nguon]}…</p>
        </div>
      )}

      {nguon === "ngo-tat-to" &&
        !dangTai &&
        (ngoTatTo ? (
          <>
            <div className="the">
              <h2>Thoán Từ / Thoán Truyện / Đại Tượng Truyện</h2>
              {ngoTatTo.quaiTu.map((md, i) => (
                <KhoiMenhDeNgoTatTo key={i} md={md} />
              ))}
            </div>

            <div className="the">
              <h2>Hào Từ</h2>
              {ngoTatTo.haoTu
                .slice()
                .sort((a, b) => a.vach - b.vach)
                .map((h) => (
                  <div key={h.vach}>
                    <h3>
                      Hào {h.vach} — {h.nhan}
                    </h3>
                    {h.menhDe.map((md, i) => (
                      <KhoiMenhDeNgoTatTo key={i} md={md} />
                    ))}
                  </div>
                ))}
            </div>

            {ngoTatTo.dungCuu && (
              <div className="the">
                <h2>Dụng Cửu / Dụng Lục</h2>
                <p className="giai-thich">{ngoTatTo.dungCuu}</p>
              </div>
            )}
          </>
        ) : (
          <div className="the">
            <p className="giai-thich">Chưa có bản Ngô Tất Tố cho quẻ này.</p>
          </div>
        ))}

      {nguon === "phan-boi-chau" &&
        !dangTai &&
        (phanBoiChau ? (
          <>
            {phanBoiChau.tuQuai && (
              <div className="the">
                <h2>Tự Quái Truyện</h2>
                <p className="giai-thich">{phanBoiChau.tuQuai}</p>
              </div>
            )}

            <div className="the">
              <h2>Soán Từ</h2>
              <p className="giai-thich">{phanBoiChau.soanTu}</p>
            </div>

            <div className="the">
              <h2>Soán Truyện</h2>
              <p className="giai-thich">{phanBoiChau.soanTruyen}</p>
            </div>

            <div className="the">
              <h2>Đại Tượng Truyện</h2>
              <p className="giai-thich">{phanBoiChau.daiTuongTruyen}</p>
            </div>

            <div className="the">
              <h2>Hào Từ &amp; Tiểu Tượng Truyện</h2>
              {phanBoiChau.haoTu
                .slice()
                .sort((a, b) => a.vach - b.vach)
                .map((h) => (
                  <div key={h.vach} className="hao-tu-chi-tiet">
                    <h3>
                      Hào {h.vach} — {h.nhan}
                    </h3>
                    <p className="giai-thich">{h.noiDung}</p>
                  </div>
                ))}
            </div>

            {phanBoiChau.vanNgon && (
              <div className="the">
                <h2>Văn Ngôn Truyện</h2>
                <p className="giai-thich">{phanBoiChau.vanNgon}</p>
              </div>
            )}

            {phanBoiChau.dungCuu && (
              <div className="the">
                <h2>Dụng Cửu / Dụng Lục</h2>
                <p className="giai-thich">{phanBoiChau.dungCuu}</p>
              </div>
            )}
          </>
        ) : (
          <div className="the">
            <p className="giai-thich">Chưa có bản Phan Bội Châu cho quẻ này.</p>
          </div>
        ))}

      {nguonHienTai && (
        <p className="que-dich-cung khong-in">
          Nguồn:{" "}
          <a href={nguonHienTai} target="_blank" rel="noreferrer">
            {nhanNguonHienTai}
          </a>
        </p>
      )}
    </div>
  );
}
