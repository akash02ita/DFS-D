import Table from 'react-bootstrap/Table'
import GetIcon from '../utils/GetIcon.js'

// nothing: when not hovering on row and row is not selected
// circle: when hovering on table
// checkcircle: when hovering on circle
// checkcirclefill: when row is selected
import { Circle, CheckCircle, CheckCircleFill, CloudCheckFill, Download } from 'react-bootstrap-icons'
import { ButtonGroup, Button, Breadcrumb } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useContext } from 'react'
import { FilesContext } from '../App.js'
import axios from 'axios'
import moment from 'moment'
/*
  possible modes:
    "home" -> tablefiles used inside home
    "fileupload" -> used to upload files
*/
const POSSIBLE_MODES = ["home", "fileupload"]
function Tablefiles(props) {
  {/*props.data would obtain the json info. type, size, last_modified, last_modified_by
  const jsondata = props.data; */}
  {/* To determine how many files we have 
  const lengthData = Object.keys(jsondata).length;*/}

  /*
  function lastModTime(){
    var date = moment();
    var currentDate = date.format('MMM DD YYYY');
    return currentDate;
  }*/
  var date = moment();
  var currentDate = date.format('MMM DD[,] YYYY');

  function downloadFn(fileName){
    // Get request to download file
    axios.get(`/downloadfile/${fileName}`, {responseType: 'blob'})
    .then(res => {
      console.log("/downloadfile/${fileName} returned: ", res);
      //console.log(res.data);
      return res.data;
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a  = document.createElement('a');
      a.href = url;
      const fName = fileName;
      a.download = fName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      //link.click();
      /*
      const fName = fileName;
      a.download = fName;
      document.body*/
    })
    .catch((error) => {
      console.log("Error downloading file inside downloadFn");
    })

  }

  function updateList(){
    setTimeout(async function() {
      try{
        axios.get("/fileslist")
        .then(res => {
          console.log("Received table data");
          console.log(res);
          console.log("res.data is");
          console.log(res.data);
          {/* The response here is an array with just the names of the file */}
          console.log("The list of files inside handleDone is: ");
          console.log(res.data);
          setFiles(res.data.files);
        })
      }
      catch(error){
        console.log(error);
      }
    }, 500 ); 
  }

  useEffect(() => {
    updateList();
  }, []);

  const mode = POSSIBLE_MODES.includes(props.mode) ? props.mode : "home"; 

  const {files, setFiles} = useContext(FilesContext);

  const [selectedRows, setSelectedRows] = useState([]);
  const [hovereredRows, setHovereredRows] = useState([]);

  const handleRowSelect = (i) => setSelectedRows((prev) => [...prev, i]);
  const handleRowUnSelect = (i) => setSelectedRows((prev) => prev.filter((iprev) => iprev !== i));
  const handleRowHover = (i) => !isRowHovered(i) ? setHovereredRows((prev) => [...prev, i]) : undefined;
  const handleRowUnHover = (i) => isRowHovered(i) ? setHovereredRows((prev) => prev.filter((iprev) => iprev !== i)) : undefined;
  const isRowSelected = (i) => selectedRows.includes(i);
  const isRowHovered = (i) => hovereredRows.includes(i);
  const handleRowClick = (i) => isRowSelected(i) ? handleRowUnSelect(i) : handleRowSelect(i);

  const [hoveredTickMarks, setHovereredTickMarks] = useState([]);
  const handleHoverTickMark = (i) => !isTickMarkHovered(i) ? setHovereredTickMarks((prev) => [...prev, i]) : undefined;
  const handleUnHoverTickMark = (i) => isTickMarkHovered(i) ? setHovereredTickMarks((prev) => prev.filter((iprev) => iprev !== i)) : undefined;;
  const isTickMarkHovered = (i) => hoveredTickMarks.includes(i);

  const renderHomeData = () => {
    console.log("files inside renderHomeData is currently: ");
    console.log(files);

    {/*const rows = Object.entries(files).map(([fname, fprops], index) => {
      Each file will get its row, when we hover over it, the download button
      will appear. 
    */}
    const rows = files.map((fname, index) => {
      //console.log("data index is", index, "with fname", fname, "and fprops");

      const putCheckMark = (index) => {
        if (isRowSelected(index)) return <CheckCircleFill size={20} />;
        if (isTickMarkHovered(index)) return <CheckCircle size={20} onMouseLeave={() => handleUnHoverTickMark(index)} />;
        if (isRowHovered(index)) return <Circle size={20} onMouseEnter={() => handleHoverTickMark(index)} />;
        return <></>; // do not put anything otherwise
      }
      const putActions = (index) => {
        // TODO: add 3 dot button on side
        // outline-* class used to allow hover effects with fill
        if (isRowHovered(index)) return (
          <ButtonGroup>
            <Button 
              onClick={() => downloadFn(fname)}
              variant='outline-success'>
              <Download size={25} />
              DOWNLOAD
            </Button>
          </ButtonGroup>
        );
        // ensure that if no butotn group is selected the size still matches. Otherwise suddent growth in size is odd.
        // this is ensured using col-2 classname in Action th table header
        return <></>;
      }
      return (
        <tr key={index}
          onMouseEnter={() => handleRowHover(index)}
          onMouseLeave={() => { handleRowUnHover(index); handleUnHoverTickMark(index) }}
          onClick={() => handleRowClick(index)}
        >
          <td>{fname}</td>
          <td>{currentDate}</td>
          <td>Anonymous</td>
          <td>{putActions(index)}</td>
        </tr>
      );
    });

    return rows;
  } /* End of renderHomeData*/ 


  const renderFileUploadData = () => {
    console.log("props.data is:");
    console.log(props.data);
    const rows = Object.entries(props.data).map(([fname, fprops], index) => {
      console.log("data index is", index, "with fname", fname, "and fprops", fprops);
      const putCheckMark = (index) => {
        if (isRowSelected(index)) return <CheckCircleFill size={20} />;
        if (isTickMarkHovered(index)) return <CheckCircle size={20} onMouseLeave={() => handleUnHoverTickMark(index)} />;
        if (isRowHovered(index)) return <Circle size={20} onMouseEnter={() => handleHoverTickMark(index)} />;
        return <></>; // do not put anything otherwise
      }
      const putActions = (index) => {
        // TODO: add 3 dot button on side
        // outline-* class used to allow hover effects with fill
        if (isRowHovered(index) || isRowSelected(index)) return (
          <ButtonGroup>
            <Button variant="outline-primary"><CloudCheckFill size={25} />{" "} CHOOSE</Button>
          </ButtonGroup>
        );
        // ensure that if no butotn group is selected the size still matches. Otherwise suddent growth in size is odd.
        // this is ensured using col-2 classname in Action th table header
        return <></>;
      }
      return (
        <tr key={index}
          onMouseEnter={() => handleRowHover(index)}
          onMouseLeave={() => { handleRowUnHover(index); handleUnHoverTickMark(index) }}
          onClick={() => handleRowClick(index)}
        >
          <td className='text-center'> {putCheckMark(index)} </td>
          <td> <GetIcon fname={fname} size={30} type={fprops.type} /> </td>
          <td>{fname}</td>
          <td>{fprops.size} B</td>
          <td>{putActions(index)}</td>
        </tr>
      );
    });

    return rows;
  }

  // sum of col-* is 12 to follow boostrap convention
  // https://getbootstrap.com/docs/5.3/utilities/colors/   these sources for breadcrumb color picking
  // https://getbootstrap.com/docs/5.3/utilities/background
  // TODO: in custom styling remove hyperlink underlines. On hover show blue link. otherwise just like as if it is 'active' breadcrumb.item
  // TODO: in custom styling try to put the separator between items and not inside the item (just like on figma)
  // TODO: in cusotm styling try to make the bordered rectangales in breadcrumb.item slightly dark grey background (like on figma)
  
    if(mode == "home"){
    return (
      <div className='table-container'>

        <Breadcrumb className='fs-3'>
          <Breadcrumb.Item active className='px-3 py-1 text-dark fw-bold'>Current Files</Breadcrumb.Item>
        </Breadcrumb>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th className='col-2'>Name      </th>
              <th className='col-2'>Last Modified</th>
              <th className='col-2'>Last Modified By</th>
              <th className='col-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {renderHomeData()}
          </tbody>
        </Table>
      </div>
    );
    }

    else if (mode == "fileupload") {
      return (
        <div className='table-container'>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className='col-1' style={{ width: "5%" }}></th>
                <th className='col-1'>Type</th>
                <th className='col-2'>Name</th>
                <th className='col-1'>Size</th>
                <th className='col-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {renderFileUploadData()}
            </tbody>
          </Table>
        </div>
      );
    }
  
    return <></>; // otherwise nothing
  
}

export default Tablefiles;