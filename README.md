# Getting Starting with Vanilla Template

- `index.html` is where you include the D3 library, your D3 code, and any HTML 
- `geomap.js` holds the map, tooltip, and barchart visualizations. It writes to the `#geomap` SVG element.
- `cities.csv` is the data we're loading. It will be modified with state emission information. 

## Running your code 

Spin up a simple python server (depending on python version) to host your code: 

- `python -m SimpleHTTPServer 4000`
- `python3 -m http.server 4000`
