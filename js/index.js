document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageinput");
  const fileNameSpan = document.getElementById("file-name");
  const deteksiButton = document.getElementById("deteksi-button");
  const hasilKlasifikasi = document.querySelector(".hasil_klasifikasi");

  let selectedImageURL = null;

  // Simpan URL gambar saat dipilih
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
      fileNameSpan.textContent = file.name;

      const reader = new FileReader();
      reader.onload = function (e) {
        selectedImageURL = e.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      fileNameSpan.textContent = "Belum ada file";
      selectedImageURL = null;
      hasilKlasifikasi.innerHTML = "";
    }
  });

  // Saat tombol prediksi ditekan
  deteksiButton.addEventListener("click", () => {
    if (!selectedImageURL) {
      alert("Silakan pilih foto terlebih dahulu.");
      return;
    }

    // Simulasi klasifikasi dan rekomendasi
    const klasifikasi = "Tomato Leaf Spot";
    const rekomendasi = "Gunakan Pestisida Organik A atau Pestisida B berbahan aktif Chlorothalonil";

    hasilKlasifikasi.innerHTML = `
      <h3>Hasil Deteksi</h3>
      <img src="${selectedImageURL}" alt="Hasil Deteksi" style="max-width: 100%; max-height: 250px; border-radius: 10px; margin-bottom: 10px;">
      <p><strong>Keterangan:</strong></p>
      <p>${klasifikasi}</p>
      <p><strong>Solusi Penanganan:</strong></p>
      <p>${rekomendasi}</p>
    `;
  });
});
