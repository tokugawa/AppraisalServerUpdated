/* Appraisal App Dashboard
** Custom Javascript for Appraisal App Dashboard
**
*/

//Initial Page Load
loadOverview();
///////////////////////////////////

//Load Pages Functions
function loadOverview(){

	$('#content-location').empty();
	$('#content-location').load('./overview.html', function(){

   		Metronic.init(); // init metronic core componets
   		Layout.init(); // init layout
   		Demo.init(); // init demo features
		Index.init(); // init index page
 		Tasks.initDashboardWidget(); // init tash dashboard widget

 		//Morris Chart about the number of orders from each customer
 		new Morris.Donut({
		  	element: 'customer-order-distribution-chart',
		  	data: [
		    	{ label: 'Wells Fargo', value: 102 },
			    { label: 'Bank of America', value: 500 },
			    { label: 'Appraisals\'4\'U', value: 45 }
		  	],
	    	colors: chartColors
	  	});
	});
}
function loadUsersHome(){

	$('#content-location').empty();
	$('#content-location').load('./users-home.html', function(){

		loadTableData('users-table', users, 2, userTableColumns, userTableColumnDefs);
		$('.dataTable').each(function(){

			$(this).wrap('<div class="scrollStyle" />');
		});
	});
}
function loadUsersIndividual(userId){

	$('#content-location').empty();
	$('#content-location').load('./users-individual.html', function(){

		$('#user-id-title').html(userId);
		createUserOrdersTables(userId, orders);

		//Generate data for completed orders completion rate chart
		var completedOrders = function(){

			var com = [];

			for(var x=0; x<orders.length; x++){
				if(orders[x].appraiser.id==userId && orders[x].completedStatus){
					com.push(new Completed(userId, orders[x].id, randomDate(new Date(2014, 0, 1), new Date()), ((Math.random() *10 )+"").substring(0,5)));
				}
			}
			return com;
		}();

		//Generate data for monthly completion line chart
		/*var completedOrdersByDate = function(){

			var com = [];

			for(var x=0; x<completedOrders.length; x++){
				if(completedOrders[x]){
					com.push({

					});
				}
			}
			return com;
		}();*/

		new Morris.Line({
		  	// ID of the element in which to draw the chart.
		  	element: 'appraiser-monthly-completion-chart',
		  	// Chart data records -- each entry in this array corresponds to a point on
		  	// the chart.
		  	data: [
			    { month: '2014-01', completed: 20 },
			    { month: '2014-02', completed: 10 },
			    { month: '2014-03', completed: 5 },
		    	{ month: '2014-04', completed: 5 },
		    	{ month: '2014-05', completed: 20 }
		  	],
		  	// The name of the data record attribute that contains x-values.
		  	xkey: 'month',
		  	// A list of names of data record attributes that contain y-values.
		  	ykeys: ['completed'],
		  	// Labels for the ykeys -- will be displayed when you hover over the
		  	// chart.
		  	labels: ['Completed']
		});
		if(completedOrders.length > 0){
			new Morris.Bar({
		  	
			  	element: 'appraiser-completion-rate-chart',
			  	data: completedOrders,
			  	xkey: 'orderId',
			  	ykeys: ['timeTaken'],
			  	labels: ['Time Taken']
			});
		}
		else{
			$('#appraiser-completion-rate-chart').append("No data found for this user");
		}
		$('.dataTable').each(function(){

			$(this).wrap('<div class="scrollStyle" />');
		});

		//Add user information
		for(var x=0; x<users.length; x++){
			if(users[x].id == userId){
				$('#user-first-name').val(users[x].firstName);
				$('#user-last-name').val(users[x].lastName);
				$('#user-email').val(users[x].email);
				$('#user-phone-number').val(users[x].phoneNumber);
				$('#user-address-one').val(users[x].addressOne);
				$('#user-address-two').val(users[x].addressTwo);
				$('#user-city').val(users[x].city);
				$('#user-zip').val(users[x].zip);
			}
		}
	});
}
function loadOrdersHome(){

	$('#content-location').empty();
	$('#content-location').load('./orders-home.html', function(){

		loadTableData('orders-table', orders, 2, orderTableColumns, orderTableColumnDefs);
		$('.dataTable').each(function(){

			$(this).wrap('<div class="scrollStyle" />');
		});

		new Morris.Donut({
		  	element: 'orders-completed',
		  	data: [
		    	{ label: 'Completed', value: 90 },
			    { label: 'Not Completed', value: 10 }
		  	],
	    	colors: chartColors
	  	});
	  	new Morris.Donut({
		  	element: 'orders-completed-per-appraiser',
		  	data: [
		    	{ label: 'Steve Harvey', value: 17 },
			    { label: 'Evan Pearl', value: 32 },
			    { label: 'Howard Stern', value: 5 }
		  	],
	    	colors: chartColors
	  	});
	});
}
function loadOrdersIndividual(orderId){

	$('#content-location').empty();
	$('#content-location').load('./orders-individual.html', function(){

		//TODO
		$('#order-number').html(orderId);
		
		for(var x=0; x<orders.length; x++){
			if(orders[x].id == orderId){
				$('#order-assigned-appraiser').val(orders[x].appraiser.lastName);
				$('#order-customer').val(orders[x].company);
				$('#order-email').val(orders[x].email);
				//$('#order-phone-number').val(orders[x].phoneNumber);
				$('#order-address-one').val(orders[x].street);
				//$('#order-address-one').val(orders[x].addressOne);
				//$('#order-address-two').val(orders[x].addressTwo);
				$('#order-city').val(orders[x].city);
				$('#order-state').val(useordersrs[x].state);
				$('#order-zip').val(useordersrs[x].zip);
			}
		}
	});
}
function loadSupport(){

	$('#content-location').empty();
	$('#content-location').load('./support.html', function(){

		//TODO
	});
}
/////////////////////////////////////////////////

