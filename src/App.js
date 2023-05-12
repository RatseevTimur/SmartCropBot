import React, { useEffect, useState } from 'react';
import { useSmartcrop, SmartcropStatus } from "use-smartcrop";
import './App.css';
//import CIP from 'canvas_image_processing'
//import smartcrop from 'smartcrop'
//const CIP = require('canvas_image_processing');
import ImageSelect from './ImageSelect/ImageSelect.js'

// ///////////
// import { app } from "./base";
// import { useForm } from "react-hook-form";

// const InputFile = () => {
// const { register, handleSubmit } = useForm();

// const onSubmit = (data) => {
//     const file = data.image[0];
//     const storageRef = app.storage().ref();
//     const fileRef = storageRef.child(file.name);
//     fileRef.put(file).then(() => {
//     console.log("Uploaded a file");
//     });
// };

// return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//     <input
//         ref={register}
//         name="image"
//         type="file" />
//     </form>
// );
// }
// ///////////

const ImageInput = () => {
  const [images, setImages] = useState([])
  const [imagesURLs, setImagesURLs] = useState([])
  const [imagesCropeds, setCropeds] = useState([])

  useEffect(() => {
    if (images.length < 1) return;
    const newImagesURLs = []
    images.forEach(image => newImagesURLs.push(URL.createObjectURL(image)))
    setImagesURLs(newImagesURLs)
  }, [images])

  function onImageChange(e) {
    setImages([...e.target.files])

    // const newCropedImages = []
    imagesURLs.forEach(image => {
      console.log(imageSize(image))
    })
    // setCropeds(newCropedImages)
    

  }

  function imageSize(src) {
    const img = document.createElement("img");

    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        // Natural size is the actual image size regardless of rendering.
        // The 'normal' `width`/`height` are for the **rendered** size.
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Resolve promise with the width and height
        resolve({ width, height });
      };

      // Reject promise on error
      img.onerror = reject;
    });

    // Setting the source makes it start downloading and eventually call `onload`
    img.src = src;

    return promise.then(value => console.log(value))
  }

  
  console.log(imagesURLs)
  console.log(images)
  return (
    <>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      {imagesURLs.map(imageSrc => <img style={{ display: "none" }} key={imageSrc} src={imageSrc} />)}
      {/* {imagesURLs.map(imageSrc => <img src={cropped} />)} */}
    </>
  )
}


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
      <ImageSelect />

      {/* <div>
        <input type="file" onChange={uploadImage}/>
        <img id="image" src="./photo.jpg" alt="альтернативный текст"/>
      </div>

      <div>
        {cropped && <img src={cropped} />}
      </div> */}

      {/* <InputFile/> */}
      {/* <ImageInput /> */}

    </div>
  );
}

export default App;
