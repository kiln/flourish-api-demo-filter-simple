let data;
let vis;
let filteredData = []; // Define filteredData as a global variable

d3.csv("./data/data.csv").then(function (csvData) {
  data = csvData; // Assign loaded data to the global variable

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
    updateVisualisation(selectedRegion, null);
  });

  const base_chart = "16988347"; // Type Scatter version (20)

  const API_KEY =
    "maTVMy09AawpCItN_0vZBQ6mk9ibYYZXI8NCp4wXvPq-aolt2nReb7oBrD0m3SHw";

  const opts = {
    container: "#visualization",
    api_key: API_KEY,
    base_visualisation_id: base_chart,
    base_visualisation_data_format: "object",
  };

  console.log("initial", opts);
  vis = new Flourish.Live(opts);
});

function updateVisualisation(selectedRegion, selectedCountry) {
  filteredData = data; // Update global filteredData variable
  // This is to make the viz go to the default state if a user doesn't select any other region/country
  if (selectedRegion === "All regions" && selectedCountry === "All countries") {
    filteredData = data;
  } else {
    if (selectedRegion && selectedRegion !== "All regions") {
      filteredData = data.filter((d) => d.region == selectedRegion);
    }
    if (selectedCountry && selectedCountry !== "All countries") {
      filteredData = data.filter((d) => d.country == selectedCountry);
    }
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
    state: {
      x: {
        title: "GDP",
        title_mode: "custom",
      },
      y: {
        title: "Life expectancy",
        title_mode: "custom",
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

  filteredData = filteredData.slice();
}

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
  const countryDropdown = document.getElementById("country");
  const regionDropdown = document.getElementById("region");

  const selectedCountry = countryDropdown.value;
  const selectedRegion = regionDropdown.value;

  // Check if both dropdowns are set to the default "All" options
  if (selectedCountry === "All countries" && selectedRegion === "All regions") {
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
