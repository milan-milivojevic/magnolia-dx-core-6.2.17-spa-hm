import React, { useState } from 'react'
import DownloadModal from '../modals/DownloadModal';
import EmailModal from '../modals/EmailModal';
import DetailsModal from '../modals/DetailsModal';
import { FiDownload, FiLink, FiMail } from "react-icons/fi";
import { GrZoomIn } from "react-icons/gr";
import { downloadFileDirect } from '../../../api/searchService';
import { getAPIBase } from '../../../helpers/AppHelpers';
import AssetPreview from './AssetPreview';
import AlertPopup from './AlertPopup';
import moment from "moment";

const Card = ({ fields, buttonProps }) => {

  const { downloadButton, emailButton, detailsButton, copyLinkButton } = buttonProps;

  const isDownloadButton = downloadButton === "true";
  const isEmailButton = emailButton === "true";
  const isDetailsButton = detailsButton === "true";
  const isCopyLinkButton = copyLinkButton === "true";

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMesage] = useState("");  
  
  const assetId = fields.id.value;
  const assetVersionCount = fields.versionCount.value - 1;
  const assetVersion = fields.versions.items[assetVersionCount].fields.versionNumber.value;
  const assetPageCount = fields.currentVersion.fields.fileResource.fields.pageCount.value
  const assetResourceType = fields.currentVersion.fields.fileResource.fields.fileResourceTypeName.value
  const selectedOption = 5;
  const language = 'en';
  const download_version = 'FIXED';
  
  var title = fields.title.value;
  const description = fields.description?.value || null;
  var lastUpdatedTime = fields.lastUpdatedTime.value;
  var uploadDate = fields.uploadDate.value;
  var owner = fields.owner.fields.formattedFullName.value;
  const vdb = fields.vdb.fields.name.value;
  var fileFormat = fields.currentVersion.fields.fileResource.fields.extension.value;
  const fileSize = fields.currentVersion.fields.fileResource.fields.fileSize.value + ' KB';
  var keywords = fields.keywords?.items || null;
  const linkToW2P = fields.customAttribute_126?.fields.value.value;
  const license = fields.license || null;

  owner = owner.replace(/,/g, "");
  lastUpdatedTime = moment(lastUpdatedTime).utc().format('MM/DD/YYYY');
  uploadDate = moment(uploadDate).utc().format('MM/DD/YYYY');
  fileFormat = fileFormat.toUpperCase();
  keywords = keywords?.join(', ');
  title = title
    .replace(/-/g, '_')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const dataProps = {
    assetId,
    assetVersion,
    assetPageCount,
    assetResourceType,
    vdb,
    title,
    description,
    lastUpdatedTime,
    uploadDate,
    owner,
    fileFormat,
    fileSize,
    keywords,
    linkToW2P,
    download_version,
    language,
    selectedOption,
    fields
  };
  
  const imageMouseEnter = () => {
    setIsImgHovered(true);
  };
  const imageMouseLeave = () => {
    setIsImgHovered(false);
  };

  const toggleDetailsModal = () => {
    setShowDetailsModal(!showDetailsModal);
    setIsImgHovered(false);
  }
  
  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  const openLink = (download_url, location) => {
    const a = document.createElement('a');
    a.setAttribute('href', download_url);
    a.setAttribute('target', location);
    a.click();
  };

  const downloadFile = async () => {

    const data = await downloadFileDirect(assetId, selectedOption, download_version, language, null);

    if (typeof data[0].download_url !== 'undefined') {          
      if (isMobileDevice()) {
        openLink(data[0].download_url, '_blank');
      } else {
        openLink(data[0].download_url, '_self');
      }
    }
  }   

  const toggleDownloadModal = () => {
    if (license) {
      setShowDownloadModal(!showDownloadModal);
      if (showDownloadModal) {
        setShowAlert(true);
        setMesage("Download Started");
        setTimeout(() => {
          setShowAlert(false);
        }, 2500);
      }
    } else {
      downloadFile();
      setIsImgHovered(false);
      setShowAlert(true);
      setMesage("Download Started");
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
    }    
  }

  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setIsImgHovered(false);
  }

  const toggleEmailModal = () => {
    setShowEmailModal(!showEmailModal);
    setIsImgHovered(false);
    if (showEmailModal) {
      setShowAlert(true);
      setMesage("Email Sent");
      setTimeout(() => {
        setShowAlert(false);
      }, 2500);
    }
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setIsImgHovered(false);
  }

  const baseURL = process.env.REACT_APP_MGNL_HOST_NEW; 
  const apiBase = getAPIBase();

  const internalLinkPath = `${baseURL}${apiBase}/Home/Search-Pages/MP-Search?query=${assetId}`;

  const copyInternalLink = () => {
    navigator.clipboard.writeText(internalLinkPath)
      .then(() => {
        setShowAlert(true);
        setMesage("Link Copied");
        setTimeout(() => {
          setShowAlert(false);
        }, 2500);
      })
  };

  const exernalLinkPath = `${baseURL}${apiBase}/web/mp/asset-details?assetId=${assetId}&skipHeader=true`;

  const copyExternalLink = () => {
    navigator.clipboard.writeText(exernalLinkPath)
      .then(() => {
        setShowAlert(true);
        setMesage("Link Copied");
        setTimeout(() => {
          setShowAlert(false);
        }, 2500);
      })
  };

  return (
    <div className='assetCard' onMouseEnter={imageMouseEnter} onMouseLeave={imageMouseLeave}>
      <div className='assetCardPreview' onClick={toggleDetailsModal}>
        <AssetPreview assetId={assetId} assetVersion={assetVersion} assetPageCount={assetPageCount} assetResourceType={assetResourceType} isModal={false}></AssetPreview>
      </div>      
      <div className={`assetActionButtons ${isImgHovered ? 'show' : ''}`}>
        {isDetailsButton && (
          <button onClick={toggleDetailsModal}><GrZoomIn/></button>
        )}
        {isDownloadButton && (
          <button onClick={toggleDownloadModal}><FiDownload/></button>
        )}
        {isCopyLinkButton && (
          <button onClick={copyExternalLink}><FiLink/></button>
        )}
        {isEmailButton && (
          <button onClick={toggleEmailModal}><FiMail/></button>
        )}
      </div>
      <div className='assetCardContent'>
        <h2 className='assetTitle'>{title}</h2>
        <p><span>Asset ID: </span>{assetId}</p>
        <p><span>Asset Contact: </span>{owner}</p>
        <p><span>Last change: </span>{lastUpdatedTime}</p>
        <div className='fileFormatWrapper'>
          <div className='fileFormat'>{fileFormat}</div>        
        </div>   
      </div>

      {showAlert && <AlertPopup showAlert={showAlert} alertMessage={message} />}

      {showDetailsModal && <DetailsModal {...dataProps} isOpen={showDetailsModal} onClose={toggleDetailsModal}></DetailsModal>}      
      {showDownloadModal && <DownloadModal assetId={assetId} license={license && license.fields} isOpen={showDownloadModal} onClose={toggleDownloadModal} closeModal={closeDownloadModal}></DownloadModal>}
      {showEmailModal && <EmailModal assetId={assetId} isOpen={showEmailModal} onClose={toggleEmailModal} closeModal={closeEmailModal}></EmailModal>}
    </div>
  )
}

export default Card