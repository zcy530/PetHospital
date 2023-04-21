import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

//上传图片

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    // console.log(file)
    reader.readAsDataURL(file);
    // console.log(reader)
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


const ImageUpload: React.FC = (props) => {
  console.log(props);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  // const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (props.defaultImages) {
      const tempFiles: UploadFile[] = props.defaultImages.map((item, i) => {
        return {
          uid: -i,
          name: item,
          url: item
        }
      })
      setFileList(tempFiles);
      triggerChange(tempFiles);
      console.log(fileList)
    }
  }, []);


  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    // console.log(file)
    // console.log(file.url)
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const onRemove = (file: UploadFile) => {

  };

  const triggerChange = (value) => {
    // console.log(value)
    // console.log(value.map(file => (file.url)))
    const prop_value = value.map(file => (file.url))
    props.onChange(prop_value);
  };

  const handleChange: UploadProps['onChange'] = ({ file, fileList }) => {
    // console.log(file); // file 是当前正在上传的 单个 img
    // console.log(fileList); // fileList 是已上传的全部 img 列表
    //把上传好收到success的文件的url更新
    fileList.forEach(imgItem => {
      if (!imgItem.url && imgItem && imgItem.status === 'done' && imgItem.response && imgItem.response.result) {
        imgItem.url = imgItem.response.result;
      }
    });
    setFileList(fileList);
    // console.log(fileList);
    triggerChange(fileList);
  }


  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        action="https://47.120.14.174:443/petHospital/graphs"
        name='graphs'
        listType="picture-card"
        multiple={props.mult}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={onRemove}
      >
        {fileList.length >= props.num ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ImageUpload;
