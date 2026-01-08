let data = [];

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json
      .map(d => {
        // Clean stipend
        const stipendRaw = d.Stipend;

        if (
          stipendRaw === "" ||
          stipendRaw === "-" ||
          stipendRaw == null
        ) {
          return null; // drop invalid stipend rows
        }

        const cgpa = Number(d.CGPA);
        const stipend = Number(stipendRaw);

        if (isNaN(cgpa) || isNaN(stipend)) {
          return null;
        }

        return {
          CGPA: cgpa,
          Company: d.AllottedStationName,
          Stipend: stipend
        };
      })
      .filter(row => row !== null);

    render(data);
  })
  .catch(err => console.error("Error loading data:", err));

/* ---------- Rendering ---------- */

function render(rows) {
  renderTable(rows);
  renderStats(rows);
}

function renderTable(rows) {
  const body = document.getElementById("tableBody");
  const count = document.getElementById("count");

  body.innerHTML = "";

  rows.forEach(r => {
    body.innerHTML += `
      <tr>
        <td>${r.CGPA.toFixed(2)}</td>
        <td>${r.Company}</td>
        <td>₹${r.Stipend.toLocaleString("en-IN")}</td>
      </tr>
    `;
  });

  count.innerText = `Showing ${rows.length} results`;
}

function renderStats(rows) {
  const avgElem = document.getElementById("avg");

  if (rows.length === 0) {
    avgElem.innerText = "Average stipend for this CGPA range: N/A";
    return;
  }

  const total = rows.reduce((sum, r) => sum + r.Stipend, 0);
  const avg = Math.round(total / rows.length);

  avgElem.innerText =
    `Average stipend for this CGPA range: ₹${avg.toLocaleString("en-IN")}`;
}

/* ---------- Filters ---------- */

function applyFilters() {
  const min = parseFloat(document.getElementById("minCgpa").value) || 0;
  const max = parseFloat(document.getElementById("maxCgpa").value) || 10;
  const company =
    document.getElementById("company").value.toLowerCase();

  const filtered = data.filter(d =>
    d.CGPA >= min &&
    d.CGPA <= max &&
    d.Company.toLowerCase().includes(company)
  );

  render(filtered);
}
let currentRows = [];
let sortAscending = true;

function render(rows) {
  currentRows = rows; // keep latest filtered rows
  renderTable(rows);
  renderStats(rows);
}

function toggleSort() {
  const sorted = [...currentRows].sort((a, b) => {
    return sortAscending
      ? a.Stipend - b.Stipend
      : b.Stipend - a.Stipend;
  });

  sortAscending = !sortAscending;
  render(sorted);
}

