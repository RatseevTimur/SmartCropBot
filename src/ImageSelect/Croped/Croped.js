import React from "react";
import { useSmartcrop, SmartcropStatus } from "use-smartcrop";

function Croped({url}) {
  const src = url;
  // Width and height are required.
  const [cropped, error] = useSmartcrop({ src }, { width: 200, height: 400, minScale: 1.0 });
  if (error) {
    console.error(error);
  }

  return (
    <div>
      {cropped && <img src={cropped} />}
    </div>
  );
}

export default Croped