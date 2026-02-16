import React, { useState, useEffect } from "react";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { AiOutlineClose } from "react-icons/ai";
import { debounce } from 'lodash';
import { FixedSizeList } from 'react-window';

import tagsPayload from './payloads/tagsPayload.json';

export default function TagsFilter({ onUpdateSelectedTags, selectedTags }) {

  const [parents, setParents] = useState([]);
  const [initialParents, setInitialParents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [tempParents, setTempParents] = useState([]);

  const baseUrl = process.env.REACT_APP_MGNL_HOST_NEW;

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagsPayload)
    };

    fetch(`${baseUrl}/rest/mp/v1.1/search`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const transformedParents = mapData(data?.aggregations.tags.subGroups);
        setParents(transformedParents);
        setInitialParents(transformedParents);
      })
      .catch((error) => {
        console.error("Error while fetching data:", error);
      });
  }, [selectedTags]);

  const mapData = React.useMemo(() => {
    return (data) => {
      const mappedItems = data.map(item => {
        let mappedItem = {
          id: item.group,
          isChecked: selectedTags?.includes(item.group)
        };

        return mappedItem;
      });

      return mappedItems;
    };
  }, []);

  const toggleFilter = () => {
    if (!isFilterOpen) {
      const tempCheckStates = parents.map(parent => parent.isChecked);
      setTempParents(tempCheckStates);
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleParentCheckbox = (parentId) => {
    setParents((prevState) => {
      return prevState.map((parent) => {
        if (parent.id === parentId) {
          parent.isChecked = !parent.isChecked;
        }
        return parent;
      });
    });
  };

  const applySelection = () => {
    const values = [];

    parents.forEach(parent => {
      if (parent.isChecked) {
        values.push(parent.id);
      }
    });

    onUpdateSelectedTags(values);
    setIsFilterOpen(false);
  };

  const clearAll = () => {
    setParents(initialParents.map(parent => {
      parent.isChecked = false;
      return parent;
    }));
  };

  const cancel = () => {
    const resetParents = parents.map((parent, index) => {
      return {
        ...parent,
        isChecked: tempParents[index]
      };
    });
    setParents(resetParents);
    setIsFilterOpen(false);
  };

  const filteredParents = parents?.filter(parent => parent.id.toLowerCase().includes(filterValue.toLowerCase()));

  return (
    <div className="searchFilter keywords tags">
      <Button className="filterButton" onClick={toggleFilter}>
        Tags
      </Button>

      {isFilterOpen && (
        <div className="filterDropdown">
          <div className="filterOverlay" onClick={toggleFilter}></div>
          <div className="filterHeader">
            <div className="filterName">Tags</div>
            <div className="filtersFilter">
              <input
                type="text"
                placeholder="Filter tags..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
            <button className="closeFilter" onClick={toggleFilter}><AiOutlineClose /></button>
          </div>
          <div className="checkboxFormWrapper" key={parents.map(c => c.isChecked).join('-')}>
            <FixedSizeList
              className="fixedSizeList"
              height={300}
              width={300}
              itemCount={filteredParents.length}
              itemSize={35}
            >
              {({ index, style }) => (
                <div style={style} key={index}>
                  <div className="checkboxWrapper">
                    <FormControlLabel
                      className="checkboxForm"
                      label={filteredParents[index].id}
                      control={
                        <Checkbox
                          className="filterCheckbox"
                          checked={filteredParents[index].isChecked}
                          onChange={() => toggleParentCheckbox(filteredParents[index].id)}
                        />
                      }
                    />
                  </div>
                </div>
              )}
            </FixedSizeList>
          </div>
          <div className="filterActionButtons">
            <button className="clearButton" onClick={clearAll}>Clear All</button>
            <div>
              <button className="cancelButton" onClick={cancel}>Cancel</button>
              <button className="applyButton" onClick={applySelection}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
