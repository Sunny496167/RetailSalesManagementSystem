// frontend/src/components/Common/Loading.jsx
const Loading = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
      sm: 'w-6 h-6 border-2',
      md: 'w-10 h-10 border-3',
      lg: 'w-16 h-16 border-4',
    };
  
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div
          className={`${sizes[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`}
        ></div>
        {text && <p className="mt-4 text-gray-600">{text}</p>}
      </div>
    );
  };
  
  export default Loading;