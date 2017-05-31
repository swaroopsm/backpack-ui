/** @flow */
import React from "react";
import Validate from "react-validate-form";
import PropTypes from "prop-types";
import Input from "../form/input";
import Button from "../button";
import ErrorMessages from "../form/errorMessages";
import color from "../../styles/colors";

const styles = {
  container: {
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: "23px",
  },
  input: {
    borderBottom: `1px solid ${color.borderPrimary}`,
  },
};

class LegacyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifierValue: "",
      passwordValue: "",
      showErrors: false,
      valid: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.valid) {
      return this.setState({
        showErrors: true,
      });
    }

    return this.form.submit();
  }

  handleChange(e, type, errorCount) {
    this.setState({
      [`${type}Value`]: e.target.value,
      valid: errorCount === 0,
    });
  }

  render() {
    return (
      <div style={styles.container}>
        <Validate>
          {({ validate, errorMessages, errorCount }) => (
            <form
              action={this.props.authLink}
              ref={(node) => {
                this.form = node;
              }}
              method="post"
            >
              <div style={styles.inputContainer}>
                <input type="hidden" name="user_identifier_type" value="email" />
                <Input
                  theme="float"
                  type="text"
                  name="user_identifier"
                  required
                  customStyles={styles.input}
                  error={errorMessages.user_identifier && errorMessages.user_identifier.length > 0}
                  placeholder="Email or username"
                  onChange={(e) => {
                    this.handleChange(e, "identifier", errorCount);
                    validate(e);
                  }}
                  value={this.state.identifierValue}
                />

                <Input
                  theme="float"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  customStyles={styles.input}
                  error={errorMessages.password && errorMessages.password.length > 0}
                  onChange={(e) => {
                    this.handleChange(e, "password", errorCount);
                    validate(e);
                  }}
                  value={this.state.passwordValue}
                />
                {
                  this.state.showErrors &&
                  errorMessages.user_identifier &&
                  errorMessages.user_identifier.length > 0 &&
                  <ErrorMessages messages={errorMessages.user_identifier} />
                }
                {
                  this.state.showErrors &&
                  errorMessages.password &&
                  errorMessages.password.length > 0 &&
                  <ErrorMessages messages={errorMessages.password} />
                }
              </div>
              <Button
                onClick={this.handleSubmit}
                rounded
              >
                Submit
              </Button>
            </form>
          )}
        </Validate>
      </div>
    );
  }
}

LegacyForm.propTypes = {
  authLink: PropTypes.string.isRequired,
};

export default LegacyForm;
