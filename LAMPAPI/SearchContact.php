<?php
    $inData = getRequestInfo();

    $elementsToDisplay = $inData["numResults"];

    //$searchResults[] = array();
    $searchCount = 0;

    $conn = new mysqli("127.0.0.1", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT * FROM Contacts
                                WHERE (FirstName like ? or LastName like ? or PhoneNumber like ? or Address like ? or Email like ?) and UserID=?");
        $contactInfo = "%" .$inData["search"] . "%";
        $stmt->bind_param("ssssss", $contactInfo, $contactInfo, $contactInfo, $contactInfo, $contactInfo, $inData["userId"]);
        $stmt->execute();

        $result = $stmt->get_result();
        $total = $stmt->affected_rows;

        while($row = $result->fetch_assoc())
        {
            if ($searchCount == $elementsToDisplay)
            {
                break;
            }

            $searchCount++;
            $searchResults[] = $row;
        }

        if ($searchCount == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($searchResults, $searchCount, $total);
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
        $retValue = '{"id":0,"total":0,"numResultsFound":0,"error":"'. $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults, $numResultsFound, $total)
    {
        // "numResultsFound"' . json_encode($searchCount) . '
        $retValue = '{"numResultsFound":' . json_encode($numResultsFound) . ',"total":' . json_encode($total) . ',"results":' . json_encode($searchResults) . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>