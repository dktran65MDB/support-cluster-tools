// Validate dbAdmin Role
if (db.hostInfo().ok == 0) {
  user = db.runCommand({connectionStatus : 1}).authInfo.authenticatedUsers[0].user
  print (`\nUser '${user}' does not have the 'dbAdmin' role required to collect this information.\n`);

} else {

  // Compare Data Sizes
  // listDatabases reports storageSize + indexSize
  // the dataSize is uncompressed

  var totalStorageSize = 0;
  var totalDataSize = 0;
  var printDatabaseDetails = false;

  db.getSiblingDB("admin")
    .runCommand({ listDatabases: 1 })
    .databases.forEach(function (database) {
      // Get sizes
      storageSize = db.getSiblingDB(database.name).stats().storageSize;
      sizeOnDisk = database.sizeOnDisk;
      dataSize = db.getSiblingDB(database.name).stats().dataSize;
      compression = ((1 - storageSize / dataSize) * 100).toFixed(2);

      // Convert to MB
      sizeOnDiskMB = (sizeOnDisk / 1024 / 1024).toFixed(3);
      dataSizeMB = (dataSize / 1024 / 1024).toFixed(3);

      // Print
      if (printDatabaseDetails) {
        print(database.name);
        print(`  ${sizeOnDiskMB} MB - sizeOnDisk (compressed data & indexes)`);
        print(`  ${dataSizeMB} MB - dataSize (uncompressed)`);
        print(`  ${compression}% compression (dataSize -> storageSize)`);
        print();
      }

      totalStorageSize += storageSize;
      totalDataSize += dataSize;
    });

  var totalStorageSizeGB = (db.getSiblingDB("admin").runCommand({ listDatabases: 1 }).totalSize / 1024 / 1024 / 1024).toFixed(3);
  var totalCompression = ((1 - totalStorageSize / totalDataSize) * 100).toFixed(
    2
  );
  var fsUsedSizeGB = (db.getSiblingDB("admin").runCommand({ dbStats: 1 }).fsUsedSize / 1024 / 1024 / 1024).toFixed(1);
  var fsTotalSizeGB = (db.getSiblingDB("admin").runCommand({ dbStats: 1 }).fsTotalSize / 1024 / 1024 / 1024).toFixed(3);
  var percentFsUsed = ((fsUsedSizeGB / fsTotalSizeGB) * 100).toFixed(2);

  print("\n======= CLUSTER SUMMARIES =======");
  print(" --- Host Information -->> Map to AtlasCluster Tier ---\n");
  var mem = Math.ceil(db.hostInfo().system.memSizeMB / 1024);
  var cores = db.hostInfo().system.numCores;

  print(`vCPU ..........................:  ${mem} `);
  print(`RAM ...........................:  ${mem} GB `);
  print(`STORAGE .......................:  ${Math.ceil(fsTotalSizeGB)} GB `);


  replSet = db.isMaster().hosts == null ? false : true;
  if (replSet) {
    nodes = db.isMaster().hosts.length;
  } else {
    nodes = 1;
  }
  print(`Electable Nodes ...............:  ${nodes} \n`);


  // Print oplog information
  if (replSet) {
    replInfo = db.getReplicationInfo();
    avgOplogMBPerHour = (replInfo.usedMB / replInfo.timeDiffHours).toFixed(0);

    print("\n======= OPLOG STATS =======");
    print(`Total OpLog size .............:  ${replInfo.logSizeMB} MB `);
    print(`Used Oplog ...................:  ${replInfo.usedMB.toFixed(0)} MB `);
    print(`OpLog window  ................:  ${replInfo.timeDiffHours.toFixed(0)} Hours `);
    print(`Average OpLog MBs per hour ...:  ${avgOplogMBPerHour} MB `);
  }

  print("\n\n======= BACKUP INFORMATION -->> FOR CALCULATING BACKUP COSTS =======");
  print(`Data Size ........................................:  ${(totalDataSize / 1024 / 1024 / 1024).toFixed(3)} GB`);

  print("\n\n======= ADDITIONAL INFORMATION OF POTENTIAL INTEREST ======= ");
  print(" --- DB STORAGE ---");
  print(`Total size on disk (compressed data & indexes) ...:  ${totalStorageSizeGB} GB`);
  print(`Total dataSize (uncompressed).....................:  ${(totalDataSize / 1024 / 1024 / 1024).toFixed(3)} GB`);
  print(`Compression (total dataSize -> total size on disk):  ${totalCompression}% `);
  print("\n --- DISK SPACE USED ---");
  print(`Total File System Used ...........................:  ${fsUsedSizeGB} GB `);
  print(`Total File System Size ...........................:  ${Math.ceil(fsTotalSizeGB)} GB `);
  print(`Percent File System Used .........................:  ${percentFsUsed}% `);
  print();
}