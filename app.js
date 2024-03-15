let data;
let vis;

d3.csv("/data/data.csv").then(function (csvData) {
  data = csvData; // Assign loaded data to the global variable

  // Populate the country dropdown
  const countryDropdown = document.getElementById("country");
  data.forEach(function (d) {
    const option = document.createElement("option");
    option.text = d.country;
    option.value = d.country;
    countryDropdown.appendChild(option);
  });

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
  countryDropdown.addEventListener("change", function () {
    const selectedCountry = this.value;
    console.log("Selected country:", selectedCountry);
    updateVisualisation(null, selectedCountry);
  });

  regionDropdown.addEventListener("change", function () {
    const selectedRegion = this.value;
    console.log("Selected region:", selectedRegion);
  });

  const base_chart = "16988347"; // Type Scatter version (20)
  // const base_chart = "17170489"; // Non-typed Scatter version (14)

  const API_KEY =
    "maTVMy09AawpCItN_0vZBQ6mk9ibYYZXI8NCp4wXvPq-aolt2nReb7oBrD0m3SHw";

  const opts = {
    container: "#visualization",
    api_key: API_KEY,
    base_visualisation_id: base_chart,
  };

  vis = new Flourish.Live(opts);
});

function convertToArrayOfArrays(array) {
  const keys = Object.keys(array[0]);
  const arrayOfArrays = array.map(Object.values);
  arrayOfArrays.unshift(keys);
  return arrayOfArrays;
}

function updateVisualisation(selectedRegion, selectedCountry) {
  if (selectedRegion) {
    filteredData = data.filter((d) => d.region == selectedRegion);
  }
  if (selectedCountry) {
    filteredData = data.filter((d) => d.country == selectedCountry);
  }

  vis.update({
    data: { data: filteredData },
  });

  // Note: this ↑ doesn't work due to metadata issues
}
