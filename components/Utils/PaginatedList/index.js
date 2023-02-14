import React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';

/*
parent page sets up state variable for pagination obj and manage state updates to pagination obj
pagination Obj should be passed from parent page to pagination component
type of paginationObj:
{
	items: [],
	ordering: {direction: "asc", field: "name"},
	filters: {color: "blue"},
	cursor: 0,
	complete: false,
	batch: 10
}
pagination page has setter for paginationObj.
pass repeated var to pagination component
Also need to have lib function for both ssr and csr portions that takes in
(cursor, paginationObj.batch, paginationObj.ordering, paginationObj.filters)
and returns
{nodes, cursor, complete}
*/
const PaginatedList = ({ paginationState, PaginationCard }) => {
  const [paginationObj, setPaginationObj] = paginationState;
  const { getItems } = paginationObj;
  const [loading, setLoading] = useState(false);
  const filtering = (items) => {
    const filters = paginationObj.filters;
    return items.filter((item) => {
      const filterKeys = Object.keys(filters);
      const passFilters = filterKeys.map((key) => {
        if (typeof filters[key] === 'function') {
          return filters[key](item[key]);
        }
        if (item[key] !== filters[key]) {
          return false;
        }
      });
      return !passFilters.includes(false);
    });
  };

  const [cursor, setCursor] = useState(paginationObj.cursor);
  const [complete, setComplete] = useState(paginationObj.complete);
  let observer = useRef();
  const fetchPage = async (currentPaginationObj) => {
    if (complete) {
      return;
    }
    const {
      nodes,
      cursor: newCursor,
      complete: newComplete,
    } = await getItems(cursor, paginationObj.batch, paginationObj.ordering, paginationObj.filters);
    setCursor(newCursor);
    setPaginationObj({ ...currentPaginationObj, items: [...currentPaginationObj.items, ...nodes] });
    setComplete(newComplete);
  };
  useEffect(() => {
    let cancel = false;
    const fetchWhenEmpty = () => {
      if (paginationObj.items.length === 0 && !complete && !cancel) {
        fetchPage(paginationObj);
      }
    };
    fetchWhenEmpty();
  }, [paginationObj.items.length, complete]);
  const lastElem = useCallback(
    async (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (node) {
        let options = {
          rootMargin: '100px',
          threshold: 0.1,
        };
        const callback = async (entries) => {
          if (entries[0].isIntersecting && !complete && !loading) {
            setLoading(true);
            await fetchPage(paginationObj);
            setLoading(false);
          }
        };
        observer.current = new IntersectionObserver(callback, options);
        observer.current.observe(node);
      }
    },
    [paginationObj]
  );
  const filteredItems = filtering(paginationObj.items);
  return (
    <div>
      {filteredItems.map((item, index) => {
        return (
          <div key={index} ref={index === filteredItems.length - 1 ? lastElem : null} className='pagination'>
            <PaginationCard item={item} />
          </div>
        );
      })}
    </div>
  );
};
export default PaginatedList;
