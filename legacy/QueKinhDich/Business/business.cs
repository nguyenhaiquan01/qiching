using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;

namespace KinhDich
{        
    /// <summary>
    /// Lớp chính mô tả các chức năng
    /// </summary>
    public class business
    {
        static public void LoadAllData()
        {
            int i, j,k;

            for (i = 0; i < Const.TienThien.Length; i++)
            {
                dataAccess.findTenQueDon(Const.TienThien[i]);
                dataAccess.findThongTinQue(Const.TienThien[i]);
            }

            for (i = 0; i < Const.TienThien.Length; i++)
                for (j = 0; j < Const.TienThien.Length; j++)
                {
                    dataAccess.findTenQue6Hao(Const.TienThien[i], Const.TienThien[j]);
                }

            for (i = 0; i <= 1; i++)
                for (j = 0; j <= 1; j++)
                    for (k = 0; k <= 1; k++)
                        dataAccess.findTenQueByHao(i, j, k);
            for (i = 0; i < Const.que6hao.Length; i++)
            {
                dataAccess.find6Hao(Const.que6hao[i]);
                dataAccess.findHaoThe(Const.que6hao[i]);
            }
            for (i = 0; i < Const.ThienCan.Length; i++)
                dataAccess.findNguHanh(Const.ThienCan[i]);

            for (i = 0; i < Const.DiaChi.Length; i++)
                dataAccess.findNguHanh(Const.DiaChi[i]);

            for (i = 0; i < Const.TienThien.Length; i++)
                dataAccess.findNguHanh(Const.TienThien[i]);
            for (i=0;i<Const.NguHanh.Length;i++)
                for (j = 0; j < Const.NguHanh.Length; j++)
                {
                    dataAccess.TuongSinh(Const.NguHanh[i], Const.NguHanh[j]);
                    dataAccess.TuongKhac(Const.NguHanh[i], Const.NguHanh[j]);
                }
        }
        /// <summary>
        /// Tìm lục thần cho một hào
        /// </summary>
        /// <param name="canngay"></param>
        /// <returns></returns>
        static public string findThan(string canngay)
        {
            return dataAccess.findLucThan(canngay);
        }

        static public bool TuongSinh(string NguHanh1,string NguHanh2)
        {
            return dataAccess.TuongSinh(NguHanh1, NguHanh2);
        }

        static public bool TuongKhac(string NguHanh1, string NguHanh2)
        {
            return dataAccess.TuongKhac(NguHanh1, NguHanh2);
        }

        static public int findSoQueTienThien(string quebatquai)
        {
            //return dataAccess.findSoQueTienThien(quebatquai);
            return vitriTienThien(quebatquai)+1;
        }

        static public int findSoQueHauThien(string quebatquai)
        {
            //return dataAccess.findSoQueHauThien(quebatquai);
            return vitriHauThien(quebatquai) + 1;
        }

        static public string YNghiaLucThan(string lucthan)
        {
            return dataAccess.findYNghiaLucThan(lucthan);
        }

        static public string findNguHanhNapAm(string can,string chi)
        {
            return dataAccess.findNguHanhNapAm(can,chi);
        }

        /// <summary>
        /// Xac dinh ngay am lich tu ngay duong
        /// </summary>
        /// <param name="time"></param>
        /// <param name="y"></param>
        /// <param name="m"></param>
        /// <param name="d"></param>
        static public void HienThiNgayAmLich(DateTime time, out int y, out int m, out int d,out int leapMonth)
        {
            DateTime newtime;
            int year, month, day;

            //Kiem tra xem co phai la 23h ko
            if (time.Hour < 23)
                newtime = new DateTime(time.Year, time.Month,
                    time.Day, time.Hour, time.Minute, time.Second, time.Millisecond);
            else
            {
                year = time.Year;
                month = time.Month;
                day = time.Day;
                HQVietnameseCalendar.NextAvailableDate(ref year, ref month, ref day);
                newtime = new DateTime(year, month, day,
                    time.Hour, time.Minute, time.Second, time.Millisecond);
            }
            //Doi qua Am Lich
            VietnameseCalendar.FromDateTime(newtime, out y, out m, out d, out leapMonth);
        }

