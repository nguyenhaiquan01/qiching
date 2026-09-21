import React from "react";
import { HinhQue } from "./HinhQue";
import "./HexagramDisplay.css";

interface HexagramDisplayProps {
  queThuong: string;
  queHa: string;
  tenQue: string;
}

/**
 * Hiển thị quẻ dịch dưới dạng 6 vạch — dùng lại `HinhQue` (cùng component vẽ hexagram ở trang
 * "64 Quẻ Kinh Dịch") thay vì tự vẽ riêng bằng `haoTu[].nhan`, tránh lệch/không đều giữa các
 * hào do phải tự canh `gap` cho từng cặp vạch đứt bằng tay.
 */
export const HexagramDisplay: React.FC<HexagramDisplayProps> = ({
  queThuong,
  queHa,
  tenQue,
}) => {
  return (
    <div className="hexagram-display">
      <div className="hexagram-title">{tenQue}</div>
      <HinhQue queThuong={queThuong} queHa={queHa} />
    </div>
  );
};
