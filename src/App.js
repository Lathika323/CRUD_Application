import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';


//Server URL
const API = "http://localhost:4000"  

function App() {

  const[people,setPeople]=useState([]);
  const[form,setForm]=useState({name:"",age:"",email:"",department:"",phone:"",address:"",year:""});
  const[editId,setEditId]=useState(null); //Initially there is no edit id
  const[editForm, setEditForm]=useState({name:"", age:"",email:"",department:"",phone:"",address:"",year:""});

  //Read User
  async function load() {
    const res = await axios.get(`${API}/`); //Getting datas from the MongoDB .i.e Request sent
    setPeople(res.data);                   // Storing the datas in people and passing it in setPeople() . i.e response received
  }
  useEffect(() => {
    load(); 
  },[]);

  //Create user
  async function addStudent(e){
    e.preventDefault();

    if(!form.name || !form.age || !form.email || !form.department || !form.phone || !form.address || !form.year)
      return alert("Input field is empty!");

    const res = await axios.post(`${API}/`,{
      name:form.name,
      age:Number(form.age),
      email:form.email,
      department:form.department,
      phone:Number(form.phone),
      address:form.address,
      year:Number(form.year)
    });

    setPeople([...people,res.data]);
    setForm({name:"",age:"",email:"",department:"",phone:"",address:"",year:""})
  }

  //Edit 
  function startEdit(p){
    setEditId(p._id);
    setEditForm({name:p.name, age:Number(p.age), email:p.email, department:p.department, phone:Number(p.phone), address:p.address, year:Number(p.year)});
  }

  //Cancel Edit
  function cancelEdit(){
    setEditId(null);
  }

  //Save Edit 
  async function saveEdit(_id){
    if (!editForm.name || !editForm.age || !editForm.email || !editForm.department || !editForm.phone || !editForm.address || !editForm.year)
      return alert("Input field is empty!");
    const res = await axios.put(`${API}/${_id}`,{
      name : editForm.name,
      age: Number(editForm.age),
      email:editForm.email,
      department:editForm.department,
      phone:Number(editForm.phone),
      address:editForm.address,
      year:Number(editForm.year)
    });

    setPeople(people.map(p => (p._id === _id ? res.data : p )));
    setEditId(null);
  }

  //Delete
  // async function remove(_id) {
  //   await axios.delete(`${API}/${_id}`);
  //   setPeople(people.filter(p=> p._id !== _id))
  // }  (OR)


async function remove(_id) {
  const confirmDelete = window.confirm("Are you sure you want to delete this student?");
  if (!confirmDelete) 
    return; // Cancel if user clicks "No"

  await axios.delete(`${API}/${_id}`);              // delete first
  setPeople(people.filter(p => p._id !== _id));    // update state
  setTimeout(() => {
  alert("Student deleted successfully!");     //Show message after deletion
  },100);
}

  return (
<div className='bg-info'>
  <div className='container'>    {/* BootStrap Features*/}
    <div className='row justify-content-center'>
      <div className='col-md-6'>
        <h1>BIT Students - Add Student</h1>
        <hr/>
        <form onSubmit={addStudent}>
          <input type='text' className='form-control mb-3' placeholder='Enter name' value={form.name} onChange={(e) => setForm({...form, name:e.target.value})} required/>  {/* 'e' is passing an event in onchange */}
          <input type='number' className='form-control mb-3' placeholder='Enter age' value={form.age}  onChange={(e) => setForm({...form, age:e.target.value})}required/>
          <input type='text' className='form-control mb-3' placeholder='Enter email' value={form.email}  onChange={(e) => setForm({...form, email:e.target.value})}required/>
          <input type='text' className='form-control mb-3' placeholder='Enter department' value={form.department}  onChange={(e) => setForm({...form, department:e.target.value})}required/>
          <input type='number' className='form-control mb-3' placeholder='Enter phone' value={form.phone}  onChange={(e) => setForm({...form, phone:e.target.value})}required/>
          <input type='text' className='form-control mb-3' placeholder='Enter address' value={form.address}  onChange={(e) => setForm({...form, address:e.target.value})}required/>
          <input type='number' className='form-control mb-3' placeholder='Enter year' value={form.year}  onChange={(e) => setForm({...form, year:e.target.value})}required/>

          <button className='btn btn-primary w-100'>Create</button>
        </form>
        </div>
    </div>

    {/* Row for List of Users */}
    <div className='row mt-5'>
      <div className='col'>
        <h3 className='mb-3'>Students List</h3>
        {people.length===0? (
          <p>No students found!</p>
        ) : (
          <table className='table table-bordered table-hover'>
            <thead className='table-dark'>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Year</th>
                <th style={{width:"200px"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.map(p => (         //'p' is user-defined local variable
                <tr key={p._id}>
                  {editId === p._id ?(
                    <>
                    <td>
                      <input type='text'className='form-control' value={editForm.name} onChange={(e) => setEditForm({...editForm, name : e.target.value})} />
                    </td>
                    <td>
                      <input type='number'className='form-control' value={editForm.age} onChange={(e) => setEditForm({...editForm, age : e.target.value})} />
                    </td>
                    <td>
                      <input type='text'className='form-control' value={editForm.email} onChange={(e) => setEditForm({...editForm, email : e.target.value})} />
                    </td>
                    <td>
                      <input type='text'className='form-control' value={editForm.department} onChange={(e) => setEditForm({...editForm, department : e.target.value})} />
                    </td>
                    <td>
                      <input type='number'className='form-control' value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone : e.target.value})} />
                    </td>
                    <td>
                      <input type='text'className='form-control' value={editForm.address} onChange={(e) => setEditForm({...editForm, address : e.target.value})} />
                    </td>
                    <td>
                      <input type='number'className='form-control' value={editForm.year} onChange={(e) => setEditForm({...editForm, year : e.target.value})} />
                    </td>
                    <td>
                      <button className='btn btn-success me-2' onClick={() => saveEdit(p._id)} >Save</button>
                      <button className='btn btn-primary ' onClick={cancelEdit}>Cancel</button>
                    </td>
                    </>
                  ) : (
                  <>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.email}</td>
                    <td>{p.department}</td>
                    <td>{p.phone}</td>
                    <td>{p.address}</td>
                    <td>{p.year}</td>

                    <td>
                      <button className='btn btn-warning me-2' onClick={() => startEdit(p)} >Edit</button> {/* 'me-2' is margin end space, space after edit button*/}
                      <button className='btn btn-danger' onClick={() =>remove(p._id)}>Delete</button>
                    </td>
                  </>
                  )}
                </tr>
              )
              )}
            </tbody>
          </table>
        )
        }
      </div>
    </div>
  </div>
</div>
  );
}

export default App;
