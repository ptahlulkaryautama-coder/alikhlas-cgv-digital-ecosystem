const MOBILE_TASKS = [
  { label: 'Absensi', value: 'Draft cepat' },
  { label: 'Progres', value: 'Catatan kelas' },
  { label: 'Raport', value: 'Preview print' },
];

export default function TPQMobileAppFramePreview() {
  return (
    <section className="tpq-mobile-frame-wrap" aria-label="Preview stand-alone App Pengampu TPQ">
      <div className="tpq-mobile-frame-copy">
        <span>STAND-ALONE DIRECTION</span>
        <h3>Siap dipisah menjadi App Pengampu</h3>
        <p>
          Tampilan ini disiapkan supaya nanti bisa terasa seperti aplikasi TPQ sendiri:
          cepat di HP, fokus tugas harian, dan tetap memakai Supabase Auth/RLS/RPC yang sama.
        </p>
      </div>

      <div className="tpq-phone-mock" aria-label="Mockup layar mobile App Pengampu TPQ">
        <div className="tpq-phone-top">
          <strong>TPQ Al Mardhotillah</strong>
          <span>Safe shell</span>
        </div>
        <div className="tpq-phone-card primary">
          <small>Hari ini</small>
          <strong>3 tugas pengampu</strong>
          <span>Tanpa membuka data privat anak</span>
        </div>
        <div className="tpq-phone-task-list">
          {MOBILE_TASKS.map((task) => (
            <div className="tpq-phone-task" key={task.label}>
              <span>{task.label}</span>
              <strong>{task.value}</strong>
            </div>
          ))}
        </div>
        <div className="tpq-phone-bottom">
          <span>Beranda</span>
          <span>Kelas</span>
          <span>Raport</span>
        </div>
      </div>
    </section>
  );
}