//DUMMY OBJECTS
function User(id, firstName, lastName, orders, email, phoneNumber, addressOne, addressTwo, city, state, zip){

	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.orders = orders;
	this.email = email;
	this.phoneNumber = phoneNumber;
	this.addressOne = addressOne;
	this.addressTwo = addressTwo;
	this.city = city;
	this.state = state;
	this.zip = zip;
}
function Order(id, appraiser, appraisee, company, street, city, state, zip, completedStatus){
	this.id = id;
	this.appraiser = appraiser;
	this.appraisee = appraisee;
	this.company = company;
	this.street = street;
	this.city = city;
	this.state = state;
	this.zip = zip;
	this.completedStatus = completedStatus;
}
function Admin(id, firstName, lastName, username, password){
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.username = username;
	this.password = password;
}
function Completed(userId, orderId, dateCompleted, timeTaken){
	this.userId = userId;
	this.orderId = orderId;
	this.dateCompleted = dateCompleted;
	this.timeTaken = timeTaken;
}
////////////////////////////////////////////////

//Dummy user data
var users = [
	new User(800745, 'Evan', 'Pearl', [], 'ep@gmail.com', '123-456-7890', '123 Address', 'Apt 342', 'Charlotte', 'NC', 28262),
	new User(800782, 'Steve', 'Harvey', [], 's.harvey@gmail.com', '951-752-0021', '54 Address', '', 'Albuquerque', 'NM', 90210),
	new User(801537, 'Howard', 'Stern', [], 'hstern@gmail.com', '985-895-5663', '3 Address', '', 'Charlotte', 'NC', 28262),
];

