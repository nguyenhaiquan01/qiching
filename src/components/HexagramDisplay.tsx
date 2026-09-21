import React from "react";
import "./HexagramDisplay.css";

interface HaoInfo {
  vach: number;
  nhan: string;
  noiDung?: string;
}

interface HexagramDisplayProps {
  haoTu: HaoInfo[];
  tenQue: string;
}

/**
 * Hiển thị quẻ dịch dưới dạng 6 vạch (hào)
 * - Vạch liền: Yang (Cửu - dương)
 * - Vạch đứt đôi: Yin (Lục - âm)
 */
export const HexagramDisplay: React.FC<HexagramDisplayProps> = ({
  haoTu,
  tenQue,
}) => {
  const isYang = (nhan: string): boolean => {
    return nhan.includes("Cửu");
  };

  return (
    <div className="hexagram-display">
      <div className="hexagram-title">{tenQue}</div>
      <div className="hexagram-lines">
        {haoTu.map((hao) => (
          <div
            key={hao.vach}
            className={`hexagram-line ${isYang(hao.nhan) ? "yang" : "yin"}`}
          >
            {isYang(hao.nhan) ? (
              <div className="line solid"></div>
            ) : (
              <div className="line broken">
                <div className="break-left"></div>
                <div className="break-right"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
