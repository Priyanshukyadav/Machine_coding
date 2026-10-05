import  React , { useState } from 'react'

import './App.css'

function App() {
  const [query , setQuery] = useState('');
  const [medicines , setMedicines] = useState([]);
  const [selectedMedicine ,setselectedMedicine] = useState(null) ;
  const [loading ,setLoading ] = useState(false) ;
  const [error ,setError ] = useState(null) ;

const searchhandler = async(e) => {
  e.preventDefault() ;
  if(!query.trim()) return ;

  setLoading(true) ;
  setError(null);
  setselectedMedicine(null) ;

  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query.trim())}"&limit=20` ;
    const response = await fetch(url) ;
  }

  if(response.status === 404){
    setMedicines([]) ;
    setLoading(false);
    return;
  }

}

  return (
    <>
      
    </>
  )
}

export default App