var userTableColumns = [
	    		{data: "id"},
	    		{data: "firstName"},
	    		{data: "lastName"},
				{data: "orders.length"},
];
var userTableColumnDefs = [
		    	{ "title": "ID", "targets": 0 },
		    	{ "title": "First Name", "targets": 1 },
		    	{ "title": "Last Name", "targets": 2 },
		    	{ "title": "Order Count", "targets": 3 },
];
var orders = [
	new Order(100001, users[1], "Dave Thomas", "Appraisals'4'U", "221b Baker St","Albuquerque", "New Mexico", 90210, true),
	new Order(100002, users[0], "Shahid Jakeman", "Bank of America", "221b Baker St","Manchester", "Connecticut", 06042, false),
	new Order(100003, users[1], "Kamalla Ferrer", "Wells Fargo", "221b Baker St","Albuquerque", "New Mexico", 90210, false),
	new Order(100004, users[1], "Romulus Joncker", "Wells Fargo", "221b Baker St","Charlotte", "North Carolina", 28202, true),
	new Order(100005, users[1], "Zhou Alfredson", "Appraisals'4'U", "221b Baker St","Charlotte", "North Carolina", 28202, false),
	new Order(100006, users[2], "Atlanta Lyon", "Bank of America", "221b Baker St","Albuquerque", "New Mexico", 90210, true),
	new Order(100007, users[0], "Riko Agnarsson", "Bank of America", "221b Baker St","Albuquerque", "New Mexico", 90210, false),
	new Order(100008, users[2], "Sandie Aalfs", "Appraisals'4'U", "221b Baker St","Albuquerque", "New Mexico", 90210, false),
	new Order(100009, users[1], "Dave Thomas", "Appraisals'4'U", "221b Baker St","Albuquerque", "New Mexico", 90210, true),
	new Order(100010, users[0], "Klara Gonzas", "Wells Fargo", "221b Baker St","Albuquerque", "New Mexico", 90210, true),
	new Order(100011, users[0], "Rosalin Toselli", "Wells Fargo", "221b Baker St","Albuquerque", "New Mexico", 90210, false),
];
var orderTableColumns = [
	{data: "id"},
	{data: "appraiser.lastName"},
	{data: "appraisee"},
	{data: "company"},
	{data: "street"},
	{data: "city"},
	{data: "state"},
	{data: "zip"},
];
var orderTableColumnDefs = [
	{ "title": "ID", "targets": 0 },
	{ "title": "Appraiser", "targets": 1 },
	{ "title": "Appraisee", "targets": 2 },
	{ "title": "Company", "targets": 3 },
	{ "title": "Street", "targets": 4 },
	{ "title": "City", "targets": 5 },
	{ "title": "State", "targets": 6 },
	{ "title": "Zip", "targets": 7 },
];

users[0].orders = ([orders[1], orders[6], orders[9]]);
users[1].orders = ([orders[0], orders[2], orders[3], orders[4], orders[8]]);
users[2].orders = ([orders[5], orders[7]]);

var chartColors = ['#f36a5a', '#5C9BD1', '#4DB3A2'];
/////////////////////////////////////////////

//load all users into the user table
function loadTableData(tableId, dataArray, sizePerPage, columns, columnDefs){
	
	//Create the table with pagination
    var oTable = $('#'+tableId).dataTable({
    	"data": dataArray,
    	"columns":columns,
    	"columnDefs": columnDefs,
    	//"scrollX": true,
    	//"sScrollX": '100%',
    	"autoWidth": false,
    	//"bJQueryUI": true,
 	 	//bFilter: false, 
 	 	//bInfo: false,
 	 	bDestroy: true,
 	 	"sDom": '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
    });
    if(tableId == 'users-table'){
	    oTable.$('tr').click( function () {
	    	
			loadUsersIndividual(oTable.fnGetData(this, 0));
	  	});
	}
	else if(tableId == 'orders-table' || tableId == 'orders-table-all' || tableId == 'orders-table-current' || tableId == 'orders-table-completed'){
		oTable.$('tr').click( function () {
	    	
			loadOrdersIndividual(oTable.fnGetData(this, 0));
	  	});
	}
	/*createPaginator(tableId, paginatorId, users, sizePerPage);

	var usersHTML = "";
	users.forEach(function(userData, index){
		
		usersHTML += "<tr>"+
						"<td><div class='checkbox'><label><input type='checkbox' name='userList' value='"+userData.id+"' /></label></div></td>"+
						"<td class='sorting_1'>"+userData.id+"</td>"+
						"<td>"+userData.firstName+"</td>"+
						"<td>"+userData.lastName+"</td>"+
						"<td>"+userData.orders.length+"</td>"+
					"</tr>";
	});
	$('#'+tableId).append(usersHTML);*/
}

