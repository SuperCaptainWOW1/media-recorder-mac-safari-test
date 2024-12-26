const videoTypesArray = ['mp4', 'webm', 'x-matroska', 'ogg']

// vp9 codec should always be higher in priority than avc1 (causes delayed MediaRecorder start)
// See: https://issues.chromium.org/issues/40842437#comment11
const codecsArray = [
  'should-not-be-supported',

  'h265',
  'h.265',
  'h264',
  'h.264',
  'vp9',
  'vp9.0',
  'vp8',
  'vp8.0',
  'avc1',
  'av1',
  'opus',
  'pcm',
  'aac',
  'mpeg',
  'mp4a',
]

function getSupportedVideoMimeTypes(
  videoTypes,
  codecs,
) {
  const isSupported = MediaRecorder.isTypeSupported
  const supported = []

  videoTypes.forEach((type) => {
    const mimeType = `video/${type}`

    codecs.forEach((codec) =>
      [`${mimeType};codecs=${codec}`, `${mimeType};codecs=${codec.toUpperCase()}`].forEach(
        (variation) => {
          if (isSupported(variation)) supported.push(variation)
        },
      ),
    )

    if (isSupported(mimeType)) supported.push(mimeType)
  })

  return supported
}

export const supportedVideoMimeTypes = getSupportedVideoMimeTypes(videoTypesArray, codecsArray)
