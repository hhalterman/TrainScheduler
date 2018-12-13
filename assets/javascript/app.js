$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBe6NX5WwcmiubiQ_A8b8LxqKcUbVodwns",
        authDomain: "train-scheduler-2af9f.firebaseapp.com",
        databaseURL: "https://train-scheduler-2af9f.firebaseio.com",
        projectId: "train-scheduler-2af9f",
        storageBucket: "train-scheduler-2af9f.appspot.com",
        messagingSenderId: "442209050932"
    };
    firebase.initializeApp(config);

    // set database variable equal to database
    var database = firebase.database();

    // set initial variables
    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";



    // when the user clicks the submit button, set variables equal to the values entered
    $("button").on("click", function () {
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        frequency = $("#frequency").val().trim();

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

    })


    database.ref().orderByChild("dateAdded").limitToLast(15).on("child_added", function (snapshot) {
        var newTrain = snapshot.val()
        //frequency train runs
        var newFrequency = newTrain.frequency;

        // First time train leaves
        var firstTime = newTrain.firstTrainTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");


        // Current Time
        var currentTime = moment();

        // Difference between the times
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");


        // Time apart (remainder)
        var timeRemain = timeDiff % newFrequency;


        // Minute Until Train
        var tMinutesTillTrain = newFrequency - timeRemain;


        // Next Train time
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");


        $("tbody").append(`<tr class= 'tr'>
                        <td>${newTrain.trainName}</td>
                        <td>${newTrain.destination}</td>
                        <td>${newTrain.frequency}</td>
                        <td>${moment(nextTrain).format("hh:mm")}</td>
                        <td>${tMinutesTillTrain}</td>
                      </tr>`)



    })

});