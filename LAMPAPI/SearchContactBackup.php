<?php
    $inData = getRequestInfo();

    $elementsToDisplay = $inData["numResults"];

    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT concat(FirstName, ' ', LastName) as FullName FROM Contacts
                                WHERE (FirstName like ? or LastName like ? or PhoneNumber like ? or Address like ? or Email like ?) and UserID=?");
        $contactInfo = "%" .$inData["search"] . "%";
        $stmt->bind_param("ssssss", $contactInfo, $contactInfo, $contactInfo, $contactInfo, $contactInfo, $inData["userId"]);
        $stmt->execute();

        $result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if ($searchCount == $elementsToDisplay)
            {
                break;
            }

            if($searchCount > 0)
            {
                $searchResult .= ",";
            }
            $searchCount++;
            $searchResults .= '"' . $row["FullName"] . '"';
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

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"'. $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>