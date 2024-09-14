class Note {
    constructor(content) {
        this.content = content;
    }

    save() {
        let notes = Note.getAllNotes();
        notes.push(this.content);
        Note.saveToLocalStorage(notes);
        alert('Note saved successfully!');
    }

    static update(index, newContent) {
        let notes = Note.getAllNotes();
        notes[index] = newContent; 
        Note.saveToLocalStorage(notes);
        alert('Note updated successfully!');
    }

    static delete(index) {
        let notes = Note.getAllNotes();
        notes.splice(index, 1); 
        Note.saveToLocalStorage(notes);
    }

    static getAllNotes() {
        return JSON.parse(localStorage.getItem('notes')) || [];
    }

    static saveToLocalStorage(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

class NoteUI {
    constructor(noteInput, saveButton, notesList, lastUpdated, autoRefresh = false) {
        this.noteInput = noteInput;
        this.saveButton = saveButton;
        this.notesList = notesList;
        this.lastUpdated = lastUpdated;
        this.autoRefresh = autoRefresh; 
    }

    init() {
        this.displayNotes();

        if (this.autoRefresh) {
            setInterval(() => this.displayNotes(), 2000);
        }

        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => this.handleSaveNote());
        }

        this.updateLastUpdatedTime();
    }

    handleSaveNote() {
        const content = this.noteInput.value.trim();

        if (content) {
            const note = new Note(content); 
            note.save();  
            this.noteInput.value = '';  
            this.displayNotes();  
        } else {
            alert('Please write something before saving.');
        }
    }

    displayNotes() {
        const notes = Note.getAllNotes();
        this.notesList.innerHTML = ''; 

        notes.forEach((noteContent, index) => {
            const noteBox = this.createNoteBox(noteContent, index);
            this.notesList.appendChild(noteBox);
        });

        this.updateLastUpdatedTime();
    }

    createNoteBox(noteContent, index) {
        const noteBox = document.createElement('div');
        noteBox.className = 'note-box';

        const noteTextArea = document.createElement('textarea');
        noteTextArea.value = noteContent; 
        noteTextArea.addEventListener('input', () => {
            noteTextArea.classList.add('modified'); 
        });
        noteBox.appendChild(noteTextArea);

        if (this.saveButton) {
            const saveChangesButton = document.createElement('button');
            saveChangesButton.textContent = 'Save Changes';
            saveChangesButton.className = 'save-changes-button';
            saveChangesButton.onclick = () => {
                const newContent = noteTextArea.value.trim();
                if (newContent) {
                    Note.update(index, newContent); 
                    this.displayNotes(); 
                } else {
                    alert('Note cannot be empty!');
                }
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => {
                Note.delete(index); 
                this.displayNotes(); 
            };

            noteBox.appendChild(saveChangesButton);
            noteBox.appendChild(deleteButton);
        }

        return noteBox;
    }

    updateLastUpdatedTime() {
        const now = new Date();
        const formattedTime = now.toLocaleString(); 
        if (this.lastUpdated) {
            this.lastUpdated.textContent = `Last updated at: ${formattedTime}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('noteInput');
    const saveButton = document.getElementById('saveNote');
    const notesList = document.getElementById('notesList');
    const lastUpdated = document.getElementById('lastUpdated');

    const isReaderPage = !saveButton; 
    const autoRefresh = isReaderPage; 

    const noteUI = new NoteUI(noteInput, saveButton, notesList, lastUpdated, autoRefresh);
    noteUI.init();
});
