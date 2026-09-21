import React, { useState, useMemo } from "react";
import LearnCard from "../components/LearnCard";
import { NOI_DUNG_QUE_PHAN_BOI_CHAU } from "../core/data/noiDungQuePhanBoiChau";
import "./HocGhiNho.css";

/**
 * Trang học ghi nhớ Spaced Repetition
 * 
 * Người dùng chọn loại nội dung muốn học:
 * - Soán Từ: 64 thẻ (1 cho mỗi quẻ)
 * - Đại Tượng Truyện: 64 thẻ (1 cho mỗi quẻ)
 * - Cả 2: 128 thẻ (2 cho mỗi quẻ)
 */
export const HocGhiNho: React.FC = () => {
  // Selection state
  const [includeSoanTu, setIncludeSoanTu] = useState(true);
  const [includeDaiTuong, setIncludeDaiTuong] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Build card list dựa trên selection
  const cards = useMemo(() => {
    const result: Array<{
      id: string;
      title: string;
      contentType: "soanTu" | "daiTuongTruyen";
      data: typeof NOI_DUNG_QUE_PHAN_BOI_CHAU[0];
    }> = [];

    NOI_DUNG_QUE_PHAN_BOI_CHAU.forEach((que) => {
      // Soán Từ
      if (includeSoanTu) {
        result.push({
          id: `${que.soThuTu}-soan`,
          title: `Quẻ ${que.soThuTu} - Soán Từ`,
          contentType: "soanTu",
          data: que,
        });
      }

      // Đại Tượng Truyện
      if (includeDaiTuong) {
        result.push({
          id: `${que.soThuTu}-dai`,
          title: `Quẻ ${que.soThuTu} - Đại Tượng Truyện`,
          contentType: "daiTuongTruyen",
          data: que,
        });
      }
    });

    return result;
  }, [includeSoanTu, includeDaiTuong]);

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

  const handleStartSession = () => {
    if (!includeSoanTu && !includeDaiTuong) {
      alert("Vui lòng chọn ít nhất 1 loại nội dung để học");
      return;
    }
    setSessionStarted(true);
    setCurrentIndex(0);
    setResults({});
    setStats({ remember: 0, forget: 0 });
  };

  const handleResetSession = () => {
    setSessionStarted(false);
  };

  const handleRestartCurrentSession = () => {
    setCurrentIndex(0);
    setResults({});
    setStats({ remember: 0, forget: 0 });
  };

  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;
  const reviewedCount = Object.keys(results).length;

  // Content selection screen
  if (!sessionStarted) {
    return (
      <div className="hoc-ghi-nho selection-screen">
        <div className="hnh-header">
          <h1>🧠 Học Ghi Nhớ Kinh Dịch</h1>
          <p className="subtitle">
            Chọn loại nội dung bạn muốn học
          </p>
        </div>

        <div className="selection-container">
          <div className="selection-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeSoanTu}
                onChange={(e) => setIncludeSoanTu(e.target.checked)}
              />
              <span className="checkbox-text">
                <strong>📜 Soán Từ</strong>
                <em>Dịch và giảng thích tên quẻ</em>
              </span>
            </label>
          </div>

          <div className="selection-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeDaiTuong}
                onChange={(e) => setIncludeDaiTuong(e.target.checked)}
              />
              <span className="checkbox-text">
                <strong>📖 Đại Tượng Truyện</strong>
                <em>Dịch và giảng thích hình tượng quẻ</em>
              </span>
            </label>
          </div>
        </div>

        <div className="card-count">
          <p>
            {includeSoanTu && includeDaiTuong
              ? "128 thẻ (64 quẻ × 2 loại)"
              : includeSoanTu || includeDaiTuong
                ? "64 thẻ (64 quẻ × 1 loại)"
                : "Chọn ít nhất 1 loại"}
          </p>
        </div>

        <button className="start-button" onClick={handleStartSession}>
          🚀 Bắt đầu học
        </button>
      </div>
    );
  }

  // Learning session screen
  return (
    <div className="hoc-ghi-nho">
      {/* Header */}
      <div className="hnh-header">
        <h1>🧠 Học Ghi Nhớ Kinh Dịch</h1>
        <p className="subtitle">
          Spaced Repetition Learning - {cards.length} thẻ
          {includeSoanTu && includeDaiTuong ? " (64 quẻ × 2 loại)" : " (64 quẻ × 1 loại)"}
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
            haoTu={currentCard.data.haoTu}
            tenQue={currentCard.data.tenQue}
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

      {/* Session Control */}
      <div className="session-control">
        <button className="restart-btn" onClick={handleRestartCurrentSession}>
          ↻ Quay lại từ đầu
        </button>
        <button className="change-content-btn" onClick={handleResetSession}>
          ⚙️ Thay đổi nội dung
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
          <button className="reset-button" onClick={handleResetSession}>
            ↻ Học lại
          </button>
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
