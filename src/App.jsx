import React, { useState } from 'react';
import "./App.css"
import search from "../src/assets/search.png"

import Suggestion from "./Suggestion";
 
const items = ['apple', 'apricot', 'avocado', 'banana', 'blackberry', 'blueberry', 'cantaloupe', 'cherry', 'coconut', 'cranberry', 'date', 'dragonfruit', 'durian', 'elderberry', 'fig', 'grape', 'grapefruit', 'guava', 'honeydew', 'jackfruit', 'kiwi', 'kumquat', 'lemon', 'lime', 'lychee', 'mango', 'mandarin', 'nectarine', 'orange', 'papaya', 'passionfruit', 'peach', 'pear', 'pineapple', 'plum', 'pomegranate', 'raspberry', 'strawberry', 'tangerine', 'watermelon', 'acai', 'ackee', 'african cherry orange', 'almond', 'ambarella', 'ampalaya', 'anise', 'appleberry', 'apricot-plum', 'araza', 'asian pear', 'asparagus pea', 'ate', 'attap chee', 'avocado pear', 'babaco', 'bacuri', 'bael', 'banana passionfruit', 'barbadine', 'beach cherry', 'belimbing', 'bilberry', 'bitter gourd', 'black sapote', 'blood orange', 'blue tongue', 'boab', 'breadfruit', 'buddhas hand', 'bush tomato', 'calabash', 'canistel', 'carambola', 'carob', 'cashew apple', 'chayote', 'cherimoya', 'chico fruit', 'chinese gooseberry', 'chinese jujube', 'chokeberry', 'cinnamon apple', 'clementine', 'cloudberry', 'coco plum', 'cocona', 'coffee cherry', 'corossol', 'cosmos prawn', 'cranberry hibiscus', 'custard apple', 'dabai', 'damson', 'date plum', 'desert lime', 'doum palm', 'duku', 'duranta', 'eggfruit', 'elderflower', 'emerald kiwi', 'feijoa', 'finger lime', 'fruit salad tree', 'gac', 'genip', 'giant granadilla', 'ginger root', 'goumi', 'grapefruit-orange', 'green sapote', 'groundcherry', 'guanabana'];


