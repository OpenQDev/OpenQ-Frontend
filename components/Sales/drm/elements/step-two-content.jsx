import React, { useState, useEffect, useRef } from 'react';
import SubMenu from './sub-menu.jsx';
import TableRow from './table-row.jsx';

const StepTwoContent = () => {
  const [tableData, setTableData] = useState(null);
  const [, setIsVisibleStates] = useState([false, false, false, false, false, false, false]);

  const parentRef = useRef(null);

  useEffect(() => {
    const fetchTableData = async () => {
      const { faker } = await import('@faker-js/faker');

      const statuses = ['lead', 'cold', 'customer', 'churned'];
      const priorities = ['low', 'medium', 'high'];

      const getRandomValue = (arr) => {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
      };

      function getRandomName() {
        // Placeholder names
        const names = ['Scarlett Johansson', 'Patrick Collins', 'James Donaldson'];

        // Slice names to 10 characters and add '...' at the end
        const slicedNames = names.map((name) => name.slice(0, 10) + '...');
        console.log('slicedNames: ', slicedNames);

        // Create an array with ten elements, each containing a random name from slicedNames
        const randomNames = Array(1)
          .fill()
          .map(() => {
            const randomIndex = Math.floor(Math.random() * slicedNames.length);
            return slicedNames[randomIndex];
          });

        return randomNames;
      }

      const getRandomAnon = () => {
        const firstName = faker.internet.userName();
        return firstName.slice(0, 10) + '...';
      };

      const getRandomPercentage = () => {
        const percentage = faker.datatype.number({ min: 0, max: 100 });
        return `${percentage}%`;
      };

      const getRandomDescription = () => {
        const sentence = faker.lorem.sentence();
        let description = sentence.length <= 24 ? sentence : sentence.slice(0, 12) + '...';
        return description;
      };

      const getRandomSkills = () => {
        const programmingLanguages = ['JavaScript', 'Python', 'TypeScript', 'Rust'];
        const randomIndex = Math.floor(Math.random() * programmingLanguages.length);
        return programmingLanguages[randomIndex];
      };

      const getPlaceholderArray = () => {
        return Array.from({ length: 1 }, () => '...');
      };

      const newData = {
        name: Array.from({ length: 10 }, () => getRandomAnon()),
        status: Array.from({ length: 10 }, () => getRandomValue(statuses)),
        priority: Array.from({ length: 10 }, () => getRandomValue(priorities)),
        owner: Array.from({ length: 10 }, () => getRandomName()),
        description: Array.from({ length: 10 }, () => getRandomDescription()),
        activity: Array.from({ length: 10 }, () => getRandomPercentage()),
        skill: Array.from({ length: 10 }, () => getRandomSkills()),
        empty: Array.from({ length: 10 }, () => getPlaceholderArray()),
      };

      setTableData(newData);
    };

    fetchTableData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Adjust this value as needed
    });

    if (parentRef.current) {
      observer.observe(parentRef.current);
    }

    return () => {
      if (parentRef.current) {
        observer.unobserve(parentRef.current);
      }
    };
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === parentRef.current && entry.isIntersecting) {
        let count = 0;
        const interval = setInterval(() => {
          setIsVisibleStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[count] = true;
            return updatedStates;
          });

          count++;
          if (count === 7) {
            clearInterval(interval);
          }
        }, 300);
      }
    });
  };

  if (!tableData) {
    return null; // Render loading state or placeholder while fetching tableData
  }

  return (
    <div ref={parentRef} className='h-[45rem] w-[60rem] border border-gray-300 rounded-md'>
      <div className='p-10'>
        <SubMenu />
        <div className='border-b border-gray-300 pt-2'></div>
        <div className='pt-5'>
          <div className=''>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col'>
                {/* <div className='flex flex-row items-center justify-between px-3 w-full bg-[#EEEEEE] border-t border-l border-r border-b rounded-tl-sm p-2 border-gray-300'>
                  <div className='text-gray-800 text-xs'>Name</div>
                  <div>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='#797979'
                      className='w-4 h-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                    </svg>
                  </div>
                </div> */}
                {/* <div className='flex flex-row border-b border-r border-l border-gray-500 space-x-5 items-center p-3'>
                  <div className='text-gray-500 text-xs'>1</div>
                  <div className='text-gray-500 text-xs'>rickkdev</div>
                  <div></div>
                </div> */}
                {/*  {tableData.name.map((col, index) => (
                  <div
                    className='flex border-b border-r border-l border-gray-300 space-x-5 items-center p-3'
                    key={index}
                  >
                    <div className='text-gray-500 text-xs'>{col.slice(0, 7)}</div>
                  </div>
                ))} */}

                {/* <div className='flex border-b border-l border-r border-gray-300 space-x-5 items-center p-1 '>
                  <div className={`text-white text-xs p-1 rounded-lg px-3`} style={{ whiteSpace: 'nowrap' }}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='#8D8D8D'
                      className='w-4 h-4 mb-1 -ml-2'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </div>
                </div> */}
              </div>
              <TableRow name={'Name'} cols={tableData.name} type={'name'} />
              <TableRow name={'Status'} cols={tableData.status} type={'status'} />
              <TableRow name={'Priority'} cols={tableData.priority} type={'priority'} />
              <TableRow name={'Owner'} cols={tableData.owner} type={'owner'} />
              <TableRow name={'Description'} cols={tableData.description} type={'description'} />
              <TableRow name={'Activity'} cols={tableData.activity} type={'activity'} />
              <TableRow name={'Skill'} cols={tableData.skill} type={'skill'} />
              <TableRow name={'empty'} cols={tableData.empty} type={'empty'} />
            </div>
            <div className='bg-[#F2F2F2]  border-l border-b border-gray-300 py-[4.75rem]'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepTwoContent;
