namespace KinhDich
{
    partial class frmTimNgayTotTheoQueDich
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmTimNgayTotTheoQueDich));
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.btnTimNgayTot = new System.Windows.Forms.Button();
            this.ngaybatdau = new System.Windows.Forms.DateTimePicker();
            this.ngayketthuc = new System.Windows.Forms.DateTimePicker();
            this.dataGridView = new System.Windows.Forms.DataGridView();
            this.clGio = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clNgay = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clQue = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clQueBien = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clVuong = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clHuyn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clTu = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clTai = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clQuan = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.clPhu = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cbxViec = new System.Windows.Forms.ComboBox();
            this.label3 = new System.Windows.Forms.Label();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.toolStripProgressBar = new System.Windows.Forms.ToolStripProgressBar();
            this.toolStripStatusLabel1 = new System.Windows.Forms.ToolStripStatusLabel();
            this.toolStripDropDownButton1 = new System.Windows.Forms.ToolStripDropDownButton();
            this.toolStripSplitButton1 = new System.Windows.Forms.ToolStripSplitButton();
            this.backgroundWorker = new System.ComponentModel.BackgroundWorker();
            this.datePick = new System.Windows.Forms.DateTimePicker();
            this.label4 = new System.Windows.Forms.Label();
            this.btnHangNgay = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).BeginInit();
            this.statusStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(14, 40);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(72, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Ngày bắt đầu";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(14, 72);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(74, 13);
            this.label2.TabIndex = 1;
            this.label2.Text = "Ngày kết thúc";
            // 
            // btnTimNgayTot
            // 
            this.btnTimNgayTot.Location = new System.Drawing.Point(296, 8);
            this.btnTimNgayTot.Name = "btnTimNgayTot";
            this.btnTimNgayTot.Size = new System.Drawing.Size(102, 23);
            this.btnTimNgayTot.TabIndex = 2;
            this.btnTimNgayTot.Text = "&Ngày Giờ Tốt";
            this.btnTimNgayTot.UseVisualStyleBackColor = true;
            this.btnTimNgayTot.Click += new System.EventHandler(this.btnTimNgayTot_Click);
            // 
            // ngaybatdau
            // 
            this.ngaybatdau.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.ngaybatdau.Location = new System.Drawing.Point(92, 40);
            this.ngaybatdau.Name = "ngaybatdau";
            this.ngaybatdau.Size = new System.Drawing.Size(89, 20);
            this.ngaybatdau.TabIndex = 3;
            this.ngaybatdau.ValueChanged += new System.EventHandler(this.ngaybatdau_ValueChanged);
            // 
            // ngayketthuc
            // 
            this.ngayketthuc.Format = System.Windows.Forms.DateTimePickerFormat.Short;
            this.ngayketthuc.Location = new System.Drawing.Point(92, 70);
            this.ngayketthuc.Name = "ngayketthuc";
            this.ngayketthuc.Size = new System.Drawing.Size(89, 20);
            this.ngayketthuc.TabIndex = 3;
            this.ngayketthuc.ValueChanged += new System.EventHandler(this.ngayketthuc_ValueChanged);
            // 
            // dataGridView
            // 
            this.dataGridView.AllowUserToOrderColumns = true;
            dataGridViewCellStyle4.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(224)))), ((int)(((byte)(224)))), ((int)(((byte)(224)))));
            dataGridViewCellStyle4.ForeColor = System.Drawing.Color.Blue;
            this.dataGridView.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle4;
            this.dataGridView.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.ColumnHeader;
            this.dataGridView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.clGio,
            this.clNgay,
            this.clQue,
            this.clQueBien,
            this.clVuong,
            this.clHuyn,
            this.clTu,
            this.clTai,
            this.clQuan,
            this.clPhu});
            this.dataGridView.Location = new System.Drawing.Point(8, 145);
            this.dataGridView.Name = "dataGridView";
            this.dataGridView.ReadOnly = true;
            this.dataGridView.Size = new System.Drawing.Size(550, 314);
            this.dataGridView.TabIndex = 4;
            // 
            // clGio
            // 
            this.clGio.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clGio.HeaderText = "Giờ";
            this.clGio.Name = "clGio";
            this.clGio.ReadOnly = true;
            this.clGio.Width = 48;
            // 
            // clNgay
            // 
            this.clNgay.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clNgay.HeaderText = "Ngày";
            this.clNgay.Name = "clNgay";
            this.clNgay.ReadOnly = true;
            this.clNgay.Width = 57;
            // 
            // clQue
            // 
            this.clQue.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clQue.HeaderText = "Quẻ";
            this.clQue.Name = "clQue";
            this.clQue.ReadOnly = true;
            this.clQue.Width = 52;
            // 
            // clQueBien
            // 
            this.clQueBien.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clQueBien.HeaderText = "Quẻ Biến";
            this.clQueBien.Name = "clQueBien";
            this.clQueBien.ReadOnly = true;
            this.clQueBien.Width = 76;
            // 
            // clVuong
            // 
            this.clVuong.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clVuong.HeaderText = "Vượng";
            this.clVuong.Name = "clVuong";
            this.clVuong.ReadOnly = true;
            this.clVuong.Width = 63;
            // 
            // clHuyn
            // 
            this.clHuyn.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clHuyn.HeaderText = "Huynh";
            this.clHuyn.Name = "clHuyn";
            this.clHuyn.ReadOnly = true;
            this.clHuyn.Width = 63;
            // 
            // clTu
            // 
            this.clTu.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clTu.HeaderText = "Tử";
            this.clTu.Name = "clTu";
            this.clTu.ReadOnly = true;
            this.clTu.Width = 45;
            // 
            // clTai
            // 
            this.clTai.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clTai.HeaderText = "Tài";
            this.clTai.Name = "clTai";
            this.clTai.ReadOnly = true;
            this.clTai.Width = 47;
            // 
            // clQuan
            // 
            this.clQuan.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clQuan.HeaderText = "Quan";
            this.clQuan.Name = "clQuan";
            this.clQuan.ReadOnly = true;
            this.clQuan.Width = 58;
            // 
            // clPhu
            // 
            this.clPhu.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.AllCells;
            this.clPhu.HeaderText = "Phụ";
            this.clPhu.Name = "clPhu";
            this.clPhu.ReadOnly = true;
            this.clPhu.Width = 51;
            // 
            // cbxViec
            // 
            this.cbxViec.FormattingEnabled = true;
            this.cbxViec.Items.AddRange(new object[] {
            "Huynh Đệ",
            "Tử Tôn",
            "Thê Tài",
            "Quan Quỷ",
            "Phụ Mẫu"});
            this.cbxViec.Location = new System.Drawing.Point(93, 104);
            this.cbxViec.Name = "cbxViec";
            this.cbxViec.Size = new System.Drawing.Size(121, 21);
            this.cbxViec.TabIndex = 5;
            this.cbxViec.Text = "Thê Tài";
            this.cbxViec.SelectedIndexChanged += new System.EventHandler(this.cbxViec_SelectedIndexChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 108);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(75, 13);
            this.label3.TabIndex = 1;
            this.label3.Text = "Lục thân/Việc";
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripProgressBar,
            this.toolStripStatusLabel1,
            this.toolStripDropDownButton1,
            this.toolStripSplitButton1});
            this.statusStrip1.Location = new System.Drawing.Point(0, 449);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(570, 22);
            this.statusStrip1.TabIndex = 6;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // toolStripProgressBar
            // 
            this.toolStripProgressBar.Name = "toolStripProgressBar";
            this.toolStripProgressBar.Size = new System.Drawing.Size(100, 16);
            // 
            // toolStripStatusLabel1
            // 
            this.toolStripStatusLabel1.Name = "toolStripStatusLabel1";
            this.toolStripStatusLabel1.Size = new System.Drawing.Size(118, 17);
            this.toolStripStatusLabel1.Text = "toolStripStatusLabel1";
            // 
            // toolStripDropDownButton1
            // 
            this.toolStripDropDownButton1.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.toolStripDropDownButton1.Image = ((System.Drawing.Image)(resources.GetObject("toolStripDropDownButton1.Image")));
            this.toolStripDropDownButton1.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.toolStripDropDownButton1.Name = "toolStripDropDownButton1";
            this.toolStripDropDownButton1.Size = new System.Drawing.Size(29, 20);
            this.toolStripDropDownButton1.Text = "toolStripDropDownButton1";
            // 
            // toolStripSplitButton1
            // 
            this.toolStripSplitButton1.DisplayStyle = System.Windows.Forms.ToolStripItemDisplayStyle.Image;
            this.toolStripSplitButton1.Image = ((System.Drawing.Image)(resources.GetObject("toolStripSplitButton1.Image")));
            this.toolStripSplitButton1.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.toolStripSplitButton1.Name = "toolStripSplitButton1";
            this.toolStripSplitButton1.Size = new System.Drawing.Size(32, 20);
            this.toolStripSplitButton1.Text = "toolStripSplitButton1";
            // 
            // backgroundWorker
            // 
            this.backgroundWorker.WorkerReportsProgress = true;
            this.backgroundWorker.DoWork += new System.ComponentModel.DoWorkEventHandler(this.backgroundWorker_DoWork);
            // 
            // datePick
            // 
            this.datePick.Format = System.Windows.Forms.DateTimePickerFormat.Time;
            this.datePick.Location = new System.Drawing.Point(92, 7);
            this.datePick.Name = "datePick";
            this.datePick.ShowUpDown = true;
            this.datePick.Size = new System.Drawing.Size(142, 20);
            this.datePick.TabIndex = 13;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(14, 7);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(23, 13);
            this.label4.TabIndex = 12;
            this.label4.Text = "Giờ";
            // 
            // btnHangNgay
            // 
            this.btnHangNgay.Location = new System.Drawing.Point(296, 53);
            this.btnHangNgay.Name = "btnHangNgay";
            this.btnHangNgay.Size = new System.Drawing.Size(75, 23);
            this.btnHangNgay.TabIndex = 14;
            this.btnHangNgay.Text = "&Tìm Việc Theo Giờ";
            this.btnHangNgay.UseVisualStyleBackColor = true;
            this.btnHangNgay.Click += new System.EventHandler(this.btnHangNgay_Click);
            // 
            // frmTimNgayTotTheoQueDich
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(570, 471);
            this.Controls.Add(this.btnHangNgay);
            this.Controls.Add(this.datePick);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.cbxViec);
            this.Controls.Add(this.dataGridView);
            this.Controls.Add(this.ngayketthuc);
            this.Controls.Add(this.ngaybatdau);
            this.Controls.Add(this.btnTimNgayTot);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "frmTimNgayTotTheoQueDich";
            this.Text = "Ngày Tốt Theo Quẻ Dịch";
            this.Load += new System.EventHandler(this.frmTimNgayTotTheoQueDich_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).EndInit();
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button btnTimNgayTot;
        private System.Windows.Forms.DateTimePicker ngaybatdau;
        private System.Windows.Forms.DateTimePicker ngayketthuc;
        private System.Windows.Forms.DataGridView dataGridView;
        private System.Windows.Forms.ComboBox cbxViec;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripProgressBar toolStripProgressBar;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel1;
        private System.Windows.Forms.ToolStripDropDownButton toolStripDropDownButton1;
        private System.Windows.Forms.ToolStripSplitButton toolStripSplitButton1;
        private System.ComponentModel.BackgroundWorker backgroundWorker;
        private System.Windows.Forms.DataGridViewTextBoxColumn clGio;
        private System.Windows.Forms.DataGridViewTextBoxColumn clNgay;
        private System.Windows.Forms.DataGridViewTextBoxColumn clQue;
        private System.Windows.Forms.DataGridViewTextBoxColumn clQueBien;
        private System.Windows.Forms.DataGridViewTextBoxColumn clVuong;
        private System.Windows.Forms.DataGridViewTextBoxColumn clHuyn;
        private System.Windows.Forms.DataGridViewTextBoxColumn clTu;
        private System.Windows.Forms.DataGridViewTextBoxColumn clTai;
        private System.Windows.Forms.DataGridViewTextBoxColumn clQuan;
        private System.Windows.Forms.DataGridViewTextBoxColumn clPhu;
        private System.Windows.Forms.DateTimePicker datePick;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button btnHangNgay;
    }
}