import axios from 'axios'

export const axiosApi = async ({query={}, action}) => {
  let result = {};
  let data = new FormData();

  const api = axios.create({
      
    baseURL: `https://brave-hofstadter.164-52-220-175.plesk.page/webservices/client.php?action=${action}`,
  });

  Object.entries(query).forEach(([key, value]) => {
    data.append(key, value);
  });
  await api.post("", data).then((response) => {
    result = response;
  });
  return result;
};

export const axiosApiPost = async ({action}) => {
    let result = {};
  
    const api = axios.create({
        
      baseURL: `https://brave-hofstadter.164-52-220-175.plesk.page/jupiter_prasna/webservices/client.php?action=${action}`,
    });
  
    await api.post("").then((response) => {
      result = response;
    });
    return result;
  };