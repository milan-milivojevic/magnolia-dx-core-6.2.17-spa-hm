import React from 'react';
import { AiOutlineClose } from "react-icons/ai";
import Modal from 'react-modal';


const EmailModal = ({assetId, isOpen, closeModal}) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Email Modal"
      className="detailsReactModal"
    > 
      <div className='detailsModalWrapper iframe'>
        <div class="closeButtonWrapper">
          <button className="closeButton" onClick={closeModal}><AiOutlineClose/></button>
        </div>
        <div className='detailsModal w2p'>          
          <iframe className="detailsIframe"
                  title={"Send Email"}
                  src={'/MediapoolEmailMedia.do?popup=true&mediaGUID=' + assetId}
          ></iframe>
        </div>
      </div>      
    </Modal>
  );
};

export default EmailModal