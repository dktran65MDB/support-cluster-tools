# support-cluster-tools
This is a collection of script tools to help gathers information from the MongoDB cluster either on  Enterprise Advanced (EA) or the MongoDB Community Edition instance.


## How to run the scripts
Each script can be executed in various ways using the MongoDB Shell commands to summarize the stats on your existing MongoDB environemnt.  This is NOT intended as sizing exercise, but rahter a simple script to help pull the information of your existing runtime enviroments for review.

The run the scripts, the user must have the "dbAdmin" role permission.

Each script can be run in onf of two ways:
1. On your local machine using the mongosh command whcih intake the script file.
```
    mongosh < getClusterStats.sj
```

2. If prefer, start the mongo shell environment, and then load the script (or copy & paste the raw script content on the mongo shell environment).
```
    PRIMARY> load('getClusterStats.js)
```

## Here are the sample output results of each script execution...

### For getDatabaseInfo.js
This script will list all the databases fromt eh c;uster, and its size information.

Results:
```
admin
  Size on Disk: 0.08 MB
  Data Size: 0.00 MB
  Storage Size: 0.04 MB
  Index Size: 0.04 MB
config
  Size on Disk: 0.24 MB
  Data Size: 0.00 MB
  Storage Size: 0.10 MB
  Index Size: 0.14 MB
local
  Size on Disk: 140.44 MB
  Data Size: 799.26 MB
  Storage Size: 140.28 MB
  Index Size: 0.16 MB
People
  Size on Disk: 0.24 MB
  Data Size: 0.37 MB
  Storage Size: 0.19 MB
  Index Size: 0.05 MB
TSDEMO
  Size on Disk: 133.77 MB
  Data Size: 347.44 MB
  Storage Size: 89.79 MB
  Index Size: 43.98 MB
```

### For getOperationStats.js
The script shows the Operation Stats.

Results:
```
MONGODB OPERATION STATISTICS
============================

CURRENT OPERATION COUNTS:
  Inserts:  1637638
  Updates:  49
  Deletes:  13
  Queries:  130
  GetMore:  53130
  Commands: 61189

Measuring operations per second (sampling for 5 seconds)...

OPERATIONS PER SECOND (averaged over 5.018 seconds):
  Inserts/sec:  0.00
  Updates/sec:  0.00
  Deletes/sec:  0.00
  Queries/sec:  0.00
  GetMore/sec:  0.80
  Commands/sec: 2.99

REPLICATION OPERATION COUNTS:
  Inserts:  0
  Updates:  0
  Deletes:  0
  Queries:  0
  GetMore:  0
  Commands: 0
```

### For getOplogsInfo.js
The script show Oplogs configuration and its metrics.

Results:
```
OPLOG INFORMATION FOR REPLICA SET: myReplicaSet
=====================================
OPLOG CONFIGURATION:
  Max Size: 1.46 GB
  Current Size: 0.78 GB
  Used: 53.58%
  Storage Size: 0.14 GB
  Total Index Size: 0.00 MB
OPLOG METRICS:
  Total Records: 1638594
  Time Range: 2.50 hours
  First Timestamp: 1744936460:1 (4/18/2025, 12:34:20 AM)
  Last Timestamp: 1744945473:1 (4/18/2025, 3:04:33 AM)
```

### For etClusterStats.js
The script summarize the environment stats (Machine Configuration, OpLog Stats, Est. Backup Information, DB Storage, and Disk space used)

Results:
```
======= CLUSTER SUMMARIES =======
 --- Host Information -->> Map to AtlasCluster Tier ---

vCPU ..........................:  8 
RAM ...........................:  8 GB 
STORAGE .......................:  59 GB 
Electable Nodes ...............:  3 


======= OPLOG STATS =======
Total OpLog size .............:  1491.61669921875 MB 
Used Oplog ...................:  799 MB 
OpLog window  ................:  2 Hours 
Average OpLog MBs per hour ...:  381 MB 


======= BACKUP INFORMATION -->> FOR CALCULATING BACKUP COSTS =======
Data Size ........................................:  1.120 GB


======= ADDITIONAL INFORMATION OF POTENTIAL INTEREST ======= 
 --- DB STORAGE ---
Total size on disk (compressed data & indexes) ...:  0.268 GB
Total dataSize (uncompressed).....................:  1.120 GB
Compression (total dataSize -> total size on disk):  79.91% 

 --- DISK SPACE USED ---
Total File System Used ...........................:  30.1 GB 
Total File System Size ...........................:  59 GB 
Percent File System Used .........................:  51.57% 
```

#### Contributions
Thanks to Gary Taylor for helping with initial scripts, and I have add few more and also made some code changes for format and displays.
