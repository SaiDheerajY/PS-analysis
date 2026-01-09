/* ================= GLOBAL STATE ================= */

let rawData = [];        // full dataset (loaded once)
let filteredData = [];  // after filters + sort
let visibleCount = 0;
let observer = null;
let sortAscending = true;

const BATCH_SIZE = 50;

/* ================= LOAD DATA ================= */

fetch("data.json")   // or sem1.json / sem2.json later if needed
  .then(res => res.json())
  .then(json => {
    rawData = json
      .map(d => {
        const stipendRaw = d.Stipend;

        // Drop invalid stipend rows
        if (!stipendRaw || stipendRaw === "-") return null;

        const cgpa = Number(d.CGPA);
        const stipend = Number(stipendRaw);

        if (isNaN(cgpa) || isNaN(stipend)) return null;

        return {
          CGPA: cgpa,
          Company: d.AllottedStationName,
          Stipend: stipend,
          Sem1: Number(d.AllotedSemester1),
          Sem2: Number(d.AllotedSemester2)
        };
      })
      .filter(Boolean);

    // Default: no filters applied
    filteredData = rawData;
    render();
  })
  .catch(err => console.error("Error loading data:", err));

/* ================= RENDER PIPELINE ================= */

function render() {
  visibleCount = 0;
  document.getElementById("tableBody").innerHTML = "";

  renderStats(filteredData);
  setupObserver();
  loadMore();
}

/* ================= INFINITE SCROLL ================= */

function loadMore() {
  const body = document.getElementById("tableBody");

  const nextRows = filteredData.slice(
    visibleCount,
    visibleCount + BATCH_SIZE
  );

  nextRows.forEach(r => {
    body.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <td>${r.CGPA.toFixed(2)}</td>
        <td>${r.Company}</td>
        <td>₹${r.Stipend.toLocaleString("en-IN")}</td>
      </tr>`
    );
  });

  visibleCount += nextRows.length;

  document.getElementById("count").innerText =
    `Showing  ${filteredData.length} results`;
}

/* ================= OBSERVER ================= */

function setupObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && visibleCount < filteredData.length) {
      loadMore();
    }
  });

  observer.observe(document.getElementById("scroll-sentinel"));
}

/* ================= FILTERING (INCLUDING SEMESTER) ================= */

function applyFilters() {
  const min = parseFloat(document.getElementById("minCgpa").value) || 0;
  const max = parseFloat(document.getElementById("maxCgpa").value) || 10;
  const company =
    document.getElementById("company").value.toLowerCase();
  const semester =
    document.getElementById("semester").value;

  filteredData = rawData.filter(d => {
    const semOk =
      semester === "all" ||
      (semester === "sem1" && d.Sem1 === 1) ||
      (semester === "sem2" && d.Sem2 === 1);

    return (
      semOk &&
      d.CGPA >= min &&
      d.CGPA <= max &&
      d.Company.toLowerCase().includes(company)
    );
  });

  render();
}

/* ================= SORTING ================= */

function toggleSort() {
  if (filteredData.length === 0) return;

  filteredData = [...filteredData].sort((a, b) =>
    sortAscending ? a.Stipend - b.Stipend : b.Stipend - a.Stipend
  );

  sortAscending = !sortAscending;
  render();
}

/* ================= STATS ================= */

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
