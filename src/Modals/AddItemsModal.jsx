import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import apiRequest from '../utils/AxiosHandler';

const AddItemsCard = ({ setItem, setSpinnerShow }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    text: '',
    fileUrl: ""
  })


  const handleOpen = () => {
    setOpen(true);
    setState({
      text: '',
      fileUrl: ""
    })
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = async () => {
    if (state.text.length == 0) {
      alert('Enter the Title')
      return;
    }
    else if (state.fileUrl.length == 0) {
      alert('Upload the image');
      return;
    }
    setSpinnerShow(true);
    setOpen(false);
    let itemsFromApi = await apiRequest('POST', 'api/items/add', { title: state.text, imageUrl: state.fileUrl });
    setSpinnerShow(false)
    if(itemsFromApi && itemsFromApi.data){
      setItem(itemsFromApi.data);
      setSpinnerShow(false);
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const convertIntoBase64 = (inputFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64url = reader.result;
      setState(prev => ({ ...prev, fileUrl: base64url }))
    }
    reader.readAsDataURL(inputFile)

  }
  return <><Button onClick={handleOpen}>Add Item</Button>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TextField required id="outlined-basic" label="Title" style={{ width: "100%" }} variant="outlined" value={state.text} onChange={e => setState(prev => ({ ...prev, text: e.target.value }))} />
        <Typography style={{ margin: "20px 0px" }}>Image Upload*</Typography>
        <input required type='file' accept='image/*' style={{ marginBottom: "20px" }} onChange={e => convertIntoBase64(e.target.files[0])} />
        <div>
          <Button variant="text" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Ok</Button>
        </div>
      </Box>
    </Modal>
  </>
}

export default AddItemsCard;