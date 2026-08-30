using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace KinhDich
{
    class dataAccess
    {
        //private static queK bizIndustryTA = new data.baseDSTableAdapters.bizIndustryTA();
        private static kinhdichTableAdapters.QueKinhDichTableAdapter QueKinhDichTA = new kinhdichTableAdapters.QueKinhDichTableAdapter();
        private static kinhdichTableAdapters.Que6HaoTableAdapter Que6HaoTA = new kinhdichTableAdapters.Que6HaoTableAdapter();
        private static kinhdichTableAdapters.CanChiTableAdapter CanChiTA = new kinhdichTableAdapters.CanChiTableAdapter();
        private static kinhdichTableAdapters.NguHanhTableAdapter NguHanhTA = new kinhdichTableAdapters.NguHanhTableAdapter();
        private static kinhdichTableAdapters.LucThanTableAdapter LucThanTA = new kinhdichTableAdapters.LucThanTableAdapter();
        private static kinhdichTableAdapters.NapAmTableAdapter NapAmTA = new kinhdichTableAdapters.NapAmTableAdapter();
        private static kinhdichTableAdapters.InfoQueTableAdapter InfoQueTA = new kinhdichTableAdapters.InfoQueTableAdapter();
        private static kinhdichTableAdapters.QueCKTableAdapter QueCKTA = new kinhdichTableAdapters.QueCKTableAdapter();
        
        //Cache
        static public Dictionary<string, string> cache6Hao = new Dictionary<string, string>();
        static public Dictionary<string, object> cache6HaoRow = new Dictionary<string, object>();
        static public Dictionary<string, string> cacheQueKinhDich = new Dictionary<string, string>();
        static public Dictionary<string, object> cacheQueKinhDichRow = new Dictionary<string, object>();
        static public Dictionary<string, string> cacheQueKinhDichByHao = new Dictionary<string, string>();
        static public Dictionary<string, string> cacheCanChi = new Dictionary<string, string>();
        static public Dictionary<string, int> cacheQue6HaoHaoThe = new Dictionary<string, int>();
        static public Dictionary<string, string> cacheLucThan = new Dictionary<string, string>();
        static public Dictionary<string, string> cacheNapAm = new Dictionary<string, string>();
        static public Dictionary<string, string> cacheThan = new Dictionary<string, string>();
        static public Dictionary<string, bool> cacheNguHanhTuongSinh = new Dictionary<string, bool>();
        static public Dictionary<string, bool> cacheNguHanhTuongKhac = new Dictionary<string, bool>();
        
        static public string findTenQueDon(string tenque)
        {
            if (!cacheQueKinhDich.ContainsKey(tenque))
            {
                kinhdich.QueKinhDichDataTable dt = QueKinhDichTA.GetData(tenque);
                cacheQueKinhDich.Add(tenque,dt[0].TenQueKinhDich);
            }
            return cacheQueKinhDich[tenque];
        }

        static public string findTenQue6Hao(string quethuong, string queha)
        {
            string q = quethuong + queha;
            if (!cache6Hao.ContainsKey(q))
            {
                kinhdich.Que6HaoDataTable dt = Que6HaoTA.GetTenQue(quethuong, queha);
                cache6Hao.Add(q, dt[0].TenQue.ToString());
            }
            return cache6Hao[q];
        }

        static public kinhdich.Que6HaoRow find6Hao(string tenque)
        {
            if (!cache6HaoRow.ContainsKey(tenque))
            {
                kinhdich.Que6HaoRow row = Que6HaoTA.Get6Hao(tenque)[0];
                cache6HaoRow.Add(tenque,row);
            }
            return (kinhdich.Que6HaoRow)cache6HaoRow[tenque];
        }

        static public kinhdich.QueKinhDichRow findThongTinQue(string batquai)
        {
            if (!cacheQueKinhDichRow.ContainsKey(batquai))
            {
                kinhdich.QueKinhDichRow row = QueKinhDichTA.GetDataByTenQue(batquai)[0];
                cacheQueKinhDichRow.Add(batquai,row);
            }
            return (kinhdich.QueKinhDichRow)cacheQueKinhDichRow[batquai];
        }

        static public string findTenQueByHao(int Hao1,int Hao2,int Hao3)
        {
            string key = Hao1.ToString() + Hao2.ToString() + Hao3.ToString();
            if (!cacheQueKinhDichByHao.ContainsKey(key))
            {
                cacheQueKinhDichByHao.Add(key,QueKinhDichTA.GetTenQueByHao(Hao1, Hao2, Hao3));
            }
            return cacheQueKinhDichByHao[key];
        }

        /// <summary>
        /// Tram ve ngu hanh cua thien can, dia chi, hoac, que
        /// </summary>
        /// <param name="ten"></param>
        /// <returns></returns>
        static public string findNguHanh(string ten)
        {
            if (!cacheCanChi.ContainsKey(ten))
            {
                cacheCanChi.Add(ten,(string)CanChiTA.FindNguHanh(ten));
            }
            return cacheCanChi[ten];
        }

        static public bool TuongKhac(string NguHanh1, string NguHanh2)
        {
            string key = NguHanh1 + NguHanh2;
            if (!cacheNguHanhTuongKhac.ContainsKey(key))
            {
                if (NguHanhTA.GetNguHanhTuongKhac(NguHanh1, NguHanh2).Count > 0)
                    cacheNguHanhTuongKhac.Add(key,true);
                else
                    cacheNguHanhTuongKhac.Add(key, false);
            }
            return cacheNguHanhTuongKhac[key];
        }

        static public bool TuongSinh(string NguHanh1, string NguHanh2)
        {
            string key = NguHanh1 + NguHanh2;
            if (!cacheNguHanhTuongSinh.ContainsKey(key))
            {
                if (NguHanhTA.GetNguHanhTuongSinh(NguHanh1, NguHanh2).Count > 0)
                    cacheNguHanhTuongSinh.Add(key, true);
                else
                    cacheNguHanhTuongSinh.Add(key,false);
            }
            return cacheNguHanhTuongSinh[key];
        }

        static public int findHaoThe(string quedich)
        {
            if (!cacheQue6HaoHaoThe.ContainsKey(quedich))
            {
                cacheQue6HaoHaoThe.Add(quedich,Que6HaoTA.Get6Hao(quedich)[0].HaoThe);
            }
            return cacheQue6HaoHaoThe[quedich];
        }

        static public string findYNghiaLucThan(string lucthan)
        {
            if (!cacheLucThan.ContainsKey(lucthan))
            {
                kinhdich.LucThanDataTable row = LucThanTA.GetData(lucthan);
                cacheLucThan.Add(lucthan, row[0].giainghia);
            }
            return cacheLucThan[lucthan];
        }

        static public string findNguHanhNapAm(string can, string chi)
        {
            string key = can + chi;
            if (!cacheNapAm.ContainsKey(key))
            {
                cacheNapAm.Add(key,NapAmTA.GetDataByCanChi(can, chi)[0].NguHanh);
            }
            return cacheNapAm[key];
        }

        static public string findLucThan(string canngay)
        {
            if (!cacheThan.ContainsKey(canngay))
            {
                cacheThan.Add(canngay,CanChiTA.FindLucThan(canngay));
            }
            return cacheThan[canngay];
        }

        static public void SaveQueInfo(QueInfo info)
        {
            //kinhdich.InfoQueDataTable dt = new kinhdich.InfoQueDataTable();
            //kinhdich.InfoQueRow row = dt.NewInfoQueRow();
            //row.binhchu = info.binhchu;
            //row.time = info.time;
            //dt.AddInfoQueRow(row);
            //int result=InfoQueTA.InsertBinhChu(
            //dt.AcceptChanges();
            InfoQueTA.InsertBinhChu(info.binhchu, info.time);
        }

        static public kinhdich.Que6HaoDataTable findAllQue6Hao()
        {
            return Que6HaoTA.GetAllQue();
        }

        //static public void SaveQueCK(string quechu,string quebien){
        //    kinhdich.QueCKDataTable dt = new kinhdich.QueCKDataTable();
        //    kinhdich.QueCKRow row = dt.NewQueCKRow();
        //    row.QueChu = quechu;
        //    row.QueBien = quebien;
        //    dt.AddQueCKRow(row);
        //    int result = QueCKTA.Update(dt);
        //    dt.AcceptChanges();
        //}

        static public string findChuThichQueChungKhoan(string quechu, string quebien)
        {
            string chuthich = (string)QueCKTA.findChuThich(quechu, quebien);
            return chuthich;
        }
    }
}

