  
import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import Tablefiles from './Tablefiles.js'
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import { PlusSquareDotted } from 'react-bootstrap-icons';
import axios from 'axios';

{/* The flag and setFlag props are
passed from the AddMenu component */}
function FileUpload({ flag, setFlag }) {
  const [files, setFiles] = useState([]);
  const [f_listFromServer, setf_listFromServer] = useState([]);
  
  const getFilesJson = () => {
    console.log("files is ", files);
    const data = {};
    Object.values(files).forEach((val) => {
      console.log("The val is ", val);
      const fname = val.name;
      const type = "file";
      const size = val.size;
      const last_modified = val.lastModifiedDate;
      const last_modified_by = "Anonimous";
      data[fname] = {
        "type": type,
        "size": size,
        "last_modified": last_modified,
        "last_modified_by": last_modified_by,
      };
    });
    return data;
  }


  const handleDone = () => {
    // TODO: fetch api call for file upload
    // on success: back
    // on failure: danger alert for failure
    // We don't have formData
    if(!files){
      console.log("There are no files to upload")
      return;
    }
    
    console.log("upload files is", files);
    console.log("object entries uploadfiles", Object.entries(files));

    Object.entries(files).forEach(([index, upfile]) => {
      console.log("What is upfile INDEX", index, "upfile", upfile)
      const formData = new FormData();
      formData.append("uploaded_file", upfile);
      axios.post("/uploadfile", formData, {headers :{
        "Content-Type": "multipart/form-data",
      }})
      .then(res => {
        console.log("Server has replied. Files have been uploaded.")
        console.log("Receive response for index", index);
        console.log(res);
        console.log(res.data);
    })})  
    setFlag(false);
    {/* To get rid of files that would otherwise stay in the "Add" -> Modal */}
    setFiles([]); 
    {/*You could get the list from the server at this point */}
  };

  const handleCancel = () => {
    setFlag(false);
  }
  {/* This section is all about the File Upload Modal */}
  return (
    <Modal show={flag} onHide={handleCancel} backdrop="static" size="xl" scrollable centered> 
      <Modal.Header closeButton>
        File upload
      </Modal.Header>

      <Modal.Body>
        {/* TODO: add a table builder with scroll. (use containers) */}
        {/* https://react-bootstrap.netlify.app/components/modal/#using-the-grid */}
        <div>
          <Tablefiles data={getFilesJson()} mode="fileupload" />
        </div>
        <Dropzone onDrop={newfiles => setFiles((prev) => prev.concat(newfiles))}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {/* <div className='text-secondary fs-4 text-center border border-3 border-dark rounded' */}
                {/* <div className='text-secondary fs-4 text-center w-50 p-5' */}
                <div className='text-secondary fs-4 text-center p-5'
                  style={{ border: 'dotted' }}>
                    
                  <PlusSquareDotted size={50} />
                  <div>Click to browse or drag item(s) here</div>
                </div>
              </div>
            </section>
          )}
        </Dropzone>

        {/* TODO: add a click and drag dotted area */}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="primary" onClick={handleDone}>Done</Button>
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      </Modal.Footer>

    </Modal>
  )
}

export default FileUpload;