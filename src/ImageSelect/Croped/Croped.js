import React, { useEffect } from "react";
import { useSmartcrop, SmartcropStatus } from "use-smartcrop";
import { saveAs } from 'file-saver'

import { Button } from 'primereact/button';
import 'primeicons/primeicons.css'

import "./Croped.css"

function Croped({ url, width, height, id }) {
    const src = url;
    // Width and height are required.
    const [cropped, error] = useSmartcrop({ src }, { width: width, height: height, minScale: 1.0 });
    if (error) {
        console.error(error);
    }
          
    useEffect(() => {
        // doowland()

        // setTimeout(downloadImage(cropped), 2000)
        
    }, [])

    async function downloadImage(imageSrc) {
        const image = await fetch(imageSrc)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)
      
        const link = document.createElement('a')
        link.href = imageURL
        link.download = 'Cropped.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // function doowland(){
    //     function imageToBase64(src = '#', outputFormat) {
    //         return new Promise((resolve, reject) => {
    //             const img = new Image();
    //             img.crossOrigin = "Anonymous";
    //             img.onload = function () {
    //                 const canvas = document.createElement('CANVAS');
    //                 const ctx = canvas.getContext('2d');
    //                 let dataURL;
    //                 canvas.width = img.width;
    //                 canvas.height = img.height;
    //                 ctx.drawImage(img, 0, 0);
    //                 dataURL = canvas.toDataURL('image/png');
    //                 resolve(dataURL);
    //             }
    //             img.src = src;
    //             if (img.complete || img.complete === undefined) {
    //                 img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    //                 img.src = src;
    //             }
    //         });
    //     }

    //     const imageEl = document.getElementById(id)
    //     imageEl.addEventListener('click', (event) => {
    //         const { target } = event;
    //         const imageHREF = target.dataset.href;

    //         if (target.attributes.href.value === '#') {
    //             event.preventDefault();
    //             console.dir(target.attributes.href.value);
    //             imageToBase64(imageHREF)
    //             .then(image => {
    //                 target.attributes.href.value = image;
    //                 // target.click();
    //             });
    //         }
    //     });

    //     // imageEl.click()
    // }

    return (
        <div className="crop-item">
            {cropped && <img src={cropped} style={{width: "200px"}}/>}

            <Button  label="Загрузить" icon="pi 
                pi-download" size="small"
                onClick={() => saveAs(cropped, 'image.jpg')}/>

            {/* <a id={id} href="#" data-href={cropped} download
                className="pi-download"></a> */}
        </div>
    );
}

export default Croped