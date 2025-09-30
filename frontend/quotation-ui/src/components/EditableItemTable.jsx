import axios from 'axios';
import { useState, useEffect } from 'react';
import  jsPDF  from "jspdf";
import autoTable from 'jspdf-autotable';

const EditableItemTable = ({ items, totalAmount, grandTotal, userEmail, cleared }) => {
 if (cleared && (!items || items.length === 0)) {
    return <div>No items to display.</div>;
  }

  
  const [editableItems, setEditableItems] = useState([]);
  const [matchOptions, setMatchOptions] = useState({});
  const [selectedMatches, setSelectedMatches] = useState({});
  const [quotation, setQuotation] = useState(null);

  useEffect(() => {
    if (editableItems.length === 0 && items.length > 0) {
      setEditableItems(items);

      // Fetch matches for each item
      items.forEach(async (item, index) => {
        try {
          const res = await axios.get(
            `http://localhost:8000/inventory/match?query=${item.item}`
          );
          const matches = res.data;
          setMatchOptions((prev) => ({ ...prev, [index]: matches }));
        } catch (err) {
          setMatchOptions((prev) => ({ ...prev, [index]: [] }));
        }
      });
    }
  }, [items, editableItems]);



  const handleItemChange = async (value, index) => {
    const updated = [...editableItems];
    updated[index].item = value;
    setEditableItems(updated);

    try {
      const res = await axios.get(`http://localhost:8000/inventory/match?query=${value}`);
      setMatchOptions(prev => ({ ...prev, [index]: res.data }));
    } catch (err) {
      console.error('Matching failed', err);
    }
  };

  const handleMatchSelect = (index, selectedName) => {
    const matchedItem = matchOptions[index]?.find(m => m.name === selectedName);
    setSelectedMatches(prev => ({
      ...prev,
      [index]: matchedItem,
    }));
  };

  const processQuotation = () => {
    const result = editableItems.map((item, index) => {
      const match = selectedMatches[index];
      const quantity = Number(item.quantity || 0);
      const unitPrice = match ? Number(match.price) : 0;
      return {
        itemName: item.item,
        quantity,
        matchedName: match?.name || '',
        unitPrice,
        total: (unitPrice * quantity).toFixed(2),
      };
    });

    const grandTotal = result.reduce((sum, i) => sum + Number(i.total), 0).toFixed(2);

    setQuotation({ items: result, total: grandTotal });

  
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    //title
 
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Quotation Summary";
    doc.text(title, pageWidth / 2, 20, { align: 'center' });

    //user email + date
   doc.setFontSize(12)
    const userEmail = localStorage.getItem("userEmail") || "Unknown User";
    const user = userEmail ? { email: userEmail } : null;
    doc.text(`User: ${user?.email || 'Unknown User'}`, 14, 30);
    

    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`,pageWidth - 14, 30,{ align: 'right' });

    //Table header
    const tableColumn = ["Item", "Matched", "Quantity", "Unit Price", "Total"];
    const tableRows = [];
    quotation.items.forEach(item => {
      const itemData = [
        item.itemName,
        item.matchedName ? item.matchedName : "No Match Found",
        item.quantity,
        item.unitPrice?.toFixed(2) || '0.00',
        (item.quantity * item.unitPrice).toFixed(2),
      ]; 
      tableRows.push(itemData);
    });
     
    //add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles:{
        cellPadding: 5,
        fontSize: 10,
        overflow: 'linebreak',
        columnWidth: 'auto',
      },
      headStyles: {
        fillColor: '#0077C2',
        textColor: '#FFFFFF',
        fontSize: 12,
        halign: 'center',
      },
      columnStyles:{
        0: { cellWidth: 50 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
      bodyStyles: {
        halign: 'center',
      },
    });

    //total amount
    totalAmount = quotation.total;
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14)
    doc.text(`Total Amount: Rs.${totalAmount}`, 14, finalY + 10);

    // Save the PDF
  
    doc.save("quotation_summary.pdf");
   }



return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th className='p-3 text-[#003D73] underline decoration-[#003D73] text-xl'>Item Name</th>
            <th className='p-3 text-[#003D73] underline decoration-[#003D73] text-xl'>Quantity</th>
            <th className='p-3 text-[#003D73] underline decoration-[#003D73] text-xl'>Match with Inventory</th>
          </tr>
        </thead>
        <tbody>
          {editableItems.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                 
                  value={row.item}
                  onChange={e => handleItemChange(e.target.value, index)}
                  className='input-bordered border-[#0077C2] p-1 w-full mb-2 bg-white text-black text-center border-radius hover:border-[#000000]'
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  className='input-bordered border-[#0077C2] p-1 w-full mb-2 bg-white text-center text-black border-radius hover:border-[#000000]'
                  onChange={e => {
                    const updated = [...editableItems];
                    updated[index].quantity = parseInt(e.target.value);
                    setEditableItems(updated);
                  }}
                />
              </td>
              <td>
                <select
                  onChange={e => handleMatchSelect(index, e.target.value)}
                  defaultValue=""
                  className='input-bordered p-1 border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius hover:border-[#000000]'
                >
                  <option value="" className='input-bordered border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius hover:border-[#000000]'>--Select--</option>
                  {(matchOptions[index] || []).map((opt, i) => (
                    <option key={i} value={opt.name} className='input-bordered border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius hover:border-[#000000]'>
                      {opt.name} (₹{opt.price})
                    </option>
                  ))}
                  {(matchOptions[index] || []).length === 0 && (
                    <option value="no_match" className='input-bordered border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius hover:border-[#000000]'>No Matches Found</option>
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className='flex items-center justify-center'>
      <button onClick={processQuotation} style={{ marginTop: '10px' }} className="btn w-40 bg-[#0077C2] text-white hover:bg-[#005f99] mb-2 ">
        Process Quotation
      </button>
      </div>

      {quotation && (
        <div style={{ marginTop: '20px' }}>
          <h3 className='text-[#003D73] text-2xl text-bold text-center m-3 underline decoration-[#003D73]'>Quotation Summary</h3>
          <table border="1">
            <thead>
              <tr>
                <th className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-[#003D73] border-radius'>Item</th>
                <th className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-[#003D73] border-radius'>Matched</th>
                <th className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-[#003D73] border-radius'>Quantity</th>
                <th className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-[#003D73] border-radius'>Unit Price</th>
                <th className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-[#003D73] border-radius'>Total</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((q, idx) => (
                <tr key={idx} className='hover:bg-gray-100 border-radius'>
                  <td className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius'>{q.itemName}</td>
                  <td className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius'>{q.matchedName ? q.matchedName : "No Match Found"}</td>
                  <td className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius'>{q.quantity}</td>
                  <td className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius'>₹{q.unitPrice}</td>
                  <td className='border p-3 border-[#0077C2] w-full mb-2 bg-white text-center text-black border-radius'>₹{q.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className='text-[#003D73] text-xl text-bold text-center m-3'>Total Amount: ₹{quotation.total}</h4>
        </div>
      )}
      <div className='flex items-center justify-center'>
      <button onClick={handleDownloadPDF} style={{ marginTop: '10px' }} className="btn w-40 bg-[#0077C2] text-white hover:bg-[#005f99] mb-2">
        Download PDF
      </button>
      </div>
    </div>
  );
};

export default EditableItemTable;
