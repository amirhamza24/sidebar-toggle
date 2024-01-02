const [mobileNumber, setMobileNumber] = useState('');

    const handleInputChange = (event) => {
      const cleanedInput = event.target.value.replace(/\D/g, '');
  
  const finalMobileNumber = cleanedInput.replace(/^(?:\+880|\+088|\+88|\8|0)/, '');
      setMobileNumber(finalMobileNumber);
    }



<div>
      <label htmlFor="mobileNumber">Mobile Number:</label>
      <input
        type="text"
        id="mobileNumber"
        value={mobileNumber}
        onChange={handleInputChange}
      />
    </div>