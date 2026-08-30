using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace KinhDich
{
    public partial class amLichControl : UserControl
    {
        public DateTime GetDateTime()
        {
            DateTime time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            return time;
        }

        public amLichControl()
        {
            InitializeComponent();
            DateTime time = new DateTime();
            time = DateTime.Now;
            HienThiNgayAmLich(time);
        }

        /// <summary>
        /// Hien thi ngay am lich len form
        /// </summary>
        /// <param name="time"></param>
        /// <param name="y"></param>
        /// <param name="m"></param>
        /// <param name="d"></param>
        private void HienThiNgayAmLich(DateTime time)
        {

            NgayAmLich amlich = new NgayAmLich(time);
            int thangam;
            if (amlich.LeapMonth > 0 && amlich.Month >= amlich.LeapMonth)
                thangam = amlich.Month - 1;
            else thangam = amlich.Month;

            txtNamAm.Text = amlich.Year.ToString();
            txtThangAm.Text = thangam.ToString();
            txtNgayAm.Text = amlich.Day.ToString();

            txtCanChiGio.Text = amlich.Gio;
            txtCanChiGioHoangDao.Text = amlich.GioHoangDao;
            txtCanChiNgay.Text = amlich.Ngay;
            txtCanChiThang.Text = amlich.Thang;
            txtCanChiNam.Text = amlich.Nam;
            txtTietKhi.Text = amlich.TietKhi;

            //DatMau(txtCanChiGio, business.findNguHanhNapAm(amlich.ThienCanGio, amlich.DiaChiGio));
            //DatMau(txtCanChiNgay, business.findNguHanhNapAm(amlich.ThienCanNgay, amlich.DiaChiNgay));
            //DatMau(txtCanChiThang, business.findNguHanhNapAm(amlich.ThienCanThang, amlich.DiaChiThang));
            //DatMau(txtCanChiNam, business.findNguHanhNapAm(amlich.ThienCanNam, amlich.DiaChiNam));
        }

        private void DatMau(Label label, string nguhanh)
        {
            if (nguhanh == "THỦY")
                label.ForeColor = System.Drawing.Color.Blue;
            if (nguhanh == "Hỏa")
                label.ForeColor = System.Drawing.Color.Red;
            if (nguhanh == "Thổ")
                label.ForeColor = System.Drawing.Color.Orange;
            if (nguhanh == "Kim")
                label.ForeColor = System.Drawing.Color.Silver;
            if (nguhanh == "Mộc")
                label.ForeColor = System.Drawing.Color.Green;
        }

        private void amLichControl_Load(object sender, EventArgs e)
        {

        }

        private void monthCalendar_DateChanged(object sender, DateRangeEventArgs e)
        {
            DateTime time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            HienThiNgayAmLich(time);
        }
    }
}