        /// <summary>
        /// Tu thoi gian nhap, xac dinh que thuong, que ha, que bien
        /// </summary>
        /// <param name="time"></param>
        /// <param name="quethuong"></param>
        /// <param name="queha"></param>
        /// <param name="quebien"></param>
        /// <param name="TenQueThuong"></param>
        /// <param name="TenQueHa"></param>
        static public void XacDinhQueKinhDich(DateTime time, out int quethuong, out int queha, out int quebien,out string TenQueThuong,out string TenQueHa)
        {
            DateTime newtime;
            //Kiem tra xem co phai la 23h ko
            if (time.Hour < 23)
                newtime = new DateTime(time.Year, time.Month,
                    time.Day, time.Hour, time.Minute, time.Second, time.Millisecond);
            else
            {
                int year = time.Year;
                int month = time.Month;
                int day = time.Day;
                HQVietnameseCalendar.NextAvailableDate(ref year, ref month, ref day);
                newtime = new DateTime(year, month, day,
                    time.Hour, time.Minute, time.Second, time.Millisecond);
            }

            int y, m, d, h, leapMonth;

            VietnameseCalendar.FromDateTime(newtime, out y, out m, out d, out leapMonth);

            string monthname=VietnameseCalendar.GetMonthName(y,m);
            if (monthname.Contains("Tý"))
                m = 11;
            else
                if (monthname.Contains("Sửu"))
                    m = 12;
                else
                    if (monthname.Contains("Dần"))
                        m = 1;
                    else
                        if (monthname.Contains("Mão"))
                            m = 2;
                        else
                            if (monthname.Contains("Thìn"))
                                m = 3;
                            else
                                if (monthname.Contains("Tỵ"))
                                    m = 4;
                                else
                                    if (monthname.Contains("Ngọ"))
                                        m = 5;
                                    else
                                        if (monthname.Contains("Mùi"))
                                            m = 6;
                                        else
                                            if (monthname.Contains("Thân"))
                                                m = 7;
                                            else
                                                if (monthname.Contains("Dậu"))
                                                    m = 8;
                                                else
                                                    if (monthname.Contains("Tuất"))
                                                        m = 9;
                                                    else
                                                        if (monthname.Contains("Hợi"))
                                                            m = 10;

            //Xác định quẻ theo tiết lệnh
            if (Const.TietLenh)
            {
                //Nếu qua tháng 1, vẫn trong Đại hàn
                if (VietnameseCalendar.GetMinorSolarTerms(newtime).Contains("Đại hàn") && (m == 1))
                    y = y - 1;
            }

            if (VietnameseCalendar.GetYearName(y).Contains("Tý"))
                y = 1;
            else
                if (VietnameseCalendar.GetYearName(y).Contains("Sửu"))
                    y = 2;
                else
                    if (VietnameseCalendar.GetYearName(y).Contains("Dần"))
                        y = 3;
                    else
                        if (VietnameseCalendar.GetYearName(y).Contains("Mão"))
                            y = 4;
                        else
                            if (VietnameseCalendar.GetYearName(y).Contains("Thìn"))
                                y = 5;
                            else
                                if (VietnameseCalendar.GetYearName(y).Contains("Tỵ"))
                                    y = 6;
                                else
                                    if (VietnameseCalendar.GetYearName(y).Contains("Ngọ"))
                                        y = 7;
                                    else
                                        if (VietnameseCalendar.GetYearName(y).Contains("Mùi"))
                                            y = 8;
                                        else
                                            if (VietnameseCalendar.GetYearName(y).Contains("Thân"))
                                                y = 9;
                                            else
                                                if (VietnameseCalendar.GetYearName(y).Contains("Dậu"))
                                                    y = 10;
                                                else
                                                    if (VietnameseCalendar.GetYearName(y).Contains("Tuất"))
                                                        y = 11;
                                                    else
                                                        if (VietnameseCalendar.GetYearName(y).Contains("Hợi"))
                                                            y = 12;
            int soquethuong = y + m + d;

            if (time.Hour < 23)
            {
                if (time.Hour % 2 != 0)
                    h = (time.Hour + 1) / 2;
                else h = time.Hour / 2;
                h++;
            }
            else
                h = 1;

            int soqueha = soquethuong + h;

            
            quethuong = soquethuong % 8;
            queha = soqueha % 8;
            quebien = soqueha % 6;

            if (quethuong == 0) quethuong = 7;
            else quethuong--;
            if (queha == 0) queha = 7;
            else queha--;
            if (quebien == 0) quebien = 6;

            TenQueThuong = Const.TienThien[quethuong];
            TenQueHa = Const.TienThien[queha];
        }

