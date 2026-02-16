import React, { useState, useEffect } from "react";
import MpSearch from "./mpSearch";
import W2PSearch from "./w2pSearch";
import StaticSearch from "./staticSearch";
import { IoSearchOutline } from 'react-icons/io5';

function GlobalSearch({
  sortOrder,  
  perPage,
  perRow,
  defaultView,
  downloadButton,
  emailButton,
  detailsButton,
  copyLinkButton,

  templatesSortOrder,
  templatesPerPage,
  templatesPerRow,
  templatesDefaultView,
  detailsTemplateButton,
  favouritesButton,
  createDocumentButton, 
  copyTemplateLinkButton
}) {

  const [currentView, setCurrentView] = useState('mp'); 
  const [query, setQuery] = useState("");
  const [tempQuery, setTempQuery] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const urlQuery = searchParams.get('query');

  useEffect(() => {
    setQuery(urlQuery);
    setTempQuery(urlQuery);
  },[]);

  const getPlaceholderText = (view) => {
    switch (view) {
      case 'mp':
        return "Search Assets...";
      case 'w2p':
        return "Search Templates...";
      case 'static':
        return "Search Content...";
      default:
        return "Search Assets...";
    }
  };

  return (
    <div className="globalSearch">

        <div className="globalSearchHeader">
          <div className="globalSearchButtons">
            <button className={currentView === 'mp' ? "active" : null} onClick={() => setCurrentView('mp')}>
              MP Search
            </button>
            <button className={currentView === 'w2p' ? "active" : null} onClick={() => setCurrentView('w2p')}>
              W2P Search
            </button>
            <button className={currentView === 'static' ? "active" : null} onClick={() => setCurrentView('static')}>
              Content Search
            </button>
          </div>

          <div className="flex headerSearch">
            <input
              className="searchInput"
              type="text"
              placeholder={getPlaceholderText(currentView)}
              value={tempQuery}
              onChange={(e) => setTempQuery(e.target.value)}       
              onKeyDown={(e) => e.key === 'Enter' && setQuery(e.target.value)}      
            />
            <button type="button" 
              onClick={() => setQuery(tempQuery)}              
            >
              <IoSearchOutline />
            </button>
          </div>
        </div>
        {currentView === 'mp' &&
          <MpSearch
            globalQuery={query}
            perPage={perPage}
            perRow={perRow}
            sortOrder={sortOrder}
            defaultView={defaultView}
            downloadButton={downloadButton}
            emailButton={emailButton}
            detailsButton={detailsButton}
            copyLinkButton={copyLinkButton}
          />
        }
        {currentView === 'w2p' &&
          <W2PSearch
            globalQuery={query}
            sortOrderTemplates={templatesSortOrder}
            perPage={templatesPerPage}
            perRow={templatesPerRow}
            defaultView={templatesDefaultView}
            detailsButton={detailsTemplateButton}
            favouritesButton={favouritesButton}
            createDocumentButton={createDocumentButton}
            copyLinkButton={copyTemplateLinkButton}
          />
        }
        {currentView === 'static' &&
          <StaticSearch 
            globalQuery={query}
          />
        }
    </div>
  );
}

export default GlobalSearch;
