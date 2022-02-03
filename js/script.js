// Login function
// What else do i need to add

const urlBase = 'http://143.198.109.82/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// for load more button
// increase this to display more contacts by default
let defaultResultNum = 2; 
let lastSearch = "";

$(document).ready(function() { 
	Particles.init({
		selector: '.background',
		color: '#00B6FF',
		connectParticles: true
	});

	if ($("body").hasClass("page homePage")) {
		doSearch();
	 }	
 });
 




function doLogin()
{
	// Prevents jquery from running multiple times
	$("#loginForm").off().on("submit" ,function(e) {
		e.preventDefault()
		// For some reason this works to validate forms???
		if($("#loginForm").has('.has-error').length == 0) {
			document.getElementById("loginResult").innerHTML = "";
			userId = 0;
			firstName = "";
			lastName = "";
			
			let login = document.getElementById("username").value;
			let password = document.getElementById("password").value;
			let hash = md5( password );
			
			
			// document.getElementById("loginResult").innerHTML = "";

			// There are two tmp variables, causes error
			//let tmp = {login:login,password:password};
			let tmp = {login:login,password:hash};
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
					if (this.readyState == 4 && this.status == 200) //got something back from api
					{
						let jsonObject = JSON.parse( xhr.responseText );
						userId = jsonObject.id;
				
						if( userId < 1 )
						{			
							$("#loginResult").addClass("mt-1");
							document.getElementById("loginResult").innerHTML = "Incorrect User or Password";
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
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
	// Prevents jquery from running multiple times
	$("#registerForm").off().on("submit" ,function(e) {
		e.preventDefault()
		if($("#registerForm").has('.has-error').length == 0) {
			console.log("Can register")

			// Write register function in here
			let lastname = document.getElementById("lastName").value;
			let firstname = document.getElementById("firstName").value;
			let username = document.getElementById("username").value;
			let password = md5(document.getElementById("password").value);
			alert(password)
			
			// uh lemme think

			let tmp = {lastName:lastname,firstName:firstname,login:username,password:password};
			let jsonPayload = JSON.stringify( tmp );
			
			let url = urlBase + '/Register.' + extension;
			
			
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

						if(userId < 1)
						{
							$("#registerResult").addClass("mt-1");
							document.getElementById("registerResult").innerHTML = "Cannot register.";
							return;
						}
						
						saveCookie();
			
						window.location.href = "home.html";
						
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				console.log(err.message);
				document.getElementById("registerResult").innerHTML = err.message;
			}
		}
		return;
	})
}

// searches a contact in the database
function doSearch()
{
  readCookie()
  // get the user input from search bar
  let srch = $('input[type=search]').val();

  // if user searched for a new term
  if (srch != lastSearch)
  {
	defaultResultNum = 2;

	// ungrey the button
	$( "#load-more-button" ).prop("disabled",false);
  }
  lastSearch = srch;
  
  // clear the search results table
  $("#contactsTableBody tr").remove();
  
  // search query
  let tmp = {search:srch,userId:userId,numResults:defaultResultNum};
  let jsonPayload = JSON.stringify(tmp);
  
  let url = urlBase + '/SearchContact.' + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
    xhr.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {
        let jsonObject = JSON.parse(xhr.responseText);

		
		for (const contact of jsonObject.results) {

				$("#contactsTableBody").append("<tr>\
				<td>" + contact.FirstName + "</td>\
				<td>" + contact.LastName + "</td>\
				<td>" + contact.Address + "</td>\
				<td>" + contact.Email + "</td>\
				<td>" + contact.PhoneNumber  + "</td>\
				<td>\
					<div class='row'>\
						<div class='col'>\
						<img src='images/trash-svgrepo-com.svg' class='img-fluid border border-dark rounded' data-bs-toggle='modal' data-bs-target='#DeleteContactModal' alt='Trashcan' onclick=addDeleteClass(this)>\
						</div>\
						<div class='col'>\
						<img src='images/edit-icon.svg' class='img-fluid' data-bs-toggle='modal' data-bs-target='#EditContactModal'  alt='Edit Pencil' onclick=addEditClass(this)>\
						</div>\
					</div>\
				</td>\
				</tr>");
		}

		// to prevent unnecessary calls to the api
		// numResults: the number of displayed results
		// defaultResultNum: the number of results we want the api to return
		if (jsonObject.numResultsFound == jsonObject.total)
		{
			defaultResultNum = -1;

			// grey out the load more button here
			$( "#load-more-button" ).prop("disabled",true);
		}
      }
    };
    xhr.send(jsonPayload);
  }
  catch(err)
	{
		$("#contactsTableBody").append("<tr>\
        	<td>" + err.message + "</td>\
          	</tr>"); 
	}
}

// called by the load more button
// displays more contacts 
function increaseResults()
{
	// how many more contacts to load per click
	defaultResultNum += 2;
	doSearch();
}

// Adds contact to database
function doAdd(firstName,lastName,address,email,phoneNumber)
{
	let add = {firstName:firstName.val(),lastName:lastName.val(),phoneNumber:phoneNumber.val(),address:address.val(),email:email.val(),userId:userId};
  	let jsonPayload = JSON.stringify(add);
	console.log(jsonPayload);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		$("#contactsTableBody").append("<tr>\
		<td>" + err.message + "</td>\
		</tr>");
	}
}

function doUpdate()
{
	$("#editContactForm").off().on("submit" ,function(e) {
		e.preventDefault()
		if($("#editContactForm").has('.has-error').length == 0) {
			
			let editRow = $(".editRow")
			let originalFirstName = $(editRow).find("td").eq(0).text()
			let originalLastName = $(editRow).find("td").eq(1).text()
			let originalAddress = $(editRow).find("td").eq(2).text()
			let originalEmail = $(editRow).find("td").eq(3).text()
			let originalPhoneNum = $(editRow).find("td").eq(4).text()

			let newFirstName = $("#editFirstName").val()
			let newLastName = $("#editLastName").val()
			let newAddress = $("#editAddress").val()
			let newEmail = $("#editEmail").val()
			let newPhoneNum = $("#editPhoneNum").val()

			$(editRow).removeClass("editRow")

			// Ignores update if no change was made
			if (originalFirstName == newFirstName && originalLastName == newLastName && originalAddress == newAddress &&
				originalEmail == newEmail && originalPhoneNum == newPhoneNum) {
				return;
			} else {
				$(editRow).find("td").eq(0).html(newFirstName)
				$(editRow).find("td").eq(1).html(newLastName)
				$(editRow).find("td").eq(2).html(newAddress)
				$(editRow).find("td").eq(3).html(newEmail)
				$(editRow).find("td").eq(4).html(newPhoneNum)

				// call endpoint inside this else statement

				// the endpoint will receive an array of the contact's info
				// and an array of the updated info for that contact
				// and will update the contact's info in the database
				const original = [originalFirstName, originalLastName, originalAddress, originalEmail, originalPhoneNum];
				const updated = [newFirstName, newLastName, newAddress, newEmail, newPhoneNum];

				let tmp = {contact:original,userId:userId,updateWith:updated};
				let jsonPayload = JSON.stringify(tmp);
				console.log(jsonPayload);
				let url = urlBase + '/UpdateContact.' + extension;
				
				let xhr = new XMLHttpRequest();
				xhr.open("POST", url, true);
				xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

				try
				{
					// just send the payload
					// the api won't send any info back
					xhr.send(jsonPayload);
				}
				catch(err)
				{
					$("#contactsTableBody").append("<tr>\
					<td>" + err.message + "</td>\
					</tr>");
				}
			}
			$("#editDismissModal").click();
		}
	})
}

// deletes a contact of a user from the database and table on website
function doDelete()
{
	let deleteRow = $(".deleteRow");
	let firstName = $(deleteRow).find("td").eq(0).text();
	let lastName = $(deleteRow).find("td").eq(1).text();
	let address = $(deleteRow).find("td").eq(2).text();
	let email = $(deleteRow).find("td").eq(3).text();
	let phoneNumber = $(deleteRow).find("td").eq(4).text();

	$(deleteRow).remove();

	// calls Delete endpoint
	let Delete = {firstName:firstName,lastName:lastName,phoneNumber:phoneNumber,address:address,email:email};
  	let jsonPayload = JSON.stringify(Delete);
	console.log(jsonPayload);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		$("#contactsTableBody").append("<tr>\
		<td>" + err.message + "</td>\
		</tr>");
	}
}

