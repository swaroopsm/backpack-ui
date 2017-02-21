import React, { Component, PropTypes } from "react";
import merge from "lodash/merge";

const _ = { merge };

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
  min: {
    test: (arg) => (val) => val.length >= arg,
    message: (arg) => (name) => `${name} must be at least ${arg} characters.`,
  },
  max: {
    test: (arg) => (val) => val.length <= arg,
    message: (arg) => (name) => `${name} must ${arg} less than characters.`,
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

    const combinedValidationRules = _.merge({}, validationRules, this.props.rules);

    return fieldRules && fieldRules.map(rule => {
      if (rule.indexOf(":") >= 0) {
        const [funcName, arg] = rule.split(":");
        if (combinedValidationRules[funcName]) {
          return !combinedValidationRules[funcName].test(arg)(value) &&
          combinedValidationRules[funcName].message(arg)(field);
        }
      }
      return (
      combinedValidationRules[rule] &&
      !combinedValidationRules[rule].test(value) &&
      combinedValidationRules[rule].message(field)
      );
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
