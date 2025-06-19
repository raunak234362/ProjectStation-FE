import errorIMG from '../../assets/errorimg.jpg'
const ErrorBoundary = () => {
  return (
    <div className="flex items-center justify-center min-h-screen max-md:items-start max-md:py-10 bg-gray-100">
      <div className="text-center flex flex-col justify-center items-center p-6 w-[85%] bg-white rounded-lg shadow-lg">
        <img src={errorIMG} alt="Error occcured" className='w-[70%]'/>
        <p className="text-lg text-gray-700 mb-6">
          We encountered an Bad Request error. Please try again or contact the developer.
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}

export default ErrorBoundary;
