<?php
    $inData = getRequestInfo();

    $searchResults = "";
    $searchCount = 0;

    // establish sql connection with database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error);
    }
    else
    {
        // query to search for a contact
        // doesn't have to be a perfect match
        $stmt = $conn->prepare("SELECT Name FROM Contacts WHERE Name like ? and UserID=?");
        $contactName = "%" .$inData["search"] . "%";
        $stmt->bind_param("ss", $contactName, $inData["userId"]);
        $stmt->execute();

        $result = $stmt->get_result();
    
        // print all the results that match the query
        while($row = $result->fetch_assoc())
        {
            if($searchCount > 0)
            {
                $searchResult .= ",";
            }
            $searchCount++;
            $searchResults .= '"' . $row["Name"] . '"';
        }

        if ($searchCount == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($searchResults);
        }

        $stmt->close();
        $conn->close();
    }

    // get input from javascript
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    // print out result
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    // couldn't find anything
    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"'. $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    // return the things we found
    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
