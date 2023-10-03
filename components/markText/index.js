import Marker, { ImageFormat, Position, TextBackgroundType } from "react-native-image-marker"


export default async function markText({file, text1, text2}){
  const path = await Marker.markText({
    backgroundImage: {
      src: file.fileCopyUri,
    },
    watermarkTexts: [{
      text: `${text1}`,
      positionOptions: {
        position: Position.topLeft,
      },
      style: {
        color: '#fff',
        fontSize: 14,
        fontName: 'Arial',
        textBackgroundStyle: {
          color: '#0000003d',
        },
      },
    },
    {
      text: `${text2}`,
      positionOptions: {
        position: Position.bottomLeft,
      },
      style: {
        color: '#fff',
        fontSize: 10,
        fontName: 'Arial',
        textBackgroundStyle: {
          color: '#0000003d',
        },
      },
    }
  ],
    scale: 1,
    quality: 100,
    filename: file.name,
    saveFormat: ImageFormat.jpg,
    maxSize: 1000,
  })
  return `file://${path}`;
}