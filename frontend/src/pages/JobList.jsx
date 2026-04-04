import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock3,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  Search,
  FileText,
  AlertCircle,
  Copy,
} from 'lucide-react';
import '../styles/JobList.css';

const JobList = ({ jobs, setJobs }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.status === 'pending') return { ...job, status: 'processing' };
          if (job.status === 'processing') return { ...job, status: 'completed' };
          return job;
        })
      );
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [setJobs]);

  const handleRetry = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: 'pending',
              errorMessage: '',
              requestedAt: new Date().toLocaleString(),
            }
          : job
      )
    );
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleCopyJobId = async (e, jobId) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(jobId));
      alert(`작업 ID #${jobId} 복사 완료`);
    } catch (error) {
      console.error('복사 실패:', error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: '대기',
      processing: '분석중',
      completed: '완료',
      failed: '오류',
    };
    return labels[status] || '알 수 없음';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock3 size={14} />;
      case 'processing':
        return <LoaderCircle size={14} className="spin-icon" />;
      case 'completed':
        return <CheckCircle2 size={14} />;
      case 'failed':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const truncateUrl = (url, maxLength = 32) => {
    if (!url) return '-';
    return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
  };

  const summaryCards = useMemo(
    () => [
      { label: '전체', value: 'all', className: 'all', count: jobs.length },
      {
        label: '대기',
        value: 'pending',
        className: 'pending',
        count: jobs.filter((j) => j.status === 'pending').length,
      },
      {
        label: '분석중',
        value: 'processing',
        className: 'processing',
        count: jobs.filter((j) => j.status === 'processing').length,
      },
      {
        label: '완료',
        value: 'completed',
        className: 'completed',
        count: jobs.filter((j) => j.status === 'completed').length,
      },
      {
        label: '오류',
        value: 'failed',
        className: 'failed',
        count: jobs.filter((j) => j.status === 'failed').length,
      },
    ],
    [jobs]
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword = `${job.id} ${job.url} ${getStatusLabel(job.status)}`
      .toLowerCase()
      .includes(keyword.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ? true : job.status === selectedStatus;

    return matchesKeyword && matchesStatus;
  });

  return (
    <div className="joblist-wrapper">
      <header className="joblist-header">
        <div className="header-text">
          <h1>작업 목록</h1>
          <p>탐지 엔진이 실시간으로 URL을 분석 중입니다.</p>
        </div>

        <button type="button" className="refresh-btn" onClick={handleRefresh}>
          <RefreshCw size={16} /> 새로고침
        </button>
      </header>

      <section className="joblist-summary">
        {summaryCards.map((card) => (
          <button
            key={card.label}
            type="button"
            className={`summary-card ${card.className} ${
              selectedStatus === card.value ? 'active' : ''
            }`}
            onClick={() => setSelectedStatus(card.value)}
          >
            <span className="summary-label">{card.label}</span>
            <strong className="summary-count">{card.count}</strong>
          </button>
        ))}
      </section>

      <section className="joblist-topbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="작업 ID, URL, 상태로 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="polling-info">
          <div className="dot-blink"></div>
          <div className="polling-meta">
            <span className="polling-text">5초 간격 자동 갱신 중</span>
            <span className="time-label">
              마지막 업데이트: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </section>

      <div className="joblist-table-container">
        <div className="joblist-table-head">
          <div className="col-id">작업 ID</div>
          <div className="col-url">의심 URL</div>
          <div className="col-date">요청 일시</div>
          <div className="col-status">상태</div>
          <div className="col-action">관리</div>
        </div>

        <div className="joblist-table-body">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={32} />
              <p>해당하는 작업 내역이 없습니다.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="joblist-row clickable-row"
                onClick={() => {
                  if (job.status === 'completed') {
                    navigate(`/reports/${job.id}`);
                  }
                }}
              >
                <div className="col-id">
                  <div className="job-id-box">
                    <span className="job-id-text">#{job.id}</span>
                    <button
                      type="button"
                      className="copy-id-btn"
                      title="작업 ID 복사"
                      onClick={(e) => handleCopyJobId(e, job.id)}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="col-url" title={job.url}>
                  {truncateUrl(job.url)}
                </div>

                <div className="col-date">{job.requestedAt}</div>

                <div className="col-status">
                  <span className={`status-badge ${job.status}`}>
                    {getStatusIcon(job.status)}
                    {getStatusLabel(job.status)}
                  </span>
                </div>

                <div className="col-action">
                  {job.status === 'completed' ? (
                    <button
                      className="btn-report"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reports/${job.id}`);
                      }}
                    >
                      <FileText size={14} /> 보고서
                    </button>
                  ) : job.status === 'failed' ? (
                    <button
                      className="btn-retry"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetry(job.id);
                      }}
                    >
                      <RotateCcw size={14} /> 재시도
                    </button>
                  ) : (
                    <span className="analyzing-text">분석 중...</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;