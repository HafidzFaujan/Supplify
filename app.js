// Simple SAW implementation (client-side)
(() => {
  const sampleCsv = `name,price,quality,delivery_time,min_order,rating
Supplier A,120000,4.5,2,10,4.2
Supplier B,110000,4.0,3,50,4.5
Supplier C,130000,4.8,1,20,4.0
Supplier D,115000,4.2,2,30,4.6
Supplier E,140000,4.9,1,15,4.8`;

  const tableBody = document.querySelector('#suppliersTable tbody');
  const loadSampleBtn = document.getElementById('loadSample');
  const computeBtn = document.getElementById('compute');
  const uploadBtn = document.getElementById('uploadCsv');
  const fileInput = document.getElementById('fileInput');
  const downloadBtn = document.getElementById('downloadCsv');
  const resultArea = document.getElementById('resultArea');

  let suppliers = []; // array of objects {name, price, quality, delivery_time, min_order, rating}

  function parseCsv(text) {
    const lines = text.trim().split('\n');
    const header = lines.shift().split(',').map(h => h.trim());
    return lines.map((ln) => {
      const vals = ln.split(',').map(v => v.trim());
      const obj = {};
      header.forEach((h,i) => {
        const key = h;
        const val = vals[i];
        // convert numbers
        if (['price','quality','delivery_time','min_order','rating'].includes(key)) {
          obj[key] = Number(val);
        } else {
          obj[key] = val;
        }
      });
      return obj;
    });
  }

  function renderTable() {
    tableBody.innerHTML = '';
    suppliers.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${idx+1}</td>
        <td><input class="name" value="${s.name}"></td>
        <td><input class="price" value="${s.price}"></td>
        <td><input class="quality" value="${s.quality}"></td>
        <td><input class="delivery_time" value="${s.delivery_time}"></td>
        <td><input class="min_order" value="${s.min_order}"></td>
        <td><input class="rating" value="${s.rating}"></td>`;
      tableBody.appendChild(tr);

      // attach change listeners
      ['name','price','quality','delivery_time','min_order','rating'].forEach(k => {
        tr.querySelector('.'+k).addEventListener('change', (e) => {
          const v = e.target.value;
          suppliers[idx][k] = (['price','quality','delivery_time','min_order','rating'].includes(k)) ? Number(v) : v;
        });
      });
    });
  }

  function getWeights() {
    const w1 = parseFloat(document.getElementById('w1').value) || 0;
    const w2 = parseFloat(document.getElementById('w2').value) || 0;
    const w3 = parseFloat(document.getElementById('w3').value) || 0;
    const w4 = parseFloat(document.getElementById('w4').value) || 0;
    const w5 = parseFloat(document.getElementById('w5').value) || 0;
    const sum = w1+w2+w3+w4+w5;
    return {w:[w1,w2,w3,w4,w5], sum};
  }

  function computeSAW() {
    if (suppliers.length === 0) {
      alert('Tidak ada data supplier. Load sample atau upload CSV.');
      return;
    }
    const {w, sum} = getWeights();
    if (Math.abs(sum - 1.0) > 0.001) {
      if (!confirm('Jumlah bobot tidak sama dengan 1 (jumlah saat ini: ' + sum.toFixed(3) + '). Lanjutkan?')) {
        return;
      }
    }
    // prepare decision matrix
    // criteria types: price (cost), quality (benefit), delivery_time (cost), min_order (cost), rating (benefit)
    const matrix = suppliers.map(s => [s.price, s.quality, s.delivery_time, s.min_order, s.rating]);

    // find max/min per column
    const cols = matrix[0].length;
    const maxs = Array(cols).fill(-Infinity);
    const mins = Array(cols).fill(Infinity);
    matrix.forEach(row => {
      row.forEach((v,j) => {
        if (v > maxs[j]) maxs[j] = v;
        if (v < mins[j]) mins[j] = v;
      });
    });

    // normalize
    const normalized = matrix.map(row => {
      return row.map((v,j) => {
        // benefit criteria indexes 1,4 (quality,index1 and rating,index4)
        const benefit = (j === 1 || j === 4);
        if (benefit) {
          return v / maxs[j];
        } else {
          // cost
          return mins[j] / v;
        }
      });
    });

    // weighted sum
    const results = normalized.map((r, i) => {
      let score = 0;
      for (let j=0;j<r.length;j++) {
        score += r[j] * (w[j] / sum);
      }
      return { supplier: suppliers[i].name, score: score, details: r };
    });

    // sort descending
    results.sort((a,b) => b.score - a.score);

    // render results
    resultArea.innerHTML = '';
    const topN = Math.min(3, results.length);
    const info = document.createElement('div');
    info.innerHTML = `<p>Jumlah alternatif: ${suppliers.length}. Top ${topN} rekomendasi:</p>`;
    resultArea.appendChild(info);
    results.forEach((res, idx) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      div.innerHTML = `<strong>${idx+1}. ${res.supplier}</strong> — Skor: ${res.score.toFixed(4)}`;
      resultArea.appendChild(div);
    });

    // store lastResults for download
    window.lastResults = results;
  }

  function csvToSuppliers(csvText) {
    try {
      const arr = parseCsv(csvText);
      suppliers = arr.map(a => ({
        name: a.name || '',
        price: Number(a.price) || 0,
        quality: Number(a.quality) || 0,
        delivery_time: Number(a.delivery_time) || 0,
        min_order: Number(a.min_order) || 0,
        rating: Number(a.rating) || 0
      }));
      renderTable();
    } catch (e) {
      alert('Gagal parse CSV: ' + e.message);
    }
  }

  loadSampleBtn.addEventListener('click', () => {
    csvToSuppliers(sampleCsv);
    resultArea.innerHTML = '<em>Sample data loaded. Click "Compute SAW".</em>';
  });

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      csvToSuppliers(ev.target.result);
    };
    reader.readAsText(f);
  });

  computeBtn.addEventListener('click', computeSAW);

  downloadBtn.addEventListener('click', () => {
    if (!window.lastResults) {
      alert('Belum ada hasil. Klik Compute SAW dulu.');
      return;
    }
    // build csv
    let out = 'rank,supplier,score\n';
    window.lastResults.forEach((r, i) => {
      out += `${i+1},"${r.supplier}",${r.score}\n`;
    });
    const blob = new Blob([out], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saw_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // initial: load sample
  csvToSuppliers(sampleCsv);
})();
