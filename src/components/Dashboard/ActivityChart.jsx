import React from 'react';
import { BarChart2 } from 'lucide-react';

export function ActivityChart() {
  const days = [
    { day: 'Mon', hours: 2.5, percentage: 60 },
    { day: 'Tue', hours: 3.8, percentage: 90 },
    { day: 'Wed', hours: 1.5, percentage: 40 },
    { day: 'Thu', hours: 4.2, percentage: 100 },
    { day: 'Fri', hours: 2.0, percentage: 50 },
    { day: 'Sat', hours: 0.8, percentage: 20 },
    { day: 'Sun', hours: 3.2, percentage: 75 },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
            <BarChart2 size={18} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Weekly Study Activity</h3>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>Avg 2.6 hrs / day</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justify: 'space-between',
        height: '180px',
        paddingTop: '20px',
        borderBottom: '1px solid var(--border-color)',
        gap: '12px'
      }}>
        {days.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            height: '100%',
            justify: 'flex-end',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: index === 3 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
              {item.hours}h
            </span>
            <div style={{
              width: '100%',
              maxWidth: '36px',
              height: `${item.percentage}%`,
              background: index === 3 ? 'linear-gradient(180deg, #38bdf8 0%, #a855f7 100%)' : 'rgba(56, 189, 248, 0.22)',
              borderRadius: '8px 8px 3px 3px',
              transition: 'all 0.4s ease',
              boxShadow: index === 3 ? 'var(--shadow-glow-cyan)' : 'none',
              cursor: 'pointer'
            }} 
            title={`${item.day}: ${item.hours} hours logged`}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: index === 3 ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
