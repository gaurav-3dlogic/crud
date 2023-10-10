import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        setList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users');
      setList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id === 0) {
      try {
        const response = await axios.post('http://localhost:4000/users', {
          name,
          email,
          password,
        });
  
        // Assuming the server responds with the newly created user
        const newUser = response.data;
  
        // Update the list of users with the newly created user
        setList([...list, newUser]);
  
        // Clear the input fields
        setName('');
        setEmail('');
        setPassword('');
      } catch (error) {
        console.error('Error adding user:', error);
      }
    } else {
      try {
        const response = await axios.put(`http://localhost:4000/users/${id}`, {
          name,
          email,
          password,
        });
  
        // Assuming the server responds with the updated user
        const updatedUser = response.data;
  
        // Update the list of users with the updated user
        const updatedList = list.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setList(updatedList);
  
        // Clear the input fields
        setName('');
        setEmail('');
        setPassword('');
        setId(0); // Reset id after the update
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleDelete = async (userID) => {
    try {
      await axios.delete(`http://localhost:4000/users/${userID}`);
      setList(list.filter((user) => user.id !== userID));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = async (userID) => {
    try {
      const response = await axios.get(`http://localhost:4000/users/${userID}`);
      const user = response.data;
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password);
      setId(user.id);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <div className="container">
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label><b>User Name</b></label>
          <input type='text' className='form-control' placeholder='user name' name='name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label><b>User Email</b></label>
          <input type='text' className='form-control' placeholder='user Email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label><b>User Password</b></label>
          <input type='text' className='form-control' placeholder='user password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div><br/>

        <div>
          <input type='submit' className='btn btn-primary' value={id === 0 ? 'Add' : 'Update'} />
        </div>
      </form><br/>

      <table className='table table-border table-bordered text-center table-striped shadow'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <button onClick={() => handleDelete(user.id)} className='btn btn-danger btn-sm'>Delete</button>
              <button onClick={() => handleEdit(user.id)} className='btn btn-primary btn-sm'>Edit</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
