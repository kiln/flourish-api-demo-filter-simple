Some review notes...

- The Poppins font interacts with the chart on change
- Where does the `Haas Grot Text R Web` button font come from?
- The problem with using `.update` with the `base_visualisation_id` is that we can't slice up a tangible options object and as we have to provide bindings as well as (it seems) the metadate on each update, we need to hardcode this. If we worked with a fetched `visualisation.json`, we could pass through the fetched / softcoded bindings and metadata properties.
- Renamed the repo to "https://github.com/kiln/flourish-api-demo-filter-simple"
- Need to remove the API key

# Simple data filter demo

This repo showcases user controlled data filtering with the Flourish Live API. It also shows how to donwload the user filtered data as well as a chart screenshot.
