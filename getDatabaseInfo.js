// =====================================================================
// Get the Host Info
db.hostInfo()

// =====================================================================
// Get a list of all databases with their sizes, sorted by database name
var dbList = [];
db.adminCommand('listDatabases').databases.forEach(function(d) {
  var dbStats = db.getSiblingDB(d.name).stats();
  dbList.push({
    name: d.name,
    sizeOnDisk: d.sizeOnDisk,
    dataSize: dbStats.dataSize,
    storageSize: dbStats.storageSize,
    indexSize: dbStats.indexSize
  });
});

// Sort the list by database name
dbList.sort(function(a, b) {
  return a.name.localeCompare(b.name);
});

// Print the sorted list
dbList.forEach(function(d) {
  var sizeInMB = (d.sizeOnDisk / (1024*1024)).toFixed(2);
  var dataSize = (d.dataSize / (1024*1024)).toFixed(2);
  var storageSize = (d.storageSize / (1024*1024)).toFixed(2);
  var indexSize = (d.indexSize / (1024*1024)).toFixed(2);
  
  print(d.name + 
        "\n  Size on Disk: " + sizeInMB + " MB" + 
        "\n  Data Size: " + dataSize + " MB" + 
        "\n  Storage Size: " + storageSize + " MB" + 
        "\n  Index Size: " + indexSize + " MB");
});
