import React from 'react'

var hourMap = [
    "12am",
    "1am",
    "2am",
    "3am",
    "4am",
    "5am",
    "6am",
    "7am",
    "8am",
    "9am",
    "10am",
    "11am",
    "12am",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm"
];
var dayMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

function initializeWorkHours(){
    var work_hours =new Array(23);
    for(var i=0; i<23; i++){
        work_hours[i] = new Array(6);
        work_hours[i][0]={"day": "Sunday", "isAvailable": false};
        work_hours[i][1]={"day": "Monday", "isAvailable": false};
        work_hours[i][2]={"day": "Tuesday", "isAvailable": false};
        work_hours[i][3]={"day": "Wednesday", "isAvailable": false};
        work_hours[i][4]={"day": "Thursday", "isAvailable": false};
        work_hours[i][5]={"day": "Friday", "isAvailable": false};

    }
    return work_hours;
}
function setWorkHour(i,j, work_hours){
    work_hours[i][j].isAvailable = (checkAvailability(i,j, work_hours))? false: true;
    return work_hours;
}
function checkAvailability(i,j,work_hours){
    return work_hours[i][j].isAvailable;
}
function getDay(i,j,work_hours) {
    return work_hours[i][j].day;
}
function createWorkableShifts(work_hours){
    var start_time = -1;
    var end_time=0;
    var workable_shifts = [];
    for(var j=0; j<6; j++){
        start_time=-1;
        end_time=0;
        for(var i = 0; i<23; i++){
            if(start_time==-1 && checkAvailability(i,j,work_hours)==true){
                start_time=i;
            } else if(start_time!=-1 && (checkAvailability(i,j,work_hours)==true && checkAvailability(i+1,j,work_hours)==false)){
                end_time=i+1;
                workable_shifts.push({
                    "name": Profile.name,
                    "gender": Profile.gender,
                    "experienceLevel": Profile.experience_level,
                    "hoursCapacity": Profile.hours_capacity,
                    "weekStartDate": Profile.week_start_date,
                    "day":getDay(i,j,work_hours),
                    "start":start_time,
                    "end": end_time
                });
                start_time=-1;
                end_time=0;
            } else if(start_time!=-1 && (checkAvailability(i,j,work_hours)==false && checkAvailability(i-1,j,work_hours)==true)){
                end_time=i;
                workable_shifts.push({
                    "name": Profile.name,
                    "gender": Profile.gender,
                    "experienceLevel": Profile.experience_level,
                    "hoursCapacity": Profile.hours_capacity,
                    "weekStartDate": Profile.week_start_date,
                    "day":getDay(i,j,work_hours),
                    "start":start_time,
                    "end": end_time
                });
                start_time=-1;
                end_time=0;
            }
        }
    }
    return workable_shifts;
}
var workhours = initializeWorkHours();
var week_start_date = getNextSundayDate().toLocaleDateString();
function initializeWeek(){
    var num_people =new Array(23);
    for(var i=0; i<23; i++){
        num_people[i] = new Array(6);
        num_people[i][0]={"day": "Sun", "numPeople": 0, "hour": i, "weekStartDate": week_start_date};
        num_people[i][1]={"day": "Mon", "numPeople": 0, "hour": i, "weekStartDate": week_start_date};
        num_people[i][2]={"day": "Tue", "numPeople": 0, "hour": i, "weekStartDate": week_start_date};
        num_people[i][3]={"day": "Wed", "numPeople": 0, "hour": i, "weekStartDate": week_start_date};
        num_people[i][4]={"day": "Thu", "numPeople": 0, "hour": i, "weekStartDate": week_start_date};
        num_people[i][5]={"day": "Fri", "numPeople": 0, "hour": i, "weekStartDate": week_start_date};
    }
    return num_people;
}
function addPerson(hour,week, num_people){
    num_people[hour][week].numPeople+=1;
    return num_people;
}
function removePerson(hour,week, num_people){
    if(getNumber(hour,week,num_people)>0)
        num_people[hour][week].numPeople-=1;
    return num_people;
}
function getNumber(hour, week, num_people){
    return num_people[hour][week].numPeople;
}
function getData(hour,week,num_people){
    return num_people[hour][week];
}
var numpeople = initializeWeek();


var Profile = {
    "name":"COMP 110 LA",
	"gender": "male",
	"experience_level": 3,
	"hours_capacity": 4,
	"week_start_date":getNextSundayDate().toLocaleDateString(),
};

var WeekSetterDataPreview = React.createClass({
    getInitialState: function(){
        return {
            borderStyle: 'solid',
            fontSize: 20,
            height: 400,
            width: 500,
            textAlign: 'center',
            backgroundColor:'aqua',
            color: 'black',
            float: 'right'
        };
    },
    handleClick: function(){
        console.log("hour",this.props.dataObj.hour);
        console.log("day", this.props.dataObj.day);
        console.log(this.props.dataObj2[this.props.dataObj.hour][this.props.dataObj.day].numPeople);
    },
   render: function(){
       return (
        <div style={this.state}>
           WorkSetterDataPreview
           <br></br>
           Day: {dayMap[this.props.dataObj.day]}
            <br></br>
            Hour: {hourMap[this.props.dataObj.hour]}
           <br></br>
           <button onClick={()=>this.props.handleSubtract(this.props.dataObj.hour,this.props.dataObj.day)}>-</button>
            Number: {this.props.dataObj2[this.props.dataObj.hour][this.props.dataObj.day].numPeople}
           <button onClick={()=>this.props.handleAdd(this.props.dataObj.hour,this.props.dataObj.day)}> + </button>
            <button onClick={this.handleClick}>Check</button>
            <h5>Week_Start_Date: {getNextSundayDate().toLocaleDateString()}</h5>
        </div>
       );
   }
});


