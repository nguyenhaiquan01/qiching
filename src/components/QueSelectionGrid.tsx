import React, { useMemo } from "react";
import { HinhQue } from "./HinhQue";
import { NOI_DUNG_QUE } from "../core/data/noiDungQue";
import "./QueSelectionGrid.css";

interface QueSelectionGridProps {
  selectedQueNumbers: Set<number>;
  onToggleQue: (queNumber: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onRandomSelect: (count: number) => void;
}

export const QueSelectionGrid: React.FC<QueSelectionGridProps> = ({
  selectedQueNumbers,
  onToggleQue,
  onSelectAll,
  onClearAll,
  onRandomSelect,
}) => {
  // Cùng nguồn `NOI_DUNG_QUE` (Nguyễn Hiến Lê) mà trang "64 Quẻ Kinh Dịch" (`DanhSachQue.tsx`)
  // dùng, để tên quẻ và hình hexagram khớp đúng định dạng hiển thị ở đó (không suy ra tên quẻ
  // từ `tenQue.split(" ")[0]` của bản Phan Bội Châu — chuỗi đó luôn bắt đầu bằng "QUẺ ..." nên
  // tách từ đầu chỉ ra được chữ "QUẺ" cho mọi quẻ).
  const gridItems = useMemo(() => {
    return NOI_DUNG_QUE.map((que) => ({
      soThuTu: que.soThuTu,
      tenQue: que.tenQue,
      queThuong: que.queThuong,
      queHa: que.queHa,
      isSelected: selectedQueNumbers.has(que.soThuTu),
    }));
  }, [selectedQueNumbers]);

  const handleRandomClick = (count: number) => {
    if (count > 64) count = 64;
    onRandomSelect(count);
  };

  return (
    <div className="que-selection-grid">
      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="quick-btn random"
          onClick={() => handleRandomClick(5)}
        >
          🎲 Random 5
        </button>
        <button
          className="quick-btn random"
          onClick={() => handleRandomClick(10)}
        >
          🎲 Random 10
        </button>
        <button
          className="quick-btn random"
          onClick={() => handleRandomClick(20)}
        >
          🎲 Random 20
        </button>
        <button className="quick-btn all" onClick={onSelectAll}>
          ✅ Tất cả 64
        </button>
        <button className="quick-btn clear" onClick={onClearAll}>
          ❌ Bỏ tất cả
        </button>
      </div>

      {/* Grid 8x8 */}
      <div className="grid-container">
        <div className="que-grid">
          {gridItems.map((item) => (
            <div key={item.soThuTu} className="grid-item">
              <button
                className={`grid-button ${item.isSelected ? "selected" : ""}`}
                onClick={() => onToggleQue(item.soThuTu)}
                title={item.tenQue}
              >
                <div className="grid-number">{item.soThuTu}</div>

                <HinhQue queThuong={item.queThuong} queHa={item.queHa} cachDong="gon" />

                <div className="grid-name">{item.tenQue}</div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="selection-stats">
        <span className="stat-label">Đã chọn:</span>
        <span className="stat-value">{selectedQueNumbers.size} / 64 quẻ</span>
      </div>
    </div>
  );
};

export default QueSelectionGrid;
