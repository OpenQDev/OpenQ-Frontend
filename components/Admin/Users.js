import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../store/Store/StoreContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [tempSecret, setTempSecret] = useState('');
  const [apiSecret, setApiSecret] = useState();
  const [appState] = useContext(StoreContext);

  useEffect(() => {
    const displayUsers = async () => {
      if (apiSecret) {
        try {
          // add pagination if necessary
          const limit = 400;
          const users = await appState.openQPrismaClient.getUsers(apiSecret, limit);
          setUsers(users);
        } catch (err) {
          appState.logger.error(err);
        }
      }
    };
    displayUsers();
  }, [apiSecret]);
  return (
    <div className='bg-black rounded-lg p-4 space-y-4 w-full col-span-2'>
      {apiSecret ? (
        <table>
          <thead>
            <tr>
              <th className='py-1 px-2 text-left'>Address</th>
              <th className='py-1 px-2 text-left'>Github</th>
              <th className='py-1 px-2 text-left'>Email</th>
              <th className='py-1 px-2 text-left'>Discord</th>
              <th className='py-1 px-2 text-left'>Twitter</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr className='break-words' key={index}>
                  <td className='p-1'>{user.address}</td>
                  <td className='p-1'>{user.github}</td>
                  <td className='p-1'>{user.email}</td>
                  <td className='p-1'>{user.discord}</td>
                  <td className='p-1'>{user.twitter}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <>
          <div>To view user data please input OPENQ_API_SECRET</div>
          <label className='block w-full my-2' htmlFor='api-secret'>
            OPENQ_API_SECRET
          </label>
          <input
            onChange={(e) => setTempSecret(e.target.value)}
            className='block bg-transparent border-web-gray border px-4 focus:outline focus:outline-blue-500 rounded-lg'
            id='api-secret'
          />
          <button onClick={() => setApiSecret(tempSecret)}>Submit</button>
        </>
      )}
    </div>
  );
};

export default Users;
