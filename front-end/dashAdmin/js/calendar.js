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
        // Personnalisation de l'affichage des événements
        eventContent: function(arg) {
            return {
                html: `
                    <div class="event-content">
                        <div class="event-title">${arg.event.title}</div>
                        <div class="event-time">${new Date(arg.event.start).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</div>
                    </div>
                `
            };
        },
        // Style des événements
        eventDidMount: function(info) {
            info.el.style.fontSize = '12px';
            info.el.style.padding = '4px';
            info.el.style.margin = '2px 0';
            info.el.style.borderLeft = `4px solid ${info.event.backgroundColor || '#b88f1e'}`;
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            fetch('http://localhost:5002/api/events')
                .then(response => response.json())
                .then(events => {
                    successCallback(events.map(event => ({
                        id: event._id,
                        title: event.title,
                        start: new Date(event.date).toISOString().split('T')[0] + 'T' + event.time,
                        description: event.description,
                        color: event.color || '#b88f1e',
                        category: event.category
                    })));
                })
                .catch(error => {
                    console.error('❌ Erreur:', error);
                    failureCallback(error);
                });
        },
        eventClick: function(info) {
            const event = info.event;
            const modal = document.getElementById('eventModal');
            const closeBtn = modal.querySelector('.close');
            const editBtn = document.getElementById('editEvent');
            const deleteBtn = document.getElementById('deleteEvent');

            // Remplir le modal avec les détails de l'événement
            document.getElementById('modalTitle').textContent = event.title;
            document.getElementById('modalDate').textContent = new Date(event.start).toLocaleDateString();
            document.getElementById('modalTime').textContent = new Date(event.start).toLocaleTimeString();
            document.getElementById('modalDescription').textContent = event.extendedProps.description || 'Aucune description';
            document.getElementById('modalCategory').textContent = event.extendedProps.category || 'Non catégorisé';

            // Afficher le modal
            modal.style.display = 'flex';

            // Gestionnaire pour fermer le modal
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            }

            // Fermer le modal si on clique en dehors
            window.onclick = function(evt) {
                if (evt.target === modal) {
                    modal.style.display = 'none';
                }
            }

            // Gestionnaire pour modifier l'événement
            editBtn.onclick = function() {
                const editModal = document.getElementById('editEventModal');
                const detailsModal = document.getElementById('eventModal');

                // Pré-remplir le formulaire avec l'événement actuel
                document.getElementById('editEventId').value = event.id;
                document.getElementById('editEventTitle').value = event.title;
                document.getElementById('editEventDate').value = event.start.toISOString().split('T')[0];
                document.getElementById('editEventTime').value = event.start.toTimeString().slice(0,5);
                document.getElementById('editEventDescription').value = event.extendedProps.description || '';
                document.getElementById('editEventColor').value = event.backgroundColor || '#b88f1e';

                // Cacher le modal de détails et afficher le modal d'édition
                detailsModal.style.display = 'none';
                editModal.style.display = 'flex';
            }

            // Gestionnaire pour supprimer l'événement
            deleteBtn.onclick = async function() {
                if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
                    try {
                        const response = await fetch(`http://localhost:5002/api/events/${event.id}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            throw new Error('Erreur lors de la suppression');
                        }

                        event.remove();
                        modal.style.display = 'none';
                        alert('✅ Événement supprimé avec succès');
                    } catch (error) {
                        console.error('❌ Erreur:', error);
                        alert('❌ Erreur lors de la suppression de l\'événement');
                    }
                }
            }
        }
    });

    calendar.render();

    // Gestion du formulaire d'ajout d'événement
    const eventForm = document.getElementById('eventForm');
    eventForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = {
                title: document.getElementById('eventTitle').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                description: document.getElementById('eventDescription').value,
                color: document.getElementById('eventColor').value
            };

            const response = await fetch('http://localhost:5002/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                calendar.addEvent({
                    id: result.event._id,
                    title: formData.title,
                    start: formData.date + 'T' + formData.time,
                    color: formData.color,
                    description: formData.description
                });

                eventForm.reset();
                alert('✅ Événement ajouté avec succès');
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('❌ Erreur:', error);
            alert('❌ Erreur lors de l\'ajout de l\'événement');
        }
    });

    // Ajouter la gestion du formulaire d'édition
    document.getElementById('editEventForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const eventId = document.getElementById('editEventId').value;
        
        try {
            const formData = {
                title: document.getElementById('editEventTitle').value,
                date: document.getElementById('editEventDate').value,
                time: document.getElementById('editEventTime').value,
                description: document.getElementById('editEventDescription').value,
                color: document.getElementById('editEventColor').value
            };

            const response = await fetch(`http://localhost:5002/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la modification');
            }

            const result = await response.json();

            // Mettre à jour l'événement dans le calendrier
            const event = calendar.getEventById(eventId);
            event.setProp('title', formData.title);
            event.setStart(formData.date + 'T' + formData.time);
            event.setExtendedProp('description', formData.description);
            event.setProp('backgroundColor', formData.color);

            // Fermer le modal
            document.getElementById('editEventModal').style.display = 'none';
            alert('✅ Événement modifié avec succès');

        } catch (error) {
            console.error('❌ Erreur:', error);
            alert('❌ Erreur lors de la modification de l\'événement');
        }
    });

    // Gestion du bouton Annuler
    document.getElementById('cancelEdit').onclick = function() {
        document.getElementById('editEventModal').style.display = 'none';
    };

    // Gestion de la fermeture du modal d'édition
    document.querySelector('#editEventModal .close').onclick = function() {
        document.getElementById('editEventModal').style.display = 'none';
    };
});