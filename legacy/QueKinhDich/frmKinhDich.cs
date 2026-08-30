using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Globalization;
using System.Drawing.Printing;

namespace KinhDich
{
    public partial class frmKinhDich : Form
    {
        private PrintDocument printDoc = new PrintDocument();
        private PageSettings pgSettings = new PageSettings();
        

        public frmKinhDich()
        {
            InitializeComponent();

            printDoc.PrintPage += new PrintPageEventHandler(
            printDoc_PrintPage);

            //Add local databse location
            AppDomain.CurrentDomain.SetData("DataDirectory",
            System.Environment.GetFolderPath
           (System.Environment.SpecialFolder.ApplicationData));

        }

        private void menuStrip1_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {
            lấyQuẻTheoThờiGianToolStripMenuItem_Click(sender, e);
        }

        private void trackBar1_Scroll(object sender, EventArgs e)
        {

        }

        private void lấyQuẻTheoThờiGianToolStripMenuItem_Click(object sender, EventArgs e)
        {
            
        }

        private void monthCalendar_DateChanged(object sender, DateRangeEventArgs e)
        {
            Const.beginTime = DateTime.Now;

            DateTime time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            HienThiNgayAmLich(time);
            XacDinhQueKinhDich(time);

            Const.endTime = DateTime.Now;
            Const.elapseTime = Const.endTime.Subtract(Const.beginTime);

            Const.myForm.elapseTimetoolStripStatusLabel.Text = Const.elapseTime.ToString();
        }

