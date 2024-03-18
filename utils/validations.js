export const  isValidEmail =(email) =>{
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }


  async function getIPAddress(){
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  }




  function getUserAgent(){
    return navigator.userAgent
  }


  async function captureDeviceInfo(){
    const ipaddress = await getIPAddress()
    const userAgent = getUserAgent()

    return {ipaddress,userAgent}
  }
