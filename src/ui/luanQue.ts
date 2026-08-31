/**
 * Tầng "luận quẻ theo việc đang hỏi" — port tinh thần từ
 * `project-brain/05.1. Chỉnh UI-UX.md` (UI/UX design brief cho màn hình Xem quẻ/Kết quả).
 *
 * Đây là logic diễn giải PHỤC VỤ HIỂN THỊ, khác với `src/core/business.ts` (tính toán gốc từ
 * app desktop). Không bịa thêm quy tắc Lục Hào mới: mức độ thuận lợi tái dùng đúng ngưỡng
 * VUONG/HUNG mà bản gốc đã dùng để lọc "ngày tốt" (`business.timNgayTot`), Điểm thuận/Cần
 * lưu ý tái dùng đúng ngưỡng RẤT CÁT/CÁT/HUNG/CỰC HUNG đã có ở `giaiThich.ts` — chỉ đổi cách
 * TRÌNH BÀY (tách 2 nhóm, ngôn ngữ có chừa dư địa) chứ không đổi NGƯỠNG tính.
 */
import type { QueDich } from "../core/queDich";
import { yNghiaLucThan } from "../core/business";
import { VUONG, HUNG, LUC_THAN } from "../core/const";

/** "Chủ đề" → Lục Thân dùng làm Dụng Thần — quy ước cổ điển phổ biến của Lục Hào (Quan Quỷ:
 * công danh/kiện tụng/bệnh; Thê Tài: tiền tài/kinh doanh; Tử Tôn: con cái/hóa giải tai ương;
 * Phụ Mẫu: nhà cửa/giấy tờ/văn thư; Huynh Đệ: anh em bạn bè/tranh chấp). Tình duyên cố ý
 * không đưa vào danh sách này vì quy ước cổ điển phân biệt theo giới người hỏi (nam dùng Thê
 * Tài, nữ dùng Quan Quỷ) — không đơn giản hóa thành 1 lựa chọn để tránh sai lệch; người dùng
 * muốn xem tình duyên nên tự chọn thẳng Lục Thân ở mục "Khác". */
export const CHU_DE: ReadonlyArray<{ nhan: string; lucThan: (typeof LUC_THAN)[number] }> = [
  { nhan: "Công việc / Công danh", lucThan: "Quan Quỷ" },
  { nhan: "Tài lộc / Kinh doanh", lucThan: "Thê Tài" },
  { nhan: "Con cái", lucThan: "Tử Tôn" },
  { nhan: "Cha Mẹ/Giấy Tờ/Học Hành", lucThan: "Phụ Mẫu" },
  { nhan: "Bạn bè / Anh em", lucThan: "Huynh Đệ" },
];

/** Suy Dụng Thần từ lựa chọn Chủ đề/Lục Thân trực tiếp — dùng chung cho cả 2 "Cách khởi quẻ"
 * (Theo thời gian / Gieo đồng xu), tránh lặp lại biểu thức này ở từng trang. */
export function dungThanTuChuDe(chuDe: string, vietTrucTiep: string): string | undefined {
  return chuDe === "khac" ? vietTrucTiep : CHU_DE.find((c) => c.nhan === chuDe)?.lucThan;
}

/** Câu hỏi ví dụ theo từng Chủ đề — hiện làm placeholder ở ô "Câu hỏi" để gợi ý đúng trọng
 * tâm của Dụng Thần tương ứng, thay vì một ví dụ chung chung cho mọi chủ đề. */
const CAU_HOI_VI_DU: Record<string, string> = {
  "Công việc / Công danh": "Tôi có nên nhận công việc mới này không?",
  "Tài lộc / Kinh doanh": "Tôi có nên đầu tư vào việc này không?",
  "Con cái": "Con tôi dạo này có bình an, thuận lợi không?",
  "Cha Mẹ/Giấy Tờ/Học Hành": "Sức khoẻ của cha mẹ tôi dạo này thế nào?",
  "Bạn bè / Anh em": "Mối quan hệ này có nên tiếp tục duy trì không?",
};

const CAU_HOI_VI_DU_MAC_DINH = "câu hỏi cụ thể liên quan đến Lục Thân đã chọn";

/** Trả về câu hỏi ví dụ khớp Chủ đề đang chọn — dùng làm placeholder, không tự điền vào ô
 * (tôn trọng câu hỏi user đã gõ, không ghi đè khi đổi Chủ đề qua lại). */
export function cauHoiViDuTheoChuDe(chuDe: string): string {
  return CAU_HOI_VI_DU[chuDe] ?? CAU_HOI_VI_DU_MAC_DINH;
}

export type MucDo = "thuan" | "trungTinh" | "canThanTrong";

export interface MucDoThuanLoi {
  muc: MucDo;
  nhan: string;
}

/** Ngưỡng giống hệt `business.timNgayTot` (Vượng=3, Hung=-8) — chỉ đổi tên hiển thị. */
export function mucDoThuanLoi(diem: number): MucDoThuanLoi {
  if (diem > VUONG) return { muc: "thuan", nhan: "Khá Thuận" };
  if (diem <= HUNG) return { muc: "canThanTrong", nhan: "Cần Thận Trọng" };
  return { muc: "trungTinh", nhan: "Trung Tính" };
}

