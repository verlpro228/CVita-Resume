export const exportResumePaperToPdf = async ({ paper, html2canvas, jsPDF, filename }) => {
  if (!paper) throw new Error('paper not found')

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const waitForImages = async (root) => {
    const images = Array.from(root.querySelectorAll('img'))
    await Promise.all(images.map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve()
      return new Promise((resolve) => {
        image.onload = resolve
        image.onerror = resolve
      })
    }))
  }

  const wrapper = document.createElement('div')
  const clone = paper.cloneNode(true)
  const paperWidth = paper.offsetWidth || 794
  const pageRatio = 297 / 210
  const singlePageHeight = Math.round(paperWidth * pageRatio)
  const paperHeight = Math.max(paper.scrollHeight, paper.offsetHeight, singlePageHeight)

  Object.assign(wrapper.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${paperWidth}px`,
    minHeight: `${paperHeight}px`,
    overflow: 'visible',
    background: '#ffffff',
    pointerEvents: 'none',
    zIndex: '-1'
  })

  Object.assign(clone.style, {
    width: `${paperWidth}px`,
    minHeight: `${paperHeight}px`,
    margin: '0',
    transform: 'none',
    boxShadow: 'none'
  })

  clone.querySelectorAll('.avatar, .avatar img').forEach((node) => {
    Object.assign(node.style, {
      borderRadius: '50%',
      overflow: 'hidden',
      clipPath: 'circle(50% at 50% 50%)'
    })
  })

  clone.querySelectorAll('.avatar img').forEach((node) => {
    Object.assign(node.style, {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center center'
    })
  })

  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  await waitForImages(clone)
  await new Promise(resolve => requestAnimationFrame(resolve))
  await new Promise(resolve => requestAnimationFrame(resolve))

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: paperWidth,
      height: paperHeight,
      windowWidth: paperWidth,
      windowHeight: paperHeight,
      scrollX: 0,
      scrollY: 0
    })

    const imageData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const rawImageHeight = (canvas.height * pageWidth) / canvas.width
    const imageHeight = rawImageHeight <= pageHeight + 1 ? pageHeight : rawImageHeight
    let heightLeft = imageHeight
    let position = 0

    pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight)
    heightLeft -= pageHeight

    while (heightLeft > 1) {
      position = heightLeft - imageHeight
      pdf.addPage()
      pdf.addImage(imageData, 'PNG', 0, position, pageWidth, imageHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
  } finally {
    wrapper.remove()
  }
}
