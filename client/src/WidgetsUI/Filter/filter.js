import React, { useState } from "react";
import "./filter.css";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Bounce from "react-reveal/Bounce";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import StarIcon from "@material-ui/icons/Star";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  root: {
    width: 120,
    color: "#d69e2e",
  },
  autocomplete: {
    width: 80,
  },
  listbox: {
    backgroundColor: "#202428",
    color: "white",
  },
  option: {
    fontSize: 15,
    "&:hover, &:focus": {
      backgroundColor: "#343A40",
    },
  },
  inputRoot: {
    color: "white",
    fontSize: "13px",
  },
  dollar: {
    color: "#68d391",
    width: 5,
    paddingRight: "15px",
    paddingLeft: 0,
    marginLeft: 0,
    marginRight: "5px",
  },
  star: {
    color: "#d69e2e",
  },
  sort: {
    color: "white",
    padding: "6px",
    paddingLeft: "13px",
    backgroundColor: "#202428 !important",
  },
  sortMenu: {
    backgroundColor: "#33383D",
    paddingLeft: "7px",
    paddingRight: "7px",
    boxShadow: "0 0 4px 3px #000",
  },
  sortMenuItem: {
    color: "#D2D8DD !important",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#202428 !important",
    },
  },
  icon: {
    color: "#C3C9D0",
    transform: "rotate(90deg)",
    transition: "all 0.4s ease-in",
  },
  iconOpen: {
    transform: "rotate(270deg)",
  },
  selectedSort: {
    backgroundColor: "#1a202c !important",
  },
  switchBase: {
    color: "#6b46c1",
    "&$checked": {
      color: "#38b2ac",
    },
    "&$checked + $track": {
      backgroundColor: "#68d391",
    },
    "& $track": {
      backgroundColor: "#fff !important",
    },
  },
  checked: {},
  track: {},
  buttonApply: {
    color: "#fff",
    fontSize: "13px",
    backgroundColor: "#553c9a",
    letterSpacing: "2px",
    "&:hover": {
      backgroundColor: "#44337a",
    },
    outline: "none !important",
    border: "none !important",
  },
  buttonClear: {
    color: "#fff",
    fontSize: "13px",
    backgroundColor: "#d53f8c",
    letterSpacing: "2px",
    "&:hover": {
      backgroundColor: "#97266d",
    },
    outline: "none !important",
    border: "none !important",
  },
});

