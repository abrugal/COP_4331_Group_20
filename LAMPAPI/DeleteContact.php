<?php
$inData = getRequestInfo();


$first_name = $inData["firstName"];
$last_name = $inData["lastName"];
$phone_num = $inData["phoneNumber"];
$address = $inData["address"];
$email = $inData["email"];


$conn = new mysqli("127.0.0.1", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error)
{
    returnWithError( $conn->connect_error );
}

else
{
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE (FirstName=? AND LastName=? AND PhoneNumber=? AND Address=? AND Email=?) LIMIT 1");

    $stmt->bind_param("ssiss", $first_name,$last_name,$phone_num,$address,$email);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    returnWithError("No errors occurred!");
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

