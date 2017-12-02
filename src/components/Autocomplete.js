/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';

function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {
          parts.map((part, index) => {
            if (part.highlight) {
              return (
                <span key={index} style={{ fontWeight: 300 }}>
                  {part.text}
                </span>
              );
            }
            return (
              <strong key={index} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
          })
        }
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function getSuggestions(suggestions, value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter((suggestion) => {
      const keep =
        count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'float',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
});

class Autocomplete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: props.suggestions,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(this.props.suggestions, value),
    });
  }

  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: this.props.suggestions,
    });
  }

  handleChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.props.onSubmit(event.target.value);
    } else if (event.keyCode === 27) {
      this.props.onEscape();
    }
  }

  render() {
    const { classes, placeholder } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: true,
          classes,
          placeholder,
          value: this.state.value,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown,
          // onBlur: () => onEscape(),
        }}
      />
    );
  }
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  onEscape: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
};

Autocomplete.defaultProps = {
  onSubmit: () => {},
  onEscape: () => {},
};

export default withStyles(styles)(Autocomplete);
