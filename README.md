Supplify

Sistem Pendukung Keputusan (SPK) untuk menentukan supplier terbaik menggunakan metode Simple Additive Weighting (SAW).
Supplify membantu mempermudah proses penilaian supplier secara objektif berdasarkan beberapa kriteria yang telah ditentukan.

🎯 Tujuan Sistem

Supplify dibuat untuk memberikan rekomendasi supplier terbaik berdasarkan hasil perhitungan SAW dengan mempertimbangkan berbagai kriteria seperti harga, kualitas, ketepatan waktu, dan pelayanan.

🧠 Metode yang Digunakan
Simple Additive Weighting (SAW)

SAW adalah metode penjumlahan terbobot yang menghitung nilai setiap alternatif berdasarkan:

Normalisasi data kriteria

Perkalian dengan bobot masing-masing kriteria

Penjumlahan nilai akhir

Pemilihan supplier terbaik berdasarkan nilai tertinggi

📊 Kriteria yang Digunakan

Kriteria dapat disesuaikan, namun contoh dalam sistem ini:
| Kode | Kriteria        | Tipe    |
| ---- | --------------- | ------- |
| C1   | Harga           | Cost    |
| C2   | Kualitas Produk | Benefit |
| C3   | Ketepatan Waktu | Benefit |
| C4   | Pelayanan       | Benefit |

📂 Struktur Proyek
Supplify/
│── index.html
│── app.js
│── styles.css
│── suppliers.csv
│── README.md

⚙️ Cara Menggunakan

Clone atau download proyek:
git clone https://github.com/HafidzFaujan/Supplify.git
Buka file index.html di browser.
Import data supplier melalui suppliers.csv atau input manual di form.
Klik tombol Hitung SAW.
Sistem akan menampilkan peringkat supplier dari terbaik hingga terendah.

📈 Output Sistem

Tabel normalisasi
Perhitungan nilai akhir SAW
Peringkat supplier secara otomatis
Supplier terbaik ditampilkan di bagian hasil

💡 Keunggulan Supplify

Perhitungan otomatis dan akurat
Tampilan sederhana dan mudah dipahami
Data dapat diubah sesuai kebutuhan
Mendukung banyak kriteria dan supplier

🧑‍💻 Teknologi yang Digunakan

HTML
CSS
JavaScript
CSV (untuk input data)

📜 Lisensi

Proyek ini bersifat open-source dan bebas digunakan untuk kebutuhan belajar atau pengembangan SPK.