        /// <summary>
        /// Tu que kinh dich, bien que
        /// </summary>
        /// <param name="quethuong"></param>
        /// <param name="queha"></param>
        /// <param name="quebien"></param>
        /// <param name="queBienThuong"></param>
        /// <param name="queBienHa"></param>
        static public void BienQue(int quethuong, int queha, int quebien,out string queBienThuong,out string queBienHa)
        {
            int hao1,hao2, hao3;
            if (quebien > 3)
            {
                queBienHa = Const.TienThien[queha];
                //Bien Que Thuong
                kinhdich.QueKinhDichRow rowQueThuong=dataAccess.findThongTinQue(Const.TienThien[quethuong]);
                hao1 = rowQueThuong.Hao1;
                hao2 = rowQueThuong.Hao2;
                hao3 = rowQueThuong.Hao3;

                if (quebien == 4)
                {
                    hao1 = 1 - hao1;
                }
                if (quebien == 5)
                {
                    hao2 = 1 - hao2;
                }
                if (quebien == 6)
                {
                    hao3 = 1 - hao3;
                }

                queBienThuong = dataAccess.findTenQueByHao(hao1, hao2, hao3);
            }
            else
            {
                queBienThuong = Const.TienThien[quethuong];
                //Xac dinh que bien Ha

                kinhdich.QueKinhDichRow rowQueHa = dataAccess.findThongTinQue(Const.TienThien[queha]);
                hao1 = rowQueHa.Hao1;
                hao2 = rowQueHa.Hao2;
                hao3 = rowQueHa.Hao3;

                if (quebien == 1)
                {
                    hao1 = 1 - hao1;
                }
                if (quebien == 2)
                {
                    hao2 = 1 - hao2;
                }
                if (quebien == 3)
                {
                    hao3 = 1 - hao3;
                }

                queBienHa = dataAccess.findTenQueByHao(hao1, hao2, hao3);
            }

        }

        /// <summary>
        /// Nạp giáp cho từng hào, dựa trên ngũ hành của Hào và Ngũ Hành của Quẻ
        /// </summary>
        /// <param name="nguhanhhao"></param>
        /// <param name="NguHanhQue"></param>
        /// <param name="napgiaphao"></param>
        static public void NapGiap(string nguhanhhao,string NguHanhQue,out string napgiaphao)
        {
            napgiaphao = "";
            if (nguhanhhao == NguHanhQue) napgiaphao = "Huynh Đệ";
            if (TuongSinh(nguhanhhao, NguHanhQue)) napgiaphao = "Phụ Mẫu";
            if (TuongSinh(NguHanhQue,nguhanhhao)) napgiaphao = "Tử Tôn";
            if (TuongKhac(nguhanhhao, NguHanhQue)) napgiaphao = "Quan Quỷ";
            if (TuongKhac(NguHanhQue,nguhanhhao)) napgiaphao = "Thê Tài";
        }

