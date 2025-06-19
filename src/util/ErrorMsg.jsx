import PropTypes from 'prop-types';

const ErrorMsg = ({ msg }) => (
    <p className="text-red-600 text-sm mt-1">{msg}</p>
);

ErrorMsg.propTypes = {
    msg: PropTypes.string,
};

export default ErrorMsg;