var WeekSetterTableData = React.createClass({
    getInitialState: function(){
        return {
            borderStyle: 'solid',
            fontSize: 10,
            height: 40,
            width: 50,
            textAlign: 'center',
            backgroundColor:'#00bcec',
            color: 'black'
        };
    },
    handleClick: function(props){
        this.setState({
            backgroundColor: (this.state.backgroundColor=='#FFB100') ? '#00bcec' : '#FFB100'
        });
        this.props.handleClick(props.hour, props.day);
    },
    handleAdd: function(i,j){
        this.props.handleAdd(i,j);
    },
    handleSubtract: function(i,j){
        this.props.handleSubtract(i,j);
    },
    render: function(){
        return(
                     <td onClick={()=>this.handleClick(this.props)} style = {this.state}>
                        {dayMap[this.props.day]}
                        <br></br>
                        {hourMap[this.props.hour]}
                        <br></br>
                        {this.props.numObj[this.props.hour][this.props.day].numPeople}
                    </td>
        );
    }
});

//This:
//<td onClick={()=>this.props.handleClick(this.state.id)} style = {this.state}>
//is just syntactic sugar for this:
//<td onClick={this.props.handleClick.bind(this,this.state.id)} style = {this.state}>

var WeekSetterRow = React.createClass({
    render: function(){
        return(
            <tr>
                <WeekSetterTableData handleSubtract={this.props.handleSubtract} handleAdd={this.props.handleAdd} handleClick={this.props.handleClick} day = {0} hour={this.props.hour} numObj={this.props.numObj} />

                <WeekSetterTableData handleSubtract={this.props.handleSubtract} handleAdd={this.props.handleAdd} handleClick={this.props.handleClick} day = {1} hour={this.props.hour} numObj={this.props.numObj} />

                <WeekSetterTableData handleSubtract={this.props.handleSubtract} handleAdd={this.props.handleAdd} handleClick={this.props.handleClick} day = {2} hour={this.props.hour} numObj={this.props.numObj} />

                <WeekSetterTableData handleSubtract={this.props.handleSubtract} handleAdd={this.props.handleAdd} handleClick={this.props.handleClick} day = {3} hour={this.props.hour} numObj={this.props.numObj} />

                <WeekSetterTableData handleSubtract={this.props.handleSubtract} handleAdd={this.props.handleAdd} handleClick={this.props.handleClick} day = {4} hour={this.props.hour} numObj={this.props.numObj} />

                <WeekSetterTableData handleSubtract={this.props.handleSubtract} handleAdd={this.props.handleAdd} handleClick={this.props.handleClick} day = {5} hour={this.props.hour} numObj={this.props.numObj} />
            </tr>
        );
    }
});


var WeekSetterTable = React.createClass({
    getInitialState: function(){
        return {
            num_people: numpeople,
            current_data: {hour:'', day:''}
        };
    },
    componentWillMount(){
//        workhours = initializeWorkHours();
        this.setState({num_people: numpeople});
        this.setState({current_data: {hour:8, day:0}});
    },
    handleTDClick: function(i, j){
//        numpeople = setWorkHour(i,j, numpeople);
//        this.setState({num_people: numpeople});
        this.setState({current_data: {hour:i, day:j}})
        console.log(i + " " + j);
    },
    handleAdd: function(i,j){
        addPerson(i,j, numpeople);
        this.setState({num_people: numpeople});
    },
    handleSubtract: function(i,j){
        removePerson(i,j, numpeople);
        this.setState({num_people: numpeople});
    },
    handleClick : function(){
//        var week = createWorkableShifts(this.state.num_people);
        var reduced = [].concat.apply([], numpeople);
        console.log(numpeople);
        reduced = JSON.stringify(reduced);
        //reduced = reduced.toString();
        console.log(reduced);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {

        };
      xhttp.open("POST", "/api/master", true);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(reduced);


    },
    render: function(){
        return(
            <div>
            <WeekSetterDataPreview dataObj={this.state.current_data} dataObj2={this.state.num_people} handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} style={{float:"left"}}/>
                <div>
                <table>
                    <thead>
                        <th>Sun  </th>
                        <th>Mon  </th>
                        <th>Tue  </th>
                        <th>Wed  </th>
                        <th>Thu  </th>
                        <th>Fri  </th>
                    </thead>
                    <WeekSetterRow  handleClick={this.handleTDClick} hour={8} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={9} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={10} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={11} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={12} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={13} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={14} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={15} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={16} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={17} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={18} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={19} numObj={this.state.num_people} />

                    <WeekSetterRow handleSubtract={this.handleSubtract} handleAdd={this.handleAdd} handleClick={this.handleTDClick} hour={20} numObj={this.state.num_people} />
                </table>
                </div>
                <button style={{backgroundColor: '#4CAF50',
                                color: 'white',
                                width: 100,
                                textAlign: 'center',
                                textDecoration: 'none',
                                display: 'inline-block',
                                fontSize: 16,
                                float: 'right'}} id= "button" onClick={this.handleClick}>Submit</button>
            </div>
        );
    }
});

var App = React.createClass({
    render: function(){
        return(
            <div>
                <WeekSetterTable/>
            </div>
        );
    }
});

module.exports = App;
