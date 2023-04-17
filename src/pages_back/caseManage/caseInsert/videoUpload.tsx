import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

//因为是要实现一个在formitem里的自定义组件，所以一定要有value和triggerChange函数，其中value的值会返回到表单当中
const VideoUpload = (props) => {
    console.log(props);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (props.defaultVideos) {
            const tempFiles: UploadFile[] = props.defaultVideos.map((item) => {
                return {
                    uid: item,
                    name: item,
                    url: item
                }
            })
            setFileList(tempFiles);
            console.log(fileList);
        }
    }, []);


    const triggerChange = (value) => {
        // console.log(value)
        // console.log(value.map(file => (file.url)))
        const prop_value = value.map(file => (file.url))
        props.onChange(prop_value);
    };

    const handleChange: UploadProps['onChange'] = ({ file, fileList }) => {
        const { status } = file;
        if (status !== 'uploading') {
            // console.log(file, fileList);
        }
        if (status === 'done') {
            message.success(`${file.name} 上传成功.`);
            file.url = file.response.result;
        } else if (status === 'error') {
            message.error(`${file.name} 上传失败.`);
        }
        setFileList(fileList);
        // console.log(fileList)
        triggerChange(fileList);
    };

    //设置dragger的参数
    const props1 = {
        name: 'videos',
        multiple: true,
        action: 'http://localhost:8080/petHospital/videos',
        onChange: handleChange,
        onDrop(e) {
            // console.log('Dropped files', e.dataTransfer.files);
        },
        fileList: fileList //设置value
    };


    return (
        <div>
            <Dragger {...props1} >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击上传或者拖动视频文件到此区域上传</p>
                <p className="ant-upload-hint">
                    可以上传一个或者多个视频
                </p>
            </Dragger>
            <div>
                {fileList?.map((item, i) => (
                    <video id="playChatVideo" width="150" height="150" style={{ margin: '20' }} controls>
                        <source src={item.url} type="video/mp4"></source>
                    </video>
                ))}
            </div>
        </div>

    )


}

export default VideoUpload;