import React, { useRef, useState, useEffect } from 'react';
import './ImageSelect.css';
import { useSmartcrop, SmartcropStatus } from "use-smartcrop";

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
//import '../../index.css';

import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';

import Croped from './Croped/Croped'

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../state'
import { set } from 'react-hook-form';

/*const Store = () => {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}*/


function ImageSelect() {
    const [totalSize, setTotalSize] = useState(0);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);


    const [value1, setValue1] = useState(10);
    const [value2, setValue2] = useState(15);
    const [imagesCroped, setImagesCroped] = useState([])
    // const [imagesCroped, setImgCroped] = useState([])
    const [sizeCroped, setSizeCroped] = useState({ width: 0, height: 0 })


    const onUpload = () => {
        console.log(toast)
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
        console.log(toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' }))
    }

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        e.files.forEach(file => {
            _totalSize += file.size;
        });

        setTotalSize(_totalSize);
    }

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach(file => {
            _totalSize += (file.size || 0);
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    }

    const onTemplateClear = () => {
        setTotalSize(0);
    }

    const onBasicUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }

    const onBasicUploadAuto = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{ width: '300px', height: '20px', marginLeft: 'auto' }}></ProgressBar>
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                {/* <Tag value={props.formatSize} severity="warning" className="px-3 py-2" /> */}
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ 'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ 'fontSize': '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">Drag and Drop Image Here</span>
            </div>
        )
    }

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then(r => r.blob()); //blob:url
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
            console.log(base64data);
        }
    }

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
    ////////

    const [images, setImages] = useState([])
    const [imagesURLs, setImagesURLs] = useState([])


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
        let newImagesCroped = []

        function converter(size, file) {
            //1cm = 37.938105 px
            let orientation = size.width > size.height ? "gorizontal" : "vertical"
            console.log("orientation: ", orientation)

            let ratioInput = Math.max(value1, value2) / Math.min(value1, value2)
            console.log("ratio input: ", ratioInput)
            let ratioPhoto = Math.max(size.width, size.height) / Math.min(size.width, size.height)
            console.log("ratio photo: ", ratioPhoto)
            let minSizeCrop = Math.max(size.width, size.height) / ratioInput
            console.log("Min size crop: ", minSizeCrop)
            let maxSizeCrop = Math.max(size.width, size.height)
            console.log("Max size crop: ", maxSizeCrop)

            console.log("width, px: ", size.width)
            console.log("height, px: ", size.height)

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
        //event.files == files to upload
        console.log(event.files)

        event.files.forEach((file) => {
            //setSrc(file.objectURL)
            let src = file.objectURL

            //console.log("cropped", cropped)

            // var link = document.createElement('a');
            // link.href = cropped
            // link.download = 'Download.jpg';
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);

            // <Croped url={src}/>

            //setImagesCroped(event.files)

            imageSize(src, file)

        })

        function imgsCrops() {
            console.log("imagesCroped", imagesCroped)
        }

        setTimeout(imgsCrops, 1000)
    }

    const ImagesCropedList = () => {

        let src = ''
        // let [cropped, error] = useSmartcrop({ src }, { width: 200, height: 200, minScale: 1.0 });
        // if (error) {
        //     console.error(error);
        // }
        const { hookFunction } = useSmartcrop({ src }, { width: 200, height: 200, minScale: 1.0 });
        const { hookFunctionRef, setHookFunctionRef } = useRef(hookFunction)

        useEffect(()=>{
            console.log("imagesCroped!!!!!", imagesCroped)
            console.log("hookFunctionRef", hookFunctionRef)
        }, [imagesCroped])

        // return (
        //     <>
        //         {imagesCroped.map(img => {
        //             // let [src, setSrc] = useState('');
        //             let src = img.image.objectURL
        //             console.log("src imgCrop: ", src)
        //             // setHookFunctionRef({ src }, { width: img.width, height: img.height, minScale: 1.0 })

        //             return (
        //                 <React.Fragment>
        //                     <img key={img} style={{ width: "200px" }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEga68fN6PGUKOKk4EhcQ33n3dYMLxvrR76ZQChFZMsmSnFp1bp7ePyL0VJCa9vkwy_2s&usqp=CAUg" />
        //                 </React.Fragment>
        //             )
        //         })}
        //         {/* {imagesURLs.map(imageSrc => <img src={cropped} />)} */}
        //     </>
        // )

        /////////////////////!!!/////
        
        const cropphoto = imagesCroped.map((element, index) => {
            console.log("element.file", element.file)
           return (
           <img key={index} style={{ width: "200px" }} 
           src={element.file} />)
        });
     
        return (
        <div>
            <p>123</p>
           {cropphoto}
          
        </div>)

    }
    const MemoizedChildComponent = React.memo(ImagesCropedList);


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
                <h5>Advanced</h5>
                <FileUpload name="demo[]" /*url="./send.php" onUpload={onUpload}*/ multiple accept="image/*" maxFileSize={30000000}
                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                    customUpload uploadHandler={myUploader} />

                {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEga68fN6PGUKOKk4EhcQ33n3dYMLxvrR76ZQChFZMsmSnFp1bp7ePyL0VJCa9vkwy_2s&usqp=CAUg"/> */}
                {/* {cropped && <img src={cropped} />} */}

                {/* <button onClick={()=>{sendFileByEmail(file, email)}}>aaaaaaa</button> */}

                {/* <h5>Template</h5>
          <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/    " multiple accept="image/*" maxFileSize={30000000}
              onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
              headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
              chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} /> */}

                {/* <h5>Basic</h5>
          <FileUpload mode="basic" name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*" maxFileSize={1000000} onUpload={onBasicUpload} />

          <h5>Basic with Auto</h5>
          <FileUpload mode="basic" name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*" maxFileSize={1000000} onUpload={onBasicUploadAuto} auto chooseLabel="Browse" />

          <h5>Custom (base64 encoded)</h5>
          <FileUpload mode="basic" name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*" customUpload uploadHandler={customBase64Uploader} /> */}
            </div>
            
            <MemoizedChildComponent imagesCroped={imagesCroped} />
        </div>
    );
}

export default ImageSelect;
