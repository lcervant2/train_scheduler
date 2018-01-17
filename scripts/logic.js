/** Pseudo Code
When adding trains, administrators should be able to submit the following:
Train Name
Destination
First Train Time -- in military time
Frequency -- in minutes
Code this app to calculate when the next train will arrive; this should be relative to the current time.
Users from many different machines must be able to view same train times.
Styling and theme are completely up to you. **/



!(function($, moment, doc) {
   // CODING BELOW!!
  $(doc).ready(function() {
    console.log('document ready')
    // Firebase
    var config = {
      apiKey: "AIzaSyCv45zf_6vJ0BUVmk5zWYGCnc-EPWEoNAk",
      authDomain: "train-scheduler-9c999.firebaseapp.com",
      databaseURL: "https://train-scheduler-9c999.firebaseio.com",
      projectId: "train-scheduler-9c999",
      storageBucket: "train-scheduler-9c999.appspot.com",
      messagingSenderId: "778053360347"
    };
    firebase.initializeApp(config);

    $('#train-form').on('submit', function(e) {
      e.preventDefault()

      var inputs = $(this).find('input')
      var data = {}

      var fieldsDidNotPass = inputs.filter(function(i, el) {
        return !el.value.trim().length
      })

      if (fieldsDidNotPass.length) return console.log('Form did not pass')

      inputs.each(function(i, el) {
        data[el.name] = el.value.trim()
        el.value = ''
      })

      firebase.database().ref('departures').push(data)
    })

    firebase.database().ref('departures').on('child_added', function(snapshot) {
      addDepartureRow(snapshot.val())
    })

    function addDepartureRow(data) {
     // find when the next train is and minutes until next train
      var tfrequency = data.freq
      // pushed back 1 year to make sure it comes before current time
      var convertedDate = moment(data.ftrain, 'hh:mm').subtract(1, 'years')
      var trainTime = moment(convertedDate).format('HH:mm A')
      var currentTime = moment();
      // pushed back 1 year to make sure it comes before current time
      var firstTimeConverted = moment(trainTime,'hh:mm').subtract(1, 'years');
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      var tRemainder = diffTime % tfrequency;
      //solved
      var tMinutesTillTrain = tfrequency - tRemainder;

      var el = '<tr>'
      el += '<th>' + data.name + '</th>'
      el += '<th>' + data.dest + '</th>'
      el += '<th>' + data.freq + '</th>'
      el += '<th>' + trainTime + '</th>'
      el += '<th>' + tMinutesTillTrain + '</th>'
      el += '</tr>'

      $('#time-panel').append(el)
    }

  })
})(jQuery, moment, document)