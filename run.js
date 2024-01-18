import { spawn } from 'child_process';

// Nama file yang ingin dijalankan
const fileName = 'index.js';

// Fungsi untuk menjalankan kembali node index.js
function startNodeApp() {
  console.log(`Mengulangi node ${fileName}...`);
  const child = spawn('node', [fileName]);

  // Tangani event ketika child process selesai
  child.on('exit', (code, signal) => {
    console.log(`Proses node ${fileName} selesai dengan kode ${code}`);
    // Jika proses berhenti, panggil kembali fungsi untuk menjalankan kembali
    startNodeApp();
  });

  // Tangani event ketika ada error dalam child process
  child.on('error', (err) => {
    console.error(`Terjadi kesalahan: ${err.message}`);
  });

  // Tampilkan output dari child process
  child.stdout.on('data', (data) => {
    console.log(`Output: ${data}`);
  });

  // Tampilkan error dari child process
  child.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
}

// Panggil fungsi untuk pertama kali
startNodeApp();