function resetContactFormFields() {
	$("#contactForm").find("input[type=text], textarea").val("");
	$("#contactForm").find("input[type=email], textarea").val("");
	$("#contactForm").find("input[type=tel], textarea").val("");
}

function submitContactForm() {
	// Prevents jquery from running multiple times
	$("#contactForm").off().on("submit" ,function(e) {
		e.preventDefault()
		if($("#contactForm").has('.has-error').length == 0) {
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
			<td>\
				<div class='row'>\
					<div class='col'>\
					<img src='images/trash-svgrepo-com.svg' class='img-fluid border border-dark rounded' data-bs-toggle='modal' data-bs-target='#DeleteContactModal' alt='Trashcan' onclick=addDeleteClass(this)>\
					</div>\
					<div class='col'>\
					<img src='images/edit-icon.svg' class='img-fluid' data-bs-toggle='modal' data-bs-target='#EditContactModal'  alt='Edit Pencil' onclick=addEditClass(this)>\
					</div>\
				</div>\
			</td>\
			</tr>");

			// adds new contact to database
			doAdd(firstName,lastName,address,email,phoneNum);
			
			resetContactFormFields();

			$("#dismissModal").click();
		}
	})
}

function cancelDelete() {
	$(".deleteRow").removeClass("deleteRow");
}

function addDeleteClass(row) {
	let deleteRow = $(row).parent().parent().parent().parent();
	$(deleteRow).addClass("deleteRow");
	$(".delete-title").html("Are you sure you want to delete " + $(deleteRow).find("td").eq(0).text() + " " + $(deleteRow).find("td").eq(1).text() + "?");
}

function cancelEdit() {
	$(".editRow").removeClass("editRow");
}

function addEditClass(row) {
	let editRow = $(row).parent().parent().parent().parent();
	$(editRow).addClass("editRow");
	$("#editFirstName").val($(editRow).find("td").eq(0).text())
	$("#editLastName").val($(editRow).find("td").eq(1).text())
	$("#editAddress").val($(editRow).find("td").eq(2).text())
	$("#editEmail").val($(editRow).find("td").eq(3).text())
	$("#editPhoneNum").val($(editRow).find("td").eq(4).text())
}


