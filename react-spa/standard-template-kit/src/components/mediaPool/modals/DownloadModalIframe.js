import React, { useRef } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import Modal from 'react-modal';


const DownloadModalIframe = ({ assetId, isOpen, onClose, closeModal }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Download Modal"
      className="detailsReactModal"
    > 
      <div className='detailsModalWrapper iframe'>
        <div class="closeButtonWrapper">
          <button className="closeButton" onClick={onClose}><AiOutlineClose/></button>
        </div>
        <div className='detailsModal w2p'>          
          <iframe className="detailsIframe"
                  title={"Asset Download"}
                  src={'/MediapoolDownloadMedia.do?popup=true&mediaGUID=' + assetId }
          ></iframe>
        </div>
      </div>      
    </Modal>
  );
};

export default DownloadModalIframe