/**
 * RecentActivity.jsx — Recent activity feed
 *
 * Displays mock recent events (kas masuk/keluar, program updates, agenda).
 * NO real donor names, amounts, or private transaction data.
 */

import { mockActivity } from '../../data/dashboardMockData.js';

export default function RecentActivity() {
  return (
    <div className="db-card">
      <div className="db-cp">
        <div className="db-card-head">
          <div>
            <div className="db-card-title">Aktivitas Terbaru</div>
            <div className="db-card-sub">Data ilustratif — belum terhubung ke GAS</div>
          </div>
          <span
            className="db-chip b"
            style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px' }}
          >
            Mock
          </span>
        </div>

        <div className="db-act-list" role="list" aria-label="Aktivitas terbaru">
          {mockActivity.map((item) => (
            <div key={item.id} className="db-act-item" role="listitem">
              <div
                className={`db-act-dot ${item.dotClass}`}
                aria-hidden="true"
              >
                {item.emoji}
              </div>
              <div>
                <div className="db-act-text">{item.text}</div>
                <div className="db-act-sub">{item.sub}</div>
                <div className="db-act-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
