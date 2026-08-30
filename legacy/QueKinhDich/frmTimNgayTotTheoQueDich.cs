using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace KinhDich
{
    public partial class frmTimNgayTotTheoQueDich : Form
    {
        public frmTimNgayTotTheoQueDich()
        {
            InitializeComponent();
            toolStripProgressBar.Maximum = 10000;
        }

        public void TimNgayTot(Const.ThoiDiem thoidiem,int weight,DateTime ngaybatdau, DateTime ngayketthuc, string viec, out List<DateTime> ngaytot)
        {
            dataGridView.Rows.Clear();
            ngaytot = new List<DateTime>();
            DateTime ngayduyet = new DateTime();
            DateTime ngayke = new DateTime();
            int i = 0;
            
            ngayduyet = ngaybatdau;
            //Neu van nho hon ngay ket thuc
            while (ngayduyet.CompareTo(ngayketthuc) < 0)
            {
                //Tinh que dich cho ngay hien tai
                QueDich quedich = new QueDich(ngayduyet);
                quedich.GiaiQue();

                //Neu thoa dieu kien thi output ra DataGridView
                if (quedich.diemLucThan[viec] > weight)
                {
                    ngaytot.Add(ngayduyet);

                    if (i >= dataGridView.Rows.Count-1) 
                        dataGridView.Rows.Add();
                    dataGridView.Rows[i].Cells[0].Value = ngaytot[i].ToShortTimeString();
                    dataGridView.Rows[i].Cells[1].Value = ngaytot[i].ToShortDateString();
                    dataGridView.Rows[i].Cells[2].Value = quedich.TenQueDich;
                    dataGridView.Rows[i].Cells[3].Value = quedich.QueDichBien.TenQueDich;
                    dataGridView.Rows[i].Cells[4].Value = quedich.diemLucThan[viec];
                    dataGridView.Rows[i].Cells[5].Value = quedich.diemLucThan[Const.lucthan[0]];
                    dataGridView.Rows[i].Cells[6].Value = quedich.diemLucThan[Const.lucthan[1]];
                    dataGridView.Rows[i].Cells[7].Value = quedich.diemLucThan[Const.lucthan[2]];
                    dataGridView.Rows[i].Cells[8].Value = quedich.diemLucThan[Const.lucthan[3]];
                    dataGridView.Rows[i].Cells[9].Value = quedich.diemLucThan[Const.lucthan[4]];
                    i++;
                }
                toolStripProgressBar.Value += 1;
                //Neu que dich, tuong ung voi viec gi, hao gi
                business.ThoiDiemKeTiep(thoidiem, ngayduyet, out ngayke);
                ngayduyet = ngayke;
            }
        }

        private void btnTimNgayTot_Click(object sender, EventArgs e)
        {
            List<DateTime> ngaytot;
            TimNgayTot(Const.ThoiDiem.HaiGio,Const.Vuong,ngaybatdau.Value.Date,ngayketthuc.Value.Date,cbxViec.Text,out ngaytot);
            //this.backgroundWorker.RunWorkerAsync(2000);

            //for (int i=0;i<ngaytot.Count;i++)
            //{
            //    dataGridView.Rows.Add();
            //    dataGridView.Rows[i].Cells[0].Value = ngaytot[i].Date.ToString();
            //}
        }

        private void frmTimNgayTotTheoQueDich_Load(object sender, EventArgs e)
        {
            //ngayketthuc.Value.AddDays(7);
            //ngayketthuc.Value =DateTime.Today.AddDays(7);
            ngayketthuc.Value = ngaybatdau.Value.AddDays(15);
        }

        private void backgroundWorker_DoWork(object sender, DoWorkEventArgs e)
        {
        }

        private void cbxViec_SelectedIndexChanged(object sender, EventArgs e)
        {
            //btnTimNgayTot_Click(sender, e);
        }

        private void ngaybatdau_ValueChanged(object sender, EventArgs e)
        {
            //btnTimNgayTot_Click(sender, e);
        }

        private void ngayketthuc_ValueChanged(object sender, EventArgs e)
        {
            //btnTimNgayTot_Click(sender, e);
        }

        private void btnHangNgay_Click(object sender, EventArgs e)
        {
            DateTime timebatdau,timeketthuc;
            timebatdau = new DateTime(ngaybatdau.Value.Year, ngaybatdau.Value.Month,
                 ngaybatdau.Value.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            timeketthuc = new DateTime(ngayketthuc.Value.Year, ngayketthuc.Value.Month,
                 ngayketthuc.Value.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            List<DateTime> ngaytot;

            TimNgayTot(Const.ThoiDiem.Ngay, Const.Hung,timebatdau, timeketthuc, cbxViec.Text, out ngaytot);
        }
    }
}
