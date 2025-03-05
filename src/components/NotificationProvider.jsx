import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext";

// ✅ Notification Provider to manage toast notifications
export const NotificationProvider = ({ children }) => {
  // ✅ Function to display different types of notifications
  const notify = (type, message) => {
    const options = { position: "top-right" };
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "info":
        toast.info(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  return (
    <NotificationContext.Provider value={notify}>
      <ToastContainer className={'notify'} /> {/* ✅ Component to display toasts */}
      {children}
    </NotificationContext.Provider>
  );
};

// ✅ Ensure `children` is a valid React node
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
