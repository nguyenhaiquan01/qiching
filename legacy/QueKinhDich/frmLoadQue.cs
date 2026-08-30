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
    public partial class frmLoadQue : Form
    {
        public frmLoadQue()
        {
            InitializeComponent();
        }

        private void frmLoadQue_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'kinhdich.InfoQue' table. You can move, or remove it, as needed.
            this.infoQueTableAdapter.Fill(this.kinhdich.InfoQue);
            DateTime time=amLichControl1.GetDateTime();
        }
    }
}
