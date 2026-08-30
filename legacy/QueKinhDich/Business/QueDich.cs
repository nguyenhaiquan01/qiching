using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinhDich
{    
    /// <summary>
    /// Lớp mô tả một quẻ dịch
    /// </summary>
    public class QueDich
    {
        public Hao[] hao;
        public Dictionary<string, int> diemLucThan;

        public int soQueThuong, soQueHa;
        public int quebien;
        public string Cung;
        public string TenQueThuong, TenQueHa, TenQueDich;
        int HaoThe, HaoUng;
        NgayAmLich amlich;

        public QueDich QueDichBien;
        public QueDich QueChu;

        /// <summary>
        /// Khởi tạo một quẻ dịch
        /// </summary>
        public QueDich()
        {
            hao = new Hao[7];
            for (int i = 0; i < 7; i++)
                hao[i] = new Hao();
            quebien = 0;
            soQueThuong = 0; soQueHa = 0;
            diemLucThan = new Dictionary<string, int>();
            for (int i = 0; i < 5; i++)
                diemLucThan.Add(Const.lucthan[i], int.MinValue);
        }        
        /// <summary>
        /// Tạo một quẻ dịch với quẻ thượng và quẻ hạ có tên được xác định trước
        /// </summary>
        /// <param name="quethuong"></param>
        /// <param name="queha"></param>
        public QueDich(DateTime time, string quethuong, string queha)
        {
            amlich = new NgayAmLich(time);
            hao = new Hao[7];
            for (int i = 0; i < 7; i++)
                hao[i] = new Hao();
            diemLucThan = new Dictionary<string, int>();
            for (int i = 0; i < 5; i++)
                diemLucThan.Add(Const.lucthan[i], int.MinValue);
            //business.XacDinhQueKinhDich(time, out soQueThuong, out soQueHa, out quebien, out TenQueThuong, out TenQueHa);
            TenQueThuong = quethuong;
            TenQueHa = queha;
            quebien = 0;
            soQueThuong = business.vitriTienThien(quethuong);
            soQueHa = business.vitriTienThien(queha);

            TenQueDich = business.findTenQue6Hao(TenQueThuong, TenQueHa);
            Cung = business.findCungQueDich(TenQueThuong, TenQueHa);
            NapGiap();
        }

        /// <summary>
        /// Tạo quẻ dịch với thời gian cho trước (dương lịch)
        /// </summary>
        /// <param name="time"></param>
        public QueDich(DateTime time)
        {
            amlich = new NgayAmLich(time);
            hao = new Hao[7];
            for (int i = 0; i < 7; i++)
                hao[i] = new Hao();
            diemLucThan = new Dictionary<string, int>();
            for (int i = 0; i < 5; i++)
                diemLucThan.Add(Const.lucthan[i], int.MinValue);

            business.XacDinhQueKinhDich(time, out soQueThuong, out soQueHa, out quebien, out TenQueThuong, out TenQueHa);
            TenQueDich = business.findTenQue6Hao(TenQueThuong, TenQueHa);
            Cung = business.findCungQueDich(TenQueThuong, TenQueHa);
            NapGiap();
        }

        /// <summary>
        /// Tạo quẻ dịch cuộc đời
        /// </summary>
        /// <param name="time"></param>
        public QueDich(DateTime time,bool cuocdoi)
        {
            if (cuocdoi == false) return;

            amlich = new NgayAmLich(time);
            hao = new Hao[7];
            for (int i = 0; i < 7; i++)
                hao[i] = new Hao();
            diemLucThan = new Dictionary<string, int>();
            for (int i = 0; i < 5; i++)
                diemLucThan.Add(Const.lucthan[i], int.MinValue);

            business.XacDinhQueCuocDoi(time, out soQueThuong, out soQueHa, out quebien, out TenQueThuong, out TenQueHa);
            TenQueDich = business.findTenQue6Hao(TenQueThuong, TenQueHa);
            Cung = business.findCungQueDich(TenQueThuong, TenQueHa);
            NapGiap();
        }

        public void BienQue()
        {
            business.BienQue(soQueThuong, soQueHa, quebien, out TenQueThuong, out TenQueHa);
            TenQueDich = business.findTenQue6Hao(TenQueThuong, TenQueHa);

            soQueThuong = business.findSoQueTienThien(TenQueThuong);
            soQueHa = business.findSoQueTienThien(TenQueHa);
            quebien = 0;

            NapGiap();
        }

        private void TuanKhong()
        {
            string tuankhong1, tuankhong2;
            //Tinh Tuan Khong
            business.TuanKhong(amlich.ThienCanNgay, amlich.DiaChiNgay, out tuankhong1, out tuankhong2);

            for (int i = 1; i < 7; i++)
                hao[i].TuanKhong = false;
            for (int i = 1; i < 7; i++)
                if ((hao[i].chi == tuankhong1) || (hao[i].chi == tuankhong2))
                    hao[i].TuanKhong = true;

            for (int i = 1; i < 7; i++)
                if (hao[i].TuanKhong) hao[i].napgiap = hao[i].napgiap + "- Không";
        }

        private void Than()
        {

            string thanhao1 = business.findThan(amlich.ThienCanNgay);

            int j = 0;
            while (Const.than[j] != thanhao1) j++;

            for (int i = 1; i < 7; i++)
            {
                hao[i].than = Const.than[j];
                j++;
            }
        }

        /// <summary>
        /// Nap Giap cho cac Hao
        /// </summary>
        public void NapGiap()
        {
            business.findNapGiapQueThuong(Cung, TenQueThuong, ref hao[4], ref hao[5], ref hao[6]);
            business.findNapGiapQueHa(Cung, TenQueHa, ref hao[1], ref hao[2], ref hao[3]);

            //Tìm hào thế, ứng
            HaoThe = business.findHaoThe(TenQueDich);
            if (HaoThe == 6) HaoUng = 3;
            if (HaoThe == 5) HaoUng = 2;
            if (HaoThe == 4) HaoUng = 1;
            if (HaoThe == 3) HaoUng = 6;
            if (HaoThe == 2) HaoUng = 5;
            if (HaoThe == 1) HaoUng = 4;
            hao[HaoThe].napgiap = hao[HaoThe].napgiap + " (Thế)";
            hao[HaoThe].HaoThe = true;

            hao[HaoUng].napgiap = hao[HaoUng].napgiap + " (Ứng)";
            hao[HaoUng].HaoUng = true;

            //Tính Tuần Không
            TuanKhong();

            //Tính Lục Thần
            Than();
        }

        private void TinhDiemHao(string nguhanh, ref Hao hao)
        {
            if (nguhanh == hao.nguhanh)
                hao.diemso = hao.diemso + 2;
            else
                if (business.TuongSinh(nguhanh, hao.nguhanh))
                    hao.diemso = hao.diemso + 2;
                else
                    //Mat suc do sinh
                    if (business.TuongSinh(hao.nguhanh, nguhanh))
                        hao.diemso = hao.diemso - 1;
                    else
                        //Mat suc do khac
                        if (business.TuongKhac(hao.nguhanh, nguhanh))
                            hao.diemso = hao.diemso - 1;
                        //Bi ngay khac
                        else
                            if (business.TuongKhac(nguhanh, hao.nguhanh))
                                hao.diemso = hao.diemso - 2;
        }

        /// <summary>
        /// Xác định điểm số cho lục thân
        /// </summary>
        private void TinhDiemLucThan()
        {

            for (int i = 1; i < 7; i++)
            {
                int diemhienthoi = diemLucThan[hao[i].lucthan];
                diemLucThan[hao[i].lucthan] = Math.Max(diemhienthoi, hao[i].diemso);
            }

            Dictionary<string, int> temp = new Dictionary<string, int>(diemLucThan);

            foreach (var d in temp)
                if ((int)d.Value == int.MinValue)
                {
                    //Neu khong co trong hao, phai tinh diem dua tren que chu
                    //QueDich _quechu = new QueDich(amlich.NgayDuonglich,Cung, Cung);

                    //Lay diem so cua que chu
                    //diemLucThan.Add(d.Key,QueChu.diemLucThan[d.Key]);
                    diemLucThan.Remove(d.Key);
                    diemLucThan.Add(d.Key, QueChu.diemLucThan[d.Key]);
                }
        }

        private void TinhDiemHao(int isQueChu)
        {
            for (int i = 1; i < 7; i++)
            {
                //Xac dinh diem so cho tu Hao

                //Nhat Kien sinh tro
                string nguhanhNgay = business.findNguHanh(amlich.DiaChiNgay);
                TinhDiemHao(nguhanhNgay, ref hao[i]);

                //Nguyet Kien sinh tro
                string nguhanhThang = business.findNguHanh(amlich.DiaChiThang);
                TinhDiemHao(nguhanhThang, ref hao[i]);

                //Hao Bien sinh tro
                string nguhanhHaoDong = hao[quebien].nguhanh;
                TinhDiemHao(nguhanhHaoDong, ref hao[i]);

                if (isQueChu != 0)
                {
                    string nguhanhHaoBien = QueDichBien.hao[i].nguhanh;
                    TinhDiemHao(nguhanhHaoBien, ref hao[i]);
                }
            }
        }
        /// <summary>
        /// Tính độ vượng suy của một quẻ
        /// </summary>
        public void GiaiQue()
        {
            QueDichBien = new QueDich(amlich.NgayDuonglich);
            //QueDichBien = new QueDich(que);
            QueDichBien.BienQue();
            
            QueChu = new QueDich(amlich.NgayDuonglich, Cung, Cung);

            QueChu.TinhDiemHao(0);
            QueChu.TinhDiemLucThan();
            
            TinhDiemHao(1);
            TinhDiemLucThan();            
        }

        /// <summary>
        /// Tính độ vượng suy của một quẻ
        /// </summary>
        public void GiaiQueCuocDoi()
        {
            QueDichBien = new QueDich(amlich.NgayDuonglich,true);//Tinh theo que cuoc doi            
            QueDichBien.BienQue();

            QueChu = new QueDich(amlich.NgayDuonglich, Cung, Cung);

            QueChu.TinhDiemHao(0);
            QueChu.TinhDiemLucThan();

            TinhDiemHao(1);
            TinhDiemLucThan();
        }
    }
}
