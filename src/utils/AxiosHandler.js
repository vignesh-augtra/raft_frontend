import axios from "axios";

const domainName = "https://qqeaur9dda.us-east-2.awsapprunner.com/"

const apiRequest = (method, endpoint, data = null) => {
    try {
        return new Promise(resolve=>{
            try{
                axios.request({
                    method: method,
                    url: `${domainName}${endpoint}`,
                    data: data
                }).then(
                    // success callback
                    (response)=>{
                        if (response.data.isError) {
                            alert(response.data.data);
                            resolve(null);
                          } else {
                            resolve(response.data)
                          }
                          
                    },
                    // Failure Callback
                    (error)=>{
                        alert(error);
                        resolve(null);
                    }
                )
            } catch(e){
                alert(e)
            }
        })
    } catch (e) {
        alert(e)
    }
}

export default apiRequest;