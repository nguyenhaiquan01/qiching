using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;


namespace KinhDich
{
    public class Const
    {
      
        static public bool TietLenh=false;
        static public int Vuong=3;
        static public int Hung = -8;
        static public DateTime beginTime, endTime;
        static public TimeSpan elapseTime;
        static public frmKinhDich myForm = null;

        public enum ThoiDiem
        {
            Nam, Thang, Ngay, Gio, HaiGio
        };

        static public string[] ThienCan = { "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý" };
        static public string[] DiaChi = { "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu","Tuất","Hợi" };

        static public string[] TienThien = new string[] {
			"Càn", "Đoài", "Ly", "Chấn", "Tốn", "Khảm", "Cấn", "Khôn"
		};

        static public string[] HauThien = new string[] {
			"Ly", "Tốn", "Chấn", "Cấn", "Khôn", "Đoài", "Càn", "Khảm"
		};

        static public string[] NguHanh = new string[] {
			"Kim", "Mộc", "Thủy", "Hỏa", "Thổ"
		};

        static public string[] than = { "Long", "Tước", "Trần", "Xà", "Hổ", "Vũ", "Long", "Tước", "Trần", "Xà", "Hổ", "Vũ" };
        static public string[] lucthan = { "Huynh Đệ", "Tử Tôn", "Thê Tài", "Quan Quỷ", "Phụ Mẫu" };
        static public string[] que6hao ={
                                "CÀN VI THIÊN",
                                "THIÊN PHONG CẤU",
                                "THIÊN SƠN ĐỘN",
                                "THIÊN ĐỊA BỈ",
                                "PHONG ĐỊA QUAN",
                                "SƠN ĐỊA BÁC",
                                "HỎA ĐỊA TẤN",
                                "HỎA THIÊN ĐẠI HỮU",
                                "ĐOÀI VI TRẠCH",
                                "TRẠCH THỦY KHỐN",
                                "TRẠCH ĐỊA TỤY",
                                "TRẠCH SƠN HÀM",
                                "THỦY SƠN KIỀN",
                                "ĐỊA SƠN KHIÊM",
                                "LÔI SƠN TIỂU QUÁ",
                                "LÔI TRẠCH QUY MUỘI",
                                "LY VI HỎA",
                                "HỎA SƠN LỮ",
                                "HỎA PHONG ĐỈNH",
                                "HỎA THỦY VỊ TẾ",
                                "SƠN THỦY MÔNG",
                                "PHONG THỦY HOÁN",
                                "THIÊN THỦY TỤNG",
                                "THIÊN HỎA ĐỒNG NHÂN",
                                "CHẤN VI LÔI",
                                "LÔI ĐỊA DỰ",
                                "LÔI THỦY GIẢI",
                                "LÔI PHONG HẰNG",
                                "ĐỊA PHONG THĂNG",
                                "THỦY PHONG TỈNH",
                                "TRẠCH PHONG ĐẠI QUÁ",
                                "TRẠCH LÔI TÙY",
                                "TỐN VI PHONG",
                                "PHONG THIÊN TIỂU SÚC",
                                "PHONG HỎA GIA NHÂN",
                                "PHONG LÔI ÍCH",
                                "THIÊN LÔI VÔ VỌNG",
                                "HỎA LÔI PHỆ HẠP",
                                "SƠN LÔI DI",
                                "SƠN PHONG CỔ",
                                "KHẢM VI THỦY",
                                "THỦY TRẠCH TIẾT",
                                "THỦY LÔI TRUÂN",
                                "THỦY HOẢ KÝ TẾ",
                                "TRẠCH HỎA CÁCH",
                                "LÔI HỎA PHONG",
                                "ĐỊA HỎA MINH DI",
                                "ĐỊA THỦY SƯ",
                                "CẤN VI SƠN",
                                "SƠN HỎA BÔN",
                                "SƠN THIÊN ĐẠI SÚC",
                                "SƠN TRẠCH TỔN",
                                "HỎA TRẠCH KHUÊ",
                                "THIÊN TRẠCH LÝ",
                                "PHONG TRẠCH TRUNG PHÙ",
                                "PHONG SƠN TIỆM",
                                "KHÔN VI ĐỊA",
                                "ĐỊA LÔI PHỤC",
                                "ĐỊA TRẠCH LÂM",
                                "ĐỊA THIÊN THÁI",
                                "LÔI THIÊN ĐẠI TRÁNG",
                                "TRẠCH THIÊN QUẢI",
                                "THỦY THIÊN NHU",
                                "THỦY ĐỊA TỶ"};
















































































































































































































































































    }
}
