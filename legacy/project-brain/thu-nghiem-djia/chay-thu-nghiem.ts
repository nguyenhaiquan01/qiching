/**
 * Chạy thử nghiệm theo đúng đặc tả trong
 * `legacy/project-brain/prompt-thu-nghiem-kinh-dich-du-doan-vs-chung-khoan.md`.
 *
 * Dùng THẲNG module Bốc Dịch thật của QIChing (`src/core/queDich.ts`, `QueDich`), không port lại
 * công thức, không dùng thư viện ngoài nào để tính Mai Hoa Dịch Số.
 *
 * Cách chạy: build bằng `vite build --ssr` (giống hệt cách `entry-server.tsx` được build cho
 * prerender — xem `scripts/prerender.mjs`) rồi chạy file .js sinh ra bằng Node, LUÔN từ thư mục gốc
 * repo (script đọc `DJA.csv` bằng đường dẫn tương đối tới `process.cwd()`, không dùng
 * `import.meta.url`, vì sau khi bundle file này không còn nằm cùng thư mục với DJA.csv nữa).
 *
 * KHÔNG đặt trong `src/` hay đuôi `*.test.ts`/`*.spec.ts`: đây là thử nghiệm nghiên cứu một lần,
 * không phải một phần của app hay của bộ test chạy trong CI (`npm test` sẽ tự động nhặt mọi
 * `*.test.ts` trong repo — đặt ở đây để không bị `vitest`/GitHub Actions vô tình chạy lại).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { QueDich } from "../../../src/core/queDich";
import { LUC_THAN } from "../../../src/core/const";

const DUONG_DAN_CSV = "legacy/project-brain/thu-nghiem-djia/DJA.csv";
const DUONG_DAN_KET_QUA = "legacy/project-brain/thu-nghiem-djia/KET-QUA.md";

interface Phien {
  ngay: string; // YYYY-MM-DD
  close: number;
}

function docCSV(duongDan: string): Phien[] {
  const raw = readFileSync(duongDan, "utf-8");
  const dong = raw.trim().split("\n");
  const ketQua: Phien[] = [];
  for (let i = 1; i < dong.length; i++) {
    const cot = dong[i].split(",");
    const ngay = cot[0];
    const close = Number(cot[4]); // cột "Close", xem header dòng 1 của DJA.csv
    if (!ngay || Number.isNaN(close)) continue;
    ketQua.push({ ngay, close });
  }
  return ketQua;
}

/** `diemLucThan["Thê Tài"]` cho quẻ lập vào đúng 10h00 sáng giờ địa phương của ngày truyền vào
 * (cập nhật 2026-09-05 (8), sau khi đã thử 0h00 và 8h00 sáng) — đúng cách gọi thật của app
 * (`XemQue.tsx`: `new QueDich(thoiDiem); q.giaiQue()`). */
function diemTheTaiTheoNgay(ngay: string): number {
  const [y, m, d] = ngay.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 10, 0, 0);
  const que = new QueDich(dt);
  que.giaiQue();
  return que.diemLucThan["Thê Tài"];
}

type ThucTe = "tang" | "giam" | null;
type DuDoan = "tang" | "giam" | null;

function xetThucTe(close: number, closeTruoc: number): ThucTe {
  if (close > closeTruoc) return "tang";
  if (close < closeTruoc) return "giam";
  return null; // đứng yên — bỏ qua, đúng mục "Định nghĩa thực tế tăng/giảm" trong prompt
}

/** Quy tắc dịch điểm Thê Tài ra dự đoán — đúng mục "Quy tắc dịch quẻ" trong prompt (cập nhật
 * 2026-09-05 (9), quy tắc hiện hành): MỘT CHIỀU — chỉ phát tín hiệu "tang" khi diem > 4 (ngưỡng
 * chọn riêng cho thử nghiệm, KHÔNG khớp ngưỡng "RẤT CÁT" (>3) có sẵn ở `giaiThich.ts` nữa — siết
 * chặt hơn); mọi diem <= 4 không đưa ra dự đoán, bị loại khỏi mẫu so sánh. Không còn nhánh "giam". */
function xetDuDoanTheoTheTai(diem: number): DuDoan {
  return diem > 4 ? "tang" : null;
}

