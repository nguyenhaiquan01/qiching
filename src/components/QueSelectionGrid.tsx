import React, { useMemo } from "react";
import { NOI_DUNG_QUE_PHAN_BOI_CHAU } from "../core/data/noiDungQuePhanBoiChau";
import "./QueSelectionGrid.css";

interface QueSelectionGridProps {
  selectedQueNumbers: Set<number>;
  onToggleQue: (queNumber: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onRandomSelect: (count: number) => void;
}

const isYang = (nhan: string): boolean => {
  return nhan.includes("Cửu");
};

export const QueSelectionGrid: React.FC<QueSelectionGridProps> = ({
  selectedQueNumbers,
  onToggleQue,
  onSelectAll,
  onClearAll,
  onRandomSelect,
}) => {
  // Create grid of 8x8 (64 quẻ) with hexagram data
  const gridItems = useMemo(() => {
    return NOI_DUNG_QUE_PHAN_BOI_CHAU.map((que) => ({
      soThuTu: que.soThuTu,
      tenQue: que.tenQue.split(" ")[0], // Get first part of name for display
      haoTu: que.haoTu,
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
                
                {/* Compact Hexagram */}
                <div className="grid-hexagram">
                  {item.haoTu.map((hao) => (
                    <div
                      key={hao.vach}
                      className={`hex-line ${isYang(hao.nhan) ? "yang" : "yin"}`}
                    >
                      {isYang(hao.nhan) ? (
                        <div className="hex-solid"></div>
                      ) : (
                        <div className="hex-broken">
                          <span></span>
                          <span></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

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
