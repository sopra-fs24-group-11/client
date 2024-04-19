import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@radix-ui/react-dialog";

// dieses File ist zurzeit in Bearbeitung und kann nicht als vollständig angesehen werden.
const CustomDialog = () => {
  const dialogTriggerRef = useRef(null);

  const handleInputFocus = () => {
    if (dialogTriggerRef.current) {
      dialogTriggerRef.current.click();
    }
  };

  return (
    <Dialog>
        <DialogTrigger asChild ref={dialogTriggerRef}>
        <div>
            <label>Target Location:</label>
            <input
            className="flex input"
            placeholder="enter..."
            value={meetUpPlace.stationName === "" ? undefined : meetUpPlace.stationName}
            onFocus={handleInputFocus}
            ></input>
        </div>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Select Target Location</DialogTitle>
            <DialogDescription>
            Enter the Location where you want to get together:
            </DialogDescription>
        </DialogHeader>
        <input
            type="text"
            placeholder="Search..."
            value={locationSearchTerm}
            onChange={handleLocationSearchChange}
        />
        {locationSuggestions.length > 0 && (
            <ul className="suggestions-list bg-gray-100">
            {locationSuggestions.map((suggestion) => (
                <li
                key={suggestion.stationCode}
                onClick={() =>
                    handleLocationSuggestionSelect(suggestion)
                }
                onMouseEnter={() =>
                    setIsHovered(suggestion.stationCode)
                }
                onMouseLeave={() => setIsHovered(null)}
                style={{
                    cursor: "pointer",
                    textShadow:
                    isHovered === suggestion.stationCode
                        ? "2px 2px 4px #000"
                        : "none",
                }}
                >
                {suggestion.stationName}
                </li>
            ))}
            </ul>
        )}
        <DialogFooter>
            <Button
            onClick={handleLocationSubmit}
            backgroundColor="#14AE5C"
            >
            Select Target Location
            </Button>
        </DialogFooter>
        <DialogClose ref={closeDialogRef} className="hidden" />
        </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