const App = () => {
  const [currentData, setcurrentData] = useState([])
  const [SearchHistory, setSearchHistory] = useState([])
  const [showResult, setshowResult] = useState(false)
  const [SelectedItems, setSelectedItems] = useState("")
  
  const createData = (word, data) => {
    const re = new RegExp(word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "gi");
    return data.filter(item => item.toLowerCase().includes(word.toLowerCase())).slice(0,5);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    let filterData = [];
    if (value) {
      filterData = createData(value, items);
    }
    setcurrentData(filterData)
  };

  const onClose = () => {
    setshowResult(true)
    setSearchHistory([...currentData])
  }

  const onOpen = () => {
    setshowResult(false)
  }

  return (
    <div className='main'>
      <div style={{width:"100%",maxWidth:"600px"}}>
    <Suggestion
      getDisplayName={item => item}
      items={currentData}
      onSelectedItem={item => {
        setSelectedItems(item)
        setSearchHistory((prev => {
          let new_arr = [item, ...prev.slice(0, 4)]
          return new_arr
        }))
      }}
      onOpen={onOpen}
      onClose={onClose}
    >
      {({
        getInputProps,
        getListItemProps,
        getItemProps,
        inputValue,
        selectedItem,
        setSelectedItem,
        highlightedIndex,
        items,
        isOpen,
        clearInputValue,
        closeDropDown,
        searchHistory
      }) => (
        <div className='containerOuter'>
          <div class="container">
          <input
            {...getInputProps({
              placeholder: 'Type fruit names...',
              onChange: handleChange
            })}
            className="freetyping"
          />
                
       <img className="searchIcon" src={search}/>
<input value={inputValue.toLowerCase() && inputValue.toLowerCase() == currentData[0]?.toLowerCase().substring(0,inputValue.length) ? inputValue + currentData[0]?.slice(inputValue?.length,currentData[0]?.length) : ""} className="persistentplaceholder"/>
{inputValue && <button className="clearBtn" type="button" onClick={()=> {clearInputValue();closeDropDown();setcurrentData([]);setSelectedItem("");setshowResult(false)}}>X</button>}
</div>
          {isOpen && items.length !== 0 && !showResult && (
            <div {...getListItemProps()} className='dropdown'>
              {items.map((item, index) => (
                <div
                  {...getItemProps({ item, index })}
                  key={item.code}
                  style={{
                    backgroundColor:
                      highlightedIndex === index
                        ? 'rgb(255, 245, 231)'
                        : 'white',
                    fontWeight:
                      selectedItem && selectedItem === item
                        ? 'bold'
                        : 'normal'
                  }}
                 dangerouslySetInnerHTML={{ __html:  inputValue && item.replace(new RegExp(inputValue.toLowerCase()), match => `<mark  
               style="background-color:rgb(255, 203, 125);border-radius: 4px;padding:0px 2px">${match}</mark>`) }}
                  className='dropdownItem'
                >
                </div>
              ))}
            </div>
          )}
          {
            isOpen && items.length == 0 && inputValue !== "" && !showResult && <div className='dropdown'>
              <div>No results found!!</div>
            </div>
          }
          {
          isOpen && inputValue === "" && searchHistory.length !== 0 && <div className='dropdown'>
            <div className='dropdownHeading'>Recent Searches</div>
            {searchHistory.map((i,idx) => <div key={i.value+idx} className='dropdownItem' onClick={()=>{setSelectedItem(i.value);setSelectedItems(i.value);setcurrentData([...i.suggestions]);setSearchHistory([...i.suggestions]);setshowResult(true)}}>{i.value}</div>)}
          </div>
          }
        </div>
      )}
    </Suggestion>
    
    {SearchHistory.length !== 0 && showResult && <div className='resultContainer'>
        <div className='selectedItem'>Selected Item : {SelectedItems}</div>
        <div className='relevantSearch'>Relevant Searches </div>
        <ul className='relevantSearchItems'>
          { SearchHistory.map(i => <li>{i}</li>)}
        </ul>
        
      </div> }
      {SearchHistory.length === 0 && showResult && <div className='resultContainer'>
        No results found!!
        
      </div> }
      </div>
      </div>
  );

}
 
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       currentData: [],
//       inputValue:""
//     };
//   }
 
//   createData = (word, data) => {
//     const re = new RegExp(`${word.toLowerCase()}.*\\B`, 'g');
//     return data.filter(item => re.test(item.toLowerCase()));
//   };
 
//   handleChange = e => {
//     const value = e.target.value;
//     this.setState({inputValue:e.target.value})
//     let filterData = [];
//     if (value) {
//       filterData = this.createData(value, items);
//     }
//     this.setState({
//       currentData: filterData
//     });
//   };
 
//   render() {
//     return (
//       <Suggestion
//         getDisplayName={item => item}
//         items={this.state.currentData}
//         onSelectedItem={item => alert(item)}
//       >
//         {({
//           getInputProps,
//           getListItemProps,
//           getItemProps,
//           inputValue,
//           selectedItem,
//           highlightedIndex,
//           items,
//           isOpen,
//           clearInputValue
//         }) => (
//           <div>
//             <p>selected item: {selectedItem}</p>
//             <div class="container">
//             <input
//               {...getInputProps({
//                 placeholder: 'Select fruit',
//                 onChange: this.handleChange
//               })}
//               className="freetyping"
//             />
                  
//          <img className="searchIcon" src={search}/>
//   <input value={inputValue.toLowerCase() == this.state.currentData[0]?.toLowerCase().substring(0,inputValue.length) ? this.state.currentData[0] : ""} autocomplete="off" className="persistentplaceholder"/>
//   { <button className="clearBtn" type="button" onClick={()=> clearInputValue()}>X</button>}
// </div>
//             {isOpen && (
//               <div {...getListItemProps()}>
//                 {items.map((item, index) => (
//                   <div
//                     {...getItemProps({ item, index })}
//                     key={item.code}
//                     style={{
//                       backgroundColor:
//                         highlightedIndex === index
//                           ? 'rgb(232, 232, 232)'
//                           : 'white',
//                       fontWeight:
//                         selectedItem && selectedItem === item
//                           ? 'bold'
//                           : 'normal'
//                     }}
//                   >
//                     {item}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </Suggestion>
//     );
//   }
// }