export interface DiemHao {
  /** Có thể nhiều hào cùng mang một Lục Thân — gộp chung 1 dòng thay vì lặp lại cùng một
   * câu giải nghĩa Lục Thân nhiều lần (giải nghĩa vốn gắn với Lục Thân, không phải riêng
   * từng hào). */
  vachs: number[];
  lucThan: string;
  yNghia: string;
}

/** Tách hào thành 2 nhóm theo đúng ngưỡng đã dùng ở `giaiThichQue` (>1 = Cát trở lên, <0 =
 * Hung trở xuống) — không gộp chung một đoạn văn như bản gốc mà tách riêng để dễ scan. Các
 * hào cùng Lục Thân trong cùng nhóm được gộp lại thành một dòng. */
export function diemThuanVaCanLuuY(que: QueDich): { thuan: DiemHao[]; canLuuY: DiemHao[] } {
  const gop = (dsVach: number[]): DiemHao[] => {
    const theoLucThan = new Map<string, number[]>();
    for (const vach of dsVach) {
      const lucThan = que.hao[vach].lucthan;
      theoLucThan.set(lucThan, [...(theoLucThan.get(lucThan) ?? []), vach]);
    }
    return [...theoLucThan.entries()].map(([lucThan, vachs]) => ({
      vachs,
      lucThan,
      yNghia: yNghiaLucThan(lucThan),
    }));
  };

  const vachThuan: number[] = [];
  const vachCanLuuY: number[] = [];
  for (let i = 1; i <= 6; i++) {
    const diemso = que.hao[i].diemso;
    if (diemso > 1) vachThuan.push(i);
    else if (diemso < 0) vachCanLuuY.push(i);
  }
  return { thuan: gop(vachThuan), canLuuY: gop(vachCanLuuY) };
}

/**
 * Vị trí + nội dung của (các) hào động và hào biến tương ứng.
 *
 * Mặc định đọc `que.queBien` (đúng 1 hào động, luồng Mai Hoa Dịch Số) — trả mảng rỗng nếu
 * không có hoặc không tìm được quẻ biến. Truyền `viTriHaoDongOverride` khi quẻ có thể có
 * NHIỀU hào động cùng lúc (Coin Casting — xem `core/coinCasting/`, `que.queBien` không mang
 * ý nghĩa gì trong trường hợp đó).
 */
export function haoDongVaDienBien(
  que: QueDich,
  viTriHaoDongOverride?: number[],
): Array<{ vach: number; truoc: string; sau: string }> {
  if (!que.queDichBien) return [];
  const viTriDs = viTriHaoDongOverride ?? (que.queBien >= 1 && que.queBien <= 6 ? [que.queBien] : []);
  return viTriDs.map((vach) => ({
    vach,
    truoc: que.hao[vach].napgiap,
    sau: que.queDichBien!.hao[vach].napgiap,
  }));
}

const MO_TA_THEO_MUC: Record<MucDo, string> = {
  thuan:
    "Quẻ cho thấy tình thế hiện tại có xu hướng thuận lợi cho việc đang hỏi. Có thể cân nhắc chủ động xúc tiến, nhưng vẫn nên giữ đúng nguyên tắc, tránh chủ quan.",
  trungTinh:
    "Quẻ cho thấy tình thế hiện tại chưa rõ thuận hay nghịch. Có thể cần thêm thời gian hoặc quan sát thêm trước khi quyết định.",
  canThanTrong:
    "Quẻ cho thấy tình thế hiện tại có nhiều điểm cần lưu ý cho việc đang hỏi. Có xu hướng nên thận trọng, tránh nóng vội hoặc cưỡng cầu.",
};

const TOM_TAT_KHONG_DUNG_THAN =
  "Đây là kết quả xem chung, không gắn với một việc cụ thể — xem điểm vượng suy từng Lục Thân bên dưới để đánh giá theo từng khía cạnh (công việc, tài lộc, gia đạo...).";

/** Câu tóm tắt cho khu vực KẾT QUẢ — ngôn ngữ có chừa dư địa, không khẳng định tuyệt đối
 * (đúng yêu cầu "NO FALSE CERTAINTY" của brief), không phải kết luận khoa học đã kiểm chứng.
 * `mucDo` là null khi xem chung/quẻ cuộc đời (không có Dụng Thần cụ thể). */
export function tomTatKetQua(mucDo: MucDo | null): string {
  return mucDo ? MO_TA_THEO_MUC[mucDo] : TOM_TAT_KHONG_DUNG_THAN;
}

const GOI_Y_THEO_MUC: Record<MucDo, string> = {
  thuan: "Quẻ gợi ý đây là thời điểm có thể cân nhắc tiến hành, miễn là vẫn giữ chính đạo và không chủ quan.",
  trungTinh: "Quẻ gợi ý nên quan sát thêm, chưa vội quyết định nếu chưa thật cần thiết.",
  canThanTrong: "Quẻ gợi ý nên thận trọng, cân nhắc kỹ trước khi hành động, tránh việc cưỡng cầu trong giai đoạn này.",
};

/** Gợi ý ứng xử — cố tình dùng "gợi ý"/"có thể"/"có xu hướng", KHÔNG dùng ngôn ngữ khẳng định
 * chắc chắn hay số liệu xác suất giả (đúng mục 3 của brief). */
export function goiYUngXu(mucDo: MucDo): string {
  return GOI_Y_THEO_MUC[mucDo];
}