        private void DatMau(Label label, string nguhanh)
        {
            if (nguhanh == "Thủy")
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

        /// <summary>
        /// DĐ
        /// </summary>
        /// <param name="label"></param>
        /// <param name="hao"></param>
        private void DatMau(Label label,Hao hao)
        {
            label.Text = hao.napgiap;
            DatMau(label, hao.nguhanh);
        }

        private void HienThiThongTinQue(QueDich quedich,PictureBox pbHao1,PictureBox pbHao2,PictureBox pbHao3,PictureBox pbHao4, PictureBox pbHao5, PictureBox pbHao6,
                PictureBox pbHaoDong1, PictureBox pbHaoDong2, PictureBox pbHaoDong3, PictureBox pbHaoDong4,PictureBox pbHaoDong5, PictureBox pbHaoDong6,
                Label txtQueDich,
                Label txtNapGiap1,Label txtNapGiap2,Label txtNapGiap3,Label txtNapGiap4,Label txtNapGiap5,Label txtNapGiap6)
        {
            string quethuong=quedich.TenQueThuong;
            string queha=quedich.TenQueHa;
            int quebien=quedich.quebien;


            //Xac dinh hinh anh cua que
            kinhdich.QueKinhDichRow queDichRow = business.findThongTinQue(quethuong);
            if (queDichRow.Hao1 == 0) pbHao4.Image = KinhDich.Properties.Resources.queam;
            else pbHao4.Image = KinhDich.Properties.Resources.queduong;

            if (queDichRow.Hao2 == 0) pbHao5.Image = KinhDich.Properties.Resources.queam;
            else pbHao5.Image = KinhDich.Properties.Resources.queduong;

            if (queDichRow.Hao3 == 0) pbHao6.Image = KinhDich.Properties.Resources.queam;
            else pbHao6.Image = KinhDich.Properties.Resources.queduong;

            queDichRow = business.findThongTinQue(queha);
            if (queDichRow.Hao1 == 0) pbHao1.Image = KinhDich.Properties.Resources.queam;
            else pbHao1.Image = KinhDich.Properties.Resources.queduong;

            if (queDichRow.Hao2 == 0) pbHao2.Image = KinhDich.Properties.Resources.queam;
            else pbHao2.Image = KinhDich.Properties.Resources.queduong;

            if (queDichRow.Hao3 == 0) pbHao3.Image = KinhDich.Properties.Resources.queam;
            else pbHao3.Image = KinhDich.Properties.Resources.queduong;

            if (quebien!=0){ //neu co que bien
                //Xac dinh que bien
                pbHaoDong1.Visible = false;
                pbHaoDong2.Visible = false;
                pbHaoDong3.Visible = false;
                pbHaoDong4.Visible = false;
                pbHaoDong5.Visible = false;
                pbHaoDong6.Visible = false;
               
                switch (quebien)
                {
                    case 1:
                        pbHaoDong1.Visible = true;
                        break;
                    case 2:
                        pbHaoDong2.Visible = true;
                        
                        break;
                    case 3:
                        pbHaoDong3.Visible = true;
                        break;
                    case 4:
                        pbHaoDong4.Visible = true;
                        break;
                    case 5:
                        pbHaoDong5.Visible = true;
                        break;
                    case 6:
                        pbHaoDong6.Visible = true;
                        break;
                }
            }

            //Xac dinh diem so
            if (quebien != 0)
            {
                txtDiem1.Text = quedich.hao[1].diemso.ToString();
                txtDiem2.Text = quedich.hao[2].diemso.ToString();
                txtDiem3.Text = quedich.hao[3].diemso.ToString();
                txtDiem4.Text = quedich.hao[4].diemso.ToString();
                txtDiem5.Text = quedich.hao[5].diemso.ToString();
                txtDiem6.Text = quedich.hao[6].diemso.ToString();
            }

            //Xac dinh luc than
            if (quebien != 0)
            {
                txtLucThan1.Text = quedich.hao[1].than;
                txtLucThan2.Text = quedich.hao[2].than;
                txtLucThan3.Text = quedich.hao[3].than;
                txtLucThan4.Text = quedich.hao[4].than;
                txtLucThan5.Text = quedich.hao[5].than;
                txtLucThan6.Text = quedich.hao[6].than;
            }

            //Tu xac dinh
            DatMau(txtNapGiap1, quedich.hao[1]);
            DatMau(txtNapGiap2, quedich.hao[2]);
            DatMau(txtNapGiap3, quedich.hao[3]);
            DatMau(txtNapGiap4, quedich.hao[4]);
            DatMau(txtNapGiap5, quedich.hao[5]);
            DatMau(txtNapGiap6, quedich.hao[6]);

            //Xac dinh ten que
            txtQueDich.Text = quedich.TenQueDich+" ("+quedich.Cung+")";

            //Hiển thị hào ẩn
            
            QueDich queGoc = new QueDich(DateTime.Now, quedich.Cung, quedich.Cung);
            txtQueGoc.Text = queGoc.TenQueDich;
            DatMau(txtNapGiapAn1,queGoc.hao[1]);
            DatMau(txtNapGiapAn2, queGoc.hao[2]);
            DatMau(txtNapGiapAn3, queGoc.hao[3]);
            DatMau(txtNapGiapAn4, queGoc.hao[4]);
            DatMau(txtNapGiapAn5, queGoc.hao[5]);
            DatMau(txtNapGiapAn6, queGoc.hao[6]);
        }

        /// <summary>
        /// tu thoi gian xac dinh que dich va que bien
        /// </summary>
        /// <param name="time"></param>
        public void XacDinhQueKinhDich(DateTime time)
        {
            QueDich quedich;
            quedich = new QueDich(time);
            quedich.GiaiQue();

            HienThiThongTinQue(quedich, pbHao1, pbHao2, pbHao3, pbHao4, pbHao5, pbHao6,
                pbHaoDong1, pbHaoDong2, pbHaoDong3, pbHaoDong4, pbHaoDong5, pbHaoDong6,
                txtQueDich,
                txtNapGiap1,txtNapGiap2,txtNapGiap3,txtNapGiap4,txtNapGiap5,txtNapGiap6);

            //Hien thi thong tin que bien
            HienThiThongTinQue(quedich.QueDichBien, pbQueBienHao1, pbQueBienHao2, pbQueBienHao3, pbQueBienHao4, pbQueBienHao5, pbQueBienHao6,
                null, null, null, null, null, null, 
                txtQueBienDich,
                txtNapGiapBien1, txtNapGiapBien2, txtNapGiapBien3, txtNapGiapBien4, txtNapGiapBien5, txtNapGiapBien6);

            //Xac dinh thong tin ve phu mau
            txtGiaiThich.Text = "Quẻ này cho biết \r\n";
            for (int i = 1; i < 7; i++)
            {
                txtGiaiThich.Text = txtGiaiThich.Text + i.ToString() + ". ";
                if (quedich.hao[i].diemso>3)
                    txtGiaiThich.Text = txtGiaiThich.Text+business.YNghiaLucThan(quedich.hao[i].lucthan)+" RẤT CÁT\r\n";
                else
                    if (quedich.hao[i].diemso>1&&quedich.hao[i].diemso<=3)
                        txtGiaiThich.Text =txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " CÁT\r\n";
                    else
                        if (quedich.hao[i].diemso >= 0 && quedich.hao[i].diemso <=1)
                            txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " BÌNH\r\n";
                        else
                            if (quedich.hao[i].diemso > -3 && quedich.hao[i].diemso <0)
                                txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " HUNG\r\n";
                            else
                                if (quedich.hao[i].diemso <=-3)
                                    txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " CỰC HUNG\r\n";
            }

            //Binh Chu Chung Khoan
            BinhChuChungKhoan(quedich);
        }

        private void BinhChuChungKhoan(QueDich quedich)
        {
            string binhchu=business.ChuThichQueChungKhoan(quedich.TenQueDich,quedich.QueDichBien.TenQueDich);
            txtBinhChuChungKhoan.Text = binhchu;
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

            DatMau(txtCanChiGio, business.findNguHanhNapAm(amlich.ThienCanGio, amlich.DiaChiGio));
            DatMau(txtCanChiNgay, business.findNguHanhNapAm(amlich.ThienCanNgay, amlich.DiaChiNgay));
            DatMau(txtCanChiThang, business.findNguHanhNapAm(amlich.ThienCanThang, amlich.DiaChiThang));
            DatMau(txtCanChiNam, business.findNguHanhNapAm(amlich.ThienCanNam,amlich.DiaChiNam));
        }

        /// <summary>
        /// Khoi tao
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void frmKinhDich_Load(object sender, EventArgs e)
        {
            Const.beginTime = DateTime.Now;

            Const.myForm = this;
            business.LoadAllData();
            
            //Lấy ngày hiện thời
            
            DateTime time = new DateTime();
            time = DateTime.Now;
            HienThiNgayAmLich(time);
            XacDinhQueKinhDich(time);
            
            
            Const.endTime = DateTime.Now;
            Const.elapseTime = Const.endTime.Subtract(Const.beginTime);

            Const.myForm.elapseTimetoolStripStatusLabel.Text = Const.elapseTime.ToString();
        }

        private void datePick_ValueChanged(object sender, EventArgs e)
        {
            Const.beginTime = DateTime.Now;
            //Lấy ngày theo monthCalendar va gio theo datePick
            DateTime time;
            time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                 monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            HienThiNgayAmLich(time);
            XacDinhQueKinhDich(time);

            Const.endTime = DateTime.Now;
            Const.elapseTime = Const.endTime.Subtract(Const.beginTime);

            Const.myForm.elapseTimetoolStripStatusLabel.Text = Const.elapseTime.ToString();
        }

        private void aboutUsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            AboutBox about = new AboutBox();
            about.Show();
        }