function zTest(soDung: number, tongSo: number): number {
  const pHat = soDung / tongSo;
  const se = Math.sqrt(0.25 / tongSo);
  return (pHat - 0.5) / se;
}

interface KetQuaPhuongPhap {
  tenPhuongPhap: string;
  soDung: number;
  soSai: number;
  tongSo: number;
}

function ghiNhan(dsThucTe: ThucTe[], dsDuDoan: DuDoan[], tenPhuongPhap: string): KetQuaPhuongPhap {
  let soDung = 0;
  let soSai = 0;
  for (let i = 0; i < dsThucTe.length; i++) {
    const thucTe = dsThucTe[i];
    const duDoan = dsDuDoan[i];
    if (thucTe === null || duDoan === null) continue;
    if (thucTe === duDoan) soDung++;
    else soSai++;
  }
  return { tenPhuongPhap, soDung, soSai, tongSo: soDung + soSai };
}

function dongBaoCao(kq: KetQuaPhuongPhap): string {
  const tyLe = (kq.soDung / kq.tongSo) * 100;
  const z = zTest(kq.soDung, kq.tongSo);
  const yNghia = Math.abs(z) > 1.96 ? "CÓ ý nghĩa thống kê (95%)" : "không có ý nghĩa thống kê";
  return (
    `- **${kq.tenPhuongPhap}**: ${kq.soDung}/${kq.tongSo} đúng = ${tyLe.toFixed(2)}%, ` +
    `z = ${z.toFixed(3)} → ${yNghia}`
  );
}

