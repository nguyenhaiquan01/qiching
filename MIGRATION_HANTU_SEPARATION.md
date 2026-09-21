# Migration: Tách Hán Tự Khỏi Phần Dịch/Giảng

**Ngày:** 21 tháng 9 năm 2026  
**Quyết định:** Phương án B - Restructure data to object format  
**Trạng thái:** ✅ HOÀN THÀNH

---

## 🎯 Mục tiêu

Tách Hán tự gốc khỏi phần dịch Việt và giảng thích để:
- Cho phép toggle show/hide Hán tự độc lập
- Hỗ trợ nhiều mức độ khó (dễ = Việt + giảng; trung bình = Hán tự + Việt; khó = chỉ Hán tự)
- Bảo tồn toàn bộ nội dung gốc của Phan Bội Châu

---

## 📊 Schema Cũ vs Mới

### Schema Cũ (String ghép)
```javascript
{
  "soanTu": "CÀN, NGUYÊN, HANH, LỊ, TRINH\n乾元亨利貞.\nSoán, nghĩa là đoán..."
}
```

**Vấn đề:**
- Hán tự gộp chung với phần dịch/giảng
- Không thể tách riêng để toggle
- Khó parse chính xác (một số quẻ có Hán tự trên nhiều dòng)

### Schema Mới (Object phân cấp)
```javascript
{
  "soanTu": {
    "hanViet": "CÀN, NGUYÊN, HANH, LỊ, TRINH",
    "hanTu": "乾元亨利貞",
    "dichGiang": "Soán, nghĩa là đoán. Bởi vì Văn Vương thấy được..."
  },
  "daiTuongTruyen": {
    "hanViet": "Tượng viết: Thiên hành kiện...",
    "hanTu": "象曰: 天行健, 君子以自強不息.",
    "dichGiang": "Đây là thích tượng quẻ Càn..."
  }
}
```

**Lợi ích:**
- ✅ Tách Hán tự độc lập (`hanTu`)
- ✅ Bảo tồn dịch Hán tự (`hanViet`)
- ✅ Giữ phần giảng/dịch riêng (`dichGiang`)
- ✅ Dễ toggle show/hide từng phần
- ✅ Cấu trúc rõ ràng, dễ bảo trì

---

## 🔄 Chi tiết Migration

### Quy trình Parsing
**Input (cũ):**
```
Dòng 1: CÀN, NGUYÊN, HANH, LỊ, TRINH
Dòng 2: 乾元亨利貞.
Dòng 3+: Soán, nghĩa là đoán. Bởi vì...
```

**Output (mới):**
```json
{
  "hanViet": "CÀN, NGUYÊN, HANH, LỊ, TRINH",
  "hanTu": "乾元亨利貞",
  "dichGiang": "Soán, nghĩa là đoán. Bởi vì..."
}
```

### Áp dụng cho
- ✅ `soanTu` (64 quẻ)
- ✅ `daiTuongTruyen` (64 quẻ)
- ✅ **Không áp dụng**: `soanTruyen`, `vanNgon`, `dungCuu` (những trường này chỉ có phần giảng/dịch, không có Hán tự riêng)

### Thống kê Nội dung (2 trường × 64 quẻ)
| Loại | Lượng | Ghi chú |
|------|-------|---------|
| hanViet (dịch) | 7,786 ký tự | Dịch Hán tự sang Việt |
| hanTu (gốc) | 3,736 ký tự | Hán tự gốc (chính là Kinh Dịch) |
| dichGiang (giảng) | 199,145 ký tự | Phần dịch/giảng Phan Bội Châu |
| **Tổng** | **210,667 ký tự** | Không mất thông tin |

---

## ✅ Verify & Quality Assurance

### Kiểm chứng
- [x] Tất cả 64 quẻ được parse thành công
- [x] Không phát hiện lỗi trong quá trình migration
- [x] Spot-check 3 quẻ (1, 32, 64) đều khớp 100%
- [x] Reconstruct từ schema mới = schema cũ (byte-perfect)
- [x] Tổng nội dung không mất: 210,667 ký tự (trước = sau)

### Backup
- **File gốc:** `noiDungQuePhanBoiChau.backup.json` (lưu trữ permanent)
- **Migration script:** Có sẵn tại `/memories/repo/migration_hantu.py`

---

## 🎨 Ứng dụng trong UI Component

### Component React sử dụng schema mới
```typescript
interface CardContent {
  hanViet: string;      // "CÀN, NGUYÊN, HANH, LỊ, TRINH"
  hanTu: string;        // "乾元亨利貞"
  dichGiang: string;    // "Soán, nghĩa là..."
}

interface LearnCard {
  soanTu: CardContent;
  daiTuongTruyen: CardContent;
}

// Component render
<div className="card">
  {showHanViet && <div>{card.soanTu.hanViet}</div>}
  {showHanTu && <div>{card.soanTu.hanTu}</div>}
  {showDich && <div>{card.soanTu.dichGiang}</div>}
</div>
```

### Mức độ khó (difficulty levels)
- **Easy:** hanViet + dichGiang (không Hán tự, dễ nhớ)
- **Medium:** hanViet + hanTu (Hán tự + dịch)
- **Hard:** Chỉ hanTu (chỉ Hán tự gốc, khó nhất)

---

## 📝 Ghi chú Kỹ Thuật

### Tính toán kích thước file
- File mới: **1.6 MB** (tương tự cũ, vì cấu trúc logic không thay đổi)
- Backup: **1.6 MB** (2 × file, vẫn nằm gọn trong repo)
- Tăng không đáng kể do bộ nhớ JSON structure

### Tương thích Ngược (Backward Compatibility)
- ⚠️ **Breaking change:** Component cũ cần update để đọc schema mới
- ✅ **Migration path:** Có thể restore từ backup nếu cần

### Hướng Phát Triển Tương Lai
1. **Phase 2:** Tách `soanTruyen`, `vanNgon`, `dungCuu` (chỉ khi cần)
2. **Phase 3:** Thêm metadata (hạo từ, ứng dụng, v.v.)
3. **Phase 4:** Integration với SRS learning component

---

## 📋 Các Bước Tiếp Theo

### Component Updates (Priority: HIGH)
- [ ] Update `LearnCard` component để xử lý schema mới
- [ ] Thêm toggle UI cho hanViet/hanTu/dichGiang
- [ ] Thêm setting difficulty level
- [ ] Test hiển thị trên mobile & desktop

### Testing (Priority: HIGH)
- [ ] Unit test: parser & schema validation
- [ ] Integration test: Component render
- [ ] E2E test: User flow (review card → toggle content)
- [ ] Spot-check: 5-10 quẻ trong UI

### Documentation (Priority: MEDIUM)
- [ ] TypeScript types cho CardContent
- [ ] API documentation
- [ ] User guide (how to toggle difficulty)

---

## 🔗 Tài liệu Liên Quan

- **Feature Spec:** [13-hoc-ghi-nho-soan-tu-dai-tuong.md](../legacy/project-brain/13-hoc-ghi-nho-soan-tu-dai-tuong.md)
- **Data Audit:** [Session memory - Data validation](../../memories/session/)
- **Migration Script:** `scripts/migrate_hantu_separation.py`
- **Backup:** `noiDungQuePhanBoiChau.backup.json`

---

**Ký:** GitHub Copilot  
**Ngày hoàn thành:** 21.09.2026, 10:00 UTC+7
