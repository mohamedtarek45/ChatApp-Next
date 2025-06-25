const layout = async ({ children }) => {
  return (
    <>
      <div className="h-[100vh]">

      <header className="flex items-center justify-center shadow-md p-4 dark:bg-ExtraDark">
        <h2 className="text-black dark:text-white">Chat App</h2>
      </header>



      {children}


      </div>
    </> 
  );
};

export default layout;
