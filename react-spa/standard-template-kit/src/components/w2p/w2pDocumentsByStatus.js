import React, { useEffect, useState, useRef } from 'react';
import { myDocumentsService, inWorkDocumentsService, finalizedDocumentsService, rejectedDocumentsService, waitingApprovalDocumentsService, archivedDocumentsService  } from '../../api/w2pSearchService'
import DocumentCard from './helpers/DocumentCard';
import { aclCheck } from '../../helpers/ACL';


function W2PDocumentsByStatus ({  
  documentStatuses,
  sortOrderDocuments,
  cardsLimit,
  perRow,
  defaultView,

  detailsButton,
  editButton,  
  downloadButton,
  emailButton,
  deleteButton,

  title,
  titleLevel,
  titlePosition,
  titleFontFamily,
  titleColor,
  titleFontSize,
  titlePaddingTop,
  titlePaddingBottom,
  titlePaddingLeft,
  titlePaddingRight,

  allowedGroups = [],
  deniedGroups = [],
  hideComponent = false
}) {

  const elementRef = useRef(null);

  const basicAclCheck = allowedGroups.length === 0 && deniedGroups.length === 0 && (hideComponent === false || hideComponent === "false");
  
  const [aclValue, setAclValue] = useState(false);

  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? true : false;
  
  const initialSortOrder = sortOrderDocuments ? sortOrderDocuments : "modificationDate,desc";
  const splitedSortOrder = initialSortOrder.split(',');
  const initialSortType = splitedSortOrder[0];
  const initialSortDirection = splitedSortOrder[1] === "asc" ? "asc" : "desc"; 

  const size = cardsLimit ? Math.min(Number(cardsLimit), 60) : 24;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [products, setProducts] = useState([]);

  const getMyDocuments = async (size, sortType, sortDirection, offset) => {
    const response = await myDocumentsService(size, sortType, sortDirection, offset);    
    if (offset === 0) {
      setProducts([]);
      setProducts(response.rows);
    } else {
      setProducts((prev) => [...prev, ...response.rows]);
    }
    const hasMoreAssets = offset < response.results - size;
    setHasMore(hasMoreAssets);
  }

  const getInWorkDocuments = async (size, sortType, sortDirection, offset) => {
    const response = await inWorkDocumentsService(size, sortType, sortDirection, offset);
    if (offset === 0) {
      setProducts([]);
      setProducts(response.rows);
    } else {
      setProducts((prev) => [...prev, ...response.rows]);
    }
    const hasMoreAssets = offset < response.results - size;
    setHasMore(hasMoreAssets);
  }

  const getFinalizedDocuments = async (size, sortType, sortDirection, offset) => {
    const response = await finalizedDocumentsService(size, sortType, sortDirection, offset);
    if (offset === 0) {
      setProducts([]);
      setProducts(response.rows);
    } else {
      setProducts((prev) => [...prev, ...response.rows]);
    }
    const hasMoreAssets = offset < response.results - size;
    setHasMore(hasMoreAssets);
  }

  const getWaitingApprovalDocuments = async (size, sortType, sortDirection, offset) => {
    const response = await waitingApprovalDocumentsService(size, sortType, sortDirection, offset);
    if (offset === 0) {
      setProducts([]);
      setProducts(response.rows);
    } else {
      setProducts((prev) => [...prev, ...response.rows]);
    }
    const hasMoreAssets = offset < response.results - size;
    setHasMore(hasMoreAssets);
  }

  const getRejectedDocuments = async (size, sortType, sortDirection, offset) => {
    const response = await rejectedDocumentsService(size, sortType, sortDirection, offset);
    if (offset === 0) {
      setProducts([]);
      setProducts(response.rows);
    } else {
      setProducts((prev) => [...prev, ...response.rows]);
    }
    const hasMoreAssets = offset < response.results - size;
    setHasMore(hasMoreAssets);
  }

  const getArchivedDocuments = async (size, sortType, sortDirection, offset) => {
    const response = await archivedDocumentsService(size, sortType, sortDirection, offset);
    if (offset === 0) {
      setProducts([]);
      setProducts(response.rows);
    } else {
      setProducts((prev) => [...prev, ...response.rows]);
    }
    const hasMoreAssets = offset < response.results - size;
    setHasMore(hasMoreAssets);
  }

  useEffect(() => {
    if (editMode === false && basicAclCheck === false) {
      aclCheck(allowedGroups, deniedGroups, hideComponent)
        .then((response) => {
          setAclValue(response); 
        })
        .catch((error) => {
          console.error("Greška prilikom izvršavanja aclCheck:", error);
          setAclValue(false);
        });
    } else setAclValue(true);
  });

  useEffect(() => {
    if (aclValue === true) {
      documentStatuses && documentStatuses === "my" && getMyDocuments(size, initialSortType, initialSortDirection, 0);
      documentStatuses && documentStatuses === "in-work" && getInWorkDocuments(size, initialSortType, initialSortDirection, 0);
      documentStatuses && documentStatuses === "finalized" && getFinalizedDocuments(size, initialSortType, initialSortDirection, 0);
      documentStatuses && documentStatuses === "in-approval" && getWaitingApprovalDocuments(size, initialSortType, initialSortDirection, 0);
      documentStatuses && documentStatuses === "rejected" && getRejectedDocuments(size, initialSortType, initialSortDirection, 0);
      documentStatuses && documentStatuses === "archived" && getArchivedDocuments(size, initialSortType, initialSortDirection, 0);
      }
  }, [aclValue]);

  const loadMoreDocuments = () => {
    const currentOffset = offset + size;
    setOffset((prevOffset) => prevOffset + 25);
    if (documentStatuses === 'my') getMyDocuments(size, initialSortType, initialSortDirection, currentOffset);
    if (documentStatuses === 'in-work') getInWorkDocuments(size, initialSortType, initialSortDirection, currentOffset);
    if (documentStatuses === 'finalized') getFinalizedDocuments(size, initialSortType, initialSortDirection, currentOffset);
    if (documentStatuses === 'in-approval') getWaitingApprovalDocuments(size, initialSortType, initialSortDirection, currentOffset);
    if (documentStatuses === 'rejected') getRejectedDocuments(size, initialSortType, initialSortDirection, currentOffset);
    if (documentStatuses === 'archived') getArchivedDocuments(size, initialSortType, initialSortDirection, currentOffset);
  };

  const buttonProps = {
    detailsButton,
    editButton,
    emailButton,
    downloadButton,
    deleteButton,
  };

  const TitleLevel = titleLevel || "h1";

  const titleStyles = {
    fontFamily: titleFontFamily || null,
    textAlign:  titlePosition || null,
    fontSize: titleFontSize || null,
    color: titleColor || null,
    paddingTop: titlePaddingTop || null,
    paddingRight: titlePaddingRight || null,
    paddingBottom: titlePaddingBottom || null,
    paddingLeft: titlePaddingLeft || null
  }  

  if (editMode === false && aclValue === false && basicAclCheck === false) {
    return null;
  }
  
  return (
    <div className='mpSearchComponent w2p documents'>
      {title &&
        <TitleLevel className="title" style={titleStyles}>
          {title}
        </TitleLevel>
      }
      {products && products.length > 0 ? (
        <>
          <div className={`mpSearchContainer documentsByStatus ${defaultView}`} style={{ gridTemplateColumns: `repeat(${perRow ? perRow : 5}, 1fr)` }}>
            {products.map(c => 
              <DocumentCard
                documentData={c}
                key={c.id}
                buttonProps={buttonProps}
            />
            )}
          </div>
          {hasMore && (
            <div className="loadMoreItems" style={{ width: "100%" }} ref={elementRef}>
              <button type="button" onClick={() => loadMoreDocuments()}>
                Load More
              </button>
            </div>
          )}
        </>
        ) : (
          <div className='mpSearchContainer'>No Results</div>
      )}      
    </div>
  )

}

export default W2PDocumentsByStatus;