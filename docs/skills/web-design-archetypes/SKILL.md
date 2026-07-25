---
name: web-design-archetypes
description: Library gaya/archetype desain web konkret (mewah/luxurious, playful/charming, cute, funny/quirky, serious/corporate, dan lainnya) lengkap dengan token warna, pasangan tipografi, motif layout, karakter motion, dan voice tulisan per gaya — supaya draf pertama Claude langsung mendekati arahan, bukan generic default yang perlu banyak koreksi manual. WAJIB dipakai berbarengan dengan skill frontend-design setiap kali user minta bikin/redesain web, landing page, artifact HTML/React, atau proyek nyata (Next.js/kode repo) yang punya arahan gaya/mood tertentu — termasuk kalau user cuma sebut mood-nya secara ringkas ("bikin yang mewah", "landing page lucu/cute", "kesannya serius dan terpercaya", "kayak ThemeForest yang charming gitu") tanpa merinci detail teknis.
---

# Web Design Archetypes

Skill ini adalah **rak referensi gaya**, bukan pengganti `frontend-design`. Pakai keduanya bareng:

- `frontend-design` = prinsip proses (cara mikir, cara brainstorm, cara menghindari tampilan generic-AI, cara kritik diri sendiri sebelum build).
- `web-design-archetypes` (skill ini) = starting point konkret per mood — palet, tipografi, motif — supaya "draf pertama" udah 70-80% match, bukan mulai dari nol abu-abu.

Alasan skill ini ada: tanpa referensi konkret, Claude cenderung balik ke 2-3 default look yang sama (lihat kalibrasi di `frontend-design`) apa pun mood yang diminta. Dengan token siap pakai per archetype, hasil pertama jauh lebih dekat ke visi user — user tinggal arahkan penyesuaian, bukan mulai ulang dari template polos.

## Alur Kerja

1. **Kenali archetype yang diminta.** Kalau user sebut mood eksplisit ("mewah", "cute", "serius") atau kasih referensi ("kayak ThemeForest gaya luxury"), cocokkan ke salah satu file di `references/`. Kalau ambigu atau nyebut kombinasi ("elegan tapi ada sentuhan lucu"), lihat bagian **Blending** di bawah.
2. **Buka file referensi archetype yang cocok** (lihat daftar di bawah) — jangan asal comot dari ingatan, karena file referensi ini yang jadi sumber kebenaran token/motif per gaya.
3. **Cek konteks proyek dulu.** Kalau ini proyek existing (misal CGV10, situs masjid, OOI) yang sudah punya design token terkunci (warna brand, font, dsb — cek memori/dokumen proyek atau file kode existing), **jangan override** token yang sudah ditetapkan. Archetype library ini buat proyek baru atau bagian yang memang minta eksplorasi ulang.
4. **Jalankan proses dari `frontend-design`**: brainstorm token system, tapi mulai dari token archetype yang relevan sebagai basis — lalu **wajib disesuaikan ke brief spesifik** (subjek, audiens, konten nyata). Archetype kasih starting point gaya, bukan hasil akhir yang tinggal tempel. Dua brief "mewah" yang beda subjek (skincare vs private jet charter) harus tetap terasa berbeda.
5. **Build**, lalu kritik diri pakai checklist di bagian akhir tiap file referensi archetype sebelum dikasih ke user.
6. Kalau outputnya **artifact cepat** (Visualizer/HTML di chat), tetap load `visualize:read_me` module yang sesuai untuk constraint teknis (CSS vars, dimensi). Kalau outputnya **proyek nyata** (Next.js/repo), pakai skill dokumen/kode terkait dan patuhi struktur proyek yang sudah ada.

## Daftar Archetype

| File | Mood | Kapan dipakai |
|---|---|---|
| `references/luxurious-elegant.md` | Mewah, tenang, premium | Brand high-end, real estate mewah, jasa eksklusif, hospitality |
| `references/playful-charming.md` | Hangat, ramah, sedikit jenaka tapi tetap dewasa | Produk lifestyle, komunitas, brand yang mau kelihatan approachable |
| `references/cute-kawaii.md` | Imut, ringan, warna cerah, bentuk membulat | Brand anak/remaja, produk konsumsi ringan (donat, jajanan, merchandise), audiens Gen Z |
| `references/funny-quirky.md` | Nyeleneh, berani, humor sebagai identitas utama (bukan sekadar sentuhan) | Brand yang emang positioning-nya "beda sendiri", produk anti-mainstream |
| `references/serious-corporate.md` | Formal, tepercaya, kredibel | Institusi, B2B, keuangan, pemerintahan/organisasi resmi |

*(Daftar ini bisa terus nambah — lihat bagian "Menambah Archetype Baru" di bawah.)*

## Blending (Menggabungkan Dua Mood)

Brief real jarang 100% satu archetype murni. Kalau user minta kombinasi:

1. Tentukan **archetype dominan** (porsi 70%) dan **archetype aksen** (porsi 30%) — jangan campur rata 50:50, itu biasanya jadi bingung tanpa arah.
2. Ambil **token besar** (palet warna, tipografi display) dari archetype dominan.
3. Ambil **satu elemen signature** dari archetype aksen (misal: motion style, satu motif ilustrasi, atau nada copy) — bukan semua elemennya.
4. Contoh: "mewah tapi charming" → basis warna & tipografi dari `luxurious-elegant.md`, tapi voice tulisan dan micro-interaction dari `playful-charming.md`. Hasilnya: elegan secara visual, hangat secara nada bicara.

## Menambah Archetype Baru

User boleh minta archetype baru kapan saja ("gimana kalau gaya dark academia?", "coba gaya brutalist tapi hangat"). Kalau archetype yang diminta belum ada di tabel:

1. Buat file baru di `references/` pakai `references/_template.md` sebagai kerangka.
2. Riset ciri khas mood tersebut (kalau perlu, web search referensi visual/istilah desain terkait — jangan asal karang token).
3. Isi semua bagian di template: palet, tipografi, motif, motion, voice, kesalahan umum yang harus dihindari.
4. Tambahkan barisnya ke tabel "Daftar Archetype" di atas.
5. Simpan — archetype ini otomatis kepake di sesi berikutnya.

## Catatan Kalibrasi Kualitas

Sama seperti pesan di `frontend-design`: risiko terbesar bukan archetype-nya salah, tapi eksekusinya generic meski archetype-nya udah benar. Sebelum selesai, selalu tanya ke diri sendiri:

- Kalau saya jalankan brief yang mirip tapi subjeknya beda, apa hasilnya bakal keliatan sama? Kalau iya, ini masih terlalu generic — tambahkan detail yang spesifik ke brief ini.
- Apa signature element-nya (satu hal yang bikin orang inget desain ini) sudah jelas dan sesuai archetype-nya, atau cuma dekorasi standar?
- Apa saya sudah cek file referensi archetype-nya, atau saya cuma nebak dari ingatan umum soal "gaya mewah itu warna emas dan font serif"? Kalau yang terakhir, buka file referensinya dulu — di situ ada detail yang lebih spesifik dan anti-klise.