function main() {
  const t0 = Date.now();
  const phien = docCSV(DUONG_DAN_CSV);
  console.log(`Đã đọc ${phien.length} phiên từ ${DUONG_DAN_CSV} (${phien[0].ngay} → ${phien[phien.length - 1].ngay})`);

  const dsThucTe: ThucTe[] = [];
  const dsDuDoanTheTai: DuDoan[] = [];
  const dsDuDoanNgauNhien: DuDoan[] = [];
  const phanBoDiem = new Map<number, number>();

  for (let i = 1; i < phien.length; i++) {
    const thucTe = xetThucTe(phien[i].close, phien[i - 1].close);
    dsThucTe.push(thucTe);

    const diem = diemTheTaiTheoNgay(phien[i].ngay);
    phanBoDiem.set(diem, (phanBoDiem.get(diem) ?? 0) + 1);
    dsDuDoanTheTai.push(xetDuDoanTheoTheTai(diem));

    // Baseline ngẫu nhiên — tung đồng xu 50/50 cho từng phiên, không dùng ngày tháng thật.
    dsDuDoanNgauNhien.push(Math.random() < 0.5 ? "tang" : "giam");

    if (i % 5000 === 0) console.log(`  ...đã xử lý ${i}/${phien.length - 1} phiên`);
  }

  const kqTheTai = ghiNhan(dsThucTe, dsDuDoanTheTai, 'Thời gian thật, 10h00 sáng mỗi ngày, điểm Thê Tài > 4 → chỉ phát tín hiệu "tang" (module QueDich thật)');
  const kqNgauNhien = ghiNhan(dsThucTe, dsDuDoanNgauNhien, "Đồng xu ngẫu nhiên (baseline, không dùng ngày tháng, trên toàn bộ mẫu)");

  const soNgayDungYen = dsThucTe.filter((t) => t === null).length;
  const soNgayKhongDuBangChung = dsDuDoanTheTai.filter((d) => d === null).length;

  // Base rate "tang" trên TOÀN BỘ mẫu hợp lệ (không lọc theo điểm Thê Tài) — quan trọng để diễn
  // giải trung thực quy tắc một chiều: nếu DJIA vốn có xu hướng tăng dài hạn nhỉnh hơn 50%, một
  // quy tắc "chỉ đoán tang" có thể trông "đúng nhiều" chỉ vì xu hướng nền đó, không phải vì Thê
  // Tài có liên hệ gì với thị trường.
  const soNgayTangToanBo = dsThucTe.filter((t) => t === "tang").length;
  const soNgayHopLeToanBo = dsThucTe.filter((t) => t !== null).length;
  const tyLeTangToanBo = (soNgayTangToanBo / soNgayHopLeToanBo) * 100;

  const thangDiem = [...phanBoDiem.entries()].sort((a, b) => a[0] - b[0]);

  const lines: string[] = [];
  lines.push("# Kết quả thử nghiệm: Ứng Kỳ Thê Tài vs DJIA");
  lines.push("");
  lines.push(`Chạy lúc: ${new Date().toISOString()}`);
  lines.push(`Nguồn dữ liệu: \`${DUONG_DAN_CSV}\` (${phien.length} phiên, ${phien[0].ngay} → ${phien[phien.length - 1].ngay})`);
  lines.push(`Module khởi quẻ: \`src/core/queDich.ts\` (\`QueDich\`), không dùng thư viện ngoài.`);
  lines.push("");
  lines.push("## Kết quả chính");
  lines.push("");
  lines.push(dongBaoCao(kqTheTai));
  lines.push(dongBaoCao(kqNgauNhien));
  lines.push("");
  lines.push("## Số phiên bị loại khỏi mẫu (đúng quy tắc đã định trước trong prompt)");
  lines.push("");
  lines.push(`- Đứng yên (\`Close[i] == Close[i-1]\`): ${soNgayDungYen} phiên — loại khỏi mẫu.`);
  lines.push(
    `- Điểm Thê Tài \`<= 4\` (không đủ bằng chứng để phát tín hiệu "tang" theo quy tắc \`>4\`, ` +
      `cập nhật 2026-09-05 (9)): ${soNgayKhongDuBangChung} phiên — loại khỏi mẫu.`,
  );
  lines.push(
    `- Còn lại trong mẫu so sánh (\`diem > 4\`, không đứng yên): ${kqTheTai.tongSo} phiên ` +
      `(≈ ${((kqTheTai.tongSo / (phien.length - 1)) * 100).toFixed(1)}% tổng số phiên).`,
  );
  lines.push("");
  lines.push("## Base rate cần biết để diễn giải trung thực");
  lines.push("");
  lines.push(
    `- Tỷ lệ ngày "tang" trên TOÀN BỘ ${soNgayHopLeToanBo} phiên hợp lệ (không lọc theo Thê Tài): ` +
      `${tyLeTangToanBo.toFixed(2)}%.`,
  );
  lines.push(
    `  Nếu tỷ lệ đúng của quy tắc Thê Tài > 4 ở trên KHÔNG cao hơn rõ rệt con số này, quy tắc` +
      ` không cho thêm thông tin gì so với việc DJIA vốn có xu hướng tăng nền — kể cả khi z-test` +
      ` so với 50% "có ý nghĩa thống kê", vì mốc so sánh đúng phải là base rate này, không phải 50%.`,
  );
  lines.push("");
  lines.push("## Phân bố điểm vượng suy Thê Tài (để kiểm tra thang điểm có hợp lý không)");
  lines.push("");
  lines.push("| Điểm | Số phiên |");
  lines.push("|---|---|");
  for (const [diem, dem] of thangDiem) lines.push(`| ${diem} | ${dem} |`);
  lines.push("");
  lines.push(`Tổng thời gian chạy: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  lines.push("");
  lines.push("## Giới hạn (nhắc lại từ prompt gốc)");
  lines.push("");
  lines.push("- Đây là thử nghiệm minh họa, tự thiết kế, chưa qua bình duyệt khoa học.");
  lines.push("- Baseline ngẫu nhiên ở trên chạy một lần bằng `Math.random()`, không cố định seed —");
  lines.push("  chạy lại sẽ ra số hơi khác (dao động quanh 50%), không dùng để so sánh chính xác");
  lines.push("  từng chữ số, chỉ để có một mốc \"không có tín hiệu\" cùng cỡ mẫu.");
  lines.push("- Ngưỡng >4 áp cho MỌI ngày trong 134 năm dữ liệu — không xét đến việc thị trường");
  lines.push("  đã đổi cấu trúc rất nhiều lần trong giai đoạn đó.");

  const baoCao = lines.join("\n") + "\n";
  writeFileSync(DUONG_DAN_KET_QUA, baoCao, "utf-8");
  console.log("\n" + baoCao);
  console.log(`Đã ghi báo cáo đầy đủ vào ${DUONG_DAN_KET_QUA}`);
}

main();
