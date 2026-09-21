import React, { useState, useMemo } from "react";
import LearnCard from "../components/LearnCard";
import { NOI_DUNG_QUE_PHAN_BOI_CHAU } from "../core/data/noiDungQuePhanBoiChau";
import "./HocGhiNho.css";

/**
 * Trang học ghi nhớ Spaced Repetition (MVP)
 * 
 * MVP scope: 128 thẻ học (64 quẻ × 2 loại: soanTu + daiTuongTruyen)
 * Mỗi thẻ có 3 mức độ khó + Leitner 2-level scoring
 */
export const HocGhiNho: React.FC = () => {
  // Build card list: 64 quẻ × 2 loại nội dung
  const cards = useMemo(() => {
    const result: Array<{
      id: string;
      title: string;
      contentType: "soanTu" | "daiTuongTruyen";
      data: typeof NOI_DUNG_QUE_PHAN_BOI_CHAU[0];
    }> = [];

    NOI_DUNG_QUE_PHAN_BOI_CHAU.forEach((que) => {
      // Card 1: Soán Từ
      result.push({
        id: `${que.soThuTu}-soan`,
        title: `Quẻ ${que.soThuTu} - Soán Từ`,
        contentType: "soanTu",
        data: que,
      });

      // Card 2: Đại Tượng Truyện
      result.push({
        id: `${que.soThuTu}-dai`,
        title: `Quẻ ${que.soThuTu} - Đại Tượng Truyện`,
        contentType: "daiTuongTruyen",
        data: que,
      });
    });

    return result;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, "remember" | "forget">>(
    {}
  );
  const [stats, setStats] = useState({ remember: 0, forget: 0 });

  const currentCard = cards[currentIndex];

  const handleReview = (result: "remember" | "forget") => {
    setResults((prev) => ({
      ...prev,
      [currentCard.id]: result,
    }));

    setStats((prev) => ({
      ...prev,
      [result]: prev[result] + 1,
    }));

    // Move to next card
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("🎉 Hoàn thành! Đã review tất cả thẻ.");
      }
    }, 1500);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleJumpTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, cards.length - 1)));
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const reviewedCount = Object.keys(results).length;

  return (
    <div className="hoc-ghi-nho">
      {/* Header */}
      <div className="hnh-header">
        <h1>🧠 Học Ghi Nhớ Kinh Dịch</h1>
        <p className="subtitle">
          Spaced Repetition Learning - 128 thẻ (64 quẻ × 2 nội dung)
        </p>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Tiến độ:</span>
          <span className="stat-value">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">✅ Nhớ:</span>
          <span className="stat-value remember">{stats.remember}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">❌ Quên:</span>
          <span className="stat-value forget">{stats.forget}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Review:</span>
          <span className="stat-value">
            {reviewedCount} / {cards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Main Card */}
      <div className="card-container">
        {currentCard && (
          <LearnCard
            key={currentCard.id}
            content={currentCard.data[currentCard.contentType]}
            title={currentCard.title}
            index={currentIndex}
            total={cards.length}
            onReview={handleReview}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="navigation-buttons">
        <button
          className="nav-btn prev"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ← Quay lại
        </button>

        <div className="jump-control">
          <input
            type="number"
            min={1}
            max={cards.length}
            value={currentIndex + 1}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                handleJumpTo(val - 1);
              }
            }}
            className="jump-input"
          />
          <span className="jump-label">/ {cards.length}</span>
        </div>

        <button
          className="nav-btn next"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Tiếp theo →
        </button>
      </div>

      {/* Finish Message */}
      {currentIndex === cards.length - 1 && reviewedCount === cards.length && (
        <div className="finish-message">
          <h2>🎊 Hoàn thành buổi học!</h2>
          <p>
            Nhớ: <strong>{stats.remember}</strong> | Quên: <strong>{stats.forget}</strong>
          </p>
          <p className="accuracy">
            Độ chính xác: <strong>{Math.round((stats.remember / cards.length) * 100)}%</strong>
          </p>
        </div>
      )}

      {/* Debug Info (for development) */}
      <div className="debug-info">
        <details>
          <summary>ℹ️ Debug Info</summary>
          <pre>{JSON.stringify(currentCard?.data[currentCard.contentType], null, 2)}</pre>
        </details>
      </div>
    </div>
  );
};

export default HocGhiNho;
