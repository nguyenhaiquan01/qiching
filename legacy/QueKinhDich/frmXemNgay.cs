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
    public partial class frmXemNgay : Form
    {
        amLichControl amlichcontrol;

        public frmXemNgay()
        {
            InitializeComponent();
            amlichcontrol = new amLichControl();
            amlichcontrol.Show();
        }

        private void frmXemNgay_Load(object sender, EventArgs e)
        {
            //Xem ngay
            //Xác định cát hung của một ngay, thang, nam
                //Tìm theo Xác định theo tháng  (số)
                //Tìm theo tháng địa chi, thiên can
                    //Tìm theo ngày (số)
    
        }   
    }
}
