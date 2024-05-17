function getContinent(Lat, Lon, plotTrueFalse) {
    // Define coordinates for each continent
    const LatNAm = [90, 90, 78.13, 57.5, 15, 15, 1.25, 1.25, 51, 60, 60];
    const LonNAm = [-168.75, -10, -10, -37.5, -30, -75, -82.5, -105, -180, -180, -168.75];
    const LatNA2 = [51, 51, 60];
    const LonNA2 = [166.6, 180, 180];
    const LatSAm = [1.25, 1.25, 15, 15, -60, -60];
    const LonSAm = [-105, -82.5, -75, -30, -30, -105];
    const LatEur = [90, 90, 42.5, 42.5, 40.79, 41, 40.55, 40.40, 40.05, 39.17, 35.46, 33, 38, 35.42, 28.25, 15, 57.5, 78.13];
    const LonEur = [-10, 77.5, 48.8, 30, 28.81, 29, 27.31, 26.75, 26.36, 25.19, 27.91, 27.5, 10, -10, -13, -30, -37.5, -10];
    const LatAfr = [15, 28.25, 35.42, 38, 33, 31.74, 29.54, 27.78, 11.3, 12.5, -60, -60];
    const LonAfr = [-30, -13, -10, 10, 27.5, 34.58, 34.92, 34.46, 44.3, 52, 75, -30];
    const LatAus = [-11.88, -10.27, -10, -30, -52.5, -31.88];
    const LonAus = [110, 140, 145, 161.25, 142.5, 110];
    const LatAsi = [90, 42.5, 42.5, 40.79, 41, 40.55, 40.4, 40.05, 39.17, 35.46, 33, 31.74, 29.54, 27.78, 11.3, 12.5, -60, -60, -31.88, -11.88, -10.27, 33.13, 51, 60, 90];
    const LonAsi = [77.5, 48.8, 30, 28.81, 29, 27.31, 26.75, 26.36, 25.19, 27.91, 27.5, 34.58, 34.92, 34.46, 44.3, 52, 75, 110, 110, 110, 140, 140, 166.6, 180, 180];
    const LatAs2 = [90, 90, 60, 60];
    const LonAs2 = [-180, -168.75, -168.75, -180];
    const LatAnt = [-60, -60, -90, -90];
    const LonAnt = [-180, 180, 180, -180];
    
    // Check if point is inside or on the boundary of each continent
    const inNAm = inpolygon(Lat, Lon, LatNAm, LonNAm) + inpolygon(Lat, Lon, LatNA2, LonNA2);
    const inEur = inpolygon(Lat, Lon, LatEur, LonEur);
    const inSAm = inpolygon(Lat, Lon, LatSAm, LonSAm);
    const inAfr = inpolygon(Lat, Lon, LatAfr, LonAfr);
    const inAus = inpolygon(Lat, Lon, LatAus, LonAus);
    const inAsi = inpolygon(Lat, Lon, LatAsi, LonAsi);
    const inAs2 = inpolygon(Lat, Lon, LatAs2, LonAs2);
    // Determine the continent index
    const ContinentIndex = 1 + (inAfr ) * 1 + (inAus ) * 2 + (inAsi  || inAs2 ) * 3 + inEur * 4 + inNAm * 5 + (inSAm) * 6;
    
    // Define continent list
    const ContinentList = ['unknown', 'Africa', 'Australia', 'Asia', 'Europe', 'North_America', 'South_America'];
    
    // Get continent based on the index
    const Continent = ContinentList[ContinentIndex - 1];
    
    // Return the continent
    return Continent;
}

// Function to determine if a point is inside or on the boundary of a polygon
function inpolygon(Lat, Lon, polyLat, polyLon) {
    let i, j;
    let c = false;
    const nvert = polyLat.length;

    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((polyLat[i] > Lat) !== (polyLat[j] > Lat)) &&
            (Lon < (polyLon[j] - polyLon[i]) * (Lat - polyLat[i]) / (polyLat[j] - polyLat[i]) + polyLon[i])) {
            c = !c;
        }
    }

    return c;
}

export default getContinent;