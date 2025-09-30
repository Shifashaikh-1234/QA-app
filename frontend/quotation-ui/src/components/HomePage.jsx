// frontend/quotation-ui/src/components/HomePage.jsx
import React, { useState, useRef } from "react";
import API from "../api"; // axios instance with baseURL
import EditableItemTable from "./EditableItemTable";
import ClipLoader from "react-spinners/ClipLoader";

const HomePage = ({ onLogout }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cleared, setCleared] = useState(false); // New state to track if cleared
  const [abortController, setAbortController] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!selectedFiles.length) {
      return alert("Please select one or more images.");
    }

    setLoading(true);

    // Create a new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired — please login again.");
        if (onLogout) onLogout();
        setLoading(false);
        return;
      }
      
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append("files", f));

      // Pass the signal to Axios
      const res = await API.post("/upload", formData, {
        signal: controller.signal,
      });

      const mergedItems = res?.data?.items || [];
      setItems(mergedItems);
      setCleared(false);
    } catch (err) {
      if (err.name === "CanceledError" || err.message === "canceled") {
        console.log("Upload canceled");
      } else {
        console.error("Upload failed", err);
        const detail = err?.response?.data?.detail || err?.message || "Upload failed";
        alert(detail);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <h1 className="text-[#003D73] text-2xl font-semibold mt-8 mb-6">Quotation Automation</h1>
    </div>

      <form onSubmit={upload}>

          {/* if clear button is clicked, clear the selected files and items but before clicking on upload and extract button */}
          <div className="flex flex-row items-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef} 
              className="text-black input-bordered border-[#0077C2] w-70 mb-4 bg-white hover:border-[#000000]"
            />


          
          <button type="submit" className="btn w-35 ml-4 bg-[#0077C2] text-white hover:bg-[#005f99] mb-2" disabled={loading}>
              {loading ? 
              <ClipLoader color="#003D73" size={30} loading={loading}/>
               : "Upload & Extract"}
            </button>
            </div>

          <div className="mb-4 flex flex-row items-center align-center justify-center">
          <button
              type="button"
              onClick={() => {
                if (abortController) {
                  abortController.abort(); // Cancel the upload request
                }
                setSelectedFiles([]);
                setItems([]);
                setCleared(true);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setLoading(false); // Stop spinner
              }}
              className="btn w-35 bg-[#0077C2] m-4 text-white hover:bg-[#005f99] mb-2"
            >
              Clear
            </button>

          <button onClick={logout} className="btn w-25 m-4 bg-[#0077C2] text-white hover:bg-[#005f99] mb-2">Logout</button>

      </div>
            
        </form>

          <EditableItemTable items={items} key={items.length} cleared={cleared} />

      </div>

  );
};

export default HomePage;









































//--------------------------------------------------------------------
/*import React, { useState } from 'react';
import API from '../api';
import EditableItemTable from './EditableItemTable';

const HomePage = ({ onLogout }) => {

  const [image, setImage] = useState([]);
  const [output, setOutput] = useState([]);

  const upload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setOutput(res.data.items);
    } catch (err) {
      alert(err.response?.data?.detail || 'Upload failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    onLogout();
  };



  return (
      <div className="flex flex-col items-center justify-center">
      <h2 className="text-[#003D73] text-2xl font-semibold mt-16">Quotation Automation</h2>
      <div className="min-h-screen w-full">
      <div className="mb-4 mt-4 flex flex-col items-center justify-center">
        <button onClick={logout} className="btn w-25 bg-[#0077C2] text-white hover:bg-[#005f99] mb-4">Logout</button>
      </div>
      <form onSubmit={upload}>
        <input type="file" accept="image/*" multiple onChange={e => setImage(e.target.files[0])} className='text-black input-bordered border-[#0077C2] w-70 mb-4 bg-white hover:border-[#000000]'/>
        <button type="submit" className="btn w-35 bg-[#0077C2] text-white hover:bg-[#005f99] mb-2">Upload</button>
        <EditableItemTable items={output || []} />
        

      </form>



    </div>
    </div>
  );
};

export default HomePage;
*/
