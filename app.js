// Constants
const BASE_CHART = "16988347";
const API_KEY = "<ADD YOUR API KEY HERE>";

// Global variables
let data;
let vis;
let filteredData = [];

// Update function
function updateVisualisation(selectedRegion) {
  filteredData = data; // Update global filteredData variable

  // Guard against (unlikely) non-selection
  if (!selectedRegion) {
    console.warn("No region selected");
    return;
  }

  // Reset and filter data
  filteredData =
    selectedRegion === "All regions"
      ? data
      : data.filter((d) => d.Region === selectedRegion);

  // Update the visualisation
  vis.update({
    data: { data: filteredData },
    bindings: {
      data: {
        metadata: ["Country", "Region"],
        x: "GDP",
        y: "Life expectancy",
        color: "Region",
        size: "Population",
      },
    },
    metadata: {
      data: {
        GDP: {
          type_id: "number$point_comma",
          type: "number",
          output_format_id: "number$comma_point",
        },
      },
    },
  });
}

// Region dropdown
function buildRegionDropdown(data) {
  // Create a Set to store unique regions
  const uniqueRegions = new Set(data.map((d) => d.Region));

  // Populate the region dropdown
  const regionDropdown = document.getElementById("region");
  uniqueRegions.forEach((region) => {
    const option = document.createElement("option");
    option.text = region;
    option.value = region;
    regionDropdown.appendChild(option);
  });

  // Event listeners for dropdown menus
  regionDropdown.addEventListener("change", function () {
    const selectedRegion = this.value;
    console.log("Selected region:", selectedRegion);
    updateVisualisation(selectedRegion);
  });
}

// Initial load and set up
d3.csv("./data/data.csv").then(function (csvData) {
  // Assign loaded data to the global variable
  data = csvData;
  buildRegionDropdown(data);

  const opts = {
    container: "#visualization",
    api_key: API_KEY,
    base_visualisation_id: BASE_CHART,
    base_visualisation_data_format: "object",
  };

  console.log("initial", opts);
  vis = new Flourish.Live(opts);
});

/* Data download */

// Download function
function downloadCsv(csvData, filename) {
  const csvFile = new Blob([csvData], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(csvFile);
  downloadLink.download = filename;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Listener and handler
document.getElementById("data-download").addEventListener("click", function () {
  const regionDropdown = document.getElementById("region");
  const selectedRegion = regionDropdown.value;
  const csvData = selectedRegion === "All regions" ? data : filteredData;

  if (csvData.length > 0) {
    const fileName = selectedRegion.toLowerCase().replace(/[^a-z0-9_]/g, "");
    downloadCsv(d3.csvFormat(csvData), `${fileName}_data.csv`);
  } else {
    console.log("No data to download");
  }
});

/* Image download */

// Options
var snapshot_options = {
  download: true,
  format: "png", // Formats available include png, jpg & svg
  filename: "scatter_filters",
  scale: 2,
};

// Listener and handler
document
  .getElementById("image-download")
  .addEventListener("click", function () {
    vis.snapshot(snapshot_options, function (error, data) {
      console.log(data);
      if (error) {
        console.error(error);
        return;
      }
    });
  });
