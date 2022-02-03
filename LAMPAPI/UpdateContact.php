<?php
    $inData = getRequestInfo();
    
    // inputs to the query
    $contactInfo = $inData["contact"]; // contact to update
    $userId = $inData["userId"]; // current logged in user
    $newInfo = $inData["updateWith"]; // new name

    // establish sql connection to database
    $conn = new mysqli("127.0.0.1", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        // use update query with given data
        $stmt = $conn->prepare("UPDATE Contacts set FirstName = ?, LastName = ?, PhoneNumber = ?, Address = ?, Email = ? WHERE FirstName = ? and LastName = ? and PhoneNumber = ? and Address = ? and Email = ? and UserID=?");
        
        $stmt->bind_param("sssssssssss", $newInfo[0], $newInfo[1], $newInfo[4], $newInfo[2], $newInfo[3], 
                                         $contactInfo[0], $contactInfo[1], $contactInfo[4], $contactInfo[2], $contactInfo[3], $userId);
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