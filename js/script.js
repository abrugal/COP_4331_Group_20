// Login function
// What else do i need to add

const urlBase = 'http://143.198.109.82/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

$(document).ready(function() { 
	Particles.init({
		selector: '.background',
		color: '#00B6FF',
		connectParticles: true
	});
 });


function doLogin()
{
	// Prevents jquery from running multiple times
	$("#loginForm").off().on("submit" ,function(e) {
		e.preventDefault()
		// For some reason this works to validate forms???
		if($("#loginForm").has('.has-error').length == 0) {
			userId = 0;
			firstName = "";
			lastName = "";
			
			let login = document.getElementById("username").value;
			let password = document.getElementById("password").value;
			let hash = md5( password );
			
			// what does this return
			// document.getElementById("loginResult").innerHTML = "";

			// There are two tmp variables, causes error
			let tmp = {login:login,password:password};
			//let tmp = {login:login,password:hash};
			let jsonPayload = JSON.stringify( tmp );
			
			let url = urlBase + '/Login.' + extension;
			
			// xml object to make request to api
			let xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			try
			{
				xhr.onreadystatechange = function() 
				{
					if (this.readyState == 4 && this.status == 200) //ggot something bacc from api
					{
						let jsonObject = JSON.parse( xhr.responseText );
						userId = jsonObject.id;
				
						if( userId < 1 )
						{		
							//document.getElementById("loginResult").innerHTML = "User or Password not recorded";
							return;
						}

						firstName = jsonObject.firstName;
						lastName = jsonObject.lastName;
						
						saveCookie();
			
						window.location.href = "home.html";
						
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				console.log(err.message);
				document.getElementById("loginResult").innerHTML = err.message;
			}
		} 
		return;
	})
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegister()
{
	
}

function doSearch()
{

}

//Adds contact to database
function doAdd()
{
	//let add = ;

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
	// doAdd();
}


