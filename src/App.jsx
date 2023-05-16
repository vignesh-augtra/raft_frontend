import { useEffect, useState, useRef } from "react";
import "./styles.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Confirmation from "./Modals/Confirmation";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from "@mui/material";
import apiRequest from "./utils/AxiosHandler";
import AddItemsCard from "./Modals/AddItemsModal";
import ImageViewerModal from "./Modals/ImageViewerModal";


export default function App() {
  const [items, setItems] = useState([]);
  const [currentViewImage, setCurrentViewImage] = useState();
  const [open, setOpen] = useState({ show: false, id: 0 });
  const [spinnerShow, setSpinnerShow] = useState(false)
  const currentDraggingItem = useRef();
  const replaceItem = useRef();
  let modifiedItemsOrder = ""

  const dragStart = (item, idx) => {
    currentDraggingItem.current = idx;
  };

  const dragEnter = async (item, idx) => {
    replaceItem.current = idx;
  };


  const dragEnd = () => {
    let copyListItems = [...items];
    const dragItemContent = copyListItems[currentDraggingItem.current];
    copyListItems.splice(currentDraggingItem.current, 1);
    copyListItems.splice(replaceItem.current, 0, dragItemContent);
    replaceItem.current = null;
    replaceItem.current = null;

    // modifying the position property
    copyListItems = copyListItems.map((item, index)=>{
      item.position = index + 1;
      return item
    })

    setItems(copyListItems);
    setTimeout(()=>{
      saveItems()
    }, 5000)
  };

  const openAddForm = (id) => {
    setOpen({ show: true, id: id });
  };

  const handleModalClose = () => {
    setOpen({ show: false, id: 0 });
  };


  const frameData = async () => {
    setSpinnerShow(true)   
    let itemsFromApi = await apiRequest('GET', 'api/items/get');
    setSpinnerShow(false)
    if(itemsFromApi && itemsFromApi.data){
      setItems(itemsFromApi.data);
    }
  }

  const handleDelete = async (id) => {
    setOpen({
      id:0,
      show:false
    });
    setSpinnerShow(true);
    let itemsFromApi = await apiRequest('DELETE', `api/items/delete/${id}`);
    setSpinnerShow(false)
    if(itemsFromApi && itemsFromApi.data){
      
      setItems(itemsFromApi.data);
    }
  }


  const saveItems = async () => {   
    let copyOfItems = [...items];

    let currentItemsOrder = copyOfItems.map(item=>item.id);
    currentItemsOrder = currentItemsOrder.join(","); // framing ID as string to verify the previous order and current order
    
    if(currentItemsOrder != modifiedItemsOrder){
      setSpinnerShow(true);
      let itemsFromApi = await apiRequest('PUT', `api/items/updateMany`, {
        data : copyOfItems
      });
      modifiedItemsOrder = copyOfItems.map(item=>item.id);
      modifiedItemsOrder = modifiedItemsOrder.join(","); // Reframing the new list of order
      setSpinnerShow(false);
      if(itemsFromApi && itemsFromApi.data){
        setItems(itemsFromApi.data);
      }
    }

    setTimeout(()=>{
      saveItems()
    }, 5000)
   
  }


  useEffect(() => {
    // On init - framing the items list
    frameData();

    // Assigning esc key event
    window.addEventListener("keydown", async (e) => {
      if (e.keyCode === 27) {
        setCurrentViewImage("");
      }
    });
  }, []);




  return (
    <>
      <AddItemsCard setItem={setItems} setSpinnerShow={setSpinnerShow}/>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          alignItems: "center"
        }}
      >
        {items.length ? 
        
          items.map((item, idx) => (
            <Card sx={{ minWidth: 275 }} key={idx}
              draggable
              onDragStart={() => dragStart(item, idx)}
              onDragEnter={() => dragEnter(item, idx)}
              onDragEnd={dragEnd}
            >
              <CardContent
                onClick={() => setCurrentViewImage(item.imageUrl)}
              >
                <Typography variant="h5" component="div">
                  {item?.title}
                </Typography>
                <CardMedia
                className="no-touch"
                  component="img"
                  height="194"
                  image={item?.imageUrl}
                  alt={item?.title}
                />
              </CardContent>
              <CardActions>
                <IconButton onClick={() => openAddForm(item.id)} >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))
        : '' }
        <ImageViewerModal image={currentViewImage} />
        <Confirmation open={open}  handleDelete={handleDelete} handleClose={handleModalClose} />
       
       {
        spinnerShow ?
        <div style={{ position: "absolute", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",zIndex:3 }}>
        <CircularProgress />
         </div>
         :
         ''
       }
      </div>
    </>
  );
}
