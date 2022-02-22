import { useState, useRef, useEffect } from "react";

const Autocomplete = ({ suggestions, handleInputSelected, handleInputChanged, handleInputClear }) => {

    const debugControl = {'isOn': false, 'logKeyboard': false, 'logEffects': false};

    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [onBlurFired, setOnBlurFired] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [input, setInput] = useState({"name": ""});
    const [inputSelected, setInputSelected] = useState("");
    const currentElementSelectedRef = useRef(null);
    const currentSuggestionsRef = useRef(null);
    
    useEffect(() => {
      setFilteredSuggestions([]);
        setShowSuggestions(false);
      if (suggestions && suggestions.length > 0) {
        const unLinked = suggestions.filter(
          (suggestion) =>
            suggestion.name.toLowerCase().startsWith(input?.name?.toLowerCase() ?? "") !== false
        );
        
        setFilteredSuggestions(unLinked);
        setShowSuggestions(true);
      }
    }, [suggestions])

    useEffect(() => {
        if (handleInputSelected !== undefined) {
            handleInputSelected(inputSelected)
        }
    }, [handleInputSelected, inputSelected])

    useEffect(() => {
        if (handleInputChanged !== undefined && input && input.length > 0) {
            handleInputChanged(input)
        }
    }, [input])

    useEffect(() => {
        if (currentElementSelectedRef.current !== null && currentSuggestionsRef.current !== null) {
            // currentLiRef.current.scrollIntoView(); -> Move all the page. I don't like this.
            // My solution:
            
            const rectCurrentElementSelectedInSuggestions = currentElementSelectedRef.current.getBoundingClientRect();
            const rectCurrentSuggestionsNavigator = currentSuggestionsRef.current.getBoundingClientRect();

            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.current.scrollTop: ' + currentElementSelectedRef.current.scrollTop);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.current.scrollHeight: ' + currentElementSelectedRef.current.scrollHeight);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.current.clientHeight: ' + currentElementSelectedRef.current.clientHeight);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.current.clientWidth: ' + currentElementSelectedRef.current.clientWidth);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.current.innerHeight: ' + currentElementSelectedRef.current.innerHeight);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.current.innerWidth: ' + currentElementSelectedRef.current.innerWidth);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.rect.top: ' + rectCurrentElementSelectedInSuggestions.top);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.rect.left: ' + rectCurrentElementSelectedInSuggestions.left);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.rect.bottom: ' + rectCurrentElementSelectedInSuggestions.bottom);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentElementSelectedInSuggestions.rect.right: ' + rectCurrentElementSelectedInSuggestions.right);

            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.current.scrollTop: ' + currentSuggestionsRef.current.scrollTop);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.current.scrollHeight: ' + currentSuggestionsRef.current.scrollHeight);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.current.clientHeight: ' + currentSuggestionsRef.current.clientHeight);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.current.clientWidth: ' + currentSuggestionsRef.current.clientWidth);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.current.innerHeight: ' + currentSuggestionsRef.current.innerHeight);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.current.innerWidth: ' + currentSuggestionsRef.current.innerWidth);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.rect.top: ' + rectCurrentSuggestionsNavigator.top);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.rect.left: ' + rectCurrentSuggestionsNavigator.left);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.rect.bottom: ' + rectCurrentSuggestionsNavigator.bottom);
            if (debugControl.isOn && debugControl.logEffects) console.log('currentSuggestionsRef.rect.right: ' + rectCurrentSuggestionsNavigator.right);

            if (rectCurrentElementSelectedInSuggestions.bottom > rectCurrentSuggestionsNavigator.bottom) {
                currentSuggestionsRef.current.scrollTop = rectCurrentElementSelectedInSuggestions.bottom - rectCurrentSuggestionsNavigator.bottom;
            }
        }
    }, [activeSuggestionIndex, currentElementSelectedRef.current, currentSuggestionsRef.current ])

    useEffect(() => {
      if (onBlurFired) {
        console.log(inputSelected);
        setInput({"name": inputSelected?.name ?? ""});
        setShowSuggestions(false);
        if (handleInputClear) handleInputClear();
      }
      
    }, [inputSelected, onBlurFired])

    const onBlur = () => {
        setTimeout(() => {
          if (debugControl.isOn) console.log('onBlur');
          setOnBlurFired(true);
        }, 100);
        
    }

    const handleClearSelection = () => {
      setInputSelected("");
      setInput({"name": ""});
      if (handleInputClear) handleInputClear();
    }

    const onChange = (e) => {
      setOnBlurFired(false);
        if (debugControl.isOn) console.log('onChange');
        setInput({"name": e.target.value});
        setActiveSuggestionIndex(0);
        setShowSuggestions(true);
        handleInputChanged({"name": e.target.value});
        setFilteredSuggestions([]);
      };
    
      const onClick = (_, key) => {
        if (debugControl.isOn) console.log('onClick');
        let clicked = filteredSuggestions[key];
        if (debugControl.isOn) console.log(clicked);
        setInput({"name": clicked.name});
        setInputSelected(clicked);
        setFilteredSuggestions([]);
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
      };

      const onKeyDown = (e) => {
        // User pressed the enter key
        if (e.keyCode === 13) {
          setInput({"name": filteredSuggestions[activeSuggestionIndex].name});
          setInputSelected(filteredSuggestions[activeSuggestionIndex]);
          setFilteredSuggestions([]);
          setActiveSuggestionIndex(0);
          setShowSuggestions(false);
        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
            if (debugControl.isOn && debugControl.logKeyboard) console.log('Keyboard Up Event' + 'activeSuggestionIndex: ' + activeSuggestionIndex + ' filteredSuggestions: '+filteredSuggestions.length)
          if (activeSuggestionIndex === 0) {
            return;
          }
    
          setActiveSuggestionIndex((prevValue) => prevValue - 1);
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
            if (debugControl.isOn && debugControl.logKeyboard) console.log('Keyboard Down Event' + 'activeSuggestionIndex: ' + activeSuggestionIndex + ' filteredSuggestions: '+filteredSuggestions.length)
          if (activeSuggestionIndex + 1 === filteredSuggestions.length) {
            return;
          }
    
          setActiveSuggestionIndex((prevValue) => prevValue + 1);
        }
      };

      const highlightText = (suggestion, userInput) => {    
          let indexElement = suggestion.name.toLowerCase().indexOf(userInput.name.toLowerCase()) + userInput.name.length;
          let prefix = suggestion.name.substring(0, indexElement);
          let suffix = suggestion.name.substring(indexElement);
          
          return (
              <div>
                <div>
                  <span className="bg-yellow-400">{prefix}</span>{suffix}
                </div>
                <div>
                  <span className="">Country: {suggestion.country}</span>
                </div>
                <div>
                  <span className="">SubCountry: {suggestion.subcountry}</span>
                </div>
                <div>
                  <span className="">Geonameid: {suggestion.geonameid}</span>
                </div>
              </div>
          )
      }

      const SuggestionsListComponent = () => {
        return filteredSuggestions && filteredSuggestions.length ? (
          <div ref={currentSuggestionsRef} className="flex flex-col absolute w-full z-50 bg-white border border-gray-300 mt-1 max-h-64 overflow-hidden overflow-y-scroll rounded shadow">
            {filteredSuggestions.map((suggestion, index) => {
              let className = "px-3 py-2 cursor-pointer text-left";
    
              // Flag the active suggestion with a class
              let flagActiveSuggestion = index === activeSuggestionIndex;
              if (flagActiveSuggestion) {
                className = className + " bg-sky-500/100";
              } else {
                className = className + " hover:bg-gray-200";
              }
    
              return (
                flagActiveSuggestion ?
                <div className={className} key={index} onClick={(e) => onClick(e, index)} ref={currentElementSelectedRef}>
                    {highlightText(suggestion, input)}
                </div>
                :
                <div className={className} key={index} onClick={(e) => onClick(e, index)}>
                    {highlightText(suggestion, input)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-suggestions">
            <span role="img" aria-label="tear emoji">
              😪
            </span>{" "}
            <em>sorry no suggestions</em>
          </div>
        );
      };

    return (
        <>
        <div className="w-full relative">
            <div className="flex items-center">
                <div className={((inputSelected && inputSelected.length > 0) ? "w-11/12":"w-full")}>
                    <input 
                        className="w-full
                            border rounded shadow p-2
                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 flex-none
                            "
                            type="text"
                            placeholder="Type something to search..."
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            onBlur={onBlur}
                            value={input.name || ""}
                    />
                </div>
                {inputSelected && 
                    <div className={"w-1/12"}>
                        <p 
                        className="
                        text-md text-right ml-2 flex-none cursor-pointer
                        text-sky-300
                        hover:text-sky-600 hover:underline
                        "
                        onClick={handleClearSelection}
                        >Clear</p>
                    </div>
                }
            </div>
            
            {showSuggestions && input && <SuggestionsListComponent />}
        </div>
            
        </>
    )
}

export default Autocomplete;