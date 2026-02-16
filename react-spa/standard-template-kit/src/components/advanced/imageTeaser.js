import React, { useState, useEffect, useRef } from 'react';
import { BsArrowRight, BsChevronRight } from "react-icons/bs";
import { TfiDownload } from "react-icons/tfi";
import { getAPIBase, getRouterBasename } from '../../helpers/AppHelpers';
import styled from 'styled-components';
import { ReactComponent as ArrowsIcon } from '../../images/home/ArrowsIcon.svg';
import { ReactComponent as DownloadIcon } from '../../images/home/DownloadIcon.svg';

const Wrapper = styled.div`
  .link:hover {
    background-color: ${(props) => props.hovLinkBgColor && props.hovLinkBgColor + "!important"};
    color: ${(props) => props.hovLabelColor && props.hovLabelColor + "!important"};
    border-color: ${(props) => props.hovLinkBorderColor && props.hovLinkBorderColor + "!important"};
  }
  .link svg { 
    color: ${(props) => props.defChevronColor && props.defChevronColor + "!important"};
  }
  .link:hover svg { 
    color: ${(props) => props.hovChevronColor && props.hovChevronColor + "!important"};
  }
}`

function ImageTeaser ({
  headline,   
  headlineLevel,
  headlineFontFamily,
  headlinePosition,
  headlineBackground,
  headlineTextTransform,
  addArrows,
  arrowsHeight,
  headlineFontSize,
  headlineLineHeight,
  headlineItalic,
  headlineBold,
  headlineLetterSpacing,
  headlineColor,
  headlinePaddingTop,
  headlinePaddingRight,
  headlinePaddingBottom,
  headlinePaddingLeft,
  headlineMarginTop,
  headlineMarginRight,
  headlineMarginBottom,
  headlineMarginLeft,
  description,
  descriptionBackground,
  descriptionAlign,
  descriptionStyle,
  descriptionColor,
  descriptionPaddingTop,
  descriptionPaddingRight,
  descriptionPaddingBottom,
  descriptionPaddingLeft,
  descriptionBorderRadius,
  descriptionBorderColor,
  descriptionBorderStyle,
  descriptionBorderWidth,
  image,
  linkType,
  page,
  external,
  download,
  linkLabel,
  linkLocation,
  linkIcon,
  linkPaddingTop,
  linkPaddingRight,
  linkPaddingBottom,
  linkPaddingLeft,
  linkBorderColor,
  linkBorderHoverColor,
  linkBorderWidth,
  linkBorderStyle,
  linkBorderRadius,
  linkWidth,
  linkHeight,      
  linkDefaultBackColor,
  linkHoverBackColor,
  labelDefaultColor,
  labelHoverColor,  
  linkLabelDecoration,
  linkLabelVerticalPosition,
  linkLabelHorizontalPosition,
  linkBold,
  linkItalic,
  chevronDefaultColor,
  chevronHoverColor,
  linkLabelFontSize,
  linkLabelLineHeight,
  labelPaddingTop,
  labelPaddingBottom,
  labelPaddingRight,
  labelPaddingLeft,
  componentPaddingTop,
  componentPaddingRight,
  componentPaddingBottom,
  componentPaddingLeft,
  componentBorderColor,
  componentBorderHoverColor,
  componentBorderWidth,
  componentBorderStyle,
  componentBorderRadius,
  componentWidth,
  componentHeight,
  componentPosition,    
  teaserLayout,
  descLinkLayout,
  descRowLayoutWidth,
  linkRowLayoutWidth,
  descLinkGap,
  descLinkPosition,
  linkHorizontalPosition,
  linkVerticalPosition,
  clickableComponent,
  linkStyleName,
  linkNoStyles,
  styleName,
  noStyles,
  }) {

    
  const baseUrl = process.env.REACT_APP_MGNL_HOST_NEW;
  const apiBase = getAPIBase();
  const restPath = process.env.REACT_APP_MGNL_API_PAGES;
  const nodeName = process.env.REACT_APP_MGNL_APP_BASE;    

  const [configProps, setConfigProps] = useState();

  useEffect(() => {
    fetch(`${apiBase}${restPath}${nodeName}/Config-Pages/Teasers-Config/imageTeaserComponents/@nodes`)
      .then(response => response.json())
      .then(data => {
        let result = data.find(item => item.styleName === styleName);
        if (!result && noStyles === (false || "false")) {
          result = data[0];
        } else if (noStyles !== (false || "false")) {
          result = null;
        } 
        setConfigProps(result);
      });
  }, [styleName, noStyles, apiBase, restPath, nodeName]);
  
  const [linkConfigProps, setLinkConfigProps] = useState();

  useEffect(() => {
    fetch(`${apiBase}${restPath}${nodeName}/Config-Pages/Basics-Config/linkComponents/@nodes`)
      .then(response => response.json())
      .then(data => {
        let styleName =  linkStyleName || configProps?.linkStyleName || null;
        let result = data.find(item => item.styleName === styleName );
        if (!result && linkNoStyles === (false || "false")) {
          result = data[0];
        } else if (linkNoStyles !== (false || "false")) {
          result = null;
        } 
        setLinkConfigProps(result);
      });
  }, [linkStyleName, linkNoStyles, configProps?.linkStyleName, apiBase, restPath, nodeName]);

  const dimensionsRef = useRef()

  const useContainerDimensions = myRef => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0})
    const myRefCurrent = myRef.current;

    useEffect(() => {
      
      const getDimensions = () => ({
        width: myRefCurrent.offsetWidth,
        height: myRefCurrent.offsetHeight,
        // headlineHeight: myRefCurrent.offsetHeight,
        // descLinkHeight: myRefCurrent.offsetHeight,
      })  
      const handleResize = () => {
        setDimensions(getDimensions())
      }
      if (myRefCurrent) {
        setDimensions(getDimensions());
        var interval = setInterval(() => {
        setDimensions(getDimensions())} , 200);
        setTimeout(function( ) { clearInterval( interval ); }, 5000);
      }
      window.addEventListener("resize", handleResize)  
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [myRefCurrent])

    return dimensions;
  };  

  const { width, height } = useContainerDimensions(dimensionsRef);

  const openLink = () => {
    window.open(href, linkLocation || configProps?.linkLocation || linkConfigProps?.linkLocation || "_blank");
  };

  const HeadlineLevel = headlineLevel || configProps?.headlineLevel || "h1";  
  const downloadLink = download ? download['@link']: baseUrl;
  const href = linkType === "page" ? (getRouterBasename() + page).replace("//", "/").replace("Home/Home", "Home") : linkType === "external" ? external : downloadLink;


  const cursorPointer = clickableComponent === "true" ? "cursorPointer" : configProps?.clickableComponent === "true" ? "cursorPointer" : null;

  const defBorderColor = componentBorderColor || configProps?.componentBorderColor || null;
  const hovBorderColor = componentBorderHoverColor || configProps?.componentBorderHoverColor || defBorderColor;

  const defLinkBgColor = linkDefaultBackColor || configProps?.linkDefaultBackColor || linkConfigProps?.linkDefaultBackColor || null;
  const hovLinkBgColor = linkHoverBackColor || configProps?.linkHoverBackColor ||  linkConfigProps?.linkHoverBackColor || defLinkBgColor;

  const defLabelColor = labelDefaultColor || configProps?.labelDefaultColor || linkConfigProps?.labelDefaultColor || null;
  const hovLabelColor = labelHoverColor || configProps?.labelHoverColor || linkConfigProps?.labelHoverColor || defLabelColor; 

  const defChevronColor = chevronDefaultColor || configProps?.chevronDefaultColor || linkConfigProps?.chevronDefaultColor || null;
  const hovChevronColor = chevronHoverColor || configProps?.chevronHoverColor || linkConfigProps?.chevronHoverColor || defChevronColor;

  const defLinkBorderColor = linkBorderColor || configProps?.linkBorderColor || linkConfigProps?.linkBorderColor || null;
  const hovLinkBorderColor = linkBorderHoverColor || configProps?.linkBorderHoverColor || linkConfigProps?.linkBorderHoverColor || defLinkBorderColor;

  const linkIcons = linkIcon || configProps?.linkIcon || linkConfigProps?.linkIcon || null;

  const imageTeaserComponentStyles = {
    width: componentWidth || configProps?.componentWidth || null,
    height: componentHeight || configProps?.componentHeight || null,
    margin: componentPosition || configProps?.componentPosition || null    
  }

  const imageTeaserStyles = {
    width: width || componentWidth || configProps?.componentWidth || null,
    height: height || componentHeight || configProps?.componentHeight || null,
    justifyContent: teaserLayout || configProps?.teaserLayout || null,    
    paddingTop: componentPaddingTop || configProps?.componentPaddingTop || null,
    paddingRight: componentPaddingRight || configProps?.componentPaddingRight || null,
    paddingBottom: componentPaddingBottom || configProps?.componentPaddingBottom || null,
    paddingLeft: componentPaddingLeft || configProps?.componentPaddingLeft || null,
    borderColor: componentBorderColor || configProps?.componentBorderColor || null,
    borderWidth: componentBorderWidth || configProps?.componentBorderWidth || null,
    borderStyle: componentBorderStyle || configProps?.componentBorderStyle || null,
    borderRadius: componentBorderRadius || configProps?.componentBorderRadius || null
  }

  const headlineWrapperStyles = {
    display: "flex",
    justifyContent: headlinePosition || configProps?.headlinePosition || null
  }

  const headlineStyles = {
    fontFamily: headlineFontFamily || configProps?.headlineFontFamily || null,
    fontSize: headlineFontSize || configProps?.headlineFontSize || null,
    lineHeight: headlineLineHeight || configProps?.headlineLineHeight || null,
    color: headlineColor || configProps?.headlineColor || null,
    letterSpacing: headlineLetterSpacing || configProps?.headlineLetterSpacing || null,
    fontWeight: headlineBold || configProps?.headlineBold || null,
    fontStyle: headlineItalic || configProps?.headlineItalic || null,
    textTransform: headlineTextTransform || null,
    paddingTop: headlinePaddingTop || configProps?.headlinePaddingTop || null,
    paddingRight: headlinePaddingRight || configProps?.headlinePaddingRight || null,
    paddingBottom: headlinePaddingBottom || configProps?.headlinePaddingBottom || null,
    paddingLeft: headlinePaddingLeft || configProps?.headlinePaddingLeft || null,
    marginTop: headlineMarginTop || configProps?.headlineMarginTop || null,
    marginRight: headlineMarginRight || configProps?.headlineMarginRight || null,
    marginBottom: headlineMarginBottom || configProps?.headlineMarginBottom || null,
    marginLeft: headlineMarginLeft || configProps?.headlineMarginLeft || null
  }

  const descriptionLinkWrapperStyles = {
    flexDirection: descLinkLayout || configProps?.descLinkLayout || "column",
    gap: descLinkGap || configProps?.descLinkGap || null,
    alignItems: descLinkPosition || configProps?.descLinkGap || null
  }

  const descriptionStyles = {
    width: descRowLayoutWidth || configProps?.descRowLayoutWidth || null,
    paddingTop: descriptionPaddingTop || configProps?.descriptionPaddingTop || null,
    paddingRight: descriptionPaddingRight || configProps?.descriptionPaddingRight || null,
    paddingBottom: descriptionPaddingBottom || configProps?.descriptionPaddingBottom || null,
    paddingLeft: descriptionPaddingLeft || configProps?.descriptionPaddingLeft || null,
    borderColor: descriptionBorderColor || configProps?.descriptionBorderColor || null,
    borderWidth: descriptionBorderWidth || configProps?.descriptionBorderWidth || null,
    borderStyle: descriptionBorderStyle || configProps?.descriptionBorderStyle || null,
    borderRadius: descriptionBorderRadius || configProps?.descriptionBorderRadius || null,
    textAlign: descriptionAlign || configProps?.descriptionAlign || null,
    color: descriptionColor || configProps?.descriptionColor || null
  }

  const linkComponentStyles = {
    width: linkRowLayoutWidth || configProps?.linkRowLayoutWidth || null,
    paddingTop: linkPaddingTop || configProps?.linkPaddingTop || linkConfigProps?.linkPaddingTop || null,
    paddingRight: linkPaddingRight || configProps?.linkPaddingRight || linkConfigProps?.linkPaddingRight || null,
    paddingBottom: linkPaddingBottom || configProps?.linkPaddingBottom || linkConfigProps?.linkPaddingBottom || null,
    paddingLeft: linkPaddingLeft || configProps?.linkPaddingLeft || linkConfigProps?.linkPaddingLeft || null,  
    justifyContent: linkHorizontalPosition || configProps?.linkHorizontalPosition || "flex-start",
    alignItems: linkVerticalPosition || configProps?.linkVerticalPosition || "flex-start"                  
  }

  const linkStyles = {
    backgroundColor: defLinkBgColor,
    color: defLabelColor,
    paddingTop: labelPaddingTop || configProps?.labelPaddingTop || linkConfigProps?.labelPaddingTop || null,
    paddingRight: labelPaddingRight || configProps?.labelPaddingRight || linkConfigProps?.labelPaddingRight || null,
    paddingBottom: labelPaddingBottom || configProps?.labelPaddingBottom || linkConfigProps?.labelPaddingBottom || null,
    paddingLeft: labelPaddingLeft || configProps?.labelPaddingLeft || linkConfigProps?.labelPaddingLeft || null, 
    borderColor: linkBorderColor || configProps?.linkBorderColor || linkConfigProps?.linkBorderColor || null,
    borderWidth: linkBorderWidth || configProps?.linkBorderWidth || linkConfigProps?.linkBorderWidth || null,
    borderStyle: linkBorderStyle || configProps?.linkBorderStyle || linkConfigProps?.linkBorderStyle || null,
    borderRadius: linkBorderRadius || configProps?.linkBorderRadius || linkConfigProps?.linkBorderRadius || null,
    width: linkWidth || configProps?.linkWidth || linkConfigProps?.linkWidth || "max-content",
    height: linkHeight || configProps?.linkHeight || linkConfigProps?.linkHeight || "max-content",
    textDecoration: linkLabelDecoration || configProps?.linkLabelDecoration || linkConfigProps?.linkLabelDecoration || "none",
    justifyContent: linkLabelHorizontalPosition || configProps?.linkLabelHorizontalPosition || linkConfigProps?.linkLabelHorizontalPosition || "center",
    alignItems: linkLabelVerticalPosition || configProps?.linkLabelVerticalPosition || linkConfigProps?.linkLabelVerticalPosition || "center",
    fontSize: linkLabelFontSize || configProps?.linkLabelFontSize || linkConfigProps?.linkLabelFontSize || null,
    lineHeight: linkLabelLineHeight || configProps?.linkLabelLineHeight || linkConfigProps?.linkLabelLineHeight || null,
    fontWeight: linkBold || configProps?.linkBold || linkConfigProps?.linkBold || null,
    fontStyle: linkItalic || configProps?.linkItalic || linkConfigProps?.linkItalic || null
  }

  const addArrowsVar = addArrows || configProps?.addArrows || "false";
  const arrowsHeightVar = {height: arrowsHeight || configProps?.arrowsHeight || null};

  return (    
    <Wrapper className='imageTeaserWrapper'
      hovBorderColor={hovBorderColor}
      hovLinkBgColor={hovLinkBgColor}
      hovLabelColor={hovLabelColor}
      hovLinkBorderColor={hovLinkBorderColor}
      defChevronColor={defChevronColor}
      hovChevronColor={hovChevronColor}
    >
      <div className={`imageTeaserComponent flex`} style={imageTeaserComponentStyles}>
        <img className="image" ref={dimensionsRef} src={image['@link']} alt="" />
        <div className={`imageTeaser flexColumn ${cursorPointer}`} 
             onClick={clickableComponent === "true" ? openLink : configProps?.clickableComponent === "true" ? openLink : null}
             style={imageTeaserStyles}
        > {headline &&    
            <div className='headlineWrapper' style={headlineWrapperStyles}>
              <HeadlineLevel className={`headline ${headlineBackground || configProps?.headlineBackground}`} style={headlineStyles}>
                <span className='customHeadlineArrows' style={arrowsHeightVar}>
                  {(addArrowsVar !== "false" || false) && <ArrowsIcon/>}
                </span>{headline || null}
              </HeadlineLevel>
            </div>
          }           
          <div className='descriptionLinkWrapper flex' style={descriptionLinkWrapperStyles}>
            {description &&
              <div className={`description ${descriptionStyle || configProps?.descriptionStyle || null} ${descriptionBackground || configProps?.descriptionBackground}`}
                   dangerouslySetInnerHTML={{ __html:description || null }}
                   style={descriptionStyles}></div>
            }
            {(linkIcons || linkLabel) &&
              <div className='linkComponent flex' style={linkComponentStyles}>
                <a className='link' href={href} target={linkLocation || configProps?.linkLocation || linkConfigProps?.linkLocation || "_blank"} rel="noreferrer" style={linkStyles}>
                  {linkLabel ? linkLabel : ""}
                  {linkIcons === "BsChevronRight" ? <BsChevronRight /> : linkIcons === "BsArrowRight" ? <BsArrowRight /> : linkIcons === "TfiDownload" ? <TfiDownload /> : ""}
                </a>
              </div>
            }
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default ImageTeaser;
