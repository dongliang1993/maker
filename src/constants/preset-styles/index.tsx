// 预设的图片风格
export const PRESET_STYLES = [
  {
    id: 'ghibli',
    name: 'Ghibli',
    prompt: `Transform this image into Studio Ghibli animation style, maintaining the original composition but adding Ghibli's characteristic soft, hand-drawn aesthetic, watercolor-like backgrounds, and whimsical atmosphere. Use Hayao Miyazaki's distinctive art style with attention to natural elements and environmental details. Keep the same scene and action but render it as if it were a frame from a Ghibli film.`,
    url: 'https://fal.media/files/kangaroo/8MHj2aAmP9RwubRAEyE_v_4bea32b51f8745a7acab484aa1a558f3.png',
  },
]

type Style = (typeof PRESET_STYLES)[number]

export type { Style }
