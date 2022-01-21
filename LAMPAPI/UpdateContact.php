<?php
    $inData = getRequestInfo();
    
    // inputs to the query
    $contactName = $inData["contact"]; // contact to update
    $userId = $inData["userId"]; // current logged in user
    $newName = $inData["updateWith"]; // new name

    // establish sql connection to database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // use update query with given data
        // this will also update duplicates
        $stmt = $conn->prepare("UPDATE Contacts SET Name = ? WHERE Name = ? and UserID=?");
        $stmt->bind_param("ss", $newName, $contactName, $userId);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
    }

    // get the request from frontend javascript
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    // sends the parameter back to frontend
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
		echo $obj;
    }

    // sends any error (if it exists) back to the frontend
    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>