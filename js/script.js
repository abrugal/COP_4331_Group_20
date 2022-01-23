
// Login function
// What else do i need to add

const urlBase = 'http://contacts-20.software/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	// There are two tmp variables, causes errror
	let tmp = {login:login,password:password};
	// var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User or Password not recorded";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{

}

function doSearch()
{

}

function doAdd()
{

}

function doUpdate()
{

}

function doDelete(row)
{
	let deleteRow = $(row).parent().parent();
	// Children contains the contact information that must be deleted. Currently dont have primary key of Contact. I think after logging in is done we can have the correct id?
	let children = $(row).parent().parent();
	// This is to delete the contact on the webpage. Doesnt delete it in the database 
	$(deleteRow).remove();
}

function resetContactFormFields() {
	$("#contactForm").find("input[type=text], textarea").val("");
}

function submitContactForm() {
	let firstName = $("#contactForm").find("#firstName");
	let lastName = $("#contactForm").find("#lastName");
	let address = $("#contactForm").find("#address");
	let email = $("#contactForm").find("#email");
	let phoneNum = $("#contactForm").find("#phoneNum");

	// Adds Contact to table on website, not database
	$("#contactsTableBody").append("<tr>\
	<td>" + $(firstName).val() + "</td>\
	<td>" + $(lastName).val() + "</td>\
	<td>" + $(address).val() + "</td>\
	<td>" + $(email).val() + "</td>\
	<td>" + $(phoneNum).val() + "</td>\
	<td><img src='images/trash-svgrepo-com.svg' alt='Trashcan' onclick='doDelete(this)'></td>\
  	</tr>");
	
	resetContactFormFields();

	// You should call doAdd here and pass in the values to be saved in the database
}

window.onload = function() {
	Particles.init({
		selector: '.background',
		color: '#00B6FF',
		connectParticles: true
	});
  };

