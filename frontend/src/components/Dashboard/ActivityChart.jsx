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
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(147, 51, 234, 0.2)', color: 'var(--color-grape-light)' }}>
            <BarChart2 size={18} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', color: 'white', fontFamily: 'var(--font-display)' }}>
            WEEKLY STUDY ACTIVITY
          </h3>
        </div>
        <span className="badge badge-grape" style={{ fontSize: '0.72rem' }}>AVG 2.6 HRS / DAY</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '200px',
        paddingTop: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        gap: '12px'
      }}>
        {days.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            height: '100%',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: index === 3 ? 'var(--color-grape-light)' : 'var(--text-muted)' }}>
              {item.hours}h
            </span>
            <div style={{
              width: '100%',
              maxWidth: '38px',
              height: `${item.percentage}%`,
              background: index === 3 ? 'linear-gradient(180deg, #c084fc 0%, #9333ea 100%)' : 'rgba(255, 255, 255, 0.12)',
              borderRadius: '6px 6px 2px 2px',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: index === 3 ? '0 0 20px rgba(147, 51, 234, 0.5)' : 'none',
              cursor: 'pointer'
            }} 
            title={`${item.day}: ${item.hours} hours logged`}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'uppercase', color: index === 3 ? '#ffffff' : 'var(--text-secondary)' }}>
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
