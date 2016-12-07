var ALL_SCHEDULES = null;
var DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function runKarenBot() {

	var username ="ervin";
	var password = "123";

	var date = "11-13-2016";
	// Copy appropriate JSON files from database
	$.ajax({
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		headers: {
			"Authorization": "Basic " + btoa(username + ":" + password)
		},
		type: 'GET',
		url: '/api/hoursetter/copytoJson/'+ date,
		dataType: 'text',
    	success: function() {
			$.getJSON('/api/master/copytoJson/'+date, function() {
				// Run KarenBot by issuing a GET request to the dropwizard server
				$.getJSON('/api/schedule/'+date, function(data) {
					// Post schedule to database
					$.ajax({
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						type: 'POST',
						url: '/api/people',
						data: JSON.stringify(data),
						dataType: 'json',
						success: function() {
							alert('Schedule successfully generated!');
							refreshSchedule();
						}
					});
				});
			});


		}
	});
}

function configureScheduler() {
	// Configure/initialize "scheduler" tool
	scheduler.config.first_hour = 10;
	scheduler.config.last_hour = 21;
  	scheduler.config.readonly = true;
	scheduler.config.drag_create = false;
	scheduler.config.drag_resize = false;
	scheduler.config.dblclick_create = false;
	scheduler.config.delay_render = 30;
	scheduler.config.select = false;
	scheduler.config.time_step = 60;
	scheduler.config.start_on_monday = false;
	scheduler.config.hour_date = "%g:%i%A";
	scheduler.init('scheduler_here', new Date(), "day");//Finds root of application
	scheduler.templates.event_bar_date = function(start,end,ev){
		return String.fromCharCode(8226) + " <b>" +
			scheduler.templates.event_date(start) + "</b> ";
	};
}

function filterMatch(worker_name, name_filter) {
	// Decide if the filter matches this worker name
	return worker_name.toLowerCase().indexOf(name_filter.toLowerCase()) != -1;
}

function constructWorkerData(worker_name, date, hour_ranges) {
	// Build JSON to be used by 'scheduler' for this worker
	var data = [];
	for (var i = 0; i < hour_ranges.length; i++) {
		var hour_range = hour_ranges[i];
		data.push({
			text: worker_name,
			start_date: date + ' ' + hour_range.start,
			end_date: date + ' ' + hour_range.end
		});
	}

	return data;
}

function renderDaySchedule(day, date, name_filter) {
	// Iterate over each worker scheduled for this day
	var workers = Object.keys(day || {});
	for (var i = 0; i < workers.length; i++) {
		// Filter by name
		var worker_name = workers[i];
		if (name_filter && ! filterMatch(worker_name, name_filter)) continue;

		// Render this worker's day in scheduler
		var hour_ranges = day[worker_name];
		var data = constructWorkerData(worker_name, date, hour_ranges);
		scheduler.parse(data, 'json');
	}
}

function renderWeekSchedule(week, weekStartDate, name_filter) {
	// Render each day in this week
	var start_date = new Date(weekStartDate);
	for (var i = 0; i < DAYS_OF_WEEK.length; i++) {
		// Compute date given weekStartDate and current day in loop
		var day = week[DAYS_OF_WEEK[i]];
		var date = new Date(start_date);
		date.setDate(date.getDate() + i);

		// Date is now a string!
		date = date.toLocaleDateString();
		renderDaySchedule(day, date, name_filter);
	}
}

function renderAllSchedules(name_filter) {
	// Do nothing if we have not loaded info from database yet
	if (ALL_SCHEDULES == null) return;

	// Reset scheduler
	scheduler.clearAll();

	// Render each week in this schedule
	var weekStartDates = Object.keys(ALL_SCHEDULES);
	for (var i = 0; i < weekStartDates.length; i++) {
		console.log(i);
		var weekStartDate = weekStartDates[i];
		var week = ALL_SCHEDULES[weekStartDate];
		renderWeekSchedule(week, weekStartDate, name_filter);
	}
}

function buildSchedulesFromDatabaseJSON(database_json) {
	ALL_SCHEDULES = {};
	for (var i = 0; i < database_json.length; i++) {
		var row = database_json[i];
		var weekStartDate = row.weekStartDate;
		var day = row.day;
		var name = row.name;
		var start = row.start;
		var end = row.end;

		if (! ALL_SCHEDULES[weekStartDate])
			ALL_SCHEDULES[weekStartDate] = {};
		if (! ALL_SCHEDULES[weekStartDate][day])
			ALL_SCHEDULES[weekStartDate][day] = {};
		if (! ALL_SCHEDULES[weekStartDate][day][name])
			ALL_SCHEDULES[weekStartDate][day][name] = [];
		ALL_SCHEDULES[weekStartDate][day][name].push({start: start, end: end});
	}
}

function refreshSchedule() {
	// Query database and build schedule
	$.getJSON('/api/people', function(data) {
		console.log(data);
		buildSchedulesFromDatabaseJSON(data);
		renderAllSchedules();
	});
}

$(document).ready(function() {
	// Filter schedule by name
	$('#filter_input').on('keyup paste', function() {
		renderAllSchedules($(this).val());
	});

	// Scheduler Setup
	configureScheduler();

	// Refresh schedule
	refreshSchedule();
});
