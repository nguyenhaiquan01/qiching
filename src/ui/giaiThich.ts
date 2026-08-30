import type { QueDich } from "../core/queDich";
import { yNghiaLucThan } from "../core/business";

/**
 * Port từ frmKinhDich.XacDinhQueKinhDich — sinh đoạn giải thích theo điểm số từng hào.
 * Ngưỡng điểm giữ nguyên bản gốc: >3 Rất Cát, (1,3] Cát, [0,1] Bình, (-3,0) Hung, <=-3 Cực Hung.
 */
export function giaiThichQue(que: QueDich): string {
  const dong = ["Quẻ này cho biết"];
  for (let i = 1; i <= 6; i++) {
    const hao = que.hao[i];
    const yNghia = yNghiaLucThan(hao.lucthan);
    let muc: string;
    if (hao.diemso > 3) muc = "RẤT CÁT";
    else if (hao.diemso > 1) muc = "CÁT";
    else if (hao.diemso >= 0) muc = "BÌNH";
    else if (hao.diemso > -3) muc = "HUNG";
    else muc = "CỰC HUNG";
    dong.push(`${i}. ${yNghia} ${muc}`);
  }
  return dong.join("\n");
}
