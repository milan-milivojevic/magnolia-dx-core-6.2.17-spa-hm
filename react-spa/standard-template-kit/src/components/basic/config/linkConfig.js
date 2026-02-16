import React, { useRef } from 'react';
import { BsArrowRight, BsChevronRight } from "react-icons/bs";
import { TfiDownload } from "react-icons/tfi";
import styled from 'styled-components';
import { getRouterBasename } from '../../../helpers/AppHelpers';
import { ReactComponent as ArrowsIcon } from '../../../images/home/ArrowsIcon.svg';
import { ReactComponent as DownloadIcon } from '../../../images/home/DownloadIcon.svg';

const Wrapper = styled.div`
  .link:hover {
    background-color: ${(props) => props.hovBgColor && props.hovBgColor + "!important"};
    color: ${(props) => props.hovLabelColor && props.hovLabelColor + "!important"};
    border-color: ${(props) => props.hovBorderColor && props.hovBorderColor + "!important"};
  }
  .link svg { 
    color: ${(props) => props.defChevronColor && props.defChevronColor + "!important"};
  }
  .link:hover svg { 
    color: ${(props) => props.hovChevronColor && props.hovChevronColor + "!important"};
  }
`;

function LinkConfig ({
  linkType,
  page,
  external,
  download,
  linkLabel,
  linkLocation,
  linkPaddingTop,
  linkPaddingRight,
  linkPaddingBottom,
  linkPaddingLeft,
  labelDefaultColor,
  labelHoverColor,
  linkDefaultBackColor,
  linkHoverBackColor,
  linkBorderColor,
  linkBorderHoverColor,
  linkBorderWidth,
  linkBorderStyle,
  linkBorderRadius,
  linkWidth,
  linkHeight,
  linkHorizontalPosition,
  linkIcon,
  linkLabelDecoration,
  linkLabelVerticalPosition,
  linkLabelHorizontalPosition,
  linkLabelFontSize,
  linkFontFamily,
  linkLabelLineHeight,
  labelPaddingTop,
  labelPaddingBottom,
  labelPaddingRight,
  labelPaddingLeft,
  linkBold,
  linkItalic,
  chevronDefaultColor,
  chevronHoverColor,
  styleName
}) {

  const myRef = useRef(null);

  const handleClick = () => {
    const copyText = myRef.current.innerText;
    navigator.clipboard.writeText(copyText);
  };

  const baseUrl = process.env.REACT_APP_MGNL_HOST_NEW; 

  const downloadLink = download ? download['@link'] : baseUrl;
  const href = linkType === "page" ? (getRouterBasename() + page).replace("//", "/").replace("Home/Home", "Home") : linkType === "external" ? external : downloadLink;
  
  const linkIcons = linkIcon || "";

  const defBgColor = linkDefaultBackColor || null;
  const hovBgColor = linkHoverBackColor || defBgColor;
  const defLabelColor = labelDefaultColor || null;
  const hovLabelColor = labelHoverColor || defLabelColor; 
  const defChevronColor = chevronDefaultColor || null;
  const hovChevronColor = chevronHoverColor || defChevronColor;  
  const defBorderColor = linkBorderColor || null;
  const hovBorderColor = linkBorderHoverColor || defBorderColor;
  

  const linkComponentStyles = {
    paddingTop: linkPaddingTop || null,
    paddingRight: linkPaddingRight || null,
    paddingBottom: linkPaddingBottom || null,
    paddingLeft: linkPaddingLeft || null,
    justifyContent: linkHorizontalPosition || "left"
  }

  const linkStyles = {
    backgroundColor: defBgColor,
    color: defLabelColor,
    paddingTop: labelPaddingTop || null,
    paddingRight: labelPaddingRight || null,
    paddingBottom: labelPaddingBottom || null,
    paddingLeft: labelPaddingLeft || null,
    borderColor: defBorderColor,
    borderWidth: linkBorderWidth || null,
    borderStyle: linkBorderStyle || null,
    borderRadius: linkBorderRadius || null,
    width: linkWidth || "max-content",
    height: linkHeight || "max-content",
    textDecoration: linkLabelDecoration || "none",
    justifyContent: linkLabelHorizontalPosition || "center",
    alignItems: linkLabelVerticalPosition || "center",
    fontSize: linkLabelFontSize || null,
    fontSize: linkFontFamily || null,
    lineHeight: linkLabelLineHeight || null,
    fontWeight:  linkBold || null,
    fontStyle:  linkItalic || null
  }

  return (
    <Wrapper className='linkWrapper configComponents'
      hovBgColor={hovBgColor} 
      hovLabelColor={hovLabelColor}
      hovBorderColor={hovBorderColor}
      defChevronColor={defChevronColor}
      hovChevronColor={hovChevronColor}
    >
      <div className="copyStyleName">
        <h4>Style Name: <span className="copyText" ref={myRef}>{styleName || null}</span></h4>
        <button onClick={handleClick}>
          Copy Style Name
        </button>
      </div>
      <div className='linkComponent flex' style={linkComponentStyles} >
        <a className='link' href={href} target={linkLocation || "_blank"} rel="noreferrer" style={linkStyles}>
          {linkLabel || ""} 
          {linkIcons === "BsChevronRight" ? <BsChevronRight /> : linkIcons === "BsArrowRight" ? <BsArrowRight /> : linkIcons === "TfiDownload" ? <TfiDownload /> : ""}
        </a>
      </div>
    </Wrapper>
  )
}

export default LinkConfig;