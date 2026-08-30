/** Map tên Ngũ Hành sang class CSS màu tương ứng, giữ đúng quy ước của bản gốc:
 * Thủy=xanh dương, Hỏa=đỏ, Thổ=cam, Kim=bạc, Mộc=xanh lá (xem index.css). */
const MAP: Record<string, string> = {
  "Kim": "mau-kim",
  "Mộc": "mau-moc",
  "Thủy": "mau-thuy",
  "Hỏa": "mau-hoa",
  "Thổ": "mau-tho",
};

export function classMauNguHanh(nguHanh: string): string {
  return MAP[nguHanh] ?? "";
}
