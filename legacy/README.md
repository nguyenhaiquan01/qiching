# QIChing desktop (legacy)

Đây là snapshot source desktop gốc được chuyển từ working copy SVN sang Git. Ứng dụng dùng:

- C# / Windows Forms
- .NET Framework 3.5
- SQL Server Compact Edition 3.5
- Visual Studio 2008

Mở `QueKinhDich.sln` trên Windows để làm việc với solution. Cơ sở dữ liệu tra cứu cần thiết
nằm tại `QueKinhDich/KinhDich.sdf`; project cài đặt MSI nằm tại
`QIChingSetup/QIChingSetup.vdproj`.

Metadata `.svn`, binary/build output và file cấu hình theo người dùng không được đưa vào Git.
Khóa ký ClickOnce cũ `QueKinhDich_TemporaryKey.pfx` cũng bị loại vì chứa private key;
`SignManifests` đã được tắt trong project. Nếu cần phát hành ClickOnce, hãy tạo certificate riêng
và cấu hình lại signing trên máy build an toàn.

Lưu ý: project cài đặt vẫn phụ thuộc môi trường Visual Studio/SQL Server CE 3.5 cũ trên Windows.
Project `VCTest` không nằm trong solution chính và còn tham chiếu một project ngoài cây source,
do đó cần được chỉnh lại dependency nếu muốn chạy riêng bộ test legacy.