        /// <summary>
        /// Nap giap cho que thuong
        /// </summary>
        /// <param name="quethuong"></param>
        /// <param name="hao4"></param>
        /// <param name="hao5"></param>
        /// <param name="hao6"></param>
        static public void findNapGiapQueThuong(string cungque,string quethuong,ref Hao hao4, ref Hao hao5, ref Hao hao6)
        {
            string napgiaphao4, napgiaphao5, napgiaphao6, nguhanhhao4, nguhanhhao5, nguhanhhao6;
            string NguHanhQue=dataAccess.findNguHanh(cungque);

            kinhdich.QueKinhDichRow row=dataAccess.findThongTinQue(quethuong);

            nguhanhhao4 = dataAccess.findNguHanh(row.NapGiapH4);
            nguhanhhao5 = dataAccess.findNguHanh(row.NapGiapH5);
            nguhanhhao6 = dataAccess.findNguHanh(row.NapGiapH6);
            
            NapGiap(nguhanhhao4,NguHanhQue,out napgiaphao4);
            NapGiap(nguhanhhao5, NguHanhQue, out napgiaphao5);
            NapGiap(nguhanhhao6, NguHanhQue, out napgiaphao6);

            hao4.lucthan = napgiaphao4;
            hao5.lucthan = napgiaphao5;
            hao6.lucthan = napgiaphao6;

            hao4.chi = row.NapGiapH4;
            hao5.chi = row.NapGiapH5;
            hao6.chi = row.NapGiapH6;

            hao4.nguhanh = nguhanhhao4;
            hao5.nguhanh = nguhanhhao5;
            hao6.nguhanh = nguhanhhao6;

            hao4.napgiap = napgiaphao4+" "+row.NapGiapH4 + " " + nguhanhhao4;
            hao5.napgiap = napgiaphao5 + " " + row.NapGiapH5 + " " + nguhanhhao5;
            hao6.napgiap = napgiaphao6 + " " + row.NapGiapH6 + " " + nguhanhhao6;
        }

        /// <summary>
        /// Nap giap cho que ha
        /// </summary>
        /// <param name="queha"></param>
        /// <param name="hao1"></param>
        /// <param name="hao2"></param>
        /// <param name="hao3"></param>
        static public void findNapGiapQueHa(string cungque,string queha,ref Hao hao1,ref Hao hao2,ref Hao hao3)
        {
            string napgiaphao1, napgiaphao2, napgiaphao3, nguhanhhao1, nguhanhhao2, nguhanhhao3;
            string NguHanhQue = dataAccess.findNguHanh(cungque);

            kinhdich.QueKinhDichRow row = dataAccess.findThongTinQue(queha);

            nguhanhhao1 = dataAccess.findNguHanh(row.NapGiapH1);
            nguhanhhao2 = dataAccess.findNguHanh(row.NapGiapH2);
            nguhanhhao3 = dataAccess.findNguHanh(row.NapGiapH3);

            NapGiap(nguhanhhao1, NguHanhQue, out napgiaphao1);
            NapGiap(nguhanhhao2, NguHanhQue, out napgiaphao2);
            NapGiap(nguhanhhao3, NguHanhQue, out napgiaphao3);

            hao1.lucthan = napgiaphao1;
            hao2.lucthan = napgiaphao2;
            hao3.lucthan = napgiaphao3;

            hao1.chi = row.NapGiapH1;
            hao2.chi = row.NapGiapH2;
            hao3.chi = row.NapGiapH3;

            hao1.nguhanh = nguhanhhao1;
            hao2.nguhanh = nguhanhhao2;
            hao3.nguhanh = nguhanhhao3;

            hao1.napgiap = napgiaphao1 + " " + row.NapGiapH1 + " " + nguhanhhao1;
            hao2.napgiap = napgiaphao2 + " " + row.NapGiapH2 + " " + nguhanhhao2;
            hao3.napgiap = napgiaphao3 + " " + row.NapGiapH3 + " " + nguhanhhao3;
        }

        /// <summary>
        /// Tim cung cua que dich voi input la que thuong, hoac ha
        /// </summary>
        /// <param name="quethuong"></param>
        /// <param name="queha"></param>
        /// <returns></returns>
        static public string findCungQueDich(string quethuong, string queha)
        {
            string tenque=findTenQue6Hao(quethuong,queha);
            return find6Hao(tenque).Cung;
        }

        static public string findTenQueDon(string tenque)
        {
            return dataAccess.findTenQueDon(tenque);
        }
        
        static public string findTenQue6Hao(string quethuong, string queha)
        {
            return dataAccess.findTenQue6Hao(quethuong, queha);
        }

        /// <summary>
        /// call to dataaccess layer function
        /// </summary>
        /// <param name="Hao1"></param>
        /// <param name="Hao2"></param>
        /// <param name="Hao3"></param>
        /// <returns></returns>
        static public kinhdich.Que6HaoRow find6Hao(string tenque)
        {
            return dataAccess.find6Hao(tenque);
        }

