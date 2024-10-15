const API_URL = 'http://localhost:8000/api/notes';

async function fetchNotes() {
    try {
        console.log('Fetching notes...');
        const response = await axios.get(API_URL);
        console.log('Fetched notes:', response.data);
        const notesContainer = document.getElementById('notes-container');
        notesContainer.innerHTML = '';

        if (response.data.length === 0) {
            notesContainer.innerHTML = '<p>No se encontraron notas. Crea una para que aparezcan.</p>';
            return;
        }

        response.data.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <div class="note-actions">
                    <a href="edit.html?id=${note._id}">Editar</a>
                    <a href="#" onclick="deleteNote('${note._id}')">Borrar</a>
                </div>
            `;
            notesContainer.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        document.getElementById('notes-container').innerHTML = '<p>Error al encontrar las notas. Intenta de nuevo mas tarde.</p>';
    }
}

async function createNote(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        console.log('Creating note:', { title, content });
        const response = await axios.post(`${API_URL}/add`, { title, content });
        console.log('Note created:', response.data);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error creating note:', error);
        alert('Error creando la nota. Intenta de nuevo.');
    }
}

// Function to delete a note
async function deleteNote(id) {
    if (confirm('¿Quieres borrar esta Nota?')) {
        try {
            console.log('Deleting note:', id);
            await axios.delete(`${API_URL}/${id}`);
            console.log('Note deleted');
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Error borrando la not. Intenta de nuevo.');
        }
    }
}

function editNote(id) {
    window.location.href = `edit.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    const createNoteForm = document.getElementById('create-note-form');
    if (createNoteForm) {
        console.log('Create note form found');
        createNoteForm.addEventListener('submit', createNote);
    }

    if (window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        console.log('On index page, fetching notes');
        fetchNotes();
    }
});

function getNoteId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchNoteDetails() {
    const noteId = getNoteId();
    try {
        console.log('Fetching note details:', noteId);
        const response = await axios.get(`${API_URL}/${noteId}`);
        console.log('Note details:', response.data);
        document.getElementById('title').value = response.data.title;
        document.getElementById('content').value = response.data.content;
    } catch (error) {
        console.error('Error fetching note details:', error);
        alert('Error con los detalles. Intenta de nuevo.');
    }
}

async function updateNote(event) {
    event.preventDefault();
    const noteId = getNoteId();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        console.log('Updating note:', { id: noteId, title, content });
        const response = await axios.post(`${API_URL}/update/${noteId}`, { title, content });
        console.log('Note updated:', response.data);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error updating note:', error);
        alert('Error editando la nota. Intenta de nuevo.');
    }
}

if (window.location.pathname.endsWith('edit.html')) {
    console.log('On edit page');
    document.addEventListener('DOMContentLoaded', () => {
        fetchNoteDetails();
        const editNoteForm = document.getElementById('edit-note-form');
        if (editNoteForm) {
            console.log('Edit note form found');
            editNoteForm.addEventListener('submit', updateNote);
        }
    });
}