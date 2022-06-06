import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import studentData from "../dfmpc-student-placement-system.json";
import AppContext from "../AppContext";
import "../global.js";
import { NavigationContainer } from "@react-navigation/native";
import { firebase } from "../firebase";
import { parse } from "dotenv";

//constants
const buttonHeight = 50;
const textPos = buttonHeight / 2;
const SPACING = 20;
const AVATAR_SIZE = 70;
const ICON_SIZE = 80;
var dateToPass = "";
var specialty = "";
const RANGE = 12;
const initialDate = "2022-01-02";
var usersAgenda = {};
var firebaseFullScheduleList = {};
var agendaItemsList = {};

const CalendarView = () => {
  //use navigation
  const navigation = useNavigation();
  const myContext = useContext(AppContext);
  // Keeps track of selected date
  const [selectedDate, setSelectedDate] = useState(initialDate);

  //fetches record of schedules for all users
  const fullScheduleList = studentData.schedules;
  firebaseFullScheduleList = fetchFullFirebaseSchedule(authUserID);

  // Keeps track of schedule for user
  // User's agenda
  // What to do when day is pressed.
  const onDayPress = (day) => {
    console.log("Just ran the redundant function");
  };

  return (
    //render calendar
    <CalendarList
      // testID={testIDs.calendarList.CONTAINER}
      current={initialDate}
      pastScrollRange={3}
      futureScrollRange={RANGE}
      // renderHeader={renderCustomHeader}
      theme={theme}
      onDayPress={(day) => {
        setSelectedDate(day.dateString);
        dateToPass = day.dateString;
        console.log("dateToPass value before navigation:", dateToPass);
        navigation.navigate("DayAgenda");
      }}
      markingType="period"
      // * The generateSchedule method does way too much at once, really caused issues with understanding
      // I need to add back in the "created_at","updated_at", "hospital_id", "specialty_id" into the generate Schedule function then strip out only the marked dates format.
      markedDates={generateSchedule(fullScheduleList)} // now this function is the wrong format only to include: color, textColor and [startDate,endDate]
    />
  );
};

function fetchFullFirebaseSchedule(authUserID) {
  firebaseFullScheduleList = {};
  agendaItemsList = {};
  firebase
    .database()
    .ref("/schedules")
    .on("value", (snapshot) => {
      const userSchedules = snapshot.forEach(function (data) {
        //parse the schedule on firebase as an object
        const firebase_schedule_obj = snapshot.child(data.key).val();
        if (firebase_schedule_obj.student_id === authUserID) {
          // parse start date as dateString
          const schedule_edge_days = getDateFromWeekNum(
            firebase_schedule_obj.week_no,
            firebase_schedule_obj.specialty_duration
          );
          const schedule_item_list = getDaysInWeek(
            schedule_edge_days.startDate,
            firebase_schedule_obj.specialty_duration
          );
          // Now we have an array of dateString objects to use as the keys for our agenda items
          // Copy firebase_schedule_obj.properties to object and use schedule_item_list as key
          const firebase_agenda_items = schedule_item_list.forEach(function (
            item_date
          ) {
            // Packing the values into the student's schedule/agenda object
            // Extends firebase schedule object to include a dateString for starting date of specialty_duration
            firebase_schedule_obj.startingDate = schedule_item_list[0];
            // Create a function to determine item properties based on specialty duration and condition
            // Should return object containing "name", "height", "color", "Text color", "description"
            var firebase_agenda_meta_object = parseItemConditions(
              firebase_schedule_obj
            );
            firebase_schedule_obj.color = firebase_agenda_meta_object.color;
            // TODO: Create a function to determine text
            firebase_schedule_obj.textColor;

            agendaItemsList[item_date] = [firebase_schedule_obj];
          });
          console.log("Agenda Items list", agendaItemsList);
        }
      });
    });
  return firebaseFullScheduleList;
}

