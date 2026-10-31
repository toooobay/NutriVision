import UploadArea from '../UploadArea'

export default function UploadAreaExample() {
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name)
  }

  return <UploadArea onFileUpload={handleFileUpload} />
}