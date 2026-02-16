import React from 'react';
import '../css.css';
import {events, getRouterBasename} from "../helpers/AppHelpers";

function RedirectPage ({
  linkType,
  page,
  external,
}) {
  const isPagesApp = window.location.search.includes("mgnlPreview");
  const editMode = isPagesApp ? "editMode" : "";

  const href = linkType === "page" ? page : external;

  const hrefPage = (getRouterBasename() + href.replace(process.env.REACT_APP_MGNL_APP_BASE, "")).replace("//", "/").replace("Home/Home", "Home");

  React.useEffect(() => {
    if (!editMode && href && linkType === "page") {
      window.history.pushState({}, "", hrefPage);
      events.emit("popstate");
    } else if (!editMode && href && linkType === "external") {      
      window.open(href, '_blank');
      window.history.pushState({}, "", getRouterBasename());
      events.emit("popstate");
    }
  }, [editMode, href, hrefPage, linkType]);


  return (
    <>
      {editMode ? (
        <p style={{padding: "50px 25px", fontWeight: "bold", fontSize: "16px"}}>This is a redirect template. On public instances or in preview this page will be redirected to: {`${page || external || ""}`}</p>
      ) : null}
    </>
  );

}

export default RedirectPage;