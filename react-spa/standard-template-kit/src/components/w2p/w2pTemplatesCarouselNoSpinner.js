import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "../../styles/mediaPool/slick-theme.css"
import "../../styles/mediaPool/slick.css"
import { idSearch, templatesSearchService, newTemplates, recentlyUsedTemplates, favouriteTemplates } from '../../api/w2pSearchService'
import Card from './helpers/Card';
import CryptoJS from 'crypto-js';
import { aclCheck } from '../../helpers/ACL';

function W2PTemplatesCarousel({ 
  templateIds, 
  linkToSearchResult, 

  templatesSearchType,
  sortOrderTemplates,
  cardsLimit,

  detailsButton,
  favouritesButton,
  createDocumentButton,  
  copyLinkButton,

  slidesToShow, 
  slidesToScroll, 
  showDots, 
  loop,
  autoplay,

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
  navigationId,

  allowedGroups = [],
  deniedGroups = [],
  hideComponent = false
}) {

  const basicAclCheck = allowedGroups.length === 0 && deniedGroups.length === 0 && (hideComponent === false || hideComponent === "false");

  const [aclValue, setAclValue] = useState(false);
  
  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? true : false;
  

  // const initialSortOrder = sortOrderTemplates ? sortOrderTemplates : "creationDate,desc";
  // const splitedSortOrder = initialSortOrder.split(',');
  // const initialSortType = splitedSortOrder[0];
  // const initialSortDirection = splitedSortOrder[1] === "asc" ? "asc" : "desc";

  const initialSortOrder = sortOrderTemplates || null;
  const splitedSortOrder = initialSortOrder ? initialSortOrder.split(',') : [];
  const initialSortType = splitedSortOrder[0] || null;
  const initialSortDirection = splitedSortOrder[1] === "asc" ? "asc" : (splitedSortOrder[1] ? "desc" : null);


  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  
  const settings = {
    
    slidesToShow: parseInt(slidesToShow, 10) || 5,
    slidesToScroll: parseInt(slidesToShow, 10) || 5,
    speed: 500,
    autoplay: autoplay === "false" ? false : true,
    infinite: loop === "false" ? false : true,
    dots: showDots === "false" ? false : true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1, // Na manjim ekranima prikazuje samo 1 aset istovremeno
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1, // Na manjim ekranima prikazuje samo 1 aset istovremeno
        },
      },
    ],
    onInit: () => {
        resetTransform();
    },
  };

  const resetTransform = () => {
    var interval = setInterval(() => {
      // Delay the transformation to give react-slick time to update
      const slickList = sliderRef.current.innerSlider.list;
      if (slickList) {
        const slickTrack = slickList.querySelector('.slick-track');
        if (slickTrack) {
          slickTrack.style.transform = 'translate3d(0px, 0px, 0px)';
        }
      }
    }, 500);
    setTimeout(function( ) { clearInterval( interval ); }, 3000);
  };
  
  const templatesIdsArray = templateIds?.split(',').map(templateId => templateId.trim());


  const size = cardsLimit ? parseInt(cardsLimit, 10) > 40 ? 40 : parseInt(cardsLimit, 10) : null;
  const templatesIdsArrayLength = templatesIdsArray ? templatesIdsArray.length : 0;
  const calculatedSize = size ? size - templatesIdsArrayLength : 20 - templatesIdsArrayLength;  

  const templatesSearch = async () => {

    let url = new URL(linkToSearchResult);
    let searchParams = new URLSearchParams(url.search);  
    const encryptedData = searchParams.get('data');

    let decryptedData = undefined;
    if (encryptedData) {
      decryptedData = decryptData(encryptedData);
      searchParams = new URLSearchParams(decryptedData)
    }

    const query = searchParams.get('query') || "";
    const sortDirection = initialSortDirection || searchParams.get('sortDirection') || "desc";
    const sortType = initialSortType || searchParams.get('sortType') || "creationDate";
    const customSize = size || searchParams.get('size') || 20;
    const templatesIdsArrayLength = templatesIdsArray ? templatesIdsArray.length : 0;
    const calcCustomSize = parseInt(customSize, 10) > 40 ? 40 : parseInt(customSize, 10) - templatesIdsArrayLength;
    const offset = searchParams.get('offset') || 0;

    const selectedVdb = searchParams.get('selectedVdb') || null;
    const selectedColor = searchParams.get('selectedColor') || null;
    const selectedFormat = searchParams.get('selectedFormat') || null;
    const selectedOutput = searchParams.get('selectedOutput') || null;
    const selectedTemlateStatus = searchParams.get('selectedTemlateStatus') || null;

    const data = await templatesSearchService(query, sortType, sortDirection, calcCustomSize, offset, selectedVdb, selectedColor, selectedFormat, selectedOutput, selectedTemlateStatus);
    setProducts((prevProducts) => prevProducts.concat(data.rows));
  }

  const encryptionKey = "XkhZG4fW2t2W";

  const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, encryptionKey);

    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

  const getFavouriteTemplates = async () => {
    const response = await favouriteTemplates(size);
    setProducts([]);
    setProducts(response.rows);
  }

  const getRecentlyUsedTemplates = async () => {
    const response = await recentlyUsedTemplates(size);
    setProducts([]);
    setProducts(response.rows);
  }

  const getNewTemplates = async () => {
    const response = await newTemplates(size);
    setProducts([]);
    setProducts(response.rows);
  }

  const idsSearch = async () => {
    try {
      // const templatesData = await Promise.all(templatesIdsArray.map(async (templateId) => {
      //   const response = await idSearch(templateId);
      //   return response.rows;
      // }));
      const response = await idSearch(templatesIdsArray, initialSortType || "creationDate", initialSortDirection || "desc", size || templatesIdsArrayLength);
      const flattenedData = response.rows.flat();
      setProducts(flattenedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Prvi useEffect koji postavlja aclValue
    if (editMode === false && basicAclCheck === false) {
      async function fetchData() {
        try {
          const response = await aclCheck(allowedGroups, deniedGroups, hideComponent);
          setAclValue(response);
        } catch (error) {
          console.error("Greška prilikom izvršavanja aclCheck:", error);
        }
      }
    
      fetchData();
    } else setAclValue(true);
  });

  useEffect(() => {
    // Provera da li je aclValue postavljen na true
    if (aclValue === true) {
      // Ako je aclValue true, izvrši sledeće akcije
      templateIds && (!templatesSearchType || (templatesSearchType !== "favorites" && templatesSearchType !== "used" && templatesSearchType !== "new")) && idsSearch();
      linkToSearchResult && templatesSearchType && templatesSearchType === "searchLink" && templatesSearch();
      templatesSearchType && templatesSearchType === "favorites" && getFavouriteTemplates(calculatedSize);
      templatesSearchType && templatesSearchType === "used" && getRecentlyUsedTemplates(calculatedSize);
      templatesSearchType && templatesSearchType === "new" && getNewTemplates(calculatedSize);
    }
  }, [aclValue]);

  const buttonProps = {
    detailsButton,
    favouritesButton,
    createDocumentButton,
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

  if (editMode === false && aclValue === false && basicAclCheck === false) {
    return null; // Izlazak iz komponente ako aclCheck vrati false
  }

  return (
    <div className='mpCarouselWrapper' id={navigationId && navigationId}>
      {title &&
        <TitleLevel className="title" style={titleStyles}>
          {title}
        </TitleLevel>
      }
      {products && products.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {products.map(c => 
              <Card
                templateData={c}
                key={c.id}
                buttonProps={buttonProps}
              />
            )}
          </Slider>
        ) : (
          <div className='noResults'>No Results</div>
      )}
    </div>
  );
}

export default W2PTemplatesCarousel;