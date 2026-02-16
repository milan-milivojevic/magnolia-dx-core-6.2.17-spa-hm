import React from "react";
import { EditableArea } from "@magnolia/react-editor";
import "../../css.css";
import { Helmet, HelmetProvider } from 'react-helmet-async';

function MainPage(props) {
  const { 
    title,
    pagesConfigComponent,
    headerConfigComponent,
    topNavConfigComponent,
    leftNavConfigComponent,
    navLevelsConfigComponent, 
    headlinesConfigComponent,
    paragraphsConfigComponent
  } = props;

  return (
    <HelmetProvider>
      <Helmet>
          <title>{title}</title>
      </Helmet>
      <div className="configComponentsPage">
        <h2 className="titles">Pages Configuration Component</h2>
        <div> {pagesConfigComponent && <EditableArea content={pagesConfigComponent} />}</div>
        <h2 className="titles">Header Configuration Component</h2>
        <div> {headerConfigComponent && <EditableArea content={headerConfigComponent} />}</div>
        <h2 className="titles">Top Navigation Configuration Component</h2>
        <div> {topNavConfigComponent && <EditableArea content={topNavConfigComponent} />}</div>
        <h2 className="titles">Left Navigation Configuration Component</h2>
        <div> {leftNavConfigComponent && <EditableArea content={leftNavConfigComponent} />}</div>
        <h2 className="titles">Navigation Levels Configuration Component</h2>
        <div> {navLevelsConfigComponent && <EditableArea content={navLevelsConfigComponent} />}</div>
        <h2 className="titles">Headlines Configuration Component</h2>
        <div> {headlinesConfigComponent && <EditableArea content={headlinesConfigComponent} />}</div>
        <h2 className="titles">Paragraphs Configuration Component</h2>
        <div> {paragraphsConfigComponent && <EditableArea content={paragraphsConfigComponent} />}</div>      
      </div>
    </HelmetProvider>
  );
}

export default MainPage;
