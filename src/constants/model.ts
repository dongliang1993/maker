export const getModelNameByToolName = (toolName: string) => {
  switch (toolName) {
    case 'transformImage':
    case 'createImage':
      return 'GPT Image'
    default:
      return toolName
  }
}
