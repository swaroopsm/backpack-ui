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
    message: (arg) => (name) => `${name} must be less than ${arg} characters.`,
  },
};

class Validate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessages: {},
      argumentSeperator: ":",
      allValid: false,
      errorCount: 0,
    };

    this.handleValidate = this.handleValidate.bind(this);
    this.testForValidation = this.testForValidation.bind(this);
  }

  handleValidate(e) {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const fieldErrorMessages = this.testForValidation(fieldName, fieldValue);
    const allErrors = Object.assign(
        {},
        this.state.errorMessages,
        { [fieldName]: fieldErrorMessages },
      );

    const errorCount = this.checkErrorCount(allErrors);

    this.setState({
      errorMessages: allErrors,
      errorCount,
      allValid: errorCount === 0,
    });
  }

  checkErrorCount(errorObject) {
    return Object.keys(errorObject).length &&
      Object.keys(errorObject).reduce((acc, curr) => {
        const total = acc += Object.keys(errorObject[curr]).length;
        return total;
      }, 0);
  }

  ruleHasArgument(rule) {
    return rule.indexOf(this.state.argumentSeperator) >= 0;
  }

  testForValidation(field, value) {
    const fieldRequirements = this.props.validations[field];

    // combine both the built in rules and custom rules
    const combinedValidationRules = _.merge({}, validationRules, this.props.rules);

    return fieldRequirements && fieldRequirements.map(rule => {
      if (this.ruleHasArgument(rule)) {
        const [funcName, arg] = rule.split(this.state.argumentSeperator);
        return (
          combinedValidationRules[funcName] &&
          !combinedValidationRules[funcName].test(arg)(value) &&
          combinedValidationRules[funcName].message(arg)(field)
        );
      }
      return (
        combinedValidationRules[rule] &&
        !combinedValidationRules[rule].test(value) &&
        combinedValidationRules[rule].message(field)
      );
    }).filter(val => val);
  }

  render() {
    return this.props.children(
      this.handleValidate,
      this.state.errorMessages,
      this.state.allValid,
      this.state.errorCount,
    );
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
