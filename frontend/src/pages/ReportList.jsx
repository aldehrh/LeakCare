import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportList.css';

function ReportList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('전체');

  const dummyReports = [
    { id: 1, url: 'https://example.com/site1', result: '유출 확인', date: '2026-03-25' },
    { id: 2, url: 'https://test-site.org/page', result: '미확인', date: '2026-03-26' },
  ];

  const filtered = filter === '전체' ? dummyReports : dummyReports.filter(r => r.result === filter);

  return (
    <div className="report-list-main">
      <div className="report-list-header">
        <div>
          <h2 className="report-list-title">결과 보고서</h2>
          <p className="report-list-sub">탐지 완료된 리스트를 확인하고 상세 보고서를 열람하세요.</p>
        </div>
      </div>

      <div className="report-filter-bar">
        {['전체', '유출 확인', '미확인'].map(f => (
          <button
            key={f}
            className={`report-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="report-table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>탐지 URL</th>
              <th>판정 결과</th>
              <th>생성일</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id} onClick={() => navigate(`/reports/${report.id}`)}>
                <td className="report-id">#{report.id}</td>
                <td className="report-url">{report.url}</td>
                <td>
                  <span className={`report-verdict ${report.result === '유출 확인' ? 'leak' : 'safe'}`}>
                    {report.result}
                  </span>
                </td>
                <td className="report-date">{report.date}</td>
                <td>
                  <button
                    className="report-detail-btn"
                    onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }}
                  >
                    상세 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportList;