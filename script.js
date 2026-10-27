
const KEY = "moneytrack_data";

const form = document.getElementById("formTransaksi");
const deskripsi = document.getElementById("deskripsi");
const jenis = document.getElementById("jenis");
const kategori = document.getElementById("kategori");
const jumlah = document.getElementById("jumlah");
const tanggal = document.getElementById("tanggal");
const pencarian = document.getElementById("pencarian");
const isiTabel = document.getElementById("isiTabel");
const pesan = document.getElementById("pesan");

let transaksi = [];

try {
  transaksi = JSON.parse(localStorage.getItem(KEY)) || [];
  if (!Array.isArray(transaksi)) transaksi = [];
} catch {
  transaksi = [];
}

function tanggalLokal() {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

function rupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

function formatTanggal(nilai) {
  const [tahun, bulan, hari] = nilai.split("-").map(Number);
  return new Date(tahun, bulan - 1, hari).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function simpanData() {
  localStorage.setItem(KEY, JSON.stringify(transaksi));
}

function perbaruiRingkasan() {
  const masuk = transaksi
    .filter(item => item.jenis === "masuk")
    .reduce((total, item) => total + item.jumlah, 0);

  const keluar = transaksi
    .filter(item => item.jenis === "keluar")
    .reduce((total, item) => total + item.jumlah, 0);

  document.getElementById("saldo").textContent = rupiah(masuk - keluar);
  document.getElementById("pemasukan").textContent = rupiah(masuk);
  document.getElementById("pengeluaran").textContent = rupiah(keluar);
  document.getElementById("jumlahTransaksi").textContent =
    `${transaksi.length} transaksi`;
}

function tampilkanTransaksi() {
  const kata = pencarian.value.trim().toLowerCase();

  const hasil = transaksi
    .filter(item =>
      item.deskripsi.toLowerCase().includes(kata) ||
      item.kategori.toLowerCase().includes(kata)
    )
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  isiTabel.replaceChildren();

  if (hasil.length === 0) {
    const baris = isiTabel.insertRow();
    const sel = baris.insertCell();
    sel.colSpan = 4;
    sel.className = "empty";
    sel.textContent = kata
      ? "Transaksi tidak ditemukan."
      : "Belum ada transaksi. Silakan tambahkan transaksi.";
    return;
  }

  hasil.forEach(item => {
    const baris = isiTabel.insertRow();

    const nama = baris.insertCell();
    const teksNama = document.createElement("strong");
    teksNama.textContent = item.deskripsi;
    const teksKategori = document.createElement("div");
    teksKategori.className = "muted";
    teksKategori.style.marginTop = "5px";
    teksKategori.textContent = item.kategori;
    nama.append(teksNama, teksKategori);

    baris.insertCell().textContent = formatTanggal(item.tanggal);

    const nominal = baris.insertCell();
    nominal.className = item.jenis === "masuk"
      ? "amount-in"
      : "amount-out";
    nominal.textContent =
      `${item.jenis === "masuk" ? "+" : "−"} ${rupiah(item.jumlah)}`;

    const aksi = baris.insertCell();
    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "delete-button";
    tombol.textContent = "Hapus";

    tombol.addEventListener("click", () => {
      if (confirm(`Hapus transaksi "${item.deskripsi}"?`)) {
        transaksi = transaksi.filter(data => data.id !== item.id);
        simpanData();
        perbaruiHalaman();
        pesan.textContent = "Transaksi berhasil dihapus.";
      }
    });

    aksi.appendChild(tombol);
  });
}

function perbaruiHalaman() {
  perbaruiRingkasan();
  tampilkanTransaksi();
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const nama = deskripsi.value.trim();
  const nominal = Number(jumlah.value);

  if (!nama || !Number.isFinite(nominal) || nominal <= 0) {
    pesan.style.color = "#dc5364";
    pesan.textContent = "Isi deskripsi dan jumlah yang valid.";
    return;
  }

  const dataBaru = {
    id: Date.now() + Math.random(),
    deskripsi: nama,
    jenis: jenis.value,
    kategori: kategori.value,
    jumlah: Math.round(nominal),
    tanggal: tanggal.value
  };

  transaksi.push(dataBaru);
  simpanData();
  perbaruiHalaman();

  form.reset();
  tanggal.value = tanggalLokal();
  jenis.value = "masuk";

  pesan.style.color = "#15966b";
  pesan.textContent = "Transaksi berhasil disimpan!";
});

pencarian.addEventListener("input", tampilkanTransaksi);

document.getElementById("resetCari").addEventListener("click", () => {
  pencarian.value = "";
  tampilkanTransaksi();
});

document.getElementById("hapusSemua").addEventListener("click", () => {
  if (transaksi.length === 0) {
    pesan.textContent = "Belum ada data untuk dihapus.";
    return;
  }

  if (confirm("Yakin ingin menghapus semua transaksi?")) {
    transaksi = [];
    simpanData();
    perbaruiHalaman();
    pesan.textContent = "Semua transaksi berhasil dihapus.";
  }
});

document.getElementById("today").textContent =
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

document.getElementById("tahun").textContent = new Date().getFullYear();

tanggal.value = tanggalLokal();
perbaruiHalaman();


/* TOMBOL HALAMAN PEMBUKA MONEYTRACK */

const startButton = document.getElementById("startButton");
const welcomePage = document.getElementById("welcomePage");
const dashboardPage = document.getElementById("dashboardPage");

if (startButton && welcomePage && dashboardPage) {
    startButton.addEventListener("click", function () {
        welcomePage.style.display = "none";
        dashboardPage.style.display = "flex";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

