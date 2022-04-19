import React from "react";
import "./infoMessage.css";


const InfoMessage= ({message})=>
{
return(

        <div className="info-container">
             <div className="info-icon">                
             <i className="sf-icon i-alert" />                
             </div>
             <p className="verified-info-message">    
                          {message}
                        
              
             </p>
             </div>

);

}
export default InfoMessage;