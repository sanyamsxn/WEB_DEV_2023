import React, { useState } from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';  // to give zooming effect of btn

function CreateArea(props) {
    // to expand our note area, when clicked then show title.
    const [expand, setExpand] = useState(false);
    // function to show title when txt area is clicked also show 3 
    // rows of text area only when it is clicked.
    function makeExpand(){
      setExpand(true);
    }
  
    // STEP 1: to keep tracks of thetitle and content
    const [note, setNote] = useState({
        title:"",
        content: ""
    })
    function handleChange(event){
        //destructuing the event which gaves the name of element
        // which triggers the change and the value it has.
        const {name, value} = event.target;
        setNote(prevValue=>{
            return {
                ...prevValue,
                [name] : value
            }
        })
    }

    // STEP 2: now we need to pass the created note to the app.jsx
    // we will use the add btn we have in the form
    function submitNote(event){
        props.onAdd(note);
        // we are passing the note to the function onAdd to the app.jsx
        setNote({
            title:"",
            content:""
        })

        //prevent from refreshing when form btn is clicked
        event.preventDefault();

    }

  

  return (
    <div>
      <form className="create-note" >
        {expand && 

          <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="TITLE"
        />
        }
        
        <textarea
          onClick={makeExpand}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder={!expand? "Click here to expand" : "Write your ideas here..."}
          rows={expand ? 3 : 1}
        />

        {/* now when text area is clicked, it will expand the title and textarea rows
        and add btn will come up with zooming effect. */}
        <Zoom in={expand}>
          <Fab  onClick={submitNote}><AddIcon/></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;