/*function createPaginator(tableId, paginatorId, tableArray, sizePerPage){//Unnecessary

	var paginatorHTML = '<div class="dataTables_paginate paging_simple_numbers">'+
							'<ul class="pagination">'+
							    '<li class="paginate_button previous disabled" aria-controls="'+tableId+'" tabindex="0">'+
							      	'<a href="#" aria-label="Previous">'+
					       	 			'<span aria-hidden="true">&laquo;</span>'+
							     	'</a>'+
							    '</li>';
	var numOfPages = (tableArray.length/sizePerPage);

	paginatorHTML += '<li class="paginate_button active" aria-controls="'+tableId+'" tabindex="0"><a href="#">'+1+'</a></li>';
	for(var x=1; x<numOfPages; x++){
		paginatorHTML += '<li class="paginate_button" aria-controls="'+tableId+'" tabindex="0"><a href="#">'+(x+1)+'</a></li>';
	}

	paginatorHTML += '<li class="paginate_button next" aria-controls="'+tableId+'" tabindex="0">'+
			      	'<a href="#" aria-label="Next">'+
			        	'<span aria-hidden="true">&raquo;</span>'+
			      	'</a>'+
			    '</li>'+
		  	'</ul>';

	$('#'+paginatorId).append(paginatorHTML);
}*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////

//BEGIN Validations
function validateUsername(username){
	if(username != null && username.length > 0){
		return true;
	}
	console.log(username);
	return false;
}
function validateEmail(id){
	var pattern = /^([a-zA-Z0-9]+@[a-zA-Z0-9]+\.(com|gov))$/;
	//alert(pattern.test('b1!@b.com'));
	if(pattern.test(id)){
		return true;
  	}
  	console.log(id);
	return false;
}
function validatePassword(password){
	if(password != null && password.length > 5){
		return true;
	}
	console.log(password);
	return false;
}
function validateTextFilled(text){
	if(text != null && text.length > 0){
		return true;
	}
	console.log(text);
	return false;
}
function validateZipCode(zip){ //validates a zipcode(12345 or 12345-1234)
  	var pattern = /^(([0-9]{5})|([0-9]{5}-[0-9]{4}))$/;
  	//alert(pattern.test('4568a'));
  	if(pattern.test(zip)){
		return true;
  	}
  	console.log(zip);
	return false;
}

function validateNewUser(){

	var validated = true;

	if(!validateEmail($('#new-user-email').val())){
		validated = false;
		//$('#new-user-email').css('border', '1px solid tomato');
	}
	if(!validatePassword($('#new-user-password').val())){
		validated = false;
		//$('#new-user-password').css('border', '1px solid tomato');
	}
	if(!validateTextFilled($('#new-user-first-name').val())){
		validated = false;
		//$('#new-user-first-name').css('border', '1px solid tomato');
	}
	if(!validateTextFilled($('#new-user-last-name').val())){
		validated = false;
		//$('#new-user-last-name').css('border', '1px solid tomato');
	}
	if(!validateTextFilled($('#new-user-address-line-one').val())){
		validated = false;
		//$('#new-user-address-line-one').css('border', '1px solid tomato');
	}
	/*if(!validateTextFilled($('#new-user-address-line-two').val())){
		validated = false;
		$('#new-user-address-line-two').css('border', '1px solid tomato');
	}*/
	if(!validateTextFilled($('#new-user-city').val())){
		validated = false;
		//$('#new-user-city').css('border', '1px solid tomato');
	}
	if(!validateTextFilled($('#new-user-state').val())){
		validated = false;
		//$('#new-user-state').css('border', '1px solid tomato');
	}
	if(!validateZipCode($('#new-user-zip').val())){
		validated = false;
		//$('#new-user-zip').css('border', '1px solid tomato');
	}

	if(validated)
		console.log('USER VALIDATED TRUE');
	else
		console.log('USER INFORMATION NOT VALID');
	
	return validated;
}

