// Script to calculate and format MongoDB oplog information
function getFormattedOplogInfo() {
  try {
    // Switch to local database
    var localDB = db.getSiblingDB("local");
    
    // Get replica set info
    var rsConfig = rs.conf();
    var rsName = rsConfig && rsConfig._id ? rsConfig._id : "Unknown";
    
    print("")
    print("OPLOG INFORMATION FOR REPLICA SET: " + rsName);
    print("=====================================");
    
    // Get oplog stats
    var stats = localDB.oplog.rs.stats();
    var maxSizeGB = (stats.maxSize / (1024 * 1024 * 1024)).toFixed(2);
    var currentSizeGB = (stats.size / (1024 * 1024 * 1024)).toFixed(2);
    var usedPercentage = ((stats.size / stats.maxSize) * 100).toFixed(2);
    var storageGB = (stats.storageSize / (1024 * 1024 * 1024)).toFixed(2);
    var indexSizeMB = (stats.totalIndexSize / (1024 * 1024)).toFixed(2);
    
    // Get document count
    var docCount = localDB.oplog.rs.countDocuments({});
    
    // Get oldest and newest entries
    var oldest = localDB.oplog.rs.find().sort({$natural: 1}).limit(1).toArray()[0];
    var newest = localDB.oplog.rs.find().sort({$natural: -1}).limit(1).toArray()[0];
    
    // Get replication info for time range only
    var replInfo = db.getReplicationInfo();
    
    print("OPLOG CONFIGURATION:");
    print("  Max Size: " + maxSizeGB + " GB");
    print("  Current Size: " + currentSizeGB + " GB");
    print("  Used: " + usedPercentage + "%");
    print("  Storage Size: " + storageGB + " GB");
    print("  Total Index Size: " + indexSizeMB + " MB");
    
    print("OPLOG METRICS:");
    print("  Total Records: " + docCount);
    
    if (oldest && newest && oldest.ts && newest.ts) {
      // Use replInfo for the accurate time range calculation
      var hoursDiff = replInfo.timeDiffHours || (newest.ts.t - oldest.ts.t) / 3600;
      
      // Format dates using the actual Date objects
      var oldestDate = new Date(oldest.ts.t * 1000);
      var newestDate = new Date(newest.ts.t * 1000);
      
      var formatDate = function(date) {
        return date.toLocaleDateString() + ", " + date.toLocaleTimeString();
      };
      
      // Create a simplified timestamp string without the $timestamp
      var getSimpleTimestamp = function(ts) {
        if (ts.t !== undefined && ts.i !== undefined) {
          return ts.t + ":" + ts.i;
        } else {
          // Fallback if format is different
          return JSON.stringify(ts).replace(/["{}\$timestamp:]/g, '');
        }
      };
      
      print("  Time Range: " + hoursDiff.toFixed(2) + " hours");
      print("  First Timestamp: " + getSimpleTimestamp(oldest.ts) + " (" + formatDate(oldestDate) + ")");
      print("  Last Timestamp: " + getSimpleTimestamp(newest.ts) + " (" + formatDate(newestDate) + ")");
    }
    
    return true; // Indicates successful execution
  } catch (err) {
    print("Error executing oplog info script: " + err.message);
    return false; // Indicates failed execution
  }
}

// Run the function and check result
var result = getFormattedOplogInfo();
if (!result) {
  print("Script execution failed");
}