const Filter = (props) => {
  const classes = useStyles();
  const [filterOpen, setfilterOpen] = useState(false);
  const [rating, setRating] = useState([1, 5]);
  const [price, setPriceRange] = useState(["Min", "Max"]);
  const [priceInput, setInput] = useState(["", ""]);
  const [sortby, setSortBy] = useState(0);
  const [order, setOrder] = useState("desc");

  const minPriceOptions = ["Min", "500", "1000", "2000", "5000"];
  const maxPriceOptions = ["500", "1000", "2000", "5000", "Max"];
  const sortByValues = ["Relevance", "Popularity", "Date", "Price", "Rating"];

  const handleBlur = (index) => {
    let newPrice = [...priceInput];
    let invalidRange = false;

    if (
      (index === 0 &&
        !isNaN(parseInt(newPrice[1])) &&
        parseInt(newPrice[0]) >= parseInt(newPrice[1])) ||
      (index === 1 &&
        !isNaN(parseInt(newPrice[0])) &&
        parseInt(newPrice[1]) <= parseInt(newPrice[0]))
    )
      invalidRange = true;

    newPrice[index] =
      priceInput[index] === "" ||
      isNaN(priceInput[index]) ||
      invalidRange === true
        ? index === 0
          ? "Min"
          : "Max"
        : priceInput[index];

    setInput([...newPrice]);
    setPriceRange([...newPrice]);
  };

  const handleInputChange = (newValue, index) => {
    priceInput[index] = newValue;
    setInput([...priceInput]);
  };

  const handleValueChange = (newValue, index) => {
    price[index] = newValue;
    setPriceRange([...price]);
  };

  const getStarIcon = () => {
    const value = rating[1];

    if (value === 1) return <StarBorderIcon classes={{ root: classes.star }} />;
    else if (value > 1 && value < 4)
      return <StarHalfIcon classes={{ root: classes.star }} />;
    else return <StarIcon classes={{ root: classes.star }} />;
  };

  const getPriceField = (options, index) => (
    <Autocomplete
      selectOnFocus={true}
      autoComplete={true}
      freeSolo
      options={options}
      classes={{
        root: classes.autocomplete,
        option: classes.option,
        listbox: classes.listbox,
      }}
      value={price[index]}
      inputValue={priceInput[index]}
      onInputChange={(event, newValue) => handleInputChange(newValue, index)}
      onChange={(event, newValue) => {
        handleValueChange(newValue, index);
      }}
      onBlur={() => handleBlur(index)}
      size="small"
      disableClearable
      openOnFocus
      autoHighlight
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          color="primary"
          InputProps={{
            ...params.InputProps,
            autoComplete: "new-password",
            startAdornment: (
              <>
                <InputAdornment position="start" className={classes.dollar}>
                  <AttachMoneyOutlinedIcon fontSize="small" />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            classes: {
              root: classes.inputRoot,
            },
          }}
        />
      )}
    />
  );

  const setDefault = () => {
    setRating([1, 5]);
    setPriceRange(["Min", "Max"]);
    setInput(["Min", "Max"]);
    setSortBy(0);
    setOrder(-1);
  };

  return (
    <>
      <ClickAwayListener onClickAway={() => setfilterOpen(false)}>
        <div className="filterContainer flex flex-col items-end">
          <Bounce right when={filterOpen} collapse unmountOnExit duration={700}>
            <div className="rounded-lg mb-1 p-2 flex flex-col bg-darktheme-800 items-center justify-start">
              <div className="flex justify-between items-center w-full px-1">
                <div className="text-darktheme-100 text-base">Rating</div>
                <div className="flex-grow flex justify-end px-4 box-border">
                  {getStarIcon()}
                </div>
                <Slider
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  valueLabelDisplay="auto"
                  min={1}
                  max={5}
                  marks={true}
                  classes={{ root: classes.root }}
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <div className="text-darktheme-100 text-base mr-4">
                  Price Range
                </div>
                <div className="flex items-center">
                  {getPriceField(minPriceOptions, 0)}
                  <div className="text-4xl text-darktheme-200 mx-2 -mt-1">
                    ~
                  </div>
                  {getPriceField(maxPriceOptions, 1)}
                </div>
              </div>
              <div className="flex justify-between items-center w-full px-1 my-1">
                <div className="text-darktheme-100 text-base">Sort By</div>
                <TextField
                  select
                  value={sortby}
                  onChange={(event) => setSortBy(event.target.value)}
                  variant="outlined"
                  SelectProps={{
                    classes: {
                      root: classes.sort,
                      icon: classes.icon,
                      iconOpen: classes.iconOpen,
                    },
                    MenuProps: {
                      classes: {
                        paper: classes.sortMenu,
                      },
                      disableScrollLock: true,
                      disablePortal: true,
                      anchorOrigin: {
                        vertical: "center",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "center",
                        horizontal: "right",
                      },
                      getContentAnchorEl: null,
                    },
                  }}
                >
                  {sortByValues.map((method, i) => (
                    <MenuItem
                      value={i}
                      key={i}
                      classes={{
                        root: classes.sortMenuItem,
                        selected: classes.selectedSort,
                      }}
                    >
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="flex justify-between items-center w-full px-1">
                <div className="text-darktheme-100 text-base">Order</div>
                <div className="flex justify-between items-center text-base text-white">
                  Low to High
                  <Switch
                    checked={order === "desc" ? true : false}
                    onChange={(event) => {
                      event.target.checked === false
                        ? setOrder("asc")
                        : setOrder("desc");
                    }}
                    classes={{
                      switchBase: classes.switchBase,
                      checked: classes.checked,
                      track: classes.track,
                    }}
                  />
                  High to Low
                </div>
              </div>
              <div className="flex justify-evenly w-full my-3">
                <Button
                  variant="contained"
                  size="small"
                  classes={{ root: classes.buttonApply }}
                  onClick={() => {
                    setfilterOpen(false);
                    props.applyFilters({
                      rating,
                      price,
                      sortby,
                      order,
                    });
                  }}
                >
                  Apply
                </Button>
                <Button
                  variant="contained"
                  classes={{ root: classes.buttonClear }}
                  size="small"
                  onClick={setDefault}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Bounce>
          <Tooltip title="Apply Filters" placement="left" arrow>
            <div className="rounded-full overflow-hidden">
              <Fab color="primary" onClick={() => setfilterOpen(!filterOpen)}>
                {filterOpen === false ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Fab>
            </div>
          </Tooltip>
        </div>
      </ClickAwayListener>
    </>
  );
};
export default Filter;