// generate marked dates [Too specific, needs to include relevant info for agenda ]\
// Refactored generateSchedule to include data it "threw away". Namely "student_id";,"created_at" ,"updated_at" ,"hospital_id","specialty_id"
// Returns objects with properties: "startingDate","color","textColor"
const generateSchedule = (fullScheduleList) => {
  let userSchedulesListObj = {};
  let userMarkedDatesListObj = {};
  // Iterate through entire list of schedules for all users
  // Skip immediately if it's a different user, else parse the database object
  fullScheduleList.forEach((scheduleItem) => {
    let scheduleObj = {};
    let markedDateObj = {};

    //only show scheduleItem for correct user
    if (scheduleItem.student_id != authUserID) {
      return {};
    }
    // Parse schedule item and and start dates
    // Returns: {endDate, startDate}
    const week = getDateFromWeekNum(
      scheduleItem.week_no,
      scheduleItem.specialty_duration
    );
    //Returns list of days which are in the scheduleItem period
    // Returns: Array<String>
    const daysInWeek = getDaysInWeek(
      week.startDate,
      scheduleItem.specialty_duration
    );

    var item_color_object = parseItemConditions(scheduleItem);

    // Iterates through each day and adds all the information to each schedule object/Agenda item
    // This is a very important section, used to pass all the information to the views
    daysInWeek.forEach((day, dayIndex) => {
      scheduleObj = {};
      markedDateObj = {};
      // Configuring Conditional Variables
      // Conditions for start dates
      if (dayIndex === 0) {
        scheduleObj.startingDate = true;
        scheduleObj.color = item_color_object.startcolor;
        scheduleObj.textColor = "white";
      }
      // Conditions for middle dates
      else if (dayIndex > 0 && dayIndex <= 5) {
        scheduleObj.color = item_color_object.middlecolor;
        scheduleObj.textColor = "white";
      }
      // Conditions for end dates
      else {
        scheduleObj.endingDay = true;
        scheduleObj.color = item_color_object.endcolor;
        scheduleObj.textColor = "white";
      }
      // Packing the values into the student's schedule/agenda object
      scheduleObj.student_id = scheduleItem.student_id;
      scheduleObj.created_at = scheduleItem.created_at;
      scheduleObj.updated_at = scheduleItem.updated_at;
      scheduleObj.hospital_id = scheduleItem.hospital_id;
      scheduleObj.specialty_id = scheduleItem.specialty_id;
      scheduleObj.startingDate;
      scheduleObj.color;
      scheduleObj.textColor;

      markedDateObj.startingDate = scheduleObj.startingDate;
      markedDateObj.color = scheduleObj.color;
      markedDateObj.textColor = scheduleObj.textColor;
      // creating the object and stashing it in the user's schedule object list

      userSchedulesListObj[day] = scheduleObj;
      userMarkedDatesListObj[day] = markedDateObj;
    }); // end of days i week
  }); // End of Schedule List
  // Saving a user's schedule as individual objects for each day higher up in scope.
  usersAgenda = userSchedulesListObj;
  // To test function
  // console.log("Should be more verbose than marked again", usersAgenda);
  // console.log("Should be a only 3 properties", userMarkedDatesListObj);
  return userMarkedDatesListObj;
};

// get days that the specialty will run over using specialty duration
const getDaysInWeek = (startDate, specialtyduration) => {
  let dates = [];
  for (let i = 0; i < specialtyduration; i++) {
    //takes current date and counts days prior to it for listing on calendar
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const formattedDate = currentDate.toISOString().split("T")[0];

    dates.push(formattedDate);
  }
  return dates;
};

// calculates correct week based on the weeknumber and specialty duration
const getDateFromWeekNum = (weekNum, specialtyduration, year = "2022") => {
  var daynum = weekNum * 7;
  if (weekNum * 7 > 30) {
    var month = (weekNum * 7) / 30 + 1;
  } else {
    var month = 0;
  }
  while (daynum > 30) {
    daynum = daynum - 30;
  }
  month = parseInt(month);
  var d = new Date(year, month, 1);
  const endDate = new Date(d.setDate(daynum));
  const startDate = new Date(year, month, 2);
  startDate.setDate(endDate.getDate() - specialtyduration);
  return { startDate: startDate, endDate: endDate };
};

const theme = {
  "stylesheet.calendar.header": {
    dayHeader: {
      fontWeight: "600",
      color: "#48BFE3",
    },
  },
  "stylesheet.day.basic": {
    today: {
      borderColor: "#48BFE3",
      borderWidth: 0.8,
    },
    todayText: {
      color: "#5390D9",
      fontWeight: "800",
    },
  },
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 20,
    flex: 1,
    borderColor: "rgba(36,50,61,1)",
    borderWidth: 5,
  },
});
function parseItemConditions(scheduleItem) {
  var color_conditions = parseColorConditions(scheduleItem);

  //Returns a vector of 4 rgba strings
  const agenda_meta_object = {};
  agenda_meta_object.color = color_conditions.color;
  agenda_meta_object.startcolor = color_conditions.startcolor;
  agenda_meta_object.middlecolor = color_conditions.middlecolor;
  agenda_meta_object.endcolor = color_conditions.endcolor;
  agenda_meta_object.name = name;
  agenda_meta_object.height = height;
  agenda_meta_object.description = description;
  agenda_meta_object.textColor = textColor;

  return agenda_meta_object;
}
function parseColorConditions() {
  //default colours. Can use a gradient of 2 colors, but I'm setting them all to the same color.
  var color = "rgba(80,206,187,0.5)";
  var startcolor = color;
  var middlecolor = startcolor;
  var endcolor = startcolor;
  var color_conditions = {};
  //change color based on specialty
  // These are the different options color options (no interpolation)
  if (scheduleItem.specialty_id == 2) {
    startcolor = "rgba(226,135,67,0.5)";
    middlecolor = "rgba(226,135,67,0.25)";
    endcolor = "rgba(226,135,67,0.5)";
  } else if (scheduleItem.specialty_id == 5) {
    startcolor = "rgba(8,181,245,0.5)";
    middlecolor = "rgba(8,181,245,0.25)";
    endcolor = "rgba(8,181,245,0.5)";
  } else if (scheduleItem.specialty_id == 6) {
    startcolor = "rgba(245,58,245,0.5)";
    middlecolor = "rgba(245,58,245,0.25)";
    endcolor = "rgba(245,58,245,0.5)";
  } else {
    startcolor = "rgba(80,206,187,0.5)";
    middlecolor = "rgba(80,206,187,0.25)";
    endcolor = "rgba(80,206,187,0.5)";
  }
  color_conditions.color = color;
  color_conditions.startcolor = startcolor;
  color_conditions.middlecolor = middlecolor;
  color_conditions.endDate = endDate;

  return color_conditions;
}

export default CalendarView;

export { dateToPass };