export default App

// const data = [
//   { id: 1, name: 'Apple seller' },
//   { id: 2, name: 'Banana buyer' },
//   { id: 3, name: 'Orange' },
//   { id: 4, name: 'Pineapple' },
//   { id: 5, name: 'Mango' },
//   { id: 6, name: 'Kiwi' },
//   { id: 7, name: 'Grapes' },
//   { id: 8, name: 'Strawberry' },
//   { id: 9, name: 'Blueberry' },
//   { id: 10, name: 'Raspberry' }
// ];

// const Autocomplete = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [PlcaeholderText, setPlcaeholderText] = useState("")
//   const [SelectedOption, setSelectedOption] = useState("")
//   const [Focused, setFocused] = useState(false)

//   const handleInputChange = (event) => {
//     const value = event.target.value;
//     setInputValue(value.toLowerCase());
//     console.log(value.toLowerCase())
//     // Filter data based on input value and show top 5 results
//     let filteredResults = []
//     if(value){
//       filteredResults = data.filter(item => item.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
//     }else{

//     }
     
//     let transformedResults = filteredResults.map(i => { 
//       i.name = i.name.toLowerCase() 
//       return i
//     })
//     console.log(transformedResults)
//     if(transformedResults.length){
//       setSearchResults(transformedResults);
      
//     }else{
//       setSearchResults([])
//     }
    
//     let valLen = value.length

//     if(value.toLowerCase() == transformedResults[0]?.name.toLowerCase().substring(0,valLen)){
//       setPlcaeholderText(transformedResults[0]?.name)
//       setSelectedOption({value:transformedResults[0]?.name,id:0})
//     }else{
//       setPlcaeholderText("")
//       setSelectedOption("")
//     }
//   };

//   const handleSubmit = (event,value) => {
//     console.log(value)
//     setFocused(false)
//     event.preventDefault();
    
//     let current_val = value ? value : inputValue
    
//     // Add search query to history
//     setSearchHistory(prevSearches => [current_val, ...prevSearches.slice(0, 4)]);

//     // Filter data based on input value and show all results
//     // const filteredResults = data.filter(item => item.name.toLowerCase().includes(current_val.toLowerCase()));
//     // setSearchResults(filteredResults);
//   };

//   const handleClear = () => {
//     setInputValue('');
//     setSearchResults([]);
//     setPlcaeholderText("")
//     setSelectedOption("")
//   };

//   const onKeyDown = (e) => {
//     if (e.key === "Tab") {
//       e.preventDefault();
//       console.log("Tab");
//       setInputValue(searchResults[0].name)
//     }
//     if(e.key === "ArrowDown"){
//       let item_length = searchResults.length
//       let curr_id = SelectedOption.id
//       if(curr_id + 1 < item_length){
//         setSelectedOption({value:searchResults[curr_id + 1].name,id:curr_id + 1})
//       }else{
//         setSelectedOption({value:searchResults[0].name,id:0})
//       }
//     }
//     if(e.key === "ArrowUp"){
//       let item_length = searchResults.length
//       let curr_id = SelectedOption.id
//       if(curr_id != 0){
//         setSelectedOption({value:searchResults[curr_id - 1].name,id:curr_id - 1})
//       }else{
//         setSelectedOption({value:searchResults[item_length - 1].name,id:item_length - 1})
//       }
//     }
//     if(e.key === "Escape"){
//     setFocused(false)
//     setInputValue('');
//     setSearchResults([]);
//     setPlcaeholderText("")
//     setSelectedOption("")
//     }
//   };

//   const setOnfocus = () => {
//     setFocused(true)
//   }