function validateNewOrder(){

	var validated = true;

	if(!validateTextFilled($('#orderId').val()))
		validated = false;
	if(!validateTextFilled($('#appraiserId').val()))
		validated = false;
	if(!validateTextFilled($('#firstName').val()))
		validated = false;
	if(!validateTextFilled($('#lastName').val()))
		validated = false;
	if(!validateTextFilled($('#addressLine1').val()))
		validated = false;
	if(!validateTextFilled($('#addressLine2').val()))
		validated = false;
	if(!validateTextFilled($('#city').val()))
		validated = false;
	if(!validateTextFilled($('#state').val()))
		validated = false;
	if(!validateTextFilled($('#zip').val()))
		validated = false;

	if(validated)
		console.log('ORDER VALIDATED TRUE');
	else
		console.log('ORDER INFORMATION NOT VALID');

	return validated;

}
//END Validations

//users orders tables
function createUserOrdersTables(userId, orders){

	var allOrders = [];
	var currentOrders = [];
	var completedOrders = [];

	//Create orders tables for all, current, and completed orders
	for(var x=0; x<orders.length; x++){

		if(orders[x].appraiser.id == userId){
			allOrders.push(orders[x]);
			if(orders[x].completedStatus == false){
				currentOrders.push(orders[x]);
			}
			else{
				completedOrders.push(orders[x]);
			}
		}
	}
	
	//Load orders tables for the user
	loadTableData('orders-table-all', allOrders, 2, orderTableColumns, orderTableColumnDefs);//all
	loadTableData('orders-table-current', currentOrders, 2, orderTableColumns, orderTableColumnDefs);//current
	loadTableData('orders-table-completed', completedOrders, 2, orderTableColumns, orderTableColumnDefs);//completed
	$('#orders-table-all-div').css('display', 'block');

	//Initiate table switching functions
	$('#user-orders-table-button-group label').click(function() {
	    
	    var str = $(this).text().replace(/\s+/g, '');
	    if(str == 'All'){
	    	console.log($(this).text());
    		$('#orders-table-all-div').css('display', 'block');
    		$('#orders-table-current-div').css('display', 'none');
    		$('#orders-table-completed-div').css('display', 'none');
	    }
	    else if(str == 'Current'){
	    	console.log($(this).text());
	    	$('#orders-table-all-div').css('display', 'none');
    		$('#orders-table-current-div').css('display', 'block');
    		$('#orders-table-completed-div').css('display', 'none');
	    }
	    else if(str == 'Completed'){
	    	console.log($(this).text());
	    	$('#orders-table-all-div').css('display', 'none');
    		$('#orders-table-current-div').css('display', 'none');
    		$('#orders-table-completed-div').css('display', 'block');
	    }
	});
}
///////////////////////////////////////////////////////////////////////

//Element manipulation
function changeTab(element){
	$('.main-nav-item.active').removeClass('active');
	$(element).addClass('active');
}
function enableDisabled(){
	$('.disableToggle').removeAttr("disabled");
}
function disableInput(){
	$('.disableToggle').attr("disabled", "disabled");
}
//////////////////////////////////////////////////////////////////////

//Functions for random calculations
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
/////////////////////////////////////////////////////////////////////////

//Creation functions
function createUser(){
	//TODO
	if(validateNewUser()){
		users.push(new User(users[users.length-1].id + 1, $('#user-new-first-name').val(), $('#user-new-last-name').val(), [], $('#user-new-email').val(), $('#user-new-phone-number').val(), 
			$('#user-new-address-line-one').val(), $('#user-new-address-line-two').val(), $('#user-new-city').val(), $('#user-new-state').val(), $('#user-new-zip').val()));
		loadTableData('users-table', users, 2, userTableColumns, userTableColumnDefs);
		$('#create-user-modal').modal('hide');
		return true;
	}
}
function createOrder(){
	//TODO
}
///////////////////////////////////////////////////////////////////////////////