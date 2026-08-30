namespace KinhDich
{
    partial class XemNgay
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
            this.button1 = new System.Windows.Forms.Button();
            this.amLichControl1 = new KinhDich.amLichControl();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(12, 398);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 0;
            this.button1.Text = "Tìm ngày tốt";
            this.button1.UseVisualStyleBackColor = true;
            // 
            // amLichControl1
            // 
            this.amLichControl1.Location = new System.Drawing.Point(12, 21);
            this.amLichControl1.Name = "amLichControl1";
            this.amLichControl1.Size = new System.Drawing.Size(759, 232);
            this.amLichControl1.TabIndex = 1;
            // 
            // XemNgay
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(784, 466);
            this.Controls.Add(this.amLichControl1);
            this.Controls.Add(this.button1);
            this.Name = "XemNgay";
            this.Text = "XemNgay";
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private amLichControl amLichControl1;

    }
}