        /// <summary>
        /// call to dataaccess layer function
        /// </summary>
        /// <param name="Hao1"></param>
        /// <param name="Hao2"></param>
        /// <param name="Hao3"></param>
        /// <returns></returns>
        static public kinhdich.QueKinhDichRow findThongTinQue(string batquai)
        {
            return dataAccess.findThongTinQue(batquai);
        }
        
        /// <summary>
        /// call to dataaccess layer function
        /// </summary>
        /// <param name="Hao1"></param>
        /// <param name="Hao2"></param>
        /// <param name="Hao3"></param>
        /// <returns></returns>
        static public string findTenQueByHao(int Hao1, int Hao2, int Hao3)
        {
            return dataAccess.findTenQueByHao(Hao1, Hao2, Hao3);
        }

        /// <summary>
        /// call to dataaccess layer function
        /// </summary>
        /// <param name="ten"></param>
        /// <returns></returns>
        static public string findNguHanh(string ten)
        {
            return dataAccess.findNguHanh(ten);
        }

        /// <summary>
        /// Goi database de xac dinh Hao The cua mot que Dich
        /// </summary>
        /// <param name="quedich"></param>
        /// <returns></returns>
        static public int findHaoThe(string quedich)
        {
            return dataAccess.findHaoThe(quedich);
        }

        static public void TuanKhong(string ThienCanNgay, string DiaChiNgay,out string tuankhong1,out string tuankhong2)
        {
            
            int j = 0;
            while (Const.DiaChi[j]!=DiaChiNgay)
                j++;

            int i = 0;
            while (Const.ThienCan[i] != ThienCanNgay)
            {
                i++; j--;
                if (i > 9) i = 0;
                if (j < 0) j = 11;
            }
            if (j - 1 < 0) j = 12;
            tuankhong1 = Const.DiaChi[j - 1];

            if (j - 2 < 0) j = 13;
            tuankhong2 = Const.DiaChi[j - 2];
        }

        /// <summary>
        /// Xác định số của quẻ theo tiên thiên
        /// </summary>
        /// <param name="que"></param>
        /// <returns></returns>
        static public int vitriTienThien(string que)
        {
            int i = 0;
            while (Const.TienThien[i] != que) i++;
            return i;
        }

        /// <summary>
        /// Xác định số của quẻ theo hậu thiên
        /// </summary>
        /// <param name="que"></param>
        /// <returns></returns>
        static public int vitriHauThien(string que)
        {
            int i = 0;
            while (Const.HauThien[i] != que) i++;
            return i;
        }
         
