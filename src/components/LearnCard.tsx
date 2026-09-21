import React, { useState } from "react";
import type { CardContent } from "../core/types";
import { DifficultyLevel } from "../core/types";
import { HexagramDisplay } from "./HexagramDisplay";
import "./LearnCard.css";

interface HaoInfo {
  vach: number;
  nhan: string;
  noiDung?: string;
}

interface LearnCardProps {
  /** Nội dung học tập (quẻ cơ bản hoặc hào cụ thể) */
  content: CardContent;
  /** Tiêu đề thẻ (ví dụ: "Quẻ 1 - Càn", "Hào 1 - Cửu Sơ") */
  title: string;
  /** Optional: Số thứ tự để hiển thị card count */
  index?: number;
  total?: number;
  /** Callback khi thẻ được review */
  onReview?: (result: "remember" | "forget") => void;
  /** CSS class thêm vào */
  className?: string;
  /** Optional: Mảng hào để hiển thị hexagram */
  haoTu?: HaoInfo[];
  /** Optional: Tên quẻ để hiển thị */
  tenQue?: string;
}

/**
 * Thẻ học Spaced Repetition với hỗ trợ 3 mức độ khó:
 * - Easy: Dịch Việt + Giảng (không Hán tự)
 * - Medium: Dịch Việt + Hán tự + Giảng
 * - Hard: Chỉ Hán tự
 *
 * Người dùng có thể chuyển đổi mức độ và nhận kết quả (Nhớ/Quên) để cập nhật SRS score.
 */
export const LearnCard: React.FC<LearnCardProps> = ({
  content,
  title,
  index,
  total,
  onReview,
  className = "",
  haoTu,
  tenQue,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    DifficultyLevel.Easy
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleReview = (result: "remember" | "forget") => {
    setShowFeedback(true);
    onReview?.(result);

    // Reset after 1.5s
    setTimeout(() => {
      setShowFeedback(false);
      setIsFlipped(false);
    }, 1500);
  };

  const difficultyButtons = [
    { level: DifficultyLevel.Easy, label: "Dễ" },
    { level: DifficultyLevel.Medium, label: "Trung bình" },
    { level: DifficultyLevel.Hard, label: "Khó" },
  ];

  // Render nội dung tùy theo mức độ khó
  const renderContent = () => {
    switch (difficulty) {
      case DifficultyLevel.Easy:
        return (
          <div className="card-content-easy">
            <div className="dichviet">{content.hanViet}</div>
            <div className="dichgiang">{content.dichGiang}</div>
          </div>
        );

      case DifficultyLevel.Medium:
        return (
          <div className="card-content-medium">
            <div className="hantu">{content.hanTu}</div>
            <div className="dichviet">{content.hanViet}</div>
            <div className="dichgiang">{content.dichGiang}</div>
          </div>
        );

      case DifficultyLevel.Hard:
        return (
          <div className="card-content-hard">
            <div className="hantu-large">{content.hanTu}</div>
          </div>
        );
    }
  };

  return (
    <div className={`learn-card ${className}`}>
      {/* Header */}
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
        {index !== undefined && total !== undefined && (
          <span className="card-counter">
            {index + 1} / {total}
          </span>
        )}
      </div>

      {/* Mức độ khó */}
      <div className="difficulty-selector">
        {difficultyButtons.map(({ level, label }) => (
          <button
            key={level}
            className={`difficulty-btn ${difficulty === level ? "active" : ""}`}
            onClick={() => setDifficulty(level)}
            disabled={showFeedback}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hexagram Display */}
      {haoTu && tenQue && <HexagramDisplay haoTu={haoTu} tenQue={tenQue} />}

      {/* Nội dung thẻ */}
      <div
        className={`card-body ${isFlipped ? "flipped" : ""} ${
          showFeedback ? "feedback-shown" : ""
        }`}
        onClick={() => !showFeedback && setIsFlipped(!isFlipped)}
      >
        {!isFlipped && !showFeedback && (
          <div className="flip-hint">👆 Bấm để xem đáp án</div>
        )}

        {isFlipped && !showFeedback && (
          <div className="card-content">{renderContent()}</div>
        )}

        {showFeedback && (
          <div className="feedback-message">
            <span>✓ Đã lưu kết quả</span>
          </div>
        )}
      </div>

      {/* Nút review */}
      {isFlipped && !showFeedback && (
        <div className="review-buttons">
          <button
            className="review-btn forget"
            onClick={() => handleReview("forget")}
          >
            😰 Quên
          </button>
          <button
            className="review-btn remember"
            onClick={() => handleReview("remember")}
          >
            😊 Nhớ
          </button>
        </div>
      )}
    </div>
  );
};

export default LearnCard;
