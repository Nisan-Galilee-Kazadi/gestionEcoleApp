document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: function(info, successCallback, failureCallback) {
      fetch('http://localhost:5002/api/events')
        .then(response => response.json())
        .then(response => {
          // Utiliser response.data au lieu de response directement
          const events = response.data.map(event => ({
            id: event._id,
            title: event.title,
            start: `${event.date.split('T')[0]}T${event.time}`,
            description: event.description,
            color: event.color || '#b88f1e'
          }));
          successCallback(events);
        })
        .catch(error => {
          console.error('Erreur:', error);
          failureCallback(error);
        });
    },
    height: '100%'
  });

  calendar.render();

  // Gestion du formulaire
  document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const eventData = {
      title: document.getElementById('eventTitle').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      description: document.getElementById('eventDescription').value
    };

    try {
      const response = await fetch('http://localhost:5002/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        calendar.refetchEvents();
        this.reset();
        alert('Événement ajouté avec succès');
      }
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'événement');
    }
  });
}); 