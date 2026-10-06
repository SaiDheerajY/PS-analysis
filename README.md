# PS-II Allotment Analysis

A lightweight web app for exploring BITS Practice School II allotment data for the 2024–25 cycle.

## Features

- Filter allotments by CGPA range and company
- Sort stipend values
- View result counts
- Calculate average and median stipend
- Display median CGPA
- Lazy-load large result sets in batches for smoother rendering
- Responsive table-based interface

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- JSON dataset loaded in the browser

## Project Files

```text
index.html   Main interface
script.js    Data loading, filtering, sorting, statistics, and lazy loading
style.css    Responsive styling
data.json    Allotment dataset consumed by the frontend
```

## Run Locally

Because the app loads `data.json` with `fetch()`, open it through a local HTTP server rather than directly from the filesystem.

For example:

```bash
git clone https://github.com/SaiDheerajY/PS-analysis.git
cd PS-analysis
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Purpose

The project provides a quicker way to explore historical PS-II allotment patterns such as company options, CGPA ranges, and stipend distributions. Historical data should be treated as reference information only; future allotments can differ.
