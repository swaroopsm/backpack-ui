import React, { Component, PropTypes } from "react";

const emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validationRules = {
  required: {
    test: (val) => val.length > 0,
    message: (name) => `${name} is required.`,
  },
  email: {
    test: (val) => emailRegEx.test(val),
    message: (name) => `${name} must be a valid email.`,
  },
};

class Validate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessages: {},
    };

    this.handleValidate = this.handleValidate.bind(this);
    this.testForValidation = this.testForValidation.bind(this);
  }

  handleValidate(e) {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const errorMessages = this.testForValidation(fieldName, fieldValue);
    this.setState({
      errorMessages: Object.assign(
        {},
        this.state.errorMessages,
        { [fieldName]: errorMessages },
      ),
    });
  }

  testForValidation(field, value) {
    const fieldRules = this.props.validations[field];
    const combinedValidationRules = Object.assign({}, validationRules, this.props.rules);
    return fieldRules && fieldRules.map(rule => {
      return !combinedValidationRules[rule].test(value) &&
      combinedValidationRules[rule].message(field);
    }).filter(val => val);
  }

  render() {
    return this.props.children(this.handleValidate, this.state.errorMessages);
  }
}

Validate.propTypes = {
  children: PropTypes.func.isRequired,
  validations: PropTypes.objectOf(PropTypes.array).isRequired,
  rules: PropTypes.shape({
    test: PropTypes.func,
    message: PropTypes.func,
  }),
};

export default Validate;
