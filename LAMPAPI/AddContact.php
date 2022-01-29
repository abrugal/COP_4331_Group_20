<?php
$inData = getRequestInfo();


$first_name = $inData["firstName"];
$last_name = $inData["lastName"];
$phone_num = $inData["phoneNumber"];
$address = $inData["address"];
$email = $inData["email"];
$userId = $inData["userId"];

//$conn = new mysqli("localhost", "root", "Weare20Group", "COP4331");
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error)
{
    returnWithError( $conn->connect_error );
}

else
{
    $stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,PhoneNumber,Address,Email,UserID) VALUES (?,?,?,?,?,?)");

    $stmt->bind_param("ssissi", $first_name,$last_name,$phone_num,$address,$email,$userId);
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