        private void inToolStripMenuItem_Click(object sender, EventArgs e)
        {
            PrintDialog dlg = new PrintDialog();
            dlg.Document = printDoc;
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                printDoc.Print();
            }
        }

        private void xemtruocMenuItem_Click(object sender, EventArgs e)
        {
            PrintPreviewDialog dlg = new PrintPreviewDialog();
            dlg.Document = printDoc;
            dlg.ShowDialog();
        }

        private void dantrangMenuItem_Click(object sender, EventArgs e)
        {
            PageSetupDialog pageSetupDialog = new PageSetupDialog();
            pageSetupDialog.PageSettings = pgSettings;
            pageSetupDialog.AllowOrientation = true;
            pageSetupDialog.AllowMargins = true;
            pageSetupDialog.ShowDialog();
        }

        /// <summary>
        /// In thong tin que
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void printDoc_PrintPage(Object sender,
           PrintPageEventArgs e)
        {
            Font printFont = new Font("Times New Roman", 9);
            Font printFontBig = new Font("Times New Roman", 13);
            int leftMargin = e.MarginBounds.Left;
            int topMargin = e.MarginBounds.Top;
            float x, y;
            //float linesPerPage=0;

            x = leftMargin;
            y = topMargin;

            String txtToPrint = "Dương lịch: "+datePick.Text+" "; 
            txtToPrint+="Ngày "+monthCalendar.SelectionStart.Day.ToString()+" ";
            txtToPrint += "Tháng " + monthCalendar.SelectionStart.Month.ToString() + " ";
            txtToPrint += "Năm " + monthCalendar.SelectionStart.Year.ToString() + " ";

            e.Graphics.DrawString(txtToPrint, printFont,
              Brushes.Black, x, y);

            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);
            txtToPrint = "Âm lịch:"+txtTietKhi.Text+" ";
            txtToPrint += "Giờ " + txtCanChiGio.Text+" ";
            txtToPrint += "Ngày " + txtCanChiNgay.Text+"("+txtNgayAm.Text+") ";
            txtToPrint += "Tháng" + txtCanChiThang.Text + "(" + txtThangAm.Text + ") ";
            txtToPrint += "Năm " + txtCanChiNam.Text + "(" + txtNamAm.Text + ") ";
            e.Graphics.DrawString(txtToPrint, printFont,
              Brushes.Black, x, y);

