import React from "react";

const ImageViewerModal = ({ image }) => {
  return (
    <>
      {image && (
        <div className="modalStyle">
          <img src={image} alt="logo" className="responsive"/>
        </div>
      )}
    </>
  );
};

export default ImageViewerModal;
