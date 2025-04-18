// Function to get MongoDB operation statistics
function getOperationStats() {
  print("MONGODB OPERATION STATISTICS");
  print("============================");
  
  // Get server status which contains operation counters
  var serverStatus = db.serverStatus();
  
  if (!serverStatus || !serverStatus.opcounters) {
    print("Could not retrieve operation counters");
    return;
  }
  
  // Display the current operation counts
  var ops = serverStatus.opcounters;
  print("\nCURRENT OPERATION COUNTS:");
  print("  Inserts:  " + ops.insert.toLocaleString());
  print("  Updates:  " + ops.update.toLocaleString());
  print("  Deletes:  " + ops.delete.toLocaleString());
  print("  Queries:  " + ops.query.toLocaleString());
  print("  GetMore:  " + ops.getmore.toLocaleString());
  print("  Commands: " + ops.command.toLocaleString());
  
  // Calculate operations per second by taking a second sample
  print("\nMeasuring operations per second (sampling for 5 seconds)...");
  
  // First sample
  var firstSample = Object.assign({}, serverStatus.opcounters);
  var startTime = new Date();
  
  // Wait for 5 seconds
  sleep(5000);
  
  // Second sample
  var secondSample = db.serverStatus().opcounters;
  var endTime = new Date();
  var durationSecs = (endTime - startTime) / 1000;
  
  // Calculate rates
  print("\nOPERATIONS PER SECOND (averaged over " + durationSecs + " seconds):");
  print("  Inserts/sec:  " + ((secondSample.insert - firstSample.insert) / durationSecs).toFixed(2));
  print("  Updates/sec:  " + ((secondSample.update - firstSample.update) / durationSecs).toFixed(2));
  print("  Deletes/sec:  " + ((secondSample.delete - firstSample.delete) / durationSecs).toFixed(2));
  print("  Queries/sec:  " + ((secondSample.query - firstSample.query) / durationSecs).toFixed(2));
  print("  GetMore/sec:  " + ((secondSample.getmore - firstSample.getmore) / durationSecs).toFixed(2));
  print("  Commands/sec: " + ((secondSample.command - firstSample.command) / durationSecs).toFixed(2));
  
  // Get replSet opcounters if available (MongoDB 4.0+)
  if (serverStatus.opcountersRepl) {
    var replOps = serverStatus.opcountersRepl;
    print("\nREPLICATION OPERATION COUNTS:");
    print("  Inserts:  " + replOps.insert.toLocaleString());
    print("  Updates:  " + replOps.update.toLocaleString());
    print("  Deletes:  " + replOps.delete.toLocaleString());
    print("  Queries:  " + replOps.query.toLocaleString());
    print("  GetMore:  " + replOps.getmore.toLocaleString());
    print("  Commands: " + replOps.command.toLocaleString());
  }
  
  return {
    totalCounts: serverStatus.opcounters,
    opsPerSecond: {
      insert: ((secondSample.insert - firstSample.insert) / durationSecs),
      update: ((secondSample.update - firstSample.update) / durationSecs),
      delete: ((secondSample.delete - firstSample.delete) / durationSecs),
      query: ((secondSample.query - firstSample.query) / durationSecs),
      getmore: ((secondSample.getmore - firstSample.getmore) / durationSecs),
      command: ((secondSample.command - firstSample.command) / durationSecs)
    },
    replicationCounts: serverStatus.opcountersRepl || null
  };
}

// Execute the function
var opStats = getOperationStats();
