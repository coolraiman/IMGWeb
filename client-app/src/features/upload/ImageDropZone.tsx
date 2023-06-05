import {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';

interface Props {
    setFiles: (files: any) => void;
}

export default function ImageDropZone({setFiles}: Props){
    const dzStyles = {
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        paddingTop: '30px',
        textAlign: 'center' as 'center',
        height: 120
    }

    const dzActive = {
        borderColor: 'green'
    }

    const onDrop = useCallback((acceptedFiles:any) => 
    {
        setFiles(acceptedFiles.map((file:any) => Object.assign(file, 
        {
            preview: URL.createObjectURL(file)
        })))
      }, [setFiles])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/bmp': ['.bmp'],
            'image/webp': ['.webp'],
            'image/svg+xml': ['.svg', '.svgz'],
            'image/tiff': ['.tiff', '.tif'],
            'image/x-icon': ['.ico']
        }
    })

    return(

        <div {...getRootProps()} style={isDragActive ? {...dzStyles, ...dzActive} : dzStyles}>
            <input {...getInputProps()} />
            <Icon name="upload" size='large'/>
            <Header content="Drop image here"/>
        </div>
    )
}