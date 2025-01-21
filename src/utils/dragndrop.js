// drag drop file component

import React from 'react'


export default function DragDropFile({setFile}) {
    // drag state
    const [dragActive, setDragActive] = React.useState(false);
    
    // ref
    const inputRef = React.useRef(null);
    
    // handle drag events
    const handleDrag = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
    
    // triggers when file is dropped
    const handleDrop = function(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        // handleFiles(e.dataTransfer.files);
        console.log(e.dataTransfer.files)
        let data=[]
         Object.keys(e.dataTransfer.files).map(function(key) {
            data.push(e.dataTransfer.files[key])
         })
        setFile(data)
        
    }
    };
    
    // triggers when file is selected with click
    const handleChange = function(e) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
         console.log(e.target.files);
        let data=[]
         Object.keys(e.target.files).map(function(key) {
            data.push(e.target.files[key])
         })
        setFile(data)
      }
    };
    
  // triggers the input when the button is clicked
    const onButtonClick = () => {
      inputRef.current.click();
      
    };
    
    return (<>
        
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
          <div>
            <p>Glisser vos fichiers ici ou</p>
            <button className="upload-button" onClick={onButtonClick}>Choisir un fichier</button>
          </div> 
        </label>
        { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
      </form>
      </>
    );
  };