            //linesPerPage = e.MarginBounds.Height / printFont.GetHeight(e.Graphics);


            //In tên quẻ
            y = (float)(y + printFont.GetHeight(e.Graphics) * 3);
            x += 100;
            e.Graphics.DrawString(txtQueDich.Text, printFontBig,
              Brushes.Black, x, y);
            x += 350;
            e.Graphics.DrawString(txtQueBienDich.Text, printFontBig,
              Brushes.Black, x, y);

            //In hào 6
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 2);

            e.Graphics.DrawString(txtDiem6.Text, printFont,
              Brushes.Black, x, y);//in vuong

            x += 20;
            e.Graphics.DrawString(txtNapGiap6.Text, printFont,
              Brushes.Black, x, y);//in nap giap
            
            x += 170;
            e.Graphics.DrawImage(pbHao6.Image, x, y);//in hao
            
            x += pbHao6.Image.Width+20;
            if (pbHaoDong6.Visible)
                e.Graphics.DrawImage(pbHaoDong6.Image, x, y);//in hao dong

            x += pbHaoDong6.Image.Width + 10;
            e.Graphics.DrawString(txtNapGiapBien6.Text, printFont,
              Brushes.Black, x, y);//nap giap que bien

            x += 150;
            e.Graphics.DrawImage(pbQueBienHao6.Image, x, y);
            
            x += pbQueBienHao6.Image.Width + 20;
            e.Graphics.DrawString(txtLucThan6.Text, printFont,
              Brushes.Black, x, y);//luc than

            //In hào 5
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);

            e.Graphics.DrawString(txtDiem5.Text, printFont,
              Brushes.Black, x, y);//in vuong

            x += 20;
            e.Graphics.DrawString(txtNapGiap5.Text, printFont,
              Brushes.Black, x, y);//in nap giap

            x += 170;
            e.Graphics.DrawImage(pbHao5.Image, x, y);//in hao

            x += pbHao5.Image.Width + 20;
            if (pbHaoDong5.Visible)
                e.Graphics.DrawImage(pbHaoDong5.Image, x, y);//in hao dong

            x += pbHaoDong5.Image.Width + 10;
            e.Graphics.DrawString(txtNapGiapBien5.Text, printFont,
              Brushes.Black, x, y);//nap giap que bien

            x += 150;
            e.Graphics.DrawImage(pbQueBienHao5.Image, x, y);

            x += pbQueBienHao5.Image.Width + 20;
            e.Graphics.DrawString(txtLucThan5.Text, printFont,
              Brushes.Black, x, y);//luc than


            //In hào 4
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);

            e.Graphics.DrawString(txtDiem4.Text, printFont,
              Brushes.Black, x, y);//in vuong

            x += 20;
            e.Graphics.DrawString(txtNapGiap4.Text, printFont,
              Brushes.Black, x, y);//in nap giap

            x += 170;
            e.Graphics.DrawImage(pbHao4.Image, x, y);//in hao

            x += pbHao4.Image.Width + 20;
            if (pbHaoDong4.Visible)
                e.Graphics.DrawImage(pbHaoDong4.Image, x, y);//in hao dong

            x += pbHaoDong4.Image.Width + 10;
            e.Graphics.DrawString(txtNapGiapBien4.Text, printFont,
              Brushes.Black, x, y);//nap giap que bien

            x += 150;
            e.Graphics.DrawImage(pbQueBienHao4.Image, x, y);

            x += pbQueBienHao4.Image.Width + 20;
            e.Graphics.DrawString(txtLucThan4.Text, printFont,
              Brushes.Black, x, y);//luc than

            //In hào 3
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);

            e.Graphics.DrawString(txtDiem3.Text, printFont,
              Brushes.Black, x, y);//in vuong

            x += 20;
            e.Graphics.DrawString(txtNapGiap3.Text, printFont,
              Brushes.Black, x, y);//in nap giap

            x += 170;
            e.Graphics.DrawImage(pbHao3.Image, x, y);//in hao

            x += pbHao3.Image.Width + 20;
            if (pbHaoDong3.Visible)
                e.Graphics.DrawImage(pbHaoDong3.Image, x, y);//in hao dong

            x += pbHaoDong3.Image.Width + 10;
            e.Graphics.DrawString(txtNapGiapBien3.Text, printFont,
              Brushes.Black, x, y);//nap giap que bien

            x += 150;
            e.Graphics.DrawImage(pbQueBienHao3.Image, x, y);

            x += pbQueBienHao3.Image.Width + 20;
            e.Graphics.DrawString(txtLucThan3.Text, printFont,
              Brushes.Black, x, y);//luc than

            //In hào 2
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);

            e.Graphics.DrawString(txtDiem2.Text, printFont,
              Brushes.Black, x, y);//in vuong

            x += 20;
            e.Graphics.DrawString(txtNapGiap2.Text, printFont,
              Brushes.Black, x, y);//in nap giap

            x += 170;
            e.Graphics.DrawImage(pbHao2.Image, x, y);//in hao

            x += pbHao2.Image.Width + 20;
            if (pbHaoDong2.Visible)
                e.Graphics.DrawImage(pbHaoDong2.Image, x, y);//in hao dong

            x += pbHaoDong2.Image.Width + 10;
            e.Graphics.DrawString(txtNapGiapBien2.Text, printFont,
              Brushes.Black, x, y);//nap giap que bien

            x += 150;
            e.Graphics.DrawImage(pbQueBienHao2.Image, x, y);

            x += pbQueBienHao2.Image.Width + 20;
            e.Graphics.DrawString(txtLucThan2.Text, printFont,
              Brushes.Black, x, y);//luc than

            //In hào 1
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);

            e.Graphics.DrawString(txtDiem1.Text, printFont,
              Brushes.Black, x, y);//in vuong

            x += 20;
            e.Graphics.DrawString(txtNapGiap1.Text, printFont,
              Brushes.Black, x, y);//in nap giap

            x += 170;
            e.Graphics.DrawImage(pbHao1.Image, x, y);//in hao

            x += pbHao1.Image.Width + 20;
            if (pbHaoDong1.Visible)
                e.Graphics.DrawImage(pbHaoDong1.Image, x, y);//in hao dong

            x += pbHaoDong1.Image.Width + 10;
            e.Graphics.DrawString(txtNapGiapBien1.Text, printFont,
              Brushes.Black, x, y);//nap giap que bien

            x += 150;
            e.Graphics.DrawImage(pbQueBienHao1.Image, x, y);

            x += pbQueBienHao1.Image.Width + 20;
            e.Graphics.DrawString(txtLucThan1.Text, printFont,
              Brushes.Black, x, y);//luc than

            //Binh chú
            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);
            e.Graphics.DrawString(txtBinhChu.Text, printFont,
             Brushes.Black, x, y);//luc than

            x = leftMargin;
            y = (float)(y + printFont.GetHeight(e.Graphics) * 1.5);
            e.Graphics.DrawString(txtGiaiThich.Text, printFont,
             Brushes.Black, x, y);//luc than
        }

        private void TimNgayTotTheoQueDichMenuItem_Click(object sender, EventArgs e)
        {
            frmTimNgayTotTheoQueDich form = new frmTimNgayTotTheoQueDich();
            form.ShowDialog();
        }

        private void thoátToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void toolStripLabel2_Click(object sender, EventArgs e)
        {
            TimNgayTotTheoQueDichMenuItem_Click(sender, e);
        }

        private void toolStripButton1_Click(object sender, EventArgs e)
        {
            
        }

        private void LuuQueMenuItem_Click(object sender, EventArgs e)
        {
            //Luu thoi gian (gio,ngay, thang, nam)
            //Luu binh chu theo kieu bo xung vao


        }

        private void toolStripSave_Click(object sender, EventArgs e)
        {
            DateTime time;
            time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                 monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            QueInfo info=new QueInfo(time,txtNguoiDungGiaiThich.Text);
            business.SaveQueInfo(info);

        }

        private void toolStripCalendar_Click(object sender, EventArgs e)
        {
            frmXemNgay xemngay = new frmXemNgay();
            xemngay.Show();
        }

        private void txtQueDich_Click(object sender, EventArgs e)
        {
            //Hiện quẻ chủ
            //QueDich quedich = new QueDich();
        }

        private void toolStripTaoQueCK_Click(object sender, EventArgs e)
        {
            DateTime time;
            time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                 monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);
            HienThiNgayAmLich(time);
            XacDinhQueKinhDich(time);
        }

        private void toolStripQueCuocDoi_Click(object sender, EventArgs e)
        {
            //Lấy thời gian hiện thời
            DateTime time;
            time = new DateTime(monthCalendar.SelectionStart.Year, monthCalendar.SelectionStart.Month,
                 monthCalendar.SelectionStart.Day, datePick.Value.Hour, datePick.Value.Minute, datePick.Value.Second, datePick.Value.Millisecond);

            HienThiNgayAmLich(time);
            XacDinhQueCuocDoi(time);
        }

        private void XacDinhQueCuocDoi(DateTime time)
        {
            QueDich quedich;
            quedich = new QueDich(time,true);//Khoi tao tinh theo que cuoc doi
            quedich.GiaiQueCuocDoi();

            HienThiThongTinQue(quedich, pbHao1, pbHao2, pbHao3, pbHao4, pbHao5, pbHao6,
                pbHaoDong1, pbHaoDong2, pbHaoDong3, pbHaoDong4, pbHaoDong5, pbHaoDong6,
                txtQueDich,
                txtNapGiap1, txtNapGiap2, txtNapGiap3, txtNapGiap4, txtNapGiap5, txtNapGiap6);

            //Hien thi thong tin que bien
            HienThiThongTinQue(quedich.QueDichBien, pbQueBienHao1, pbQueBienHao2, pbQueBienHao3, pbQueBienHao4, pbQueBienHao5, pbQueBienHao6,
                null, null, null, null, null, null,
                txtQueBienDich,
                txtNapGiapBien1, txtNapGiapBien2, txtNapGiapBien3, txtNapGiapBien4, txtNapGiapBien5, txtNapGiapBien6);

            //Xac dinh thong tin ve phu mau
            txtGiaiThich.Text = "Quẻ này cho biết \r\n";
            for (int i = 1; i < 7; i++)
            {
                txtGiaiThich.Text = txtGiaiThich.Text + i.ToString() + ". ";
                if (quedich.hao[i].diemso > 3)
                    txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " RẤT CÁT\r\n";
                else
                    if (quedich.hao[i].diemso > 1 && quedich.hao[i].diemso <= 3)
                        txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " CÁT\r\n";
                    else
                        if (quedich.hao[i].diemso >= 0 && quedich.hao[i].diemso <= 1)
                            txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " BÌNH\r\n";
                        else
                            if (quedich.hao[i].diemso > -3 && quedich.hao[i].diemso < 0)
                                txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " HUNG\r\n";
                            else
                                if (quedich.hao[i].diemso <= -3)
                                    txtGiaiThich.Text = txtGiaiThich.Text + business.YNghiaLucThan(quedich.hao[i].lucthan) + " CỰC HUNG\r\n";
            }
        }
    }
}
