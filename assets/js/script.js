// Data rating (bisa ditambah dari form)
let data = {
  Joseph: { Baju: 4, Celana: 5, Topi: 3 },
  Samuel: { Baju: 2, Celana: 2, Rok: 2 },
  Emily: { Baju: 5, Rok: 4, Topi: 4 },
};

// Fungsi untuk update dropdown user & tampilkan tabel
function updateUI() {
  const users = Object.keys(data);
  const items = [...new Set(users.flatMap((user) => Object.keys(data[user])))];

  // Update Dropdown
  const predictUser = document.getElementById("predictUser");
  predictUser.innerHTML = "";
  users.forEach((user) => {
    let opt = document.createElement("option");
    opt.value = user;
    opt.textContent = user;
    predictUser.appendChild(opt);
  });

  // Update Tabel
  let html = `<table><thead><tr><th>User</th>`;
  items.forEach((item) => (html += `<th>${item}</th>`));
  html += `</tr></thead><tbody>`;

  users.forEach((user) => {
    html += `<tr><td>${user}</td>`;
    items.forEach((item) => {
      html += `<td>${data[user][item] ?? "-"}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("ratingTable").innerHTML = html;
}

// Fungsi Tambah Rating
document.getElementById("ratingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("user").value.trim();
  const item = document.getElementById("item").value.trim();
  const rating = parseFloat(document.getElementById("rating").value);

  if (!data[user]) data[user] = {};
  data[user][item] = rating;

  updateUI();
  e.target.reset();
});

// Euclidean Distance
function euclideanSimilarity(user1, user2) {
  let sumSquares = 0;
  for (let item in user1) {
    if (item in user2) {
      sumSquares += Math.pow(user1[item] - user2[item], 2);
    }
  }
  return sumSquares === 0 ? 0 : 1 / (1 + Math.sqrt(sumSquares));
}

// Prediksi Rating
function predictRating() {
  const targetUser = document.getElementById("predictUser").value;
  const targetItem = document.getElementById("predictItem").value.trim();

  if (!targetItem) return alert("Isi nama item yang ingin diprediksi.");

  let numerator = 0;
  let denominator = 0;

  for (let user in data) {
    if (user === targetUser) continue;

    const sim = euclideanSimilarity(data[targetUser], data[user]);

    if (data[user][targetItem] !== undefined) {
      numerator += sim * data[user][targetItem];
      denominator += sim;
    }
  }

  const prediction =
    denominator === 0
      ? "Tidak bisa diprediksi"
      : (numerator / denominator).toFixed(2);
  document.getElementById(
    "result"
  ).innerHTML = `Prediksi rating <strong>${targetUser}</strong> untuk item <strong>${targetItem}</strong>: <span>${prediction}</span>`;
}

// Inisialisasi Awal
updateUI();
