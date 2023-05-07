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


import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../state'

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

    const onUpload = () => {
        console.log(toast)
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
        console.log(toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'}))
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
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    }

    const onTemplateClear = () => {
        setTotalSize(0);
    }

    const onBasicUpload = () => {
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
    }

    const onBasicUploadAuto = () => {
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode'});
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize/10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{width: '300px', height: '20px', marginLeft: 'auto'}}></ProgressBar>
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{width: '40%'}}>
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
                <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Image Here</span>
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

    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: false, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};
    ////////
    // let src = "";
    let [cropped, error] = useSmartcrop({ src }, { width: 200, height: 300, minScale: 1.0 });
    // if (error) {
    //     console.error(error);
    // }

    const myUploader = (event, file) => {
        //event.files == files to upload
        // console.log(event.files)
        event.files.forEach((file)=>{
            let src = file.objectURL
            // let [cropped, error] = useSmartcrop({ src }, { width: 200, height: 300, minScale: 1.0 });
            if (error) {
                console.error(error);
            }

            let text = JSON.stringify(cropped);
            downloadAsFile(text);
        
            function downloadAsFile(data) {
                let a = document.createElement("a");
                let file = new Blob([data], {type: 'application/json'});
                a.href = URL.createObjectURL(file);
                a.download = "example.txt";
                a.click();
            }

            // const formData = require('form-data');
            // const Mailgun = require('mailgun.js');
            // const mailgun = new Mailgun(formData);
            // const mg = mailgun.client({
            //     username: 'api',
            //     key: '81b8f2b864bb278ea9949cef2acf4de4-102c75d8-8682f0e1',
            // });
            // mg.messages
            //     .create(sandbox6b2063c137a24d1889717efb709b92b4.mailgun.org, {
            //         from: "Mailgun Sandbox <postmaster@sandbox6b2063c137a24d1889717efb709b92b4.mailgun.org>",
            //         to: ["timur.ratseev@gmail.com"],
            //         subject: "Hello",
            //         text: "Testing some Mailgun awesomness!",
            //     })
            //     .then(msg => console.log(msg)) // logs response data
            //     .catch(err => console.log(err)); // logs any error`;

            


            // You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

            // You can send up to 300 emails/day from this sandbox server.
            // Next, you should add your own domain so you can send 10000 emails/month for free.


        })

    }
    /////////

    // let file = "Hallo"
    // let email = "rtimsh@yandex.ru"

    // const sendFileByEmail = (file, email) => {
    //     // create a new XMLHttpRequest object
    //     var xhr = new XMLHttpRequest();
        
    //     // set the request method and URL
    //     xhr.open('POST', '/send-file', true);
        
    //     // set the content type header
    //     xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        
    //     // create a new FormData object
    //     var formData = new FormData();
        
    //     // append the file and email to the form data
    //     formData.append('file', file);
    //     formData.append('email', email);
        
    //     // send the form data
    //     xhr.send(formData);
    // }

  return (
    <div className="ImageSelect">
      <Toast ref={toast}></Toast>

      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <div className="card">
          <h5>Advanced</h5>
          <FileUpload name="demo[]" /*url="./send.php" onUpload={onUpload}*/ multiple accept="image/*" maxFileSize={30000000}
              emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} 
              chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
              customUpload uploadHandler={myUploader}/>

        {cropped && <img src={cropped} />}

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
    </div>
  );
}

export default ImageSelect;
