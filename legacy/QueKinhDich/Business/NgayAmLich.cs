using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;

namespace KinhDich
{
    /// <summary>
    /// Lớp ngày âm lịch
    /// </summary>
    public class NgayAmLich
    {
        private int y, m, d, leapMonth;

        /// <summary>
        /// ngày dương lịch
        /// </summary>
        public DateTime NgayDuonglich;

        /// <summary>
        /// Năm âm lịch
        /// </summary>
        public int Year
        {
            get { return y; }
            set { y = value; }
        }

        /// <summary>
        /// Tháng âm lịch
        /// </summary>
        public int Month
        {
            get { return m; }
            set
            {
                m = value;
            }
        }

        /// <summary>
        /// Ngày âm lịch
        /// </summary>
        public int Day
        {
            get { return d; }
            set { d = value; }
        }

        public int LeapMonth {
            get { return leapMonth; }
            set { leapMonth = value; }
        }
        /// <summary>
        /// Thiên can, địa chi, ngày
        /// </summary>
        public string ThienCanNgay, DiaChiNgay, Ngay;

        /// <summary>
        /// Thiên can, địa chi, tháng
        /// </summary>
        public string ThienCanThang, DiaChiThang, Thang;

        /// <summary>
        /// Thiên can, địa chi, năm
        /// </summary>
        public string ThienCanNam, DiaChiNam, Nam;

        /// <summary>
        /// Thiên can, địa chi, giờ
        /// </summary>
        public string ThienCanGio, DiaChiGio, Gio;

        /// <summary>
        /// Tiết khí, giờ hoàng đạo
        /// </summary>
        public string TietKhi, GioHoangDao;

        public NgayAmLich()
        {
            NgayDuonglich = new DateTime();
        }

        /// <summary>B
        /// Khởi tạo một ngày âm lịch
        /// </summary>
        /// <param name="time"></param>
        public NgayAmLich(DateTime time)
        {
            NgayDuonglich = time;

            DateTime newtime;
            int year, month, day;
            bool withHours = true;

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
            VietnameseCalendar vnCal;
            vnCal = new VietnameseCalendar();
            //vnCal.From
            VietnameseCalendar.FromDateTime(newtime, out y, out m, out d, out leapMonth);
            //if (leapMonth > 0 && m >= leapMonth)
            //    Month--;

            Gio = vnCal.GetHourName(newtime, out ThienCanGio, out DiaChiGio);
            Ngay = VietnameseCalendar.GetDayName(newtime, out ThienCanNgay, out DiaChiNgay);
            Thang = VietnameseCalendar.GetMonthName(y, m, out ThienCanThang, out DiaChiThang);
            Nam = VietnameseCalendar.GetYearName(y, out ThienCanNam, out DiaChiNam);
            TietKhi = VietnameseCalendar.GetMinorSolarTerms(newtime);
            GioHoangDao = VietnameseCalendar.GetPropitiousHour(newtime, withHours);
        }
    }
}
