import React from 'react'
import './search.css'


function Search(){


return(    
<div className="wrap">
   <div className="search">
      <input type="text" className="searchTerm" placeholder="search..."></input>
      <button type="submit" className="searchButton">
        <i className="fa fa-search"></i>
     </button>
   </div>
</div>
)
}
export default Search;