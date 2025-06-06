import { getProduk } from './produkData.js';
import { getArtikel } from './articleData.js';
import { getRekomendasi } from './solusiPenanganan.js';
import { getPenjelasan } from './penjelasan.js';
import '../style.css';

// === SPA Hash Routing ===
function showPage(hash) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach((section) => section.classList.remove('active'));

  const target = document.querySelector(hash);
  if (target) {
    target.classList.add('active');
  } else {
    document.querySelector('#predict').classList.add('active'); // default
  }
}

window.addEventListener('hashchange', () => {
  showPage(location.hash);
});

document.addEventListener("DOMContentLoaded", () => {
  // Initial routing
  if (!location.hash) location.hash = '#predict';
  showPage(location.hash);

  // === Prediksi & Rekomendasi ===
  const imageInput = document.getElementById("imageinput");
  const fileNameSpan = document.getElementById("file-name");
  const detectButton = document.getElementById("deteksi-button");
  const hasilKlasifikasi = document.querySelector(".hasil_klasifikasi");
  const produkContainer = document.querySelector(".rekomendasi_produk");
  const artikelContainer = document.querySelector(".rekomendasi_article");

  let selectedFile = null;

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      selectedFile = file;
      fileNameSpan.textContent = file.name;
    } else {
      selectedFile = null;
      fileNameSpan.textContent = "Belum ada file";
    }
  });

  detectButton.addEventListener("click", async () => {
    if (!selectedFile) {
      alert("Silakan unggah foto terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("imagefile", selectedFile);

    try {
      const response = await fetch("https://snaptosave-production.up.railway.app/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const label = data.label;
      const probability = data.probability;

      tampilkanHasil(label, selectedFile, probability);
    } catch (error) {
      alert("Terjadi kesalahan saat memproses gambar.");
      console.error(error);
    }
  });

  function tampilkanHasil(label, file, probability) {
  const imgURL = URL.createObjectURL(file);
  const rekomendasi = getRekomendasi(label);
  const penjelasan = getPenjelasan(label); 
  const persentase = probability ? Math.round(probability) + "%" : "N/A";

  hasilKlasifikasi.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <img src="${imgURL}" alt="Hasil Deteksi" style="width: 150px; height: 150px; object-fit: cover; border-radius: 10px; border-radius: 10px; margin-right: 30px;">
      <p style="margin-right: 100px; font-size: 1.4em; font-weight: bold; color:rgb(0, 0, 0); margin: 10px 0 0; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">${label}</p>
      <div style="font-size: 3em; color: #004d2c; text-align: right; width: 100%;">
        <strong style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">${persentase}</strong>
      </div>
    </div>
    <hr style="border: none; border-top: 2px dashed #004d2c; margin: 20px 0;">
    <p style="color: #004d2c; font-size: 1.6em; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"><strong>Keterangan:</strong></p>
    <p style="text-align: justify; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">${penjelasan}</p> 
    <p style="color: #004d2c; font-size: 1.6em; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"><strong>Solusi Penanganan:</strong></p>
    <p style="text-align: justify; font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">${rekomendasi}</p>
  `;

  // Produk
  produkContainer.innerHTML = `
    <div class="produk-section">
      <h2 class="produk-title">Rekomendasi Produk:</h2>
      <div class="produk-grid" id="produkGrid"></div>
    </div>
  `;

  const produkGrid = document.getElementById("produkGrid");
  const produkList = getProduk(label);
  produkList.slice(0, 3).forEach(produk => {
    const div = document.createElement("div");
    div.className = "produk-card";
    div.innerHTML = `
      <img src="${produk.gambar}" alt="${produk.nama}" />
      <p><a href="${produk.link}" target="_blank" rel="noopener noreferrer">${produk.nama}</a></p>
      <p>${produk.harga}</p>
    `;
  produkGrid.appendChild(div);
  });


  // Artikel
 artikelContainer.innerHTML = `
  <div class="artikel-section">
    <h2 class="artikel-title">Rekomendasi Artikel:</h2>
    <div class="artikel-grid" id="artikelGrid"></div>
  </div>
`;

  const artikelGrid = document.getElementById("artikelGrid");
  const artikelList = getArtikel(label);
  artikelList.slice(0, 3).forEach(artikel => {
    const div = document.createElement("div");
    div.className = "artikel-card";
    div.innerHTML = `
      <img src="${artikel.gambar}" alt="${artikel.judul}" />
      <p>
        <a href="${artikel.link}" target="_blank" rel="noopener noreferrer">${artikel.judul}</a>
      </p>
  `;
  artikelGrid.appendChild(div);
});
}
});