//   const removeFocus = () => {
//     setFocused(false)
//     setInputValue('');
//     setSearchResults([]);
//     setPlcaeholderText("")
//     setSelectedOption("")
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div class="container">
//         <img className="searchIcon" src={search}/>
//   <input type="text" value={inputValue}
//           onChange={handleInputChange} onKeyDown={onKeyDown}  onFocus={setOnfocus} className="freetyping"></input>
//   <input value={PlcaeholderText} autocomplete="off" className="persistentplaceholder"/>
//   { <button className="clearBtn" type="button" onClick={handleClear}>X</button>}
// </div>
//       <div>
    
        
//       </div>
//       { (searchResults.length > 0 ||  searchHistory.length > 0) && Focused &&
//         <div className="dropdown">
//           {searchResults.map(item => (
//             <div
//               key={item.id}
//               className= {SelectedOption.value == item.name.toLowerCase() ? "drop_selected" : "dropdown-item" }
//               dangerouslySetInnerHTML={{ __html:  inputValue && item.name.replace(new RegExp(inputValue, 'gi'), match => `<mark  
//               style="background-color:blue;border-radius: 4px;padding:0px 2px">${match}</mark>`) }}
//               onClick={(e)=>{handleSubmit(e,item.name)}}
//             />
//           ))}
//           {searchResults.length == 0  && searchHistory.map(item => (
//             <div
//               key={item.id}
//               className= "dropdown-item" 
//             >{item}</div>
//           ))}
//         </div>
//       }

//       {searchHistory.length > 0 &&
//         <div>
//           <p>Recent searches:</p>
//           <ul>
//             {searchHistory.map((query, index) => (
//               <li key={index}>{query}</li>
//             ))}
//           </ul>
//         </div>
//       }
//       <button type="submit">Search</button>
//     </form>
//   );
// };



//  export default Autocomplete;

// import React, { useState, useEffect, useRef } from 'react';

// const SearchableInput = ({ options, onSelect }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [showOptions, setShowOptions] = useState(false);
//   const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
//   const inputRef = useRef(null);
//   const dropdownRef = useRef(null);

//   const filteredOptions = options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()));


//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       switch (event.keyCode) {
//         case 38: // up arrow
//           event.preventDefault();
//           setSelectedOptionIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1);
//           break;
//         case 40: // down arrow
//           event.preventDefault();
//           setSelectedOptionIndex(prevIndex => prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0);
//           break;
//         case 13: // enter
//           if (selectedOptionIndex >= 0 && selectedOptionIndex < filteredOptions.length) {
//             event.preventDefault();
//             const selectedOption = filteredOptions[selectedOptionIndex];
//             setInputValue(selectedOption);
//             setShowOptions(false);
//             onSelect(selectedOption);
//           }
//           break;
//         case 27: // escape
//           event.preventDefault();
//           setShowOptions(false);
//           break;
//         default:
//           break;
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [selectedOptionIndex, filteredOptions, onSelect]);

//   const handleInputChange = (event) => {
//     const value = event.target.value;
//     setInputValue(value);
//     setSelectedOptionIndex(-1);
//     setShowOptions(true);
//   };

//   const handleSelectOption = (option) => {
//     setInputValue(option);
//     setShowOptions(false);
//     onSelect(option);
//   };

//   const handleInputFocus = () => {
//     setShowOptions(true);
//   };

//   const handleInputBlur = () => {
//     // Delay hiding the options to allow clicking on an option
//     setTimeout(() => setShowOptions(false), 100);
//   };

//   const handleDropdownMouseDown = (event) => {
//     // Prevent input blur when clicking on the dropdown
//     event.preventDefault();
//   };


//   return (
//     <div className="searchable-input">
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         onFocus={handleInputFocus}
//         onBlur={handleInputBlur}
//         ref={inputRef}
//       />
//       {showOptions && filteredOptions.length > 0 &&
//         <div
//           className="dropdown"
//           ref={dropdownRef}
//           onMouseDown={handleDropdownMouseDown}
//         >
//           {filteredOptions.map((option, index) => (
//             <div
//               key={option}
//               className={`dropdown-item ${index === selectedOptionIndex ? 'selected' : ''}`}
//               onClick={() => handleSelectOption(option)}
//               dangerouslySetInnerHTML={{ __html: option.replace(new RegExp(inputValue, 'gi'), match => `<mark>${match}</mark>`) }}
//             />
//           ))}
//         </div>
//       }
//     </div>
//   );
// };

// const options = [
//   'Apple',
//   'Banana',
//   'Orange',
//   'Pineapple',
//   'Mango',
//   'Kiwi',
// ];

// const App = () => {
//   const handleSelect = (option) => {
//     console.log(`Selected option: ${option}`);
//   };

//   return (
//     <div className="app">
//       <SearchableInput options={options} onSelect={handleSelect}/>
//      </div>)
// }

// export default App




