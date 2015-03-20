/* Appraisal App Dashboard
** Custom Javascript for Appraisal App Dashboard
**
*/

//Initial Page Load
var loggedInId;
var chartColors = ['#f36a5a', '#5C9BD1', '#4DB3A2', '#8877a9'];
var appServer = "http://localhost:3000";

$(document).ready(function(){

	$.ajaxSetup({ cache: false });

	Metronic.init(); // init metronic core componets
	Layout.init(); // init layout
	Demo.init(); // init demo features

	$('form').on('submit', function(e){
		e.preventDefault();
      	$.post($(this).attr('action'), $(this).serialize(), function(response){
      		//console.log(response);
            login(response);
      	},'json');
      	return false;
   	});
	/*$('#login-button').click(function(){
		$.ajax({
            url: appServer+ "/api/v1/checkUserCredential?userName=" + $('#username').val() + '&password=' + $('#password').val() + '&apiKey=df5cb700-395b-11e4-916c-0800200c9a66',
            beforeSend: function(xhr) {
                //myApp.showPreloader();
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .done(function(data) {
        	console.log(data);
        });
	});*/
});
///////////////////////////////////

//Load Pages Functions
function login(response){

	if(response.loginStatus == 'administrator'){
		//console.log(response);
		showPreloader();
		$('#template-body').empty();
		$('#template-body').load('./index.html', function(){
			loadOverview();
			hidePreloader();
		});
	}
	else if(response.loginStatus == 'appraiser'){
		//TODO load appraiser template
		//console.log(response);
		showPreloader();
		$('#template-body').empty();
		$('#template-body').load('./index.html', function(){
			loadAppraiserOverview();
			hidePreloader();
		});
	}
	else{
		badLoginShake('login-page-form', 'login-page-wrapper');
	}
}
function loadOverview(){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./overview.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

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
	  	hidePreloader();
	});

	//getAllAddresses();
}
function loadAppraiserOverview(){
	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./overview-appraiser.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}
	});
}
function loadUsersHome(){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./users-home.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		$.post('/getAllUsers', function(result){

			console.log(result);
			loadTableData('users-table', result.query, 2, userTableColumns, userTableColumnDefs);
			$('.dataTable').each(function(){
				$(this).wrap('<div class="scrollStyle" />');
			});
		}).fail(function(){
			console.log('Error getting AllUsers');
		}).done(function(){
			hidePreloader();
		});

	});
}
function loadUsersIndividual(userId){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./users-individual.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		$('#user-id-title').html(userId);

		//createUserOrdersTables(userId, orders);
		$.post('/getUserWithOrders', {'user_id': userId}, function(result){

			console.log(result);
			var totalOrders = $.merge($.merge($.merge([], result.query.active_order_list),  result.query.pending_order_list), result.query.completed_order_list);
			console.log(totalOrders);

			loadTableData('orders-table-all', totalOrders, 2, userOrderTableColumns, userOrderTableColumnDefs);//all
			loadTableData('orders-table-current', result.query.active_order_list, 2, userOrderTableColumns, userOrderTableColumnDefs);//current
			//loadTableData('orders-table-pending', result.query[0].pending_order_list, 2, userOrderTableColumns, userOrderTableColumnDefs);//pending
			loadTableData('orders-table-completed', result.query.completed_order_list, 2, userOrderTableColumns, userOrderTableColumnDefs);//completed

			$('#orders-table-all-div').css('display', 'block');

			//Initiate table switching functions
			$('#user-orders-table-button-group label').click(function() {
			    
			    var str = $(this).text().replace(/\s+/g, '');
			    if(str == 'All'){
			    	//console.log($(this).text());
		    		$('#orders-table-all-div').css('display', 'block');
		    		$('#orders-table-current-div').css('display', 'none');
		    		$('#orders-table-completed-div').css('display', 'none');
			    }
			    else if(str == 'Current'){
			    	//onsole.log($(this).text());
			    	$('#orders-table-all-div').css('display', 'none');
		    		$('#orders-table-current-div').css('display', 'block');
		    		$('#orders-table-completed-div').css('display', 'none');
			    }
			    else if(str == 'Completed'){
			    	//console.log($(this).text());
			    	$('#orders-table-all-div').css('display', 'none');
		    		$('#orders-table-current-div').css('display', 'none');
		    		$('#orders-table-completed-div').css('display', 'block');
			    }
			});

			$('.dataTable').each(function(){
				$(this).wrap('<div class="scrollStyle" />');
			});

			//Generate data for completed orders completion rate chart
			var completedOrders = function(){

				var com = [];

				for(var x=0; x<result.query.completed_order_list.length; x++){
					if((result.query.completed_order_list)[x].order_completed_date != null && (result.query.completed_order_list)[x].order_completed_date != ''){
						//com.push(new Completed(userId, orders[x].id, randomDate(new Date(2014, 0, 1), new Date()), ((Math.random() *10 )+"").substring(0,5)));
						com.push(new Completed((result.query.completed_order_list)[x].order_id, (result.query.completed_order_list)[x].order_received_date, (result.query.completed_order_list)[x].order_completed_date));
					}
				}
				return com;
			}();

			//Fill completed orders time chart
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

			//Chart for orders completed each month
			var monthlyData = function(){

				var com = [
					{ month: dateToYearMonth(Date.now()), completed: 0 },
				    { month: dateToYearMonth(subtractMonth(Date.now(), 1)), completed: 0 },
				    { month: dateToYearMonth(subtractMonth(Date.now(), 2)), completed: 0 },
			    	{ month: dateToYearMonth(subtractMonth(Date.now(), 3)), completed: 0 },
			    	{ month: dateToYearMonth(subtractMonth(Date.now(), 4)), completed: 0 }
				];

				for(var x=0; x<result.query.completed_order_list.length; x++){
					for(var y=0; y<com.length; y++){
						if((result.query.completed_order_list)[x].order_completed_date != null && (result.query.completed_order_list)[x].order_completed_date != ''
							&& dateToYearMonth(result.query.completed_order_list)[x].order_completed_date==com[y].month){
							console.log('here');
							com[y].completed++;
						}
					}
				}

				return com;
			}();

			new Morris.Line({
			  	// ID of the element in which to draw the chart.
			  	element: 'appraiser-monthly-completion-chart',
			  	// Chart data records -- each entry in this array corresponds to a point on
			  	// the chart.
			  	data: monthlyData,
			  	// The name of the data record attribute that contains x-values.
			  	xkey: 'month',
			  	// A list of names of data record attributes that contain y-values.
			  	ykeys: ['completed'],
			  	// Labels for the ykeys -- will be displayed when you hover over the
			  	// chart.
			  	labels: ['Completed']
			});

			//Add user information
			$('#user-email').val(result.query.user_id);
			$('#user-password').val(result.query.password);
			$('#user-first-name').val(result.query.firstName);
			$('#user-last-name').val(result.query.lastName);
			//$('#user-phone-number').val(users[x].phoneNumber);
			$('#user-address-one').val(result.query.user_address.address_line_1);
			$('#user-address-two').val(result.query.user_address.address_line_2);
			$('#user-state').val(result.query.user_address.address_state);
			$('#user-city').val(result.query.user_address.address_city);
			$('#user-zip').val(result.query.user_address.address_zip);

		}).fail(function(){
			console.log('Error getting AllUsers');
		}).done(function(){
			hidePreloader();
		});
	});
}
function loadOrdersHome(){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./orders-home.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		$.post('/getAllOrders', function(result){

			console.log(result);
			loadTableData('orders-table', result.query, 2, orderTableColumns, orderTableColumnDefs);
			$('.dataTable').each(function(){
				$(this).wrap('<div class="scrollStyle" />');
			});
		}).done(function(){
			hidePreloader();
		}).fail(function(){
			console.log('Error retreiving AllOrders');
		});

		$.post('/getOrdersCompletedPerAppraiser', function(result){

			console.log(result);
			new Morris.Donut({
			  	element: 'orders-completed-per-appraiser',
			  	data: result.query,
		    	colors: chartColors
		  	});
		}).done(function(){
			hidePreloader();
		}).fail(function(){
			console.log('Error retreiving OrdersCompletedPerAppraiser');
		});

		$.post('/getCompletedPendingActiveOrderCount', function(result){

			console.log(result);
			new Morris.Donut({
			  	element: 'orders-completed',
			  	data: result.query,
		    	colors: chartColors
		  	});
		}).done(function(){
			hidePreloader();
		}).fail(function(){
			console.log('Error retreiving CompletedPendingActiveOrderCount');
		});
	  	
	  	hidePreloader();
	});
}
function loadOrdersIndividual(orderId){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./orders-individual.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		//TODO
		$('#order-number').html(orderId);
		$.post('/getOrderById', {"order_id" : orderId}, function(result){
			if(result.query == "failed"){
				console.log('getOrderById failed');
			}
			else{
				console.log(result);
				$('#order-assigned-appraiser').val('Placeholder');
				$('#order-customer').val('Placeholder');
				$('#order-email').val('Placeholder');
				//$('#order-phone-number').val('Placeholder');
				$('#order-address-one').val(result.query.address_id.address_line_1);
				$('#order-address-two').val(result.query.address_id.address_line_2);
				$('#order-city').val(result.query.address_id.city);
				$('#order-state').val(result.query.address_id.state);
				$('#order-zip').val(result.query.address_id.zip);
			}
			
		}).done(function(){
			hidePreloader();
		}).fail(function(){
			console.log('Error retreiving OrderByID');
		});

		hidePreloader();
	});
}
function loadTasks(){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./tasks.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		new Morris.Donut({
		  	element: 'pending-tasks-chart',
		  	data: [
		    	{ label: 'User Applications', value: 30 },
			    { label: 'Review Orders', value: 10 },
			    { label: 'Meetings', value: 25 },
			    { label: 'Support', value: 82 }
		  	],
	    	colors: chartColors
	  	});
	  	new Morris.Line({
		  	element: 'weekly-task-completion-chart',
		  	data: [
			    { date: '2014-01-21', completed: 2 },
			    { date: '2014-01-22', completed: 5 },
			    { date: '2014-01-23', completed: 9 },
		    	{ date: '2014-01-24', completed: 1 },
		    	{ date: '2014-01-25', completed: 7 },
		    	{ date: '2014-01-26', completed: 3 },
		    	{ date: '2014-01-27', completed: 13 },
		  	],
		  	xkey: 'date',
		  	ykeys: ['completed'],
		  	labels: ['Completed'],
		  	xLabelFormat: function (x) { 
		  		var days = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];

		  		return days[x.getDay()]; 
		  	}
		});
		loadTableData('tasks-table', harveyTasks, 2, tasksTableColumns, tasksTableColumnDefs);
		$('.dataTable').each(function(){

			$(this).wrap('<div class="scrollStyle" />');
		});

		hidePreloader();
	});
}
function loadCalendar(){

	//TODO ajax call for specific calendar
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./calendar.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		initCalendar();

		hidePreloader();
	});
}
function loadSupport(){

	//TODO ajax calls for dynamic content
	showPreloader();
	$('#content-location').empty();
	$('#content-location').load('./support.html', function(response){

		if(response == 'No Session'){
			document.location.href = '/';
		}

		//TODO
		hidePreloader();
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
function Completed(orderId, dateReceived, dateCompleted){
	this.orderId = orderId;
	this.dateReceived = new Date(dateReceived);
	this.dateCompleted = new Date(dateCompleted);
	this.timeTaken = (Math.abs(this.dateCompleted.getTime() - this.dateReceived.getTime())) / (1000*60*60*60);
	console.log(this.timeTaken);
}
function Task(id, type, description, loadFunction, dateAssigned, dateCompleted){
	this.id = id;
	this.type = type;
	this.description = description;
	this.loadFunction = loadFunction;
	this.dateAssigned = dateAssigned;
	this.dateCompleted = dateCompleted
}
////////////////////////////////////////////////

//Dummy user data
var users = [
	new User(800745, 'Evan', 'Pearl', [], 'ep@gmail.com', '123-456-7890', '123 Address', 'Apt 342', 'Charlotte', 'NC', 28262),
	new User(800782, 'Steve', 'Harvey', [], 's.harvey@gmail.com', '951-752-0021', '54 Address', '', 'Albuquerque', 'NM', 90210),
	new User(801537, 'Howard', 'Stern', [], 'hstern@gmail.com', '985-895-5663', '3 Address', '', 'Charlotte', 'NC', 28262),
];

var userTableColumns = [
	    		{data: "user_id"},
	    		{data: "firstName"},
	    		{data: "lastName"},
	    		{data: "user_role"},
				{data: "active_order_list.length"},
];
var userTableColumnDefs = [
		    	{ "title": "ID", "targets": 0 },
		    	{ "title": "First Name", "targets": 1 },
		    	{ "title": "Last Name", "targets": 2 },
		    	{ "title": "Role", "targets": 3 },
		    	{ "title": "Active Order Count", "targets": 4 },
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
	{data: "order_id"},
	{data: "order_assigned_to.order_current_appraiser.lastName"},
	{data: "appraisee"},
	{data: "order_party_name"},
	{data: "order_property_detail.address_id.address_city"},
	{data: "order_property_detail.address_id.address_state"},
	{data: "order_property_detail.address_id.address_zip"},
	{data: "order_status_current"}
];
var orderTableColumnDefs = [
	{ "title": "ID", "targets": 0 },
	{ "title": "Appraiser", "targets": 1 },
	{ "title": "Appraisee", "targets": 2 },
	{ "title": "Company", "targets": 3 },
	{ "title": "City", "targets": 4 },
	{ "title": "State", "targets": 5 },
	{ "title": "Zip", "targets": 6 },
	{ "title": "Status", "targets": 7 },
];

var userOrderTableColumns = [
	{data: "order_id"},
	{data: "order_status_current"}
];
var userOrderTableColumnDefs = [
	{ "title": "ID", "targets": 0 },
	{ "title": "Status", "targets": 1 },
];

users[0].orders = ([orders[1], orders[6], orders[9]]);
users[1].orders = ([orders[0], orders[2], orders[3], orders[4], orders[8]]);
users[2].orders = ([orders[5], orders[7]]);

var harveyTasks = [
	new Task(1001, 'User Application', 'stv@gmail.com Application', 'loadUsersIndividual(800745)', dateToMMDDYYYY(new Date()), ''),
	new Task(1002, 'User Application', 'fed@tcs.com Application', 'loadUsersIndividual(800745)', dateToMMDDYYYY(new Date()), ''),
	new Task(1003, 'Meeting', 'Fri, Dec. 13 with Gary', 'loadCalendar()', dateToMMDDYYYY(new Date()), ''),
	new Task(1004, 'Review Order', '103 Some Street by Gary', 'loadOrdersIndividual(100002)', dateToMMDDYYYY(new Date()), ''),
	new Task(1005, 'Review Order', '43 Another Street by Alice', 'loadOrdersIndividual(100002)', dateToMMDDYYYY(new Date()), ''),
];
var tasksTableColumns = [
	{data: "id"},
	{data: "type"},
	{data: "description"},
	{data: "dateAssigned"}
];
var tasksTableColumnDefs = [
	{ "title": "ID", "targets": 0 },
	{ "title": "Type", "targets": 1 },
	{ "title": "Description", "targets": 2 },
	{ "title": "Date Assigned", "targets": 3 },
];
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
 	 	"sFilterInput": "form-control input-sm",
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
	else if(tableId == 'tasks-table'){
		oTable.$('tr').click( function () {
	    	
			eval((oTable.fnGetData(this)).loadFunction);
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
	//original border color #e5e5e5

	$('#user-new-email').css('border', '1px solid #e5e5e5');
	if(!validateEmail($('#user-new-email').val())){
		validated = false;
		$('#user-new-email').css('border', '1px solid tomato');
	}
	$('#user-new-confirm-email').css('border', '1px solid #e5e5e5');
	if(($('#user-new-email').val())!=($('#user-new-confirm-email').val())){
		validated = false;
		$('#user-new-confirm-email').css('border', '1px solid tomato');
	}
	$('#user-new-first-name').css('border', '1px solid #e5e5e5');
	if(!validateTextFilled($('#user-new-first-name').val())){
		validated = false;
		$('#user-new-first-name').css('border', '1px solid tomato');
	}
	$('#user-new-last-name').css('border', '1px solid #e5e5e5');
	if(!validateTextFilled($('#user-new-last-name').val())){
		validated = false;
		$('#user-new-last-name').css('border', '1px solid tomato');
	}
	$('#user-new-address-line-one').css('border', '1px solid #e5e5e5');
	if(!validateTextFilled($('#user-new-address-line-one').val())){
		validated = false;
		$('#new-user-address-line-one').css('border', '1px solid tomato');
	}
	/*if(!validateTextFilled($('#user-new-address-line-two').val())){
		validated = false;
		$('#user-new-address-line-two').css('border', '1px solid tomato');
	}*/
	$('#user-new-city').css('border', '1px solid #e5e5e5');
	if(!validateTextFilled($('#user-new-city').val())){
		validated = false;
		$('#user-new-city').css('border', '1px solid tomato');
	}
	$('#user-new-state').css('border', '1px solid #e5e5e5');
	if(!validateTextFilled($('#user-new-state').val())){
		validated = false;
		$('#user-new-state').css('border', '1px solid tomato');
	}
	$('#user-new-zip').css('border', '1px solid #e5e5e5');
	if(!validateZipCode($('#user-new-zip').val())){
		validated = false;
		$('#user-new-zip').css('border', '1px solid tomato');
	}
	$('#user-new-role').css('border', '1px solid #e5e5e5');
	if(!validateTextFilled($('#user-new-role').val())){
		validated = false;
		$('#user-new-role').css('border', '1px solid tomato');
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

//Element manipulation
function changeTab(element){
	$('.main-nav-item.active').removeClass('active');
	$(element).addClass('active');
}
function enableDisabled(groupName){
	$('.'+groupName).removeAttr("disabled");
}
function disableInput(groupName){
	$('.'+groupName).attr("disabled", "disabled");
}
function loadSelectRoles(){

	//$("#role").html('').append("<option>Loading options</option>");
	$("#role").html('').append(''+
		'<option>Administrator</option>'+
		'<option>Appraiser</option>'+
	'');
    /*$.ajax({ //TODO ajax call to load roles
        url: 'http://www.your_server.com/your_page',
        success: function (data) {
            $("#role").empty().append(data); //your data being: <option>1</option> <option>2</option> <option>3</option><option>4</option>
        }
    });*/
	//$("#role").selectpicker('refresh');
	$("#role").hide().show();
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
	console.log($('#user-new-email').val());
	if(validateNewUser()){
		insertUser($('#user-new-email').val(), $('#user-new-first-name').val(), $('#user-new-last-name').val(), 
				$('#user-new-address-line-one').val(), $('#user-new-address-line-two').val(), $('#user-new-city').val(), 
				$('#user-new-state').val(), $('#user-new-zip').val(), $("#user-new-role option:selected").text(),
				'loadUsersHome()');
		$('#create-user-modal').modal('hide');
		return true;
	}
}
function createOrder(){

	//TODO
}
function dateToMMDDYYYY(date){//Convert Date() to dd/mm/yyyy

	var datetime = (date.getMonth()+1) + "/"
					+ date.getDate()  + "/" 
					+ date.getFullYear();
	/*datetime to Date()
	from = $("#datepicker").val().split("-");
	f = new Date(from[2], from[1] - 1, from[0]);*/

	return datetime;
}

function subtractMonth(date, months){

	var now = new Date(date);

	if(now.getMonth()-months < 0){
		now.setFullYear(now.getFullYear()-1);
	}

	now.setMonth((now.getMonth()+(12-months))%12);

	return now;
}

function dateToYearMonth(time){

	var time = new Date(time);

	return ''+time.getFullYear()+'-'+(time.getMonth()+1);
}
///////////////////////////////////////////////////////////////////////////////

//Animation functions
function badLoginShake(elementId, wrapperId){

    var heading = $('#'+elementId).clone().removeClass('form-shake');
    $('#'+elementId).remove();
    heading.insertAfter('#h1-title');
    $('#'+elementId).addClass('form-shake');

    $('form').on('submit', function(e){
		e.preventDefault();
      	$.post($(this).attr('action'), $(this).serialize(), function(response){

      		//console.log(response);
            login(response);

      	},'json');
      	return false;
   	});
}
function growLoginToSignup(){

	$('#login-page-form').fadeOut('200', function(){

		$('#new-user-page-form').fadeIn('200');

	});
}
function shrinkSignupToLogin(){
	
	$('#new-user-page-form').fadeOut('200', function(){

		$('#login-page-form').fadeIn('200');

	});
}
function showPreloader(){

	$('body').append(''+
		'<div id="preloader-wrapper">'+
			'<span style="width:100%; height:100%; display:inline-block;">'+
		    	'<img id="preloader" src="../img/preloader.GIF" />'+
	    	'</span>'+
		'</div>'+
	'');
	$('#preloader-wrapper').fadeIn(150);
}
function hidePreloader(){

	$('#preloader-wrapper').fadeOut(300, function(){
		$('#preloader-wrapper').remove();
	});
}
/////////////////////////////////////////////////////////////////////////////////

//DB Functions
function insertUser(email, firstName, lastName, address1, address2, city, state, zip, role, cb){

	$.post('/insertNewUser', {'email':email, 'firstName':firstName, 'lastName':lastName, 'addressLine1':address1, 
			'addressLine2':address2, 'city':city, 'state':state, 'zip':zip, 'role':role}, function(response){

		console.log(response);
		eval(cb);
	}, 'json').fail(function(){
		console.log('Error on insertUser');
	});
}
function updateUserInfo(username, email, password, firstName, lastName){

	$.post('/updateUserInfo', {'username':username, 'email':email, 'password':password, 'firstName':firstName, 'lastName':lastName}, function(response){

		console.log('updateUserInfo successful');
		console.log(response);
	}, 'json').fail(function(){
		console.log('Error on updateUserInfo');
	});
}
function getAllAddresses(){

	$.post('/getAllAddresses', function(response){
		console.log(response);
	});
}
/////////////////////////////////////////////////////////////////////////////////

//DHTMLXSchedular Calendar 
var calendarJSON = [
	{ start_date: "2015-01-30 09:00", end_date: "2015-01-30 12:00", text:"Task A-12458", section_id:1},
	{ start_date: "2015-01-30 10:00", end_date: "2015-01-30 16:00", text:"Task A-89411", section_id:1},
	{ start_date: "2015-01-30 10:00", end_date: "2015-01-30 14:00", text:"Task A-64168", section_id:1},
	{ start_date: "2015-01-30 16:00", end_date: "2015-01-30 17:00", text:"Task A-46598", section_id:1},

	{ start_date: "2015-01-30 12:00", end_date: "2015-01-30 20:00", text:"Task B-48865", section_id:2},
	{ start_date: "2015-01-30 14:00", end_date: "2015-01-30 16:00", text:"Task B-44864", section_id:2},
	{ start_date: "2015-01-30 16:30", end_date: "2015-01-30 18:00", text:"Task B-46558", section_id:2},
	{ start_date: "2015-01-30 18:30", end_date: "2015-01-30 20:00", text:"Task B-45564", section_id:2},

	{ start_date: "2015-01-30 08:00", end_date: "2015-01-30 12:00", text:"Task C-32421", section_id:3},
	{ start_date: "2015-01-30 14:30", end_date: "2015-01-30 16:45", text:"Task C-14244", section_id:3},

	{ start_date: "2015-01-30 09:20", end_date: "2015-01-30 12:20", text:"Task D-52688", section_id:4},
	{ start_date: "2015-01-30 11:40", end_date: "2015-01-30 16:30", text:"Task D-46588", section_id:4},
	{ start_date: "2015-01-30 12:00", end_date: "2015-01-30 18:00", text:"Task D-12458", section_id:4},

	{ start_date: "2015-01-31 12:00", end_date: "2015-01-31 18:00", text:"Task D-12458", section_id:5}
];
function initCalendar(){
	scheduler.config.xml_date = "%Y-%m-%d %H:%i";

	scheduler.config.first_hour = 8;
	scheduler.config.last_hour = 22;
	scheduler.config.limit_time_select = true;


	scheduler.init('scheduler_here', new Date(), "week");
	scheduler.parse(calendarJSON,"json");
	/*
	$('save').click(function(){
		//TODO ajax call to load json calendar to user
		scheduler.toJSON();
	});*/
}
/////////////////////////////////////////////////////////////////////////////////

//REST API V2 Test Functions
var currentApiKey = '';

function v2Authenticate(){

	$.post('/api/v2/authenticate', {user_id: '123', password: 'test'}, function(result){

		console.log(result);
		currentApiKey = result.query;
	})
	.fail(function(err){

		console.log('authentication failed');
		console.log(err);
	})
	.done(function(){

		console.log('AUTHENTICATION DONE');
	});
}
function v2DeleteKey(){

	$.post('/api/v2/destroyApiKey/123', function(result){

		console.log(result);
		currentApiKey = '';
	})
	.fail(function(err){

		console.log('destroy failed');
		console.log(err);
	})
	.done(function(){

		console.log('DESTROY DONE');
	});
}
function v2GetUsers(){

	$.get('/api/v2/users', {api_key: currentApiKey}, function(result){

		console.log(result);
	})
	.fail(function(err){

		console.log('getUsers failed');
		console.log(err);
	})
	.done(function(){

		console.log('GET USERS DONE');
	});
}
function v2GetUser(){

	$.get('/api/v2/users/123', {api_key: currentApiKey}, function(result){

		console.log(result);
	})
	.fail(function(err){

		console.log('getUser failed');
		console.log(err);
	})
	.done(function(){

		console.log('GET USER DONE');
	});
}
function v2GetAddresses(){

	$.get('/api/v2/addresses', {api_key: currentApiKey}, function(result){

		console.log(result);
	})
	.fail(function(err){

		console.log('getAddresses failed');
		console.log(err);
	})
	.done(function(){

		console.log('GET ADDRESSES DONE');
	});
}
function v2CreateAddress(){

	$.post('/api/v2/addresses', 
		{
			api_key: currentApiKey,
			address_line_1: 'Another Test Address Line One',
          	address_line_2: 'Line Two',
          	city: 'Charlotte',
          	state: 'NC',
          	zip: '28262',
          	county: 'Mecklenburg',
          	lat: '',
          	long: ''
		}, function(result){

		console.log(result);
	})
	.fail(function(err){

		console.log('createAddresses failed');
		console.log(err);
	})
	.done(function(){

		console.log('CREATE ADDRESSES DONE');
	});
}
function v2GetAddress(){

	$.get('/api/v2/addresses/550c71068c440514226635d0', {api_key: currentApiKey}, function(result){

		console.log(result);
	})
	.fail(function(err){

		console.log('getAddress failed');
		console.log(err);
	})
	.done(function(){

		console.log('GET ADDRESS DONE');
	});
}
////////////////////////////////////////////////////////////////////////////////