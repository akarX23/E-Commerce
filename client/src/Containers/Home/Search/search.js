import React, { useEffect } from "react";
import { useState } from "react";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import SearchIcon from "@material-ui/icons/Search";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const Search = React.forwardRef((props, ref) => {
  const [inputValue, setinputValue] = useState("");
  const { classes } = props;

  useEffect(() => {
    setinputValue("");
  }, []);

  const handleBlur = () => {
    if (inputValue != "") {
      setinputValue("");
      props.handleValueChange([...props.value, inputValue]);
    }
  };

  const handleInputChange = (newValue) => {
    if (newValue[newValue.length - 1] === " " && newValue.trim().length > 0) {
      setinputValue("");
      props.handleValueChange([
        ...props.value,
        newValue.substring(0, newValue.length - 1),
      ]);
    } else setinputValue(newValue.trim());
  };

  return (
    <Autocomplete
      multiple
      onBlur={() => handleBlur()}
      limitTags={3}
      value={props.value}
      inputValue={inputValue}
      onInputChange={(event, newValue) => handleInputChange(newValue)}
      onChange={(event, newValue) => props.handleValueChange(newValue)}
      id="tags-filled"
      freeSolo
      options={props.options}
      style={{
        width: `${
          useMediaQuery(useTheme().breakpoints.down("xs")) ? "70%" : "50%"
        }`,
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Tooltip
            title={option}
            placement="top-start"
            classes={{
              tooltip: classes.tooltip,
              arrow: classes.arrowTooltip,
            }}
            arrow
            interactive
            key={index}
          >
            <Chip
              label={option}
              size="small"
              {...getTagProps({ index })}
              classes={{ root: classes.chip }}
            />
          </Tooltip>
        ))
      }
      size="small"
      filterSelectedOptions
      groupBy={(option) =>
        option[0] === "#" ? "tags :" : option[0].toUpperCase()
      }
      classes={{
        root: props.autoComplete,
        focused: classes.autocompleteFocus,
        listbox: classes.listbox,
        option: classes.options,
        clearIndicator: classes.clearIndicator,
        groupLabel: classes.groupLabel,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          className={classes.textField}
          size="small"
          variant="outlined"
          autoFocus
          color="primary"
          placeholder={props.placeholder}
          InputProps={{
            ...params.InputProps,
            autoComplete: "new-password",
            startAdornment: (
              <>
                <InputAdornment position="start" className={classes.searchIcon}>
                  <SearchIcon />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            classes: {
              root: classes.inputRoot,
              notchedOutline: classes.inputNotched,
            },
          }}
        />
      )}
    />
  );
});

export default Search;
