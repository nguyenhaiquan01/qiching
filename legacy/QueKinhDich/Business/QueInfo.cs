using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KinhDich
{
    /// <summary>
    /// Thông tin quẻ
    /// </summary>
    public class QueInfo
    {
        public DateTime time;
        public string binhchu;

        public QueInfo(DateTime time, string binhchu)
        {
            this.time = time;
            this.binhchu = binhchu;
        }

    }
}
