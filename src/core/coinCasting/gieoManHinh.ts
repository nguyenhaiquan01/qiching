import type { MatXu } from "./types";

/**
 * BR-SCREEN-03/04 (Feature Spec): mỗi đồng xu phải random ĐỘC LẬP với P(Ngửa)=P(Sấp)=0.5 —
 * KHÔNG random trực tiếp 4 loại hào với xác suất 25% mỗi loại (sẽ sai phân phối tự nhiên
 * 1/8 · 3/8 · 3/8 · 1/8 của phương pháp 3 đồng xu thật).
 */
export function gieoBaDongXu(): [MatXu, MatXu, MatXu] {
  const random1Xu = (): MatXu => (Math.random() < 0.5 ? "Ngửa" : "Sấp");
  return [random1Xu(), random1Xu(), random1Xu()];
}
