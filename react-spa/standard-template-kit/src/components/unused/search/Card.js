import React from 'react'
// import second from 'style'
import styled from "styled-components"

const CardStyle = styled.div`
  width: 300px;
  margin: 10px;
  border: 1px solid black;
  border-radius: 4px;
  padding: 10px;

  h2 {
    font-size: 18px;
  }
`

const Keywords = styled.ul`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  list-style: none;

  li {
    padding: 5px;
    background-color: yellowgreen;
    cursor: pointer;
  }
`
const Card = ({ fields }) => {
  return (
    <CardStyle>
      <h2>{fields.title.value}</h2>
      {fields.description && <p>DESC: {fields.description.value}</p>}
      <p>Asset ID: {fields.id.value}</p>
      <p>Upload Date: {fields.uploadDate.value}</p>
      <p>Last change: {fields.lastUpdatedTime.value}</p>
      {fields.keywords?.items && (
        <Keywords>
          {fields.keywords?.items.map(keyword => <li key={keyword} >{keyword}</li>)}
        </Keywords>
      )}
    </CardStyle>
  )
}

export default Card