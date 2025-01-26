'use strict';

let notesContent = [],
    addContentElement = document.getElementById('add-content'),
    addButtonElement = document.getElementById('add-button'),
    notesWrapper = document.getElementById('notes-wrapper');

addButtonElement.addEventListener('click', addNote);

document.body.onload = function() {
    chrome.storage.sync.get('notes', function(items) {
        if (!chrome.runtime.error) {
            if (typeof items.notes != 'undefined') {
                notesContent = items.notes;
            }
            
            updateNotesHtml();
        }
    });
}

function addNote() {
    let content = addContentElement.value;
    
    if (!content) {
        return;
    }

    notesContent.push(content);

    addContentElement.value = '';
    updateNotesHtml();

    chrome.storage.sync.set({'notes' : notesContent}, function() {});
};

function updateNotesHtml() {
    let html = '<ul id="notes-list">';
    for (let i = 0; i < notesContent.length; i++) {
        html += '<li data-note-id="' + i + '" class="w100"><span>' + notesContent[i] + '</span> <span class="delete-note" title="Удалить заметку">+</span></li>';
    }
    html += '</ul>';

    notesWrapper.innerHTML = html;

    document.querySelectorAll('.delete-note').forEach(function(el){
        el.addEventListener('click', function(){removeNote(el);});
    });
};

function removeNote(el) {
    let noteId = el.parentNode.dataset.noteId;
    notesContent.splice(noteId, 1);

    updateNotesHtml();

    chrome.storage.sync.set({'notes': notesContent}, function() {});
};


