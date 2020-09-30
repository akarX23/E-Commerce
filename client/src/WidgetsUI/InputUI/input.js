import React from "react";
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Fade from "react-reveal/Fade";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const Input = ({
  typeOf,
  label,
  multiline,
  Icon,
  EndIcon,
  rows,
  rowsMax,
  classes,
  info,
  value,
  onChange,
  placeholder,
  chipped,
  handleAddChip,
  handleDeleteChip,
  error,
  handleBlur,
  readonly,
  altIconAction,
  altIconTooltip,
}) => {
  return (
    <div className="flex w-full mt-8 flex-col items-start">
      <div className="text-darktheme-200 w-auto text mb:text-xl">{label}</div>
      <div className="w-full mt-2">
        {!chipped ? (
          <TextField
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={handleBlur}
            size="small"
            multiline={multiline}
            variant="outlined"
            classes={{ root: classes.textField }}
            InputProps={{
              type: typeOf ? typeOf : "text",
              readOnly: readonly,
              autoComplete: "new-password",
              startAdornment: (
                <>
                  {Icon ? (
                    <InputAdornment className={classes.icon}>
                      <Icon />
                    </InputAdornment>
                  ) : null}
                </>
              ),
              endAdornment: (
                <>
                  {EndIcon ? (
                    <InputAdornment>
                      <Tooltip placement="bottom" title={altIconTooltip}>
                        <IconButton
                          onClick={() => altIconAction()}
                          classes={{ root: classes.altIcon }}
                        >
                          <EndIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null}
                </>
              ),
              classes: {
                root: classes.inputRoot,
                notchedOutline: classes.inputNotched,
              },
            }}
            rows={rows}
            rowsMax={rowsMax}
          />
        ) : (
          <ChipInput
            newChipKeyCodes={[13, 32]}
            variant="outlined"
            blurBehavior="add"
            fullWidthInput
            classes={{
              root: classes.textField,
              inputRoot: classes.chipInput,
              chip: classes.chip,
            }}
            InputProps={{ readOnly: readonly }}
            value={value}
            onAdd={(chip) => !readonly && handleAddChip(chip)}
            onDelete={(chip, index) =>
              !readonly && handleDeleteChip(chip, index)
            }
            onBlur={handleBlur}
          />
        )}
      </div>
      {info && <div className={classes.info}>{info}</div>}
      <Fade
        when={error !== ""}
        bottom
        collapse
        duration={400}
        cascade
        fraction={0}
      >
        <div
          className={`text-xsm text-red-1100 mb-2 tracking-wider italic font-sans font-base ${
            info ? "" : "pt-1"
          }`}
        >
          {error}
        </div>
      </Fade>
    </div>
  );
};

export default Input;
