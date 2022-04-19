// WKT to GoogleMapPolygonPath
//function to add points from individual rings
const addPoints = (ptsArray, data) => {
  //first spilt the string into individual points
  const pointsData = data.split(",");
  //iterate over each points data and create a latlong
  //& add it to the cords array
  const len = pointsData.length;
  for (let i = 0; i < len; i++) {
    const xy = pointsData[i].split(" ");
    const pt = { lat: parseFloat(xy[1]), lng: parseFloat(xy[0]) };
    ptsArray.push(pt);
  }
};

export const createPolygonCoords = wkt => {
  //using regex, we will get the indivudal Rings
  const regex = /\(([^()]+)\)/g;
  const rings = [];
  let results;
  while ((results = regex.exec(wkt))) {
    rings.push(results[1]);
  }
  const ptsArray = [];
  const polyLen = rings.length;

  //now we need to draw the polygon for each of inner rings, but reversed
  for (let i = 0; i < polyLen; i++) {
    addPoints(ptsArray, rings[i]);
  }
  return ptsArray;
};

// the smooth zoom function
export function smoothZoom(map, max, cnt) {
  if (cnt >= max) {
    return;
  } else {
    let z = window.google.maps.event.addListener(map, "zoom_changed", function(
      event
    ) {
      window.google.maps.event.removeListener(z);
      smoothZoom(map, max, cnt + 1);
    });
    setTimeout(function() {
      map.setZoom(cnt);
    }, 120); // 80ms is what I found to work well on my system -- it might not work well on all systems
  }
}

export function calculateDistance({ destination, origins }, callback) {
  const distanceMatrixSerivce = new window.google.maps.DistanceMatrixService();
  distanceMatrixSerivce.getDistanceMatrix(
    {
      origins,
      destinations: [destination],
      travelMode: "DRIVING"
    },
    callback
  );
}
