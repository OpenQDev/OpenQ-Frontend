import React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';

/*
parent page sets up state variable for pagination obj and manage state updates to pagination obj
pagination Obj should be passed from parent page to pagination component
type of paginationObj:
{
	items: [],
	ordering: {direction: "desc", field: "name"},
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
const PaginatedList = ({
  paginationState,
  PaginationCard,
  className,
  singleSubmission,
  setSingleSubmission,
  setFilteredLength,
}) => {
  const [paginationObj, setPaginationObj] = paginationState;
  const { getItems, filterFunction, filters, fetchFilters, cursor, complete } = paginationObj;
  const [loading, setLoading] = useState(false);
  const filtering = (items, filters, fetchFilters) => {
    return items.filter((item) => {
      return filterFunction(item, filters, fetchFilters);
    });
  };
  let observer = useRef();
  const fetchPage = async (currentPaginationObj) => {
    if (complete) {
      return;
    }
    const {
      nodes,
      cursor: newCursor,
      complete: newComplete,
    } = await getItems(cursor, paginationObj.batch, paginationObj.ordering, paginationObj.fetchFilters);
    console.log('getItems', nodes);

    setPaginationObj({
      ...currentPaginationObj,
      items: [...currentPaginationObj.items, ...nodes],
      complete: newComplete,
      cursor: newCursor,
    });
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
  const filteredItems = filtering(paginationObj.items, filters, fetchFilters);
  useEffect(() => {
    setFilteredLength && setFilteredLength(filteredItems.length);
    if (filteredItems.length > 0 || complete || loading) return;
    setLoading(true);
    fetchPage(paginationObj);
    setLoading(false);
  }, [filteredItems, complete, loading]);
  return (
    <div className={className}>
      {filteredItems.map((item, index) => {
        return (
          <div key={index} ref={index === filteredItems.length - 1 ? lastElem : null} className='pagination'>
            <PaginationCard
              index={index}
              item={item}
              length={filteredItems.length}
              singleSubmission={singleSubmission}
              setSingleSubmission={setSingleSubmission}
            />
          </div>
        );
      })}
    </div>
  );
};
export default PaginatedList;
