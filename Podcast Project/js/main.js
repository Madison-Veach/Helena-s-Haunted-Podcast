$(document).ready(function () {
  $('.header').height($(window).height());
})
$(document).ready(function () {
  $("#player").vpplayer({
    src: "audio.mp3",
    trackName: "sample audio",
  });
});

$(function () {
  $(".carousel").carousel({ interval: 2000 });
  $("#carouselButton").click(function () {
    if ($("#carouselButton").children("i").hasClass("fa-pause")) {
      $(".carousel").carousel("pause");
      $("#carouselButton").children("i").removeClass("fa-pause");
      $("#carouselButton").children("i").addClass("fa-play");
    } else {
      $(".carousel").carousel("cycle");
      $("#carouselButton").children("i").removeClass("fa-play");
      $("#carouselButton").children("i").addClass("fa-pause");
    }
  });
});

(function () {

  var pcastPlayers = document.querySelectorAll('.pcast-player');
  var speeds = [1, 1.5, 2, 2.5, 3]

  for (i = 0; i < pcastPlayers.length; i++) {
    var player = pcastPlayers[i];
    var audio = player.querySelector('audio');
    var play = player.querySelector('.pcast-play');
    var pause = player.querySelector('.pcast-pause');
    var rewind = player.querySelector('.pcast-rewind');
    var progress = player.querySelector('.pcast-progress');
    var speed = player.querySelector('.pcast-speed');
    var mute = player.querySelector('.pcast-mute');
    var currentTime = player.querySelector('.pcast-currenttime');
    var duration = player.querySelector('.pcast-duration');

    var currentSpeedIdx = 0;

    pause.style.display = 'none';

    var toHHMMSS = function (totalsecs) {
      var sec_num = parseInt(totalsecs, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours < 10) { hours = "0" + hours; }
      if (minutes < 10) { minutes = "0" + minutes; }
      if (seconds < 10) { seconds = "0" + seconds; }

      var time = hours + ':' + minutes + ':' + seconds;
      return time;
    }

    audio.addEventListener('loadedmetadata', function () {
      progress.setAttribute('max', Math.floor(audio.duration));
      duration.textContent = toHHMMSS(audio.duration);
    });

    audio.addEventListener('timeupdate', function () {
      progress.setAttribute('value', audio.currentTime);
      currentTime.textContent = toHHMMSS(audio.currentTime);
    });

    play.addEventListener('click', function () {
      this.style.display = 'none';
      pause.style.display = 'inline-block';
      pause.focus();
      audio.play();
    }, false);

    pause.addEventListener('click', function () {
      this.style.display = 'none';
      play.style.display = 'inline-block';
      play.focus();
      audio.pause();
    }, false);

    rewind.addEventListener('click', function () {
      audio.currentTime -= 30;
    }, false);

    progress.addEventListener('click', function (e) {
      audio.currentTime = Math.floor(audio.duration) * (e.offsetX / e.target.offsetWidth);
    }, false);

    speed.addEventListener('click', function () {
      currentSpeedIdx = currentSpeedIdx + 1 < speeds.length ? currentSpeedIdx + 1 : 0;
      audio.playbackRate = speeds[currentSpeedIdx];
      this.textContent = speeds[currentSpeedIdx] + 'x';
      return true;
    }, false);

    mute.addEventListener('click', function () {
      if (audio.muted) {
        audio.muted = false;
        this.querySelector('.fa').classList.remove('fa-volume-off');
        this.querySelector('.fa').classList.add('fa-volume-up');
      } else {
        audio.muted = true;
        this.querySelector('.fa').classList.remove('fa-volume-up');
        this.querySelector('.fa').classList.add('fa-volume-off');
      }
    }, false);
  }
})(this);


$(document).ready(function () {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  /*  className colors
  
  className: default(transparent), important(red), chill(pink), success(green), info(blue)
  
  */


  /* initialize the external events
  -----------------------------------------------------------------*/

  $('#external-events div.external-event').each(function () {

    // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
    // it doesn't need to have a start or end
    var eventObject = {
      title: $.trim($(this).text()) // use the element's text as the event title
    };

    // store the Event Object in the DOM element so we can get to it later
    $(this).data('eventObject', eventObject);

    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 999,
      revert: true,      // will cause the event to go back to its
      revertDuration: 0  //  original position after the drag
    });

  });


  /* initialize the calendar
  -----------------------------------------------------------------*/

  var calendar = $('#calendar').fullCalendar({
    header: {
      left: 'title',
      center: 'agendaDay,agendaWeek,month',
      right: 'prev,next today'
    },
    editable: true,
    firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
    selectable: true,
    defaultView: 'month',

    axisFormat: 'h:mm',
    columnFormat: {
      month: 'ddd',    // Mon
      week: 'ddd d', // Mon 7
      day: 'dddd M/d',  // Monday 9/7
      agendaDay: 'dddd d'
    },
    titleFormat: {
      month: 'MMMM yyyy', // September 2009
      week: "MMMM yyyy", // September 2009
      day: 'MMMM yyyy'                  // Tuesday, Sep 8, 2009
    },
    allDaySlot: false,
    selectHelper: true,
    select: function (start, end, allDay) {
      var title = prompt('Event Title:');
      if (title) {
        calendar.fullCalendar('renderEvent',
          {
            title: title,
            start: start,
            end: end,
            allDay: allDay
          },
          true // make the event "stick"
        );
      }
      calendar.fullCalendar('unselect');
    },
    droppable: true, // this allows things to be dropped onto the calendar !!!
    drop: function (date, allDay) { // this function is called when something is dropped

      // retrieve the dropped element's stored Event Object
      var originalEventObject = $(this).data('eventObject');

      // we need to copy it, so that multiple events don't have a reference to the same object
      var copiedEventObject = $.extend({}, originalEventObject);

      // assign it the date that was reported
      copiedEventObject.start = date;
      copiedEventObject.allDay = allDay;

      // render the event on the calendar
      // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
      $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

      // is the "remove after drop" checkbox checked?
      if ($('#drop-remove').is(':checked')) {
        // if so, remove the element from the "Draggable Events" list
        $(this).remove();
      }

    },

    events: [
      {
        title: 'All Day Event',
        start: new Date(y, m, 1)
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d - 3, 16, 0),
        allDay: false,
        className: 'info'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d + 4, 16, 0),
        allDay: false,
        className: 'info'
      },
      {
        title: 'Meeting',
        start: new Date(y, m, d, 10, 30),
        allDay: false,
        className: 'important'
      },
      {
        title: 'Lunch',
        start: new Date(y, m, d, 12, 0),
        end: new Date(y, m, d, 14, 0),
        allDay: false,
        className: 'important'
      },
      {
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: false,
      },
      {
        title: 'Click for Google',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        url: 'https://ccp.cloudaccess.net/aff.php?aff=5188',
        className: 'success'
      }
    ],
  });


});
np