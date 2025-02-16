import React from "react";

const Spinner = () => (
  <div className="loader"> {/* {{ edit_1 }} */}
    <style jsx>{`
      .loader {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid rgba(255, 255, 255, 1);
        border-radius: 50%;
        width: 40px; /* {{ edit_2 }} */
        height: 40px; /* {{ edit_2 }} */
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner; // {{ edit_3 }}