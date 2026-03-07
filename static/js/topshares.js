document.addEventListener("DOMContentLoaded", async () => {
  const DATA_URL = "/data/topshares.csv";
  const selectEl = document.getElementById("pce-select");
  const chartEl = document.getElementById("topshares-chart");
  const downloadBtn = document.getElementById("download-data");

  let rawData = [];

  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim());
      const row = {};

      headers.forEach((header, i) => {
        row[header] = values[i];
      });

      return {
        pce: row.pce,
        year: Number(row.year),
        ttwsh: Number(row.ttwsh)
      };
    });
  }

  function getUniquePceValues(data) {
    return [...new Set(data.map(d => d.pce))].sort();
  }

  function filterSeries(data, selectedPce) {
    return data
      .filter(d => d.pce === selectedPce)
      .sort((a, b) => a.year - b.year);
  }

  function drawChart(selectedPce) {
    const series = filterSeries(rawData, selectedPce);

    const trace = {
      x: series.map(d => d.year),
      y: series.map(d => d.ttwsh),
      type: "scatter",
      mode: "lines+markers",
      name: selectedPce,
      line: {
        color: "red",
        width: 3
      },
      marker: {
        color: "red"
      },
      hovertemplate: "Year: %{x}<br>Share: %{y:.1f}%<extra></extra>"
    };

    const layout = {
      title: selectedPce,
      xaxis: {
        title: "Year"
      },
      yaxis: {
        title: "Wealth share (%)",
        rangemode: "tozero",
        ticksuffix: "%"
      },
      margin: {
        l: 60,
        r: 20,
        t: 60,
        b: 60
      }
    };

    const config = {
      responsive: true,
      displaylogo: false
    };

    Plotly.react(chartEl, [trace], layout, config);
  }

  function populateDropdown(pceValues) {
    selectEl.innerHTML = "";

    pceValues.forEach(pce => {
      const option = document.createElement("option");
      option.value = pce;
      option.textContent = pce;

      if (pce === "Top 1%") {
        option.selected = true;
      }

      selectEl.appendChild(option);
    });
  }

  function downloadSelectedData(selectedPce) {
    const series = filterSeries(rawData, selectedPce);

    let csv = "pce,year,ttwsh\n";
    series.forEach(d => {
      csv += `${d.pce},${d.year},${d.ttwsh}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedPce.replace(/\s+/g, "_").toLowerCase()}_topshares.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const csvText = await response.text();
    rawData = parseCSV(csvText);

    if (!rawData.length) {
      throw new Error("Dataset is empty.");
    }

    const pceValues = getUniquePceValues(rawData);
    populateDropdown(pceValues);

    const initialPce = pceValues.includes("Top 1%")
    ? "Top 1%"
    : pceValues[0];
    drawChart(initialPce);

    selectEl.addEventListener("change", (event) => {
      drawChart(event.target.value);
    });

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        downloadSelectedData(selectEl.value);
      });
    }
  } catch (error) {
    console.error(error);
    chartEl.innerHTML = `<p>Could not load chart data.</p>`;
  }
});