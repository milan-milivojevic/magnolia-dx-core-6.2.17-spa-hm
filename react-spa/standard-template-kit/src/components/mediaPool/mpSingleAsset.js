import React, { useState, useEffect } from 'react';
import { idSearch } from '../../api/searchService'
import Card from './helpers/Card';

function MpSingleAsset ({ 
  assetId,
  defaultView,
  
  downloadButton,
  emailButton,
  detailsButton,
  copyLinkButton,

  title,
  titleLevel,
  titlePosition,
  titleFontFamily,
  titleColor,
  titleFontSize,
  titlePaddingTop,
  titlePaddingBottom,
  titlePaddingLeft,
  titlePaddingRight
}) {

  const [products, setProducts] = useState([]);
  
  const searchById = async (assetId) => {
    const response = await idSearch(assetId);
    setProducts([]);
    setProducts([response]);
  }

  useEffect(() => {
    searchById(assetId);
  }, [assetId]);

  const buttonProps = {
    downloadButton,
    emailButton,
    detailsButton,
    copyLinkButton,
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

  return (
    <div className={`mpAssetWrapper ${defaultView}`}>
      {title &&
        <TitleLevel className="title" style={titleStyles}>
          {title}
        </TitleLevel>
      }
      {products && products.length > 0 ? (
          products.map(c => 
            <Card
              fields={c.fields}
              key={c.fields.id.value}
              buttonProps={buttonProps}
            />
          )
        ) : (
          <div className='noResults'>No Results</div>
      )}
    </div>
  )
}

export default MpSingleAsset;