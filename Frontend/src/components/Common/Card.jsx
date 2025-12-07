// frontend/src/components/Common/Card.jsx
const Card = ({ children, className = '', title, actions }) => {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        {(title || actions) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    );
  };
  
  export default Card;