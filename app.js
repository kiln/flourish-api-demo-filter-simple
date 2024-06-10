// Global variables
const base_chart = "16988347";
const API_KEY =
  "maTVMy09AawpCItN_0vZBQ6mk9ibYYZXI8NCp4wXvPq-aolt2nReb7oBrD0m3SHw";

let data;
let vis;
let filteredData = [];

// Update function
function updateVisualisation(selectedRegion) {
  filteredData = data; // Update global filteredData variable

  // Guard against (unlikely) non-selection, reset and filter data
  if (!selectedRegion) {
    console.warn("No region selected");
    return;
  } else if (selectedRegion === "All regions") {
    filteredData = data;
  } else {
    filteredData = data.filter((d) => d.region == selectedRegion);
  }

  // Update the visualisation
  vis.update({
    data: { data: filteredData },
    bindings: {
      data: {
        metadata: ["country", "region"],
        x: "gdp",
        y: "life expectancy",
        color: "region",
        size: "population",
      },
    },
    metadata: {
      data: {
        gdp: {
          type_id: "number$point_comma",
          type: "number",
          output_format_id: "number$comma_point",
        },
      },
    },
  });
}

function buildRegionDropdown(data) {
  // Create a Set to store unique regions
  const uniqueRegions = new Set(data.map((d) => d.region));

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
    base_visualisation_id: base_chart,
    base_visualisation_data_format: "object",
  };

  console.log("initial", opts);
  vis = new Flourish.Live(opts);
});

// Data download button

// Define the downloadCsv function
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

// Event listener for downloading the filtered data as a CSV file
document.getElementById("data-download").addEventListener("click", function () {
  const regionDropdown = document.getElementById("region");

  const selectedRegion = regionDropdown.value;

  if (selectedRegion === "All regions") {
    // Check if we need to get the full data
    const allDataCsv = d3.csvFormat(data);
    downloadCsv(allDataCsv, "all_data.csv");
  } else {
    // Check if filteredData is defined and not empty
    if (filteredData && filteredData.length > 0) {
      const filteredDataCsv = d3.csvFormat(filteredData);
      downloadCsv(filteredDataCsv, "filtered_data.csv");
    } else {
      console.log("No data to download");
    }
  }
});

// Image Download button
var snapshot_options = {
  download: true,
  format: "png", // Formats available include png, jpg & svg
  filename: "scatter_filters",
  scale: 2,
};

document
  .getElementById("image-download")
  .addEventListener("click", function () {
    vis.snapshot(snapshot_options, function (error, data) {
      if (error) {
        console.error(error);
        return;
      }
    });
  });
