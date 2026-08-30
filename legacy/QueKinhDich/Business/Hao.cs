using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinhDich
{
    /// <summary>
    /// Lớp mô tả một hào
    /// </summary>
    public class Hao
    {
        public string napgiap { get; set; } //=lucthan+chi+ngu hanh
        public string lucthan { get; set; }
        public string chi { get; set; }
        public string nguhanh { get; set; } //cua chi
        public bool HaoThe, HaoUng;
        public bool TuanKhong;
        public bool HaoDong;
        public string than;//Lục thần

        public int diemso;

        /// <summary>
        /// Khởi tạo Hào
        /// </summary>
        public Hao()
        {
            HaoThe = false;
            HaoUng = false;
            diemso = 0;
            napgiap = "";
            lucthan = "";
            chi = "";
            nguhanh = "";
            TuanKhong = false;
            HaoDong = false;
            than = "";
        }
    }
}
