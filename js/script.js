// Note class for handling note creation, saving, updating, and deletion
class Note {
    constructor(content) {
        this.content = content;
    }

    // Save a new note
    save() {
        let notes = Note.getAllNotes();
        notes.push(this.content);
        Note.saveToLocalStorage(notes);
        alert('Note saved successfully!');
    }

    // Update an existing note at a specific index
    static update(index, newContent) {
        let notes = Note.getAllNotes();
        notes[index] = newContent; // Update the note content at the specified index
        Note.saveToLocalStorage(notes);
        alert('Note updated successfully!');
    }

    // Delete a note at a specific index
    static delete(index) {
        let notes = Note.getAllNotes();
        notes.splice(index, 1); // Remove the note at the specified index
        Note.saveToLocalStorage(notes);
    }

    // Get all notes from localStorage
    static getAllNotes() {
        return JSON.parse(localStorage.getItem('notes')) || [];
    }

    // Save notes to localStorage
    static saveToLocalStorage(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

// NoteUI class for handling UI interactions and display logic
class NoteUI {
    constructor(noteInput, saveButton, notesList, lastUpdated) {
        this.noteInput = noteInput;
        this.saveButton = saveButton;
        this.notesList = notesList;
        this.lastUpdated = lastUpdated;
    }

    // Initialize event listeners and load notes on page load
    init() {
        this.displayNotes();

        // Save note only if saveButton exists (i.e., on writer.html)
        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => this.handleSaveNote());
        }

        // Update the "Last updated" timestamp
        this.updateLastUpdatedTime();
    }

    // Handle saving a new note
    handleSaveNote() {
        const content = this.noteInput.value.trim();

        if (content) {
            const note = new Note(content);  // Create a new Note object
            note.save();  // Save the note using the Note class
            this.noteInput.value = '';  // Clear the input field
            this.displayNotes();  // Refresh the list of notes
        } else {
            alert('Please write something before saving.');
        }
    }

    // Display all saved notes
    displayNotes() {
        const notes = Note.getAllNotes();
        this.notesList.innerHTML = ''; // Clear the list before displaying

        notes.forEach((noteContent, index) => {
            const noteBox = this.createNoteBox(noteContent, index);
            this.notesList.appendChild(noteBox);
        });

        // Update the "Last updated" timestamp
        this.updateLastUpdatedTime();
    }

    // Create the note box DOM element
    createNoteBox(noteContent, index) {
        const noteBox = document.createElement('div');
        noteBox.className = 'note-box';

        // Create a text area for each note
        const noteTextArea = document.createElement('textarea');
        noteTextArea.value = noteContent; // Set the note content
        noteTextArea.addEventListener('input', () => {
            noteTextArea.classList.add('modified'); // Mark as modified
        });
        noteBox.appendChild(noteTextArea);

        // Only add edit/delete buttons if on writer.html (where saveButton exists)
        if (this.saveButton) {
            // Create a save changes button for each note
            const saveChangesButton = document.createElement('button');
            saveChangesButton.textContent = 'Save Changes';
            saveChangesButton.className = 'save-changes-button';
            saveChangesButton.onclick = () => {
                const newContent = noteTextArea.value.trim();
                if (newContent) {
                    Note.update(index, newContent); // Update the note content
                    this.displayNotes(); // Refresh the displayed notes
                } else {
                    alert('Note cannot be empty!');
                }
            };

            // Create a delete button for each note
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => {
                Note.delete(index); // Delete the note at the specific index
                this.displayNotes(); // Refresh the displayed notes
            };

            noteBox.appendChild(saveChangesButton);
            noteBox.appendChild(deleteButton);
        }

        return noteBox;
    }

    // Update the "Last updated" timestamp
    updateLastUpdatedTime() {
        const now = new Date();
        const formattedTime = now.toLocaleString(); // e.g., "9/10/2024, 3:45:27 PM"
        if (this.lastUpdated) {
            this.lastUpdated.textContent = `Last updated at: ${formattedTime}`;
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('noteInput');
    const saveButton = document.getElementById('saveNote');
    const notesList = document.getElementById('notesList');
    const lastUpdated = document.getElementById('lastUpdated');

    const noteUI = new NoteUI(noteInput, saveButton, notesList, lastUpdated);
    noteUI.init();
});
