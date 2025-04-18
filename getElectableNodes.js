// Function to determine if a node is electable based on rs.conf()
function getElectableNodes() {
    var config = rs.conf();
    var status = rs.status();
    var electable = [];
    var nonElectable = [];
    
    if (!config || !config.members) {
      print("No replica set configuration found or not connected to a replica set");
      return;
    }
    
    // Get replica set name
    var rsName = config._id || "Unknown";
    
    print("REPLICA SET: " + rsName);
    print("REPLICA SET ELECTABLE NODES ANALYSIS");
    print("=====================================");
    
    config.members.forEach(function(member) {
      // A node is electable if:
      // 1. It has priority > 0 (can become primary)
      // 2. It has voting rights (votes > 0 or votes not specified which defaults to 1)
      var priority = member.priority !== undefined ? member.priority : 1; // Default priority is 1
      var votes = member.votes !== undefined ? member.votes : 1; // Default votes is 1
      var isElectable = priority > 0 && votes > 0;
      
      var details = {
        id: member._id,
        host: member.host,
        priority: priority,
        votes: votes,
        hidden: member.hidden || false,
        arbiterOnly: member.arbiterOnly || false,
        isElectable: isElectable
      };
      
      if (isElectable) {
        electable.push(details);
      } else {
        nonElectable.push(details);
      }
    });
    
    // Print results
    print("\nELECTABLE NODES: " + electable.length);
    electable.forEach(function(node) {
      print("  Node " + node.id + ": " + node.host + 
            " (Priority: " + node.priority + ", Votes: " + node.votes + ")");
    });
    
    print("\nNON-ELECTABLE NODES: " + nonElectable.length);
    nonElectable.forEach(function(node) {
      var reason = [];
      if (node.priority === 0) reason.push("Priority is 0");
      if (node.votes === 0) reason.push("No voting rights");
      if (node.arbiterOnly) reason.push("Arbiter only");
      
      print("  Node " + node.id + ": " + node.host + 
            " (Priority: " + node.priority + ", Votes: " + node.votes + ")" +
            " - Reason: " + reason.join(", "));
    });
    
    return {
      replicaSetName: rsName,
      totalNodes: config.members.length,
      electableCount: electable.length,
      nonElectableCount: nonElectable.length,
      electableNodes: electable,
      nonElectableNodes: nonElectable
    };
  }
  
  // Execute the function
  var results = getElectableNodes();
  print("\nSUMMARY: " + results.electableCount + " out of " + results.totalNodes + 
        " nodes are electable in replica set '" + results.replicaSetName + "'");
