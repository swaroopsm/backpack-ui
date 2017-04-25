import React, { PropTypes } from "react";
import radium from "radium";
import colors from "../../styles/colors";
import { textBodyArticleSmall } from "../../utils/typography";
import propTypes from "../../utils/propTypes";

const styles = Object.assign({}, {
  color: colors.textPrimary,
  marginBottom: 0,
  marginTop: 0,
}, textBodyArticleSmall());

const TextBodyArticleSmall = ({ children, style }) => (
  <p style={[styles, style]}>
    {children}
  </p>
);

TextBodyArticleSmall.propTypes = {
  children: PropTypes.string.isRequired,
  style: propTypes.style,
};

export default radium(TextBodyArticleSmall);