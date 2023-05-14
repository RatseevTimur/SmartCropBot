import React, { useRef, useState, useEffect } from 'react';
import './ImageSelect.css';
//import '../../index.css';

import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import Croped from './Croped/Croped'


function ImageSelect() {
    const toast = useRef(null);
    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
    ////////
    const [value1, setValue1] = useState(10);
    const [value2, setValue2] = useState(15);
    const [imagesCroped, setImagesCroped] = useState([])

    let newImagesCroped = []
    function imageSize(src, file) {
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

        let fileCroped = {}
        let sizeCroped = {}

        function converter(size, file) {
            //1cm = 37.938105 px
            let orientation = size.width > size.height ? "gorizontal" : "vertical"
            // console.log("orientation: ", orientation)

            let ratioInput = Math.max(value1, value2) / Math.min(value1, value2)
            // console.log("ratio input: ", ratioInput)
            let ratioPhoto = Math.max(size.width, size.height) / Math.min(size.width, size.height)
            // console.log("ratio photo: ", ratioPhoto)
            let minSizeCrop = Math.max(size.width, size.height) / ratioInput
            // console.log("Min size crop: ", minSizeCrop)
            let maxSizeCrop = Math.max(size.width, size.height)
            // console.log("Max size crop: ", maxSizeCrop)

            // console.log("width, px: ", size.width)
            // console.log("height, px: ", size.height)

            // console.log("w/h: ", size.width/size.height)

            // console.log("width, cm: ", size.width/37.938105)
            // console.log("height, cm: ", size.height/37.938105)
            if (orientation == "gorizontal") {
                sizeCroped = { width: maxSizeCrop, height: minSizeCrop }
            }
            else {
                sizeCroped = { width: minSizeCrop, height: maxSizeCrop }
            }
            fileCroped = {
                image: file,
                width: sizeCroped.width,
                height: sizeCroped.height
            }
            console.log("fileCroped", fileCroped)

            newImagesCroped.push(fileCroped)
            console.log("newImagesCroped!!!!", newImagesCroped)
            setImagesCroped(newImagesCroped)
        }

        promise.then(value => converter(value, file))
    }

    const myUploader = (event) => {
        // console.log(event.files)
        event.files.forEach((file) => {
            //setSrc(file.objectURL)
            let src = file.objectURL
            imageSize(src, file)
        })

        // function imgsCrops() {
        //     console.log("imagesCroped", imagesCroped)
        //     // console.log("imagesCroped[0]", imagesCroped[0].image.objectURL)
        //    // objectURL
        // }

        // // setTimeout(imgsCrops, 1000)
        // console.log("imagesCroped", imagesCroped)
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    ////
    // const ImagesCropedList = () => {
        
    //     const cropphoto = imagesCroped.map((element, index) => {
    //        return (
    //         <div key={index}>
    //             <Croped url={element.image.objectURL} width={element.width} height={element.height}
    //             id={index}/>
    //         </div>
            
    //        )
    //     });
     
    //     return (
    //     <div>
    //        {cropphoto}
    //     </div>)

    // }
    ////

    const ImagesCropedList = () => {

        document.getElementById("ImageListItem")
        
        return (
        
            <ImageList sx={{ width: "100%", height: 500 }} cols={3} rowHeight={164}>
                {imagesCroped.map((element, index) => (
                    <ImageListItem id="ImageListItem" key={index} className='image-list-item'>
                    
                        <Croped url={element.image.objectURL} width={element.width} height={element.height}
                            id={index}/>

                    </ImageListItem>
                ))}
            </ImageList>
            
        )

    }

    return (
        <div className="ImageSelect">

            <div className="grid">
                <div className="field col-12 md:col-3">
                    <label htmlFor="vertical" style={{ display: 'block' }}>Соотношение</label>
                    <div style={{ display: "flex", textAlign: "center" }}>
                        <InputNumber inputId="vertical" value={value1} onValueChange={(e) => setValue1(e.value)} mode="decimal" showButtons buttonLayout="vertical" style={{ width: '4rem' }}
                            decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />

                        <InputNumber inputId="vertical" value={value2} onValueChange={(e) => setValue2(e.value)} mode="decimal" showButtons buttonLayout="vertical" style={{ width: '4rem' }}
                            decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                    </div>
                </div>
            </div>

            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <div className="card">
                <h5>Умная обрезка</h5>
                <FileUpload name="demo[]" /*url="./send.php" onUpload={onUpload}*/ multiple accept="image/*" maxFileSize={30000000}
                    emptyTemplate={<p className="m-0">Перетащите сюда файлы для загрузки.</p>}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                    customUpload uploadHandler={myUploader} />
            </div>
            
            <div>
                <ImagesCropedList imagesCroped={imagesCroped}/> 
            </div>
        
        </div>
    );
}

export default ImageSelect;
