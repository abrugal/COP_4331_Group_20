<?php
	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$elementsToDisplay = 1;
    $searchCount = 0;

	$conn = new mysqli("127.0.0.1", "TheBeast", "WeLoveCOP4331", "COP4331");
	//$conn = new mysqli("localhost", "root", "Weare20Group", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$stmt = $conn->prepare("SELECT Login FROM Users WHERE (login = ?)");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$exists = (bool) $stmt->get_result()->fetch_row();

		if ($exists)
		{
			returnWithError("Duplicate User");
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();

			$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=? AND Password =?");
			$stmt->bind_param("ss", $login, $password);
			$stmt->execute();
			$result = $stmt->get_result();

			if( $row = $result->fetch_assoc()  )
			{
				returnWithInfo( $row['ID'] );
			}
			else
			{
				returnWithError("Duplicate User");
			}	
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":"-1","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id )
	{
		$retValue = '{"id":"' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>