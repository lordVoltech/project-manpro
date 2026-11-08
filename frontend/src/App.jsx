import { useState } from 'react';
import { mockDashboard, mockWorkOrders, mockShowroom } from './mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '480px', margin: '0 auto', padding: '16px', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Identitas */}
      <header style={{ background: '#1e293b', color: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Garasi Hobby</h2>
        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Sistem Operasional Showroom & Bengkel</p>
      </header>

      {/* Navigasi Menu */}
      <nav style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button onClick={() => setActiveTab('dashboard')} style={navBtnStyle(activeTab === 'dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('bengkel')} style={navBtnStyle(activeTab === 'bengkel')}>Bengkel (WO)</button>
        <button onClick={() => setActiveTab('showroom')} style={navBtnStyle(activeTab === 'showroom')}>Showroom</button>
      </nav>

      {/* Konten Dashboard */}
      {activeTab === 'dashboard' && (
        <div>
          <h3>Ringkasan Hari Ini</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div style={cardStyle}>
              <span style={{ fontSize: '12px', color: '#666' }}>Pendapatan</span>
              <h4 style={{ margin: '4px 0 0', color: '#16a34a' }}>Rp {mockDashboard.pendapatanHariIni.toLocaleString('id-ID')}</h4>
            </div>
            <div style={cardStyle}>
              <span style={{ fontSize: '12px', color: '#666' }}>WO Aktif</span>
              <h4 style={{ margin: '4px 0 0' }}>{mockDashboard.bengkelAktif} Motor</h4>
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: 'bold' }}>⚠️ Peringatan Stok</span>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>Ada {mockDashboard.stokMenipis} suku cadang di bawah batas minimum.</p>
          </div>
        </div>
      )}

      {/* Konten Bengkel (Work Order) */}
      {activeTab === 'bengkel' && (
        <div>
          <h3>Work Order (Bengkel Aktif)</h3>
          {mockWorkOrders.map((wo) => (
            <div key={wo.id} style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                <span>{wo.id}</span>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>{wo.status}</span>
              </div>
              <h4 style={{ margin: '6px 0 2px' }}>{wo.vehicle}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>Keluhan: {wo.complaint}</p>
              <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: '#64748b' }}>Pelanggan: {wo.customer} | Mekanik: {wo.mechanic}</span>
            </div>
          ))}
        </div>
      )}

      {/* Konten Showroom */}
      {activeTab === 'showroom' && (
        <div>
          <h3>Inventaris Showroom</h3>
          {mockShowroom.map((item) => (
            <div key={item.id} style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px' }}>{item.name}</h4>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb' }}>Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
              <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: item.status === 'Tersedia' ? '#dcfce7' : '#fef9c3', color: item.status === 'Tersedia' ? '#166534' : '#854d0e' }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
};

const navBtnStyle = (isActive) => ({
  flex: 1,
  padding: '8px 12px',
  background: isActive ? '#2563eb' : '#fff',
  color: isActive ? '#fff' : '#334155',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

export default App;