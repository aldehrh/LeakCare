import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, AlertCircle, ImagePlus } from 'lucide-react';
import '../styles/DetectRequest.css';

// AppRouter에서 넘겨준 props 유지
const DetectRequest = ({ registeredPhotos, jobs, setJobs }) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');

  // 폼 제출 
  const handleSubmit = (e) => {
    e.preventDefault();

    // 신규 작업 데이터 생성
    const newJob = {
      id: Date.now(), 
      url: url,
      requestedAt: new Date().toLocaleString(), 
      status: 'pending', 
      errorMessage: '',
    };

    
    setJobs([newJob, ...jobs]);

    alert("탐지 요청이 정상적으로 제출되었습니다. 등록된 모든 사진과 대조를 시작합니다.");
    navigate('/jobs'); 
  };

  // 사진이 없을 때 예외 처리 
  if (registeredPhotos.length === 0) {
    return (
      <div className="detect-wrapper">
        <div className="no-photo-card" style={{ textAlign: 'center', padding: '60px' }}>
          <AlertCircle size={48} color="#6366f1" style={{ marginBottom: '20px' }} />
          <h2>등록된 사진이 없습니다!</h2>
          <p>탐지 요청을 위해 먼저 본인 사진을 등록해 주세요.</p>
          <button onClick={() => navigate('/photos')} className="btn-go-upload" style={{ marginTop: '20px' }}>
            <ImagePlus size={18} /> 사진 등록하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detect-wrapper">
      <header className="page-header">
        <h1>새 탐지 요청</h1>
        <p>의심되는 URL을 입력하면 등록된 모든 사진과 대조하여 분석을 시작합니다. (일일 한도 5건) </p> 
      </header>

      <form className="detect-form" onSubmit={handleSubmit}>
        <div className="section">
          <label><Search size={16} /> 의심 URL 입력</label> 
          <input 
            type="url" 
            placeholder="https://example.com" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            required 
          />
        </div>

        {/* 등록된 사진 정보 */}
        <div className="section">
          <label><ShieldCheck size={16} /> 분석 대상 안내</label>
          <div className="selected-preview-min" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {registeredPhotos.slice(0, 5).map(photo => (
                <img 
                  key={photo.id} 
                  src={photo.url} 
                  alt="Thumbnail" 
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} 
                />
              ))}
            </div>
            <div style={{ fontSize: '13px', color: '#5C5CFF', lineHeight: '1.4' }}>
              현재 등록된 <strong>{registeredPhotos.length}장</strong>의 사진으로 <br/>
              실시간 교차 분석을 진행합니다. 
            </div>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={!url}>
          탐지 요청 제출하기
        </button>
      </form>
    </div>
  );
};

export default DetectRequest;