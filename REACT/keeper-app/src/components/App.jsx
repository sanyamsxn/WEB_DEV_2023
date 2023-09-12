import React, { useState } from "react";

import Header from "./Header"
import Footer from "./Footer"
import Note from "./Note"
import CreateArea from "./CreateArea";



function App(){
    const [notesItems, setNoteItems] = useState([]);
    
    // this contains the note we send from the create area.
    function addNote(newNote){
        // STEP 3: now we need to add this note in an array
        //this returns a new array with prev values
        // and set to the notesItems
        setNoteItems(prevValue=>{
            return [
                ...prevValue,
                newNote
            ]
        })
    }


    //STEP 5: DELETE FUNCTIONALITY
    function deleteNote(id){
        setNoteItems((prevValue)=>{
            // filter gives item and index then we 
            // are using index and return only those items
            // which index is not equal to the provided id
            // so that new array is return which don't have the
            // deleted item
            return prevValue.filter((note, index)=>{
                return index !==id
            })
        })
    }
    
    return (
        <div>
          <Header />
          <CreateArea onAdd={addNote} />
          {/* STEP 4: now we need to take array and render separate note items. */}
          {notesItems.map((noteItem, index)=>{
            return <Note 
                key = {index}
                id = {index}
                title = {noteItem.title}
                content = {noteItem.content}
                onDelete = {deleteNote}
            />
          })}
          
          <Footer />
        </div>
      );
}



export default App;