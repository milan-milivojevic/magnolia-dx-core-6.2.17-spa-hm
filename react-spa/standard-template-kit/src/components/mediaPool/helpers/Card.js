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

  /* ButtonProps Decomposition */
  const { downloadButton, emailButton, detailsButton, copyLinkButton } = buttonProps;

  /* Setting the "state" for each button based on the state of the checkbox in the component's dialog */
  const isDownloadButton = downloadButton === "true";
  const isEmailButton = emailButton === "true";
  const isDetailsButton = detailsButton === "true";
  const isCopyLinkButton = copyLinkButton === "true";

  /* Defining state variables */
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMesage] = useState("");  
  
  /* Creating variables based on "fields" prop obtained from API call in the parent component */
  // Variables for developers (API Calls, Downloads, Mail, etc.)
  const assetId = fields.id.value;
  const assetVersionCount = fields.versionCount.value - 1;
  const assetVersion = fields.versions.items[assetVersionCount].fields.versionNumber.value;
  const assetPageCount = fields.currentVersion.fields.fileResource.fields.pageCount.value
  const assetResourceType = fields.currentVersion.fields.fileResource.fields.fileResourceTypeName.value
  const selectedOption = 5;
  const language = 'en';
  const download_version = 'FIXED';
  
  /* Variables for displaying data */
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

  /* Transforming variables into useful values */
  owner = owner.replace(/,/g, "");
  lastUpdatedTime = moment(lastUpdatedTime).utc().format('MM/DD/YYYY');
  uploadDate = moment(uploadDate).utc().format('MM/DD/YYYY');
  fileFormat = fileFormat.toUpperCase();
  keywords = keywords?.join(', ');
  title = title // This is optional, some clients may require default titles
    .replace(/-/g, '_') // Replace dashes with underscores
    .split('_') // Split the string by underscores into an array
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join the words back together with spaces

  /* Object for passing data to Details Modals */  
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
  
  /* Add/remove image hover effect */
  const imageMouseEnter = () => {
    setIsImgHovered(true);
  };
  const imageMouseLeave = () => {
    setIsImgHovered(false);
  };

  /* Open/Close Details Modal */
  const toggleDetailsModal = () => {
    setShowDetailsModal(!showDetailsModal);
    setIsImgHovered(false);
  }
  
  /* Checking device type */
  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  /* Trigger download based on link location */
  const openLink = (download_url, location) => {
    const a = document.createElement('a');
    a.setAttribute('href', download_url);
    a.setAttribute('target', location);
    a.click();
  };

  /* Direct download function */
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

  /* Open/Close Download Modal if license exist or Direct asset download if no license */
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

  /* For closing Download Modal without alert */
  const closeDownloadModal = () => {
    setShowDownloadModal(false);
    setIsImgHovered(false);
  }

  /* Open/Close Email Modal */
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

  /* For closing Email Modal without alert */
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setIsImgHovered(false);
  }

  /*Copy link variables*/
  const baseURL = process.env.REACT_APP_MGNL_HOST_NEW; 
  const apiBase = getAPIBase();

  /* Copy link to asset - Internal (MP Search) */
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

  /* Copy link to asset - External (MP Module) */
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
        {/* {description && 
          <p className='assetDescription'><span>Description:</span>{description}</p>
        } */}
        <p><span>Asset ID: </span>{assetId}</p>
        <p><span>Asset Contact: </span>{owner}</p>
        {/* <p><span>File Size:</span>{fileSize}</p>
        <p><span>VDB:</span>{vdb}</p>
        <p><span>Upload Date:</span>{uploadDate}</p> */}
        <p><span>Last change: </span>{lastUpdatedTime}</p>            
        {/* {keywords && 
          <ul className='assetKeywords'>
            {keywords.map(keyword => <li className='Keyword ID' key={keyword}>{keyword}</li>)}
          </ul>
        } */}
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