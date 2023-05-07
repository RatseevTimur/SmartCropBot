import React, { useEffect } from 'react';
import { useSmartcrop, SmartcropStatus } from "use-smartcrop";
import './App.css';
//import CIP from 'canvas_image_processing'
//import smartcrop from 'smartcrop'
//const CIP = require('canvas_image_processing');
import ImageSelect from './ImageSelect/ImageSelect.js'


function App() {
  const uploadImage = null
  const src = "./photo.jpg";
  const [cropped, error] = useSmartcrop({ src }, { width: 200, height: 300, minScale: 1.0 });
  if (error) {
    console.error(error);
  }

  // useEffect(()=>{
  //   let image = document.getElementById('image')

  //   console.log(image.height)
  //   console.log(image.clientWidth)
  //   image.style.display = "none"

  //   // let promise = new Promise((resolve, reject) => {
  //   //   smartcrop.crop(image, { width: 100, height: 100 }).then(function(result) {
  //   //       resolve(result);
  //   //   });
  //   // });
  //   // promise
  //   //   .then(
  //   //     result => {
  //   //       console.log("Fulfilled: ", result);
  //   //     },
  //   //     error => {
  //   //       console.log("Rejected: ", error);
  //   //     }
  //   //   );
  // })

  return (
    <div className="App">
      <ImageSelect/>

      {/* <div>
        <input type="file" onChange={uploadImage}/>
        <img id="image" src="./photo.jpg" alt="альтернативный текст"/>
      </div>

      <div>
        {cropped && <img src={cropped} />}
      </div> */}

      
    </div>
  );
}

export default App;