        /// <summary>
        /// Xac dinh ngay tot cho mot viec
        /// </summary>
        /// <param name="ngaybatdau"></param>
        /// <param name="ngayketthuc"></param>
        /// <param name="viec"></param>
        /// <param name="ngaytot"></param>
        static public void TimNgayTot(DateTime ngaybatdau,DateTime ngayketthuc,string viec,out List<DateTime> ngaytot)
        {
            ngaytot = new List<DateTime>();
            DateTime ngayduyet = new DateTime();
            DateTime ngayke = new DateTime();

            ngayduyet = ngaybatdau;
            //Neu van nho hon ngay ket thuc
            while (ngayduyet.CompareTo(ngayketthuc) < 0)
            {
                //Tinh que dich cho ngay hien tai
                QueDich quedich = new QueDich(ngayduyet);
                quedich.GiaiQue();

                //Neu thoa dieu kien thi output ra DataGridView
                if (quedich.diemLucThan[viec] > 3)
                    ngaytot.Add(ngayduyet);

                //Neu que dich, tuong ung voi viec gi, hao gi
                ThoiDiemKeTiep(Const.ThoiDiem.HaiGio,ngayduyet, out ngayke);
                ngayduyet=ngayke;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thoidiem"></param>
        /// <param name="ngay"></param>
        /// <param name="ngayketiep"></param>
        static public void ThoiDiemKeTiep(Const.ThoiDiem thoidiem, DateTime ngay,out DateTime ngayketiep)
        {
            int Hour, Day, Month, Year;

            Year = ngay.Year;
            Month = ngay.Month;
            Day = ngay.Day;

            Hour = ngay.Hour;
            //ngayketiep=ngay;

            if (thoidiem.Equals(Const.ThoiDiem.HaiGio))
            {
                Year = ngay.Year;
                Month = ngay.Month;
                Day = ngay.Day;
                
                Hour = ngay.Hour + 2;

                if ((Hour == 23) )
                    HQVietnameseCalendar.NextAvailableDate(ref Year, ref  Month, ref  Day);
                else
                    if (Hour >= 24)
                    {
                        Hour = Hour % 24;
                        HQVietnameseCalendar.NextAvailableDate(ref Year, ref  Month, ref  Day);
                    }
            }
            else
                if (thoidiem.Equals(Const.ThoiDiem.Gio))
                {
                    Year = ngay.Year;
                    Month = ngay.Month;
                    Day = ngay.Day;

                    Hour = ngay.Hour + 1;

                    if ((Hour == 23))
                        HQVietnameseCalendar.NextAvailableDate(ref Year, ref  Month, ref  Day);
                    else
                        if (Hour >= 24)
                        {
                            Hour = Hour % 24;
                            HQVietnameseCalendar.NextAvailableDate(ref Year, ref  Month, ref  Day);
                        }
                }
                else
                    if (thoidiem.Equals(Const.ThoiDiem.Ngay))
                    {
                        HQVietnameseCalendar.NextAvailableDate(ref Year, ref  Month, ref  Day);
                    }
                    else
                        if (thoidiem.Equals(Const.ThoiDiem.Thang))
                        {
                            for (int i = 0; i <= 30;i++ ) HQVietnameseCalendar.NextAvailableDate(ref Year, ref  Month, ref  Day);
                        }
            ngayketiep = new DateTime(Year, Month, Day, Hour, ngay.Minute, ngay.Second);
        }

        static public void SaveQueInfo(QueInfo info)
        {
            dataAccess.SaveQueInfo(info);
        }

        //static public void TaoQueCK()
        //{
        //    //Lay tat ca cac que dich
        //    kinhdich.Que6HaoDataTable dt = dataAccess.findAllQue6Hao();
        //    //Duyet Que 6 Hao de tao que dich
        //    for (int i=0;i<dt.Rows.Count;i++){
        //        //QueDich quedich = new QueDich(DateTime.Now,dt[i].QueThuong, dt[i].QueHa);
        //        for (int j = 1; j <= 6; j++)
        //        {
        //            QueDich quedich = new QueDich(DateTime.Now, dt[i].QueThuong, dt[i].QueHa);
        //            string name = quedich.TenQueDich;

        //            //Tao que bien
        //            quedich.quebien = j;
        //            quedich.BienQue();

        //            string name1 = quedich.TenQueDich;

        //            //Ghi vao Data Base                
        //            dataAccess.SaveQueCK(name,name1);
        //        }
        //    }
            
            
        //}

        /// <summary>
        /// Tim Chu Thich Que Chung Khoan
        /// </summary>
        /// <param name="quechu"></param>
        /// <param name="quebien"></param>
        /// <returns></returns>
        static public string ChuThichQueChungKhoan(string quechu,string quebien)
        {
            return dataAccess.findChuThichQueChungKhoan(quechu, quebien);
        }

        /// <summary>
        /// Tu thoi gian nhap, xac dinh que thuong, que ha, que bien
        /// </summary>
        /// <param name="time"></param>
        /// <param name="quethuong"></param>
        /// <param name="queha"></param>
        /// <param name="quebien"></param>
        /// <param name="TenQueThuong"></param>
        /// <param name="TenQueHa"></param>
        static public void XacDinhQueCuocDoi(DateTime time, out int quethuong, out int queha, out int quebien, out string TenQueThuong, out string TenQueHa)
        {
            DateTime newtime;
            //Kiem tra xem co phai la 23h ko
            if (time.Hour < 23)
                newtime = new DateTime(time.Year, time.Month,
                    time.Day, time.Hour, time.Minute, time.Second, time.Millisecond);
            else
            {
                int year = time.Year;
                int month = time.Month;
                int day = time.Day;
                HQVietnameseCalendar.NextAvailableDate(ref year, ref month, ref day);
                newtime = new DateTime(year, month, day,
                    time.Hour, time.Minute, time.Second, time.Millisecond);
            }

            int y, m, d, h, leapMonth;

            VietnameseCalendar.FromDateTime(newtime, out y, out m, out d, out leapMonth);

            if (VietnameseCalendar.GetMonthName(y, m).Contains("Tý"))
                m = 11;
            else
                if (VietnameseCalendar.GetMonthName(y, m).Contains("Sửu"))
                    m = 12;
                else
                    if (VietnameseCalendar.GetMonthName(y, m).Contains("Dần"))
                        m = 1;
                    else
                        if (VietnameseCalendar.GetMonthName(y, m).Contains("Mão"))
                            m = 2;
                        else
                            if (VietnameseCalendar.GetMonthName(y, m).Contains("Thìn"))
                                m = 3;
                            else
                                if (VietnameseCalendar.GetMonthName(y, m).Contains("Tỵ"))
                                    m = 4;
                                else
                                    if (VietnameseCalendar.GetMonthName(y, m).Contains("Ngọ"))
                                        m = 5;
                                    else
                                        if (VietnameseCalendar.GetMonthName(y, m).Contains("Mùi"))
                                            m = 6;
                                        else
                                            if (VietnameseCalendar.GetMonthName(y, m).Contains("Thân"))
                                                m = 7;
                                            else
                                                if (VietnameseCalendar.GetMonthName(y, m).Contains("Dậu"))
                                                    m = 8;
                                                else
                                                    if (VietnameseCalendar.GetMonthName(y, m).Contains("Tuất"))
                                                        m = 9;
                                                    else
                                                        if (VietnameseCalendar.GetMonthName(y, m).Contains("Hợi"))
                                                            m = 10;

            //Xác định quẻ theo tiết lệnh
            if (Const.TietLenh)
            {
                //Nếu qua tháng 1, vẫn trong Đại hàn
                if (VietnameseCalendar.GetMinorSolarTerms(newtime).Contains("Đại hàn") && (m == 1))
                    y = y - 1;
            }

            if (VietnameseCalendar.GetYearName(y).Contains("Giáp"))
                y = 1;
            else
                if (VietnameseCalendar.GetYearName(y).Contains("Ất"))
                    y = 2;
                else
                    if (VietnameseCalendar.GetYearName(y).Contains("Bính"))
                        y = 3;
                    else
                        if (VietnameseCalendar.GetYearName(y).Contains("Đinh"))
                            y = 4;
                        else
                            if (VietnameseCalendar.GetYearName(y).Contains("Mậu"))
                                y = 5;
                            else
                                if (VietnameseCalendar.GetYearName(y).Contains("Kỷ"))
                                    y = 6;
                                else
                                    if (VietnameseCalendar.GetYearName(y).Contains("Canh"))
                                        y = 7;
                                    else
                                        if (VietnameseCalendar.GetYearName(y).Contains("Tân"))
                                            y = 8;
                                        else
                                            if (VietnameseCalendar.GetYearName(y).Contains("Nhâm"))
                                                y = 9;
                                            else
                                                if (VietnameseCalendar.GetYearName(y).Contains("Quý"))
                                                    y = 10;                                                
            int soquethuong = y + m + d;

            if (time.Hour < 23)
            {
                if (time.Hour % 2 != 0)
                    h = (time.Hour + 1) / 2;
                else h = time.Hour / 2;
                h++;
            }
            else
                h = 1;

            int soqueha = soquethuong + h;


            quethuong = soquethuong % 8;
            queha = soqueha % 8;
            quebien = soqueha % 6;

            if (quethuong == 0) quethuong = 7;
            else quethuong--;
            if (queha == 0) queha = 7;
            else queha--;
            if (quebien == 0) quebien = 6;

            TenQueThuong = Const.TienThien[quethuong];
            TenQueHa = Const.TienThien[queha];
        }
    }
}
