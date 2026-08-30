/**
 * Web Worker cho vòng lặp "Tìm ngày tốt" (port từ frmTimNgayTotTheoQueDich.TimNgayTot) —
 * chạy trong Worker để không chặn UI thread khi quét khoảng thời gian dài, theo đúng Giai
 * đoạn 3 của kế hoạch migrate.
 */
import { QueDich } from "./queDich";
import { thoiDiemKeTiep } from "./business";
import { ThoiDiem, LUC_THAN } from "./const";

export interface YeuCauTimNgayTot {
  ngayBatDauIso: string;
  ngayKetThucIso: string;
  viec: string;
  nguong: number;
  thoiDiem: ThoiDiem;
}

export interface DongKetQua {
  thoiGianIso: string;
  tenQueDich: string;
  tenQueBien: string;
  diemViec: number;
  diemLucThan: Record<string, number>;
}

export type ThongDiepTuWorker =
  | { type: "tienDo"; daXuLy: number; uocLuongTong: number }
  | { type: "ketQua"; dong: DongKetQua }
  | { type: "xong"; tongSo: number };

self.onmessage = (e: MessageEvent<YeuCauTimNgayTot>) => {
  const { ngayBatDauIso, ngayKetThucIso, viec, nguong, thoiDiem } = e.data;
  const ngayBatDau = new Date(ngayBatDauIso);
  const ngayKetThuc = new Date(ngayKetThucIso);

  const uocLuongTong = uocLuongSoBuoc(ngayBatDau, ngayKetThuc, thoiDiem);

  let ngayDuyet = ngayBatDau;
  let daXuLy = 0;
  let tongSoKetQua = 0;
  const moc = Date.now();
  let mocBaoCao = moc;

  while (ngayDuyet.getTime() < ngayKetThuc.getTime()) {
    const que = new QueDich(ngayDuyet);
    que.giaiQue();

    if (que.diemLucThan[viec] > nguong) {
      tongSoKetQua++;
      const dong: DongKetQua = {
        thoiGianIso: ngayDuyet.toISOString(),
        tenQueDich: que.tenQueDich,
        tenQueBien: que.queDichBien!.tenQueDich,
        diemViec: que.diemLucThan[viec],
        diemLucThan: Object.fromEntries(LUC_THAN.map((lt) => [lt, que.diemLucThan[lt]])),
      };
      const thongDiep: ThongDiepTuWorker = { type: "ketQua", dong };
      postMessage(thongDiep);
    }

    daXuLy++;
    const bayGio = Date.now();
    if (bayGio - mocBaoCao > 100) {
      mocBaoCao = bayGio;
      const tienDo: ThongDiepTuWorker = { type: "tienDo", daXuLy, uocLuongTong };
      postMessage(tienDo);
    }

    ngayDuyet = thoiDiemKeTiep(thoiDiem, ngayDuyet);
  }

  const xong: ThongDiepTuWorker = { type: "xong", tongSo: tongSoKetQua };
  postMessage(xong);
};

function uocLuongSoBuoc(batDau: Date, ketThuc: Date, thoiDiem: ThoiDiem): number {
  const soMs = ketThuc.getTime() - batDau.getTime();
  const soGio = soMs / (1000 * 60 * 60);
  switch (thoiDiem) {
    case ThoiDiem.HaiGio:
      return Math.max(1, Math.ceil(soGio / 2));
    case ThoiDiem.Gio:
      return Math.max(1, Math.ceil(soGio));
    case ThoiDiem.Ngay:
      return Math.max(1, Math.ceil(soGio / 24));
    case ThoiDiem.Thang:
      return Math.max(1, Math.ceil(soGio / (24 * 31)));
    default:
      return 1;
  }
}
